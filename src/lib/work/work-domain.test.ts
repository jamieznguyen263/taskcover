import { describe, expect, it } from "vitest";
import { resolveStatusChange, WORK_STATUSES } from "./work-domain";

describe("resolveStatusChange", () => {
  it("rejects unknown statuses", () => {
    expect(resolveStatusChange({ nextStatus: "blocked", waitingTarget: null }).ok).toBe(false);
  });

  it("requires a valid target when entering waiting", () => {
    expect(resolveStatusChange({ nextStatus: "waiting", waitingTarget: null }).ok).toBe(false);
    expect(resolveStatusChange({ nextStatus: "waiting", waitingTarget: "nobody" }).ok).toBe(false);
    expect(resolveStatusChange({ nextStatus: "waiting", waitingTarget: "client" })).toEqual({
      ok: true,
      status: "waiting",
      waitingTarget: "client",
    });
  });

  it("clears the waiting target for every non-waiting status", () => {
    for (const status of WORK_STATUSES.filter((s) => s !== "waiting")) {
      expect(resolveStatusChange({ nextStatus: status, waitingTarget: "client" })).toEqual({
        ok: true,
        status,
        waitingTarget: null,
      });
    }
  });

  it("allows any-to-any moves (free flow, no rigid state machine)", () => {
    expect(resolveStatusChange({ nextStatus: "done", waitingTarget: null }).ok).toBe(true);
    expect(resolveStatusChange({ nextStatus: "to_do", waitingTarget: null }).ok).toBe(true);
  });
});
