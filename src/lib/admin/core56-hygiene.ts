import type { InsightArticle, InsightBlock } from "@/content/insights.types";
import { normalizeTiptapToInsightBlocks } from "./normalization";

/**
 * Sprint S00 — Core 56 portfolio hygiene.
 *
 * Pure, unit-tested detectors and transforms. Nothing here ever touches
 * factCheckStatus, slug, sources, claims, metadata, author/reviewer, or
 * workflow state — only `blocks` (and, via `transformEditorDocument`, the
 * corresponding Tiptap `editorDocument` nodes). Anything ambiguous is
 * reported for manual review instead of being auto-fixed.
 */

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function normalizedKey(text: string): string {
  return normalizeWhitespace(text).toLowerCase();
}

export function blockPlainText(block: InsightBlock): string {
  switch (block.type) {
    case "paragraph":
      return block.text;
    case "heading":
      return block.text;
    case "bullet-list":
    case "numbered-list":
      return block.items.join(" ");
    case "quote":
      return block.quote;
    case "direct-answer":
      return `${block.title} ${block.answer}`;
    case "callout":
    case "expert-insight":
      return `${block.title} ${block.body}`;
    case "key-takeaways":
      return `${block.title} ${block.items.join(" ")}`;
    case "definition":
      return `${block.term} ${block.definition}`;
    case "checklist":
      return `${block.title} ${block.items.map((item) => `${item.label} ${item.detail}`).join(" ")}`;
    case "steps":
      return `${block.title} ${block.steps.map((step) => `${step.title} ${step.body}`).join(" ")}`;
    case "evidence":
      return block.summary;
    case "pros-cons":
      return `${block.title} ${[...block.pros, ...block.cons].join(" ")}`;
    case "decision-framework":
      return `${block.title} ${block.criteria.map((c) => `${c.signal} ${c.action}`).join(" ")}`;
    case "case-study-reference":
    case "sample-audit-reference":
    case "related-service":
      return `${block.title} ${block.summary}`;
    case "cta":
      return `${block.title} ${block.body}`;
    case "statistic":
      return `${block.value} ${block.label} ${block.note ?? ""}`;
    case "faq":
      return block.items.map((item) => `${item.question} ${item.answer}`).join(" ");
    case "comparison-table":
      return `${block.caption} ${block.columns.join(" ")} ${block.rows.flat().join(" ")}`;
    default:
      return "";
  }
}

const FAQ_HEADING_PATTERN = /^(frequently asked questions|faqs?)$/i;

export function isFaqHeading(block: InsightBlock): block is Extract<InsightBlock, { type: "heading" }> {
  return block.type === "heading" && FAQ_HEADING_PATTERN.test(normalizeWhitespace(block.text));
}

// ---------------------------------------------------------------------------
// Task 7 — narrow, exact-match-only internal workflow language
// ---------------------------------------------------------------------------

/**
 * Only whole-paragraph, whole-sentence exact matches (normalized) are ever
 * auto-removed. A phrase occurring inside a longer substantive sentence is
 * deliberately NOT matched here — that is a manual-review signal, not an
 * auto-fix (see `detectInternalWorkflowLeak`).
 */
const EXACT_INTERNAL_SENTENCES = [
  "this is a claude-generated draft.",
  "claude-generated draft.",
  "human review required before publish.",
  "live serp validation is still required.",
  "use this article as a working brief.",
  "validate sources before publishing.",
].map(normalizedKey);

/** The one confirmed real-world template (verified against the live corpus): every CTA leak in the 56 articles uses this exact body, only the title differs. */
export const DRAFT_CTA_TEMPLATE_BODY = "Use this article as a working brief, then validate sources, internal links, and live SERP assumptions before publishing.";
export const NEUTRAL_CTA_BODY = "Apply the guidance in this article, or talk to our team about doing it for you.";

/** Loose substring indicators used only to power the read-only audit/manual-review report — never used to drive an automatic edit. */
const WORKFLOW_LEAK_INDICATORS = ["claude-generated", "working brief", "validate sources", "serp validation", "human review required", "before publish"];

export type WorkflowLeakSignal = { blockIndex: number; blockType: string; exactAutoFixable: boolean; snippet: string };

/**
 * READ-ONLY signal for the audit report: any block whose text contains a
 * known internal-workflow indicator, tagged with whether it also qualifies
 * for the narrow auto-fix (whole exact-sentence paragraph, or the exact CTA
 * template body) or needs a human (everything else, e.g. the phrase
 * embedded in a longer sentence, list item, or unknown block type).
 */
