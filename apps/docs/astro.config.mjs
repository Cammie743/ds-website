import { defineConfig } from "astro/config";
import { execFile } from "node:child_process";

/** Resolve a stable loopback URL for opening in the browser. */
function resolveLocalUrl(server) {
  const first = server.resolvedUrls?.local?.[0];
  if (first) return first;

  const addr = server.httpServer?.address();
  if (addr && typeof addr === "object") {
    const raw = addr.address;
    const host =
      raw === "::" || raw === "::1" || raw === "0.0.0.0" ? "127.0.0.1" : raw === "127.0.0.1" ? "127.0.0.1" : raw;
    const port = addr.port;
    if (port) return `http://${host}:${port}/`;
  }

  const port = server.config?.server?.port ?? 4321;
  return `http://127.0.0.1:${port}/`;
}

/**
 * Vite's `server.open: "Google Chrome"` often fails silently on macOS.
 * After listen, run the system `open` command (bundle id, then app name).
 */
function macOpenChromeOnListen() {
  return {
    name: "prism-mac-open-chrome",
    configureServer(server) {
      server.httpServer?.once("listening", () => {
        tryOpenChromeInBrowser(server);
      });
    },
    configurePreviewServer(server) {
      server.httpServer?.once("listening", () => {
        tryOpenChromeInBrowser(server);
      });
    },
  };
}

function tryOpenChromeInBrowser(server) {
  if (process.platform !== "darwin") return;

  setTimeout(() => {
    const url = resolveLocalUrl(server);
    const attempts = [
      ["-b", "com.google.Chrome", url],
      ["-a", "Google Chrome", "-u", url],
    ];

    const run = (i) => {
      if (i >= attempts.length) {
        console.warn(`[@prism/docs] Could not open Google Chrome. Open manually:\n  ${url}`);
        return;
      }
      execFile("open", attempts[i], (err) => {
        if (err) run(i + 1);
        else console.log(`[@prism/docs] Opened Google Chrome → ${url}`);
      });
    };
    run(0);
  }, 500);
}

export default defineConfig({
  compressHTML: true,
  // Bind IPv4 loopback explicitly so Chrome can load when `localhost` resolves to ::1 first (common on macOS).
  // Static builds still use `/…` URLs — do not open `dist/index.html` via file://; use dev or preview instead.
  vite: {
    plugins: [macOpenChromeOnListen()],
  },
  server: {
    host: "127.0.0.1",
    port: 4321,
    strictPort: false,
    // macOS: Chrome is opened by `prism-mac-open-chrome` (Vite's `open` string is unreliable here).
    open: process.platform === "darwin" ? false : true,
  },
  preview: {
    host: "127.0.0.1",
    port: 4321,
    strictPort: false,
  },
});
