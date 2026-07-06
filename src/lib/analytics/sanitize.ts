import { sanitizePathOnly } from "./routes";
import type { AnalyticsEventName, SafeAnalyticsPayload } from "./events";

const safePayloadKeys = new Set<keyof SafeAnalyticsPayload>([
  "event_name",
  "locale",
  "page_path",
  "page_type",
  "cta_href",
  "cta_target",
  "service_slug",
  "industry_slug",
  "market_slug",
  "case_study_slug",
  "sample_audit_slug",
  "insight_category_slug",
  "insight_article_slug",
  "pricing_tab",
  "form_type",
  "request_type",
  "funnel_step",
  "success_category",
  "error_category",
  "lead_reference_hash",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid_present",
  "gbraid_present",
  "wbraid_present",
  "msclkid_present",
  "conversion_action",
  "conversion_label",
  "google_ads_configured",
]);

const forbiddenKeyPattern =
  /(name|email|e-mail|phone|company|message|website|url|ip|user.?agent|turnstile|token|session|admin|provider|hubspot|resend|crm|deal|private|address|cookie|gclid$|gbraid$|wbraid$|msclkid$)/i;

export function sanitizeAnalyticsPayload(input: Record<string, unknown>): SafeAnalyticsPayload {
  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (!safePayloadKeys.has(key as keyof SafeAnalyticsPayload)) continue;
    if (forbiddenKeyPattern.test(key) && !key.endsWith("_present") && key !== "page_path" && key !== "event_name") continue;
    const sanitized = sanitizeValue(key, value);
    if (sanitized === undefined || sanitized === "") continue;
    safe[key] = sanitized;
  }
  return safe as SafeAnalyticsPayload;
}

export function dataLayerEventObject(eventName: AnalyticsEventName, payload: Record<string, unknown> = {}) {
  const safePayload = sanitizeAnalyticsPayload({ ...payload, event_name: eventName });
  return {
    event: eventName,
    ...safePayload,
  };
}

function sanitizeValue(key: string, value: unknown): string | number | boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (key === "page_path" || key === "cta_href") return sanitizePathOnly(trimmed).slice(0, 180);
  if (key.endsWith("_slug") || key === "pricing_tab" || key === "form_type" || key === "request_type") {
    return safeToken(trimmed);
  }
  return trimmed.replace(/[<>"'`]/g, "").slice(0, 120);
}

function safeToken(value: string): string | undefined {
  const token = value.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
  return token || undefined;
}
