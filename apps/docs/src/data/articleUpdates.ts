/** Stable post id (DOM / `ArticleUpdateArticle` `id` prop) and legacy `/article/update/{id}` segment. Maps to i18n `home.updates.{n}.*` / `article.update.{n}.body`. */
export type ArticleUpdateN = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const BLOG_UPDATE_SLUG_BY_N: Record<ArticleUpdateN, string> = {
  1: "update-april-2026",
  2: "update-home-navigation",
  3: "update-theme-previews",
  4: "update-foundations-ia",
  5: "update-search-docs",
  6: "update-usage-metrics",
  7: "update-a11y-checklist",
  8: "update-prism-skill-library",
};

/** Calendar year for permalink grouping (`/articles/{year}/…`), aligned with each post’s published date. */
export const BLOG_UPDATE_PUBLISHED_YEAR_BY_N: Record<ArticleUpdateN, string> = {
  1: "2026",
  2: "2026",
  3: "2026",
  4: "2026",
  5: "2026",
  6: "2025",
  7: "2025",
  8: "2026",
};

/**
 * ISO calendar date (`YYYY-MM-DD`) for posts that use the monthly-release URL pattern
 * `/articles/{year}/{month}-release` (e.g. `2026-04-17` → `april-release` under `2026`).
 */
export const BLOG_UPDATE_MONTHLY_RELEASE_ISO_DATE_BY_N: Partial<Record<ArticleUpdateN, string>> = {
  1: "2026-04-17",
};

const EN_MONTH_SLUGS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;

/** `/articles/{year}/{return}` for a monthly release from its published date. */
export function monthlyReleaseUrlSlugFromIsoDate(isoDate: string): string {
  const month = Number(isoDate.slice(5, 7));
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error(`Invalid monthly-release ISO date (expected YYYY-MM-DD): ${isoDate}`);
  }
  return `${EN_MONTH_SLUGS[month - 1]}-release`;
}

type ArticleUpdateNonMonthly = Exclude<ArticleUpdateN, 1>;

/** URL segment for non–monthly-release posts under `/articles/{year}/…`. */
export const BLOG_UPDATE_URL_SLUG_BY_N: Record<ArticleUpdateNonMonthly, string> = {
  2: "home-and-navigation-refresh",
  3: "theme-previews-across-the-site",
  4: "foundations-and-components-ia",
  5: "search-across-documentation",
  6: "component-usage-metrics",
  7: "accessibility-audit-checklist",
  8: "prism-skill-library",
};

export function getArticleUpdateUrlSlug(updateN: ArticleUpdateN): string {
  const iso = BLOG_UPDATE_MONTHLY_RELEASE_ISO_DATE_BY_N[updateN];
  if (iso) return monthlyReleaseUrlSlugFromIsoDate(iso);
  return BLOG_UPDATE_URL_SLUG_BY_N[updateN as ArticleUpdateNonMonthly];
}

export function getArticleUpdatePostPath(updateN: ArticleUpdateN): string {
  const year = BLOG_UPDATE_PUBLISHED_YEAR_BY_N[updateN];
  const slug = getArticleUpdateUrlSlug(updateN);
  return `/articles/${year}/${slug}`;
}

/**
 * Teaser card `href`. Post 8 is the lead Featured story: open the canonical article with `?from=featured` so
 * `ArticleLayout` highlights Featured and the back link reads “Back to Featured” (same as teasers on `featured.astro`).
 */
export function getArticleTeaserHref(updateN: ArticleUpdateN, _articlePostId: string, teaserFromFeatured: boolean): string {
  const postHref = getArticleUpdatePostPath(updateN);
  if (teaserFromFeatured || updateN === 8) return `${postHref}?from=featured`;
  return postHref;
}

/** Resolve canonical article URL from legacy `/article/update/{postId}` id. */
export function getArticleUpdatePostPathByPostId(postId: string): string | undefined {
  const entry = (Object.entries(BLOG_UPDATE_SLUG_BY_N) as [string, string][]).find(([, id]) => id === postId);
  if (!entry) return undefined;
  return getArticleUpdatePostPath(Number(entry[0]) as ArticleUpdateN);
}

export function getArticleUpdateNFromPostId(postId: string): ArticleUpdateN | undefined {
  const entry = (Object.entries(BLOG_UPDATE_SLUG_BY_N) as [string, string][]).find(([, id]) => id === postId);
  if (!entry) return undefined;
  return Number(entry[0]) as ArticleUpdateN;
}
