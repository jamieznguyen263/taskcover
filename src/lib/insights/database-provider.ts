import type { Locale } from "@/lib/i18n";
import type { InsightArticle } from "@/content/insights.types";
import { AdminRepository } from "@/lib/admin/repository";

export async function getDatabasePublishedInsights(locale: Locale): Promise<InsightArticle[]> {
  return new AdminRepository().listPublishedSnapshots(locale);
}
