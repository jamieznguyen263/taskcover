import { describe, expect, it } from "vitest";
import { CAPABILITIES_BY_ACCESS_LEVEL, hasCapability, type WorkCapability } from "./capabilities";

/**
 * FLOW-012 permission audit, encoded. This is the authorization contract every /flow page
 * and server action was audited against (each re-checks its capability server-side, never
 * relying on nav visibility). If a capability's tier changes, update this matrix in the same
 * change — a silent downgrade (e.g. making a manage action available to plain members) will
 * fail here.
 */
const EXPECTED_MIN_TIER: Record<WorkCapability, "member" | "manager" | "admin"> = {
  "flow:access": "member",
  "teams:view": "member",
  "clients:view": "member",
  "projects:view": "member",
  "work:view": "member",
  "work:manage": "member",
  "internal-notes:view": "member",
  "docs:view": "member",
  "docs:manage": "member",
  "members:view": "manager",
  "clients:manage": "manager",
  "projects:manage": "manager",
  "teams:manage": "admin",
  "administration:view": "admin",
};

const TIERS = ["member", "manager", "admin"] as const;

describe("authorization matrix (FLOW-012 audit)", () => {
  it("covers every declared capability exactly once", () => {
    const declared = new Set(CAPABILITIES_BY_ACCESS_LEVEL.owner);
    const matrixKeys = new Set(Object.keys(EXPECTED_MIN_TIER) as WorkCapability[]);
    expect(matrixKeys).toEqual(declared);
  });

  it("grants each capability at its expected minimum tier and denies it below", () => {
    for (const [capability, minTier] of Object.entries(EXPECTED_MIN_TIER) as [WorkCapability, (typeof TIERS)[number]][]) {
      const minIndex = TIERS.indexOf(minTier);
      TIERS.forEach((tier, index) => {
        expect(hasCapability(tier, capability)).toBe(index >= minIndex);
      });
    }
  });

  it("owner has everything admin has (owner is a superset ceiling)", () => {
    for (const capability of CAPABILITIES_BY_ACCESS_LEVEL.admin) {
      expect(hasCapability("owner", capability)).toBe(true);
    }
  });

  it("no manage/admin capability leaks to the member floor", () => {
    const memberForbidden: WorkCapability[] = [
      "members:view",
      "clients:manage",
      "projects:manage",
      "teams:manage",
      "administration:view",
    ];
    for (const capability of memberForbidden) {
      expect(hasCapability("member", capability)).toBe(false);
    }
  });
});
