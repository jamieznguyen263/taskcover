import path from "node:path";
import fs from "node:fs";
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import type { InsightArticle, InsightStatus } from "../src/content/insights.types";
import { articleDraftSchema } from "../src/lib/admin/validation";
import { computeReadingTime } from "../src/lib/admin/geo-analysis";
import { normalizeEmail } from "../src/lib/admin/crypto";
import { hasPermission, type AdminRole } from "../src/lib/admin/permissions";
import { hashForLog, summarizeUrl } from "../src/lib/ops/production-activation";
import { articleIdFromCreationKey, assertCore56Identity, sortArticleIdsNumerically } from "../src/lib/admin/core56-identity";
import { transformEditorDocument, type RemediationDiff } from "../src/lib/admin/core56-hygiene";
import { validateInsightArticle, type PublishQaResult } from "../src/lib/insights/publish-qa";

/**
 * Sprint S00, dry-run (default) and staging-write remediation for the Core
 * 56 articles.
 *
 * Safety model:
 *  - Discovers article groups directly by creation-key pattern; refuses to
 *    continue if the 56-article identity assertion fails.
 *  - Never raw-updates draft_workflow_status. Only groups ALREADY in
 *    `draft` are ever written to; `published`/`in-review`/`approved`/
 *    `scheduled` are reported `requires-reopen`/skipped, and reopening must
 *    happen through the normal Taskcover Admin workflow with a real actor.
 *  - `archived` (and the three YMYL/benchmark ids TC-027/028/056) are
 *    `hard-stop` — never touched regardless of workflow status.
 *  - Write mode requires --actor-email=<active admin_users account with
 *    article:edit>, and an environment authorization chain that demands an
 *    EXACT hostname or EXACT sha256 fingerprint match (no substring
 *    matching), refuses production explicitly, and is impossible in
 *    --source=fixture (offline) mode.
 *  - Edits the Tiptap editorDocument node tree directly (not a
 *    blocks-only reconstruction) so untouched marks/ids/links are
 *    byte-for-byte preserved; refuses (manual-review) when the node/block
 *    correspondence can't be safely assumed.
 *  - Before writing, re-validates Publish QA and aborts that article's
 *    write if any NEW error code would be introduced, and verifies no
 *    identity/metadata/evidence/localization field changed.
 *
 * Usage:
 *   npm run insights:remediate-core56                          (dry-run against DATABASE_URL)
 *   npm run insights:remediate-core56 -- --source=fixture       (dry-run, no DB, write impossible)
 *   npm run insights:remediate-core56 -- \
 *     --write --target=staging --actor-email=editor@taskcover.com \
 *     --confirm-staging-identity=<exact staging hostname or its sha256 fingerprint>
 */

export type ParsedArgs = {
  write: boolean;
  target?: string;
  actorEmail?: string;
  confirmStagingIdentity?: string;
  ids?: string[];
  source?: "fixture";
  limit?: number;
};

export function parseArgs(raw: string[]): ParsedArgs {
  const parsed: ParsedArgs = { write: false };
  for (const arg of raw) {
    if (arg === "--write") parsed.write = true;
    else if (arg === "--dry-run") parsed.write = false;
    else if (arg.startsWith("--target=")) parsed.target = arg.slice("--target=".length);
    else if (arg.startsWith("--actor-email=")) parsed.actorEmail = arg.slice("--actor-email=".length);
    else if (arg.startsWith("--confirm-staging-identity=")) parsed.confirmStagingIdentity = arg.slice("--confirm-staging-identity=".length);
    else if (arg.startsWith("--ids=")) parsed.ids = arg.slice("--ids=".length).split(",").map((v) => v.trim().toUpperCase()).filter(Boolean);
    else if (arg === "--source=fixture") parsed.source = "fixture";
    else if (arg.startsWith("--limit=")) parsed.limit = Number(arg.slice("--limit=".length));
  }
  return parsed;
}

// ---------------------------------------------------------------------------
// Task 5 — strict, exact-match-only environment authorization (no substring matching)
// ---------------------------------------------------------------------------

export type WriteAuthorizationResult = { authorized: true; resolvedFingerprint: string } | { authorized: false; reason: string; resolvedFingerprint: string | null };

