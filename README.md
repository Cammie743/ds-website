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
