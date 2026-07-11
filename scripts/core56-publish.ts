import crypto from "node:crypto";
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import type { InsightArticle, InsightStatus } from "../src/content/insights.types";
import { materializePublishedSnapshot } from "../src/lib/admin/content-model";
import { articleDraftSchema } from "../src/lib/admin/validation";
import { validateInsightArticle, type PublishQaResult } from "../src/lib/insights/publish-qa";

loadEnvConfig(process.cwd());

type Locale = "en" | "fr" | "es";

type GroupRow = {
  id: string;
  creation_key: string;
  shared_slug: string;
  draft_workflow_status: InsightStatus;
  lock_version: number;
  published_revision_group_id: string | null;
  published_at: Date | null;
};

type LocalizationRow = {
  id: string;
  article_group_id: string;
  locale: Locale;
  draft_snapshot: unknown;
  editor_document: unknown;
  normalized_blocks: unknown;
};

type GroupWithLocalizations = GroupRow & {
  localizations: LocalizationRow[];
  drafts: InsightArticle[];
  qa: PublishQaResult[];
};

const hardStopArticleIds = new Set(["TC-027", "TC-028", "TC-056"]);

const args = parseArgs(process.argv.slice(2));
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const sql = postgres(databaseUrl, { max: 1, prepare: false });

main().catch(async (error) => {
  await sql.end({ timeout: 5 }).catch(() => undefined);
  console.error(error instanceof Error ? error.message : "Core 56 publish failed.");
  process.exit(1);
});

async function main() {
  const groups = await loadCore56Groups();
  const filtered = filterGroups(groups);
  const blocking = filtered.filter((group) => errorCount(group.qa) > 0);
  const hardStops = filtered.filter((group) => hardStopArticleIds.has(articleCode(group.creation_key)) && !args.includeHardStops);
  const publishable = filtered.filter((group) => {
    if (group.draft_workflow_status === "published" && group.published_revision_group_id) return false;
    if (errorCount(group.qa) > 0) return false;
    if (hardStopArticleIds.has(articleCode(group.creation_key)) && !args.includeHardStops) return false;
    return true;
  });
  const selected = args.limit ? publishable.slice(0, args.limit) : publishable;

  const summary = {
    mode: args.publish ? "publish" : "dry-run",
    totalCore56Groups: groups.length,
    filteredGroups: filtered.length,
    alreadyPublished: filtered.filter((group) => group.draft_workflow_status === "published" && group.published_revision_group_id).length,
    blockingQaGroups: blocking.length,
    hardStopExcludedGroups: hardStops.map((group) => ({
      articleId: articleCode(group.creation_key),
      slug: group.shared_slug,
      reason: hardStopReason(articleCode(group.creation_key)),
    })),
    selectedForPublish: selected.map((group) => ({
      articleId: articleCode(group.creation_key),
      slug: group.shared_slug,
      status: group.draft_workflow_status,
      warnings: warningCount(group.qa),
    })),
    qaBlockingSamples: blocking.slice(0, 10).map((group) => ({
      articleId: articleCode(group.creation_key),
      slug: group.shared_slug,
      errors: group.qa.filter((item) => item.severity === "error").map((item) => `${item.code}: ${item.message}`),
    })),
  };

  console.log(JSON.stringify(summary, null, 2));

  if (!args.publish) {
    await sql.end({ timeout: 5 }).catch(() => undefined);
    return;
  }

  const selectedBlocking = selected.filter((group) => errorCount(group.qa) > 0);
  if (selectedBlocking.length) throw new Error("Refusing to publish selected articles while blocking QA errors exist.");
  if (!selected.length) {
    await sql.end({ timeout: 5 }).catch(() => undefined);
    console.log("No eligible Core 56 articles selected for publishing.");
    return;
  }

  const published: { articleId: string; slug: string }[] = [];
  for (const group of selected) {
    await publishGroup(group.id);
    published.push({ articleId: articleCode(group.creation_key), slug: group.shared_slug });
    console.log(`Published ${articleCode(group.creation_key)} ${group.shared_slug}`);
  }

  await sql.end({ timeout: 5 }).catch(() => undefined);
  console.log(JSON.stringify({ publishedCount: published.length, published }, null, 2));
}

