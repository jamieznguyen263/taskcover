import { siteConfig } from "@/lib/site";
import { localizePath, type Locale } from "@/lib/i18n";
import type { InsightArticle } from "@/content/insights.types";

export function getInsightPath(article: InsightArticle) {
  return `/insights/${article.category}/${article.slug}`;
}

export function articleJsonLd(article: InsightArticle, locale: Locale) {
  const path = getInsightPath(article);
  const url = `${siteConfig.url}${localizePath(path, locale)}`;
  return {
    "@context": "https://schema.org",
    "@type": article.schema.schemaType,
    headline: article.h1,
    description: article.excerpt,
    image: `${siteConfig.url}${article.coverImage}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: locale,
    mainEntityOfPage: url,
    author: {
      "@type": "Organization",
      name: article.author,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.logo.horizontal}`,
      },
    },
    about: article.schema.aboutEntities.map((name) => ({ "@type": "Thing", name })),
    mentions: article.schema.mentions.map((name) => ({ "@type": "Thing", name })),
    citation: article.schema.citationReferences,
  };
}

export function faqJsonLd(article: InsightArticle) {
  if (article.schema.faqItems.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.schema.faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
