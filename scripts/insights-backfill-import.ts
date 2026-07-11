import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import postgres from "postgres";
import { loadEnvConfig } from "@next/env";
import type { InsightArticle, InsightBlock, InsightRichText, InsightRichTextSegment } from "../src/content/insights.types";
import { validateInsightArticle } from "../src/lib/insights/publish-qa";
import { articleDraftSchema } from "../src/lib/admin/validation";

type BackfillResult = { groups: number; localizations: number };
type TiptapNode = { type: string; attrs?: Record<string, unknown>; content?: TiptapNode[]; text?: string; marks?: { type: string; attrs?: Record<string, unknown> }[] };

const backfillDir = path.join(process.cwd(), "src", "content", "backfill");

export async function loadBackfillArticles(): Promise<InsightArticle[]> {
  const files = fs
    .readdirSync(backfillDir)
    .filter((file) => /^core56-batch-.+\.ts$/.test(file))
    .sort();
  const articles: InsightArticle[] = [];
  for (const file of files) {
    const moduleUrl = pathToFileURL(path.join(backfillDir, file)).href;
    const moduleExports = (await import(moduleUrl)) as Record<string, unknown>;
    for (const value of Object.values(moduleExports)) {
      if (isInsightArticleArray(value)) articles.push(...value);
    }
  }
  return articles;
}

export async function validateBackfillArticles(input?: InsightArticle[]) {
  const articles = input ?? (await loadBackfillArticles());
  const failures: string[] = [];
  for (const article of articles) {
    const parsed = articleDraftSchema.safeParse(article);
    if (!parsed.success) {
      failures.push(`${article.id}: schema failed: ${parsed.error.issues.map((issue) => issue.message).join("; ")}`);
      continue;
    }
    const errors = validateInsightArticle(article, [article]).filter((result) => result.severity === "error");
    if (errors.length) failures.push(`${article.id}: publish QA failed: ${errors.map((error) => error.code).join(", ")}`);
  }
  return failures;
}

