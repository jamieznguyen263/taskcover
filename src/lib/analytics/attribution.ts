import type { ConsentPreferences } from "@/lib/consent/preferences";
import { hasConsent } from "@/lib/consent/preferences";
import { sanitizePathOnly } from "./routes";
import type { SafeAnalyticsPayload } from "./events";

export const attributionStorageKey = "taskcover_campaign_attribution";
export const attributionRetentionDays = 60;

export const allowedAttributionKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "gbraid",
  "wbraid",
  "msclkid",
] as const;

export type AttributionKey = (typeof allowedAttributionKeys)[number];
export type AttributionValues = Partial<Record<AttributionKey, string>>;

export type StoredAttribution = {
  values: AttributionValues;
  landingPage: string;
  capturedAt: string;
  expiresAt: string;
};

export function parseAttributionFromSearch(search: string): AttributionValues {
  const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
  const values: AttributionValues = {};
  for (const key of allowedAttributionKeys) {
    const value = params.get(key);
    const safe = sanitizeAttributionValue(value);
    if (safe) values[key] = safe;
  }
  return values;
}

export function shouldStoreAttribution(preferences: ConsentPreferences | null): boolean {
  return hasConsent("analytics", preferences) || hasConsent("marketing", preferences);
}

export function saveAttribution(
  values: AttributionValues,
  landingPage: string,
  storage: Pick<Storage, "setItem"> | undefined = browserStorage(),
  now = new Date()
): StoredAttribution | null {
  if (!Object.values(values).some(Boolean) || !storage) return null;
  const capturedAt = now.toISOString();
  const expiresAt = new Date(now.getTime() + attributionRetentionDays * 24 * 60 * 60 * 1000).toISOString();
  const stored: StoredAttribution = {
    values,
    landingPage: sanitizePathOnly(landingPage),
    capturedAt,
    expiresAt,
  };
  storage.setItem(attributionStorageKey, JSON.stringify(stored));
  return stored;
}

export function getStoredAttribution(
  storage: Pick<Storage, "getItem" | "removeItem"> | undefined = browserStorage(),
  now = new Date()
): StoredAttribution | null {
  if (!storage) return null;
  const raw = storage.getItem(attributionStorageKey);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredAttribution;
    if (!parsed || typeof parsed !== "object" || !parsed.values || new Date(parsed.expiresAt).getTime() <= now.getTime()) {
      storage.removeItem(attributionStorageKey);
      return null;
    }
    return {
      values: filterAttributionValues(parsed.values),
      landingPage: sanitizePathOnly(parsed.landingPage ?? "/"),
      capturedAt: parsed.capturedAt,
      expiresAt: parsed.expiresAt,
    };
  } catch {
    storage.removeItem(attributionStorageKey);
    return null;
  }
}

export function clearStoredAttribution(storage: Pick<Storage, "removeItem"> | undefined = browserStorage()) {
  storage?.removeItem(attributionStorageKey);
}

export function captureAttributionFromLocation(preferences: ConsentPreferences | null): StoredAttribution | null {
  if (typeof window === "undefined" || !shouldStoreAttribution(preferences)) return null;
  const values = parseAttributionFromSearch(window.location.search);
  return saveAttribution(values, window.location.pathname);
}

export function attributionToEventPayload(stored: StoredAttribution | null): SafeAnalyticsPayload {
  const values = stored?.values ?? {};
  return {
    utm_source: values.utm_source,
    utm_medium: values.utm_medium,
    utm_campaign: values.utm_campaign,
    utm_content: values.utm_content,
    utm_term: values.utm_term,
    gclid_present: Boolean(values.gclid),
    gbraid_present: Boolean(values.gbraid),
    wbraid_present: Boolean(values.wbraid),
    msclkid_present: Boolean(values.msclkid),
  };
}

export function attributionToLeadUtm(preferences: ConsentPreferences | null): Record<string, string> | undefined {
  if (!shouldStoreAttribution(preferences)) return undefined;
  const stored = getStoredAttribution();
  const values = stored?.values ?? (typeof window !== "undefined" ? parseAttributionFromSearch(window.location.search) : {});
  const utm = {
    source: values.utm_source ?? "",
    medium: values.utm_medium ?? "",
    campaign: values.utm_campaign ?? "",
    term: values.utm_term ?? "",
    content: values.utm_content ?? "",
  };
  return Object.values(utm).some(Boolean) ? utm : undefined;
}

function sanitizeAttributionValue(value: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim().replace(/[<>"'`\\]/g, "");
  if (!trimmed || trimmed.length > 160) return trimmed.slice(0, 160) || undefined;
  return trimmed;
}

function filterAttributionValues(input: AttributionValues): AttributionValues {
  const values: AttributionValues = {};
  for (const key of allowedAttributionKeys) {
    const safe = sanitizeAttributionValue(input[key] ?? null);
    if (safe) values[key] = safe;
  }
  return values;
}

function browserStorage() {
  if (typeof window === "undefined") return undefined;
  return window.localStorage;
}