async function loadCore56Groups(): Promise<GroupWithLocalizations[]> {
  const groups = await sql<GroupRow[]>`
    SELECT id, creation_key, shared_slug, draft_workflow_status, lock_version, published_revision_group_id, published_at
    FROM insight_article_groups
    WHERE creation_key LIKE 'core56-%'
    ORDER BY creation_key
  `;
  const localizations = await sql<LocalizationRow[]>`
    SELECT id, article_group_id, locale::text AS locale, draft_snapshot, editor_document, normalized_blocks
    FROM insight_article_localizations
    WHERE article_group_id IN ${sql(groups.map((group) => group.id))}
    ORDER BY locale
  `;
  return groups.map((group) => {
    const rows = localizations.filter((row) => row.article_group_id === group.id);
    const drafts = rows.map((row) => articleDraftSchema.parse(row.draft_snapshot));
    const qa = drafts.flatMap((article) => validateInsightArticle(article, drafts));
    return { ...group, localizations: rows, drafts, qa };
  });
}

function filterGroups(groups: GroupWithLocalizations[]) {
  const ids = args.ids ? new Set(args.ids.map((id) => id.toUpperCase())) : null;
  return ids ? groups.filter((group) => ids.has(articleCode(group.creation_key))) : groups;
}

async function publishGroup(articleGroupId: string) {
  await sql.begin(async (tx) => {
    let group = await fetchGroupForUpdate(tx, articleGroupId);
    if (!group) throw new Error(`Article group not found: ${articleGroupId}`);
    if (group.draft_workflow_status === "published" && group.published_revision_group_id) return;

    if (group.draft_workflow_status === "draft") {
      await transitionNonPublish(tx, group, "in-review", "Core 56 bulk submit for publish QA.");
      group = await fetchGroupForUpdate(tx, articleGroupId);
    }
    if (group?.draft_workflow_status === "in-review") {
      await transitionNonPublish(tx, group, "approved", "Core 56 bulk approval after publish QA.");
      group = await fetchGroupForUpdate(tx, articleGroupId);
    }
    if (group?.draft_workflow_status !== "approved") {
      throw new Error(`Cannot publish ${articleGroupId} from status ${group?.draft_workflow_status ?? "missing"}.`);
    }
    await transitionPublish(tx, group, "Core 56 bulk publish.");
  });
}

async function fetchGroupForUpdate(tx: postgres.TransactionSql, articleGroupId: string) {
  const rows = await tx<GroupRow[]>`
    SELECT id, creation_key, shared_slug, draft_workflow_status, lock_version, published_revision_group_id, published_at
    FROM insight_article_groups
    WHERE id = ${articleGroupId}
    FOR UPDATE
  `;
  return rows[0] ?? null;
}

async function loadLocalizations(tx: postgres.TransactionSql, articleGroupId: string) {
  const rows = await tx<LocalizationRow[]>`
    SELECT id, article_group_id, locale::text AS locale, draft_snapshot, editor_document, normalized_blocks
    FROM insight_article_localizations
    WHERE article_group_id = ${articleGroupId}
    ORDER BY locale
  `;
  const drafts = rows.map((row) => articleDraftSchema.parse(row.draft_snapshot));
  return { rows, drafts };
}

