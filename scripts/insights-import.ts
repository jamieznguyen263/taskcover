import postgres from "postgres";
import { insights as en } from "../src/content/en/insights";
import { insights as fr } from "../src/content/fr/insights";
import { insights as es } from "../src/content/es/insights";
import type { InsightArticle } from "../src/content/insights.types";
import { createStarterTiptapDocument } from "../src/lib/admin/normalization";
import { validateInsightArticle } from "../src/lib/insights/publish-qa";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required. Refusing to import into an unknown database.");
  process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Insights import failed.");
  process.exit(1);
});

async function main() {
  const sql = postgres(databaseUrl as string, { max: 1 });
  const groups = new Map<string, InsightArticle[]>();
  for (const article of [...en.articles, ...fr.articles, ...es.articles]) {
    const list = groups.get(article.translationGroupId) ?? [];
    list.push(article);
    groups.set(article.translationGroupId, list);
  }

  for (const [translationGroupId, translations] of groups) {
    const canonical = translations.find((article) => article.locale === "en") ?? translations[0];
    if (!canonical) continue;

    const qaErrors = translations.flatMap((article) => validateInsightArticle(article, translations).filter((result) => result.severity === "error"));
    if (qaErrors.length > 0) {
      throw new Error(`Import rejected for ${translationGroupId}: ${qaErrors.map((error) => error.code).join(", ")}`);
    }

    const groupRows = await sql<{ id: string }[]>`
    INSERT INTO insight_article_groups (
      translation_group_id, shared_slug, category_slug, author_key, draft_workflow_status, published_at, lock_version
    )
    VALUES (
      ${translationGroupId}, ${canonical.slug}, ${canonical.category}, ${canonical.author}, 'published', ${canonical.publishedAt}, 1
    )
    ON CONFLICT (translation_group_id) DO UPDATE SET
      shared_slug = EXCLUDED.shared_slug,
      category_slug = EXCLUDED.category_slug,
      author_key = EXCLUDED.author_key,
      draft_workflow_status = 'published',
      published_at = EXCLUDED.published_at,
      updated_at = now()
    RETURNING id
  `;
    const groupId = groupRows[0]!.id;
    const revisionGroupIdRows = await sql<{ id: string }[]>`SELECT gen_random_uuid()::text AS id`;
    const revisionGroupId = revisionGroupIdRows[0]!.id;

    for (const article of translations) {
      const editorDocument = createStarterTiptapDocument(article.h1);
      const localizationRows = await sql<{ id: string }[]>`
      INSERT INTO insight_article_localizations (
        article_group_id, locale, slug, internal_title, public_h1, excerpt, editor_document, normalized_blocks,
        published_snapshot, search_strategy, evidence_data, internal_link_data, metadata, social_metadata,
        schema_configuration, localization_data, publish_qa_snapshot, draft_version
      )
      VALUES (
        ${groupId}, ${article.locale}, ${article.slug}, ${article.internalTitle}, ${article.h1}, ${article.excerpt},
        ${sql.json(editorDocument)}, ${sql.json(article.blocks)}, ${sql.json(article)}, ${sql.json(article.searchStrategy)},
        ${sql.json(article.contentEvidence)}, ${sql.json(article.internalLinking)}, ${sql.json(article.metadata)},
        ${sql.json({
          ogTitle: article.metadata.ogTitle,
          ogDescription: article.metadata.ogDescription,
          ogImage: article.metadata.ogImage,
          twitterTitle: article.metadata.twitterTitle,
          twitterDescription: article.metadata.twitterDescription,
          twitterImage: article.metadata.twitterImage,
        })},
        ${sql.json(article.schema)}, ${sql.json(article.localization)}, ${sql.json(article.publishQa)}, 1
      )
      ON CONFLICT (article_group_id, locale) DO UPDATE SET
        slug = EXCLUDED.slug,
        internal_title = EXCLUDED.internal_title,
        public_h1 = EXCLUDED.public_h1,
        excerpt = EXCLUDED.excerpt,
        editor_document = EXCLUDED.editor_document,
        normalized_blocks = EXCLUDED.normalized_blocks,
        published_snapshot = EXCLUDED.published_snapshot,
        search_strategy = EXCLUDED.search_strategy,
        evidence_data = EXCLUDED.evidence_data,
        internal_link_data = EXCLUDED.internal_link_data,
        metadata = EXCLUDED.metadata,
        social_metadata = EXCLUDED.social_metadata,
        schema_configuration = EXCLUDED.schema_configuration,
        localization_data = EXCLUDED.localization_data,
        publish_qa_snapshot = EXCLUDED.publish_qa_snapshot,
        updated_at = now()
      RETURNING id
    `;
      const localizationId = localizationRows[0]!.id;
      await sql`
      INSERT INTO insight_article_revisions (
        revision_group_id, localization_id, revision_number, editor_document, normalized_blocks, article_snapshot,
        metadata_snapshot, seo_snapshot, evidence_snapshot, revision_reason, workflow_transition, schema_version
      )
      VALUES (
        ${revisionGroupId}, ${localizationId}, 1, ${sql.json(editorDocument)}, ${sql.json(article.blocks)}, ${sql.json(article)},
        ${sql.json(article.metadata)}, ${sql.json(article.searchStrategy)}, ${sql.json(article.contentEvidence)},
        'Initial local Insights import', 'import:published', 1
      )
      ON CONFLICT (localization_id, revision_number) DO NOTHING
    `;
    }
  }

  await sql.end();
  console.log(`Imported ${groups.size} article groups and ${en.articles.length + fr.articles.length + es.articles.length} localized articles.`);
}
