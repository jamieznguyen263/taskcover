import { count, eq, isNotNull } from "drizzle-orm";
import { getDb } from "../src/lib/db/client";
import { insightArticleGroups, insightArticleLocalizations } from "../src/lib/db/schema";

async function main() {
  const db = getDb();
  const [groups] = await db.select({ value: count() }).from(insightArticleGroups);
  const [localizations] = await db.select({ value: count() }).from(insightArticleLocalizations);
  const [published] = await db
    .select({ value: count() })
    .from(insightArticleLocalizations)
    .where(isNotNull(insightArticleLocalizations.publishedSnapshot));
  const localeRows = await db
    .select({ locale: insightArticleLocalizations.locale, value: count() })
    .from(insightArticleLocalizations)
    .groupBy(insightArticleLocalizations.locale);
  const publishedGroups = await db
    .select({ value: count() })
    .from(insightArticleGroups)
    .where(eq(insightArticleGroups.draftWorkflowStatus, "published"));

  console.log(
    JSON.stringify(
      {
        groups: groups?.value ?? 0,
        localizations: localizations?.value ?? 0,
        publishedSnapshots: published?.value ?? 0,
        publishedGroups: publishedGroups[0]?.value ?? 0,
        locales: Object.fromEntries(localeRows.map((row) => [row.locale, row.value])),
        expectedBeforeSwitchingProvider: {
          groups: 6,
          localizedVersions: 18,
        },
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Database insights verification failed.");
  process.exit(1);
});
