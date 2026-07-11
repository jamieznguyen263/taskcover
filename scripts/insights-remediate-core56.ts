import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import type { InsightArticle, InsightStatus } from "../src/content/insights.types";
import { articleDraftSchema } from "../src/lib/admin/validation";
import { remediateArticleBlocks, type RemediationDiff } from "../src/lib/admin/core56-hygiene";
import { validateInsightArticle } from "../src/lib/insights/publish-qa";
import { loadBackfillArticles, tiptapDocumentFor } from "./insights-backfill-import";

/**
 * Sprint S00, Task D/E — dry-run (default) and staging-write remediation for
 * the Core 56 articles. Defaults to --dry-run and makes NO database writes
 * unless --write is passed alongside a verified staging target.
 *
 * Usage:
 *   npm run insights:remediate-core56                                  (dry-run against DATABASE_URL)
 *   npm run insights:remediate-core56 -- --dry-run --source=backfill   (dry-run, no DB needed)
 *   npm run insights:remediate-core56 -- \
 *     --target=staging --write --confirm-staging-host=<hostname substring>
 */

// These three IDs are never auto-remediated in S00 — they require a named
// human reviewer regardless of how mechanical the detected defect is
// (mirrors the hard-stop set in scripts/core56-publish.ts).
export const HARD_STOP_ARTICLE_IDS = new Set(["TC-027", "TC-028", "TC-056"]);
const TRANSFORMATION_VERSION = "core56-s00-hygiene-v1";

export type ParsedArgs = {
  target?: "staging" | "production" | "development";
  write: boolean;
  confirmStagingHost?: string;
  ids?: string[];
  source?: "backfill";
  limit?: number;
};

export function parseArgs(raw: string[]): ParsedArgs {
  const parsed: ParsedArgs = { write: false };
  for (let index = 0; index < raw.length; index += 1) {
    const arg = raw[index];
    if (arg === "--write") parsed.write = true;
    else if (arg === "--dry-run") parsed.write = false;
    else if (arg?.startsWith("--target=")) parsed.target = arg.slice("--target=".length) as ParsedArgs["target"];
    else if (arg?.startsWith("--confirm-staging-host=")) parsed.confirmStagingHost = arg.slice("--confirm-staging-host=".length);
    else if (arg?.startsWith("--ids=")) parsed.ids = arg.slice("--ids=".length).split(",").map((v) => v.trim().toUpperCase()).filter(Boolean);
    else if (arg === "--source=backfill") parsed.source = "backfill";
    else if (arg?.startsWith("--limit=")) parsed.limit = Number(arg.slice("--limit=".length));
  }
  return parsed;
}

export type WriteAuthorizationResult = { authorized: true } | { authorized: false; reason: string };

/**
 * Pure authorization gate for --write mode. Refuses unless every one of the
 * following independently agree the target is staging:
 *   1. process.env.DATABASE_TARGET === "staging"
 *   2. --target=staging
 *   3. --confirm-staging-host=<substring> is supplied AND is contained in
 *      the actual resolved database host (not just trusted blindly) — this
 *      directly defends against the DATABASE_TARGET/DATABASE_URL drift found
 *      in .env.local during S00 orientation.
 * Production is refused outright: this sprint never writes to production.
 */
export function resolveWriteAuthorization(input: {
  databaseTargetEnv: string | undefined;
  args: ParsedArgs;
  resolvedHost: string | null;
}): WriteAuthorizationResult {
  const { databaseTargetEnv, args, resolvedHost } = input;
  if (!args.write) return { authorized: false, reason: "Dry-run mode (pass --write to enable staging writes)." };
  if (databaseTargetEnv === "production" || args.target === "production") {
    return { authorized: false, reason: "Refusing: production writes are out of scope for Sprint S00." };
  }
  if (databaseTargetEnv !== "staging") {
    return { authorized: false, reason: `Refusing: DATABASE_TARGET must be "staging" (was ${JSON.stringify(databaseTargetEnv)}).` };
  }
  if (args.target !== "staging") {
    return { authorized: false, reason: `Refusing: --target must be staging (was ${JSON.stringify(args.target)}).` };
  }
  if (!args.confirmStagingHost) {
    return { authorized: false, reason: "Refusing: --confirm-staging-host=<hostname substring> is required for --write." };
  }
  if (!resolvedHost) {
    return { authorized: false, reason: "Refusing: could not resolve the actual database host from DATABASE_URL to verify against --confirm-staging-host." };
  }
  if (!resolvedHost.includes(args.confirmStagingHost)) {
    return {
      authorized: false,
      reason: `Refusing: --confirm-staging-host=${JSON.stringify(args.confirmStagingHost)} does not match the resolved database host (${JSON.stringify(resolvedHost)}). This is the exact ambiguity found during S00 orientation (.env.local's DATABASE_TARGET/DATABASE_URL can disagree) — fix the mismatch and re-run rather than bypassing this check.`,
    };
  }
  return { authorized: true };
}

