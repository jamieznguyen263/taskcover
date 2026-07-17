import { describe, expect, it } from "vitest";
import { getFlowCommands } from "./commands";

describe("getFlowCommands", () => {
  it("includes Go to Content CMS only for the admin role", () => {
    expect(getFlowCommands("editor").some((command) => command.id === "go-cms")).toBe(false);
    expect(getFlowCommands("admin").some((command) => command.id === "go-cms")).toBe(true);
  });

  it("always starts with Go to Home and ends with Sign out", () => {
    for (const role of ["admin", "editor"] as const) {
      const commands = getFlowCommands(role);
      expect(commands[0]).toEqual({ id: "go-home", label: "Go to Home", kind: "navigate", href: "/flow" });
      expect(commands[commands.length - 1]).toEqual({ id: "sign-out", label: "Sign out", kind: "sign-out" });
    }
  });
});
