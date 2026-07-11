import { describe, expect, it } from "vitest";
import type { InsightArticle, InsightBlock } from "../src/content/insights.types";
import { classifyArticle, parseArgs, resolveWriteAuthorization } from "./insights-remediate-core56";

function baseArticle(overrides: Partial<InsightArticle> = {}): InsightArticle {
  return {
    id: "core56-tc-999",
    slug: "test-article",
    translationGroupId: "group-999",
    locale: "en",
    internalTitle: "Test article",
    h1: "Test article",
    excerpt: "Excerpt.",
    category: "seo-guides",
    tags: [],
    author: "Taskcover Editorial",
    status: "published",
    publishedAt: "2026-07-11T00:00:00.000Z",
    updatedAt: "2026-07-11T00:00:00.000Z",
    lastFactCheckedAt: "2026-07-11T00:00:00.000Z",
    readingTime: 5,
    coverImage: "/images/cover.jpg",
    coverImageAlt: "Cover",
    coverImageCaption: "",
    blocks: [],
    searchStrategy: {
      focusKeyword: "test keyword",
      secondaryKeywords: [],
      primaryIntent: "informational",
      secondaryIntents: [],
      targetAudience: "SEO managers",
      funnelStage: "awareness",
      coreQuestion: "What is the test?",
      primaryEntity: "Test",
      supportingEntities: [],
      topicCluster: "Testing",
      parentPillar: "Testing",
      targetMarkets: [],
      serpObservations: [],
      featuredSnippetOpportunity: "",
      aiCitationOpportunity: "",
      uniqueInformationGain: "",
      refreshTrigger: "",
    },
    contentEvidence: {
      sources: [],
      claims: [],
      factCheckStatus: "needs-review",
      originalInsights: [],
      caseStudyReferences: [],
      complianceNotes: [],
    },
    internalLinking: {
      requiredInternalLinks: [],
      suggestedInternalLinks: [],
      serviceLinks: [],
      industryLinks: [],
      marketLinks: [],
      caseStudyLinks: [],
      sampleAuditLinks: [],
      relatedArticleSlugs: [],
      recommendedAnchors: [],
    },
    metadata: {
      metaTitle: "Test article meta title",
      metaDescription: "Test article meta description.",
      canonical: "/insights/seo-guides/test-article",
      robots: "index,follow",
      ogTitle: "Test article",
      ogDescription: "Test article.",
      ogImage: "/images/cover.jpg",
      twitterTitle: "Test article",
      twitterDescription: "Test article.",
      twitterImage: "/images/cover.jpg",
      breadcrumbLabel: "Test article",
    },
    schema: { schemaType: "Article", faqItems: [], aboutEntities: [], mentions: [], citationReferences: [] },
    localization: { hreflangGroup: "group-999", xDefaultSlug: "test-article", translationStatus: "complete", translationNotes: "" },
    publishQa: { summary: "", checkedAt: "" },
    ...overrides,
  };
}

describe("parseArgs", () => {
  it("defaults to dry-run with no flags", () => {
    expect(parseArgs([])).toEqual({ write: false });
  });

  it("parses --write, --target, --confirm-staging-host, --ids, --limit", () => {
    expect(
      parseArgs(["--write", "--target=staging", "--confirm-staging-host=ep-raspy-mud", "--ids=tc-001,tc-002", "--limit=5"])
    ).toEqual({
      write: true,
      target: "staging",
      confirmStagingHost: "ep-raspy-mud",
      ids: ["TC-001", "TC-002"],
      limit: 5,
    });
  });

  it("a later --dry-run overrides an earlier --write", () => {
    expect(parseArgs(["--write", "--dry-run"]).write).toBe(false);
  });
});

