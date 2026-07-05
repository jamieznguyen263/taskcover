import type { Locale } from "@/lib/i18n";
import type { InsightCategorySlug } from "@/content/insights.types";
import { localInsightsProvider } from "./local-provider";
import type { ArticleSearchInput } from "./provider";

export const insightsProvider = localInsightsProvider;

export function getInsightsContent(locale: Locale) {
  return insightsProvider.getContent(locale);
}

export function getPublishedInsights(locale: Locale) {
  return insightsProvider.getPublishedArticles(locale);
}

export function getInsightBySlug(slug: string, locale: Locale) {
  return insightsProvider.getArticleBySlug(slug, locale);
}

export function getInsightsByCategory(category: InsightCategorySlug, locale: Locale) {
  return insightsProvider.getArticlesByCategory(category, locale);
}

export function getInsightCategory(category: InsightCategorySlug, locale: Locale) {
  return insightsProvider.getCategoryContent(category, locale);
}

export function searchInsights(input: ArticleSearchInput, locale: Locale) {
  return insightsProvider.searchArticles(input, locale);
}

export function getRelatedInsights(slug: string, locale: Locale, limit = 3) {
  const article = getInsightBySlug(slug, locale);
  if (!article) return [];
  return insightsProvider.getRelatedArticles(article, locale, limit);
}

export function getInsightArticleSlugs() {
  return insightsProvider.getArticleSlugs();
}
