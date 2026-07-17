import { describe, expect, it } from "vitest";
import { evaluateExternalAccess } from "./external-access";

const NOW = new Date("2026-07-17T12:00:00Z");
const YESTERDAY = new Date("2026-07-16T12:00:00Z");
const TOMORROW = new Date("2026-07-18T12:00:00Z");

describe("evaluateExternalAccess", () => {
  it("is active inside the window with no revoke", () => {
    expect(
      evaluateExternalAccess({ now: NOW, accessStartAt: YESTERDAY, accessExpiryAt: TOMORROW, revokedAt: null })
    ).toBe("active");
  });

  it("treats a null expiry as manual-revoke-only access", () => {
    expect(
      evaluateExternalAccess({ now: NOW, accessStartAt: YESTERDAY, accessExpiryAt: null, revokedAt: null })
    ).toBe("active");
  });

  it("blocks access before the start date", () => {
    expect(
      evaluateExternalAccess({ now: NOW, accessStartAt: TOMORROW, accessExpiryAt: null, revokedAt: null })
    ).toBe("not-started");
  });

  it("expires at the expiry instant (inclusive)", () => {
    expect(
      evaluateExternalAccess({ now: NOW, accessStartAt: YESTERDAY, accessExpiryAt: NOW, revokedAt: null })
    ).toBe("expired");
    expect(
      evaluateExternalAccess({ now: NOW, accessStartAt: YESTERDAY, accessExpiryAt: YESTERDAY, revokedAt: null })
    ).toBe("expired");
  });

  it("revoke beats everything, including a still-open window", () => {
    expect(
      evaluateExternalAccess({ now: NOW, accessStartAt: YESTERDAY, accessExpiryAt: TOMORROW, revokedAt: NOW })
    ).toBe("revoked");
    expect(
      evaluateExternalAccess({ now: NOW, accessStartAt: TOMORROW, accessExpiryAt: null, revokedAt: YESTERDAY })
    ).toBe("revoked");
  });
});
