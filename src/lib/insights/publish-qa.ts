import { locales } from "@/lib/i18n";
import { insightCategorySlugs, type InsightArticle } from "@/content/insights.types";

export type PublishQaSeverity = "pass" | "warning" | "error";

export type PublishQaResult = {
  severity: PublishQaSeverity;
  code: string;
  message: string;
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isValidUrlShape(url: string) {
  return /^https?:\/\/[^\s]+$/.test(url);
}

export function validateInsightArticle(
  article: InsightArticle,
  translations: InsightArticle[]
): PublishQaResult[] {
  const results: PublishQaResult[] = [];
  const add = (severity: PublishQaSeverity, code: string, message: string) =>
    results.push({ severity, code, message });

  add("pass", "structured-checks", "Publish QA uses evidence, metadata, workflow, linking, and schema checks; it does not use word count, keyword density, readability scores, or ranking predictions.");

  if (!article.h1) add("error", "missing-h1", "Article must have one H1.");
  if (!article.metadata.metaTitle) add("error", "missing-meta-title", "Meta title is required.");
  if (!article.metadata.metaDescription) add("error", "missing-meta-description", "Meta description is required.");
  if (!slugPattern.test(article.slug)) add("error", "invalid-slug", "Slug must be lowercase kebab-case.");
  if (!article.metadata.canonical.startsWith("/insights/")) add("error", "invalid-canonical", "Canonical must be an insights path.");
  if (!article.author) add("error", "missing-author", "Author is required.");
  if (Number.isNaN(Date.parse(article.publishedAt))) add("error", "invalid-published-date", "Published date must be valid.");
  if (Number.isNaN(Date.parse(article.updatedAt))) add("error", "invalid-updated-date", "Updated date must be valid.");
  if (!article.coverImageAlt) add("error", "missing-cover-alt", "Cover image alt text is required.");
  if (!insightCategorySlugs.includes(article.category)) add("error", "invalid-category", "Category is not registered.");
  if (article.blocks.length === 0) add("error", "empty-blocks", "Article blocks must not be empty.");
  if (article.metadata.robots.includes("noindex")) add("error", "accidental-noindex", "Published articles must not be noindex.");

  const translationLocales = new Set(translations.map((item) => item.locale));
  for (const locale of locales) {
    if (!translationLocales.has(locale)) {
      add("error", "missing-translation", `Missing ${locale} translation in hreflang group.`);
    }
  }

  const faqBlocks = article.blocks.filter((block) => block.type === "faq").flatMap((block) => block.items);
  const schemaFaq = article.schema.faqItems;
  if (schemaFaq.length !== faqBlocks.length) {
    add("error", "faq-schema-mismatch", "FAQ schema count must match visible FAQ blocks.");
  } else {
    for (const item of schemaFaq) {
      if (!faqBlocks.some((visible) => visible.question === item.question && visible.answer === item.answer)) {
        add("error", "faq-schema-text-mismatch", "FAQ schema text must exactly match visible FAQ text.");
      }
    }
  }

  for (const source of article.contentEvidence.sources) {
    if (!isValidUrlShape(source.url)) add("error", "invalid-source-url", `Source URL is invalid: ${source.title}`);
  }

  for (const claim of article.contentEvidence.claims) {
    if (claim.requiresEvidence && claim.sourceIds.length === 0) {
      add("error", "claim-without-evidence", `Claim requires evidence: ${claim.id}`);
    }
  }

  const related = new Set(article.internalLinking.relatedArticleSlugs);
  const siblingSlugs = new Set(translations.map((item) => item.slug));
  if (related.has(article.slug) || siblingSlugs.size === 0) {
    add("warning", "related-review", "Related articles should not point to the current article.");
  }

  if (!results.some((result) => result.severity === "error")) {
    add("pass", "publishable", "Article passes required public publication checks.");
  }

  return results;
}
