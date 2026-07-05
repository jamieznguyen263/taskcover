export const consentPreferenceVersion = "2026-07-05";
export const consentStorageKey = "taskcover_cookie_preferences";

export const consentCategories = ["necessary", "preferences", "analytics", "marketing"] as const;
export type ConsentCategory = (typeof consentCategories)[number];

export type ConsentPreferences = {
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  version: string;
  updatedAt: string;
};

export type ConsentPreferenceInput = Partial<Record<Exclude<ConsentCategory, "necessary">, boolean>>;

export const defaultConsentPreferences: ConsentPreferences = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
  version: consentPreferenceVersion,
  updatedAt: "",
};

export function normalizeConsentPreferences(input: unknown, now = new Date().toISOString()): ConsentPreferences {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ...defaultConsentPreferences, updatedAt: now };
  }
  const record = input as Record<string, unknown>;
  return {
    necessary: true,
    preferences: record.preferences === true,
    analytics: record.analytics === true,
    marketing: record.marketing === true,
    version: typeof record.version === "string" ? record.version : consentPreferenceVersion,
    updatedAt: typeof record.updatedAt === "string" && record.updatedAt ? record.updatedAt : now,
  };
}

export function createConsentPreferences(input: ConsentPreferenceInput, now = new Date().toISOString()): ConsentPreferences {
  return normalizeConsentPreferences({ ...input, necessary: true, version: consentPreferenceVersion, updatedAt: now }, now);
}

export function readConsentPreferences(storage: Pick<Storage, "getItem"> | undefined = browserStorage()): ConsentPreferences | null {
  if (!storage) return null;
  const raw = storage.getItem(consentStorageKey);
  if (!raw) return null;
  try {
    return normalizeConsentPreferences(JSON.parse(raw));
  } catch {
    return null;
  }
}

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
  if (category === "necessary") return true;
  return Boolean(preferences?.[category]);
}

export function dispatchConsentChange(preferences: ConsentPreferences | null) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("taskcover:consent-preferences-change", { detail: preferences }));
}

function browserStorage() {
  if (typeof window === "undefined") return undefined;
  return window.localStorage;
}

