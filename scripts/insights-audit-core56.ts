import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import type { InsightArticle } from "../src/content/insights.types";
import { articleDraftSchema } from "../src/lib/admin/validation";
import {
  countBodyVisuals,
  countDirectAnswerBlocks,
  countFaqBlocks,
  countFaqHeadings,
  countRelatedArticleSlugs,
  detectDuplicateFaqProse,
  detectDuplicateOpeningParagraph,
  detectFaqProseRedundancy,
  detectInternalWorkflowPhrases,
  detectMarkdownPipeTableParagraphs,
  detectMetadataLengthWarnings,
  detectSlugWarning,
  detectUnmappedSources,
} from "../src/lib/admin/core56-hygiene";

/**
 * Sprint S00, Task B — read-only audit of the 56 Core English articles.
 *
 * Reads the PUBLISHED English snapshot for every `core56-*` article group
 * (falls back to the draft snapshot, or to the local backfill content
 * modules, when a published snapshot doesn't exist yet) and reports every
 * hygiene defect from the sprint brief per article. Makes NO database
 * writes. Safe to run against any environment.
 *
 * Usage:
 *   npm run insights:audit-core56
 *   npm run insights:audit-core56 -- --source=backfill   (skip the DB entirely)
 */

type Manifest = {
  articleCount: number;
  batches: { slug: string; title: string; articleIds: string[] }[];
  articles: { articleId: string; batchSlug: string; title: string; slug: string; primaryKeyword: string; moneyPage: string }[];
};

type TrackerRow = Record<string, string>;

type ArticleSource = "published-db" | "draft-db" | "backfill-file" | "missing";

type ArticleAudit = {
  articleId: string;
  groupId: string | null;
  creationKey: string | null;
  source: ArticleSource;
  status: string | null;
  publishedRevisionId: string | null;
  slug: string | null;
  category: string | null;
  blockCount: number;
  directAnswerCount: number;
  duplicateOpeningParagraph: boolean;
  faqHeadingCount: number;
  faqBlockCount: number;
  duplicateFaqProse: { duplicatedItemCount: number; totalItemCount: number; fullyDuplicated: boolean } | null;
  faqProseRedundancyParagraphCount: number;
  markdownPipeTableParagraphCount: number;
  markdownPipeTableAmbiguousCount: number;
  internalWorkflowPhraseMatchCount: number;
  factCheckStatus: string | null;
  sourceCount: number;
  claimCount: number;
  sourcesWithNoClaimMapping: number;
  relatedArticleSlugCount: number;
  bodyVisualCount: number;
  metadataWarnings: string[];
  slugWarning: string | null;
  validationError: string | null;
};

const repoRoot = process.cwd();
const manifestPath = path.join(repoRoot, "docs", "core56-claude-batches", "manifest.json");
const trackerPath = path.join(repoRoot, "docs", "core56-claude-batches", "publication-tracker.csv");
const backfillDir = path.join(repoRoot, "src", "content", "backfill");

const args = parseArgs(process.argv.slice(2));

loadEnvConfig(repoRoot);

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : "Core 56 audit failed.");
  process.exit(1);
});