async function transitionNonPublish(tx: postgres.TransactionSql, group: GroupRow, to: "in-review" | "approved", note: string) {
  assertTransition(group.draft_workflow_status, to);
  const { rows, drafts } = await loadLocalizations(tx, group.id);
  const qa = drafts.flatMap((article) => validateInsightArticle(article, drafts));
  if (to === "approved" && errorCount(qa) > 0) throw new Error(`Cannot approve ${group.creation_key}: blocking QA errors.`);
  const now = new Date();
  for (const row of rows) {
    const draft = articleDraftSchema.parse(row.draft_snapshot);
    const nextDraft = articleDraftSchema.parse({
      ...draft,
      status: to,
      updatedAt: now.toISOString(),
      publishQa: {
        summary: summarizeQa(validateInsightArticle(draft, drafts)),
        checkedAt: now.toISOString(),
      },
    });
    await tx`
      UPDATE insight_article_localizations
      SET draft_snapshot = ${tx.json(nextDraft)},
          publish_qa_snapshot = ${tx.json(validateInsightArticle(nextDraft, drafts))},
          updated_at = ${now}
      WHERE id = ${row.id}
    `;
  }
  await writeWorkflowUpdate(tx, group, to, note, now, null);
}

async function transitionPublish(tx: postgres.TransactionSql, group: GroupRow, note: string) {
  assertTransition(group.draft_workflow_status, "published");
  const { rows, drafts } = await loadLocalizations(tx, group.id);
  const now = new Date();
  const revisionGroupId = crypto.randomUUID();
  const snapshots = drafts.map((article) => materializePublishedSnapshot(article, now));
  for (const snapshot of snapshots) {
    const errors = validateInsightArticle(snapshot, snapshots).filter((item) => item.severity === "error");
    if (errors.length) throw new Error(`Cannot publish ${group.creation_key}/${snapshot.locale}: ${errors.map((item) => item.message).join("; ")}`);
  }
  for (const row of rows) {
    const snapshot = snapshots.find((article) => article.locale === row.locale);
    if (!snapshot) throw new Error(`Missing snapshot for ${group.creation_key}/${row.locale}.`);
    const revisionNumberRows = await tx<{ value: number | null }[]>`
      SELECT max(revision_number)::int AS value
      FROM insight_article_revisions
      WHERE localization_id = ${row.id}
    `;
    const revisionNumber = (revisionNumberRows[0]?.value ?? 0) + 1;
    const revisionRows = await tx<{ id: string }[]>`
      INSERT INTO insight_article_revisions (
        revision_group_id, localization_id, revision_number, editor_document, normalized_blocks,
        article_snapshot, metadata_snapshot, seo_snapshot, evidence_snapshot, created_by,
        revision_reason, workflow_transition
      )
      VALUES (
        ${revisionGroupId}, ${row.id}, ${revisionNumber}, ${tx.json(row.editor_document as never)}, ${tx.json(row.normalized_blocks as never)},
        ${tx.json(snapshot)}, ${tx.json(snapshot.metadata)}, ${tx.json(snapshot.searchStrategy)}, ${tx.json(snapshot.contentEvidence)}, null,
        ${note}, ${`${group.draft_workflow_status}->published`}
      )
      RETURNING id
    `;
    await tx`
      UPDATE insight_article_localizations
      SET draft_snapshot = ${tx.json(snapshot)},
          published_snapshot = ${tx.json(snapshot)},
          published_revision_id = ${revisionRows[0]!.id},
          publish_qa_snapshot = ${tx.json(validateInsightArticle(snapshot, snapshots))},
          updated_at = ${now}
      WHERE id = ${row.id}
    `;
  }
  await writeWorkflowUpdate(tx, group, "published", note, now, revisionGroupId);
}

