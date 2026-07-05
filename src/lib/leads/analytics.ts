import type { Locale } from "@/lib/i18n";
import type { LeadRequestType } from "./types";

export type LeadAnalyticsEvent =
  | "lead_form_view"
  | "lead_form_start"
  | "lead_form_step_complete"
  | "lead_form_validation_error"
  | "lead_form_submit_attempt"
  | "lead_form_success"
  | "lead_form_delivery_unavailable"
  | "lead_form_error"
  | "strategy_call_request"
  | "contact_intent_selected"
  | "thank_you_view";

export type LeadAnalyticsPayload = {
  formType?: LeadRequestType | "contact";
  locale?: Locale;
  step?: number;
  serviceCategory?: string;
  industry?: string;
  market?: string;
  intent?: string;
  category?: string;
};

const safeKeys = new Set([
  "formType",
  "locale",
  "step",
  "serviceCategory",
  "industry",
  "market",
  "intent",
  "category",
]);

export function sanitizeAnalyticsPayload(payload: LeadAnalyticsPayload): LeadAnalyticsPayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([key, value]) => safeKeys.has(key) && value !== undefined && value !== "")
  ) as LeadAnalyticsPayload;
}

export function trackLeadEvent(event: LeadAnalyticsEvent, payload: LeadAnalyticsPayload = {}) {
  if (typeof window === "undefined") return;
  const safePayload = sanitizeAnalyticsPayload(payload);
  const win = window as Window & { dataLayer?: unknown[] };
  if (Array.isArray(win.dataLayer)) {
    win.dataLayer.push({ event, ...safePayload });
  }
  window.dispatchEvent(new CustomEvent("taskcover:lead-event", { detail: { event, ...safePayload } }));
}
