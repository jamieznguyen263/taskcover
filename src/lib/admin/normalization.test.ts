import { describe, expect, it } from "vitest";
import { createStarterTiptapDocument, normalizeTiptapToInsightBlocks, STRUCTURED_BLOCK_NODE } from "./normalization";

const doc = (content: unknown[]) => ({ type: "doc", content });

describe("Tiptap normalization", () => {
  it("normalizes headings at levels 2-4 and clamps unknown levels to 2", () => {
    const blocks = normalizeTiptapToInsightBlocks(
      doc([
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Two" }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Three" }] },
        { type: "heading", attrs: { level: 4 }, content: [{ type: "text", text: "Four" }] },
        { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "One" }] },
      ])
    );
    expect(blocks).toEqual([
      { type: "heading", level: 2, text: "Two" },
      { type: "heading", level: 3, text: "Three" },
      { type: "heading", level: 4, text: "Four" },
      { type: "heading", level: 2, text: "One" },
    ]);
  });

  it("normalizes code blocks with language", () => {
    const blocks = normalizeTiptapToInsightBlocks(doc([{ type: "codeBlock", attrs: { language: "ts" }, content: [{ type: "text", text: "const a = 1;" }] }]));
    expect(blocks).toEqual([{ type: "code", code: "const a = 1;", language: "ts" }]);
  });

  it("preserves safe inline marks from editor paragraphs", () => {
    const blocks = normalizeTiptapToInsightBlocks(
      doc([
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Use " },
            { type: "text", text: "SEO services", marks: [{ type: "bold" }, { type: "link", attrs: { href: "/services/seo-agency" } }] },
            { type: "text", text: " for growth." },
          ],
        },
      ])
    );
    expect(blocks).toEqual([
      {
        type: "paragraph",
        text: [
          { text: "Use " },
          { text: "SEO services", marks: [{ type: "bold" }, { type: "link", href: "/services/seo-agency" }] },
          { text: " for growth." },
        ],
      },
    ]);
  });

  it("drops unsafe link marks while keeping the text", () => {
    const blocks = normalizeTiptapToInsightBlocks(
      doc([{ type: "paragraph", content: [{ type: "text", text: "Unsafe link", marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }] }] }])
    );
    expect(blocks).toEqual([{ type: "paragraph", text: "Unsafe link" }]);
  });

  it("preserves inline links inside list items", () => {
    const blocks = normalizeTiptapToInsightBlocks(
      doc([
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Free SEO audit", marks: [{ type: "link", attrs: { href: "/free-seo-audit" } }] }],
                },
              ],
            },
          ],
        },
      ])
    );
    expect(blocks).toEqual([{ type: "bullet-list", items: [[{ text: "Free SEO audit", marks: [{ type: "link", href: "/free-seo-audit" }] }]] }]);
  });

  it("normalizes editor tables into comparison tables with header row", () => {
    const cell = (text: string, type = "tableCell") => ({ type, content: [{ type: "paragraph", content: [{ type: "text", text }] }] });
    const blocks = normalizeTiptapToInsightBlocks(
      doc([
        {
          type: "table",
          content: [
            { type: "tableRow", content: [cell("Option", "tableHeader"), cell("Price", "tableHeader")] },
            { type: "tableRow", content: [cell("Basic"), cell("$10")] },
          ],
        },
      ])
    );
    expect(blocks).toEqual([{ type: "comparison-table", caption: "", columns: ["Option", "Price"], rows: [["Basic", "$10"]] }]);
  });

  it("passes valid structured block data through and drops invalid data", () => {
    const valid = { type: STRUCTURED_BLOCK_NODE, attrs: { blockType: "direct-answer", data: { type: "direct-answer", title: "TL;DR", answer: "Yes." } } };
    const invalid = { type: STRUCTURED_BLOCK_NODE, attrs: { blockType: "direct-answer", data: { type: "direct-answer", title: 5 } } };
    const blocks = normalizeTiptapToInsightBlocks(doc([valid, invalid]));
    expect(blocks).toEqual([{ type: "direct-answer", title: "TL;DR", answer: "Yes." }]);
  });

  it("normalizes structured image blocks", () => {
    const blocks = normalizeTiptapToInsightBlocks(
      doc([{ type: STRUCTURED_BLOCK_NODE, attrs: { blockType: "image", data: { type: "image", src: "https://example.com/a.png", alt: "Chart" } } }])
    );
    expect(blocks).toEqual([{ type: "image", src: "https://example.com/a.png", alt: "Chart" }]);
  });

  it("normalizes a YouTube video structured block", () => {
    const blocks = normalizeTiptapToInsightBlocks(
      doc([{ type: STRUCTURED_BLOCK_NODE, attrs: { blockType: "video", data: { type: "video", provider: "youtube", videoId: "dQw4w9WgXcQ", title: "Demo" } } }])
    );
    expect(blocks).toEqual([{ type: "video", provider: "youtube", videoId: "dQw4w9WgXcQ", title: "Demo" }]);
  });

  it("drops a video block with an invalid video ID", () => {
    const blocks = normalizeTiptapToInsightBlocks(
      doc([{ type: STRUCTURED_BLOCK_NODE, attrs: { blockType: "video", data: { type: "video", provider: "youtube", videoId: "bad", title: "Demo" } } }])
    );
    expect(blocks).toEqual([]);
  });

  it("still rejects unsafe editor nodes", () => {
    expect(() => normalizeTiptapToInsightBlocks(doc([{ type: "iframe" }]))).toThrow();
  });

  it("keeps the starter document normalizable", () => {
    const blocks = normalizeTiptapToInsightBlocks(createStarterTiptapDocument("Hello"));
    expect(blocks[0]).toEqual({ type: "heading", level: 2, text: "Hello" });
  });
});
