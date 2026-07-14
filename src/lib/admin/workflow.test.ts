import { describe, expect, it } from "vitest";
import { getPublishedInsights } from "@/lib/insights/content";
import { assertWorkflowDecision, isPublishedSnapshotLive } from "./workflow";

describe("workflow", () => {
  it("allows Admin approval for an English-only publication group", async () => {
    const [article] = await getPublishedInsights("en");
    expect(() =>
      assertWorkflowDecision({
        from: "in-review",
        to: "approved",
        role: "admin",
        translations: article ? [article] : [],
      })
    ).not.toThrow();
  });

  it("blocks approval when an article group has no localizations", () => {
    expect(() =>
      assertWorkflowDecision({
        from: "in-review",
        to: "approved",
        role: "admin",
        translations: [],
      })
    ).toThrow(/no article localizations/);
  });

  it("allows Admin approval for complete passing multilingual groups", async () => {
    const translations = [
      (await getPublishedInsights("en"))[0],
      (await getPublishedInsights("fr"))[0],
      (await getPublishedInsights("es"))[0],
    ].filter(Boolean);
    expect(() =>
      assertWorkflowDecision({
        from: "in-review",
        to: "approved",
        role: "admin",
        translations,
      })
    ).not.toThrow();
  });

  it("keeps future scheduled content out of live published state", async () => {
    const [article] = await getPublishedInsights("en");
    expect(isPublishedSnapshotLive({ ...article!, scheduledAt: "2999-01-01T00:00:00.000Z" })).toBe(false);
  });
});
