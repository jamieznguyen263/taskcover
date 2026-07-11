import type { InsightArticle, InsightBlock } from "@/content/insights.types";
import { richTextToPlainText } from "@/lib/insights/rich-text";

/**
 * Sprint S00 — Core 56 portfolio hygiene.
 *
 * Pure, unit-tested detectors and transforms operating on a single article's
 * `blocks: InsightBlock[]`. No DB access, no network access, no mutation of
 * factCheckStatus/slug/sources/claims/metadata/URLs/workflow state. Anything
 * ambiguous is reported for manual review instead of being auto-fixed.
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
      return richTextToPlainText(block.text);
    case "heading":
      return block.text;
    case "bullet-list":
    case "numbered-list":
      return block.items.map(richTextToPlainText).join(" ");
    case "quote":
      return richTextToPlainText(block.quote);
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
// Task B — detectors (read-only)
// ---------------------------------------------------------------------------

export const INTERNAL_WORKFLOW_PHRASES = [
  "claude-generated draft",
  "claude generated draft",
  "human review required before publish",
  "live serp validation is still required",
  "use this article as a working brief",
  "validate sources before publishing",
  "pending serp validation",
  "validate before publishing",
  "working brief",
] as const;

export type WorkflowPhraseMatch = {
  blockIndex: number;
  phrase: string;
  snippet: string;
};

export function detectInternalWorkflowPhrases(blocks: InsightBlock[]): WorkflowPhraseMatch[] {
  const matches: WorkflowPhraseMatch[] = [];
  blocks.forEach((block, blockIndex) => {
    const text = blockPlainText(block).toLowerCase();
    if (!text) return;
    for (const phrase of INTERNAL_WORKFLOW_PHRASES) {
      if (text.includes(phrase)) {
        matches.push({ blockIndex, phrase, snippet: blockPlainText(block).slice(0, 160) });
      }
    }
  });
  return matches;
}

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

export type DuplicateOpeningParagraphMatch = {
  directAnswerBlockIndex: number;
  duplicateParagraphBlockIndex: number;
};

/** Task B/C-1: a paragraph immediately after the Direct Answer that repeats it verbatim. */
export function detectDuplicateOpeningParagraph(blocks: InsightBlock[]): DuplicateOpeningParagraphMatch | null {
  const directAnswerIndex = blocks.findIndex((block) => block.type === "direct-answer");
  if (directAnswerIndex === -1) return null;
  const directAnswer = blocks[directAnswerIndex];
  if (directAnswer.type !== "direct-answer") return null;
  const nextBlock = blocks[directAnswerIndex + 1];
  if (!nextBlock || nextBlock.type !== "paragraph") return null;

  const answerKey = normalizedKey(directAnswer.answer);
  const titleAnswerKey = normalizedKey(`${directAnswer.title} ${directAnswer.answer}`);
  const paragraphKey = normalizedKey(richTextToPlainText(nextBlock.text));
  if (!paragraphKey) return null;
  if (paragraphKey === answerKey || paragraphKey === titleAnswerKey) {
    return { directAnswerBlockIndex: directAnswerIndex, duplicateParagraphBlockIndex: directAnswerIndex + 1 };
  }
  return null;
}

export type DuplicateFaqProseMatch = {
  faqBlockIndex: number;
  duplicatedItemCount: number;
  totalItemCount: number;
  removableBlockIndexes: number[];
  fullyDuplicated: boolean;
};

/**
 * Task B/C-2: prose Q/A pairs elsewhere in the body that duplicate the
 * structured `faq` block. Only pairs where BOTH the question and the answer
 * match a FAQ item exactly (normalized) are treated as safe/removable; a
 * partial match is left for manual review rather than guessed at.
 */
