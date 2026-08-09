import { describe, expect, it } from "vitest";
import { insights } from "./insights";

const batch2Slugs = [
  "search-intent-analysis",
  "content-governance-workflow",
  "editorial-fact-checking-sources",
  "author-reviewer-byline-governance",
  "programmatic-seo-publish-gate",
  "glossary-reference-hub-strategy",
  "expert-commentary-system",
  "journalist-outreach-pitching",
  "survey-research-methodology",
  "link-reclamation-unlinked-mentions",
  "digital-pr-measurement",
  "product-reviews-ugc-governance",
  "feature-solution-page-strategy",
  "documentation-help-center-seo",
  "free-tools-calculators-templates",
  "saas-category-creation-strategy",
] as const;

describe("Content Authority Batch 2 audit implementation", () => {
  it("upgrades all 16 supporting articles without changing canonical slugs", () => {
    const upgraded = insights.articles.filter((article) =>
      batch2Slugs.includes(article.slug as (typeof batch2Slugs)[number])
    );

    expect(upgraded).toHaveLength(batch2Slugs.length);
    expect(upgraded.map((article) => article.slug).sort()).toEqual([...batch2Slugs].sort());

    for (const article of upgraded) {
      expect(article.updatedAt, article.slug).toBe("2026-08-09");
      expect(article.lastFactCheckedAt, article.slug).toBe("2026-08-09");
      expect(article.readingTime, article.slug).toBeGreaterThanOrEqual(18);
      expect(article.searchStrategy.uniqueInformationGain.length, article.slug).toBeGreaterThan(120);
      expect(article.metadata.canonical, article.slug).toBe(`/insights/${article.category}/${article.slug}`);
      expect(article.publishQa.summary).toContain("Batch 2 content-authority audit implemented");
    }
  });

  it("keeps specialist artifacts and claim-to-source evidence in every article", () => {
    for (const slug of batch2Slugs) {
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

  it("keeps the Content Authority pillar separate from the supporting batch", () => {
    expect(batch2Slugs).not.toContain("content-rankings-citations-leads");
    const pillar = insights.articles.find((article) => article.slug === "content-rankings-citations-leads");
    expect(pillar?.category).toBe("content-authority");
    expect(pillar?.internalLinking.relatedArticleSlugs.length).toBeGreaterThan(0);
  });
});