export type ArticlePlanStatus = "no-change" | "auto-write" | "manual-review" | "hard-stop" | "archived" | "missing" | "invalid";

export type ArticlePlan = {
  articleId: string;
  groupId: string | null;
  status: ArticlePlanStatus;
  workflowStatus: string | null;
  diff: RemediationDiff | null;
  reasons: string[];
};

/** Pure classification: decides what would/should happen to one article. Never touches the DB. */
export function classifyArticle(articleId: string, workflowStatus: string | null, groupId: string | null, article: InsightArticle | null): ArticlePlan {
  if (!article) {
    return { articleId, groupId, status: "missing", workflowStatus, diff: null, reasons: ["No published or draft snapshot found for this article."] };
  }
  if (HARD_STOP_ARTICLE_IDS.has(articleId)) {
    return {
      articleId,
      groupId,
      status: "hard-stop",
      workflowStatus,
      diff: null,
      reasons: ["Hard-stop article (YMYL/benchmark) — requires a named human reviewer, never auto-remediated."],
    };
  }
  if (workflowStatus === "archived") {
    return { articleId, groupId, status: "archived", workflowStatus, diff: null, reasons: ["Article is archived — restoring it is out of scope for S00 automation."] };
  }

  const diff = remediateArticleBlocks(article);
  const reasons = [...diff.warnings, ...diff.needsManualReview];
  if (diff.needsManualReview.length > 0) {
    return { articleId, groupId, status: "manual-review", workflowStatus, diff, reasons };
  }
  if (diff.changed) {
    return { articleId, groupId, status: "auto-write", workflowStatus, diff, reasons };
  }
  return { articleId, groupId, status: "no-change", workflowStatus, diff, reasons: [] };
}

function checksum(value: unknown): string {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 16);
}

// ---------------------------------------------------------------------------
// CLI entry point
// ---------------------------------------------------------------------------

const repoRoot = process.cwd();
const manifestPath = path.join(repoRoot, "docs", "core56-claude-batches", "manifest.json");

loadEnvConfig(repoRoot);

const args = parseArgs(process.argv.slice(2));

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : "Core 56 remediation failed.");
  process.exit(1);
});

