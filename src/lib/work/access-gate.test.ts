import { describe, expect, it } from "vitest";
import { evaluateFlowAccess } from "./access-gate";

describe("evaluateFlowAccess", () => {
  it("disables the route first when the feature flag is off, regardless of other state", () => {
    expect(evaluateFlowAccess({ workAppEnabled: false, databaseConfigured: false, hasSession: false })).toEqual({
      kind: "disabled",
    });
    expect(evaluateFlowAccess({ workAppEnabled: false, databaseConfigured: true, hasSession: true })).toEqual({
      kind: "disabled",
    });
  });

  it("reports database unavailable before requiring a session", () => {
    expect(evaluateFlowAccess({ workAppEnabled: true, databaseConfigured: false, hasSession: false })).toEqual({
      kind: "database-unavailable",
    });
  });

  it("requires a session when the database is configured but no session exists", () => {
    expect(evaluateFlowAccess({ workAppEnabled: true, databaseConfigured: true, hasSession: false })).toEqual({
      kind: "requires-session",
    });
  });

  it("allows access once the flag is on, the database is configured, and a session exists", () => {
    expect(evaluateFlowAccess({ workAppEnabled: true, databaseConfigured: true, hasSession: true })).toEqual({
      kind: "allow",
    });
  });
});
