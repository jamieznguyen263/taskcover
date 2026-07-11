import fs from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { articleDraftSchema } from "../src/lib/admin/validation";
import { articleIdFromCreationKey, assertCore56Identity, sortArticleIdsNumerically } from "../src/lib/admin/core56-identity";
import {
  assessFaqProse,
  countBodyVisuals,
  countDirectAnswerBlocks,
  countFaqBlocks,
  countFaqHeadings,
  countRelatedArticleSlugs,
  detectDuplicateOpeningParagraph,
  detectInternalWorkflowLeak,
  detectMarkdownPipeTableParagraphs,
  detectMetadataLengthWarnings,
  detectSlugWarning,
  detectUnmappedSources,
} from "../src/lib/admin/core56-hygiene";

/**
 * Sprint S00 — read-only audit of the 56 Core English articles.
 *
 * Discovers the Core 56 article groups directly from the database by their
 * `creation_key` naming convention (`core56-tc-###`) — it does NOT depend on
 * the (unmerged, PR #8) batch-authoring pipeline's manifest/tracker files or
 * generated backfill content. Reads the PUBLISHED English snapshot (falling
 * back to the draft snapshot if no published snapshot exists yet). Makes NO
 * database writes.
 *
 * Refuses to produce a report if the 56-article identity assertion fails
 * (duplicate/missing/unexpected creation keys) rather than reporting
 * possibly-wrong numbers against a broken corpus.
 *
 * Raw per-article output (which includes internal database IDs) is written
 * to the gitignored `.artifacts/core56-s00/` directory for operator/CI use;
 * nothing with database IDs is intended to be committed — see
 * docs/CORE56_S00_REMEDIATION.md for the sanitized, committed summary.
 *
 * Usage: npm run insights:audit-core56
 */

type DbRow = {
  group_id: string;
  creation_key: string;
  draft_workflow_status: string;
  published_revision_id: string | null;
  published_snapshot: unknown;
  draft_snapshot: unknown;
};

type ArticleAudit = {
  articleId: string;
  workflowStatus: string;
  source: "published" | "draft";
  blockCount: number;
  directAnswerCount: number;
  duplicateOpeningParagraph: boolean;
  faqHeadingCount: number;
  faqBlockCount: number;
  faqExactDuplicateItems: number;
  faqParaphraseRedundancyItems: number;
  faqTotalItems: number;
  markdownPipeTableSafeCount: number;
  markdownPipeTableAmbiguousCount: number;
  internalWorkflowLeakCount: number;
  internalWorkflowLeakAutoFixableCount: number;
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

const artifactsDir = path.join(process.cwd(), ".artifacts", "core56-s00");

loadEnvConfig(process.cwd());

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : "Core 56 audit failed.");
  process.exit(1);
});

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required for insights:audit-core56 (read-only).");
    process.exit(1);
  }

  const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });
  let rows: DbRow[];
  try {
    rows = await sql<DbRow[]>`
      SELECT
        g.id AS group_id,
        g.creation_key,
        g.draft_workflow_status::text AS draft_workflow_status,
        l.published_revision_id,
        l.published_snapshot,
        l.draft_snapshot
      FROM insight_article_groups g
      JOIN insight_article_localizations l ON l.article_group_id = g.id AND l.locale = 'en'
      WHERE g.creation_key ~ '^core56-tc-[0-9]{3}$'
    `;
  } finally {
    await sql.end({ timeout: 5 }).catch(() => undefined);
  }

  const identity = assertCore56Identity(rows.map((row) => row.creation_key));
  if (!identity.ok) {
    console.error("Core 56 identity assertion FAILED — refusing to produce an audit report.");
    console.error(JSON.stringify(identity, null, 2));
    process.exitCode = 1;
    return;
  }

  const byArticleId = new Map(rows.map((row) => [articleIdFromCreationKey(row.creation_key)!, row]));
  const articleIds = sortArticleIdsNumerically(identity.articleIds);

  const audits: ArticleAudit[] = articleIds.map((articleId) => auditOne(articleId, byArticleId.get(articleId)!));
  const affectedCounts = summarizeAffectedCounts(audits);
  const tc001 = audits.find((a) => a.articleId === "TC-001");
  const tc006 = audits.find((a) => a.articleId === "TC-006");

  fs.mkdirSync(artifactsDir, { recursive: true });
  fs.writeFileSync(path.join(artifactsDir, "audit.json"), JSON.stringify({ generatedAt: new Date().toISOString(), affectedCounts, articles: audits }, null, 2));
  fs.writeFileSync(path.join(artifactsDir, "audit.csv"), renderCsv(audits));

  console.log(
    JSON.stringify(
      {
        identity: { ok: true, articleCount: articleIds.length },
        affectedCounts,
        strongerFormatSanityCheck: {
          tc001DefectCount: tc001 ? defectCount(tc001) : null,
          tc006DefectCount: tc006 ? defectCount(tc006) : null,
        },
        rawArtifacts: `.artifacts/core56-s00/audit.json, .artifacts/core56-s00/audit.csv (gitignored; contains database IDs, do not commit)`,
      },
      null,
      2
    )
  );
}