export async function importBackfillArticles(sql: postgres.Sql, input?: InsightArticle[]): Promise<BackfillResult> {
  const articles = input ?? (await loadBackfillArticles());
  const failures = await validateBackfillArticles(articles);
  if (failures.length) throw new Error(`Backfill validation failed:\n${failures.join("\n")}`);

  let groups = 0;
  let localizations = 0;

  for (const article of articles) {
    const existing = await sql<{ id: string; translation_group_id: string; status: InsightArticle["status"]; published_revision_group_id: string | null }[]>`
      SELECT g.id, g.translation_group_id, g.draft_workflow_status AS status, g.published_revision_group_id
      FROM insight_article_groups g
      LEFT JOIN insight_article_localizations l ON l.article_group_id = g.id AND l.locale = ${article.locale}
      WHERE g.translation_group_id = ${article.translationGroupId}
         OR g.creation_key = ${article.id}
         OR l.slug = ${article.slug}
      ORDER BY
        CASE
          WHEN l.slug = ${article.slug} AND g.published_revision_group_id IS NOT NULL THEN 0
          WHEN l.slug = ${article.slug} THEN 1
          WHEN g.creation_key = ${article.id} THEN 2
          ELSE 3
        END
      LIMIT 1
    `;

    if (existing[0]) {
      await sql`
        DELETE FROM insight_article_groups
        WHERE creation_key = ${article.id}
          AND id <> ${existing[0].id}
          AND published_revision_group_id IS NULL
      `;
    }

    const groupRows = existing[0]
      ? await sql<{ id: string; translation_group_id: string }[]>`
          UPDATE insight_article_groups
          SET shared_slug = ${article.slug},
              category_slug = ${article.category},
              author_key = ${article.author},
              creation_key = COALESCE(creation_key, ${article.id}),
              draft_workflow_status = 'draft',
              updated_at = now(),
              lock_version = lock_version + 1
          WHERE id = ${existing[0].id}
          RETURNING id, translation_group_id
        `
      : await sql<{ id: string; translation_group_id: string }[]>`
          INSERT INTO insight_article_groups (
            translation_group_id, shared_slug, category_slug, author_key, creation_key, draft_workflow_status, lock_version
          )
          VALUES (
            ${article.translationGroupId}, ${article.slug}, ${article.category}, ${article.author}, ${article.id}, 'draft', 1
          )
          RETURNING id, translation_group_id
        `;

    const groupId = groupRows[0]!.id;
    const dbArticle = articleDraftSchema.parse({
      ...article,
      id: groupId,
      translationGroupId: groupRows[0]!.translation_group_id,
      localization: {
        ...article.localization,
        hreflangGroup: groupRows[0]!.translation_group_id,
      },
    });

    const editorDocument = tiptapDocumentFor(article.blocks);
    const qa = validateInsightArticle(dbArticle, [dbArticle]);

    await sql`
      INSERT INTO insight_article_localizations (
        article_group_id, locale, slug, internal_title, public_h1, excerpt, editor_document, normalized_blocks,
        draft_snapshot, search_strategy, evidence_data, internal_link_data, metadata, social_metadata,
        schema_configuration, localization_data, publish_qa_snapshot, draft_version
      )
      VALUES (
        ${groupId}, ${dbArticle.locale}, ${dbArticle.slug}, ${dbArticle.internalTitle}, ${dbArticle.h1}, ${dbArticle.excerpt},
        ${sql.json(editorDocument as never)}, ${sql.json(dbArticle.blocks)}, ${sql.json(dbArticle)}, ${sql.json(dbArticle.searchStrategy)},
        ${sql.json(dbArticle.contentEvidence)}, ${sql.json(dbArticle.internalLinking)}, ${sql.json(dbArticle.metadata)},
        ${sql.json(socialMetadataFor(dbArticle))}, ${sql.json(dbArticle.schema)}, ${sql.json(dbArticle.localization)}, ${sql.json(qa)}, 1
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

    await sql`
      INSERT INTO workflow_events (article_group_id, from_status, to_status, actor_id, note, metadata)
      VALUES (
        ${groupId}, ${existing[0]?.status ?? null}, 'draft', null,
        ${`Core 56 backfill draft imported for ${article.id}.`},
        ${sql.json({ source: "core56-backfill", articleId: article.id, locale: dbArticle.locale })}
      )
    `;

    groups += 1;
    localizations += 1;
  }

  return { groups, localizations };
}

export function tiptapDocumentFor(blocks: InsightBlock[]) {
  return {
    type: "doc",
    content: blocks.flatMap(blockToTiptap),
  };
}

function blockToTiptap(block: InsightBlock): TiptapNode[] {
  switch (block.type) {
    case "paragraph":
      return [{ type: "paragraph", content: richTextContent(block.text) }];
    case "heading":
      return [{ type: "heading", attrs: { level: block.level }, content: textContent(block.text) }];
    case "bullet-list":
      return [{ type: "bulletList", content: block.items.map((item) => ({ type: "listItem", content: [{ type: "paragraph", content: richTextContent(item) }] })) }];
    case "numbered-list":
      return [{ type: "orderedList", content: block.items.map((item) => ({ type: "listItem", content: [{ type: "paragraph", content: richTextContent(item) }] })) }];
    case "quote":
      return [{ type: "blockquote", content: [{ type: "paragraph", content: richTextContent(block.quote) }] }];
    case "code":
      return [{ type: "codeBlock", attrs: { language: block.language }, content: textContent(block.code) }];
    case "divider":
      return [{ type: "horizontalRule" }];
    default:
      return [{ type: "structuredBlock", attrs: { blockType: block.type, data: block } }];
  }
}

function richTextContent(value: InsightRichText): TiptapNode[] {
  if (typeof value === "string") return textContent(value);
  return value.flatMap(segmentToNode);
}

function segmentToNode(segment: InsightRichTextSegment): TiptapNode[] {
  if (!segment.text) return [];
  const marks = segment.marks?.map((mark) => {
    if (mark.type === "link") return { type: "link", attrs: { href: mark.href } };
    return { type: mark.type };
  });
  return [{ type: "text", text: segment.text, ...(marks?.length ? { marks } : {}) }];
}

function textContent(text: string): TiptapNode[] {
  return text ? [{ type: "text", text }] : [];
}

function socialMetadataFor(article: InsightArticle) {
  return {
    ogTitle: article.metadata.ogTitle,
    ogDescription: article.metadata.ogDescription,
    ogImage: article.metadata.ogImage,
    twitterTitle: article.metadata.twitterTitle,
    twitterDescription: article.metadata.twitterDescription,
    twitterImage: article.metadata.twitterImage,
  };
}

function isInsightArticleArray(value: unknown): value is InsightArticle[] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Partial<InsightArticle>;
      return typeof candidate.id === "string" && typeof candidate.slug === "string" && candidate.locale === "en" && Array.isArray(candidate.blocks);
    })
  );
}

const isMainModule = (() => {
  try {
    return Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1] as string).href;
  } catch {
    return false;
  }
})();

if (isMainModule) {
  runBackfillCli().catch((error) => {
    console.error(error instanceof Error ? error.message : "Core 56 backfill import failed.");
    process.exit(1);
  });
}

async function runBackfillCli() {
  const articles = await loadBackfillArticles();
  const failures = await validateBackfillArticles(articles);
  if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
  }

  if (process.argv.includes("--validate-only")) {
    console.log(`Validated ${articles.length} Core 56 backfill article(s).`);
    process.exit(0);
  }

  loadEnvConfig(process.cwd());
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL is required. Use --validate-only for local content QA without DB access.");
    process.exit(1);
  }
  if (!process.env.DATABASE_TARGET || !["development", "staging", "production"].includes(process.env.DATABASE_TARGET)) {
    console.error("DATABASE_TARGET must be development, staging, or production.");
    process.exit(1);
  }
  if (process.env.DATABASE_TARGET === "production" && process.env.CONFIRM_PRODUCTION_IMPORT !== "YES") {
    console.error("Production backfill import requires CONFIRM_PRODUCTION_IMPORT=YES.");
    process.exit(1);
  }

  const sql = postgres(databaseUrl, { max: 1 });
  try {
    const result = await importBackfillArticles(sql, articles);
    await sql.end();
    console.log(`Imported ${result.groups} Core 56 article group(s) and ${result.localizations} EN draft localization(s).`);
  } catch (error) {
    await sql.end({ timeout: 5 }).catch(() => undefined);
    throw error;
  }
}