async function main() {
  const manifest = readJson<Manifest>(manifestPath);
  const trackerRows = fs.existsSync(trackerPath) ? parseCsv(fs.readFileSync(trackerPath, "utf8")) : [];
  const backfillArticles = await loadBackfillArticles();
  const backfillById = new Map(backfillArticles.map((article) => [articleCode(article.id), article]));

  const dbRows = args.source === "backfill" || !process.env.DATABASE_URL ? null : await loadFromDatabase();

  const audits: ArticleAudit[] = manifest.articles.map((entry) => {
    const dbRow = dbRows?.get(entry.articleId) ?? null;
    return auditOne(entry.articleId, dbRow, backfillById.get(entry.articleId) ?? null);
  });

  const affectedCounts = summarizeAffectedCounts(audits);
  const tc001 = audits.find((a) => a.articleId === "TC-001");
  const tc006 = audits.find((a) => a.articleId === "TC-006");

  const report = {
    generatedAt: new Date().toISOString(),
    dataSource: dbRows ? "database" : "backfill-files-only (no DATABASE_URL or --source=backfill)",
    manifestArticleCount: manifest.articleCount,
    auditedArticleCount: audits.length,
    affectedCounts,
    strongerFormatSanityCheck: {
      tc001: tc001 ? { defectCount: defectCount(tc001) } : null,
      tc006: tc006 ? { defectCount: defectCount(tc006) } : null,
      note: "TC-001/TC-006 are expected to have the fewest (ideally zero) hygiene defects among the 56.",
    },
    trackerRowCount: trackerRows.length,
    articles: audits,
  };

  fs.writeFileSync(path.join(repoRoot, "core56-audit.json"), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(repoRoot, "core56-audit.md"), renderMarkdown(report));
  fs.writeFileSync(path.join(repoRoot, "core56-audit.csv"), renderCsv(audits));

  const trackerByArticleId = new Map(trackerRows.map((row) => [row.article_id, row]));
  fs.writeFileSync(path.join(repoRoot, "core56-manual-review-queue.csv"), renderManualReviewQueue(audits, trackerByArticleId));

  console.log(JSON.stringify({ ...report, articles: `${audits.length} articles (see core56-audit.json/.md/.csv)` }, null, 2));
}

// ---------------------------------------------------------------------------
// Task F — manual-review queue (defects S00 must not auto-fix)
// ---------------------------------------------------------------------------

const HARD_STOP_REASONS: Record<string, string> = {
  "TC-027": "Healthcare (YMYL) — requires qualified medical reviewer.",
  "TC-028": "Legal/immigration (YMYL) — requires qualified legal reviewer.",
  "TC-056": "Benchmark article — requires real dataset/method review.",
};

type ManualReviewRow = {
  articleId: string;
  liveUrl: string;
  issue: string;
  affectedField: string;
  recommendedOwner: string;
  recommendedNextSprint: string;
  severity: "blocking" | "high" | "medium" | "low";
  blockingStatus: "blocked" | "not-blocked";
};

