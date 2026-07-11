import { cache } from "react";
import type { Locale } from "@/lib/i18n";
import type { InsightArticle } from "@/content/insights.types";
import { AdminRepository } from "@/lib/admin/repository";

export const getDatabasePublishedInsights = cache(async (locale: Locale): Promise<InsightArticle[]> => {
  return new AdminRepository().listPublishedSnapshots(locale);
});
