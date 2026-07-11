import type { InsightArticle } from "@/content/insights.types";
import { locales, type Locale } from "@/lib/i18n";

/**
 * The localizations physically stored in an article group are its publication
 * set. Existing multilingual groups keep EN/FR/ES because all three rows are
 * present; Core 56 imports can start English-only without manufacturing empty
 * or duplicate translated pages.
 */
export function resolveRequiredLocales(translations: InsightArticle[]): Locale[] {
  const selected = new Set(translations.map((article) => article.locale));
  return locales.filter((locale) => selected.has(locale));
}

export function getRequiredTranslations(translations: InsightArticle[]): InsightArticle[] {
  const byLocale = new Map(translations.map((article) => [article.locale, article]));
  return resolveRequiredLocales(translations).map((locale) => byLocale.get(locale)!).filter(Boolean);
}

export function isRequiredLocale(translations: InsightArticle[], locale: Locale): boolean {
  return resolveRequiredLocales(translations).includes(locale);
}