export function detectInternalWorkflowLeak(blocks: InsightBlock[]): WorkflowLeakSignal[] {
  const signals: WorkflowLeakSignal[] = [];
  blocks.forEach((block, blockIndex) => {
    const text = blockPlainText(block);
    if (!text) return;
    const lower = text.toLowerCase();
    if (!WORKFLOW_LEAK_INDICATORS.some((indicator) => lower.includes(indicator))) return;
    const exactAutoFixable =
      (block.type === "paragraph" && EXACT_INTERNAL_SENTENCES.includes(normalizedKey(block.text))) ||
      (block.type === "cta" && normalizedKey(block.body) === normalizedKey(DRAFT_CTA_TEMPLATE_BODY));
    signals.push({ blockIndex, blockType: block.type, exactAutoFixable, snippet: text.slice(0, 160) });
  });
  return signals;
}

// ---------------------------------------------------------------------------
// Detectors
// ---------------------------------------------------------------------------

export function countDirectAnswerBlocks(blocks: InsightBlock[]): number {
  return blocks.filter((block) => block.type === "direct-answer").length;
}
export function countFaqBlocks(blocks: InsightBlock[]): number {
  return blocks.filter((block) => block.type === "faq").length;
}
export function countFaqHeadings(blocks: InsightBlock[]): number {
  return blocks.filter(isFaqHeading).length;
}
export function countBodyVisuals(blocks: InsightBlock[]): number {
  return blocks.filter((block) => block.type === "image" || block.type === "video").length;
}
export function countRelatedArticleSlugs(article: InsightArticle): number {
  return article.internalLinking.relatedArticleSlugs.length;
}

export type DuplicateOpeningParagraphMatch = { directAnswerBlockIndex: number; duplicateParagraphBlockIndex: number };

/** A paragraph immediately after the Direct Answer that repeats it verbatim (exact match after whitespace normalization). */
export function detectDuplicateOpeningParagraph(blocks: InsightBlock[]): DuplicateOpeningParagraphMatch | null {
  const directAnswerIndex = blocks.findIndex((block) => block.type === "direct-answer");
  if (directAnswerIndex === -1) return null;
  const directAnswer = blocks[directAnswerIndex];
  if (directAnswer.type !== "direct-answer") return null;
  const nextBlock = blocks[directAnswerIndex + 1];
  if (!nextBlock || nextBlock.type !== "paragraph") return null;

  const answerKey = normalizedKey(directAnswer.answer);
  const titleAnswerKey = normalizedKey(`${directAnswer.title} ${directAnswer.answer}`);
  const paragraphKey = normalizedKey(nextBlock.text);
  if (!paragraphKey) return null;
  if (paragraphKey === answerKey || paragraphKey === titleAnswerKey) {
    return { directAnswerBlockIndex: directAnswerIndex, duplicateParagraphBlockIndex: directAnswerIndex + 1 };
  }
  return null;
}

export type FaqItemMatch = {
  itemIndex: number;
  kind: "exact" | "paraphrase" | "none";
  /** Block index(es) of the prose representation of this FAQ item (combined Q+A paragraph, or separate question/answer blocks). */
  proseBlockIndexes: number[];
};

export type FaqAssessment = {
  faqBlockIndex: number;
  totalItems: number;
  items: FaqItemMatch[];
  exactCount: number;
  paraphraseCount: number;
  /** True only when every FAQ item's prose duplicate (if any) was an exact match — i.e. safe to fully auto-clean, including the duplicate heading. */
  fullyResolvableByExactRemoval: boolean;
};

/**
 * Task 6 — classifies every FAQ item's prose counterpart (if any) as an
 * `exact` duplicate (safe to auto-remove), a `paraphrase` (question matches
 * but the answer wording differs — manual review only, never auto-removed),
 * or `none` (no prose counterpart found).
 */
