import type { InsightArticle, InsightBlock } from "@/content/insights.types";
import { richTextToPlainText } from "@/lib/insights/rich-text";

/**
 * GEO (generative engine optimization) analysis derived entirely from the
 * article's real content and evidence data. It reports structural facts —
 * which extractable-answer blocks exist, which entities are named, which
 * claims lack evidence. It never produces scores, rankings, or visibility
 * predictions.
 */

export type GeoCheckState = "present" | "attention" | "missing";

export type GeoCheck = {
  state: GeoCheckState;
  code: string;
  label: string;
  detail: string;
};

export type EntityCoverage = {
  name: string;
  role: "primary" | "supporting";
  state: "present" | "missing" | "excluded";
};

export type CitationReadiness = {
  claimsWithoutEvidence: { id: string; text: string }[];
  claimsFirstPartyOnly: { id: string; text: string }[];
  claimsIndependentlySupported: number;
  totalClaims: number;
  sourcesMissingPublisher: string[];
  sourcesMissingDate: string[];
  sourcesInvalidUrl: string[];
  unverifiedStatistics: string[];
};

export type GeoAnalysis = {
  answerability: GeoCheck[];
  entities: EntityCoverage[];
  citations: CitationReadiness;
};

export function blockText(block: InsightBlock): string {
  switch (block.type) {
    case "paragraph":
      return richTextToPlainText(block.text);
    case "heading":
      return block.text;
    case "bullet-list":
    case "numbered-list":
      return block.items.map(richTextToPlainText).join(" ");
    case "quote":
      return [richTextToPlainText(block.quote), block.attribution ?? ""].join(" ");
    case "direct-answer":
      return [block.title, block.answer].join(" ");
    case "key-takeaways":
      return [block.title, ...block.items].join(" ");
    case "definition":
      return [block.term, block.definition].join(" ");
    case "callout":
    case "expert-insight":
      return [block.title, block.body].join(" ");
    case "comparison-table":
      return [block.caption, ...block.columns, ...block.rows.flat()].join(" ");
    case "checklist":
      return [block.title, ...block.items.flatMap((item) => [item.label, item.detail])].join(" ");
    case "steps":
      return [block.title, ...block.steps.flatMap((step) => [step.title, step.body])].join(" ");
    case "evidence":
      return block.summary;
    case "faq":
      return block.items.flatMap((item) => [item.question, item.answer]).join(" ");
    case "pros-cons":
      return [block.title, ...block.pros, ...block.cons].join(" ");
    case "decision-framework":
      return [block.title, ...block.criteria.flatMap((item) => [item.signal, item.action])].join(" ");
    case "case-study-reference":
    case "sample-audit-reference":
    case "related-service":
      return [block.title, block.summary].join(" ");
    case "cta":
      return [block.title, block.body].join(" ");
    case "statistic":
      return [block.value, block.label, block.note ?? ""].join(" ");
    case "code":
      return block.code;
    case "image":
      return [block.alt, block.caption ?? ""].join(" ");
    case "video":
      return [block.title, block.caption ?? ""].join(" ");
    case "divider":
      return "";
  }
}

/** Estimated reading time in minutes from all block text at ~220 wpm (min 1). */
export function computeReadingTime(blocks: InsightBlock[]): number {
  const words = blocks.reduce((sum, block) => {
    const text = blockText(block).trim();
    return sum + (text ? text.split(/\s+/).length : 0);
  }, 0);
  return Math.max(1, Math.round(words / 220));
}

const QUESTION_STARTERS = /^(how|what|why|when|where|which|who|should|can|do|does|is|are)\b/i;

