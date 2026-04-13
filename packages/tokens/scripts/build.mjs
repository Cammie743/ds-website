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
  --prism-color-canvas: #faf5fb;
  --prism-color-canvas-inverse: #1a0f18;
  --prism-color-surface: #fffcfe;
  --prism-color-surface-raised: #fff8fc;
  --prism-color-border-subtle: #f0e3ef;
  --prism-color-border-strong: #dcc6d8;
  --prism-color-text-primary: #241022;
  --prism-color-text-secondary: #5c5160;
  --prism-color-text-inverse: #faf5fb;
  --prism-color-accent: #d946b8;
  --prism-color-accent-strong: #b03092;
  --prism-color-success: #0d9d63;
  --prism-color-warning: #e68600;
  --prism-color-error: #d93025;
  --prism-shadow-sm: 0 1px 3px rgba(55, 20, 50, 0.05);
  --prism-shadow-md: 0 12px 32px rgba(55, 20, 50, 0.07);
  --prism-shadow-lg: 0 28px 56px rgba(55, 20, 50, 0.09);
}

[data-theme="agave"] {
  --prism-color-canvas: #f2faf7;
  --prism-color-canvas-inverse: #061a15;
  --prism-color-surface: #ffffff;
  --prism-color-surface-raised: #f7fcfa;
  --prism-color-border-subtle: #d7ebe4;
  --prism-color-border-strong: #b3d4c8;
  --prism-color-text-primary: #0c1f1a;
  --prism-color-text-secondary: #4a6560;
  --prism-color-text-inverse: #f2faf7;
  --prism-color-accent: #1aaf8b;
  --prism-color-accent-strong: #0d8f70;
  --prism-color-success: #0d9d63;
  --prism-color-warning: #e68600;
  --prism-color-error: #d93025;
  --prism-shadow-sm: 0 1px 3px rgba(12, 45, 38, 0.05);
  --prism-shadow-md: 0 12px 32px rgba(12, 45, 38, 0.07);
  --prism-shadow-lg: 0 28px 56px rgba(12, 45, 38, 0.09);
}

[data-theme="rose"] {
  --prism-color-canvas: #fcf6f6;
  --prism-color-canvas-inverse: #1a0d0d;
  --prism-color-surface: #fffdfd;
  --prism-color-surface-raised: #fff8f8;
  --prism-color-border-subtle: #f0dede;
  --prism-color-border-strong: #e0c4c4;
  --prism-color-text-primary: #281818;
  --prism-color-text-secondary: #6e5757;
  --prism-color-text-inverse: #fcf6f6;
  --prism-color-accent: #e05858;
  --prism-color-accent-strong: #c43a3a;
  --prism-color-success: #0d9d63;
  --prism-color-warning: #e68600;
  --prism-color-error: #d93025;
  --prism-shadow-sm: 0 1px 3px rgba(50, 20, 20, 0.05);
  --prism-shadow-md: 0 12px 32px rgba(50, 20, 20, 0.07);
  --prism-shadow-lg: 0 28px 56px rgba(50, 20, 20, 0.09);
}
`;

await mkdir(outDir, { recursive: true });
await writeFile(outCss, css, "utf8");
await writeFile(outJson, JSON.stringify({ meta, tokens: Object.fromEntries(flat) }, null, 2), "utf8");
console.log("Wrote", outCss, "and", outJson);
