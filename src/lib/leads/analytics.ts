import type { Locale } from "@/lib/i18n";
import { pushDataLayerEvent } from "@/lib/analytics/data-layer";
import { specificLeadSuccessEvent, type AnalyticsEventName, type SafeAnalyticsPayload } from "@/lib/analytics/events";
import { pushGoogleAdsLeadConversion } from "@/lib/analytics/google-ads";
import type { LeadRequestType, LeadSubmissionResult } from "./types";

export type LeadAnalyticsEvent = Extract<
  AnalyticsEventName,
  | "lead_form_view"
  | "lead_form_start"
  | "lead_form_step_complete"
  | "lead_form_validation_error"
  | "lead_form_submit_attempt"
  | "lead_form_success"
  | "lead_form_delivery_unavailable"
  | "lead_form_error"
  | "thank_you_view"
  | "free_audit_request_success"
  | "strategy_call_request_success"
  | "contact_request_success"
  | "media_inquiry_success"
  | "private_reference_request_success"
  | "data_request_success"
>;

export type LeadAnalyticsPayload = {
  formType?: LeadRequestType | "contact";
  requestType?: LeadRequestType | "contact";
  locale?: Locale;
  step?: number | string;
  serviceCategory?: string;
  industry?: string;
  market?: string;
  intent?: string;
  category?: string;
  pagePath?: string;
};

export function sanitizeAnalyticsPayload(payload: LeadAnalyticsPayload): SafeAnalyticsPayload {
  return {
    form_type: payload.formType,
    request_type: payload.requestType ?? payload.formType,
    locale: payload.locale,
    funnel_step: payload.step,
    service_slug: payload.serviceCategory,
    industry_slug: payload.industry,
    market_slug: payload.market,
    page_path: payload.pagePath,
  };
}

export function trackLeadEvent(event: LeadAnalyticsEvent, payload: LeadAnalyticsPayload = {}) {
  const safePayload = sanitizeAnalyticsPayload(payload);
  if (payload.category) {
    if (event === "lead_form_success" || event.endsWith("_success")) safePayload.success_category = payload.category;
    else safePayload.error_category = payload.category;
  }
  pushDataLayerEvent(event, safePayload);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("taskcover:lead-event", { detail: { event, ...safePayload } }));
  }
}

export function shouldTrackAcceptedLeadSuccess(result: LeadSubmissionResult): boolean {
  return result.status === "success" && Boolean(result.requestType && result.leadReference);
}

export function trackAcceptedLeadSuccess(result: LeadSubmissionResult, fallbackRequestType: LeadRequestType, locale: Locale): boolean {
  const requestType = result.requestType ?? fallbackRequestType;
  if (!shouldTrackAcceptedLeadSuccess({ ...result, requestType })) return false;
  const marker = `taskcover_lead_success_${result.leadReference}`;
  if (typeof window !== "undefined") {
    if (window.sessionStorage.getItem(marker)) return false;
    window.sessionStorage.setItem(marker, "1");
  }
  const payload: LeadAnalyticsPayload = {
    formType: requestType,
    requestType,
    locale,
    category: "accepted",
    pagePath: typeof window !== "undefined" ? window.location.pathname : undefined,
  };
  trackLeadEvent("lead_form_success", payload);
  trackLeadEvent(specificLeadSuccessEvent(requestType) as LeadAnalyticsEvent, payload);
  pushGoogleAdsLeadConversion(requestType, { locale, pagePath: payload.pagePath });
  return true;
}
