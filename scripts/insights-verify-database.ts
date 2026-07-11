import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { locales, type Locale } from "../src/lib/i18n";
import { localInsightsProvider } from "../src/lib/insights/local-provider";

loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required for insights database verification.");
  process.exit(1);
}

type CountRow = {
  groups: number;
  localizations: number;
  published_snapshots: number;
  published_pointer_groups: number;
  workflow_published_groups: number;
  draft_groups: number;
  core56_groups: number;
  core56_localizations: number;
  unpublished_scheduled_exposed: number;
  archived_exposed: number;
};

type LocaleCountRow = { locale: string; value: number };
type DuplicateSlugRow = { locale: string; slug: string; value: number };
type MissingTranslationRow = { translation_group_id: string; locale_count: number; creation_key: string | null; status: string };
type InvalidStatusRow = { value: number };
type PublishedRow = { translation_group_id: string; locale: Locale; slug: string; snapshot_present: boolean };

const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });

main().catch(async (error) => {
  await sql.end({ timeout: 5 }).catch(() => undefined);
  console.error(error instanceof Error ? error.message : "Insights verification failed.");
  process.exit(1);
});

async function main() {
  const sourceByLocale = Object.fromEntries(
    locales.map((locale) => [locale, localInsightsProvider.getPublishedArticles(locale)] as const)
  ) as Record<Locale, ReturnType<typeof localInsightsProvider.getPublishedArticles>>;
  const expectedArticles = locales.flatMap((locale) => sourceByLocale[locale].map((article) => ({ ...article, locale })));
  const expectedGroups = new Set(expectedArticles.map((article) => article.translationGroupId));
  const expectedLocalizations = expectedArticles.length;
  const expectedLocaleCounts = Object.fromEntries(locales.map((locale) => [locale, sourceByLocale[locale].length]));
  const expectedPublishedKeys = new Set(expectedArticles.map((article) => publishedKey(article.translationGroupId, article.locale)));

  const [counts] = await sql<CountRow[]>`
    SELECT
      (SELECT count(*)::int FROM insight_article_groups) AS groups,
      (SELECT count(*)::int FROM insight_article_localizations) AS localizations,
      (SELECT count(*)::int FROM insight_article_localizations WHERE published_snapshot IS NOT NULL) AS published_snapshots,
      (
        SELECT count(*)::int
        FROM insight_article_groups
        WHERE published_revision_group_id IS NOT NULL AND archived_at IS NULL
      ) AS published_pointer_groups,
      (SELECT count(*)::int FROM insight_article_groups WHERE draft_workflow_status = 'published') AS workflow_published_groups,
      (SELECT count(*)::int FROM insight_article_groups WHERE draft_workflow_status = 'draft') AS draft_groups,
      (SELECT count(*)::int FROM insight_article_groups WHERE creation_key LIKE 'core56-%') AS core56_groups,
      (
        SELECT count(*)::int
        FROM insight_article_localizations l
        JOIN insight_article_groups g ON g.id = l.article_group_id
        WHERE g.creation_key LIKE 'core56-%'
      ) AS core56_localizations,
      (
        SELECT count(*)::int
        FROM insight_article_groups g
        WHERE g.draft_workflow_status = 'scheduled'
          AND g.scheduled_at > now()
          AND g.published_revision_group_id IS NOT NULL
          AND g.published_at IS NULL
      ) AS unpublished_scheduled_exposed,
      (
        SELECT count(*)::int
        FROM insight_article_groups g
        WHERE g.draft_workflow_status = 'archived'
          AND g.published_revision_group_id IS NOT NULL
          AND g.archived_at IS NULL
      ) AS archived_exposed
  `;

  const localeRows = await sql<LocaleCountRow[]>`
    SELECT locale::text, count(*)::int AS value
    FROM insight_article_localizations
    GROUP BY locale
    ORDER BY locale
  `;

  const publishedLocaleRows = await sql<LocaleCountRow[]>`
    SELECT l.locale::text, count(*)::int AS value
    FROM insight_article_localizations l
    JOIN insight_article_groups g ON g.id = l.article_group_id
    WHERE g.published_revision_group_id IS NOT NULL
      AND g.archived_at IS NULL
      AND l.published_snapshot IS NOT NULL
    GROUP BY l.locale
    ORDER BY l.locale
  `;

  const allDuplicateSlugRows = await sql<DuplicateSlugRow[]>`
    SELECT locale::text, slug, count(*)::int AS value
    FROM insight_article_localizations
    GROUP BY locale, slug
    HAVING count(*) > 1
    ORDER BY locale, slug
  `;

  const publishedDuplicateSlugRows = await sql<DuplicateSlugRow[]>`
    SELECT l.locale::text, l.slug, count(*)::int AS value
    FROM insight_article_localizations l
    JOIN insight_article_groups g ON g.id = l.article_group_id
    WHERE g.published_revision_group_id IS NOT NULL
      AND g.archived_at IS NULL
      AND l.published_snapshot IS NOT NULL
    GROUP BY l.locale, l.slug
    HAVING count(*) > 1
    ORDER BY l.locale, l.slug
  `;

  const missingTranslationRows = await sql<MissingTranslationRow[]>`
    SELECT g.translation_group_id, count(l.id)::int AS locale_count, g.creation_key, g.draft_workflow_status::text AS status
    FROM insight_article_groups g
    LEFT JOIN insight_article_localizations l ON l.article_group_id = g.id
    GROUP BY g.translation_group_id, g.creation_key, g.draft_workflow_status
    HAVING count(l.id) <> 3
    ORDER BY g.translation_group_id
  `;

  const invalidStatusRows = await sql<InvalidStatusRow[]>`
    SELECT count(*)::int AS value
    FROM insight_article_groups
    WHERE
      (draft_workflow_status = 'published' AND published_at IS NULL)
      OR (draft_workflow_status = 'scheduled' AND scheduled_at IS NULL)
      OR (draft_workflow_status = 'archived' AND archived_at IS NULL)
      OR (draft_workflow_status <> 'archived' AND archived_at IS NOT NULL)
  `;

  const publishedRows = await sql<PublishedRow[]>`
    SELECT
      g.translation_group_id,
      l.locale::text AS locale,
      l.slug,
      (l.published_snapshot IS NOT NULL) AS snapshot_present
    FROM insight_article_groups g
    JOIN insight_article_localizations l ON l.article_group_id = g.id
    WHERE g.published_revision_group_id IS NOT NULL
      AND g.archived_at IS NULL
  `;

  await sql.end();

  const dbLocaleCounts = countByLocale(localeRows);
  const publishedLocaleCounts = countByLocale(publishedLocaleRows);
  const publishedKeys = new Set(publishedRows.filter((row) => row.snapshot_present).map((row) => publishedKey(row.translation_group_id, row.locale)));
  const missingSeedPublished = [...expectedPublishedKeys].filter((key) => !publishedKeys.has(key));
  const publishedRowsMissingSnapshot = publishedRows.filter((row) => !row.snapshot_present);
  const blockingFailures = [
    ...missingSeedPublished.map((key) => `missing expected published seed localization: ${key}`),
    ...publishedRowsMissingSnapshot.map((row) => `published pointer without snapshot: ${publishedKey(row.translation_group_id, row.locale)}`),
    ...publishedDuplicateSlugRows.map((row) => `duplicate published slug: ${row.locale}/${row.slug} (${row.value})`),
    ...((invalidStatusRows[0]?.value ?? 0) ? [`invalid workflow status combinations: ${invalidStatusRows[0]?.value ?? 0}`] : []),
    ...((counts?.unpublished_scheduled_exposed ?? 0) ? [`unpublished scheduled groups exposed: ${counts?.unpublished_scheduled_exposed ?? 0}`] : []),
    ...((counts?.archived_exposed ?? 0) ? [`archived groups exposed: ${counts?.archived_exposed ?? 0}`] : []),
  ];

  const result = {
    passed: blockingFailures.length === 0,
    blockingFailures,
    databaseInventory: {
      articleGroupCount: counts?.groups ?? 0,
      localizationCount: counts?.localizations ?? 0,
      draftGroups: counts?.draft_groups ?? 0,
      workflowPublishedGroups: counts?.workflow_published_groups ?? 0,
      publishedPointerGroups: counts?.published_pointer_groups ?? 0,
      publishedSnapshotCount: counts?.published_snapshots ?? 0,
    },
    publishedSurface: {
      expectedSeedGroups: expectedGroups.size,
      expectedSeedLocalizations: expectedLocalizations,
      expectedSeedLocaleCounts: expectedLocaleCounts,
      actualPublishedLocaleCounts: publishedLocaleCounts,
      missingExpectedSeedLocalizations: missingSeedPublished.length,
      publishedRowsMissingSnapshot: publishedRowsMissingSnapshot.length,
      duplicatePublishedSlugs: publishedDuplicateSlugRows,
      futureUnpublishedContentExposed: counts?.unpublished_scheduled_exposed ?? 0,
      archivedContentExposed: counts?.archived_exposed ?? 0,
    },
    backfillDraftInventory: {
      core56Groups: counts?.core56_groups ?? 0,
      core56Localizations: counts?.core56_localizations ?? 0,
      groupsMissingSomeLocales: missingTranslationRows.filter((row) => row.creation_key?.startsWith("core56-")).length,
      missingLocaleGroups: missingTranslationRows.filter((row) => row.creation_key?.startsWith("core56-")).slice(0, 20),
    },
    allDraftAndLocalizationWarnings: {
      localeCompleteness: {
        en: dbLocaleCounts.en ?? 0,
        fr: dbLocaleCounts.fr ?? 0,
        es: dbLocaleCounts.es ?? 0,
      },
      allDuplicateSlugCount: allDuplicateSlugRows.length,
      allDuplicateSlugs: allDuplicateSlugRows.slice(0, 20),
      allGroupsMissingSomeLocales: missingTranslationRows.length,
      missingLocaleGroups: missingTranslationRows.slice(0, 20),
    },
    expectedBeforeSwitchingProvider: {
      minimumPublishedSeedGroups: expectedGroups.size,
      minimumPublishedSeedLocalizedVersions: expectedLocalizations,
      locales: ["en", "fr", "es"],
    },
  };

  console.log(JSON.stringify(result, null, 2));

  if (!result.passed) process.exitCode = 1;
}

function countByLocale(rows: LocaleCountRow[]) {
  return Object.fromEntries(rows.map((row) => [row.locale, row.value]));
}

function publishedKey(translationGroupId: string, locale: Locale) {
  return `${translationGroupId}:${locale}`;
}