export function assessFaqProse(blocks: InsightBlock[]): FaqAssessment | null {
  const faqBlockIndex = blocks.findIndex((block) => block.type === "faq");
  if (faqBlockIndex === -1) return null;
  const faqBlock = blocks[faqBlockIndex];
  if (faqBlock.type !== "faq") return null;

  const items: FaqItemMatch[] = faqBlock.items.map((item, itemIndex) => {
    const questionKey = normalizedKey(item.question);
    const answerKey = normalizedKey(item.answer);
    const combinedKey = normalizedKey(`${item.question} ${item.answer}`);

    // Pattern A: one paragraph combining "Question? Answer..." (the real Core 56 import shape).
    for (let index = 0; index < blocks.length; index += 1) {
      if (index === faqBlockIndex) continue;
      const block = blocks[index];
      if (block.type !== "paragraph") continue;
      const text = normalizedKey(block.text);
      if (!text.startsWith(questionKey) || questionKey.length === 0) continue;
      if (text === combinedKey) return { itemIndex, kind: "exact", proseBlockIndexes: [index] };
      return { itemIndex, kind: "paraphrase", proseBlockIndexes: [index] };
    }

    // Pattern B: separate question block followed immediately by an answer block.
    for (let index = 0; index < blocks.length; index += 1) {
      if (index === faqBlockIndex) continue;
      const block = blocks[index];
      const text = normalizedKey(blockPlainText(block));
      if (text !== questionKey || questionKey.length === 0) continue;
      const nextBlock = blocks[index + 1];
      if (!nextBlock) continue;
      const nextText = normalizedKey(blockPlainText(nextBlock));
      if (nextText === answerKey) return { itemIndex, kind: "exact", proseBlockIndexes: [index, index + 1] };
      if (nextBlock.type === "paragraph" || nextBlock.type === "heading") {
        return { itemIndex, kind: "paraphrase", proseBlockIndexes: [index, index + 1] };
      }
    }

    return { itemIndex, kind: "none", proseBlockIndexes: [] };
  });

  const exactCount = items.filter((item) => item.kind === "exact").length;
  const paraphraseCount = items.filter((item) => item.kind === "paraphrase").length;

  return {
    faqBlockIndex,
    totalItems: faqBlock.items.length,
    items,
    exactCount,
    paraphraseCount,
    fullyResolvableByExactRemoval: paraphraseCount === 0 && exactCount > 0,
  };
}

export type MarkdownPipeTableMatch = {
  blockIndexes: number[];
  columns: string[];
  rows: string[][];
  ambiguous: boolean;
  reason?: string;
};

function splitPipeRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return trimmed.split("|").map((cell) => cell.trim());
}
const SEPARATOR_CELL_PATTERN = /^:?-{1,}:?$/;
function isPipeLine(line: string): boolean {
  return line.startsWith("|") && line.endsWith("|");
}
function pipeOnlyLines(block: InsightBlock): string[] | null {
  if (block.type !== "paragraph") return null;
  const lines = block.text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length || !lines.every(isPipeLine)) return null;
  return lines;
}
function evaluatePipeLines(blockIndexes: number[], lines: string[]): MarkdownPipeTableMatch {
  const [headerLine, separatorLine, ...bodyLines] = lines;
  const separatorCells = splitPipeRow(separatorLine ?? "");
  const isSeparator = separatorCells.length > 0 && separatorCells.every((cell) => SEPARATOR_CELL_PATTERN.test(cell));
  if (!isSeparator) return { blockIndexes, columns: [], rows: [], ambiguous: true, reason: "No valid markdown table separator row found." };
  const columns = splitPipeRow(headerLine ?? "");
  const rows = bodyLines.map(splitPipeRow);
  const columnCount = columns.length;
  const consistent = columnCount > 0 && rows.every((row) => row.length === columnCount);
  if (!consistent) return { blockIndexes, columns, rows, ambiguous: true, reason: "Inconsistent column counts across table rows." };
  if (!columns.some(Boolean)) return { blockIndexes, columns, rows, ambiguous: true, reason: "Empty header row." };
  return { blockIndexes, columns, rows, ambiguous: false };
}

/**
 * Markdown pipe tables that never got parsed into a real table block —
 * either one paragraph block with embedded newlines, or (the real Core 56
 * import shape) a contiguous run of paragraph blocks, one per row.
 */
export function detectMarkdownPipeTableParagraphs(blocks: InsightBlock[]): MarkdownPipeTableMatch[] {
  const matches: MarkdownPipeTableMatch[] = [];
  let index = 0;
  while (index < blocks.length) {
    const lines = pipeOnlyLines(blocks[index]);
    if (!lines) {
      index += 1;
      continue;
    }
    if (lines.length >= 2) {
      matches.push(evaluatePipeLines([index], lines));
      index += 1;
      continue;
    }
    const runIndexes = [index];
    const runLines = [...lines];
    let cursor = index + 1;
    while (cursor < blocks.length) {
      const nextLines = pipeOnlyLines(blocks[cursor]);
      if (!nextLines || nextLines.length !== 1) break;
      runIndexes.push(cursor);
      runLines.push(...nextLines);
      cursor += 1;
    }
    if (runLines.length >= 2) matches.push(evaluatePipeLines(runIndexes, runLines));
    index = cursor;
  }
  return matches;
}