export function detectDuplicateFaqProse(blocks: InsightBlock[]): DuplicateFaqProseMatch | null {
  const faqBlockIndex = blocks.findIndex((block) => block.type === "faq");
  if (faqBlockIndex === -1) return null;
  const faqBlock = blocks[faqBlockIndex];
  if (faqBlock.type !== "faq") return null;

  const questionKeys = new Map(faqBlock.items.map((item) => [normalizedKey(item.question), normalizedKey(item.answer)] as const));
  const removableBlockIndexes: number[] = [];
  const duplicatedQuestions = new Set<string>();

  for (let index = 0; index < blocks.length; index += 1) {
    if (index === faqBlockIndex) continue;
    const block = blocks[index];
    const text = normalizedKey(blockPlainText(block));
    if (!text) continue;
    const questionMatch = [...questionKeys.keys()].find((question) => question === text);
    if (!questionMatch) continue;
    const expectedAnswer = questionKeys.get(questionMatch)!;
    const nextBlock = blocks[index + 1];
    const nextText = nextBlock ? normalizedKey(blockPlainText(nextBlock)) : "";
    if (nextBlock && (nextBlock.type === "paragraph" || nextBlock.type === "heading") && nextText === expectedAnswer) {
      removableBlockIndexes.push(index, index + 1);
      duplicatedQuestions.add(questionMatch);
    }
  }

  if (!removableBlockIndexes.length) return null;

  // Include an immediately preceding duplicate FAQ heading only if another
  // FAQ heading exists elsewhere (i.e. it's genuinely a second, redundant one).
  const sortedRemovable = [...new Set(removableBlockIndexes)].sort((a, b) => a - b);
  const firstRemovable = sortedRemovable[0]!;
  const precedingIndex = firstRemovable - 1;
  const precedingBlock = precedingIndex >= 0 ? blocks[precedingIndex] : undefined;
  const faqHeadingCount = countFaqHeadings(blocks);
  if (precedingBlock && isFaqHeading(precedingBlock) && faqHeadingCount > 1 && !sortedRemovable.includes(precedingIndex)) {
    sortedRemovable.unshift(precedingIndex);
  }

  return {
    faqBlockIndex,
    duplicatedItemCount: duplicatedQuestions.size,
    totalItemCount: faqBlock.items.length,
    removableBlockIndexes: sortedRemovable,
    fullyDuplicated: duplicatedQuestions.size === faqBlock.items.length,
  };
}

export type FaqProseRedundancyMatch = { faqBlockIndex: number; possiblyRedundantParagraphCount: number };

/**
 * Broader, READ-ONLY signal (not auto-fixable): paragraphs that open with a
 * FAQ item's question verbatim but go on to paraphrase (not exactly repeat)
 * the structured answer — a real "two FAQ presentations" defect that
 * `detectDuplicateFaqProse`/`removeDuplicateFaqProse` deliberately leaves
 * alone because the wording differs and merging them safely needs a human.
 */
export function detectFaqProseRedundancy(blocks: InsightBlock[]): FaqProseRedundancyMatch | null {
  const faqBlockIndex = blocks.findIndex((block) => block.type === "faq");
  if (faqBlockIndex === -1) return null;
  const faqBlock = blocks[faqBlockIndex];
  if (faqBlock.type !== "faq") return null;
  const questionKeys = faqBlock.items.map((item) => normalizedKey(item.question));

  let possiblyRedundantParagraphCount = 0;
  blocks.forEach((block, index) => {
    if (index === faqBlockIndex || block.type !== "paragraph") return;
    const text = normalizedKey(blockPlainText(block));
    if (!text) return;
    if (questionKeys.some((question) => question.length > 0 && text.startsWith(question))) {
      possiblyRedundantParagraphCount += 1;
    }
  });

  return possiblyRedundantParagraphCount > 0 ? { faqBlockIndex, possiblyRedundantParagraphCount } : null;
}

export type MarkdownPipeTableMatch = {
  /** Every block index this table candidate spans (1 for a single paragraph with embedded newlines, N for a run of one-row-per-block paragraphs). */
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

/** A paragraph block whose every non-empty line is a markdown pipe-table row (no narrative text mixed in). */
function pipeOnlyLines(block: InsightBlock): string[] | null {
  if (block.type !== "paragraph") return null;
  const text = richTextToPlainText(block.text);
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length || !lines.every(isPipeLine)) return null;
  return lines;
}