export function analyzeAnswerability(article: InsightArticle): GeoCheck[] {
  const blocks = article.blocks;
  const checks: GeoCheck[] = [];
  const push = (state: GeoCheckState, code: string, label: string, detail: string) => checks.push({ state, code, label, detail });

  const directAnswerIndex = blocks.findIndex((block) => block.type === "direct-answer");
  if (directAnswerIndex === -1) push("missing", "direct-answer", "Direct answer near the top", "Add a Direct answer block that answers the core question in the first screen of content.");
  else if (directAnswerIndex > 2) push("attention", "direct-answer", "Direct answer near the top", `The direct answer is block ${directAnswerIndex + 1}. Move it into the first three blocks so answer engines can extract it.`);
  else push("present", "direct-answer", "Direct answer near the top", "A direct answer appears near the beginning.");

  const has = (type: InsightBlock["type"]) => blocks.some((block) => block.type === type);

  push(has("definition") ? "present" : "missing", "definition", "Definition block", has("definition") ? "A definition block exists." : "Add a Definition block for the primary concept so engines can quote it.");
  push(has("key-takeaways") ? "present" : "missing", "key-takeaways", "Key takeaways", has("key-takeaways") ? "Key takeaways are present." : "Add a Key takeaways block summarizing the article.");
  push(has("faq") ? "present" : "missing", "faq", "FAQ section", has("faq") ? "An FAQ block exists." : "Add an FAQ block for question-based queries, only with real questions you answer.");

  const questionHeadings = blocks.filter((block) => block.type === "heading" && (QUESTION_STARTERS.test(block.text) || block.text.trim().endsWith("?"))).length;
  push(
    questionHeadings > 0 ? "present" : "attention",
    "question-headings",
    "Question-based sections",
    questionHeadings > 0 ? `${questionHeadings} heading(s) are phrased as questions.` : "No headings are phrased as questions. Consider matching section headings to the questions users ask."
  );

  const structuredEvidence = blocks.filter((block) => ["comparison-table", "checklist", "steps", "statistic", "pros-cons"].includes(block.type)).length;
  push(
    structuredEvidence > 0 ? "present" : "attention",
    "structured-blocks",
    "Comparison / checklist / process blocks",
    structuredEvidence > 0 ? `${structuredEvidence} structured block(s) support extraction.` : "No comparison tables, checklists, steps, or statistics blocks yet. These are the formats answer engines cite most readily."
  );

  const primaryEntity = article.searchStrategy.primaryEntity.trim();
  if (primaryEntity) {
    const body = blocks.map(blockText).join(" ").toLowerCase();
    push(
      body.includes(primaryEntity.toLowerCase()) ? "present" : "attention",
      "entity-naming",
      "Primary entity named explicitly",
      body.includes(primaryEntity.toLowerCase()) ? `“${primaryEntity}” is named in the body.` : `The primary entity “${primaryEntity}” is never named in the body. Name entities explicitly instead of using pronouns.`
    );
  } else {
    push("attention", "entity-naming", "Primary entity named explicitly", "No primary entity is defined in Search Strategy yet.");
  }

  return checks;
}

export function analyzeEntityCoverage(article: InsightArticle): EntityCoverage[] {
  const body = article.blocks.map(blockText).join(" ").toLowerCase();
  const excluded = new Set((article.searchStrategy.excludedEntities ?? []).map((name) => name.toLowerCase()));
  const coverage: EntityCoverage[] = [];
  const evaluate = (name: string, role: "primary" | "supporting") => {
    const trimmed = name.trim();
    if (!trimmed) return;
    coverage.push({
      name: trimmed,
      role,
      state: excluded.has(trimmed.toLowerCase()) ? "excluded" : body.includes(trimmed.toLowerCase()) ? "present" : "missing",
    });
  };
  evaluate(article.searchStrategy.primaryEntity, "primary");
  for (const entity of article.searchStrategy.supportingEntities) evaluate(entity, "supporting");
  return coverage;
}

export function analyzeCitationReadiness(article: InsightArticle): CitationReadiness {
  const { sources, claims } = article.contentEvidence;
  const sourceById = new Map(sources.map((source) => [source.id, source]));
  const urlShape = /^https?:\/\/[^\s]+$/;

  const claimsWithoutEvidence: { id: string; text: string }[] = [];
  const claimsFirstPartyOnly: { id: string; text: string }[] = [];
  let claimsIndependentlySupported = 0;

  for (const claim of claims) {
    const linked = claim.sourceIds.map((id) => sourceById.get(id)).filter((source): source is NonNullable<typeof source> => Boolean(source));
    if (claim.requiresEvidence && linked.length === 0) {
      claimsWithoutEvidence.push({ id: claim.id, text: claim.text });
    } else if (linked.length > 0 && linked.every((source) => source.primarySource)) {
      claimsFirstPartyOnly.push({ id: claim.id, text: claim.text });
    } else if (linked.some((source) => !source.primarySource)) {
      claimsIndependentlySupported += 1;
    }
  }

  const statisticBlocks = article.blocks.filter((block): block is Extract<InsightBlock, { type: "statistic" }> => block.type === "statistic");
  const unverifiedStatistics = statisticBlocks
    .filter((block) => !block.sourceId || !sourceById.has(block.sourceId))
    .map((block) => `${block.value} ${block.label}`.trim() || "Unlabeled statistic");

  return {
    claimsWithoutEvidence,
    claimsFirstPartyOnly,
    claimsIndependentlySupported,
    totalClaims: claims.length,
    sourcesMissingPublisher: sources.filter((source) => !source.publisher.trim()).map((source) => source.title),
    sourcesMissingDate: sources.filter((source) => !source.publishedAt).map((source) => source.title),
    sourcesInvalidUrl: sources.filter((source) => !urlShape.test(source.url)).map((source) => source.title),
    unverifiedStatistics,
  };
}

export function analyzeGeo(article: InsightArticle): GeoAnalysis {
  return {
    answerability: analyzeAnswerability(article),
    entities: analyzeEntityCoverage(article),
    citations: analyzeCitationReadiness(article),
  };
}
