import fs from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import type { InsightArticle } from "../src/content/insights.types";
import type { Locale } from "../src/lib/i18n";
import { contentImportPayloadSchema, prepareContentImport, type PreparedContentImport } from "../src/lib/admin/content-import";
import { articleDraftSchema } from "../src/lib/admin/validation";

loadEnvConfig(process.cwd());

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Draft import failed.");
  process.exit(1);
});

type DatabaseTarget = "development" | "staging" | "production";
type GroupRow = {
  id: string;
  translation_group_id: string;
  shared_slug: string;
  category_slug: string;
  draft_workflow_status: string;
  lock_version: number;
};
type LocalizationRow = { locale: Locale; draft_snapshot: unknown; editor_document: unknown };
type ActorRow = { id: string; email: string; status: string };

async function main() {
  const args = process.argv.slice(2);
  const fileArg = readArg(args, "file");
  const actorEmailArg = readArg(args, "actor-email") ?? process.env.CONTENT_IMPORT_ACTOR_EMAIL;
  const requestedTarget = readArg(args, "target") as DatabaseTarget | undefined;
  const write = args.includes("--write");
  const explicitDryRun = args.includes("--dry-run");

  if (!fileArg || !actorEmailArg) {
    throw new Error("Usage: npm run insights:import-draft -- --file=content-production/core56/TC-007.en.json --actor-email=editor@taskcover.com --target=staging --dry-run|--write");
  }
  if (write && explicitDryRun) throw new Error("Choose either --dry-run or --write, not both.");

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required. Refusing to import into an unknown database.");
  const environmentTarget = process.env.DATABASE_TARGET as DatabaseTarget | undefined;
  if (!environmentTarget || !["development", "staging", "production"].includes(environmentTarget)) {
    throw new Error("DATABASE_TARGET must be development, staging, or production.");
  }
  const target = requestedTarget ?? environmentTarget;
  if (target !== environmentTarget) {
    throw new Error(`--target=${target} does not match DATABASE_TARGET=${environmentTarget}.`);
  }
  if (target === "production" && write && !args.includes("--confirm-production-import")) {
    throw new Error("Production draft import requires --confirm-production-import. Import remains draft-only even when confirmed.");
  }

  const absolutePath = path.resolve(process.cwd(), fileArg);
  const payloadInput = JSON.parse(fs.readFileSync(absolutePath, "utf8")) as unknown;
  const payload = contentImportPayloadSchema.parse(payloadInput);
  const actorEmail = actorEmailArg.trim().toLowerCase();
  const sql = postgres(databaseUrl, { max: 1, prepare: false, fetch_types: false });

  try {
    const actor = await findActiveUser(sql, actorEmail);
    const existingGroup = await findGroup(sql, payload.creationKey);
    const existingRows = existingGroup ? await listLocalizations(sql, existingGroup.id) : [];
    assertImportScope(payload.publicationLocales, existingRows.map((row) => row.locale));
    if (existingGroup) assertEditableGroup(existingGroup, payload.sharedSlug, payload.category);

    const existingLocalizations = toExistingLocalizations(existingRows);
    const prepared = prepareContentImport(payload, {
      groupId: existingGroup?.id,
      translationGroupId: existingGroup?.translation_group_id,
      existingLocalizations,
    });

    if (!write) {
      printReport({ mode: "dry-run", target, action: existingGroup ? "update" : "create", articleId: existingGroup?.id ?? null, prepared });
      return;
    }

    const result = await sql.begin(async (tx) => {
      const currentGroup = await findGroup(tx, payload.creationKey);
      const groupResult = currentGroup
        ? { group: currentGroup, created: false }
        : await createGroup(tx, payload, actor.id);
      const { group, created } = groupResult;
      assertEditableGroup(group, payload.sharedSlug, payload.category);

      const currentRows = await listLocalizations(tx, group.id);
      assertImportScope(payload.publicationLocales, currentRows.map((row) => row.locale));
      const finalPrepared = prepareContentImport(payload, {
        groupId: group.id,
        translationGroupId: group.translation_group_id,
        existingLocalizations: toExistingLocalizations(currentRows),
      });

      for (const localization of finalPrepared.localizations) {
        await upsertLocalization(tx, group.id, localization);
      }

      const assignment = await resolveAssignment(tx, payload.assignment);
      const updatedRows = await tx<{ lock_version: number }[]>`
        UPDATE insight_article_groups
        SET
          updated_by = ${actor.id},
          author_key = ${payload.author},
          owner_id = COALESCE(${assignment.ownerId}, owner_id),
          assignee_id = COALESCE(${assignment.assigneeId}, assignee_id),
          reviewer_id = COALESCE(${assignment.reviewerId}, reviewer_id),
          due_date = CASE WHEN ${assignment.dueDateProvided} THEN ${assignment.dueDate}::timestamptz ELSE due_date END,
          priority = COALESCE(${assignment.priority}, priority),
          lock_version = lock_version + 1,
          updated_at = now()
        WHERE id = ${group.id} AND draft_workflow_status = 'draft'
        RETURNING lock_version
      `;
      if (!updatedRows[0]) throw new Error("Draft changed state during import. No content was committed.");

      if (created) {
        await tx`
          INSERT INTO workflow_events (article_group_id, from_status, to_status, actor_id, note, metadata)
          VALUES (${group.id}, NULL, 'draft', ${actor.id}, ${payload.importNote ?? "Draft created by structured content import."}, ${tx.json({ source: fileArg, publicationLocales: payload.publicationLocales })})
        `;
      }
      await tx`
        INSERT INTO admin_audit_logs (event, actor_id, target_type, target_id, summary, metadata)
        VALUES (
          ${created ? "article_create" : "article_save"},
          ${actor.id},
          'insight_article_group',
          ${group.id},
          ${created ? "Structured Insight draft imported." : "Structured Insight draft updated."},
          ${tx.json({ source: fileArg, creationKey: payload.creationKey, publicationLocales: payload.publicationLocales, schemaVersion: payload.schemaVersion })}
        )
      `;

      return { articleId: group.id, created, prepared: finalPrepared };
    });

    printReport({ mode: "write", target, action: result.created ? "create" : "update", articleId: result.articleId, prepared: result.prepared });
  } finally {
    await sql.end();
  }
}