function renderManualReviewQueue(audits: ArticleAudit[], trackerByArticleId: Map<string, TrackerRow>): string {
  const rows: ManualReviewRow[] = [];

  for (const audit of audits) {
    const liveUrl = trackerByArticleId.get(audit.articleId)?.live_url ?? "";

    if (HARD_STOP_REASONS[audit.articleId]) {
      rows.push({
        articleId: audit.articleId,
        liveUrl,
        issue: HARD_STOP_REASONS[audit.articleId]!,
        affectedField: "whole article",
        recommendedOwner: "Editorial lead / subject-matter reviewer",
        recommendedNextSprint: "S01 (content quality)",
        severity: "blocking",
        blockingStatus: "blocked",
      });
    }
    if (audit.source === "missing") {
      rows.push({
        articleId: audit.articleId,
        liveUrl,
        issue: "No published or draft snapshot found (manifest/tracker claims it is published).",
        affectedField: "whole article",
        recommendedOwner: "Content ops",
        recommendedNextSprint: "S00 follow-up (data integrity)",
        severity: "blocking",
        blockingStatus: "blocked",
      });
    }
    if (audit.validationError) {
      rows.push({
        articleId: audit.articleId,
        liveUrl,
        issue: `Snapshot fails schema validation: ${audit.validationError}`,
        affectedField: "whole article",
        recommendedOwner: "Engineering",
        recommendedNextSprint: "S00 follow-up (data integrity)",
        severity: "blocking",
        blockingStatus: "blocked",
      });
    }
    if (audit.markdownPipeTableAmbiguousCount > 0) {
      rows.push({
        articleId: audit.articleId,
        liveUrl,
        issue: `${audit.markdownPipeTableAmbiguousCount} markdown table paragraph(s) could not be safely auto-converted (ambiguous column structure).`,
        affectedField: "body blocks",
        recommendedOwner: "Content ops",
        recommendedNextSprint: "S00 follow-up (hygiene)",
        severity: "medium",
        blockingStatus: "not-blocked",
      });
    }
    if (audit.duplicateFaqProse && !audit.duplicateFaqProse.fullyDuplicated) {
      rows.push({
        articleId: audit.articleId,
        liveUrl,
        issue: `Only ${audit.duplicateFaqProse.duplicatedItemCount}/${audit.duplicateFaqProse.totalItemCount} FAQ items had an exact prose duplicate; remainder needs manual reconciliation.`,
        affectedField: "faq block / prose FAQ section",
        recommendedOwner: "Content ops",
        recommendedNextSprint: "S00 follow-up (hygiene)",
        severity: "medium",
        blockingStatus: "not-blocked",
      });
    }
    if (audit.faqProseRedundancyParagraphCount > 0 && !audit.duplicateFaqProse) {
      rows.push({
        articleId: audit.articleId,
        liveUrl,
        issue: `${audit.faqProseRedundancyParagraphCount} prose paragraph(s) open with an FAQ question but paraphrase (not exactly repeat) the structured FAQ answer — presented twice in different wording, needs manual reconciliation rather than auto-merge.`,
        affectedField: "faq block / prose FAQ section",
        recommendedOwner: "Content ops",
        recommendedNextSprint: "S00 follow-up (hygiene)",
        severity: "medium",
        blockingStatus: "not-blocked",
      });
    }
    if (audit.sourcesWithNoClaimMapping > 0) {
      rows.push({
        articleId: audit.articleId,
        liveUrl,
        issue: `${audit.sourcesWithNoClaimMapping} source(s) are recorded but not mapped to any claim or evidence block.`,
        affectedField: "contentEvidence.sources",
        recommendedOwner: "Editorial / fact-check",
        recommendedNextSprint: "S01 (content quality)",
        severity: "medium",
        blockingStatus: "not-blocked",
      });
    }
    if (audit.bodyVisualCount === 0) {
      rows.push({
        articleId: audit.articleId,
        liveUrl,
        issue: "No body image or explanatory visual.",
        affectedField: "blocks (image/video)",
        recommendedOwner: "Design / content ops",
        recommendedNextSprint: "S01 (content quality)",
        severity: "low",
        blockingStatus: "not-blocked",
      });
    }
    if (audit.relatedArticleSlugCount === 0) {
      rows.push({
        articleId: audit.articleId,
        liveUrl,
        issue: "No related article slugs — missing internal link graph.",
        affectedField: "internalLinking.relatedArticleSlugs",
        recommendedOwner: "Content ops",
        recommendedNextSprint: "S01 (internal linking)",
        severity: "low",
        blockingStatus: "not-blocked",
      });
    }
    if (audit.slugWarning) {
      rows.push({
        articleId: audit.articleId,
        liveUrl,
        issue: `Slug likely truncated (${audit.slugWarning}). Changing live slugs is out of scope for S00.`,
        affectedField: "slug",
        recommendedOwner: "SEO lead",
        recommendedNextSprint: "S01 (requires redirect plan)",
        severity: "medium",
        blockingStatus: "not-blocked",
      });
    }
    if (audit.metadataWarnings.length > 0) {
      rows.push({
        articleId: audit.articleId,
        liveUrl,
        issue: `Metadata length warning(s): ${audit.metadataWarnings.join("; ")} — rewriting requires SERP-intent judgment.`,
        affectedField: "metadata.metaTitle / metadata.metaDescription",
        recommendedOwner: "SEO lead",
        recommendedNextSprint: "S01 (metadata pass)",
        severity: "low",
        blockingStatus: "not-blocked",
      });
    }
  }

  const headers: (keyof ManualReviewRow)[] = ["articleId", "liveUrl", "issue", "affectedField", "recommendedOwner", "recommendedNextSprint", "severity", "blockingStatus"];
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => csvCell(row[h])).join(","));
  }
  return lines.join("\n");
}

