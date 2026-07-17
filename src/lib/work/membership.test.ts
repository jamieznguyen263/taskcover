import { describe, expect, it } from "vitest";
import { mapLegacyRoleToAccessLevel } from "./membership";

describe("mapLegacyRoleToAccessLevel", () => {
  it("maps CMS admins to the admin access level, never owner", () => {
    expect(mapLegacyRoleToAccessLevel("admin")).toBe("admin");
  });

  it("maps CMS editors to everyday member access", () => {
    expect(mapLegacyRoleToAccessLevel("editor")).toBe("member");
  });
});
