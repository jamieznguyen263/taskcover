import type { Locale } from "@/lib/i18n";
import type { LeadRequestType } from "@/lib/leads/types";

export const analyticsEventNames = [
  "page_view_safe",
  "cta_click",
  "pricing_tab_view",
  "pricing_decision_select",
  "case_study_view",
  "sample_audit_view",
  "insight_article_view",
  "cookie_banner_view",
  "cookie_preferences_update",
  "lead_form_view",
  "lead_form_start",
  "lead_form_step_complete",
  "lead_form_validation_error",
  "lead_form_submit_attempt",
  "lead_form_success",
  "lead_form_delivery_unavailable",
  "lead_form_error",
  "free_audit_request_success",
  "strategy_call_request_success",
  "contact_request_success",
  "media_inquiry_success",
  "private_reference_request_success",
  "data_request_success",
  "thank_you_view",
  "calcom_cta_view",
  "calcom_cta_click",
  "google_ads_conversion_ready",
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];

export type SafeAnalyticsPayload = {
  event_name?: AnalyticsEventName;
  locale?: Locale;
  page_path?: string;
  page_type?: string;
  cta_href?: string;
  cta_target?: "internal" | "external";
  service_slug?: string;
  industry_slug?: string;
  market_slug?: string;
  case_study_slug?: string;
  sample_audit_slug?: string;
  insight_category_slug?: string;
  insight_article_slug?: string;
  pricing_tab?: string;
  form_type?: string;
  request_type?: LeadRequestType | "contact";
  funnel_step?: string | number;
  success_category?: string;
  error_category?: string;
  lead_reference_hash?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid_present?: boolean;
  gbraid_present?: boolean;
  wbraid_present?: boolean;
  msclkid_present?: boolean;
  conversion_action?: string;
  conversion_label?: string;
  google_ads_configured?: boolean;
};

export function specificLeadSuccessEvent(requestType: LeadRequestType): AnalyticsEventName {
  if (requestType === "seo-audit") return "free_audit_request_success";
  if (requestType === "strategy-call") return "strategy_call_request_success";
  if (requestType === "media-inquiry") return "media_inquiry_success";
  if (requestType === "private-reference") return "private_reference_request_success";
  if (requestType === "data-request") return "data_request_success";
  return "contact_request_success";
}

export function primaryGoogleAdsActionForRequest(requestType: LeadRequestType): "free_audit" | "strategy_call" | "contact" | null {
  if (requestType === "seo-audit") return "free_audit";
  if (requestType === "strategy-call") return "strategy_call";
  if (requestType === "general-contact") return "contact";
  return null;
}

export function isLeadSuccessEvent(eventName: AnalyticsEventName): boolean {
  return [
    "lead_form_success",
    "free_audit_request_success",
    "strategy_call_request_success",
    "contact_request_success",
    "media_inquiry_success",
    "private_reference_request_success",
    "data_request_success",
  ].includes(eventName);
}