async function createGroup(
  sql: postgres.Sql,
  payload: ReturnType<typeof contentImportPayloadSchema.parse>,
  actorId: string
): Promise<{ group: GroupRow; created: boolean }> {
  const rows = await sql<GroupRow[]>`
    INSERT INTO insight_article_groups (
      translation_group_id, shared_slug, category_slug, author_key, creation_key,
      draft_workflow_status, created_by, updated_by, lock_version
    )
    VALUES (
      ${`insight-${payload.creationKey}`}, ${payload.sharedSlug}, ${payload.category}, ${payload.author}, ${payload.creationKey},
      'draft', ${actorId}, ${actorId}, 0
    )
    ON CONFLICT (creation_key) DO NOTHING
    RETURNING id, translation_group_id, shared_slug, category_slug, draft_workflow_status, lock_version
  `;
  if (rows[0]) return { group: rows[0], created: true };
  const concurrent = await findGroup(sql, payload.creationKey);
  if (!concurrent) throw new Error("Concurrent draft creation conflict could not be resolved.");
  return { group: concurrent, created: false };
}

async function upsertLocalization(
  sql: postgres.Sql,
  groupId: string,
  localization: PreparedContentImport["localizations"][number]
) {
  const article = localization.article;
  const socialMetadata = {
    ogTitle: article.metadata.ogTitle,
    ogDescription: article.metadata.ogDescription,
    ogImage: article.metadata.ogImage,
    twitterTitle: article.metadata.twitterTitle,
    twitterDescription: article.metadata.twitterDescription,
    twitterImage: article.metadata.twitterImage,
  };
  await sql`
    INSERT INTO insight_article_localizations (
      article_group_id, locale, slug, internal_title, public_h1, excerpt,
      editor_document, normalized_blocks, draft_snapshot, search_strategy,
      evidence_data, internal_link_data, metadata, social_metadata,
      schema_configuration, localization_data, publish_qa_snapshot, draft_version
    )
    VALUES (
      ${groupId}, ${localization.locale}, ${article.slug}, ${article.internalTitle}, ${article.h1}, ${article.excerpt},
      ${sql.json(localization.editorDocument)}, ${sql.json(article.blocks)}, ${sql.json(article)}, ${sql.json(article.searchStrategy)},
      ${sql.json(article.contentEvidence)}, ${sql.json(article.internalLinking)}, ${sql.json(article.metadata)}, ${sql.json(socialMetadata)},
      ${sql.json(article.schema)}, ${sql.json(article.localization)}, ${sql.json(localization.qa)}, 1
    )
    ON CONFLICT (article_group_id, locale) DO UPDATE SET
      slug = EXCLUDED.slug,
      internal_title = EXCLUDED.internal_title,
      public_h1 = EXCLUDED.public_h1,
      excerpt = EXCLUDED.excerpt,
      editor_document = EXCLUDED.editor_document,
      normalized_blocks = EXCLUDED.normalized_blocks,
      draft_snapshot = EXCLUDED.draft_snapshot,
      search_strategy = EXCLUDED.search_strategy,
      evidence_data = EXCLUDED.evidence_data,
      internal_link_data = EXCLUDED.internal_link_data,
      metadata = EXCLUDED.metadata,
      social_metadata = EXCLUDED.social_metadata,
      schema_configuration = EXCLUDED.schema_configuration,
      localization_data = EXCLUDED.localization_data,
      publish_qa_snapshot = EXCLUDED.publish_qa_snapshot,
      draft_version = insight_article_localizations.draft_version + 1,
      updated_at = now()
  `;
}

