import { describe, expect, it } from "vitest";
import {
  consentStorageKey,
  createConsentPreferences,
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
    const preferences = normalizeConsentPreferences({ necessary: false, analytics: true }, "now");
    expect(preferences.necessary).toBe(true);
    expect(preferences.preferences).toBe(false);
    expect(preferences.analytics).toBe(true);
    expect(preferences.marketing).toBe(false);
  });

  it("saves, reads, checks, and resets local preferences", () => {
    const storage = memoryStorage();
    const saved = saveConsentPreferences({ preferences: true, analytics: false, marketing: true }, storage);
    expect(storage.getItem(consentStorageKey)).toContain("marketing");
    expect(readConsentPreferences(storage)).toEqual(saved);
    expect(hasConsent("necessary", saved)).toBe(true);
    expect(hasConsent("analytics", saved)).toBe(false);
    expect(hasConsent("marketing", saved)).toBe(true);
    resetConsentPreferences(storage);
    expect(storage.getItem(consentStorageKey)).toBeNull();
  });

  it("creates timestamped preferences from partial input", () => {
    expect(createConsentPreferences({ analytics: true }, "2026-07-05T00:00:00.000Z")).toMatchObject({
      necessary: true,
      analytics: true,
      marketing: false,
      updatedAt: "2026-07-05T00:00:00.000Z",
    });
  });
});