async function writeWorkflowUpdate(
  tx: postgres.TransactionSql,
  group: GroupRow,
  to: InsightStatus,
  note: string,
  now: Date,
  revisionGroupId: string | null
) {
  await tx`
    UPDATE insight_article_groups
    SET draft_workflow_status = ${to},
        lock_version = lock_version + 1,
        updated_at = ${now},
        updated_by = null,
        scheduled_at = null,
        approved_by = CASE WHEN ${to} = 'approved' THEN null ELSE approved_by END,
        approved_at = CASE WHEN ${to} = 'approved' THEN ${now} ELSE approved_at END,
        published_revision_group_id = COALESCE(${revisionGroupId}, published_revision_group_id),
        published_at = CASE WHEN ${to} = 'published' THEN ${now} ELSE published_at END,
        archived_at = CASE WHEN ${to} IN ('draft', 'published') THEN null ELSE archived_at END
    WHERE id = ${group.id}
      AND draft_workflow_status = ${group.draft_workflow_status}
      AND lock_version = ${group.lock_version}
  `;
  await tx`
    INSERT INTO workflow_events (article_group_id, from_status, to_status, actor_id, note, metadata)
    VALUES (${group.id}, ${group.draft_workflow_status}, ${to}, null, ${note}, ${tx.json({ source: "core56-publish" })})
  `;
  await tx`
    INSERT INTO admin_audit_logs (event, actor_id, target_type, target_id, summary, metadata)
    VALUES (
      ${auditEventFor(group.draft_workflow_status, to)}, null, 'insight_article_group', ${group.id},
      ${`Article workflow changed from ${group.draft_workflow_status} to ${to}.`},
      ${tx.json({ from: group.draft_workflow_status, to, source: "core56-publish" })}
    )
  `;
}

function assertTransition(from: InsightStatus, to: InsightStatus) {
  const allowed =
    (from === "draft" && to === "in-review") ||
    (from === "in-review" && to === "approved") ||
    (from === "approved" && to === "published");
  if (!allowed) throw new Error(`Forbidden workflow transition: ${from} -> ${to}`);
}

function auditEventFor(from: InsightStatus, to: InsightStatus) {
  if (from === "draft" && to === "in-review") return "submit_for_review";
  if (from === "in-review" && to === "approved") return "approve";
  if (from === "approved" && to === "published") return "publish";
  throw new Error(`No audit event is defined for ${from} -> ${to}.`);
}

function summarizeQa(results: PublishQaResult[]) {
  if (!results.length) return "Publish QA has not run.";
  const errors = errorCount(results);
  const warnings = warningCount(results);
  const passed = results.filter((item) => item.severity === "pass").length;
  return `${errors} blocking errors, ${warnings} warnings, ${passed} passed checks.`;
}

function articleCode(creationKey: string) {
  return creationKey.replace(/^core56-/i, "").toUpperCase();
}

function hardStopReason(articleId: string) {
  if (articleId === "TC-027") return "Healthcare YMYL article requires qualified medical review before publish.";
  if (articleId === "TC-028") return "Legal/immigration YMYL article requires qualified legal review before publish.";
  if (articleId === "TC-056") return "Benchmark article requires real dataset/method review before publishing conclusions.";
  return "Human verification required before publish.";
}

function errorCount(results: PublishQaResult[]) {
  return results.filter((item) => item.severity === "error").length;
}

function warningCount(results: PublishQaResult[]) {
  return results.filter((item) => item.severity === "warning").length;
}

function parseArgs(raw: string[]) {
  const parsed: { publish: boolean; includeHardStops: boolean; limit?: number; ids?: string[] } = {
    publish: false,
    includeHardStops: false,
  };
  for (let index = 0; index < raw.length; index += 1) {
    const arg = raw[index];
    if (arg === "--publish") parsed.publish = true;
    else if (arg === "--dry-run") parsed.publish = false;
    else if (arg === "--include-hard-stops") parsed.includeHardStops = true;
    else if (arg === "--limit") parsed.limit = Number(raw[++index]);
    else if (arg === "--ids") parsed.ids = (raw[++index] ?? "").split(",").map((value) => value.trim()).filter(Boolean);
  }
  if (parsed.limit !== undefined && (!Number.isInteger(parsed.limit) || parsed.limit < 1)) {
    throw new Error("--limit must be a positive integer.");
  }
  return parsed;
}
