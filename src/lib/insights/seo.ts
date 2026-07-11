import { siteConfig } from "@/lib/site";
import { localizePath, type Locale } from "@/lib/i18n";
import type { InsightArticle } from "@/content/insights.types";

export function getInsightPath(article: InsightArticle) {
  return `/insights/${article.category}/${article.slug}`;
}

export function articleLanguageAlternates(translations: InsightArticle[]) {
  const languages = Object.fromEntries(
    translations.map((article) => [
      article.locale,
      `${siteConfig.url}${localizePath(getInsightPath(article), article.locale)}`,
    ])
  );
  const fallback = translations.find((article) => article.locale === "en") ?? translations[0];
  if (fallback) {
    languages["x-default"] = `${siteConfig.url}${localizePath(getInsightPath(fallback), fallback.locale)}`;
  }
  return languages;
}

function absoluteUrl(src: string) {
  return /^https?:\/\//.test(src) ? src : `${siteConfig.url}${src}`;
}

function articleImages(article: InsightArticle) {
  const images: (string | Record<string, unknown>)[] = [];
  if (article.coverImage) images.push(absoluteUrl(article.coverImage));
  for (const block of article.blocks) {
    if (block.type === "image" && block.src) {
      images.push({
        "@type": "ImageObject",
        url: absoluteUrl(block.src),
        ...(block.width ? { width: block.width } : {}),
        ...(block.height ? { height: block.height } : {}),
        ...(block.caption ? { caption: block.caption } : {}),
      });
    }
  }
  return images.length ? images : absoluteUrl(article.coverImage);
}

export function articleJsonLd(article: InsightArticle, locale: Locale) {
  const path = getInsightPath(article);
  const url = `${siteConfig.url}${localizePath(path, locale)}`;
  return {
    "@context": "https://schema.org",
    "@type": article.schema.schemaType,
    headline: article.h1,
    description: article.excerpt,
    image: articleImages(article),
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