export function resolveWriteAuthorization(input: {
  databaseTargetEnv: string | undefined;
  requestedWrite: boolean;
  target: string | undefined;
  confirmStagingIdentity: string | undefined;
  resolvedHost: string | null;
  /** CORE56_PRODUCTION_HOST_FINGERPRINT — mandatory whenever a write is requested; write is refused if unset. */
  knownProductionIdentity: string | undefined;
  source: "database" | "fixture";
}): WriteAuthorizationResult {
  const resolvedFingerprint = input.resolvedHost ? hashForLog(input.resolvedHost) : "";

  if (input.source === "fixture") {
    return { authorized: false, reason: "Write mode is never available with --source=fixture (offline mode).", resolvedFingerprint: null };
  }
  if (!input.requestedWrite) {
    return { authorized: false, reason: "Dry-run requested (pass --write to request a staging write).", resolvedFingerprint: resolvedFingerprint || null };
  }
  if (!input.knownProductionIdentity) {
    return {
      authorized: false,
      reason: "Refusing: CORE56_PRODUCTION_HOST_FINGERPRINT must be set (to the known production host or its sha256 fingerprint) before --write can be requested.",
      resolvedFingerprint: resolvedFingerprint || null,
    };
  }
  if (input.databaseTargetEnv === "production" || input.target === "production") {
    return { authorized: false, reason: "Refusing: production is out of scope for Sprint S00.", resolvedFingerprint: resolvedFingerprint || null };
  }
  if (input.databaseTargetEnv !== "staging") {
    return { authorized: false, reason: `Refusing: DATABASE_TARGET must be exactly "staging" (was ${JSON.stringify(input.databaseTargetEnv)}).`, resolvedFingerprint: resolvedFingerprint || null };
  }
  if (input.target !== "staging") {
    return { authorized: false, reason: `Refusing: --target must be exactly "staging" (was ${JSON.stringify(input.target)}).`, resolvedFingerprint: resolvedFingerprint || null };
  }
  if (!input.resolvedHost || !resolvedFingerprint) {
    return { authorized: false, reason: "Refusing: could not resolve the actual database host to verify identity.", resolvedFingerprint: null };
  }
  if (input.resolvedHost === input.knownProductionIdentity || resolvedFingerprint === input.knownProductionIdentity) {
    return { authorized: false, reason: "Refusing: the resolved database identity exactly matches the configured PRODUCTION identity.", resolvedFingerprint };
  }
  if (!input.confirmStagingIdentity) {
    return { authorized: false, reason: "Refusing: --confirm-staging-identity=<exact hostname or exact sha256 fingerprint> is required for --write.", resolvedFingerprint };
  }
  const exactMatch = input.confirmStagingIdentity === input.resolvedHost || input.confirmStagingIdentity === resolvedFingerprint;
  if (!exactMatch) {
    return {
      authorized: false,
      reason: "Refusing: --confirm-staging-identity does not EXACTLY match the resolved host or its sha256 fingerprint (substring matches are never accepted).",
      resolvedFingerprint,
    };
  }
  return { authorized: true, resolvedFingerprint };
}

// ---------------------------------------------------------------------------
// Task 4 — accountable actor resolution
// ---------------------------------------------------------------------------

export type ActorResolution = { ok: true; actorId: string; role: AdminRole } | { ok: false; reason: string };

export async function resolveActor(sql: postgres.Sql, email: string | undefined): Promise<ActorResolution> {
  if (!email) return { ok: false, reason: "--actor-email is required for --write." };
  const normalized = normalizeEmail(email);
  const rows = await sql<{ id: string; role: AdminRole; status: string }[]>`
    SELECT id, role, status FROM admin_users WHERE normalized_email = ${normalized} LIMIT 1
  `;
  const user = rows[0];
  if (!user) return { ok: false, reason: `No admin_users account found for ${normalized}.` };
  if (user.status !== "active") return { ok: false, reason: `Account ${normalized} is not active (status=${user.status}).` };
  if (!hasPermission(user.role, "article:edit")) return { ok: false, reason: `Account ${normalized} (role=${user.role}) lacks the article:edit permission.` };
  return { ok: true, actorId: user.id, role: user.role };
}

// ---------------------------------------------------------------------------
// Task 3/6 — per-article workflow-aware classification
// ---------------------------------------------------------------------------

