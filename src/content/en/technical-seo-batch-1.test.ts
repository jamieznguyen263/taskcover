import { describe, expect, it } from "vitest";
import { insights } from "./insights";

const batch1Slugs = [
  "cdn-cache-waf-seo",
  "crawl-budget-large-sites",
  "headless-cms-seo-requirements",
  "http-status-codes-redirects",
  "image-seo-visual-search",
  "internal-site-search",
  "out-of-stock-discontinued-products",
  "pagination-infinite-scroll-load-more",
  "robots-meta-x-robots-controls",
  "seasonal-seo-plan",
  "seo-release-qa-checklist",
  "site-architecture-navigation-taxonomy",
  "structured-data-implementation-qa",
  "technical-seo-audit-checklist-growing-websites",
  "video-seo-watch-pages-hosting",
  "xml-sitemap-design-monitoring",
] as const;

describe("Technical SEO Batch 1 audit implementation", () => {
  it("upgrades all 16 canonical articles without changing their slugs", () => {
    const upgraded = insights.articles.filter((article) =>
      batch1Slugs.includes(article.slug as (typeof batch1Slugs)[number])
    );

    expect(upgraded).toHaveLength(batch1Slugs.length);
    expect(upgraded.map((article) => article.slug).sort()).toEqual([...batch1Slugs].sort());

    for (const article of upgraded) {
      expect(article.updatedAt).toBe("2026-08-09");
      expect(article.lastFactCheckedAt).toBe("2026-08-09");
      expect(article.readingTime).toBeGreaterThanOrEqual(17);
      expect(article.searchStrategy.uniqueInformationGain.length).toBeGreaterThan(100);
      expect(article.publishQa.summary).toContain("Batch 1 depth audit implemented");
    }
  });

  it("keeps specialist decision support and extractable evidence in every article", () => {
    for (const slug of batch1Slugs) {
      const article = insights.articles.find((item) => item.slug === slug);
      expect(article, slug).toBeDefined();
      if (!article) continue;

      const specialistBlocks = article.blocks.filter((block) =>
        ["comparison-table", "decision-framework", "checklist", "steps", "code"].includes(block.type)
      );
      const evidenceBlocks = article.blocks.filter((block) => block.type === "evidence");
      const sourceIds = new Set(article.contentEvidence.sources.map((source) => source.id));
      const claimIds = new Set(article.contentEvidence.claims.map((claim) => claim.id));

      expect(specialistBlocks.length, slug).toBeGreaterThanOrEqual(3);
      expect(evidenceBlocks.length, slug).toBeGreaterThanOrEqual(1);
      expect(article.contentEvidence.sources.length, slug).toBeGreaterThanOrEqual(2);
      expect(article.schema.citationReferences.length, slug).toBeGreaterThanOrEqual(1);

      for (const block of evidenceBlocks) {
        if (block.type !== "evidence") continue;
        expect(claimIds.has(block.claimId), `${slug}: ${block.claimId}`).toBe(true);
        for (const sourceId of block.sourceIds) {
          expect(sourceIds.has(sourceId), `${slug}: ${sourceId}`).toBe(true);
        }
      }
    }
  });

  it("repositions the internal-search article while preserving its canonical URL", () => {
    const article = insights.articles.find((item) => item.slug === "internal-site-search");
    expect(article?.h1).toBe("How to Use Ecommerce Site Search Data for SEO and Content Decisions");
    expect(article?.metadata.canonical).toBe("/insights/technical-seo/internal-site-search");
    expect(article?.metadata.metaTitle.length).toBeLessThanOrEqual(60);
    expect(article?.metadata.metaDescription.length).toBeLessThanOrEqual(160);
  });
});
