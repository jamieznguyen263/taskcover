import { describe, expect, it } from "vitest";
import { getPublishedInsights } from "@/lib/insights/content";
import { assertWorkflowDecision, isPublishedSnapshotLive } from "./workflow";

describe("workflow", () => {
  it("requires all EN/FR/ES localizations before approval", async () => {
    const [article] = await getPublishedInsights("en");
    expect(() =>
      assertWorkflowDecision({
        from: "in-review",
        to: "approved",
        role: "admin",
        translations: article ? [article] : [],
      })
    ).toThrow(/missing fr/);
  });

  it("allows Admin approval for complete passing translations", async () => {
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
