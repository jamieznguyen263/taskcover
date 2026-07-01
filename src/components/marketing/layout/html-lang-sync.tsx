/**
 * Client-side `<html lang>` synchronizer.
 *
 * The root layout (app/layout.tsx) renders `<html lang="en">` because it is
 * shared by every route — English (unprefixed) and fr/es (prefixed). In Next.js
 * App Router only the root layout may render `<html>`, and using request-time
 * APIs (headers()) there would force all 43 statically generated pages into
 * dynamic rendering.
 *
 * Strategy:
 *  1. An inline pre-paint script in the root layout corrects `lang` from
 *     `window.location.pathname` before first paint (no flash).
 *  2. THIS component handles client-side SPA navigations: when the user
 *     navigates between locales without a full page reload, usePathname()
 *     fires and we update document.documentElement.lang accordingly.
 *
 * The route prefix remains the single source of truth — no cookies involved.
 */

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, localeHtmlLang } from "@/lib/i18n";

export function HtmlLangSync() {
  const pathname = usePathname();

  useEffect(() => {
    const locale = getLocaleFromPathname(pathname);
    document.documentElement.lang = localeHtmlLang[locale];
  }, [pathname]);

  return null;
}