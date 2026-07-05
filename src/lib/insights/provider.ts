import type { Locale } from "@/lib/i18n";
import type {
  InsightArticle,
  InsightCategoryContent,
  InsightCategorySlug,
  InsightsContent,
} from "@/content/insights.types";

export type ArticleSearchInput = {
  query?: string;
  category?: InsightCategorySlug | "all";
  topic?: string;
  service?: string;
};

export interface InsightsProvider {
  getContent(locale: Locale): InsightsContent;
  getArticles(locale: Locale): InsightArticle[];
  getPublishedArticles(locale: Locale): InsightArticle[];
  getArticleBySlug(slug: string, locale: Locale): InsightArticle | undefined;
  getArticlesByCategory(category: InsightCategorySlug, locale: Locale): InsightArticle[];
  getRelatedArticles(article: InsightArticle, locale: Locale, limit?: number): InsightArticle[];
  getCategoryContent(category: InsightCategorySlug, locale: Locale): InsightCategoryContent | undefined;
  searchArticles(input: ArticleSearchInput, locale: Locale): InsightArticle[];
  getArticleSlugs(): { categorySlug: InsightCategorySlug; articleSlug: string; locale: Locale }[];
}
