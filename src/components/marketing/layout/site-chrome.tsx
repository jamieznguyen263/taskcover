"use client";

import { usePathname } from "next/navigation";
import { stripLocaleFromPath } from "@/lib/i18n";
import { ConsentAnalyticsManager } from "@/components/marketing/analytics/consent-analytics-manager";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/**
 * The public site's chrome — header, footer, Organization schema, and the consent/analytics
 * manager — belongs to marketing pages only. Taskcover Flow and the CMS are signed-in
 * applications that ship their own shell.
 *
 * This used to be handled by rendering the chrome everywhere and hiding it with CSS
 * (`body:has([data-flow-root]) > header`). That is invisible but not free: the mega-menu and
 * footer were still serialised into every Flow response (~35 KB of the ~74 KB document),
 * hydrated as client components, and — worse — the marketing `<main>` wrapper nested around
 * Flow's own `<main>`, producing two main landmarks per page. Deciding here means an
 * application route emits none of it.
 */
const APPLICATION_PREFIXES = ["/flow", "/admin"];

export function isApplicationRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const base = stripLocaleFromPath(pathname);
  return APPLICATION_PREFIXES.some((prefix) => base === prefix || base.startsWith(`${prefix}/`));
}

export function SiteChrome({
  organizationSchema,
  children,
}: {
  organizationSchema: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (isApplicationRoute(pathname)) return <>{children}</>;

  return (
    <>
      {organizationSchema}
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <ConsentAnalyticsManager />
    </>
  );
}