async function main() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as { articles: { articleId: string }[] };
  const wantedIds = args.ids ? new Set(args.ids) : null;
  const manifestIds = manifest.articles.map((a) => a.articleId).filter((id) => !wantedIds || wantedIds.has(id));
  const idsToProcess = args.limit ? manifestIds.slice(0, args.limit) : manifestIds;

  const useDb = args.source !== "backfill" && Boolean(process.env.DATABASE_URL);
  const resolvedHost = useDb ? safeHost(process.env.DATABASE_URL!) : null;

  const rows = useDb ? await loadCore56Rows(process.env.DATABASE_URL!, idsToProcess) : new Map();
  const backfillArticles = useDb ? new Map() : new Map((await loadBackfillArticles()).map((a) => [articleCode(a.id), a]));

  const plans: ArticlePlan[] = idsToProcess.map((articleId) => {
    const row = rows.get(articleId) as DbRow | undefined;
    if (row) {
      const snapshot = row.published_snapshot ?? row.draft_snapshot;
      const parsed = articleDraftSchema.safeParse(snapshot);
      if (!parsed.success) {
        return {
          articleId,
          groupId: row.group_id,
          status: "invalid" as const,
          workflowStatus: row.draft_workflow_status,
          diff: null,
          reasons: [`Snapshot failed schema validation: ${parsed.error.issues.map((i) => i.message).join("; ")}`],
        };
      }
      return classifyArticle(articleId, row.draft_workflow_status, row.group_id, parsed.data);
    }
    const backfill = backfillArticles.get(articleId) as InsightArticle | undefined;
    return classifyArticle(articleId, backfill ? "draft" : null, null, backfill ?? null);
  });

  const authorization = resolveWriteAuthorization({ databaseTargetEnv: process.env.DATABASE_TARGET, args, resolvedHost });

  // The real host is only ever printed to the operator's own terminal, never
  // persisted to a file (this report is meant to be committed for review,
  // and the DB host is an infrastructure secret that shouldn't leak there).
  if (useDb) console.log(`Resolved database host: ${resolvedHost ?? "unknown"}`);

  const summary = {
    mode: authorization.authorized ? "write" : "dry-run",
    authorization,
    dataSource: useDb ? `database (host fingerprint ${resolvedHost ? checksum(resolvedHost) : "unknown"})` : "backfill-files-only",
    articleGroupsInspected: plans.length,
    counts: countBy(plans, (p) => p.status),
    noPublishedSnapshotWasChanged: true,
  };

  let writeResults: WriteResult[] = [];
  if (authorization.authorized) {
    const sql = postgres(process.env.DATABASE_URL!, { max: 1, prepare: false });
    try {
      writeResults = await applyWrites(sql, plans.filter((p) => p.status === "auto-write"));
    } finally {
      await sql.end({ timeout: 5 }).catch(() => undefined);
    }
  }

  const outputPath = path.join(repoRoot, authorization.authorized ? "core56-remediation-write.json" : "core56-remediation-dry-run.json");
  const output = {
    generatedAt: new Date().toISOString(),
    ...summary,
    plans: plans.map((plan) => ({
      articleId: plan.articleId,
      groupId: plan.groupId,
      status: plan.status,
      workflowStatus: plan.workflowStatus,
      beforeBlockCount: plan.diff?.beforeBlockCount ?? null,
      afterBlockCount: plan.diff?.afterBlockCount ?? null,
      reasons: plan.reasons,
    })),
    writeResults,
  };
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  console.log(`Full report written to ${outputPath}`);
}

function countBy<T>(items: T[], key: (item: T) => string): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    const k = key(item);
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});
}

function safeHost(databaseUrl: string): string | null {
  try {
    return new URL(databaseUrl).host;
  } catch {
    return null;
  }
}

function articleCode(creationKey: string): string {
  return creationKey.replace(/^core56-/i, "").toUpperCase();
}

// ---------------------------------------------------------------------------
// Database read
// ---------------------------------------------------------------------------

type DbRow = {
  group_id: string;
  creation_key: string;
  draft_workflow_status: InsightStatus;
  lock_version: number;
  localization_id: string;
  draft_snapshot: unknown;
  published_snapshot: unknown;
};

async function loadCore56Rows(databaseUrl: string, ids: string[]): Promise<Map<string, DbRow>> {
  const sql = postgres(databaseUrl, { max: 1, prepare: false });
  try {
    const rows = await sql<
      { group_id: string; creation_key: string; draft_workflow_status: InsightStatus; lock_version: number; localization_id: string; draft_snapshot: unknown; published_snapshot: unknown }[]
    >`
      SELECT
        g.id AS group_id,
        g.creation_key,
        g.draft_workflow_status,
        g.lock_version,
        l.id AS localization_id,
        l.draft_snapshot,
        l.published_snapshot
      FROM insight_article_groups g
      JOIN insight_article_localizations l ON l.article_group_id = g.id AND l.locale = 'en'
      WHERE g.creation_key LIKE 'core56-%'
    `;
    const byId = new Map<string, DbRow>();
    for (const row of rows) {
      const code = articleCode(row.creation_key);
      if (ids.includes(code)) byId.set(code, row);
    }
    return byId;
  } finally {
    await sql.end({ timeout: 5 }).catch(() => undefined);
  }
}

// ---------------------------------------------------------------------------
// Database write (staging only, gated by resolveWriteAuthorization above)
// ---------------------------------------------------------------------------

type WriteResult = { articleId: string; groupId: string; applied: boolean; reason?: string; beforeChecksum?: string; afterChecksum?: string; qaErrorCount?: number; qaWarningCount?: number };

async function applyWrites(sql: postgres.Sql, autoWritePlans: ArticlePlan[]): Promise<WriteResult[]> {
  const results: WriteResult[] = [];
  for (const plan of autoWritePlans) {
    if (!plan.groupId || !plan.diff) {
      results.push({ articleId: plan.articleId, groupId: plan.groupId ?? "", applied: false, reason: "Missing group id or diff." });
      continue;
    }
    try {
      const result = await sql.begin(async (tx) => applyOneWrite(tx, plan));
      results.push(result);
    } catch (error) {
      results.push({ articleId: plan.articleId, groupId: plan.groupId, applied: false, reason: error instanceof Error ? error.message : String(error) });
    }
  }
  return results;
}