export const HARD_STOP_ARTICLE_IDS = new Set(["TC-027", "TC-028", "TC-056"]);

export type ArticleStatus = "no-change" | "auto-fix-safe" | "auto-fix-with-manual-follow-up" | "manual-review" | "requires-reopen" | "hard-stop" | "missing" | "invalid";

export type ArticlePlan = {
  articleId: string;
  status: ArticleStatus;
  workflowStatus: InsightStatus | null;
  diff: RemediationDiff | null;
  reasons: string[];
};

export function classifyArticle(
  articleId: string,
  workflowStatus: InsightStatus | null,
  article: InsightArticle | null,
  editorDocumentResult: { ok: true; diff: RemediationDiff } | { ok: false; reason: string } | null
): ArticlePlan {
  if (!article || !workflowStatus) {
    return { articleId, status: "missing", workflowStatus, diff: null, reasons: ["No published or draft snapshot found for this article group."] };
  }
  if (HARD_STOP_ARTICLE_IDS.has(articleId)) {
    return { articleId, status: "hard-stop", workflowStatus, diff: null, reasons: ["Hard-stop article (YMYL/benchmark) — requires a named human reviewer, never auto-remediated regardless of workflow status."] };
  }
  if (workflowStatus === "archived") {
    return { articleId, status: "hard-stop", workflowStatus, diff: null, reasons: ["Article is archived — restoring it is out of scope for S00 automation."] };
  }
  if (workflowStatus !== "draft") {
    const reason =
      workflowStatus === "published"
        ? "Article is published. S00 never raw-updates workflow state; reopen it to draft through the normal Taskcover Admin workflow (article:edit) before automated hygiene fixes can be saved."
        : `Article is in "${workflowStatus}". Use the normal Taskcover workflow to move it back to draft before S00 remediation can apply.`;
    return { articleId, status: "requires-reopen", workflowStatus, diff: null, reasons: [reason] };
  }

  // workflowStatus === "draft" from here on.
  if (!editorDocumentResult) {
    return { articleId, status: "invalid", workflowStatus, diff: null, reasons: ["No editorDocument available to transform."] };
  }
  if (!editorDocumentResult.ok) {
    return { articleId, status: "manual-review", workflowStatus, diff: null, reasons: [editorDocumentResult.reason] };
  }

  const diff = editorDocumentResult.diff;
  const reasons = [...diff.warnings, ...diff.needsManualReview];
  if (diff.needsManualReview.length > 0 && diff.changed) return { articleId, status: "auto-fix-with-manual-follow-up", workflowStatus, diff, reasons };
  if (diff.needsManualReview.length > 0 && !diff.changed) return { articleId, status: "manual-review", workflowStatus, diff, reasons };
  if (diff.changed) return { articleId, status: "auto-fix-safe", workflowStatus, diff, reasons };
  return { articleId, status: "no-change", workflowStatus, diff, reasons: [] };
}

// ---------------------------------------------------------------------------
// Task 10 — QA before/after comparison and identity-unchanged verification
// ---------------------------------------------------------------------------

export type QaComparison = { newErrorCodes: string[]; existingWarningCodes: string[]; introducedWarningCodes: string[]; safeToApply: boolean };

export function compareQaResults(before: PublishQaResult[], after: PublishQaResult[]): QaComparison {
  const beforeErrors = new Set(before.filter((r) => r.severity === "error").map((r) => r.code));
  const afterErrors = new Set(after.filter((r) => r.severity === "error").map((r) => r.code));
  const newErrorCodes = [...afterErrors].filter((code) => !beforeErrors.has(code));
  const beforeWarnings = new Set(before.filter((r) => r.severity === "warning").map((r) => r.code));
  const afterWarnings = new Set(after.filter((r) => r.severity === "warning").map((r) => r.code));
  return {
    newErrorCodes,
    existingWarningCodes: [...afterWarnings].filter((code) => beforeWarnings.has(code)),
    introducedWarningCodes: [...afterWarnings].filter((code) => !beforeWarnings.has(code)),
    safeToApply: newErrorCodes.length === 0,
  };
}

