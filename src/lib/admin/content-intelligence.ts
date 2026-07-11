import type { InsightArticle, InsightBlock, InsightLink } from "@/content/insights.types";
import { locales } from "@/lib/i18n";
import { richTextLinks } from "@/lib/insights/rich-text";
import { analyzeCitationReadiness, analyzeEntityCoverage, blockText, computeReadingTime } from "./geo-analysis";

export type IntelligenceStatus = "action" | "watch" | "pass";
export type IntelligencePriority = "high" | "medium" | "low";
export type IntelligenceSection = "document" | "strategy" | "evidence" | "linking" | "metadata" | "schema" | "localization" | "geo";
export type IntelligenceGroupId = "strategy" | "content" | "evidence" | "links" | "metadata" | "localization";

export type IntelligenceItem = {
  status: IntelligenceStatus;
  priority: IntelligencePriority;
  code: string;
  title: string;
  detail: string;
  section: IntelligenceSection;
};

export type IntelligenceGroup = {
  id: IntelligenceGroupId;
  label: string;
  items: IntelligenceItem[];
};

const COMMERCIAL_CONVERSION_PATHS = new Set(["/free-seo-audit", "/book-a-call"]);

function textReady(value: string | undefined, minLength = 1) {
  return (value ?? "").trim().length >= minLength;
}

function bodyHrefs(article: InsightArticle): Set<string> {
  const values = article.blocks.flatMap((block) => {
    if (block.type === "paragraph") return richTextLinks(block.text);
    if (block.type === "bullet-list" || block.type === "numbered-list") return block.items.flatMap((item) => richTextLinks(item));
    if (block.type === "quote") return richTextLinks(block.quote);
    if ("href" in block && typeof block.href === "string") return [block.href];
    if (block.type === "cta") return [block.primary.href, block.secondary?.href].filter((href): href is string => Boolean(href));
    return [];
  });
  return new Set(values.filter(Boolean));
}

function plannedLinks(article: InsightArticle): InsightLink[] {
  const linking = article.internalLinking;
  return [
    ...linking.requiredInternalLinks,
    ...linking.suggestedInternalLinks,
    ...linking.serviceLinks,
    ...linking.industryLinks,
    ...linking.marketLinks,
    ...linking.caseStudyLinks,
    ...linking.sampleAuditLinks,
  ];
}

function hasBlock(blocks: InsightBlock[], type: InsightBlock["type"]) {
  return blocks.some((block) => block.type === type);
}

function add(items: IntelligenceItem[], item: IntelligenceItem) {
  items.push(item);
}

function result(
  ok: boolean,
  code: string,
  title: string,
  passDetail: string,
  failDetail: string,
  section: IntelligenceSection,
  priority: IntelligencePriority = "medium",
  failStatus: IntelligenceStatus = "action"
): IntelligenceItem {
  return {
    status: ok ? "pass" : failStatus,
    priority: ok ? "low" : priority,
    code,
    title,
    detail: ok ? passDetail : failDetail,
    section,
  };
}