function auditOne(articleId: string, dbRow: DbRow | null, backfillArticle: InsightArticle | null): ArticleAudit {
  let source: ArticleSource = "missing";
  let article: InsightArticle | null = null;
  let validationError: string | null = null;
  let status: string | null = null;
  let publishedRevisionId: string | null = null;
  let groupId: string | null = null;
  let creationKey: string | null = null;

  if (dbRow) {
    groupId = dbRow.group_id;
    creationKey = dbRow.creation_key;
    status = dbRow.draft_workflow_status;
    publishedRevisionId = dbRow.published_revision_id;
    const snapshot = dbRow.published_snapshot ?? dbRow.draft_snapshot;
    source = dbRow.published_snapshot ? "published-db" : "draft-db";
    const parsed = articleDraftSchema.safeParse(snapshot);
    if (parsed.success) article = parsed.data;
    else validationError = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
  } else if (backfillArticle) {
    source = "backfill-file";
    article = backfillArticle;
    creationKey = backfillArticle.id;
  }

  if (!article) {
    return {
      articleId,
      groupId,
      creationKey,
      source,
      status,
      publishedRevisionId,
      slug: null,
      category: null,
      blockCount: 0,
      directAnswerCount: 0,
      duplicateOpeningParagraph: false,
      faqHeadingCount: 0,
      faqBlockCount: 0,
      duplicateFaqProse: null,
      faqProseRedundancyParagraphCount: 0,
      markdownPipeTableParagraphCount: 0,
      markdownPipeTableAmbiguousCount: 0,
      internalWorkflowPhraseMatchCount: 0,
      factCheckStatus: null,
      sourceCount: 0,
      claimCount: 0,
      sourcesWithNoClaimMapping: 0,
      relatedArticleSlugCount: 0,
      bodyVisualCount: 0,
      metadataWarnings: [],
      slugWarning: null,
      validationError,
    };
  }

  const duplicateFaqProse = detectDuplicateFaqProse(article.blocks);
  const faqProseRedundancy = detectFaqProseRedundancy(article.blocks);
  const pipeTableMatches = detectMarkdownPipeTableParagraphs(article.blocks);
  const slugWarning = detectSlugWarning(article.slug);

  return {
    articleId,
    groupId,
    creationKey,
    source,
    status,
    publishedRevisionId,
    slug: article.slug,
    category: article.category,
    blockCount: article.blocks.length,
    directAnswerCount: countDirectAnswerBlocks(article.blocks),
    duplicateOpeningParagraph: Boolean(detectDuplicateOpeningParagraph(article.blocks)),
    faqHeadingCount: countFaqHeadings(article.blocks),
    faqBlockCount: countFaqBlocks(article.blocks),
    duplicateFaqProse: duplicateFaqProse
      ? { duplicatedItemCount: duplicateFaqProse.duplicatedItemCount, totalItemCount: duplicateFaqProse.totalItemCount, fullyDuplicated: duplicateFaqProse.fullyDuplicated }
      : null,
    faqProseRedundancyParagraphCount: faqProseRedundancy?.possiblyRedundantParagraphCount ?? 0,
    markdownPipeTableParagraphCount: pipeTableMatches.filter((m) => !m.ambiguous).length,
    markdownPipeTableAmbiguousCount: pipeTableMatches.filter((m) => m.ambiguous).length,
    internalWorkflowPhraseMatchCount: detectInternalWorkflowPhrases(article.blocks).length,
    factCheckStatus: article.contentEvidence.factCheckStatus,
    sourceCount: article.contentEvidence.sources.length,
    claimCount: article.contentEvidence.claims.length,
    sourcesWithNoClaimMapping: detectUnmappedSources(article).length,
    relatedArticleSlugCount: countRelatedArticleSlugs(article),
    bodyVisualCount: countBodyVisuals(article.blocks),
    metadataWarnings: detectMetadataLengthWarnings(article).map((w) => `${w.field} ${w.issue} (${w.length} chars)`),
    slugWarning: slugWarning ? `length=${slugWarning.length}${slugWarning.likelyMidWordCut ? ", likely mid-word cut" : ""}` : null,
    validationError,
  };
}

function defectCount(audit: ArticleAudit): number {
  return (
    (audit.duplicateOpeningParagraph ? 1 : 0) +
    (audit.duplicateFaqProse ? 1 : 0) +
    audit.markdownPipeTableParagraphCount +
    audit.markdownPipeTableAmbiguousCount +
    (audit.internalWorkflowPhraseMatchCount > 0 ? 1 : 0) +
    audit.metadataWarnings.length +
    (audit.slugWarning ? 1 : 0) +
    (audit.relatedArticleSlugCount === 0 ? 1 : 0) +
    (audit.bodyVisualCount === 0 ? 1 : 0)
  );
}

