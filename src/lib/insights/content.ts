import { localizePath, locales, type Locale } from "@/lib/i18n";
import type { InsightArticle, InsightCategorySlug } from "@/content/insights.types";
import { localInsightsProvider } from "./local-provider";
import type { ArticleSearchInput } from "./provider";
import { rankRelatedArticles } from "./related";
import { getDatabasePublishedInsights } from "./database-provider";
import { isDatabaseConfigured } from "@/lib/db/client";

export const insightsProvider = localInsightsProvider;

function shouldUseDatabaseProvider() {
  return String(process.env.INSIGHTS_PROVIDER ?? "local") === "database" && isDatabaseConfigured();
}

export function getInsightsContent(locale: Locale) {
  return insightsProvider.getContent(locale);
}

export async function getPublishedInsights(locale: Locale) {
  if (shouldUseDatabaseProvider()) return getDatabasePublishedInsights(locale);
  return insightsProvider.getPublishedArticles(locale);
}

export async function getInsightBySlug(slug: string, locale: Locale) {
  const articles = await getPublishedInsights(locale);
  return articles.find((article) => article.slug === slug);
}

export async function getInsightsByCategory(category: InsightCategorySlug, locale: Locale) {
  const articles = await getPublishedInsights(locale);
  return articles.filter((article) => article.category === category);
}

export function getInsightCategory(category: InsightCategorySlug, locale: Locale) {
  return insightsProvider.getCategoryContent(category, locale);
}

export async function searchInsights(input: ArticleSearchInput, locale: Locale) {
  if (shouldUseDatabaseProvider()) {
    const query = input.query?.trim().toLowerCase();
    return (await getPublishedInsights(locale)).filter((article) => {
      if (input.category && input.category !== "all" && article.category !== input.category) return false;
      return !query || [article.h1, article.excerpt, article.tags.join(" ")].join(" ").toLowerCase().includes(query);
    });
  }
  return insightsProvider.searchArticles(input, locale);
}

export async function getRelatedInsights(slug: string, locale: Locale, limit = 3) {
  const article = await getInsightBySlug(slug, locale);
  if (!article) return [];
  return rankRelatedArticles(article, await getPublishedInsights(locale), limit);
}

/**
 * Build hreflang alternates only from published localizations that actually
 * exist in the same translation group. This prevents English-only Core 56
 * articles from advertising French or Spanish URLs that return 404.
 */
export async function getInsightAlternateLanguages(article: InsightArticle): Promise<Record<string, string>> {
  const publishedByLocale = await Promise.all(locales.map((locale) => getPublishedInsights(locale)));
  const siblings = publishedByLocale
    .flat()
    .filter((candidate) => candidate.translationGroupId === article.translationGroupId);
  const languages: Record<string, string> = {};

  for (const sibling of siblings) {
    const path = `/insights/${sibling.category}/${sibling.slug}`;
    languages[sibling.locale] = localizePath(path, sibling.locale);
  }

  const fallback = siblings.find((sibling) => sibling.locale === "en") ?? siblings[0] ?? article;
  languages["x-default"] = localizePath(`/insights/${fallback.category}/${fallback.slug}`, fallback.locale);
  return languages;
}

export async function getInsightArticleSlugs() {
  if (shouldUseDatabaseProvider()) {
    const localized = await Promise.all(locales.map(async (locale) => {
      const articles = await getPublishedInsights(locale);
      return articles.map((article) => ({ locale, categorySlug: article.category, articleSlug: article.slug }));
    }));
    return localized.flat();
  }
  return insightsProvider.getArticleSlugs();
}
