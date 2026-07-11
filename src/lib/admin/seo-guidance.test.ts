import { describe, expect, it } from "vitest";
import { createDraftArticle } from "./content-model";
import { descriptionGuidance, metadataGuidance, slugGuidance, titleGuidance } from "./seo-guidance";

function draft() {
  return createDraftArticle({ groupId: "group", translationGroupId: "translation", slug: "test-article", category: "seo-guides", locale: "en", author: "Editor" }).article;
}

describe("SEO guidance", () => {
  it("blocks empty titles and descriptions", () => {
    expect(titleGuidance("").status).toBe("blocking");
    expect(descriptionGuidance(" ").status).toBe("blocking");
  });

  it("recommends shortening long titles and passes in-range titles", () => {
    expect(titleGuidance("a".repeat(75)).status).toBe("recommended");
    expect(titleGuidance("A well-sized SEO title for the taskcover blog").status).toBe("passed");
    expect(titleGuidance("Short").status).toBe("optional");
  });

  it("warns about slug changes against the published slug", () => {
    const results = slugGuidance("new-slug", "old-slug");
    expect(results.some((result) => result.code === "slug-changed" && result.status === "recommended")).toBe(true);
    expect(slugGuidance("same-slug", "same-slug").some((result) => result.code === "slug-changed")).toBe(false);
    expect(slugGuidance("Bad Slug!", null)[0].status).toBe("blocking");
  });

  it("aggregates metadata guidance including canonical and robots checks", () => {
    const article = draft();
    const results = metadataGuidance(article, null);
    expect(results.some((result) => result.code === "title-missing")).toBe(true);
    expect(results.some((result) => result.code === "canonical-ok")).toBe(true);
    expect(results.some((result) => result.code === "robots-ok")).toBe(true);
  });
});
