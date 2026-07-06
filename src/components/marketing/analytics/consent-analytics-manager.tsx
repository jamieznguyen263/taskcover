"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { captureAttributionFromLocation } from "@/lib/analytics/attribution";
import { loadGtm, pushDataLayerEvent, trackSafePageView, updateConsentMode } from "@/lib/analytics/data-layer";
import { isTrackingExcludedPath, sanitizePathOnly } from "@/lib/analytics/routes";
import { getConsentModeState } from "@/lib/consent/preferences";
import { getLocaleFromPathname } from "@/lib/i18n";
import { AnalyticsDebugPanel } from "./analytics-debug-panel";
import { ConsentBanner } from "./consent-banner";
import { useConsentPreferences } from "./use-consent-preferences";

export function ConsentAnalyticsManager() {
  const pathname = usePathname() ?? "/";
  const excluded = isTrackingExcludedPath(pathname);
  const preferences = useConsentPreferences();

  React.useEffect(() => {
    if (isTrackingExcludedPath(pathname)) return;
    updateConsentMode(getConsentModeState(preferences));
    captureAttributionFromLocation(preferences);
    loadGtm(preferences, pathname);
    trackSafePageView(pathname);
  }, [pathname, preferences]);

  React.useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest<HTMLAnchorElement>('[data-analytics="cta"]');
      if (!anchor || isTrackingExcludedPath(window.location.pathname)) return;
      const href = safeCtaHref(anchor.getAttribute("href"));
      const eventName = anchor.dataset.analyticsProvider === "calcom" ? "calcom_cta_click" : "cta_click";
      pushDataLayerEvent(eventName, {
        locale: getLocaleFromPathname(window.location.pathname),
        page_path: window.location.pathname,
        cta_href: href,
        cta_target: href.startsWith("/") ? "internal" : "external",
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <ConsentBanner />
      {excluded ? null : <AnalyticsDebugPanel />}
    </>
  );
}

function safeCtaHref(href: string | null): string {
  if (!href) return "/";
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return "external";
  try {
    const parsed = new URL(href, window.location.origin);
    if (parsed.origin === window.location.origin) return sanitizePathOnly(parsed.pathname);
    return parsed.hostname.includes("cal.com") ? "external-calcom" : "external";
  } catch {
    return sanitizePathOnly(href);
  }
}
