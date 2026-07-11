import type { InsightArticle } from "@/content/insights.types";
import { locales, type Locale } from "@/lib/i18n";

/**
 * Legacy articles pre-date selective publication and therefore require every
 * supported locale. New article groups can explicitly publish a smaller set,
 * such as English-only Core 56 drafts.
 */
export function getRequiredLocales(article: InsightArticle): Locale[] {
  const configured = article.localization.requiredLocales;
  if (!configured?.length) return [...locales];
  return stableLocales(configured);
}

/**
 * Resolve one article group's publication set and reject split-brain policies.
 * The policy is repeated in each localization snapshot so every immutable
 * revision remains self-describing.
 */
export function resolveRequiredLocales(translations: InsightArticle[]): Locale[] {
  if (!translations.length) return [...locales];
  const preferred = translations.find((article) => article.locale === "en") ?? translations[0]!;
  const required = getRequiredLocales(preferred);
  const signature = required.join(",");

  for (const article of translations) {
    if (getRequiredLocales(article).join(",") !== signature) {
      throw new Error("Insight localizations have inconsistent requiredLocales publication policies.");
    }
  }
  return required;
}

export function getRequiredTranslations(translations: InsightArticle[]): InsightArticle[] {
  const required = new Set(resolveRequiredLocales(translations));
  return translations.filter((article) => required.has(article.locale));
}

export function isRequiredLocale(article: InsightArticle, locale: Locale = article.locale): boolean {
  return getRequiredLocales(article).includes(locale);
}

function stableLocales(values: Locale[]): Locale[] {
  const selected = new Set(values);
  return locales.filter((locale) => selected.has(locale));
}