/** The only fields an S00 write is allowed to change. Everything else must be byte-identical. */
export const ALLOWED_DERIVED_FIELDS: (keyof InsightArticle)[] = ["blocks", "updatedAt", "readingTime", "publishQa"];

export function verifyIdentityUnchanged(before: InsightArticle, after: InsightArticle): { ok: boolean; changedFields: string[] } {
  const allFields = new Set([...Object.keys(before), ...Object.keys(after)]) as Set<keyof InsightArticle>;
  const changedFields = [...allFields]
    .filter((field) => !ALLOWED_DERIVED_FIELDS.includes(field))
    .filter((field) => JSON.stringify(before[field]) !== JSON.stringify(after[field]));
  return { ok: changedFields.length === 0, changedFields };
}

function checksumOf(value: unknown): string {
  return hashForLog(JSON.stringify(value));
}

/** Mirrors the private summarizeQa() text format already used by AdminRepository's transitionArticle. */
function summarizeQaText(results: PublishQaResult[]): string {
  if (!results.length) return "Publish QA has not run.";
  const errors = results.filter((item) => item.severity === "error").length;
  const warnings = results.filter((item) => item.severity === "warning").length;
  const passed = results.filter((item) => item.severity === "pass").length;
  return `${errors} blocking errors, ${warnings} warnings, ${passed} passed checks.`;
}

// ---------------------------------------------------------------------------
// CLI entry point
// ---------------------------------------------------------------------------

const artifactsDir = path.join(process.cwd(), ".artifacts", "core56-s00");

loadEnvConfig(process.cwd());

const args = parseArgs(process.argv.slice(2));

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : "Core 56 remediation failed.");
  process.exit(1);
});

type DbRow = {
  group_id: string;
  creation_key: string;
  draft_workflow_status: InsightStatus;
  lock_version: number;
  localization_id: string;
  draft_snapshot: unknown;
  published_snapshot: unknown;
  editor_document: unknown;
};

async function main() {
  const requestedMode: "write" | "dry-run" = args.write ? "write" : "dry-run";

  if (args.source === "fixture" || !process.env.DATABASE_URL) {
    const authorization = resolveWriteAuthorization({
      databaseTargetEnv: process.env.DATABASE_TARGET,
      requestedWrite: args.write,
      target: args.target,
      confirmStagingIdentity: args.confirmStagingIdentity,
      resolvedHost: null,
      knownProductionIdentity: process.env.CORE56_PRODUCTION_HOST_FINGERPRINT,
      source: "fixture",
    });
    report(requestedMode, authorization, [], "fixture (no DATABASE_URL / --source=fixture)");
    return;
  }

  const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });
  let rows: DbRow[];
  try {
    rows = await sql<DbRow[]>`
      SELECT
        g.id AS group_id,
        g.creation_key,
        g.draft_workflow_status,
        g.lock_version,
        l.id AS localization_id,
        l.draft_snapshot,
        l.published_snapshot,
        l.editor_document
      FROM insight_article_groups g
      JOIN insight_article_localizations l ON l.article_group_id = g.id AND l.locale = 'en'
      WHERE g.creation_key ~ '^core56-tc-[0-9]{3}$'
    `;
  } catch (error) {
    await sql.end({ timeout: 5 }).catch(() => undefined);
    throw error;
  }

  const identity = assertCore56Identity(rows.map((r) => r.creation_key));
  if (!identity.ok) {
    await sql.end({ timeout: 5 }).catch(() => undefined);
    console.error("Core 56 identity assertion FAILED — refusing to continue.");
    console.error(JSON.stringify(identity, null, 2));
    process.exitCode = 1;
    return;
  }

  const byArticleId = new Map(rows.map((r) => [articleIdFromCreationKey(r.creation_key)!, r]));
  const wanted = args.ids ? new Set(args.ids) : null;
  let articleIds = sortArticleIdsNumerically(identity.articleIds).filter((id) => !wanted || wanted.has(id));
  if (args.limit) articleIds = articleIds.slice(0, args.limit);

  const resolvedHost = summarizeUrl(process.env.DATABASE_URL).host || null;

  let envAuthorization = resolveWriteAuthorization({
    databaseTargetEnv: process.env.DATABASE_TARGET,
    requestedWrite: args.write,
    target: args.target,
    confirmStagingIdentity: args.confirmStagingIdentity,
    resolvedHost,
    knownProductionIdentity: process.env.CORE56_PRODUCTION_HOST_FINGERPRINT,
    source: "database",
  });

  let actor: ActorResolution | null = null;
  if (args.write && envAuthorization.authorized) {
    actor = await resolveActor(sql, args.actorEmail);
    if (!actor.ok) {
      envAuthorization = { authorized: false, reason: actor.reason, resolvedFingerprint: envAuthorization.resolvedFingerprint };
    }
  }

  const plans: ArticlePlan[] = articleIds.map((articleId) => {
    const row = byArticleId.get(articleId)!;
    const snapshot = row.published_snapshot ?? row.draft_snapshot;
    const parsed = articleDraftSchema.safeParse(snapshot);
    if (!parsed.success) {
      return { articleId, status: "invalid" as const, workflowStatus: row.draft_workflow_status, diff: null, reasons: [`Snapshot failed schema validation: ${parsed.error.issues.map((i) => i.message).join("; ")}`] };
    }
    const article = parsed.data;
    let editorDocResult: { ok: true; diff: RemediationDiff } | { ok: false; reason: string } | null = null;
    if (row.draft_workflow_status === "draft") {
      const result = transformEditorDocument(row.editor_document);
      editorDocResult = result.ok ? { ok: true, diff: result.diff } : { ok: false, reason: result.reason };
    }
    return classifyArticle(articleId, row.draft_workflow_status, article, editorDocResult);
  });

  const writeResults: WriteResult[] = [];
  if (envAuthorization.authorized && actor?.ok) {
    const applicable = plans.filter((p) => p.status === "auto-fix-safe" || p.status === "auto-fix-with-manual-follow-up");
    for (const plan of applicable) {
      const row = byArticleId.get(plan.articleId)!;
      try {
        const result = await sql.begin((tx) => applyOneWrite(tx, row, plan, actor!.actorId));
        writeResults.push(result);
      } catch (error) {
        writeResults.push({ articleId: plan.articleId, applied: false, reason: error instanceof Error ? error.message : String(error) });
      }
    }
  }

  await sql.end({ timeout: 5 }).catch(() => undefined);
  report(requestedMode, envAuthorization, plans, `database (host fingerprint ${envAuthorization.resolvedFingerprint || (resolvedHost ? hashForLog(resolvedHost) : "unknown")})`, writeResults);
}

