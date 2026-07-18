import { describe, expect, it } from "vitest";
import { getExternalNav, getFlowAdminNav, getFlowPrimaryNav } from "./nav";

describe("getFlowPrimaryNav", () => {
  it("enables Home, Clients, and Projects; Inbox and Docs remain placeholders", () => {
    const nav = getFlowPrimaryNav();
    const enabled = nav.filter((item) => item.enabled).map((item) => item.label);
    const disabled = nav.filter((item) => !item.enabled).map((item) => item.label);
    expect(enabled).toEqual(["Home", "Clients", "Projects"]);
    expect(disabled).toEqual(["Inbox", "Docs"]);
  });
});

describe("getExternalNav", () => {
  it("contains only the external destinations from the blueprint, with Home enabled", () => {
    const nav = getExternalNav();
    expect(nav.map((item) => item.label)).toEqual(["Home", "Inbox", "My Work", "Shared Projects", "Shared Files"]);
    expect(nav.find((item) => item.label === "Home")?.enabled).toBe(true);
    expect(nav.filter((item) => item.label !== "Home").every((item) => !item.enabled)).toBe(true);
  });

  it("never exposes internal destinations to externals", () => {
    const labels = getExternalNav().map((item) => item.label);
    for (const forbidden of ["Clients", "Projects", "Docs", "Administration", "Content CMS"]) {
      expect(labels).not.toContain(forbidden);
    }
    expect(getExternalNav().every((item) => item.href !== "/admin")).toBe(true);
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
