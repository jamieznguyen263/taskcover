import { describe, expect, it } from "vitest";
import { validateClientHealthUpdate } from "./client-health";

describe("validateClientHealthUpdate", () => {
  it("rejects unknown states", () => {
    expect(validateClientHealthUpdate({ state: "great", reason: "" }).ok).toBe(false);
  });

  it("requires a reason for watch and at_risk — health must be explainable", () => {
    expect(validateClientHealthUpdate({ state: "watch", reason: "  " }).ok).toBe(false);
    expect(validateClientHealthUpdate({ state: "at_risk", reason: "" }).ok).toBe(false);
    const valid = validateClientHealthUpdate({ state: "at_risk", reason: "Contract renewal stalled." });
    expect(valid).toEqual({ ok: true, state: "at_risk", reason: "Contract renewal stalled." });
  });

  it("allows good without a reason and clears the reason for unknown", () => {
    expect(validateClientHealthUpdate({ state: "good", reason: "" })).toEqual({ ok: true, state: "good", reason: "" });
    expect(validateClientHealthUpdate({ state: "unknown", reason: "stale note" })).toEqual({
      ok: true,
      state: "unknown",
      reason: "",
    });
  });
});