export type SourceClaimGap = { sourceId: string; title: string };

export function detectUnmappedSources(article: InsightArticle): SourceClaimGap[] {
  const referenced = new Set<string>();
  for (const claim of article.contentEvidence.claims) for (const sourceId of claim.sourceIds) referenced.add(sourceId);
  for (const block of article.blocks) {
    if (block.type === "evidence") for (const sourceId of block.sourceIds) referenced.add(sourceId);
    if (block.type === "statistic" && block.sourceId) referenced.add(block.sourceId);
  }
  return article.contentEvidence.sources.filter((source) => !referenced.has(source.id)).map((source) => ({ sourceId: source.id, title: source.title }));
}

export type MetadataWarning = { field: "metaTitle" | "metaDescription"; length: number; issue: "too-long" | "too-short" };

export function detectMetadataLengthWarnings(article: InsightArticle): MetadataWarning[] {
  const warnings: MetadataWarning[] = [];
  const { metaTitle, metaDescription } = article.metadata;
  if (metaTitle.length > 60) warnings.push({ field: "metaTitle", length: metaTitle.length, issue: "too-long" });
  if (metaTitle.length > 0 && metaTitle.length < 30) warnings.push({ field: "metaTitle", length: metaTitle.length, issue: "too-short" });
  if (metaDescription.length > 160) warnings.push({ field: "metaDescription", length: metaDescription.length, issue: "too-long" });
  return warnings;
}

export type SlugWarning = { slug: string; length: number; likelyTruncated: boolean; likelyMidWordCut: boolean };

export function detectSlugWarning(slug: string): SlugWarning | null {
  const length = slug.length;
  const likelyTruncated = length >= 75;
  if (!likelyTruncated) return null;
  const lastSegment = slug.split("-").pop() ?? "";
  return { slug, length, likelyTruncated, likelyMidWordCut: lastSegment.length > 0 && lastSegment.length <= 3 };
}

// ---------------------------------------------------------------------------
// Task 3/6 — pure transforms over InsightBlock[] (paired 1:1 with Tiptap
// nodes by `transformEditorDocument` below; never called with mismatched
// arrays outside that pairing)
// ---------------------------------------------------------------------------

export type TransformResult = { blocks: InsightBlock[]; changed: boolean; warnings: string[]; needsManualReview: string[] };

function noopResult(blocks: InsightBlock[]): TransformResult {
  return { blocks, changed: false, warnings: [], needsManualReview: [] };
}

export function removeDuplicateOpeningParagraph(blocks: InsightBlock[]): TransformResult {
  const match = detectDuplicateOpeningParagraph(blocks);
  if (!match) return noopResult(blocks);
  const next = blocks.filter((_, index) => index !== match.duplicateParagraphBlockIndex);
  return {
    blocks: next,
    changed: true,
    warnings: [`Removed duplicate opening paragraph at block ${match.duplicateParagraphBlockIndex} (repeats the Direct Answer).`],
    needsManualReview: [],
  };
}

/**
 * Task 6: only exact-match FAQ items are removed from prose, and the
 * duplicate FAQ heading is only removed alongside them when every item was
 * resolvable exactly (no paraphrased prose left behind).
 */
export function removeExactDuplicateFaqProse(blocks: InsightBlock[]): TransformResult {
  const assessment = assessFaqProse(blocks);
  if (!assessment || assessment.exactCount === 0) return noopResult(blocks);

  const exactBlockIndexes = new Set(assessment.items.filter((item) => item.kind === "exact").flatMap((item) => item.proseBlockIndexes));
  const warnings = [`Removed ${assessment.exactCount}/${assessment.totalItems} exact-duplicate FAQ prose item(s).`];
  const needsManualReview = assessment.paraphraseCount > 0 ? [`${assessment.paraphraseCount}/${assessment.totalItems} FAQ item(s) have paraphrased (not exact) prose duplicates — left in place for manual reconciliation.`] : [];

  let removeSet = new Set(exactBlockIndexes);
  if (assessment.fullyResolvableByExactRemoval) {
    const firstRemoved = Math.min(...removeSet);
    const precedingIndex = firstRemoved - 1;
    const precedingBlock = precedingIndex >= 0 ? blocks[precedingIndex] : undefined;
    if (precedingBlock && isFaqHeading(precedingBlock) && countFaqHeadings(blocks) > 1) {
      removeSet = new Set([...removeSet, precedingIndex]);
      warnings.push(`Removed duplicate FAQ heading at block ${precedingIndex} (prose section was fully and exactly resolved).`);
    }
  }

  const next = blocks.filter((_, index) => !removeSet.has(index));
  return { blocks: next, changed: true, warnings, needsManualReview };
}

