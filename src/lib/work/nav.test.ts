import { describe, expect, it } from "vitest";
import { getFlowAdminNav, getFlowPrimaryNav } from "./nav";

describe("getFlowPrimaryNav", () => {
  it("enables only Home; future pages are disabled placeholders", () => {
    const nav = getFlowPrimaryNav();
    expect(nav.find((item) => item.href === "/flow")?.enabled).toBe(true);
    expect(nav.filter((item) => item.href !== "/flow").every((item) => !item.enabled)).toBe(true);
  });
});

describe("getFlowAdminNav", () => {
  it("returns no items for a plain member with an editor legacy role", () => {
    expect(getFlowAdminNav({ accessLevel: "member", legacyRole: "editor" })).toEqual([]);
  });

  it("returns enabled Administration and Content CMS for an admin", () => {
    expect(getFlowAdminNav({ accessLevel: "admin", legacyRole: "admin" })).toEqual([
      { href: "/flow/admin", label: "Administration", enabled: true },
      { href: "/admin", label: "Content CMS", enabled: true },
    ]);
  });

  it("treats owner like admin for Administration", () => {
    expect(getFlowAdminNav({ accessLevel: "owner", legacyRole: "admin" })[0]).toEqual({
      href: "/flow/admin",
      label: "Administration",
      enabled: true,
    });
  });

  it("does not show Administration to managers, and decouples CMS from the capability model", () => {
    expect(getFlowAdminNav({ accessLevel: "manager", legacyRole: "editor" })).toEqual([]);
    // Hypothetical future state: Flow admin without legacy CMS admin sees Administration only.
    expect(getFlowAdminNav({ accessLevel: "admin", legacyRole: "editor" })).toEqual([
      { href: "/flow/admin", label: "Administration", enabled: true },
    ]);
  });
});