function auditOne(articleId: string, row: DbRow): ArticleAudit {
  const snapshot = row.published_snapshot ?? row.draft_snapshot;
  const source: ArticleAudit["source"] = row.published_snapshot ? "published" : "draft";
  const parsed = articleDraftSchema.safeParse(snapshot);
  if (!parsed.success) {
    return {
      articleId,
      workflowStatus: row.draft_workflow_status,
      source,
      blockCount: 0,
      directAnswerCount: 0,
      duplicateOpeningParagraph: false,
      faqHeadingCount: 0,
      faqBlockCount: 0,
      faqExactDuplicateItems: 0,
      faqParaphraseRedundancyItems: 0,
      faqTotalItems: 0,
      markdownPipeTableSafeCount: 0,
      markdownPipeTableAmbiguousCount: 0,
      internalWorkflowLeakCount: 0,
      internalWorkflowLeakAutoFixableCount: 0,
      factCheckStatus: null,
      sourceCount: 0,
      claimCount: 0,
      sourcesWithNoClaimMapping: 0,
      relatedArticleSlugCount: 0,
      bodyVisualCount: 0,
      metadataWarnings: [],
      slugWarning: null,
      validationError: parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; "),
    };
  }

  const article = parsed.data;
  const faqAssessment = assessFaqProse(article.blocks);
  const pipeTableMatches = detectMarkdownPipeTableParagraphs(article.blocks);
  const leakSignals = detectInternalWorkflowLeak(article.blocks);
  const slugWarning = detectSlugWarning(article.slug);

  return {
    articleId,
    workflowStatus: row.draft_workflow_status,
    source,
    blockCount: article.blocks.length,
    directAnswerCount: countDirectAnswerBlocks(article.blocks),
    duplicateOpeningParagraph: Boolean(detectDuplicateOpeningParagraph(article.blocks)),
    faqHeadingCount: countFaqHeadings(article.blocks),
    faqBlockCount: countFaqBlocks(article.blocks),
    faqExactDuplicateItems: faqAssessment?.exactCount ?? 0,
    faqParaphraseRedundancyItems: faqAssessment?.paraphraseCount ?? 0,
    faqTotalItems: faqAssessment?.totalItems ?? 0,
    markdownPipeTableSafeCount: pipeTableMatches.filter((m) => !m.ambiguous).length,
    markdownPipeTableAmbiguousCount: pipeTableMatches.filter((m) => m.ambiguous).length,
    internalWorkflowLeakCount: leakSignals.length,
    internalWorkflowLeakAutoFixableCount: leakSignals.filter((s) => s.exactAutoFixable).length,
    factCheckStatus: article.contentEvidence.factCheckStatus,
    sourceCount: article.contentEvidence.sources.length,
    claimCount: article.contentEvidence.claims.length,
    sourcesWithNoClaimMapping: detectUnmappedSources(article).length,
    relatedArticleSlugCount: countRelatedArticleSlugs(article),
    bodyVisualCount: countBodyVisuals(article.blocks),
    metadataWarnings: detectMetadataLengthWarnings(article).map((w) => `${w.field} ${w.issue} (${w.length} chars)`),
    slugWarning: slugWarning ? `length=${slugWarning.length}${slugWarning.likelyMidWordCut ? ", likely mid-word cut" : ""}` : null,
    validationError: null,
  };
}

function defectCount(audit: ArticleAudit): number {
  return (
    (audit.duplicateOpeningParagraph ? 1 : 0) +
    audit.faqParaphraseRedundancyItems +
    audit.markdownPipeTableSafeCount +
    audit.markdownPipeTableAmbiguousCount +
    audit.internalWorkflowLeakCount +
    audit.metadataWarnings.length +
    (audit.slugWarning ? 1 : 0) +
    (audit.relatedArticleSlugCount === 0 ? 1 : 0) +
    (audit.bodyVisualCount === 0 ? 1 : 0)
  );
}

function summarizeAffectedCounts(audits: ArticleAudit[]) {
  const count = (predicate: (a: ArticleAudit) => boolean) => audits.filter(predicate).length;
  return {
    totalArticles: audits.length,
    internalWorkflowLeak: count((a) => a.internalWorkflowLeakCount > 0),
    internalWorkflowLeakAutoFixable: count((a) => a.internalWorkflowLeakAutoFixableCount > 0),
    duplicateOpeningParagraph: count((a) => a.duplicateOpeningParagraph),
    faqExactDuplicate: count((a) => a.faqExactDuplicateItems > 0),
    faqParaphraseRedundancy: count((a) => a.faqParaphraseRedundancyItems > 0),
    markdownPipeTableAsParagraph: count((a) => a.markdownPipeTableSafeCount + a.markdownPipeTableAmbiguousCount > 0),
    noRelatedArticleSlugs: count((a) => a.relatedArticleSlugCount === 0),
    noBodyVisual: count((a) => a.bodyVisualCount === 0),
    slugLikelyTruncated: count((a) => Boolean(a.slugWarning)),
    metadataLengthWarnings: count((a) => a.metadataWarnings.length > 0),
    factCheckNeedsReview: count((a) => a.factCheckStatus === "needs-review"),
    sourcesWithNoClaimMapping: count((a) => a.sourcesWithNoClaimMapping > 0),
    notCurrentlyDraft: count((a) => a.workflowStatus !== "draft"),
    validationError: count((a) => Boolean(a.validationError)),
  };
}

function renderCsv(audits: ArticleAudit[]): string {
  const headers = Object.keys(audits[0] ?? {}) as (keyof ArticleAudit)[];
  const lines = [headers.join(",")];
  for (const audit of audits) {
    lines.push(headers.map((header) => csvCell(audit[header])).join(","));
  }
  return lines.join("\n");
}

function csvCell(value: unknown): string {
  const text = Array.isArray(value) ? value.join(" | ") : String(value ?? "");
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}