/** Task 7: only an exact, whole-sentence match to a known internal-workflow template is auto-removed. */
export function removeExactInternalWorkflowSentences(blocks: InsightBlock[]): TransformResult {
  const warnings: string[] = [];
  let changed = false;
  const next = blocks.filter((block, index) => {
    if (block.type !== "paragraph") return true;
    if (!EXACT_INTERNAL_SENTENCES.includes(normalizedKey(block.text))) return true;
    changed = true;
    warnings.push(`Removed block ${index} (exact match to a known internal-workflow sentence template).`);
    return false;
  });
  return { blocks: next, changed, warnings, needsManualReview: [] };
}

/**
 * Task 8: preserves the CTA's title and both links exactly; replaces only
 * the body, and only when it is an exact match to the one confirmed
 * internal-workflow CTA template. Anything else (paraphrased or unknown
 * CTA copy) is left untouched and flagged for manual review.
 */
export function replaceDraftCtaBody(blocks: InsightBlock[]): TransformResult {
  const warnings: string[] = [];
  const needsManualReview: string[] = [];
  let changed = false;
  const next = blocks.map((block, index) => {
    if (block.type !== "cta") return block;
    const bodyKey = normalizedKey(block.body);
    if (bodyKey === normalizedKey(DRAFT_CTA_TEMPLATE_BODY)) {
      changed = true;
      warnings.push(`Replaced the internal-workflow CTA body at block ${index}; title and links preserved unchanged.`);
      return { ...block, body: NEUTRAL_CTA_BODY };
    }
    if (WORKFLOW_LEAK_INDICATORS.some((indicator) => bodyKey.includes(indicator))) {
      needsManualReview.push(`Block ${index} is a CTA that may contain internal-workflow language but doesn't exactly match the known template — left unchanged for manual review.`);
    }
    return block;
  });
  return { blocks: next, changed, warnings, needsManualReview };
}

export function convertMarkdownPipeTableToBlock(blocks: InsightBlock[]): TransformResult {
  const matches = detectMarkdownPipeTableParagraphs(blocks);
  if (!matches.length) return noopResult(blocks);
  const warnings: string[] = [];
  const needsManualReview: string[] = [];
  let changed = false;
  const next: InsightBlock[] = [];
  const consumed = new Set<number>();
  blocks.forEach((block, index) => {
    if (consumed.has(index)) return;
    const match = matches.find((m) => m.blockIndexes[0] === index);
    if (!match) {
      next.push(block);
      return;
    }
    for (const i of match.blockIndexes) consumed.add(i);
    const label = match.blockIndexes.length > 1 ? `blocks ${match.blockIndexes.join("-")}` : `block ${match.blockIndexes[0]}`;
    if (match.ambiguous) {
      needsManualReview.push(`${label} looks like a markdown table but is ambiguous (${match.reason}); left as-is for manual review.`);
      for (const i of match.blockIndexes) next.push(blocks[i]);
      return;
    }
    changed = true;
    warnings.push(`Converted markdown pipe-table at ${label} into a comparison-table block.`);
    next.push({ type: "comparison-table", caption: "", columns: match.columns, rows: match.rows });
  });
  return { blocks: next, changed, warnings, needsManualReview };
}

export type RemediationDiff = {
  changed: boolean;
  beforeBlockCount: number;
  afterBlockCount: number;
  warnings: string[];
  needsManualReview: string[];
  blocks: InsightBlock[];
};

/**
 * Runs every safe transform once, in a fixed order. Never touches
 * factCheckStatus, slug, sources, claims, metadata, or URLs — only
 * `blocks`. Idempotent: re-running on its own output is a no-op.
 */