function summarizeAffectedCounts(audits: ArticleAudit[]) {
  const total = audits.length;
  const count = (predicate: (a: ArticleAudit) => boolean) => audits.filter(predicate).length;
  return {
    totalArticles: total,
    internalWorkflowPhraseLeak: count((a) => a.internalWorkflowPhraseMatchCount > 0),
    duplicateOpeningParagraph: count((a) => a.duplicateOpeningParagraph),
    duplicateFaqProse: count((a) => Boolean(a.duplicateFaqProse)),
    faqProseRedundancy: count((a) => a.faqProseRedundancyParagraphCount > 0),
    markdownPipeTableAsParagraph: count((a) => a.markdownPipeTableParagraphCount + a.markdownPipeTableAmbiguousCount > 0),
    noRelatedArticleSlugs: count((a) => a.relatedArticleSlugCount === 0),
    noBodyVisual: count((a) => a.bodyVisualCount === 0),
    slugLikelyTruncated: count((a) => Boolean(a.slugWarning)),
    metadataLengthWarnings: count((a) => a.metadataWarnings.length > 0),
    factCheckNeedsReview: count((a) => a.factCheckStatus === "needs-review"),
    sourcesWithNoClaimMapping: count((a) => a.sourcesWithNoClaimMapping > 0),
    missingArticle: count((a) => a.source === "missing"),
    validationError: count((a) => Boolean(a.validationError)),
  };
}

// ---------------------------------------------------------------------------
// Data loading
// ---------------------------------------------------------------------------

type DbRow = {
  group_id: string;
  creation_key: string;
  draft_workflow_status: string;
  published_revision_id: string | null;
  published_snapshot: unknown;
  draft_snapshot: unknown;
};

async function loadFromDatabase(): Promise<Map<string, DbRow>> {
  const sql = postgres(process.env.DATABASE_URL!, { max: 1, prepare: false });
  try {
    const rows = await sql<
      { group_id: string; creation_key: string; draft_workflow_status: string; published_revision_id: string | null; published_snapshot: unknown; draft_snapshot: unknown }[]
    >`
      SELECT
        g.id AS group_id,
        g.creation_key,
        g.draft_workflow_status::text AS draft_workflow_status,
        l.published_revision_id,
        l.published_snapshot,
        l.draft_snapshot
      FROM insight_article_groups g
      JOIN insight_article_localizations l ON l.article_group_id = g.id AND l.locale = 'en'
      WHERE g.creation_key LIKE 'core56-%'
    `;
    const byId = new Map<string, DbRow>();
    for (const row of rows) {
      byId.set(articleCode(row.creation_key), row);
    }
    return byId;
  } finally {
    await sql.end({ timeout: 5 }).catch(() => undefined);
  }
}

async function loadBackfillArticles(): Promise<InsightArticle[]> {
  if (!fs.existsSync(backfillDir)) return [];
  const articles: InsightArticle[] = [];
  const files = fs
    .readdirSync(backfillDir)
    .filter((file) => /^core56-batch-.+\.ts$/.test(file))
    .sort();
  for (const file of files) {
    const moduleExports = (await import(pathToFileURL(path.join(backfillDir, file)).href)) as Record<string, unknown>;
    for (const value of Object.values(moduleExports)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item && typeof item === "object" && typeof (item as InsightArticle).id === "string") {
            articles.push(item as InsightArticle);
          }
        }
      }
    }
  }
  return articles;
}

function articleCode(creationKey: string): string {
  return creationKey.replace(/^core56-/i, "").toUpperCase();
}

// ---------------------------------------------------------------------------
// Report rendering
// ---------------------------------------------------------------------------

