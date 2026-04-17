/** Blog update post id (URL segment) and its i18n index `home.updates.{n}.*` / `blog.update.{n}.body` (update 1 uses `blog.update.1.section.*`, `blog.update.1.sub.comp.*`, `blog.update.1.p.comp.*`, `blog.update.1.p.icons`, `blog.update.1.p.tokens`). */
export type BlogUpdateN = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const BLOG_UPDATE_SLUG_BY_N: Record<BlogUpdateN, string> = {
  1: "update-april-2026",
  2: "update-home-navigation",
  3: "update-theme-previews",
  4: "update-foundations-ia",
  5: "update-search-docs",
  6: "update-usage-metrics",
  7: "update-a11y-checklist",
};