describe("resolveWriteAuthorization", () => {
  it("refuses by default (dry-run, no --write)", () => {
    const result = resolveWriteAuthorization({ databaseTargetEnv: "staging", args: { write: false }, resolvedHost: "ep-raspy-mud.example.neon.tech" });
    expect(result.authorized).toBe(false);
  });

  it("refuses production outright even with --write", () => {
    const result = resolveWriteAuthorization({
      databaseTargetEnv: "production",
      args: { write: true, target: "production", confirmStagingHost: "prod" },
      resolvedHost: "ep-young-frost.example.neon.tech",
    });
    expect(result.authorized).toBe(false);
    if (!result.authorized) expect(result.reason).toMatch(/production/i);
  });

  it("refuses when DATABASE_TARGET and --target disagree", () => {
    const result = resolveWriteAuthorization({
      databaseTargetEnv: "development",
      args: { write: true, target: "staging", confirmStagingHost: "ep-raspy-mud" },
      resolvedHost: "ep-raspy-mud.example.neon.tech",
    });
    expect(result.authorized).toBe(false);
  });

  it("refuses when --confirm-staging-host does not match the resolved DB host (the exact .env.local ambiguity found in orientation)", () => {
    const result = resolveWriteAuthorization({
      databaseTargetEnv: "staging",
      args: { write: true, target: "staging", confirmStagingHost: "ep-raspy-mud" },
      resolvedHost: "ep-young-frost.example.neon.tech", // actually the production host
    });
    expect(result.authorized).toBe(false);
    if (!result.authorized) expect(result.reason).toMatch(/does not match/i);
  });

  it("authorizes only when every gate agrees on staging", () => {
    const result = resolveWriteAuthorization({
      databaseTargetEnv: "staging",
      args: { write: true, target: "staging", confirmStagingHost: "ep-raspy-mud" },
      resolvedHost: "ep-raspy-mud-atfoy40p.us-east-1.aws.neon.tech",
    });
    expect(result.authorized).toBe(true);
  });
});

describe("classifyArticle", () => {
  it("classifies hard-stop IDs as hard-stop regardless of content", () => {
    const article = baseArticle({ id: "core56-tc-027" });
    const plan = classifyArticle("TC-027", "published", "group-1", article);
    expect(plan.status).toBe("hard-stop");
  });

  it("classifies archived articles as archived (never auto-written)", () => {
    const article = baseArticle();
    const plan = classifyArticle("TC-010", "archived", "group-1", article);
    expect(plan.status).toBe("archived");
  });

  it("classifies a missing article", () => {
    const plan = classifyArticle("TC-010", null, null, null);
    expect(plan.status).toBe("missing");
  });

  it("classifies an article with only safe, unambiguous fixes as auto-write", () => {
    const blocks: InsightBlock[] = [
      { type: "direct-answer", title: "Quick answer", answer: "Answer text." },
      { type: "paragraph", text: "Answer text." },
    ];
    const plan = classifyArticle("TC-010", "published", "group-1", baseArticle({ blocks }));
    expect(plan.status).toBe("auto-write");
    expect(plan.diff?.changed).toBe(true);
  });

  it("classifies an article with any ambiguous defect as manual-review, even if other blocks are auto-fixable", () => {
    const blocks: InsightBlock[] = [
      { type: "direct-answer", title: "Quick answer", answer: "Answer text." },
      { type: "paragraph", text: "Answer text." }, // safe duplicate removal
      { type: "paragraph", text: "| A | B |\n| --- | --- |\n| 1 | 2 | 3 |" }, // ambiguous table
    ];
    const plan = classifyArticle("TC-010", "published", "group-1", baseArticle({ blocks }));
    expect(plan.status).toBe("manual-review");
  });

  it("classifies an unchanged, already-clean article as no-change", () => {
    const blocks: InsightBlock[] = [{ type: "paragraph", text: "Nothing to fix here." }];
    const plan = classifyArticle("TC-001", "published", "group-1", baseArticle({ blocks }));
    expect(plan.status).toBe("no-change");
  });
});
