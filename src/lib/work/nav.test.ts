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
  it("returns no items for the editor role", () => {
    expect(getFlowAdminNav({ role: "editor" })).toEqual([]);
  });

  it("returns a disabled Administration placeholder and an enabled Content CMS link for admin", () => {
    expect(getFlowAdminNav({ role: "admin" })).toEqual([
      { href: "/flow/admin", label: "Administration", enabled: false },
      { href: "/admin", label: "Content CMS", enabled: true },
    ]);
  });
});