function renderMarkdown(report: { generatedAt: string; dataSource: string; manifestArticleCount: number; auditedArticleCount: number; affectedCounts: ReturnType<typeof summarizeAffectedCounts>; articles: ArticleAudit[] }): string {
  const lines: string[] = [];
  lines.push("# Core 56 Portfolio Hygiene Audit");
  lines.push("");
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push(`Data source: ${report.dataSource}`);
  lines.push(`Articles audited: ${report.auditedArticleCount} / ${report.manifestArticleCount}`);
  lines.push("");
  lines.push("## Affected counts (verified, not assumed)");
  lines.push("");
  lines.push("| Defect | Affected articles |");
  lines.push("| --- | --- |");
  for (const [key, value] of Object.entries(report.affectedCounts)) {
    if (key === "totalArticles") continue;
    lines.push(`| ${key} | ${value} |`);
  }
  lines.push("");
  lines.push("## Per-article detail");
  lines.push("");
  lines.push(
    "| Article | Source | Status | Blocks | Direct Answer | Dup. Opening ¶ | FAQ headings/blocks | Dup. FAQ prose | MD tables (safe/ambiguous) | Workflow phrases | Related slugs | Body visuals | factCheckStatus |"
  );
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const a of report.articles) {
    lines.push(
      `| ${a.articleId} | ${a.source} | ${a.status ?? "-"} | ${a.blockCount} | ${a.directAnswerCount} | ${a.duplicateOpeningParagraph ? "yes" : "no"} | ${a.faqHeadingCount}/${a.faqBlockCount} | ${a.duplicateFaqProse ? `${a.duplicateFaqProse.duplicatedItemCount}/${a.duplicateFaqProse.totalItemCount}` : "no"} | ${a.markdownPipeTableParagraphCount}/${a.markdownPipeTableAmbiguousCount} | ${a.internalWorkflowPhraseMatchCount} | ${a.relatedArticleSlugCount} | ${a.bodyVisualCount} | ${a.factCheckStatus ?? "-"} |`
    );
  }
  lines.push("");
  return lines.join("\n");
}

function renderCsv(audits: ArticleAudit[]): string {
  const headers = [
    "articleId",
    "groupId",
    "creationKey",
    "source",
    "status",
    "publishedRevisionId",
    "slug",
    "category",
    "blockCount",
    "directAnswerCount",
    "duplicateOpeningParagraph",
    "faqHeadingCount",
    "faqBlockCount",
    "duplicateFaqProseDuplicatedItems",
    "duplicateFaqProseTotalItems",
    "faqProseRedundancyParagraphCount",
    "markdownPipeTableParagraphCount",
    "markdownPipeTableAmbiguousCount",
    "internalWorkflowPhraseMatchCount",
    "factCheckStatus",
    "sourceCount",
    "claimCount",
    "sourcesWithNoClaimMapping",
    "relatedArticleSlugCount",
    "bodyVisualCount",
    "metadataWarnings",
    "slugWarning",
    "validationError",
  ];
  const rows = audits.map((a) =>
    [
      a.articleId,
      a.groupId ?? "",
      a.creationKey ?? "",
      a.source,
      a.status ?? "",
      a.publishedRevisionId ?? "",
      a.slug ?? "",
      a.category ?? "",
      a.blockCount,
      a.directAnswerCount,
      a.duplicateOpeningParagraph,
      a.faqHeadingCount,
      a.faqBlockCount,
      a.duplicateFaqProse?.duplicatedItemCount ?? "",
      a.duplicateFaqProse?.totalItemCount ?? "",
      a.faqProseRedundancyParagraphCount,
      a.markdownPipeTableParagraphCount,
      a.markdownPipeTableAmbiguousCount,
      a.internalWorkflowPhraseMatchCount,
      a.factCheckStatus ?? "",
      a.sourceCount,
      a.claimCount,
      a.sourcesWithNoClaimMapping,
      a.relatedArticleSlugCount,
      a.bodyVisualCount,
      a.metadataWarnings.join(" | "),
      a.slugWarning ?? "",
      a.validationError ?? "",
    ].map(csvCell)
  );
  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

function csvCell(value: unknown): string {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function parseCsv(raw: string): TrackerRow[] {
  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]!).map((header) => header.replace(/^﻿/, "").trim());
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
      continue;
    }
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (char === "," && !quoted) {
      values.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  values.push(current);
  return values;
}

function parseArgs(raw: string[]) {
  const parsed: { source?: "backfill" } = {};
  for (const arg of raw) {
    if (arg === "--source=backfill") parsed.source = "backfill";
  }
  return parsed;
}