function evaluatePipeLines(blockIndexes: number[], lines: string[]): MarkdownPipeTableMatch {
  const [headerLine, separatorLine, ...bodyLines] = lines;
  const separatorCells = splitPipeRow(separatorLine ?? "");
  const isSeparator = separatorCells.length > 0 && separatorCells.every((cell) => SEPARATOR_CELL_PATTERN.test(cell));
  if (!isSeparator) {
    return { blockIndexes, columns: [], rows: [], ambiguous: true, reason: "No valid markdown table separator row found." };
  }

  const columns = splitPipeRow(headerLine ?? "");
  const rows = bodyLines.map(splitPipeRow);
  const columnCount = columns.length;
  const consistent = columnCount > 0 && rows.every((row) => row.length === columnCount);
  if (!consistent) {
    return { blockIndexes, columns, rows, ambiguous: true, reason: "Inconsistent column counts across table rows." };
  }
  if (!columns.some(Boolean)) {
    return { blockIndexes, columns, rows, ambiguous: true, reason: "Empty header row." };
  }
  return { blockIndexes, columns, rows, ambiguous: false };
}

/**
 * Task B/C-5: markdown pipe tables that never got parsed into a real table —
 * either (a) one paragraph block whose text contains embedded newlines with
 * every line being a pipe row, or (b) a contiguous run of paragraph blocks
 * where each block is exactly one pipe-table row (the shape produced when a
 * markdown table gets imported as one block per line).
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
      // Case (a): this single block already contains the whole table.
      matches.push(evaluatePipeLines([index], lines));
      index += 1;
      continue;
    }
    // Case (b): gather a contiguous run of single-pipe-line blocks.
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
    if (runLines.length >= 2) {
      matches.push(evaluatePipeLines(runIndexes, runLines));
    }
    index = cursor;
  }
  return matches;
}

export type SourceClaimGap = {
  sourceId: string;
  title: string;
};

/** Sources never referenced by any tracked claim or evidence block. */
export function detectUnmappedSources(article: InsightArticle): SourceClaimGap[] {
  const referenced = new Set<string>();
  for (const claim of article.contentEvidence.claims) {
    for (const sourceId of claim.sourceIds) referenced.add(sourceId);
  }
  for (const block of article.blocks) {
    if (block.type === "evidence") {
      for (const sourceId of block.sourceIds) referenced.add(sourceId);
    }
    if (block.type === "statistic" && block.sourceId) referenced.add(block.sourceId);
  }
  return article.contentEvidence.sources
    .filter((source) => !referenced.has(source.id))
    .map((source) => ({ sourceId: source.id, title: source.title }));
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
  const lastSegment = slug.split("-").pop() ?? "";
  const likelyMidWordCut = likelyTruncated && lastSegment.length > 0 && lastSegment.length <= 3;
  if (!likelyTruncated) return null;
  return { slug, length, likelyTruncated, likelyMidWordCut };
}

// ---------------------------------------------------------------------------
// Task C — pure transforms (each returns a diff, never mutates the input)
// ---------------------------------------------------------------------------

export type TransformResult = {
  blocks: InsightBlock[];
  changed: boolean;
  warnings: string[];
  needsManualReview: string[];
};

function noopResult(blocks: InsightBlock[]): TransformResult {
  return { blocks, changed: false, warnings: [], needsManualReview: [] };
}

/** Task C-1: remove a paragraph that exactly duplicates the Direct Answer. */
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

/** Task C-2: remove prose FAQ pairs that exactly duplicate the structured FAQ block. */
export function removeDuplicateFaqProse(blocks: InsightBlock[]): TransformResult {
  const match = detectDuplicateFaqProse(blocks);
  if (!match) return noopResult(blocks);
  const removeSet = new Set(match.removableBlockIndexes);
  const next = blocks.filter((_, index) => !removeSet.has(index));
  const warnings = [
    `Removed ${match.removableBlockIndexes.length} duplicate FAQ prose block(s) (${match.duplicatedItemCount}/${match.totalItemCount} FAQ items were duplicated in prose).`,
  ];
  const needsManualReview = match.fullyDuplicated
    ? []
    : [`Only ${match.duplicatedItemCount}/${match.totalItemCount} FAQ items had an exact prose duplicate; remaining prose (if any) was left in place for manual review.`];
  return { blocks: next, changed: true, warnings, needsManualReview };
}

