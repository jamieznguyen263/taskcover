import { describe, expect, it } from "vitest";
import { articleIdFromCreationKey, assertCore56Identity, creationKeyFromArticleId, expectedArticleIds, isCore56CreationKey, sortArticleIdsNumerically } from "./core56-identity";

describe("core56 identity helpers", () => {
  it("recognizes the strict creation-key pattern", () => {
    expect(isCore56CreationKey("core56-tc-001")).toBe(true);
    expect(isCore56CreationKey("core56-tc-1")).toBe(false);
    expect(isCore56CreationKey("core56-tc-999-extra")).toBe(false);
    expect(isCore56CreationKey(null)).toBe(false);
  });

  it("converts between creation keys and TC-### ids", () => {
    expect(articleIdFromCreationKey("core56-tc-007")).toBe("TC-007");
    expect(articleIdFromCreationKey("not-a-core56-key")).toBeNull();
    expect(creationKeyFromArticleId("TC-007")).toBe("core56-tc-007");
  });

  it("produces exactly TC-001..TC-056", () => {
    const ids = expectedArticleIds();
    expect(ids).toHaveLength(56);
    expect(ids[0]).toBe("TC-001");
    expect(ids[55]).toBe("TC-056");
  });

  it("sorts ids numerically, not lexicographically", () => {
    expect(sortArticleIdsNumerically(["TC-010", "TC-002", "TC-001"])).toEqual(["TC-001", "TC-002", "TC-010"]);
  });
});

describe("assertCore56Identity", () => {
  const validKeys = Array.from({ length: 56 }, (_, i) => `core56-tc-${String(i + 1).padStart(3, "0")}`);

  it("passes with exactly 56 unique, well-formed keys", () => {
    const result = assertCore56Identity(validKeys);
    expect(result.ok).toBe(true);
  });

  it("fails when a key is missing", () => {
    const result = assertCore56Identity(validKeys.slice(1));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.missing).toContain("TC-001");
  });

  it("fails on a duplicate", () => {
    const result = assertCore56Identity([...validKeys, "core56-tc-001"]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.duplicates).toContain("TC-001");
  });

  it("fails on an out-of-range or malformed key", () => {
    const result = assertCore56Identity([...validKeys.slice(0, 55), "core56-tc-999"]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missing).toContain("TC-056");
      expect(result.unexpected).toContain("TC-999");
    }
  });
});