async function findActiveUser(sql: postgres.Sql, email: string): Promise<ActorRow> {
  const rows = await sql<ActorRow[]>`
    SELECT id, email, status FROM admin_users WHERE normalized_email = ${email} LIMIT 1
  `;
  const user = rows[0];
  if (!user || user.status !== "active") throw new Error(`Active Admin/Editor account not found for ${email}.`);
  return user;
}

async function findGroup(sql: postgres.Sql, creationKey: string): Promise<GroupRow | null> {
  const rows = await sql<GroupRow[]>`
    SELECT id, translation_group_id, shared_slug, category_slug, draft_workflow_status, lock_version
    FROM insight_article_groups WHERE creation_key = ${creationKey} LIMIT 1
  `;
  return rows[0] ?? null;
}

async function listLocalizations(sql: postgres.Sql, articleGroupId: string): Promise<LocalizationRow[]> {
  return sql<LocalizationRow[]>`
    SELECT locale, draft_snapshot, editor_document
    FROM insight_article_localizations
    WHERE article_group_id = ${articleGroupId}
    ORDER BY locale
  `;
}

function toExistingLocalizations(rows: LocalizationRow[]) {
  return Object.fromEntries(
    rows.map((row) => [
      row.locale,
      { article: articleDraftSchema.parse(row.draft_snapshot), editorDocument: row.editor_document },
    ])
  ) as Partial<Record<Locale, { article: InsightArticle; editorDocument: unknown }>>;
}

function assertEditableGroup(group: GroupRow, sharedSlug: string, category: string) {
  if (group.draft_workflow_status !== "draft") {
    throw new Error(`Existing article is ${group.draft_workflow_status}; importer only updates drafts.`);
  }
  if (group.shared_slug !== sharedSlug || group.category_slug !== category) {
    throw new Error("creationKey already belongs to a different sharedSlug or category.");
  }
}

function assertImportScope(requested: Locale[], existing: Locale[]) {
  const requestedSet = new Set(requested);
  const extraExisting = existing.filter((locale) => !requestedSet.has(locale));
  if (extraExisting.length) {
    throw new Error(`Import cannot remove existing publication locales: ${extraExisting.join(", ")}. Add them back to publicationLocales.`);
  }
}

async function resolveAssignment(
  sql: postgres.Sql,
  assignment: ReturnType<typeof contentImportPayloadSchema.parse>["assignment"]
) {
  const resolve = async (email?: string) => email ? (await findActiveUser(sql, email)).id : null;
  return {
    ownerId: await resolve(assignment?.ownerEmail),
    assigneeId: await resolve(assignment?.assigneeEmail),
    reviewerId: await resolve(assignment?.reviewerEmail),
    dueDate: assignment?.dueDate ?? null,
    dueDateProvided: Boolean(assignment && Object.prototype.hasOwnProperty.call(assignment, "dueDate")),
    priority: assignment?.priority ?? null,
  };
}

function printReport(input: {
  mode: "dry-run" | "write";
  target: DatabaseTarget;
  action: "create" | "update";
  articleId: string | null;
  prepared: PreparedContentImport;
}) {
  console.log(JSON.stringify({
    mode: input.mode,
    target: input.target,
    action: input.action,
    articleId: input.articleId,
    creationKey: input.prepared.payload.creationKey,
    sharedSlug: input.prepared.payload.sharedSlug,
    category: input.prepared.payload.category,
    publicationLocales: input.prepared.payload.publicationLocales,
    blockingErrors: input.prepared.blockingErrors,
    warnings: input.prepared.warnings,
    localizations: input.prepared.localizations.map((item) => ({ locale: item.locale, ...item.summary })),
  }, null, 2));
}

function readArg(args: string[], name: string): string | undefined {
  const inline = args.find((arg) => arg.startsWith(`--${name}=`));
  if (inline) return inline.slice(name.length + 3);
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : undefined;
}