export function remediateArticleBlocks(blocks: InsightBlock[]): RemediationDiff {
  const beforeBlockCount = blocks.length;
  const warnings: string[] = [];
  const needsManualReview: string[] = [];
  let changed = false;
  let current = blocks;

  for (const step of [removeDuplicateOpeningParagraph, removeExactDuplicateFaqProse, removeExactInternalWorkflowSentences, replaceDraftCtaBody, convertMarkdownPipeTableToBlock]) {
    const result = step(current);
    current = result.blocks;
    changed = changed || result.changed;
    warnings.push(...result.warnings);
    needsManualReview.push(...result.needsManualReview);
  }

  return { changed, beforeBlockCount, afterBlockCount: current.length, warnings, needsManualReview, blocks: current };
}

// ---------------------------------------------------------------------------
// Task 9 — transform the Tiptap editorDocument directly (preferred approach)
// ---------------------------------------------------------------------------

export type TiptapNode = { type?: string; attrs?: Record<string, unknown>; content?: TiptapNode[]; text?: string; marks?: unknown[] };
export type TiptapDocument = { type: string; content: TiptapNode[] };

export type EditorDocumentTransformResult =
  | { ok: true; document: TiptapDocument; blocks: InsightBlock[]; diff: RemediationDiff }
  | { ok: false; reason: string };

function buildComparisonTableNode(columns: string[], rows: string[][]): TiptapNode {
  return { type: "structuredBlock", attrs: { blockType: "comparison-table", data: { type: "comparison-table", caption: "", columns, rows } } };
}

/**
 * Applies the same defect fixes as `remediateArticleBlocks`, but by editing
 * the Tiptap node tree directly (removing/replacing nodes at the same index
 * as the corresponding block) rather than reconstructing the whole document
 * from `blocks`. Every node NOT touched by a fix is passed through
 * byte-for-byte, so inline marks, heading ids, media ids, and links on
 * unrelated content are never at risk.
 *
 * Refuses (returns `ok: false`) whenever the top-level Tiptap node count
 * doesn't match the normalized block count 1:1 — that correspondence is
 * required to safely map a block-level fix back to the right Tiptap node,
 * and when it doesn't hold the article is routed to manual review instead
 * of risking an incorrect edit.
 */
