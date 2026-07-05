import { describe, expect, it } from "vitest";
import { getPublishedInsights } from "@/lib/insights/content";
import { normalizeTiptapToInsightBlocks } from "./normalization";
import { validateJsonPayload, publishedArticleSnapshotSchema } from "./validation";

describe("admin validation", () => {
  it("rejects raw HTML-shaped editor payloads", () => {
    expect(() => normalizeTiptapToInsightBlocks({ type: "doc", content: [{ type: "html", text: "<script>x</script>" }] })).not.toThrow();
    expect(normalizeTiptapToInsightBlocks({ type: "doc", content: [{ type: "html", text: "<script>x</script>" }] })[0]).toMatchObject({
      type: "paragraph",
    });
  });

  it("validates published article snapshots", async () => {
    const [article] = await getPublishedInsights("en");
    expect(validateJsonPayload(publishedArticleSnapshotSchema, article, "snapshot").status).toBe("published");
    expect(() => validateJsonPayload(publishedArticleSnapshotSchema, { ...article, status: "draft" }, "snapshot")).toThrow();
  });
});
