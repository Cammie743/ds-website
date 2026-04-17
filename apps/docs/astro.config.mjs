import { defineConfig } from "astro/config";

export default defineConfig({
  compressHTML: true,
  // Bind IPv4 loopback explicitly so Chrome can load the site when `localhost` resolves to ::1 first (common on macOS).
  // Static builds still use `/…` URLs — do not open `dist/index.html` via file://; use dev or preview instead.
  server: {
    host: "127.0.0.1",
    port: 4321,
    strictPort: false,
    open: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 4321,
    strictPort: false,
  },
});
