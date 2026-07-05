import { describe, expect, it } from "vitest";
import { canTransition, hasPermission } from "./permissions";

describe("admin permissions", () => {
  it("blocks Editors from Admin-only actions", () => {
    expect(hasPermission("editor", "article:approve")).toBe(false);
    expect(hasPermission("editor", "article:publish")).toBe(false);
    expect(hasPermission("editor", "users:manage")).toBe(false);
  });

  it("allows Admin transitions and blocks Editor approval", () => {
    expect(canTransition("admin", "in-review", "approved")).toBe(true);
    expect(canTransition("editor", "in-review", "approved")).toBe(false);
    expect(canTransition("editor", "draft", "in-review")).toBe(true);
  });
});
