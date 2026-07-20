import { afterEach, describe, expect, it, vi } from "vitest";
import { describeError, reportActionFailure } from "./action-error";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Flow action error reporting", () => {
  it("keeps the real cause instead of discarding it", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    reportActionFailure("createProjectAction", new Error("duplicate key value"), { kind: "client" });

    expect(spy.mock.calls[0]?.[0]).toContain("createProjectAction failed");
    expect(spy.mock.calls[0]?.[0]).toContain("duplicate key value");
    expect(spy.mock.calls[0]?.[0]).toContain("kind=client");
  });

  it("omits absent context rather than logging null ids", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    reportActionFailure("createProjectAction", new Error("boom"), { clientId: null, actorId: undefined });

    expect(spy.mock.calls[0]?.[0]).not.toContain("clientId");
    expect(spy.mock.calls[0]?.[0]).not.toContain("actorId");
  });

  it("describes non-Error throws without crashing the action", () => {
    expect(describeError("plain string")).toBe("plain string");
    expect(describeError({ code: 42 })).toBe('{"code":42}');
    expect(describeError(new TypeError("bad"))).toBe("TypeError: bad");
  });
});
