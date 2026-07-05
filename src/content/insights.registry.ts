import {
  insightCategorySlugs,
  insightStatuses,
  type InsightArticle,
  type InsightCategorySlug,
  type InsightSource,
  type InsightStatus,
} from "./insights.types";

export { insightCategorySlugs, insightStatuses };
export type { InsightArticle, InsightCategorySlug, InsightSource, InsightStatus };

export const insightArticleSlugs = [
  "seo-2026-google-ai-search-revenue-growth",
  "measure-ai-search-visibility",
  "technical-seo-audit-checklist-growing-websites",
  "seo-vs-ppc-search-growth-system",
  "international-seo-usa-canada-australia",
  "content-rankings-citations-leads",
] as const;

export type InsightArticleSlug = (typeof insightArticleSlugs)[number];

export const sharedInsightSources: InsightSource[] = [
  {
    id: "google-seo-starter",
    title: "Search Engine Optimization (SEO) Starter Guide",
    publisher: "Google Search Central",
    url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
    accessedAt: "2026-07-05",
    primarySource: true,
    supportsClaimIds: ["google-crawl-index", "seo-no-guarantee", "site-architecture"],
    locale: "global",
  },
  {
    id: "google-helpful-content",
    title: "Creating helpful, reliable, people-first content",
    publisher: "Google Search Central",
    url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
    accessedAt: "2026-07-05",
    primarySource: true,
    supportsClaimIds: ["people-first-content", "eeat-trust"],
    locale: "global",
  },
  {
    id: "google-ai-features",
    title: "AI Features and Your Website",
    publisher: "Google Search Central",
    url: "https://developers.google.com/search/docs/appearance/ai-features",
    accessedAt: "2026-07-05",
    primarySource: true,
    supportsClaimIds: ["ai-feature-controls", "ai-search-visibility"],
    locale: "global",
  },
  {
    id: "google-structured-data",
    title: "Intro to How Structured Data Markup Works",
    publisher: "Google Search Central",
    url: "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
    accessedAt: "2026-07-05",
    primarySource: true,
    supportsClaimIds: ["structured-data-eligibility"],
    locale: "global",
  },
  {
    id: "google-canonical",
    title: "What is URL Canonicalization",
    publisher: "Google Search Central",
    url: "https://developers.google.com/search/docs/crawling-indexing/canonicalization",
    accessedAt: "2026-07-05",
    primarySource: true,
    supportsClaimIds: ["canonical-signals"],
    locale: "global",
  },
  {
    id: "google-hreflang",
    title: "Tell Google about localized versions of your page",
    publisher: "Google Search Central",
    url: "https://developers.google.com/search/docs/specialty/international/localized-versions",
    accessedAt: "2026-07-05",
    primarySource: true,
    supportsClaimIds: ["hreflang-alternates"],
    locale: "global",
  },
  {
    id: "web-vitals",
    title: "Web Vitals",
    publisher: "web.dev",
    url: "https://web.dev/articles/vitals",
    accessedAt: "2026-07-05",
    primarySource: true,
    supportsClaimIds: ["core-web-vitals"],
    locale: "global",
  },
];

export function getSharedSources(ids: string[]): InsightSource[] {
  return ids
    .map((id) => sharedInsightSources.find((source) => source.id === id))
    .filter((source): source is InsightSource => Boolean(source));
}
