---
name: publish-guidelines
description: Publish component guideline Markdown content into Prism docs pages and i18n strings using a repeatable mapping workflow. Use when the user asks to sync/update/publish guideline MD files to website component pages.
disable-model-invocation: true
---

# Publish Guidelines

Use this skill to publish guideline content from Markdown into the docs site with consistent mappings.

## Scope

- Source: guideline Markdown files from `/Users/cameronfoster/Documents/Codex/prism-component-guidelines` (for example, generated component guideline drafts).
- Targets:
  - `apps/docs/src/pages/components/*.astro`
  - `apps/docs/src/i18n/ui.ts`
- Output: published docs page content + matching EN/ZH i18n keys.

## Inputs

- Component name and slug (for example, `Accordion`, `accordion`)
- Source Markdown path (resolve from `/Users/cameronfoster/Documents/Codex/prism-component-guidelines` by default)
- Target Astro page path
- Whether to update:
  - content only
  - content + metadata (`version`, `last updated`)
  - content + metadata + structural sections

## Required workflow

1. **Read source and targets**
   - Find and read the guideline Markdown from `/Users/cameronfoster/Documents/Codex/prism-component-guidelines` first. If multiple candidates exist, choose the best slug/component-name match.
   - Read the target component page.
   - Read `apps/docs/src/i18n/ui.ts`.

2. **Extract source sections**
   - Parse metadata fields (if present): `Version`, `Author`, `Last updated`.
   - Parse sections:
     - Overview
     - ✅ When to use
     - 🚫 When not to use
     - Spec/tables (variants, anatomy, behavior)
     - Usage do/don't
     - Accessibility (keyboard + screen reader)
     - Related components

3. **Apply mapping contract**
   - Preserve existing page layout and interactive examples unless the user asks for structural changes.
   - Update visible content in the Astro page.
   - Ensure every new/updated `data-i18n` key has EN and ZH entries in `ui.ts`.
   - Avoid orphan keys: if a key is removed from page markup, remove or flag it in `ui.ts`.

4. **Bilingual guarantee**
   - EN values should reflect source content.
   - ZH values should be added for all new keys (clear, concise product Chinese).
   - Do not leave fallback English text in the page for i18n-managed blocks.

5. **Validate**
   - Run lints on changed files.
   - If docs server is requested/needed, run:
     - `npm run docs:up:fixed`
   - Confirm route loads (for example, `/components/{slug}`).

6. **Report**
   - Summarize mappings applied (MD section -> page/i18n target).
   - List changed files.
   - Call out ambiguities and any assumptions.

## Mapping contract (default)

Use this baseline unless component-specific mappings override it:

- `Version` -> `components.{slug}.version` + version badge text
- Intro sentence -> `components.{slug}.intro`
- Overview headings/body -> `components.{slug}.overview.*`
- Design tab sections -> `components.{slug}.design.*`
- Accessibility tab sections -> `components.{slug}.accessibility.*`

Keep key naming flat and predictable:

- Headings: `...H2`, `...H3`
- Table labels: `...col*`, `...tableAria`
- Table rows: `...<row>.{requirement|behavior|guidance|description}`

## Safety rules

- Do not overwrite existing demos unless requested.
- Do not silently delete major sections; if source is missing a section, ask before removing.
- Do not edit unrelated components.
- Do not commit unless explicitly asked.

## Quick publish checklist

- [ ] Source Markdown read
- [ ] Target Astro page updated
- [ ] EN keys updated in `ui.ts`
- [ ] ZH keys added/updated in `ui.ts`
- [ ] Lint clean
- [ ] Route verified in browser/dev server

