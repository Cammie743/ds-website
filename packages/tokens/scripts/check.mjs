import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cssPath = join(__dirname, "..", "dist", "tokens.css");
const jsonPath = join(__dirname, "..", "dist", "tokens.json");

let failed = false;
for (const p of [cssPath, jsonPath]) {
  try {
    const s = await readFile(p, "utf8");
    if (!s.trim()) throw new Error("empty file");
  } catch (e) {
    console.error("tokens:check failed:", p, e.message);
    failed = true;
  }
}

if (failed) {
  console.error("Run npm run tokens:build first.");
  process.exit(1);
}

const css = await readFile(cssPath, "utf8");
if (!css.includes(":root") || !css.includes("--prism-color-accent")) {
  console.error("tokens:check: unexpected CSS output");
  process.exit(1);
}

console.log("tokens:check ok");