type WriteResult = { articleId: string; applied: boolean; reason?: string; beforeChecksum?: string; afterChecksum?: string; qa?: QaComparison };

async function applyOneWrite(tx: postgres.TransactionSql, row: DbRow, plan: ArticlePlan, actorId: string): Promise<WriteResult> {
  const [locked] = await tx<{ id: string; draft_workflow_status: InsightStatus; lock_version: number }[]>`
    SELECT id, draft_workflow_status, lock_version FROM insight_article_groups WHERE id = ${row.group_id} FOR UPDATE
  `;
  if (!locked || locked.draft_workflow_status !== "draft") {
    return { articleId: plan.articleId, applied: false, reason: "Article is no longer in draft status (changed since planning); skipped for safety." };
  }

  const [localization] = await tx<{ id: string; draft_snapshot: unknown; editor_document: unknown }[]>`
    SELECT id, draft_snapshot, editor_document FROM insight_article_localizations WHERE id = ${row.localization_id} FOR UPDATE
  `;
  const currentDraft = articleDraftSchema.parse(localization.draft_snapshot);
  const beforeChecksum = checksumOf(currentDraft.blocks);
  const beforeQa = validateInsightArticle(currentDraft, [currentDraft]);

  const transformed = transformEditorDocument(localization.editor_document);
  if (!transformed.ok || !transformed.diff.changed) {
    return { articleId: plan.articleId, applied: false, reason: "Article changed since planning (no longer a clean auto-fix); skipped for safety." };
  }

  // One shared timestamp for every derived field and every updated_at column
  // touched by this write, so the editor-loaded draft and the DB rows it
  // came from can never disagree about when this happened.
  const now = new Date();
  const readingTime = computeReadingTime(transformed.blocks);
  const draftWithBlocks: InsightArticle = { ...currentDraft, blocks: transformed.blocks, readingTime, updatedAt: now.toISOString() };

  const afterQa = validateInsightArticle(draftWithBlocks, [draftWithBlocks]);
  const qa = compareQaResults(beforeQa, afterQa);
  if (!qa.safeToApply) {
    return { articleId: plan.articleId, applied: false, reason: `Refusing: transform introduced new Publish QA error code(s): ${qa.newErrorCodes.join(", ")}.`, qa };
  }

  // The draft_snapshot's own publishQa summary must reflect the exact same
  // QA result being written to publish_qa_snapshot below — otherwise the
  // editor-loaded draft and the database QA column could disagree.
  const nextDraft: InsightArticle = { ...draftWithBlocks, publishQa: { summary: summarizeQaText(afterQa), checkedAt: now.toISOString() } };

  const identityCheck = verifyIdentityUnchanged(currentDraft, nextDraft);
  if (!identityCheck.ok) {
    return { articleId: plan.articleId, applied: false, reason: `Refusing: transform unexpectedly changed identity field(s): ${identityCheck.changedFields.join(", ")}.` };
  }

  const afterChecksum = checksumOf(nextDraft.blocks);

  await tx`
    UPDATE insight_article_localizations
    SET draft_snapshot = ${tx.json(nextDraft)},
        normalized_blocks = ${tx.json(nextDraft.blocks)},
        editor_document = ${tx.json(transformed.document as never)},
        publish_qa_snapshot = ${tx.json(afterQa)},
        draft_version = draft_version + 1,
        updated_at = ${now}
    WHERE id = ${row.localization_id}
  `;
  await tx`
    UPDATE insight_article_groups SET lock_version = lock_version + 1, updated_at = ${now} WHERE id = ${row.group_id} AND lock_version = ${locked.lock_version}
  `;
  await tx`
    INSERT INTO admin_audit_logs (event, actor_id, target_type, target_id, summary, metadata)
    VALUES (
      'article_save', ${actorId}, 'insight_article_group', ${row.group_id},
      ${`Core 56 S00 hygiene remediation applied to ${plan.articleId}.`},
      ${tx.json({
        source: "insights-remediate-core56",
        transformationVersion: "core56-s00-hygiene-v1",
        articleId: plan.articleId,
        beforeChecksum,
        afterChecksum,
        beforeBlockCount: currentDraft.blocks.length,
        afterBlockCount: nextDraft.blocks.length,
        exactChanges: transformed.diff.warnings,
        existingWarningCodes: qa.existingWarningCodes,
        introducedWarningCodes: qa.introducedWarningCodes,
      })}
    )
  `;

  return { articleId: plan.articleId, applied: true, beforeChecksum, afterChecksum, qa };
}

