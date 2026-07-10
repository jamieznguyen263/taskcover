ALTER TABLE "insight_article_groups" ADD COLUMN "creation_key" text;--> statement-breakpoint
ALTER TABLE "insight_article_groups" ADD COLUMN "approved_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "insight_article_localizations" ADD COLUMN "draft_snapshot" jsonb;--> statement-breakpoint
UPDATE "insight_article_localizations"
SET "draft_snapshot" = "published_snapshot"
WHERE "draft_snapshot" IS NULL AND "published_snapshot" IS NOT NULL;--> statement-breakpoint
UPDATE "insight_article_localizations" AS l
SET "draft_snapshot" = jsonb_build_object(
  'id', l.id::text,
  'slug', l.slug,
  'translationGroupId', g.translation_group_id,
  'locale', l.locale::text,
  'internalTitle', l.internal_title,
  'h1', l.public_h1,
  'excerpt', l.excerpt,
  'category', g.category_slug,
  'tags', '[]'::jsonb,
  'author', g.author_key,
  'status', g.draft_workflow_status::text,
  'publishedAt', COALESCE(g.published_at, g.updated_at),
  'updatedAt', g.updated_at,
  'lastFactCheckedAt', g.updated_at,
  'readingTime', 0,
  'coverImage', '',
  'coverImageAlt', '',
  'coverImageCaption', '',
  'blocks', l.normalized_blocks,
  'searchStrategy', l.search_strategy,
  'contentEvidence', l.evidence_data,
  'internalLinking', l.internal_link_data,
  'metadata', l.metadata,
  'schema', l.schema_configuration,
  'localization', l.localization_data,
  'publishQa', COALESCE(l.publish_qa_snapshot, jsonb_build_object('summary', 'Publish QA has not run.', 'checkedAt', g.updated_at))
)
FROM "insight_article_groups" AS g
WHERE l.article_group_id = g.id AND l.draft_snapshot IS NULL;--> statement-breakpoint
ALTER TABLE "insight_article_localizations" ALTER COLUMN "draft_snapshot" SET NOT NULL;--> statement-breakpoint
UPDATE "insight_article_groups" AS g
SET "published_revision_group_id" = revisions.revision_group_id
FROM (
  SELECT DISTINCT l.article_group_id, r.revision_group_id
  FROM "insight_article_localizations" AS l
  INNER JOIN "insight_article_revisions" AS r ON r.localization_id = l.id
  WHERE l.published_snapshot IS NOT NULL
) AS revisions
WHERE g.id = revisions.article_group_id
  AND g.published_revision_group_id IS NULL
  AND g.draft_workflow_status = 'published';--> statement-breakpoint
CREATE UNIQUE INDEX "insight_article_groups_creation_key_idx" ON "insight_article_groups" USING btree ("creation_key");