export function analyzeContentIntelligence(article: InsightArticle, translations: InsightArticle[]): IntelligenceGroup[] {
  const strategy: IntelligenceItem[] = [];
  const content: IntelligenceItem[] = [];
  const evidence: IntelligenceItem[] = [];
  const links: IntelligenceItem[] = [];
  const metadata: IntelligenceItem[] = [];
  const localization: IntelligenceItem[] = [];

  const blocks = article.blocks;
  const headings = blocks.filter((block) => block.type === "heading");
  const h2Count = headings.filter((block) => block.level === 2).length;
  const questionHeadingCount = headings.filter((block) => /^(how|what|why|when|where|which|who|should|can|do|does|is|are)\b/i.test(block.text) || block.text.trim().endsWith("?")).length;
  const structuredEvidence = blocks.filter((block) => ["comparison-table", "checklist", "steps", "statistic", "pros-cons"].includes(block.type)).length;
  const directAnswerIndex = blocks.findIndex((block) => block.type === "direct-answer");
  const bodyText = blocks.map(blockText).join(" ");
  const readingTime = computeReadingTime(blocks);
  const hrefsInBody = bodyHrefs(article);
  const internalBodyHrefs = [...hrefsInBody].filter((href) => href.startsWith("/"));
  const planned = plannedLinks(article).filter((link) => link.href.trim());
  const requiredMissingInBody = article.internalLinking.requiredInternalLinks.filter((link) => link.href && !hrefsInBody.has(link.href));
  const citation = analyzeCitationReadiness(article);
  const entities = analyzeEntityCoverage(article);
  const missingEntities = entities.filter((entity) => entity.state === "missing");
  const independentSources = article.contentEvidence.sources.filter((source) => !source.primarySource);
  const translationLocales = new Set(translations.map((item) => item.locale));

  add(strategy, result(textReady(article.searchStrategy.focusKeyword), "focus-keyword", "Primary query is defined", "Primary query is set.", "Set the one query this article is built to win.", "strategy", "high"));
  add(strategy, result(textReady(article.searchStrategy.coreQuestion), "core-question", "Core question is explicit", "Core question is set.", "Write the main question the article must answer in plain language.", "strategy", "high"));
  add(strategy, result(textReady(article.searchStrategy.targetAudience), "audience", "Target audience is clear", "Audience is defined.", "Define who the article is for; this drives examples, depth, and conversion path.", "strategy", "medium"));
  add(strategy, result(article.searchStrategy.targetMarkets.length > 0, "target-markets", "Target market is selected", "Target markets are set.", "Add USA, Canada, Australia, or the exact market this article targets.", "strategy", "medium"));
  add(strategy, result(article.searchStrategy.serpObservations.length >= 3, "serp-observations", "SERP observations are recorded", "SERP gap notes are strong enough to guide writing.", "Record at least 3 observations about current ranking pages, formats, and missing angles.", "strategy", "medium", "watch"));
  add(strategy, result(textReady(article.searchStrategy.uniqueInformationGain, 80), "information-gain", "Unique information gain is specific", "The draft records what makes this article non-commodity.", "Explain the original data, first-hand process, or expert analysis competitors do not have.", "strategy", "high"));
  add(strategy, result(textReady(article.searchStrategy.aiCitationOpportunity, 40), "ai-citation-opportunity", "AI citation opportunity is defined", "AI citation opportunity is clear.", "Describe what concise fact, framework, or answer an AI result should cite from this article.", "strategy", "medium", "watch"));

  add(content, result(readingTime >= 3, "substantial-body", "Body has enough depth to review", `Estimated reading time is ${readingTime} minutes.`, "The article is still thin. Add original explanation, examples, data, or process detail before review.", "document", "medium", "watch"));
  add(content, result(h2Count >= 3, "section-depth", "Section structure supports scanning", `${h2Count} H2 sections are present.`, "Add at least 3 H2 sections so readers and crawlers can understand the page structure.", "document", "medium", "watch"));
  add(content, result(directAnswerIndex >= 0 && directAnswerIndex <= 2, "direct-answer-top", "Direct answer appears near the top", "Direct answer is placed near the top.", "Add or move a Direct answer block into the first three body blocks.", "document", "high"));
  add(content, result(hasBlock(blocks, "key-takeaways"), "key-takeaways", "Key takeaways are present", "Key takeaways block is present.", "Add a Key takeaways block to make the article easier to scan and quote.", "document", "medium", "watch"));
  add(content, result(hasBlock(blocks, "faq") || questionHeadingCount > 0, "question-coverage", "Question coverage is visible", questionHeadingCount > 0 ? `${questionHeadingCount} question-style heading(s) found.` : "FAQ block is present.", "Add FAQ blocks or question-style headings for query fan-out and long-tail questions.", "document", "medium", "watch"));
  add(content, result(structuredEvidence >= 2, "structured-evidence", "Structured extraction blocks are present", `${structuredEvidence} extraction-friendly block(s) found.`, "Add comparison tables, steps, checklists, statistics, or pros/cons where they genuinely help.", "document", "medium", "watch"));
  add(content, result(missingEntities.length === 0, "entity-coverage", "Required entities are named", "All tracked entities are covered or excluded.", `Name missing entities in the body: ${missingEntities.map((entity) => entity.name).join(", ") || "none"}.`, "geo", "medium", "watch"));
  add(content, result(bodyText.toLowerCase().includes(article.searchStrategy.primaryEntity.trim().toLowerCase()) || !article.searchStrategy.primaryEntity.trim(), "primary-entity", "Primary entity is named", "Primary entity is named in the body.", "Name the primary entity explicitly in the body, not only in metadata.", "geo", "medium", "watch"));

  add(evidence, result(article.contentEvidence.claims.length > 0, "claims-tracked", "Claims are tracked", `${article.contentEvidence.claims.length} factual claim(s) are tracked.`, "Record factual claims and connect them to sources before review.", "evidence", "high"));
  add(evidence, result(citation.claimsWithoutEvidence.length === 0, "claims-supported", "Claims have supporting evidence", "No evidence-required claim is missing sources.", `${citation.claimsWithoutEvidence.length} evidence-required claim(s) still have no source.`, "evidence", "high"));
  add(evidence, result(independentSources.length >= 2, "independent-sources", "Independent sources support the article", `${independentSources.length} independent source(s) are recorded.`, "Add at least two credible independent sources where the article makes factual claims.", "evidence", "medium", "watch"));
  add(evidence, result(citation.unverifiedStatistics.length === 0, "statistics-sourced", "Statistics are sourced", "All statistic blocks reference a source.", "Link every statistic block to a real source in Content & Evidence.", "evidence", "high"));
  add(evidence, result(textReady(article.expertReviewer), "expert-reviewer", "Expert reviewer is assigned", "Expert reviewer is set.", "Assign a real reviewer for YMYL-adjacent or high-trust SEO advice.", "metadata", "medium", "watch"));
  add(evidence, result(article.schema.citationReferences.length >= independentSources.length || independentSources.length === 0, "schema-citations", "Schema citations mirror independent sources", "Schema citations are aligned with evidence.", "Import independent source URLs into schema citationReferences.", "schema", "medium", "watch"));

  add(links, result(planned.length >= 2, "planned-links", "Internal links are planned", `${planned.length} internal link(s) are planned.`, "Plan at least two relevant internal links: one commercial path and one topical support page.", "linking", "medium"));
  add(links, result(internalBodyHrefs.length >= 2, "body-links", "Internal links are placed in the body", `${internalBodyHrefs.length} internal link(s) are present in body content.`, "Place planned links inside the article body; planning alone does not help readers or crawlers.", "document", "high"));
  add(links, result(requiredMissingInBody.length === 0, "required-links-placed", "Required links are placed", "All required internal links appear in the body.", `Place required link(s) in body text: ${requiredMissingInBody.map((link) => link.href).join(", ") || "none"}.`, "document", "high"));
  add(links, result([...hrefsInBody].some((href) => COMMERCIAL_CONVERSION_PATHS.has(href)) || planned.some((link) => COMMERCIAL_CONVERSION_PATHS.has(link.href)), "conversion-path", "Conversion path is included", "A standard conversion path is present.", "Add /free-seo-audit or /book-a-call when it fits the article intent.", "linking", "medium", "watch"));

  add(metadata, result(textReady(article.metadata.metaTitle), "meta-title", "SEO title is written", "SEO title is set.", "Write a concise SEO title before review.", "metadata", "high"));
  add(metadata, result(textReady(article.metadata.metaDescription), "meta-description", "Meta description is written", "Meta description is set.", "Write a useful meta description before review.", "metadata", "high"));
  add(metadata, result(article.metadata.robots === "index,follow", "robots-index", "Robots allows indexing", "Robots is index,follow.", "Set robots to index,follow before publishing.", "metadata", "high"));
  add(metadata, result(textReady(article.coverImageAlt), "cover-alt", "Cover image has alt text", "Cover image alt text is set.", "Add descriptive cover image alt text.", "document", "high"));
  add(metadata, result(article.schema.aboutEntities.length > 0, "about-entities", "Schema about entities are set", "Schema about entities are present.", "Add schema about entities so structured data reflects the article topic.", "schema", "medium", "watch"));

  add(localization, result(locales.every((locale) => translationLocales.has(locale)), "locale-coverage", "All locales exist", "All configured locales exist in this article group.", "Create every configured locale before publishing.", "localization", "high"));
  add(localization, result(translations.every((item) => item.localization.translationStatus === "complete"), "translation-complete", "Translations are complete", "All translations are marked complete.", "Finish locale review for every translation before final publish.", "localization", "medium", "watch"));
  add(localization, result(article.locale === "en" || textReady(article.localization.localeKeyword), "locale-keyword", "Locale keyword is researched", "Locale-specific keyword is set.", "Add a locale-specific keyword based on local SERP research, not a direct translation.", "localization", "medium", "watch"));
  add(localization, result(textReady(article.localization.xDefaultSlug), "x-default", "x-default slug is set", "x-default slug is set.", "Set the x-default slug so international alternates remain coherent.", "localization", "medium", "watch"));

  return [
    { id: "strategy", label: "Search strategy", items: strategy },
    { id: "content", label: "Content and GEO", items: content },
    { id: "evidence", label: "Evidence and trust", items: evidence },
    { id: "links", label: "Internal links", items: links },
    { id: "metadata", label: "Metadata and schema", items: metadata },
    { id: "localization", label: "Localization", items: localization },
  ];
}
