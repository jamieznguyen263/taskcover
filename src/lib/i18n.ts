/**
 * i18n core utilities for Taskcover Agency.
 *
 * Strategy (see docs/I18N_STRATEGY.md):
 *  - English is the default locale and stays UNPREFIXED (/ , /services, ...).
 *  - French uses the /fr prefix, Spanish uses the /es prefix.
 *  - The URL route prefix is the single source of truth for the active locale.
 *  - No cookie/localStorage value may override an explicit route prefix.
 *
 * This module is pure (no React, no Next.js runtime) so it can be imported from
 * server components, client components, and build-time helpers (sitemap, etc.).
 */

export const locales = ["en", "fr", "es"] as const;
export const defaultLocale = "en" as const satisfies Locale;

export type Locale = (typeof locales)[number];

/** Human-readable labels shown in the language switcher, in their own language. */
export const localeLabels: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
};

/** BCP-47 locale codes used for `<html lang>` and Open Graph `locale`. */
export const localeHtmlLang: Record<Locale, string> = {
  en: "en",
  fr: "fr",
  es: "es",
};

/** Open Graph locale codes (region-qualified where useful). */
export const localeOgLocale: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
  es: "es_ES",
};

/** Type guard: narrows an unknown string to a Locale. */
export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** Safe coercion to Locale with a fallback to the default locale. */
export function asLocale(value: unknown): Locale {
  return isLocale(value) ? value : defaultLocale;
}

/**
 * URL prefix for a locale.
 * English returns "" (unprefixed). Other locales return "/fr" or "/es".
 */
export function getLocalePrefix(locale: Locale): string {
  if (locale === defaultLocale) return "";
  return `/${locale}`;
}

/**
 * Remove a locale prefix from a pathname if present.
 * "/fr/services" -> "/services"
 * "/es"          -> "/"
 * "/services"    -> "/services" (English, unchanged)
 * "/"            -> "/"
 */
export function stripLocaleFromPath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  // Match an optional leading locale segment.
  const match = pathname.match(/^\/(fr|es)(\/|$)/);
  if (!match) return pathname;
  const rest = pathname.slice(match[0].length);
  return rest.length > 0 ? `/${rest}` : "/";
}

/**
 * Localize a pathname for a target locale.
 * localizePath("/services", "fr") -> "/fr/services"
 * localizePath("/", "es")        -> "/es"
 * localizePath("/services/seo-agency", "en") -> "/services/seo-agency"
 */
export function localizePath(pathname: string, locale: Locale): string {
  const base = stripLocaleFromPath(pathname); // normalize first
  const prefix = getLocalePrefix(locale);
  if (base === "/") return prefix === "" ? "/" : prefix;
  return `${prefix}${base}`;
}

/**
 * Switch an existing pathname to a target locale, preserving the rest of the path.
 * This is the core of the language switcher: the equivalent page in another locale.
 *
 * switchLocale("/services/technical-seo", "fr") -> "/fr/services/technical-seo"
 * switchLocale("/fr/services/technical-seo", "es") -> "/es/services/technical-seo"
 * switchLocale("/es/services/technical-seo", "en") -> "/services/technical-seo"
 */
export function switchLocale(currentPathname: string, targetLocale: Locale): string {
  return localizePath(currentPathname, targetLocale);
}

/**
 * Resolve a Locale from a Next.js dynamic route `params.locale` value.
 * Falls back to the default locale if absent or invalid (never throws).
 */
export function getLocaleFromParams(params: { locale?: string } | undefined | null): Locale {
  if (params && isLocale(params.locale)) return params.locale;
  return defaultLocale;
}

/**
 * Return the fully localized pathname for a base path + locale.
 * Alias kept for clarity at call sites that think in terms of "base path".
 */
export function getLocalizedPathname(basePath: string, locale: Locale): string {
  return localizePath(basePath, locale);
}

/**
 * Build the hreflang alternates map for a given base path.
 * Returns absolute-ready relative paths keyed by hreflang code.
 *
 * getAlternateLanguages("/services/technical-seo") ->
 *   { en: "/services/technical-seo", fr: "/fr/services/technical-seo", es: "/es/services/technical-seo" }
 */
export function getAlternateLanguages(basePath: string): Record<Locale, string> {
  const normalized = stripLocaleFromPath(basePath);
  return {
    en: localizePath(normalized, "en"),
    fr: localizePath(normalized, "fr"),
    es: localizePath(normalized, "es"),
  };
}

/**
 * Derive the locale from a pathname at runtime (client or server).
 * "/fr/services" -> "fr"
 * "/es"          -> "es"
 * "/services"    -> "en" (default, unprefixed)
 */
export function getLocaleFromPathname(pathname: string | null | undefined): Locale {
  if (!pathname) return defaultLocale;
  const match = pathname.match(/^\/(fr|es)(\/|$)/);
  if (match) return match[1] as Locale;
  return defaultLocale;
}

/**
 * hreflang codes for `<link rel="alternate" hreflang="...">`.
 * Includes the generic language codes alongside the specific ones.
 */
export function getHreflangCodes(): string[] {
  return ["en", "fr", "es", "x-default"];
}

/**
 * Full hreflang map (including x-default) for a base path, as relative URLs.
 * Callers join with the site origin for absolute hreflang URLs.
 */
export function getAlternateHreflangs(basePath: string): { hreflang: string; href: string }[] {
  const alts = getAlternateLanguages(basePath);
  const normalized = stripLocaleFromPath(basePath);
  return [
    { hreflang: "en", href: alts.en },
    { hreflang: "fr", href: alts.fr },
    { hreflang: "es", href: alts.es },
    // x-default points to the English (default) version.
    { hreflang: "x-default", href: localizePath(normalized, defaultLocale) },
  ];
}