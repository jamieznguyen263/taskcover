import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { articleDraftSchema } from "../src/lib/admin/validation";
import { validateInsightArticle } from "../src/lib/insights/publish-qa";

loadEnvConfig(process.cwd());

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const sql = postgres(databaseUrl, { max: 1, prepare: false });

main().catch(async (error) => {
  await sql.end({ timeout: 5 }).catch(() => undefined);
  console.error(error instanceof Error ? error.message : "TC-001 localization repair failed.");
  process.exit(1);
});

async function main() {
  const groups = await sql<{ id: string }[]>`
    SELECT id
    FROM insight_article_groups
    WHERE creation_key = 'core56-tc-001'
    LIMIT 1
  `;
  const groupId = groups[0]?.id;
  if (!groupId) throw new Error("core56-tc-001 group not found.");

  const rows = await sql<{ id: string; locale: "en" | "fr" | "es"; draft_snapshot: unknown }[]>`
    SELECT id, locale::text AS locale, draft_snapshot
    FROM insight_article_localizations
    WHERE article_group_id = ${groupId}
    ORDER BY locale
  `;
  const now = new Date().toISOString();
  const repaired = rows.map((row) => {
    const article = articleDraftSchema.parse(row.draft_snapshot);
    if (row.locale === "en") return article;
    return articleDraftSchema.parse({
      ...article,
      id: groupId,
      status: "draft",
      updatedAt: now,
      internalLinking: {
        ...article.internalLinking,
        requiredInternalLinks: [],
      },
      publishQa: {
        summary: "Stale localization QA metadata repaired before Core 56 publish.",
        checkedAt: now,
      },
    });
  });

  for (const row of rows) {
    const article = repaired.find((item) => item.locale === row.locale);
    if (!article) throw new Error(`Missing repaired snapshot for ${row.locale}.`);
    await sql`
      UPDATE insight_article_localizations
      SET draft_snapshot = ${sql.json(article)},
          publish_qa_snapshot = ${sql.json(validateInsightArticle(article, repaired))},
          updated_at = now()
      WHERE id = ${row.id}
    `;
  }

  await sql.end({ timeout: 5 }).catch(() => undefined);
  console.log(JSON.stringify({ repaired: rows.filter((row) => row.locale !== "en").map((row) => row.locale) }, null, 2));
}
