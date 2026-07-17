import { describe, expect, it } from "vitest";
import { isWorkAppEnabled } from "./feature-flag";

describe("isWorkAppEnabled", () => {
  it("defaults to enabled when unset", () => {
    expect(isWorkAppEnabled(undefined)).toBe(true);
  });

  it("is disabled only when explicitly set to false (case-insensitive)", () => {
    expect(isWorkAppEnabled("false")).toBe(false);
    expect(isWorkAppEnabled("FALSE")).toBe(false);
    expect(isWorkAppEnabled(" false ")).toBe(false);
  });

  it("is enabled for any other explicit value", () => {
    expect(isWorkAppEnabled("true")).toBe(true);
    expect(isWorkAppEnabled("1")).toBe(true);
    expect(isWorkAppEnabled("")).toBe(true);
  });
});
