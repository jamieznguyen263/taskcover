import { describe, expect, it } from "vitest";
import { getFlowCommands } from "./commands";

describe("getFlowCommands", () => {
  it("includes Go to Content CMS only for the legacy admin role", () => {
    expect(
      getFlowCommands({ accessLevel: "member", legacyRole: "editor" }).some((command) => command.id === "go-cms")
    ).toBe(false);
    expect(
      getFlowCommands({ accessLevel: "admin", legacyRole: "admin" }).some((command) => command.id === "go-cms")
    ).toBe(true);
  });

  it("includes Go to Administration only with the administration:view capability", () => {
    expect(
      getFlowCommands({ accessLevel: "member", legacyRole: "editor" }).some((command) => command.id === "go-admin")
    ).toBe(false);
    expect(
      getFlowCommands({ accessLevel: "manager", legacyRole: "editor" }).some((command) => command.id === "go-admin")
    ).toBe(false);
    expect(
      getFlowCommands({ accessLevel: "owner", legacyRole: "admin" }).some((command) => command.id === "go-admin")
    ).toBe(true);
  });

  it("includes Inbox, Clients, and Projects navigation for every internal level", () => {
    for (const context of [
      { accessLevel: "member", legacyRole: "editor" },
      { accessLevel: "owner", legacyRole: "admin" },
    ] as const) {
      const ids = getFlowCommands(context).map((command) => command.id);
      expect(ids).toContain("go-inbox");
      expect(ids).toContain("go-clients");
      expect(ids).toContain("go-projects");
    }
  });

  it("always starts with Go to Home and ends with Sign out", () => {
    for (const context of [
      { accessLevel: "admin", legacyRole: "admin" },
      { accessLevel: "member", legacyRole: "editor" },
    ] as const) {
      const commands = getFlowCommands(context);
      expect(commands[0]).toEqual({ id: "go-home", label: "Go to Home", kind: "navigate", href: "/flow" });
      expect(commands[commands.length - 1]).toEqual({ id: "sign-out", label: "Sign out", kind: "sign-out" });
    }
  });
});
