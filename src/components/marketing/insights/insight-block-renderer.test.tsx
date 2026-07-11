import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { InsightArticle } from "@/content/insights.types";
import { InsightBlockRenderer } from "./insight-block-renderer";

describe("InsightBlockRenderer", () => {
  it("renders rich paragraph links as anchors", () => {
    const article = {
      blocks: [
        {
          type: "paragraph",
          text: [
            { text: "Read " },
            { text: "SEO services", marks: [{ type: "link", href: "/services/seo-agency" }] },
            { text: " next." },
          ],
        },
      ],
    } as InsightArticle;

    const markup = renderToStaticMarkup(<InsightBlockRenderer article={article} locale="en" />);
    expect(markup).toContain('href="/services/seo-agency"');
    expect(markup).toContain("SEO services");
  });

  it("does not render unsafe rich links", () => {
    const article = {
      blocks: [{ type: "paragraph", text: [{ text: "Unsafe", marks: [{ type: "link", href: "javascript:alert(1)" }] }] }],
    } as InsightArticle;

    const markup = renderToStaticMarkup(<InsightBlockRenderer article={article} locale="en" />);
    expect(markup).not.toContain("javascript:");
    expect(markup).toContain("Unsafe");
  });
});
