import { describe, expect, it } from "vitest";
import { getInsightArticleSlugs, getPublishedInsights } from "./content";

describe("local insights provider", () => {
  it("exposes published local content in all locales by default", async () => {
    expect((await getPublishedInsights("en")).length).toBeGreaterThanOrEqual(6);
    expect((await getPublishedInsights("fr")).length).toBeGreaterThanOrEqual(6);
    expect((await getPublishedInsights("es")).length).toBeGreaterThanOrEqual(6);
  });

  it("returns published-only sitemap slugs", async () => {
    const slugs = await getInsightArticleSlugs();
    expect(slugs.every((item) => item.articleSlug && item.categorySlug && item.locale)).toBe(true);
  });
});