function stripPhrasesFromText(text: string): { text: string; changed: boolean } {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const kept = sentences.filter((sentence) => {
    const lower = sentence.toLowerCase();
    return !INTERNAL_WORKFLOW_PHRASES.some((phrase) => lower.includes(phrase));
  });
  const result = kept.join(" ").trim();
  return { text: result, changed: result !== text.trim() };
}

/** Task C-3: strip leaked internal workflow language from plain-text blocks. */
export function removeInternalWorkflowPhrases(blocks: InsightBlock[]): TransformResult {
  const warnings: string[] = [];
  const needsManualReview: string[] = [];
  const next: InsightBlock[] = [];
  let changed = false;

  blocks.forEach((block, blockIndex) => {
    if (block.type === "paragraph" && typeof block.text === "string") {
      const matched = INTERNAL_WORKFLOW_PHRASES.some((phrase) => block.text.toString().toLowerCase().includes(phrase));
      if (!matched) {
        next.push(block);
        return;
      }
      const { text, changed: didChange } = stripPhrasesFromText(block.text as string);
      if (didChange) {
        changed = true;
        if (text) {
          next.push({ ...block, text });
          warnings.push(`Stripped internal workflow language from paragraph block ${blockIndex}.`);
        } else {
          warnings.push(`Removed paragraph block ${blockIndex} (contained only internal workflow language).`);
        }
      } else {
        next.push(block);
      }
      return;
    }
    if (block.type === "paragraph" && Array.isArray(block.text)) {
      const text = richTextToPlainText(block.text);
      const matched = INTERNAL_WORKFLOW_PHRASES.some((phrase) => text.toLowerCase().includes(phrase));
      if (matched) {
        needsManualReview.push(`Block ${blockIndex} contains internal workflow language but also has inline formatting/links — left for manual review to avoid destroying marks.`);
      }
      next.push(block);
      return;
    }
    // "cta" is deliberately excluded here — replaceDraftCta below is the
    // single owner of CTA remediation (it can do a full, real-link-aware
    // replacement instead of just stripping a sentence down to nothing).
    if ((block.type === "callout" || block.type === "expert-insight") && "body" in block) {
      const matched = INTERNAL_WORKFLOW_PHRASES.some((phrase) => block.body.toLowerCase().includes(phrase));
      if (matched) {
        const { text, changed: didChange } = stripPhrasesFromText(block.body);
        if (didChange && text) {
          changed = true;
          next.push({ ...block, body: text } as InsightBlock);
          warnings.push(`Stripped internal workflow language from ${block.type} block ${blockIndex}.`);
          return;
        }
        if (didChange && !text) {
          needsManualReview.push(`Block ${blockIndex} (${block.type}) would become empty after stripping internal workflow language — left for manual review.`);
        }
      }
    }
    next.push(block);
  });

  return { blocks: next, changed, warnings, needsManualReview };
}

/** Task C-6: collapse duplicate "Frequently asked questions" headings, keeping the first. */
export function normalizeDuplicateFaqHeadings(blocks: InsightBlock[]): TransformResult {
  let seen = false;
  let changed = false;
  const warnings: string[] = [];
  const next = blocks.filter((block, index) => {
    if (!isFaqHeading(block)) return true;
    if (!seen) {
      seen = true;
      return true;
    }
    changed = true;
    warnings.push(`Removed duplicate FAQ heading at block ${index}.`);
    return false;
  });
  return { blocks: next, changed, warnings, needsManualReview: [] };
}