async function applyOneWrite(tx: postgres.TransactionSql, plan: ArticlePlan): Promise<WriteResult> {
  const groupId = plan.groupId!;
  const [group] = await tx<{ id: string; draft_workflow_status: InsightStatus; lock_version: number }[]>`
    SELECT id, draft_workflow_status, lock_version FROM insight_article_groups WHERE id = ${groupId} FOR UPDATE
  `;
  if (!group) return { articleId: plan.articleId, groupId, applied: false, reason: "Article group no longer exists." };
  if (group.draft_workflow_status === "archived") {
    return { articleId: plan.articleId, groupId, applied: false, reason: "Article was archived since planning; skipped." };
  }

  const [localization] = await tx<{ id: string; draft_snapshot: unknown }[]>`
    SELECT id, draft_snapshot FROM insight_article_localizations WHERE article_group_id = ${groupId} AND locale = 'en' FOR UPDATE
  `;
  if (!localization) return { articleId: plan.articleId, groupId, applied: false, reason: "English localization no longer exists." };

  const currentDraft = articleDraftSchema.parse(localization.draft_snapshot);
  const beforeChecksum = checksum(currentDraft.blocks);

  // Re-run remediation against the freshest snapshot rather than trusting
  // the plan computed earlier in the process, in case it changed concurrently.
  const freshDiff = remediateArticleBlocks(currentDraft);
  if (freshDiff.needsManualReview.length > 0 || !freshDiff.changed) {
    return { articleId: plan.articleId, groupId, applied: false, reason: "Article changed since planning (no longer a clean auto-write); skipped for safety." };
  }

  const now = new Date();
  const nextDraft: InsightArticle = { ...currentDraft, blocks: freshDiff.blocks, updatedAt: now.toISOString() };
  const qa = validateInsightArticle(nextDraft, [nextDraft]);
  const afterChecksum = checksum(nextDraft.blocks);

  const fromStatus = group.draft_workflow_status;
  if (fromStatus !== "draft") {
    await tx`
      UPDATE insight_article_groups
      SET draft_workflow_status = 'draft', lock_version = lock_version + 1, updated_at = ${now}, archived_at = null
      WHERE id = ${groupId} AND lock_version = ${group.lock_version}
    `;
    await tx`
      INSERT INTO workflow_events (article_group_id, from_status, to_status, actor_id, note, metadata)
      VALUES (${groupId}, ${fromStatus}, 'draft', null, ${"Core 56 S00 hygiene remediation: reopened for automated hygiene fix."}, ${tx.json({ source: "insights-remediate-core56" })})
    `;
  } else {
    await tx`
      UPDATE insight_article_groups SET lock_version = lock_version + 1, updated_at = ${now} WHERE id = ${groupId} AND lock_version = ${group.lock_version}
    `;
  }

  await tx`
    UPDATE insight_article_localizations
    SET draft_snapshot = ${tx.json(nextDraft)},
        normalized_blocks = ${tx.json(nextDraft.blocks)},
        editor_document = ${tx.json(tiptapDocumentFor(nextDraft.blocks) as never)},
        publish_qa_snapshot = ${tx.json(qa)},
        draft_version = draft_version + 1,
        updated_at = ${now}
    WHERE id = ${localization.id}
  `;

  await tx`
    INSERT INTO admin_audit_logs (event, actor_id, target_type, target_id, summary, metadata)
    VALUES (
      'article_save', null, 'insight_article_group', ${groupId},
      ${`Core 56 S00 hygiene remediation applied to ${plan.articleId}.`},
      ${tx.json({
        source: "insights-remediate-core56",
        transformationVersion: TRANSFORMATION_VERSION,
        articleId: plan.articleId,
        fromStatus,
        beforeChecksum,
        afterChecksum,
        beforeBlockCount: currentDraft.blocks.length,
        afterBlockCount: nextDraft.blocks.length,
        warnings: freshDiff.warnings,
      })}
    )
  `;

  return {
    articleId: plan.articleId,
    groupId,
    applied: true,
    beforeChecksum,
    afterChecksum,
    qaErrorCount: qa.filter((r) => r.severity === "error").length,
    qaWarningCount: qa.filter((r) => r.severity === "warning").length,
  };
}
