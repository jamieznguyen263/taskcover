import { cache } from "react";
import type { Locale } from "@/lib/i18n";
import type { InsightArticle } from "@/content/insights.types";
import { AdminRepository } from "@/lib/admin/repository";

// The full published-articles list only depends on locale and is requested
// repeatedly per page (metadata, page body, and related-articles lookups all
// call this independently). Without caching, static generation issues a full
// table query per call -- with ~100+ article pages built in parallel, that
// multiplies into enough concurrent Postgres connections to cause random
// per-page timeouts under load. `cache()` dedupes calls with the same locale
// within a single render/build pass, cutting the redundant round trips.
export const getDatabasePublishedInsights = cache(async (locale: Locale): Promise<InsightArticle[]> => {
  return new AdminRepository().listPublishedSnapshots(locale);
});
