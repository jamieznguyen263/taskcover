import { describe, expect, it } from "vitest";
import {
  consentStorageKey,
  createConsentPreferences,
  getConsentModeState,
  hasConsent,
  normalizeConsentPreferences,
  readConsentPreferences,
  resetConsentPreferences,
  saveConsentPreferences,
} from "./preferences";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
}

describe("consent preference helper", () => {
  it("forces necessary on and defaults non-essential categories off", () => {
    const preferences = normalizeConsentPreferences({ strictly_necessary: false, analytics: true }, "now");
    expect(preferences.strictly_necessary).toBe(true);
    expect(preferences.preferences).toBe(false);
    expect(preferences.analytics).toBe(true);
    expect(preferences.marketing).toBe(false);
    expect(preferences.source).toBe("preferences_page");
  });

  it("saves, reads, checks, and resets local preferences", () => {
    const storage = memoryStorage();
    const saved = saveConsentPreferences({ preferences: true, analytics: false, marketing: true, locale: "fr", source: "banner" }, storage);
    expect(storage.getItem(consentStorageKey)).toContain("marketing");
    expect(readConsentPreferences(storage)).toEqual(saved);
    expect(hasConsent("strictly_necessary", saved)).toBe(true);
    expect(hasConsent("analytics", saved)).toBe(false);
    expect(hasConsent("marketing", saved)).toBe(true);
    expect(saved.locale).toBe("fr");
    expect(saved.source).toBe("banner");
    resetConsentPreferences(storage);
    expect(storage.getItem(consentStorageKey)).toBeNull();
  });

  it("returns the same cached snapshot while the stored raw value is unchanged", () => {
    const storage = memoryStorage();
    const saved = saveConsentPreferences({ preferences: true, analytics: false, marketing: true, locale: "fr", source: "banner" }, storage);
    const firstRead = readConsentPreferences(storage);
    const secondRead = readConsentPreferences(storage);
    expect(firstRead).toBe(saved);
    expect(secondRead).toBe(firstRead);

    storage.setItem(consentStorageKey, JSON.stringify({ ...saved, analytics: true, updatedAt: "2026-07-07T00:00:01.000Z" }));
    const changedRead = readConsentPreferences(storage);
    expect(changedRead).not.toBe(firstRead);
    expect(changedRead?.analytics).toBe(true);
    expect(readConsentPreferences(storage)).toBe(changedRead);
  });

  it("caches missing and invalid stored values as null without throwing", () => {
    const storage = memoryStorage();
    expect(readConsentPreferences(storage)).toBeNull();
    expect(readConsentPreferences(storage)).toBeNull();

    storage.setItem(consentStorageKey, "{invalid");
    expect(readConsentPreferences(storage)).toBeNull();
    expect(readConsentPreferences(storage)).toBeNull();
  });

  it("creates timestamped preferences from partial input", () => {
    expect(createConsentPreferences({ analytics: true }, "2026-07-07T00:00:00.000Z")).toMatchObject({
      strictly_necessary: true,
      analytics: true,
      marketing: false,
      timestamp: "2026-07-07T00:00:00.000Z",
      updatedAt: "2026-07-07T00:00:00.000Z",
    });
  });

  it("maps default consent mode to denied analytics and advertising", () => {
    expect(getConsentModeState(null)).toEqual({
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      functionality_storage: "denied",
      security_storage: "granted",
    });
    expect(getConsentModeState(createConsentPreferences({ analytics: true, marketing: true, preferences: true }))).toMatchObject({
      analytics_storage: "granted",
      ad_storage: "granted",
      functionality_storage: "granted",
      security_storage: "granted",
    });
  });
});