function report(
  requestedMode: "write" | "dry-run",
  authorization: WriteAuthorizationResult,
  plans: ArticlePlan[],
  dataSource: string,
  writeResults: WriteResult[] = []
) {
  const executedMode = requestedMode === "dry-run" ? "dry-run" : authorization.authorized ? "write" : "write-refused";
  const summary = {
    requestedMode,
    authorizationResult: authorization,
    executedMode,
    resolvedHostFingerprint: authorization.resolvedFingerprint,
    refusalReason: authorization.authorized ? null : authorization.reason,
    dataSource,
    articleGroupsInspected: plans.length,
    counts: plans.reduce<Record<string, number>>((acc, p) => {
      acc[p.status] = (acc[p.status] ?? 0) + 1;
      return acc;
    }, {}),
    writesApplied: writeResults.filter((w) => w.applied).length,
    writesSkipped: writeResults.filter((w) => !w.applied).length,
    noPublishedSnapshotEverChanged: true,
  };

  fs.mkdirSync(artifactsDir, { recursive: true });
  const outputPath = path.join(artifactsDir, executedMode === "write" ? "remediation-write.json" : "remediation-dry-run.json");
  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      { generatedAt: new Date().toISOString(), ...summary, plans: plans.map((p) => ({ articleId: p.articleId, status: p.status, workflowStatus: p.workflowStatus, reasons: p.reasons })), writeResults },
      null,
      2
    )
  );
  console.log(JSON.stringify(summary, null, 2));
  console.log(`Full report written to ${outputPath} (gitignored; contains no secrets, but keep local).`);
}
