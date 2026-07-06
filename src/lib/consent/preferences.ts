import { asLocale, defaultLocale, type Locale } from "@/lib/i18n";

export const consentPreferenceVersion = "2026-07-07";
export const consentStorageKey = "taskcover_cookie_preferences";
export const consentChangeEventName = "taskcover:consent-preferences-change";

export const consentCategories = ["strictly_necessary", "preferences", "analytics", "marketing"] as const;
export type ConsentCategory = (typeof consentCategories)[number];
export type OptionalConsentCategory = Exclude<ConsentCategory, "strictly_necessary">;
export type ConsentPreferenceSource = "banner" | "preferences_page" | "reset";
export type ConsentRegionMode = "global";

export type ConsentPreferences = {
  strictly_necessary: true;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  version: string;
  locale: Locale;
  source: ConsentPreferenceSource;
  regionMode: ConsentRegionMode;
  timestamp: string;
  updatedAt: string;
};

export type ConsentPreferenceInput = Partial<Record<OptionalConsentCategory, boolean>> & {
  locale?: Locale;
  source?: ConsentPreferenceSource;
  regionMode?: ConsentRegionMode;
};

export type ConsentModeValue = "granted" | "denied";

export type ConsentModeState = {
  analytics_storage: ConsentModeValue;
  ad_storage: ConsentModeValue;
  ad_user_data: ConsentModeValue;
  ad_personalization: ConsentModeValue;
  functionality_storage: ConsentModeValue;
  security_storage: "granted";
};

export const defaultConsentPreferences: ConsentPreferences = {
  strictly_necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
  version: consentPreferenceVersion,
  locale: defaultLocale,
  source: "reset",
  regionMode: "global",
  timestamp: "",
  updatedAt: "",
};

export function normalizeConsentPreferences(input: unknown, now = new Date().toISOString()): ConsentPreferences {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ...defaultConsentPreferences, updatedAt: now };
  }
  const record = input as Record<string, unknown>;
  const updatedAt = typeof record.updatedAt === "string" && record.updatedAt ? record.updatedAt : now;
  const timestamp = typeof record.timestamp === "string" && record.timestamp ? record.timestamp : updatedAt;
  return {
    strictly_necessary: true,
    preferences: record.preferences === true,
    analytics: record.analytics === true,
    marketing: record.marketing === true,
    version: typeof record.version === "string" ? record.version : consentPreferenceVersion,
    locale: asLocale(record.locale),
    source: isConsentPreferenceSource(record.source) ? record.source : "preferences_page",
    regionMode: "global",
    timestamp,
    updatedAt,
  };
}

export function createConsentPreferences(input: ConsentPreferenceInput, now = new Date().toISOString()): ConsentPreferences {
  return normalizeConsentPreferences(
    {
      ...input,
      strictly_necessary: true,
      version: consentPreferenceVersion,
      source: input.source ?? "preferences_page",
      locale: input.locale ?? defaultLocale,
      regionMode: input.regionMode ?? "global",
      timestamp: now,
      updatedAt: now,
    },
    now
  );
}

export function getConsentPreferences(storage: Pick<Storage, "getItem"> | undefined = browserStorage()): ConsentPreferences | null {
  if (!storage) return null;
  const raw = storage.getItem(consentStorageKey);
  if (!raw) return null;
  try {
    return normalizeConsentPreferences(JSON.parse(raw));
  } catch {
    return null;
  }
}

export const readConsentPreferences = getConsentPreferences;

export function saveConsentPreferences(
  input: ConsentPreferenceInput,
  storage: Pick<Storage, "setItem"> | undefined = browserStorage()
): ConsentPreferences {
  const preferences = createConsentPreferences(input);
  storage?.setItem(consentStorageKey, JSON.stringify(preferences));
  dispatchConsentChange(preferences);
  return preferences;
}

export function resetConsentPreferences(storage: Pick<Storage, "removeItem"> | undefined = browserStorage()) {
  storage?.removeItem(consentStorageKey);
  dispatchConsentChange(null);
}

export function hasConsent(category: ConsentCategory, preferences = readConsentPreferences()): boolean {
  if (category === "strictly_necessary") return true;
  return Boolean(preferences?.[category]);
}

export function onConsentChange(callback: (preferences: ConsentPreferences | null) => void) {
  if (typeof window === "undefined") return () => undefined;
  const listener = (event: Event) => {
    callback((event as CustomEvent<ConsentPreferences | null>).detail ?? null);
  };
  window.addEventListener(consentChangeEventName, listener);
  return () => window.removeEventListener(consentChangeEventName, listener);
}

export function getConsentModeState(preferences = readConsentPreferences()): ConsentModeState {
  const analytics = Boolean(preferences?.analytics);
  const marketing = Boolean(preferences?.marketing);
  const preferenceStorage = Boolean(preferences?.preferences);
  return {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
    functionality_storage: preferenceStorage ? "granted" : "denied",
    security_storage: "granted",
  };
}

export function dispatchConsentChange(preferences: ConsentPreferences | null) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(consentChangeEventName, { detail: preferences }));
}

function browserStorage() {
  if (typeof window === "undefined") return undefined;
  return window.localStorage;
}

function isConsentPreferenceSource(value: unknown): value is ConsentPreferenceSource {
  return value === "banner" || value === "preferences_page" || value === "reset";
}
