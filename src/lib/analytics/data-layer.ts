import {
  getConsentModeState,
  getConsentPreferences,
  hasConsent,
  type ConsentModeState,
  type ConsentPreferences,
} from "@/lib/consent/preferences";
import { getLocaleFromPathname } from "@/lib/i18n";
import { attributionToEventPayload, getStoredAttribution } from "./attribution";
import { dataLayerEventObject } from "./sanitize";
import { isLeadSuccessEvent, type AnalyticsEventName, type SafeAnalyticsPayload } from "./events";
import { isTrackingExcludedPath, pageTypeForPath, sanitizePathOnly, slugAt } from "./routes";

type DataLayerWindow = Window & {
  dataLayer?: unknown[];
  __taskcoverGtmLoaded?: boolean;
  __taskcoverLastSafeEventName?: string;
};

export type AnalyticsRuntimeStatus = {
  gtmConfigured: boolean;
  analyticsAllowed: boolean;
  marketingAllowed: boolean;
  dataLayerAvailable: boolean;
  lastSafeEventName: string;
};

export function isAnalyticsConfigured(env?: Record<string, string | undefined>): boolean {
  const id = (env?.NEXT_PUBLIC_GTM_ID ?? process.env.NEXT_PUBLIC_GTM_ID)?.trim();
  const enabled = env?.NEXT_PUBLIC_GTM_ENABLED ?? process.env.NEXT_PUBLIC_GTM_ENABLED;
  return Boolean(id && enabled !== "false");
}

export function pushDataLayerEvent(
  eventName: AnalyticsEventName,
  payload: SafeAnalyticsPayload = {},
  preferences: ConsentPreferences | null = getConsentPreferences()
): boolean {
  if (typeof window === "undefined") return false;
  const win = window as DataLayerWindow;
  const path = payload.page_path ?? window.location.pathname;
  if (isTrackingExcludedPath(path) || !isAnalyticsConfigured()) return false;
  const analyticsAllowed = hasConsent("analytics", preferences);
  const marketingAllowed = hasConsent("marketing", preferences);
  if (!analyticsAllowed && !(isLeadSuccessEvent(eventName) && marketingAllowed)) return false;
  ensureDataLayer();
  const eventObject = dataLayerEventObject(eventName, {
    ...attributionToEventPayload(getStoredAttribution()),
    ...payload,
    locale: payload.locale ?? getLocaleFromPathname(path),
    page_path: path,
    page_type: payload.page_type ?? pageTypeForPath(path),
  });
  win.dataLayer?.push(eventObject);
  win.__taskcoverLastSafeEventName = eventName;
  window.dispatchEvent(new CustomEvent("taskcover:analytics-event", { detail: eventObject }));
  return true;
}

export function updateConsentMode(state: ConsentModeState = getConsentModeState()): boolean {
  if (typeof window === "undefined") return false;
  if (!isAnalyticsConfigured()) return false;
  const dataLayer = ensureDataLayer();
  dataLayer.push({
    event: "consent_update",
    consent_mode: state,
  });
  return true;
}

export function loadGtm(preferences: ConsentPreferences | null = getConsentPreferences(), pathname?: string): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  const win = window as DataLayerWindow;
  const path = pathname ?? window.location.pathname;
  const id = process.env.NEXT_PUBLIC_GTM_ID?.trim();
  if (!id || !isAnalyticsConfigured() || isTrackingExcludedPath(path)) return false;
  if (!hasConsent("analytics", preferences) && !hasConsent("marketing", preferences)) return false;
  if (win.__taskcoverGtmLoaded || document.querySelector(`script[data-taskcover-gtm="${id}"]`)) {
    win.__taskcoverGtmLoaded = true;
    return true;
  }
  const dataLayer = ensureDataLayer();
  dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  updateConsentMode(getConsentModeState(preferences));
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
  script.dataset.taskcoverGtm = id;
  document.head.appendChild(script);
  win.__taskcoverGtmLoaded = true;
  return true;
}

export function trackSafePageView(pathname: string): boolean {
  const pagePath = sanitizePathOnly(pathname);
  const pageType = pageTypeForPath(pagePath);
  const basePayload: SafeAnalyticsPayload = {
    locale: getLocaleFromPathname(pagePath),
    page_path: pagePath,
    page_type: pageType,
    service_slug: slugAt(pagePath, "services"),
    industry_slug: slugAt(pagePath, "industries"),
    market_slug: slugAt(pagePath, "markets"),
  };
  const pushed = pushDataLayerEvent("page_view_safe", basePayload);
  if (pageType === "case_study") {
    pushDataLayerEvent("case_study_view", { ...basePayload, case_study_slug: slugAt(pagePath, "case-studies") });
  }
  if (pageType === "sample_audit") {
    pushDataLayerEvent("sample_audit_view", { ...basePayload, sample_audit_slug: slugAt(pagePath, "sample-audits") });
  }
  if (pageType === "insight_article") {
    const parts = sanitizePathOnly(pagePath).split("/").filter(Boolean);
    const offset = parts[0] === "fr" || parts[0] === "es" ? 1 : 0;
    pushDataLayerEvent("insight_article_view", {
      ...basePayload,
      insight_category_slug: parts[offset + 1],
      insight_article_slug: parts[offset + 2],
    });
  }
  return pushed;
}

export function getAnalyticsRuntimeStatus(preferences: ConsentPreferences | null = getConsentPreferences()): AnalyticsRuntimeStatus {
  const win = typeof window === "undefined" ? undefined : (window as DataLayerWindow);
  return {
    gtmConfigured: isAnalyticsConfigured(),
    analyticsAllowed: hasConsent("analytics", preferences),
    marketingAllowed: hasConsent("marketing", preferences),
    dataLayerAvailable: Array.isArray(win?.dataLayer),
    lastSafeEventName: win?.__taskcoverLastSafeEventName ?? "",
  };
}

export function ensureDataLayer(): unknown[] {
  const win = window as DataLayerWindow;
  win.dataLayer = Array.isArray(win.dataLayer) ? win.dataLayer : [];
  return win.dataLayer;
}
