import { getConsentPreferences, hasConsent, type ConsentPreferences } from "@/lib/consent/preferences";
import { getLocaleFromPathname } from "@/lib/i18n";
import { dataLayerEventObject } from "./sanitize";
import { ensureDataLayer, isAnalyticsConfigured, loadGtm } from "./data-layer";
import { isTrackingExcludedPath, pageTypeForPath } from "./routes";
import type { LeadRequestType } from "@/lib/leads/types";
import { primaryGoogleAdsActionForRequest } from "./events";

export type GoogleAdsConversionAction = "free_audit" | "strategy_call" | "contact";

export function googleAdsConversionLabel(action: GoogleAdsConversionAction, env?: Record<string, string | undefined>): string {
  if (action === "free_audit") return (env?.NEXT_PUBLIC_GOOGLE_ADS_FREE_AUDIT_LABEL ?? process.env.NEXT_PUBLIC_GOOGLE_ADS_FREE_AUDIT_LABEL ?? "").trim();
  if (action === "strategy_call") return (env?.NEXT_PUBLIC_GOOGLE_ADS_STRATEGY_CALL_LABEL ?? process.env.NEXT_PUBLIC_GOOGLE_ADS_STRATEGY_CALL_LABEL ?? "").trim();
  return (env?.NEXT_PUBLIC_GOOGLE_ADS_CONTACT_LABEL ?? process.env.NEXT_PUBLIC_GOOGLE_ADS_CONTACT_LABEL ?? "").trim();
}

export function isGoogleAdsConversionConfigured(action: GoogleAdsConversionAction, env?: Record<string, string | undefined>): boolean {
  const adsId = (env?.NEXT_PUBLIC_GOOGLE_ADS_ID ?? process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "").trim();
  return Boolean(adsId && googleAdsConversionLabel(action, env));
}

export function pushGoogleAdsConversion(
  action: GoogleAdsConversionAction,
  payload: { requestType: LeadRequestType; locale?: string; pagePath?: string },
  preferences: ConsentPreferences | null = getConsentPreferences()
): boolean {
  if (typeof window === "undefined") return false;
  const pagePath = payload.pagePath ?? window.location.pathname;
  if (isTrackingExcludedPath(pagePath) || !hasConsent("marketing", preferences) || !isGoogleAdsConversionConfigured(action)) return false;
  if (isAnalyticsConfigured()) loadGtm(preferences, pagePath);
  const event = dataLayerEventObject("google_ads_conversion_ready", {
    locale: payload.locale ?? getLocaleFromPathname(pagePath),
    page_path: pagePath,
    page_type: pageTypeForPath(pagePath),
    request_type: payload.requestType,
    conversion_action: action,
    conversion_label: googleAdsConversionLabel(action),
    google_ads_configured: true,
  });
  ensureDataLayer().push(event);
  window.dispatchEvent(new CustomEvent("taskcover:analytics-event", { detail: event }));
  return true;
}

export function pushGoogleAdsLeadConversion(
  requestType: LeadRequestType,
  payload: { locale?: string; pagePath?: string },
  preferences: ConsentPreferences | null = getConsentPreferences()
): boolean {
  const action = primaryGoogleAdsActionForRequest(requestType);
  if (!action) return false;
  return pushGoogleAdsConversion(action, { requestType, locale: payload.locale, pagePath: payload.pagePath }, preferences);
}
