import { describe, expect, it } from "vitest";
import type { InsightArticle, InsightBlock } from "@/content/insights.types";
import { createDraftArticle } from "./content-model";
import { analyzeContentIntelligence } from "./content-intelligence";

function draft(overrides: Partial<InsightArticle> = {}): InsightArticle {
  const { article } = createDraftArticle({ groupId: "group", translationGroupId: "translation", slug: "content-intelligence", category: "seo-guides", locale: "en", author: "Editor" });
  return { ...article, ...overrides };
}

describe("content intelligence", () => {
  it("flags missing strategy, body links, and evidence", () => {
    const groups = analyzeContentIntelligence(draft(), [draft()]);
    const items = groups.flatMap((group) => group.items);
    expect(items.find((item) => item.code === "focus-keyword")?.status).toBe("action");
    expect(items.find((item) => item.code === "body-links")?.status).toBe("action");
    expect(items.find((item) => item.code === "claims-tracked")?.status).toBe("action");
  });

  it("passes core checks for a well-prepared article", () => {
    const blocks: InsightBlock[] = [
      { type: "direct-answer", title: "TL;DR", answer: "An SEO roadmap prioritizes technical fixes, content gaps, and authority building." },
      { type: "key-takeaways", title: "Key takeaways", items: ["Prioritize crawlability.", "Build evidence-led pages."] },
      { type: "heading", level: 2, text: "How should teams prioritize SEO work?" },
      { type: "paragraph", text: [{ text: "An SEO roadmap names Google Search Console and links to the SEO service.", marks: [{ type: "link", href: "/services/seo-agency" }] }] },
      { type: "heading", level: 2, text: "Technical foundation" },
      { type: "paragraph", text: [{ text: "Book a strategy call after the audit.", marks: [{ type: "link", href: "/book-a-call" }] }] },
      { type: "heading", level: 2, text: "Evidence and measurement" },
      { type: "checklist", title: "Checklist", items: [{ label: "Crawl", detail: "Fix indexability first." }] },
      { type: "steps", title: "Process", steps: [{ title: "Audit", body: "Map demand and blockers." }] },
    ];
    const article = draft({
      blocks,
      coverImageAlt: "SEO planning dashboard",
      expertReviewer: "SEO Lead",
      searchStrategy: {
        ...draft().searchStrategy,
        focusKeyword: "seo roadmap",
        coreQuestion: "How should teams prioritize SEO work?",
        targetAudience: "Marketing leaders",
        targetMarkets: ["United States"],
        serpObservations: ["Top pages are generic.", "Few include prioritization.", "Most lack evidence."],
        uniqueInformationGain: "This article uses Taskcover's prioritization model and first-hand audit workflow to show what to fix first.",
        aiCitationOpportunity: "A concise prioritization framework for SEO roadmaps.",
        primaryEntity: "SEO roadmap",
        supportingEntities: ["Google Search Console"],
      },
      contentEvidence: {
        ...draft().contentEvidence,
        sources: [
          { id: "s1", title: "Google Search docs", publisher: "Google", url: "https://developers.google.com/search", accessedAt: "2026-07-11", publishedAt: "2026-01-01", primarySource: false, supportsClaimIds: ["c1"], locale: "global" },
          { id: "s2", title: "Industry report", publisher: "Example", url: "https://example.com/report", accessedAt: "2026-07-11", publishedAt: "2026-01-01", primarySource: false, supportsClaimIds: ["c1"], locale: "global" },
        ],
        claims: [{ id: "c1", text: "Technical blockers should be prioritized before expansion content.", requiresEvidence: true, sourceIds: ["s1"] }],
      },
      internalLinking: { ...draft().internalLinking, requiredInternalLinks: [{ label: "SEO service", href: "/services/seo-agency" }] },
      metadata: { ...draft().metadata, metaTitle: "SEO Roadmap Prioritization", metaDescription: "Learn how to prioritize technical fixes, content gaps, and authority building in an SEO roadmap." },
      schema: { ...draft().schema, aboutEntities: ["SEO roadmap"], citationReferences: ["https://developers.google.com/search", "https://example.com/report"] },
      localization: { ...draft().localization, translationStatus: "complete" },
    });
    const groups = analyzeContentIntelligence(article, [article]);
    const items = groups.flatMap((group) => group.items);
    expect(items.find((item) => item.code === "focus-keyword")?.status).toBe("pass");
    expect(items.find((item) => item.code === "body-links")?.status).toBe("pass");
    expect(items.find((item) => item.code === "claims-supported")?.status).toBe("pass");
  });
});

