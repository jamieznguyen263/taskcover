import type { Locale } from "@/lib/i18n";
import type { InsightCategorySlug } from "@/content/insights.types";
import { localInsightsProvider } from "./local-provider";
import type { ArticleSearchInput } from "./provider";
import { rankRelatedArticles } from "./related";
import { getDatabasePublishedInsights } from "./database-provider";

export const insightsProvider = localInsightsProvider;

function shouldUseDatabaseProvider() {
  return process.env.INSIGHTS_PROVIDER === "database" && Boolean(process.env.DATABASE_URL);
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

export async function getInsightArticleSlugs() {
  if (shouldUseDatabaseProvider()) {
    const locales = await Promise.all((["en", "fr", "es"] as const).map(async (locale) => {
      const articles = await getPublishedInsights(locale);
      return articles.map((article) => ({ locale, categorySlug: article.category, articleSlug: article.slug }));
    }));
    return locales.flat();
  }
  return insightsProvider.getArticleSlugs();
}
