import { loadEnvConfig } from "@next/env";
import postgres from "postgres";

loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required for duplicate slug audit.");
  process.exit(1);
}

type DuplicateRow = {
  locale: string;
  slug: string;
  value: number;
};

type DuplicateDetailRow = {
  locale: string;
  slug: string;
  article_group_id: string;
  translation_group_id: string;
  creation_key: string | null;
  status: string;
  has_published_pointer: boolean;
  has_published_snapshot: boolean;
  public_h1: string;
  updated_at: string;
};

const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });

main().catch(async (error) => {
  await sql.end({ timeout: 5 }).catch(() => undefined);
  console.error(error instanceof Error ? error.message : "Duplicate slug audit failed.");
  process.exit(1);
});

async function main() {
  const duplicates = await sql<DuplicateRow[]>`
    SELECT locale::text, slug, count(*)::int AS value
    FROM insight_article_localizations
    GROUP BY locale, slug
    HAVING count(*) > 1
    ORDER BY locale, slug
  `;

  if (!duplicates.length) {
    await sql.end();
    console.log(JSON.stringify({ duplicateSlugCount: 0, duplicates: [], details: [] }, null, 2));
    return;
  }

  const details = await sql<DuplicateDetailRow[]>`
    WITH duplicate_slugs AS (
      SELECT locale, slug
      FROM insight_article_localizations
      GROUP BY locale, slug
      HAVING count(*) > 1
    )
    SELECT
      l.locale::text,
      l.slug,
      g.id::text AS article_group_id,
      g.translation_group_id,
      g.creation_key,
      g.draft_workflow_status::text AS status,
      (g.published_revision_group_id IS NOT NULL AND g.archived_at IS NULL) AS has_published_pointer,
      (l.published_snapshot IS NOT NULL) AS has_published_snapshot,
      l.public_h1,
      l.updated_at::text
    FROM insight_article_localizations l
    JOIN insight_article_groups g ON g.id = l.article_group_id
    JOIN duplicate_slugs d ON d.locale = l.locale AND d.slug = l.slug
    ORDER BY l.locale, l.slug, has_published_pointer DESC, has_published_snapshot DESC, g.updated_at DESC
  `;

  await sql.end();

  console.log(
    JSON.stringify(
      {
        duplicateSlugCount: duplicates.length,
        duplicates,
        livePublishedDuplicateCount: details.filter((row) => row.has_published_pointer && row.has_published_snapshot).length,
        details,
      },
      null,
      2
    )
  );
}
