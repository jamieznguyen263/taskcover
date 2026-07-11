import { describe, expect, it } from "vitest";
import type { InsightArticle, InsightBlock } from "@/content/insights.types";
import { createDraftArticle } from "./content-model";
import { analyzeAnswerability, analyzeCitationReadiness, analyzeEntityCoverage, computeReadingTime } from "./geo-analysis";

function draft(overrides: Partial<InsightArticle> = {}): InsightArticle {
  const { article } = createDraftArticle({ groupId: "group", translationGroupId: "translation", slug: "geo-test", category: "seo-guides", locale: "en", author: "Editor" });
  return { ...article, ...overrides };
}

describe("reading time", () => {
  it("estimates at least 1 minute and scales with word count", () => {
    expect(computeReadingTime([{ type: "paragraph", text: "one two three" }])).toBe(1);
    const long = "word ".repeat(660).trim();
    expect(computeReadingTime([{ type: "paragraph", text: long }])).toBe(3);
    expect(computeReadingTime([])).toBe(1);
  });
});

describe("GEO answerability", () => {
  it("flags a missing direct answer and detects one near the top", () => {
    const missing = analyzeAnswerability(draft()).find((check) => check.code === "direct-answer");
    expect(missing?.state).toBe("missing");

    const blocks: InsightBlock[] = [{ type: "direct-answer", title: "TL;DR", answer: "Yes." }, { type: "paragraph", text: "More." }];
    const present = analyzeAnswerability(draft({ blocks })).find((check) => check.code === "direct-answer");
    expect(present?.state).toBe("present");

    const late: InsightBlock[] = [
      { type: "paragraph", text: "a" },
      { type: "paragraph", text: "b" },
      { type: "paragraph", text: "c" },
      { type: "direct-answer", title: "TL;DR", answer: "Late." },
    ];
    expect(analyzeAnswerability(draft({ blocks: late })).find((check) => check.code === "direct-answer")?.state).toBe("attention");
  });

  it("counts question-based headings", () => {
    const blocks: InsightBlock[] = [{ type: "heading", level: 2, text: "How does hreflang work?" }];
    expect(analyzeAnswerability(draft({ blocks })).find((check) => check.code === "question-headings")?.state).toBe("present");
  });
});

describe("GEO entity coverage", () => {
  it("classifies entities as present, missing, or excluded", () => {
    const article = draft({
      blocks: [{ type: "paragraph", text: "We cover hreflang in depth." }],
      searchStrategy: {
        ...draft().searchStrategy,
        primaryEntity: "hreflang",
        supportingEntities: ["Google Search Console", "canonical tags"],
        excludedEntities: ["canonical tags"],
      },
    });
    const coverage = analyzeEntityCoverage(article);
    expect(coverage.find((entity) => entity.name === "hreflang")?.state).toBe("present");
    expect(coverage.find((entity) => entity.name === "Google Search Console")?.state).toBe("missing");
    expect(coverage.find((entity) => entity.name === "canonical tags")?.state).toBe("excluded");
  });
});

describe("GEO citation readiness", () => {
  it("finds unsupported claims, first-party-only claims, and unverified statistics", () => {
    const article = draft({
      blocks: [{ type: "statistic", value: "38%", label: "growth", sourceId: "missing-source" }],
      contentEvidence: {
        ...draft().contentEvidence,
        sources: [
          { id: "s1", title: "Own study", publisher: "Taskcover", url: "https://taskcover.com/study", accessedAt: "2026-07-01", primarySource: true, supportsClaimIds: [], locale: "global" },
          { id: "s2", title: "Independent report", publisher: "Statista", url: "https://example.com/r", accessedAt: "2026-07-01", primarySource: false, supportsClaimIds: [], locale: "global" },
        ],
        claims: [
          { id: "c1", text: "Unsupported claim", requiresEvidence: true, sourceIds: [] },
          { id: "c2", text: "First-party claim", requiresEvidence: true, sourceIds: ["s1"] },
          { id: "c3", text: "Independent claim", requiresEvidence: true, sourceIds: ["s2"] },
        ],
      },
    });
    const readiness = analyzeCitationReadiness(article);
    expect(readiness.claimsWithoutEvidence.map((claim) => claim.id)).toEqual(["c1"]);
    expect(readiness.claimsFirstPartyOnly.map((claim) => claim.id)).toEqual(["c2"]);
    expect(readiness.claimsIndependentlySupported).toBe(1);
    expect(readiness.unverifiedStatistics).toEqual(["38% growth"]);
    expect(readiness.sourcesMissingDate).toEqual(["Own study", "Independent report"]);
  });
});
