import { insightCategorySlugs, type InsightArticle } from "@/content/insights.types";
import { richTextLinks } from "./rich-text";

export type PublishQaSeverity = "pass" | "warning" | "error";

export type PublishQaGroup =
  | "content"
  | "seo"
  | "evidence"
  | "internal-links"
  | "metadata"
  | "schema"
  | "localization"
  | "media"
  | "workflow";

/** Editor section a QA result navigates to for remediation. */
export type PublishQaSection = "document" | "strategy" | "evidence" | "linking" | "metadata" | "schema" | "localization" | "geo";

export type PublishQaResult = {
  severity: PublishQaSeverity;
  code: string;
  message: string;
  group?: PublishQaGroup;
  section?: PublishQaSection;
  remediation?: string;
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isValidUrlShape(url: string) {
  return /^https?:\/\/[^\s]+$/.test(url);
}

/** Accepts /insights/…, locale-prefixed /fr|/es/insights/…, or an absolute taskcover URL to either. */
function isInsightsCanonical(canonical: string) {
  return /^\/(?:fr\/|es\/)?insights\//.test(canonical) || /^https?:\/\/[^/]+\/(?:fr\/|es\/)?insights\//.test(canonical);
}

function bodyHrefs(article: InsightArticle): Set<string> {
  const hrefs = article.blocks.flatMap((block) => {
    if (block.type === "paragraph") return richTextLinks(block.text);
    if (block.type === "bullet-list" || block.type === "numbered-list") return block.items.flatMap((item) => richTextLinks(item));
    if (block.type === "quote") return richTextLinks(block.quote);
    if ("href" in block && typeof block.href === "string") return [block.href];
    if (block.type === "cta") return [block.primary.href, block.secondary?.href].filter((href): href is string => Boolean(href));
    return [];
  });
  return new Set(hrefs.filter(Boolean));
}

export function validateInsightArticle(
  article: InsightArticle,
  translations: InsightArticle[]
): PublishQaResult[] {
  const results: PublishQaResult[] = [];
  const add = (
    severity: PublishQaSeverity,
    code: string,
    message: string,
    group: PublishQaGroup,
    section: PublishQaSection,
    remediation?: string
  ) => results.push({ severity, code, message, group, section, remediation });

  results.push({
    severity: "pass",
    code: "structured-checks",
    message: "Publish QA uses evidence, metadata, workflow, linking, and schema checks; it does not use word count, keyword density, readability scores, or ranking predictions.",
    group: "workflow",
    section: "document",
  });

  if (!article.h1) add("error", "missing-h1", "Article must have one H1.", "content", "document", "Set the Public H1 in the document header.");
  if (!article.metadata.metaTitle) add("error", "missing-meta-title", "Meta title is required.", "metadata", "metadata", "Write an SEO title in Metadata & Social.");
  if (!article.metadata.metaDescription) add("error", "missing-meta-description", "Meta description is required.", "metadata", "metadata", "Write a meta description in Metadata & Social.");
  if (!article.searchStrategy.focusKeyword.trim()) add("error", "missing-focus-keyword", "Primary keyword / query is required.", "seo", "strategy", "Set the single query this article is built to win.");
  if (!article.searchStrategy.coreQuestion.trim()) add("error", "missing-core-question", "Core question is required.", "seo", "strategy", "Write the main question this article must answer.");
  if (!article.searchStrategy.targetAudience.trim()) add("error", "missing-target-audience", "Target audience is required.", "seo", "strategy", "Define the reader so the article can match intent and depth.");
  if (!slugPattern.test(article.slug)) add("error", "invalid-slug", "Slug must be lowercase kebab-case.", "seo", "metadata", "Fix the slug format in Metadata & Social.");
  if (!isInsightsCanonical(article.metadata.canonical)) add("error", "invalid-canonical", "Canonical must be an insights path.", "seo", "metadata", "Point the canonical to this article's insights URL.");
  if (!article.author) add("error", "missing-author", "Author is required.", "content", "metadata", "Set the author in Metadata & Social.");
  if (Number.isNaN(Date.parse(article.publishedAt))) add("error", "invalid-published-date", "Published date must be valid.", "workflow", "metadata");
  if (Number.isNaN(Date.parse(article.updatedAt))) add("error", "invalid-updated-date", "Updated date must be valid.", "workflow", "metadata");
  if (!article.coverImageAlt) add("error", "missing-cover-alt", "Cover image alt text is required.", "media", "document", "Add alt text for the cover image in the document header.");
  const imagesWithoutAlt = article.blocks.filter((block) => block.type === "image" && !block.alt.trim()).length;
  if (imagesWithoutAlt > 0) add("error", "image-missing-alt", `${imagesWithoutAlt} image block(s) are missing alt text.`, "media", "document", "Add alt text to every image for accessibility and image search.");
  if (!insightCategorySlugs.includes(article.category)) add("error", "invalid-category", "Category is not registered.", "content", "document");
  if (article.blocks.length === 0) add("error", "empty-blocks", "Article blocks must not be empty.", "content", "document", "Write the article body.");
  if (article.metadata.robots.includes("noindex")) add("error", "accidental-noindex", "Published articles must not be noindex.", "seo", "metadata", "Set robots to index,follow in Metadata & Social.");

  if (!translations.some((item) => item.locale === "en")) {
    add("error", "missing-source-localization", "The English source localization is required.", "localization", "localization", "Create and approve the English source article before publishing localized versions.");
  }
  if (article.localization.translationStatus !== "complete") {
    add("error", "localization-incomplete", `The ${article.locale} localization is not marked complete.`, "localization", "localization", "Complete the current localization review before publishing it.");
  }

  for (const sibling of translations) {
    if (sibling.locale !== article.locale && sibling.localization.translationStatus !== "complete") {
      add("warning", "translation-needs-review", `The ${sibling.locale} localization is still marked needs-review.`, "localization", "localization", "Finish and mark each localization complete before publishing.");
    }
  }

  const faqBlocks = article.blocks.filter((block) => block.type === "faq").flatMap((block) => block.items);
  const schemaFaq = article.schema.faqItems;
  if (schemaFaq.length !== faqBlocks.length) {
    add("error", "faq-schema-mismatch", "FAQ schema count must match visible FAQ blocks.", "schema", "schema", "Use “Sync from body FAQ blocks” in the Schema builder.");
  } else {
    for (const item of schemaFaq) {
      if (!faqBlocks.some((visible) => visible.question === item.question && visible.answer === item.answer)) {
        add("error", "faq-schema-text-mismatch", "FAQ schema text must exactly match visible FAQ text.", "schema", "schema", "Use “Sync from body FAQ blocks” in the Schema builder.");
      }
    }
  }

  for (const source of article.contentEvidence.sources) {
    if (!isValidUrlShape(source.url)) add("error", "invalid-source-url", `Source URL is invalid: ${source.title}`, "evidence", "evidence", "Fix the URL in Content & Evidence.");
  }

  for (const claim of article.contentEvidence.claims) {
    if (claim.requiresEvidence && claim.sourceIds.length === 0) {
      add("error", "claim-without-evidence", `Claim requires evidence: ${claim.id}`, "evidence", "evidence", "Link a real source to this claim, or mark it as not requiring evidence if it is genuinely self-evident.");
    }
  }

  const internalLinkCount = [
    ...article.internalLinking.requiredInternalLinks,
    ...article.internalLinking.suggestedInternalLinks,
    ...article.internalLinking.serviceLinks,
    ...article.internalLinking.industryLinks,
    ...article.internalLinking.marketLinks,
    ...article.internalLinking.caseStudyLinks,
    ...article.internalLinking.sampleAuditLinks,
  ].filter((link) => link.href).length;
  if (internalLinkCount === 0) {
    add("warning", "no-internal-links", "No internal links are planned for this article.", "internal-links", "linking", "Add at least the standard conversion path and one related page in Internal Linking.");
  }

  const hrefsInBody = bodyHrefs(article);
  const requiredLinksMissingFromBody = article.internalLinking.requiredInternalLinks.filter((link) => link.href && !hrefsInBody.has(link.href));
  if (requiredLinksMissingFromBody.length > 0) {
    add(
      "error",
      "required-links-missing-from-body",
      `${requiredLinksMissingFromBody.length} required internal link(s) are planned but not placed in the article body.`,
      "internal-links",
      "document",
      "Insert each required link as an inline link or structured reference block in the document."
    );
  }

  if (article.contentEvidence.claims.length === 0) {
    add("warning", "no-claims-tracked", "No factual claims are tracked for evidence review.", "evidence", "evidence", "Record the important claims this article makes and attach sources.");
  }
  if (article.contentEvidence.sources.filter((source) => !source.primarySource).length === 0) {
    add("warning", "no-independent-sources", "No independent external sources are recorded.", "evidence", "evidence", "Add credible independent sources for factual and comparative claims.");
  }
  if (!article.searchStrategy.uniqueInformationGain.trim()) {
    add("warning", "missing-information-gain", "Unique information gain is not defined.", "seo", "strategy", "Document what this article adds beyond existing ranking pages.");
  }
  if (article.contentEvidence.sources.some((source) => !source.primarySource) && article.schema.citationReferences.length === 0) {
    add("warning", "schema-citations-empty", "Independent sources exist but schema citation references are empty.", "schema", "schema", "Import independent source URLs into Schema citations.");
  }

  const related = new Set(article.internalLinking.relatedArticleSlugs);
  const siblingSlugs = new Set(translations.map((item) => item.slug));
  if (related.has(article.slug) || siblingSlugs.size === 0) {
    add("warning", "related-review", "Related articles should not point to the current article.", "internal-links", "linking");
  }

  if (!article.blocks.some((block) => block.type === "direct-answer")) {
    add("warning", "geo-direct-answer", "No direct-answer block exists. Answer engines extract concise answers placed near the top.", "content", "geo", "Insert a Direct answer block near the beginning of the document.");
  }

  if (article.metadata.metaTitle.length > 60) {
    add("warning", "meta-title-long", `Meta title is ${article.metadata.metaTitle.length} characters and will likely be truncated in results.`, "metadata", "metadata", "Shorten the title toward 60 characters or fewer.");
  }
  if (article.metadata.metaDescription.length > 160) {
    add("warning", "meta-description-long", `Meta description is ${article.metadata.metaDescription.length} characters and will likely be truncated.`, "metadata", "metadata", "Shorten the description toward 160 characters or fewer.");
  }

  if (!results.some((result) => result.severity === "error")) {
    results.push({ severity: "pass", code: "publishable", message: "Article passes required public publication checks.", group: "workflow", section: "document" });
  }

  return results;
}
