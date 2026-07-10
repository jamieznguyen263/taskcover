import { describe, expect, it } from "vitest";
import { assertCredentialBootstrapTarget, defaultVerificationRole, parseAdminRole, readFlagValue, shouldRefuseExistingUser } from "./user-bootstrap";

describe("admin user bootstrap helpers", () => {
  it("parses only supported roles", () => {
    expect(parseAdminRole(undefined, "editor")).toBe("editor");
    expect(parseAdminRole("admin", "editor")).toBe("admin");
    expect(parseAdminRole("editor", "admin")).toBe("editor");
    expect(() => parseAdminRole("owner", "editor")).toThrow(/Role must be/);
  });

  it("requires explicit production user bootstrap confirmation", () => {
    expect(assertCredentialBootstrapTarget({ DATABASE_TARGET: "staging" })).toBe("staging");
    expect(() => assertCredentialBootstrapTarget({ DATABASE_TARGET: "production" })).toThrow(/CONFIRM_PRODUCTION_USER_BOOTSTRAP/);
    expect(assertCredentialBootstrapTarget({ DATABASE_TARGET: "production", CONFIRM_PRODUCTION_USER_BOOTSTRAP: "YES" })).toBe("production");
  });

  it("refuses duplicate users unless update is explicit", () => {
    expect(shouldRefuseExistingUser(true, false)).toBe(true);
    expect(shouldRefuseExistingUser(true, true)).toBe(false);
    expect(shouldRefuseExistingUser(false, false)).toBe(false);
  });

  it("reads flag values from both supported forms", () => {
    expect(readFlagValue(["--role", "editor"], "--role")).toBe("editor");
    expect(readFlagValue(["--role=admin"], "--role")).toBe("admin");
  });

  it("defaults the dedicated user verification command to Editor", () => {
    expect(defaultVerificationRole("admin:user:verify")).toBe("editor");
    expect(defaultVerificationRole("admin:verify")).toBe("admin");
    expect(defaultVerificationRole(undefined)).toBe("admin");
  });
});
