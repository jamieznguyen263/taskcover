/**
 * Client-side locale resolution hook.
 *
 * The URL route prefix is the single source of truth for the active locale.
 * This hook derives the locale from usePathname() so header/footer/nav and
 * the language switcher stay in sync with the route WITHOUT relying on cookies.
 *
 * English (default) is unprefixed, so the absence of a /fr or /es prefix
 * resolves to "en".
 */

"use client";

import { usePathname } from "next/navigation";
import { getLocaleFromPathname, type Locale } from "@/lib/i18n";

export function useLocale(): Locale {
  const pathname = usePathname();
  return getLocaleFromPathname(pathname);
}

/**
 * Also expose the current pathname for convenience in the language switcher.
 */
export function useLocalePathname(): { locale: Locale; pathname: string } {
  const pathname = usePathname() ?? "/";
  return { locale: getLocaleFromPathname(pathname), pathname };
}