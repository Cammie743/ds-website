import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifestPath = path.resolve(process.env.FIGMA_IMAGE_MANIFEST || path.join(appRoot, "figma-images.json"));
const figmaToken =
  process.env.FIGMA_TOKEN || process.env.FIGMA_ACCESS_TOKEN || process.env.FIGMA_PERSONAL_ACCESS_TOKEN || "";

const required = isTruthy(process.env.FIGMA_SYNC_REQUIRED);
const enabled = required || isTruthy(process.env.FIGMA_SYNC_ENABLED);
const dryRun = isTruthy(process.env.FIGMA_SYNC_DRY_RUN);
const selectedAssetIds = parseSelectedAssetIds(process.argv.slice(2));

if (!enabled) {
  console.log("[figma:sync] Skipping Figma image sync because FIGMA_SYNC_ENABLED is not set.");
  process.exit(0);
}

if (!figmaToken) {
  const message = "[figma:sync] Cannot run Figma image sync because FIGMA_TOKEN is not set.";
  throw new Error(`${message} Set FIGMA_TOKEN or unset FIGMA_SYNC_ENABLED.`);
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const assets = normalizeAssets(manifest.assets).filter((asset) => {
  return selectedAssetIds.size === 0 || selectedAssetIds.has(asset.id);
});

if (assets.length === 0) {
  const selected = [...selectedAssetIds].join(", ");
  throw new Error(`[figma:sync] No Figma image assets matched${selected ? `: ${selected}` : "."}`);
}

let changedCount = 0;

for (const asset of assets) {
  const renderedImageUrl = await getRenderedImageUrl(asset);
  const imageBytes = Buffer.from(await downloadArrayBuffer(renderedImageUrl));
  const outputPath = path.resolve(appRoot, asset.output);

  if (!outputPath.startsWith(`${appRoot}${path.sep}`)) {
    throw new Error(`[figma:sync] Refusing to write outside docs app: ${asset.output}`);
  }

  if (await fileMatches(outputPath, imageBytes)) {
    console.log(`[figma:sync] ${asset.id} unchanged -> ${path.relative(appRoot, outputPath)}`);
    continue;
  }

  changedCount += 1;

  if (dryRun) {
    console.log(`[figma:sync] ${asset.id} would update -> ${path.relative(appRoot, outputPath)}`);
    continue;
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, imageBytes);
  console.log(`[figma:sync] ${asset.id} updated -> ${path.relative(appRoot, outputPath)}`);
}

console.log(`[figma:sync] Done. ${changedCount} asset${changedCount === 1 ? "" : "s"} updated.`);

async function getRenderedImageUrl(asset) {
  const url = new URL(`/v1/images/${asset.fileKey}`, "https://api.figma.com");
  url.searchParams.set("ids", asset.nodeId);
  url.searchParams.set("format", asset.format);
  if (asset.scale) url.searchParams.set("scale", String(asset.scale));

  const response = await fetchWithRetries(url, {
    headers: {
      "X-Figma-Token": figmaToken,
    },
  });

  if (!response.ok) {
    throw new Error(`[figma:sync] Figma render request failed for ${asset.id}: ${response.status} ${await response.text()}`);
  }

  const body = await response.json();
  const renderedImageUrl = body.images?.[asset.nodeId];

  if (!renderedImageUrl) {
    const err = body.err ? ` ${body.err}` : "";
    throw new Error(`[figma:sync] Figma did not return an image URL for ${asset.id}.${err}`);
  }

  return renderedImageUrl;
}

async function downloadArrayBuffer(url) {
  const response = await fetchWithRetries(url);

  if (!response.ok) {
    throw new Error(`[figma:sync] Image download failed: ${response.status} ${await response.text()}`);
  }

  return response.arrayBuffer();
}

async function fetchWithRetries(url, options = {}) {
  const retryableStatuses = new Set([408, 429, 500, 502, 503, 504]);
  let lastError;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (!retryableStatuses.has(response.status) || attempt === 2) return response;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
      if (attempt === 2) throw error;
    }

    await wait(500 * 2 ** attempt);
  }

  throw lastError;
}

async function fileMatches(filePath, nextBytes) {
  try {
    const currentBytes = await readFile(filePath);
    return sha256(currentBytes) === sha256(nextBytes);
  } catch (error) {
    if (error && error.code === "ENOENT") return false;
    throw error;
  }
}

function normalizeAssets(assets) {
  if (!Array.isArray(assets)) {
    throw new Error("[figma:sync] figma-images.json must contain an assets array.");
  }

  return assets.map((asset) => {
    const normalized = {
      id: assertString(asset.id, "id"),
      fileKey: assertString(asset.fileKey, "fileKey"),
      nodeId: assertString(asset.nodeId, "nodeId").replace("-", ":"),
      format: asset.format || "png",
      output: assertString(asset.output, "output"),
      scale: asset.scale,
    };

    if (!["png", "jpg", "svg", "pdf"].includes(normalized.format)) {
      throw new Error(`[figma:sync] Unsupported format for ${normalized.id}: ${normalized.format}`);
    }

    return normalized;
  });
}

function assertString(value, field) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`[figma:sync] Each asset must include a non-empty ${field}.`);
  }
  return value;
}

function parseSelectedAssetIds(args) {
  const selected = new Set();

  for (const arg of args) {
    if (arg.startsWith("--asset=")) {
      selected.add(arg.slice("--asset=".length));
    }
  }

  return selected;
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTruthy(value) {
  return value === "1" || value === "true" || value === "yes";
}
