import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifestPath = path.resolve(process.env.FIGMA_IMAGE_MANIFEST || path.join(appRoot, "figma-images.json"));
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const firstAsset = manifest.assets?.[0];

const figmaToken =
  process.env.FIGMA_TOKEN || process.env.FIGMA_ACCESS_TOKEN || process.env.FIGMA_PERSONAL_ACCESS_TOKEN || "";
const endpoint = process.env.FIGMA_WEBHOOK_ENDPOINT || "";
const passcode = process.env.FIGMA_WEBHOOK_PASSCODE || "";
const eventType = process.env.FIGMA_WEBHOOK_EVENT_TYPE || "FILE_UPDATE";
const contextId = process.env.FIGMA_WEBHOOK_CONTEXT_ID || firstAsset?.fileKey || "";
const description = process.env.FIGMA_WEBHOOK_DESCRIPTION || "Prism guideline image sync";

const missing = [];
if (!figmaToken) missing.push("FIGMA_TOKEN");
if (!endpoint) missing.push("FIGMA_WEBHOOK_ENDPOINT");
if (!passcode) missing.push("FIGMA_WEBHOOK_PASSCODE");
if (!contextId) missing.push("FIGMA_WEBHOOK_CONTEXT_ID");

if (missing.length > 0) {
  throw new Error(`[figma:webhook:create] Missing required env var${missing.length === 1 ? "" : "s"}: ${missing.join(", ")}`);
}

const response = await fetch("https://api.figma.com/v2/webhooks", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Figma-Token": figmaToken,
  },
  body: JSON.stringify({
    context: "file",
    context_id: contextId,
    description,
    endpoint,
    event_type: eventType,
    passcode,
    status: "ACTIVE",
  }),
});

const text = await response.text();

if (!response.ok) {
  throw new Error(`[figma:webhook:create] Figma webhook creation failed: ${response.status} ${text}`);
}

console.log("[figma:webhook:create] Created Figma webhook:");
console.log(JSON.stringify(JSON.parse(text), null, 2));
