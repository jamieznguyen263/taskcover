import { defaultLocale, locales, type Locale } from "@/lib/i18n";
import { insights as en } from "@/content/en/insights";
import { insights as fr } from "@/content/fr/insights";
import { insights as es } from "@/content/es/insights";
import {
  insightCategorySlugs,
  type InsightArticle,
  type InsightCategorySlug,
  type InsightsContent,
} from "@/content/insights.types";
import { rankRelatedArticles } from "./related";
import type { ArticleSearchInput, InsightsProvider } from "./provider";

const contentMap: Record<Locale, InsightsContent> = { en, fr, es };

function isPublished(article: InsightArticle, now = new Date()) {
  if (article.status !== "published") return false;
  if (!article.scheduledAt) return true;
  return new Date(article.scheduledAt).getTime() <= now.getTime();
}

function haystack(article: InsightArticle) {
  return [
    article.h1,
    article.excerpt,
    article.category,
    article.tags.join(" "),
    article.searchStrategy.focusKeyword,
    article.searchStrategy.secondaryKeywords.join(" "),
    article.searchStrategy.topicCluster,
    article.searchStrategy.primaryEntity,
    article.searchStrategy.supportingEntities.join(" "),
    article.internalLinking.serviceLinks.map((link) => link.label).join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

export class LocalInsightsProvider implements InsightsProvider {
  getContent(locale: Locale): InsightsContent {
    return contentMap[locale] ?? contentMap[defaultLocale];
  }

  getArticles(locale: Locale): InsightArticle[] {
    return this.getContent(locale).articles;
  }

  getPublishedArticles(locale: Locale): InsightArticle[] {
    return this.getArticles(locale).filter((article) => isPublished(article));
  }

  getArticleBySlug(slug: string, locale: Locale): InsightArticle | undefined {
    return this.getPublishedArticles(locale).find((article) => article.slug === slug);
  }

  getArticlesByCategory(category: InsightCategorySlug, locale: Locale): InsightArticle[] {
    return this.getPublishedArticles(locale).filter((article) => article.category === category);
  }

  getRelatedArticles(article: InsightArticle, locale: Locale, limit = 3): InsightArticle[] {
    return rankRelatedArticles(article, this.getPublishedArticles(locale), limit);
  }

  getCategoryContent(category: InsightCategorySlug, locale: Locale) {
    return this.getContent(locale).categories[category];
  }

  searchArticles(input: ArticleSearchInput, locale: Locale): InsightArticle[] {
    const query = input.query?.trim().toLowerCase();
    return this.getPublishedArticles(locale).filter((article) => {
      if (input.category && input.category !== "all" && article.category !== input.category) return false;
      if (input.topic && !article.tags.map((tag) => tag.toLowerCase()).includes(input.topic.toLowerCase())) {
        return false;
      }
      if (
        input.service &&
        !article.internalLinking.serviceLinks.some(
          (link) =>
            link.href.toLowerCase().includes(input.service!.toLowerCase()) ||
            link.label.toLowerCase().includes(input.service!.toLowerCase())
        )
      ) {
        return false;
      }
      return !query || haystack(article).includes(query);
    });
  }

  getArticleSlugs() {
    return locales.flatMap((locale) =>
      this.getPublishedArticles(locale).map((article) => ({
        locale,
        categorySlug: article.category,
        articleSlug: article.slug,
      }))
    );
  }

  getCategorySlugs() {
    return [...insightCategorySlugs];
  }
}

export const localInsightsProvider = new LocalInsightsProvider();