export function transformEditorDocument(document: unknown): EditorDocumentTransformResult {
  const doc = document as TiptapDocument;
  if (!doc || typeof doc !== "object" || doc.type !== "doc" || !Array.isArray(doc.content)) {
    return { ok: false, reason: "editorDocument is not a valid Tiptap document." };
  }

  let blocksFromDoc: InsightBlock[];
  try {
    blocksFromDoc = normalizeTiptapToInsightBlocks(doc);
  } catch (error) {
    return { ok: false, reason: `editorDocument failed to normalize: ${error instanceof Error ? error.message : String(error)}` };
  }

  if (blocksFromDoc.length !== doc.content.length) {
    return {
      ok: false,
      reason: `editorDocument has ${doc.content.length} top-level node(s) but normalizes to ${blocksFromDoc.length} block(s); node-to-block correspondence cannot be safely assumed.`,
    };
  }

  type Pair = { block: InsightBlock; node: TiptapNode };
  let pairs: Pair[] = blocksFromDoc.map((block, index) => ({ block, node: doc.content[index] }));
  const warnings: string[] = [];
  const needsManualReview: string[] = [];
  let changed = false;

  // 1) duplicate opening paragraph
  {
    const match = detectDuplicateOpeningParagraph(pairs.map((p) => p.block));
    if (match) {
      pairs = pairs.filter((_, index) => index !== match.duplicateParagraphBlockIndex);
      changed = true;
      warnings.push(`Removed duplicate opening paragraph node at position ${match.duplicateParagraphBlockIndex} (repeats the Direct Answer).`);
    }
  }

  // 2) exact-duplicate FAQ prose (+ duplicate heading only if fully resolved)
  {
    const currentBlocks = pairs.map((p) => p.block);
    const assessment = assessFaqProse(currentBlocks);
    if (assessment && assessment.exactCount > 0) {
      const exactIndexes = new Set(assessment.items.filter((i) => i.kind === "exact").flatMap((i) => i.proseBlockIndexes));
      warnings.push(`Removed ${assessment.exactCount}/${assessment.totalItems} exact-duplicate FAQ prose node(s).`);
      if (assessment.paraphraseCount > 0) {
        needsManualReview.push(`${assessment.paraphraseCount}/${assessment.totalItems} FAQ item(s) have paraphrased (not exact) prose duplicates — left in place for manual reconciliation.`);
      }
      let removeSet = exactIndexes;
      if (assessment.fullyResolvableByExactRemoval) {
        const firstRemoved = Math.min(...removeSet);
        const precedingIndex = firstRemoved - 1;
        const precedingBlock = precedingIndex >= 0 ? currentBlocks[precedingIndex] : undefined;
        if (precedingBlock && isFaqHeading(precedingBlock) && countFaqHeadings(currentBlocks) > 1) {
          removeSet = new Set([...removeSet, precedingIndex]);
          warnings.push(`Removed duplicate FAQ heading node at position ${precedingIndex} (prose section was fully and exactly resolved).`);
        }
      }
      pairs = pairs.filter((_, index) => !removeSet.has(index));
      changed = true;
    }
  }

  // 3) exact internal-workflow sentence paragraphs (defense in depth)
  {
    const before = pairs.length;
    pairs = pairs.filter((pair, index) => {
      if (pair.block.type !== "paragraph") return true;
      if (!EXACT_INTERNAL_SENTENCES.includes(normalizedKey(pair.block.text))) return true;
      warnings.push(`Removed node at position ${index} (exact match to a known internal-workflow sentence template).`);
      return false;
    });
    if (pairs.length !== before) changed = true;
  }

  // 4) CTA exact-template body swap — modifies the node in place, preserving every other attribute.
  pairs = pairs.map((pair, index) => {
    if (pair.block.type !== "cta") return pair;
    const bodyKey = normalizedKey(pair.block.body);
    if (bodyKey === normalizedKey(DRAFT_CTA_TEMPLATE_BODY)) {
      changed = true;
      warnings.push(`Replaced the internal-workflow CTA body at node ${index}; title and links preserved unchanged.`);
      const newBlock: InsightBlock = { ...pair.block, body: NEUTRAL_CTA_BODY };
      const newNode: TiptapNode = {
        ...pair.node,
        attrs: { ...pair.node.attrs, data: { ...(pair.node.attrs?.data as Record<string, unknown> | undefined), body: NEUTRAL_CTA_BODY } },
      };
      return { block: newBlock, node: newNode };
    }
    if (WORKFLOW_LEAK_INDICATORS.some((indicator) => bodyKey.includes(indicator))) {
      needsManualReview.push(`Node ${index} is a CTA that may contain internal-workflow language but doesn't exactly match the known template — left unchanged for manual review.`);
    }
    return pair;
  });

  // 5) markdown pipe-table paragraph run -> one comparison-table structured-block node.
  {
    const currentBlocks = pairs.map((p) => p.block);
    const matches = detectMarkdownPipeTableParagraphs(currentBlocks);
    if (matches.length) {
      const nextPairs: Pair[] = [];
      const consumed = new Set<number>();
      pairs.forEach((pair, index) => {
        if (consumed.has(index)) return;
        const match = matches.find((m) => m.blockIndexes[0] === index);
        if (!match) {
          nextPairs.push(pair);
          return;
        }
        for (const i of match.blockIndexes) consumed.add(i);
        const label = match.blockIndexes.length > 1 ? `nodes ${match.blockIndexes.join("-")}` : `node ${match.blockIndexes[0]}`;
        if (match.ambiguous) {
          needsManualReview.push(`${label} looks like a markdown table but is ambiguous (${match.reason}); left as-is for manual review.`);
          for (const i of match.blockIndexes) nextPairs.push(pairs[i]);
          return;
        }
        changed = true;
        warnings.push(`Converted markdown pipe-table at ${label} into one comparison-table node.`);
        nextPairs.push({
          block: { type: "comparison-table", caption: "", columns: match.columns, rows: match.rows },
          node: buildComparisonTableNode(match.columns, match.rows),
        });
      });
      pairs = nextPairs;
    }
  }

  const newDocument: TiptapDocument = { ...doc, content: pairs.map((p) => p.node) };
  const finalBlocks = normalizeTiptapToInsightBlocks(newDocument);

  return {
    ok: true,
    document: newDocument,
    blocks: finalBlocks,
    diff: {
      changed,
      beforeBlockCount: blocksFromDoc.length,
      afterBlockCount: finalBlocks.length,
      warnings,
      needsManualReview,
      blocks: finalBlocks,
    },
  };
}
