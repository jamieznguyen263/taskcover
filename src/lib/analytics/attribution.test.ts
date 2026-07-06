import { describe, expect, it } from "vitest";
import { attributionRetentionDays, attributionToEventPayload, getStoredAttribution, parseAttributionFromSearch, saveAttribution, shouldStoreAttribution } from "./attribution";
import { createConsentPreferences } from "@/lib/consent/preferences";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
}

describe("analytics attribution capture", () => {
  it("parses allowed UTM and click id keys only", () => {
    expect(parseAttributionFromSearch("?utm_source=google&utm_medium=cpc&gclid=abc&fbclid=drop&li_fat_id=drop&email=x@y.com")).toEqual({
      utm_source: "google",
      utm_medium: "cpc",
      gclid: "abc",
    });
  });

  it("stores attribution only when analytics or marketing consent allows it", () => {
    expect(shouldStoreAttribution(null)).toBe(false);
    expect(shouldStoreAttribution(createConsentPreferences({ analytics: true }))).toBe(true);
    expect(shouldStoreAttribution(createConsentPreferences({ marketing: true }))).toBe(true);
  });

  it("expires stored attribution and exposes click ids as booleans for events", () => {
    const storage = memoryStorage();
    const now = new Date("2026-07-07T00:00:00.000Z");
    const stored = saveAttribution({ utm_source: "google", gclid: "click-id" }, "/pricing?tab=mentor", storage, now);
    expect(stored?.expiresAt).toBe(new Date(now.getTime() + attributionRetentionDays * 24 * 60 * 60 * 1000).toISOString());
    expect(attributionToEventPayload(getStoredAttribution(storage, now))).toMatchObject({
      utm_source: "google",
      gclid_present: true,
    });
    expect(getStoredAttribution(storage, new Date("2027-01-01T00:00:00.000Z"))).toBeNull();
  });
});
