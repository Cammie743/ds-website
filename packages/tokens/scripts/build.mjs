import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const src = join(root, "src", "tokens-source.json");
const outDir = join(root, "dist");
const outCss = join(outDir, "tokens.css");
const outJson = join(outDir, "tokens.json");

function flatten(obj, prefix = "") {
  const entries = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}-${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      entries.push(...flatten(v, key));
    } else {
      entries.push([key, v]);
    }
  }
  return entries;
}

const raw = JSON.parse(await readFile(src, "utf8"));
const { meta, ...rest } = raw;
const flat = flatten(rest);
const lines = flat.map(([k, v]) => `  --prism-${k}: ${typeof v === "string" ? v : JSON.stringify(v)};`);

const css = `/**
 * ${meta.name} design tokens
 * Generated — do not edit by hand.
 */
:root {
${lines.join("\n")}
}

[data-theme="dark"] {
  --prism-color-canvas: #0b0d12;
  --prism-color-canvas-inverse: #f6f7fb;
  --prism-color-surface: #12151c;
  --prism-color-surface-raised: #181c26;
  --prism-color-surface-muted: #1b212d;
  --prism-color-border-subtle: #2a3040;
  --prism-color-border-strong: #3d4458;
  --prism-color-text-primary: #f6f7fb;
  --prism-color-text-secondary: #b4bac8;
  --prism-color-text-inverse: #0b0d12;
  --prism-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.35);
  --prism-shadow-md: 0 8px 24px rgba(0, 0, 0, 0.45);
  --prism-shadow-lg: 0 24px 48px rgba(0, 0, 0, 0.55);
}

[data-theme="bloom"] {
  --prism-color-canvas: #f5f8fc;
  --prism-color-canvas-inverse: #0e1622;
  --prism-color-surface: #ffffff;
  --prism-color-surface-raised: #fafcfe;
  --prism-color-surface-muted: #edf3fa;
  --prism-color-border-subtle: #e1eaf5;
  --prism-color-border-strong: #c6d4e8;
  --prism-color-text-primary: #101826;
  --prism-color-text-secondary: #546178;
  --prism-color-text-inverse: #f7f9fc;
  --prism-color-accent: #4d9fff;
  --prism-color-accent-strong: #2271df;
  --prism-color-success: #0d9d63;
  --prism-color-warning: #e68600;
  --prism-color-error: #d93025;
  --prism-shadow-sm: 0 1px 3px rgba(20, 40, 72, 0.04);
  --prism-shadow-md: 0 12px 32px rgba(20, 40, 72, 0.06);
  --prism-shadow-lg: 0 28px 56px rgba(20, 40, 72, 0.08);
}

[data-theme="agave"] {
  --prism-color-canvas: #f4faf7;
  --prism-color-canvas-inverse: #0a1814;
  --prism-color-surface: #ffffff;
  --prism-color-surface-raised: #f9fcfb;
  --prism-color-surface-muted: #eaf5f0;
  --prism-color-border-subtle: #dceee6;
  --prism-color-border-strong: #bed9cd;
  --prism-color-text-primary: #0f1e19;
  --prism-color-text-secondary: #4d625c;
  --prism-color-text-inverse: #f4faf7;
  --prism-color-accent: #3dc49f;
  --prism-color-accent-strong: #0c8665;
  --prism-color-success: #0d9d63;
  --prism-color-warning: #e68600;
  --prism-color-error: #d93025;
  --prism-shadow-sm: 0 1px 3px rgba(14, 48, 40, 0.04);
  --prism-shadow-md: 0 12px 32px rgba(14, 48, 40, 0.06);
  --prism-shadow-lg: 0 28px 56px rgba(14, 48, 40, 0.08);
}

[data-theme="rose"] {
  --prism-color-canvas: #fcf9f9;
  --prism-color-canvas-inverse: #1a1112;
  --prism-color-surface: #ffffff;
  --prism-color-surface-raised: #fffbfb;
  --prism-color-surface-muted: #f7f0f2;
  --prism-color-border-subtle: #ebe0e2;
  --prism-color-border-strong: #dacbcd;
  --prism-color-text-primary: #221a1b;
  --prism-color-text-secondary: #645558;
  --prism-color-text-inverse: #fcf9f9;
  --prism-color-accent: #ec7a85;
  --prism-color-accent-strong: #ca4754;
  --prism-color-success: #0d9d63;
  --prism-color-warning: #e68600;
  --prism-color-error: #d93025;
  --prism-shadow-sm: 0 1px 3px rgba(52, 28, 32, 0.04);
  --prism-shadow-md: 0 12px 32px rgba(52, 28, 32, 0.06);
  --prism-shadow-lg: 0 28px 56px rgba(52, 28, 32, 0.08);
}
`;

await mkdir(outDir, { recursive: true });
await writeFile(outCss, css, "utf8");
await writeFile(outJson, JSON.stringify({ meta, tokens: Object.fromEntries(flat) }, null, 2), "utf8");
console.log("Wrote", outCss, "and", outJson);
