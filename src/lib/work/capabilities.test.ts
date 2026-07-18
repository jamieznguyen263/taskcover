import { describe, expect, it } from "vitest";
import {
  assertCapability,
  CAPABILITIES_BY_ACCESS_LEVEL,
  hasCapability,
  SYSTEM_ROLE_PRESETS,
  WorkAuthorizationError,
  type WorkAccessLevel,
  type WorkCapability,
} from "./capabilities";

const ALL_LEVELS: WorkAccessLevel[] = ["owner", "admin", "manager", "member"];

describe("capability model", () => {
  it("is deny-by-default: members lack every administrative capability", () => {
    expect(hasCapability("member", "administration:view")).toBe(false);
    expect(hasCapability("member", "teams:manage")).toBe(false);
    expect(hasCapability("member", "members:view")).toBe(false);
  });

  it("grants flow:access to every level", () => {
    for (const level of ALL_LEVELS) {
      expect(hasCapability(level, "flow:access")).toBe(true);
    }
  });

  it("gives every internal level work and internal-notes visibility (company-wide work)", () => {
    for (const level of ALL_LEVELS) {
      expect(hasCapability(level, "work:view")).toBe(true);
      expect(hasCapability(level, "work:manage")).toBe(true);
      expect(hasCapability(level, "internal-notes:view")).toBe(true);
    }
  });

  it("is strictly cumulative: member ⊆ manager ⊆ admin = owner", () => {
    const asSet = (level: WorkAccessLevel) => new Set<WorkCapability>(CAPABILITIES_BY_ACCESS_LEVEL[level]);
    const member = asSet("member");
    const manager = asSet("manager");
    const admin = asSet("admin");
    const owner = asSet("owner");

    for (const capability of member) expect(manager.has(capability)).toBe(true);
    for (const capability of manager) expect(admin.has(capability)).toBe(true);
    expect(admin).toEqual(owner);
    expect(manager.size).toBeGreaterThan(member.size);
    expect(admin.size).toBeGreaterThan(manager.size);
  });

  it("assertCapability throws WorkAuthorizationError on missing capability", () => {
    expect(() => assertCapability("member", "teams:manage")).toThrow(WorkAuthorizationError);
    expect(() => assertCapability("admin", "teams:manage")).not.toThrow();
  });

  it("defines a system preset for every access level", () => {
    expect(SYSTEM_ROLE_PRESETS.map((preset) => preset.key).sort()).toEqual([...ALL_LEVELS].sort());
  });
});
