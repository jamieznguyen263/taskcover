import { describe, expect, it } from "vitest";
import { getPublishedInsights } from "@/lib/insights/content";
import { normalizeTiptapToInsightBlocks } from "./normalization";
import { validateJsonPayload, publishedArticleSnapshotSchema, tiptapDocumentSchema } from "./validation";

describe("admin validation", () => {
  it("rejects raw HTML-shaped editor payloads", () => {
    expect(() => normalizeTiptapToInsightBlocks({ type: "doc", content: [{ type: "html", text: "<script>x</script>" }] })).toThrow(/Raw HTML/);
  });

  it("validates published article snapshots", async () => {
    const [article] = await getPublishedInsights("en");
    expect(validateJsonPayload(publishedArticleSnapshotSchema, article, "snapshot").status).toBe("published");
    expect(() => validateJsonPayload(publishedArticleSnapshotSchema, { ...article, status: "draft" }, "snapshot")).toThrow();
  });

  it("rejects raw HTML editor nodes", () => {
    expect(() => tiptapDocumentSchema.parse({ type: "doc", content: [{ type: "html", html: "<script>alert(1)</script>" }] })).toThrow(/Raw HTML/);
  });
});
