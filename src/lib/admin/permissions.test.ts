import { describe, expect, it } from "vitest";
import { canTransition, hasPermission, type Permission } from "./permissions";

describe("admin permissions", () => {
  it("blocks Editors from Admin-only actions", () => {
    const denied: Permission[] = [
      "article:approve",
      "article:publish",
      "article:schedule",
      "article:archive",
      "article:restore",
      "users:manage",
      "audit:view",
      "scheduler:run",
    ];
    for (const permission of denied) {
      expect(hasPermission("editor", permission)).toBe(false);
    }
  });

  it("allows Admin transitions and blocks Editor approval", () => {
    expect(canTransition("admin", "in-review", "approved")).toBe(true);
    expect(canTransition("editor", "in-review", "approved")).toBe(false);
    expect(canTransition("editor", "draft", "in-review")).toBe(true);
    expect(canTransition("editor", "approved", "published")).toBe(false);
    expect(canTransition("editor", "approved", "scheduled")).toBe(false);
    expect(canTransition("editor", "scheduled", "published")).toBe(false);
    expect(canTransition("editor", "published", "archived")).toBe(false);
    expect(canTransition("editor", "published", "draft")).toBe(true);
    expect(canTransition("admin", "approved", "draft")).toBe(true);
    expect(canTransition("editor", "approved", "draft")).toBe(false);
  });
});
