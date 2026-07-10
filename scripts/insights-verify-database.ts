import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { locales } from "../src/lib/i18n";
import { localInsightsProvider } from "../src/lib/insights/local-provider";

loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required for insights database verification.");
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });
main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Insights verification failed.");
  process.exit(1);
});

async function main() {
  const sourceByLocale = Object.fromEntries(
    locales.map((locale) => [locale, localInsightsProvider.getPublishedArticles(locale)] as const)
  );
  const expectedGroups = new Set(Object.values(sourceByLocale).flat().map((article) => article.translationGroupId));
  const expectedLocalizations = Object.values(sourceByLocale).reduce((total, articles) => total + articles.length, 0);
  const expectedLocaleCounts = Object.fromEntries(locales.map((locale) => [locale, sourceByLocale[locale].length]));

  const [counts] = await sql<{
    groups: number;
    localizations: number;
    published_snapshots: number;
    published_groups: number;
    future_exposed: number;
    archived_exposed: number;
  }[]>`
  SELECT
    (SELECT count(*)::int FROM insight_article_groups) AS groups,
    (SELECT count(*)::int FROM insight_article_localizations) AS localizations,
    (SELECT count(*)::int FROM insight_article_localizations WHERE published_snapshot IS NOT NULL) AS published_snapshots,
    (SELECT count(*)::int FROM insight_article_groups WHERE draft_workflow_status = 'published') AS published_groups,
    (
      SELECT count(*)::int
      FROM insight_article_groups g
      JOIN insight_article_localizations l ON l.article_group_id = g.id
      WHERE g.draft_workflow_status = 'scheduled' AND g.scheduled_at > now() AND l.published_snapshot IS NOT NULL
    ) AS future_exposed,
    (
      SELECT count(*)::int
      FROM insight_article_groups g
      JOIN insight_article_localizations l ON l.article_group_id = g.id
      WHERE g.draft_workflow_status = 'archived' AND l.published_snapshot IS NOT NULL
    ) AS archived_exposed
`;
  const localeRows = await sql<{ locale: string; value: number }[]>`
  SELECT locale::text, count(*)::int AS value FROM insight_article_localizations GROUP BY locale ORDER BY locale
`;
  const duplicateSlugRows = await sql<{ locale: string; slug: string; value: number }[]>`
  SELECT locale::text, slug, count(*)::int AS value
  FROM insight_article_localizations
  GROUP BY locale, slug
  HAVING count(*) > 1
`;
  const missingTranslationRows = await sql<{ translation_group_id: string; locale_count: number }[]>`
  SELECT g.translation_group_id, count(l.id)::int AS locale_count
  FROM insight_article_groups g
  LEFT JOIN insight_article_localizations l ON l.article_group_id = g.id
  GROUP BY g.translation_group_id
  HAVING count(l.id) <> 3
`;
  const invalidStatusRows = await sql<{ value: number }[]>`
  SELECT count(*)::int AS value
  FROM insight_article_groups
  WHERE
    (draft_workflow_status = 'published' AND published_at IS NULL)
    OR (draft_workflow_status = 'scheduled' AND scheduled_at IS NULL)
    OR (draft_workflow_status <> 'archived' AND archived_at IS NOT NULL)
`;
  await sql.end();

  const dbLocaleCounts = Object.fromEntries(localeRows.map((row) => [row.locale, row.value]));
  const result = {
    articleGroupCount: counts?.groups ?? 0,
    localizationCount: counts?.localizations ?? 0,
    publishedSnapshotCount: counts?.published_snapshots ?? 0,
    localeCompleteness: {
      en: dbLocaleCounts.en ?? 0,
      fr: dbLocaleCounts.fr ?? 0,
      es: dbLocaleCounts.es ?? 0,
      expected: expectedLocaleCounts,
      complete:
        dbLocaleCounts.en === expectedLocaleCounts.en &&
        dbLocaleCounts.fr === expectedLocaleCounts.fr &&
        dbLocaleCounts.es === expectedLocaleCounts.es,
    },
    duplicateSlugStatus: duplicateSlugRows.length ? "duplicates found" : "clear",
    duplicateSlugCount: duplicateSlugRows.length,
    missingTranslations: missingTranslationRows.length,
    invalidStatusCombinations: invalidStatusRows[0]?.value ?? 0,
    publishedProviderVisibility: {
      publishedGroups: counts?.published_groups ?? 0,
      futureContentExposed: counts?.future_exposed ?? 0,
      archivedContentExposed: counts?.archived_exposed ?? 0,
    },
    expectedBeforeSwitchingProvider: {
      articleGroups: expectedGroups.size,
      localizedVersions: expectedLocalizations,
      locales: ["en", "fr", "es"],
    },
  };

  console.log(JSON.stringify(result, null, 2));

  if (
    result.articleGroupCount !== expectedGroups.size ||
    result.localizationCount !== expectedLocalizations ||
    !result.localeCompleteness.complete ||
    result.duplicateSlugCount ||
    result.missingTranslations ||
    result.invalidStatusCombinations ||
    result.publishedProviderVisibility.futureContentExposed ||
    result.publishedProviderVisibility.archivedContentExposed
  ) {
    process.exitCode = 1;
  }
}