/** Task C-5: convert an unambiguous markdown pipe table paragraph into a comparison-table block. */
export function convertMarkdownPipeTableToBlock(blocks: InsightBlock[]): TransformResult {
  const matches = detectMarkdownPipeTableParagraphs(blocks);
  if (!matches.length) return noopResult(blocks);

  const warnings: string[] = [];
  const needsManualReview: string[] = [];
  let changed = false;
  const next: InsightBlock[] = [];
  const consumedIndexes = new Set<number>();

  blocks.forEach((block, index) => {
    if (consumedIndexes.has(index)) return;
    const match = matches.find((m) => m.blockIndexes[0] === index);
    if (!match) {
      next.push(block);
      return;
    }
    for (const consumed of match.blockIndexes) consumedIndexes.add(consumed);
    const label = match.blockIndexes.length > 1 ? `blocks ${match.blockIndexes.join("-")}` : `block ${match.blockIndexes[0]}`;
    if (match.ambiguous) {
      needsManualReview.push(`${label} looks like a markdown table but is ambiguous (${match.reason}); left as-is for manual review.`);
      for (const consumed of match.blockIndexes) next.push(blocks[consumed]);
      return;
    }
    changed = true;
    warnings.push(`Converted markdown pipe-table at ${label} into a comparison-table block.`);
    next.push({ type: "comparison-table", caption: "", columns: match.columns, rows: match.rows });
  });

  return { blocks: next, changed, warnings, needsManualReview };
}

/**
 * Task C-4: replace an internal-workflow-flavored CTA with a neutral CTA,
 * only when a real service destination already exists in internalLinking.
 */
export function replaceDraftCta(article: InsightArticle): TransformResult {
  const realLink =
    article.internalLinking.serviceLinks[0] ??
    article.internalLinking.requiredInternalLinks[0] ??
    article.internalLinking.suggestedInternalLinks[0];

  const needsManualReview: string[] = [];
  const warnings: string[] = [];
  let changed = false;

  const next = article.blocks.map((block, index) => {
    if (block.type !== "cta") return block;
    const combinedText = `${block.title} ${block.body} ${block.primary.label}`.toLowerCase();
    const isInternalPhrasing = INTERNAL_WORKFLOW_PHRASES.some((phrase) => combinedText.includes(phrase));
    if (!isInternalPhrasing) return block;
    if (!realLink) {
      needsManualReview.push(`Block ${index} is a draft-oriented CTA but no real service link exists in internalLinking to replace it with.`);
      return block;
    }
    changed = true;
    warnings.push(`Replaced draft-oriented CTA at block ${index} with a neutral CTA pointing to ${realLink.href}.`);
    const replaced: InsightBlock = {
      type: "cta",
      title: "Ready to act on this?",
      body: "Talk to Taskcover about applying this to your business.",
      primary: { label: realLink.label, href: realLink.href },
      secondary: block.secondary,
    };
    return replaced;
  });

  return { blocks: next, changed, warnings, needsManualReview };
}

// ---------------------------------------------------------------------------
// Composition
// ---------------------------------------------------------------------------

export type RemediationDiff = {
  changed: boolean;
  beforeBlockCount: number;
  afterBlockCount: number;
  warnings: string[];
  needsManualReview: string[];
  blocks: InsightBlock[];
};

/**
 * Runs every safe transform once, in a fixed order, and returns the combined
 * diff. Never touches factCheckStatus, slug, sources, claims, metadata, or
 * URLs — only `blocks`. Idempotent: running it again on its own output is a
 * no-op (every transform only fires on a defect signature that no longer
 * exists once fixed).
 */
export function remediateArticleBlocks(article: InsightArticle): RemediationDiff {
  const beforeBlockCount = article.blocks.length;
  const warnings: string[] = [];
  const needsManualReview: string[] = [];
  let changed = false;
  let blocks = article.blocks;

  for (const step of [
    () => removeDuplicateOpeningParagraph(blocks),
    () => removeDuplicateFaqProse(blocks),
    () => normalizeDuplicateFaqHeadings(blocks),
    () => removeInternalWorkflowPhrases(blocks),
    () => convertMarkdownPipeTableToBlock(blocks),
  ]) {
    const result = step();
    blocks = result.blocks;
    changed = changed || result.changed;
    warnings.push(...result.warnings);
    needsManualReview.push(...result.needsManualReview);
  }

  const ctaResult = replaceDraftCta({ ...article, blocks });
  blocks = ctaResult.blocks;
  changed = changed || ctaResult.changed;
  warnings.push(...ctaResult.warnings);
  needsManualReview.push(...ctaResult.needsManualReview);

  return {
    changed,
    beforeBlockCount,
    afterBlockCount: blocks.length,
    warnings,
    needsManualReview,
    blocks,
  };
}
