# Prism Design System Website

This repository contains the Prism design system documentation site, a small reference web app, and the shared token package they both consume.

## Repository Structure

```text
ds-website/
  apps/
    docs/           Main Astro documentation site.
    reference-web/  Small visual QA and reference gallery.
  packages/
    tokens/         Source tokens plus generated CSS and JSON outputs.
  scripts/          Local helper scripts for running and stopping docs.
```

## Common Commands

Run commands from the repository root.

```sh
npm run dev
```

Build tokens, then start the docs site on `http://127.0.0.1:4321/`.

```sh
npm run docs:dev
```

Start only the docs Astro dev server.

```sh
npm run docs:up
```

Start the docs site with the local helper script. If port `4321` is busy, the script will try nearby ports.

```sh
npm run build
```

Build tokens and all workspace apps.

```sh
npm run figma:sync
```

Refresh any website images listed in `apps/docs/figma-images.json` from Figma. The command needs `FIGMA_SYNC_ENABLED=1`
and `FIGMA_TOKEN` with Figma file read access. Without those env vars, normal local and CI builds skip the sync.

## Where Things Live

Docs routes live in `apps/docs/src/pages`. Astro's file-based routing maps these files directly to URLs, so keep route filenames stable unless you intend to change the site URL.

Section layouts live in `apps/docs/src/layouts`. Use these when adding pages to `get-started`, `foundations`, `components`, `resources`, or `articles`.

Shared docs UI components live in `apps/docs/src/components`.

Shared navigation metadata lives in `apps/docs/src/data/navigation.ts`.

Article slug and date mapping lives in `apps/docs/src/data/articleUpdates.ts`.

Localized UI copy lives in `apps/docs/src/i18n`.

Global CSS is split by responsibility in `apps/docs/src/styles`:

- `global.css` imports the shared style modules.
- `base.css` contains resets and element defaults.
- `chrome.css` contains page background and theme chrome.
- `typography.css` contains docs type scale and shared text styles.
- `doc-patterns.css` contains reusable docs content patterns.

Static docs assets live in `apps/docs/public`. Keep images grouped by site area, such as `images/components`, `images/foundations`, and `images/articles`.

Design token source lives in `packages/tokens/src/tokens-source.json`. Generated token files are written to `packages/tokens/dist` by `npm run tokens:build`.

## Figma-Synced Guideline Images

Guideline images can be sourced from Figma at build time. Add each exported Figma node to
`apps/docs/figma-images.json`, with the Figma `fileKey`, `nodeId`, export `format`, and the local `output` path under
`apps/docs/public`.

The accordion core anatomy image is currently mapped to:

```json
{
  "fileKey": "QLF4juvNzgiujkBhlX5MqT",
  "nodeId": "2590:4616",
  "output": "public/images/components/accordion/core-anatomy.png"
}
```

To enable automatic updates on Vercel:

1. Add `FIGMA_TOKEN` to the Vercel project environment. The token needs access to read the Figma file.
2. Add `FIGMA_SYNC_ENABLED=1` to the Vercel project environment.
3. Add `FIGMA_WEBHOOK_PASSCODE` to the Vercel project environment. Use a long random value.
4. Add `FIGMA_WEBHOOK_FILE_KEY=QLF4juvNzgiujkBhlX5MqT` to the Vercel project environment.
5. Create a Vercel deploy hook for the docs project and save it as `VERCEL_DEPLOY_HOOK_URL`.
6. Deploy once so `/api/figma-webhook` is live.
7. Create the Figma webhook with the website endpoint:

```sh
FIGMA_TOKEN="..." \
FIGMA_WEBHOOK_ENDPOINT="https://ds-website-pds.vercel.app/api/figma-webhook" \
FIGMA_WEBHOOK_PASSCODE="choose-a-secret" \
npm run figma:webhook:create
```

By default this creates a `FILE_UPDATE` webhook for the Figma file in the manifest, so Figma updates trigger a rebuild
after editing inactivity. Set `FIGMA_WEBHOOK_EVENT_TYPE=FILE_VERSION_UPDATE` if you want the website to update only when
someone creates a named Figma version.

## Adding A Component Page

1. Add the Astro page under `apps/docs/src/pages/components`.
2. Use `ComponentsLayout.astro` and set the `current` prop to the matching navigation id.
3. Add or update the component entry in `apps/docs/src/data/navigation.ts`.
4. Add preview or anatomy images under `apps/docs/public/images/components/{component-name}`.
5. Run `npm run build` before publishing changes.

## Adding An Article

1. Add article metadata and slug mapping in `apps/docs/src/data/articleUpdates.ts` when the article belongs to the update system.
2. Add copy strings in `apps/docs/src/i18n/ui.ts`.
3. Add article media under `apps/docs/public/images/articles`.
4. Confirm the generated route with `npm run build`.

## Tokens

Edit only `packages/tokens/src/tokens-source.json` by hand. Then run:

```sh
npm run tokens:build
npm run tokens:check
```

The token package exports generated CSS and JSON for workspace apps.
