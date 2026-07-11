import { describe, expect, it } from "vitest";
import type { InsightArticle, InsightBlock } from "@/content/insights.types";
import {
  convertMarkdownPipeTableToBlock,
  detectDuplicateFaqProse,
  detectDuplicateOpeningParagraph,
  detectFaqProseRedundancy,
  detectInternalWorkflowPhrases,
  detectMarkdownPipeTableParagraphs,
  detectMetadataLengthWarnings,
  detectSlugWarning,
  detectUnmappedSources,
  normalizeDuplicateFaqHeadings,
  remediateArticleBlocks,
  removeDuplicateFaqProse,
  removeDuplicateOpeningParagraph,
  removeInternalWorkflowPhrases,
  replaceDraftCta,
} from "./core56-hygiene";

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
    schema: {
      schemaType: "Article",
      faqItems: [],
      aboutEntities: [],
      mentions: [],
      citationReferences: [],
    },
    localization: {
      hreflangGroup: "group-999",
      xDefaultSlug: "test-article",
      translationStatus: "complete",
      translationNotes: "",
    },
    publishQa: { summary: "", checkedAt: "" },
    ...overrides,
  };
}

describe("detectDuplicateOpeningParagraph / removeDuplicateOpeningParagraph", () => {
  it("removes a paragraph that exactly duplicates the Direct Answer (after whitespace normalization)", () => {
    const blocks: InsightBlock[] = [
      { type: "direct-answer", title: "Quick answer", answer: "SEO works by matching content to search intent." },
      { type: "paragraph", text: "SEO   works by matching content   to search intent." },
      { type: "paragraph", text: "This is unrelated follow-up content." },
    ];
    const match = detectDuplicateOpeningParagraph(blocks);
    expect(match).toEqual({ directAnswerBlockIndex: 0, duplicateParagraphBlockIndex: 1 });

    const result = removeDuplicateOpeningParagraph(blocks);
    expect(result.changed).toBe(true);
    expect(result.blocks).toHaveLength(2);
    expect(result.blocks[1]).toMatchObject({ type: "paragraph", text: "This is unrelated follow-up content." });
  });

  it("preserves a near-but-not-identical paragraph (adds new information)", () => {
    const blocks: InsightBlock[] = [
      { type: "direct-answer", title: "Quick answer", answer: "SEO works by matching content to search intent." },
      { type: "paragraph", text: "SEO works by matching content to search intent, but ranking also depends on backlinks." },
    ];
    expect(detectDuplicateOpeningParagraph(blocks)).toBeNull();
    const result = removeDuplicateOpeningParagraph(blocks);
    expect(result.changed).toBe(false);
    expect(result.blocks).toEqual(blocks);
  });
});

describe("detectDuplicateFaqProse / removeDuplicateFaqProse", () => {
  it("removes prose Q/A pairs that exactly duplicate the structured FAQ block", () => {
    const blocks: InsightBlock[] = [
      { type: "heading", level: 2, text: "Frequently asked questions" },
      { type: "paragraph", text: "What is SEO?" },
      { type: "paragraph", text: "SEO is search engine optimization." },
      {
        type: "faq",
        items: [{ question: "What is SEO?", answer: "SEO is search engine optimization." }],
      },
    ];
    const match = detectDuplicateFaqProse(blocks);
    expect(match?.fullyDuplicated).toBe(true);
    expect(match?.duplicatedItemCount).toBe(1);

    const result = removeDuplicateFaqProse(blocks);
    expect(result.changed).toBe(true);
    // The lone "Frequently asked questions" heading is kept (it's not a
    // duplicate — it's the real heading for the faq block); only the
    // prose Q/A pair that duplicates the structured block is removed.
    expect(result.blocks).toEqual([
      { type: "heading", level: 2, text: "Frequently asked questions" },
      { type: "faq", items: [{ question: "What is SEO?", answer: "SEO is search engine optimization." }] },
    ]);
  });

  it("preserves non-duplicate FAQ content (question repeated but answer differs)", () => {
    const blocks: InsightBlock[] = [
      { type: "paragraph", text: "What is SEO?" },
      { type: "paragraph", text: "SEO covers a much wider set of practices than the FAQ answer below." },
      { type: "faq", items: [{ question: "What is SEO?", answer: "SEO is search engine optimization." }] },
    ];
    expect(detectDuplicateFaqProse(blocks)).toBeNull();
    const result = removeDuplicateFaqProse(blocks);
    expect(result.changed).toBe(false);
    expect(result.blocks).toEqual(blocks);
  });
});

describe("normalizeDuplicateFaqHeadings", () => {
  it("removes a second duplicate FAQ heading, keeping the first", () => {
    const blocks: InsightBlock[] = [
      { type: "heading", level: 2, text: "Frequently asked questions" },
      { type: "paragraph", text: "Intro." },
      { type: "heading", level: 2, text: "FAQs" },
      { type: "faq", items: [] },
    ];
    const result = normalizeDuplicateFaqHeadings(blocks);
    expect(result.changed).toBe(true);
    expect(result.blocks.filter((b) => b.type === "heading")).toHaveLength(1);
  });
});

describe("detectMarkdownPipeTableParagraphs / convertMarkdownPipeTableToBlock", () => {
  it("converts an unambiguous markdown pipe table stored as a paragraph", () => {
    const blocks: InsightBlock[] = [
      {
        type: "paragraph",
        text: "| Plan | Price |\n| --- | --- |\n| Basic | $10 |\n| Pro | $20 |",
      },
    ];
    const [match] = detectMarkdownPipeTableParagraphs(blocks);
    expect(match.ambiguous).toBe(false);
    expect(match.columns).toEqual(["Plan", "Price"]);
    expect(match.rows).toEqual([["Basic", "$10"], ["Pro", "$20"]]);

    const result = convertMarkdownPipeTableToBlock(blocks);
    expect(result.changed).toBe(true);
    expect(result.blocks[0]).toEqual({ type: "comparison-table", caption: "", columns: ["Plan", "Price"], rows: [["Basic", "$10"], ["Pro", "$20"]] });
  });

  it("blocks conversion of an ambiguous table (inconsistent column counts) and flags it for manual review", () => {
    const blocks: InsightBlock[] = [
      {
        type: "paragraph",
        text: "| Plan | Price |\n| --- | --- |\n| Basic | $10 | extra |",
      },
    ];
    const [match] = detectMarkdownPipeTableParagraphs(blocks);
    expect(match.ambiguous).toBe(true);

    const result = convertMarkdownPipeTableToBlock(blocks);
    expect(result.changed).toBe(false);
    expect(result.blocks).toEqual(blocks);
    expect(result.needsManualReview).toHaveLength(1);
  });

  it("converts a table stored as one paragraph block per row (the real-world Core 56 import shape)", () => {
    const blocks: InsightBlock[] = [
      { type: "heading", level: 2, text: "Intro" },
      { type: "paragraph", text: "| Layer | Question |" },
      { type: "paragraph", text: "|---|---|" },
      { type: "paragraph", text: "| Prompt demand | Which questions matter? |" },
      { type: "paragraph", text: "| Technical eligibility | Can engines fetch the page? |" },
      { type: "paragraph", text: "Unrelated paragraph after the table." },
    ];
    const [match] = detectMarkdownPipeTableParagraphs(blocks);
    expect(match.ambiguous).toBe(false);
    expect(match.blockIndexes).toEqual([1, 2, 3, 4]);

    const result = convertMarkdownPipeTableToBlock(blocks);
    expect(result.changed).toBe(true);
    expect(result.blocks).toEqual([
      { type: "heading", level: 2, text: "Intro" },
      {
        type: "comparison-table",
        caption: "",
        columns: ["Layer", "Question"],
        rows: [["Prompt demand", "Which questions matter?"], ["Technical eligibility", "Can engines fetch the page?"]],
      },
      { type: "paragraph", text: "Unrelated paragraph after the table." },
    ]);
  });
});

describe("detectFaqProseRedundancy", () => {
  it("flags a paragraph that opens with an FAQ question but paraphrases (not exactly repeats) the answer", () => {
    const blocks: InsightBlock[] = [
      { type: "paragraph", text: "Is GEO replacing SEO? No, it extends search onto AI answer surfaces in a slightly different way than the FAQ below states." },
      { type: "faq", items: [{ question: "Is GEO replacing SEO?", answer: "No. GEO extends SEO onto AI answer surfaces." }] },
    ];
    expect(detectFaqProseRedundancy(blocks)).toEqual({ faqBlockIndex: 1, possiblyRedundantParagraphCount: 1 });
  });

  it("returns null when no faq block exists or no paragraph opens with a question", () => {
    expect(detectFaqProseRedundancy([{ type: "paragraph", text: "Nothing FAQ-like here." }])).toBeNull();
  });
});

describe("detectInternalWorkflowPhrases / removeInternalWorkflowPhrases", () => {
  it("strips a sentence containing leaked internal workflow language from a plain paragraph", () => {
    const blocks: InsightBlock[] = [
      { type: "paragraph", text: "This is a Claude-generated draft. Human review required before publish. The rest of this paragraph is fine." },
    ];
    expect(detectInternalWorkflowPhrases(blocks)).toHaveLength(2);

    const result = removeInternalWorkflowPhrases(blocks);
    expect(result.changed).toBe(true);
    expect(result.blocks[0]).toMatchObject({ type: "paragraph", text: "The rest of this paragraph is fine." });
  });

  it("removes a paragraph block entirely when it contains only internal workflow language", () => {
    const blocks: InsightBlock[] = [{ type: "paragraph", text: "Use this article as a working brief." }];
    const result = removeInternalWorkflowPhrases(blocks);
    expect(result.changed).toBe(true);
    expect(result.blocks).toHaveLength(0);
  });

  it("leaves rich-text (marked) paragraphs alone and flags for manual review instead of destroying marks", () => {
    const blocks: InsightBlock[] = [
      { type: "paragraph", text: [{ text: "Human review required before publish, see " }, { text: "our guide", marks: [{ type: "link", href: "/guide" }] }] },
    ];
    const result = removeInternalWorkflowPhrases(blocks);
    expect(result.changed).toBe(false);
    expect(result.blocks).toEqual(blocks);
    expect(result.needsManualReview).toHaveLength(1);
  });
});

describe("detectInternalWorkflowPhrases block-type coverage", () => {
  it("detects a leaked phrase inside a CTA block body (not just paragraphs)", () => {
    const blocks: InsightBlock[] = [
      { type: "cta", title: "Next step", body: "Use this article as a working brief, then validate sources before publishing.", primary: { label: "Learn more", href: "/services/seo-agency" } },
    ];
    expect(detectInternalWorkflowPhrases(blocks)).not.toHaveLength(0);
  });

  it("detects a leaked phrase inside a checklist item", () => {
    const blocks: InsightBlock[] = [{ type: "checklist", title: "Steps", items: [{ label: "Draft", detail: "This is a Claude-generated draft." }] }];
    expect(detectInternalWorkflowPhrases(blocks)).not.toHaveLength(0);
  });
});

describe("replaceDraftCta", () => {
  it("replaces a draft-oriented CTA when a real service link already exists", () => {
    const article = baseArticle({
      blocks: [
        { type: "cta", title: "Working brief", body: "Validate sources before publishing this section.", primary: { label: "TBD", href: "#" } },
      ],
      internalLinking: {
        requiredInternalLinks: [],
        suggestedInternalLinks: [],
        serviceLinks: [{ label: "SEO Services", href: "/services/seo-agency" }],
        industryLinks: [],
        marketLinks: [],
        caseStudyLinks: [],
        sampleAuditLinks: [],
        relatedArticleSlugs: [],
        recommendedAnchors: [],
      },
    });
    const result = replaceDraftCta(article);
    expect(result.changed).toBe(true);
    expect(result.blocks[0]).toMatchObject({ type: "cta", primary: { href: "/services/seo-agency" } });
  });

  it("leaves the CTA and flags manual review when no real link exists to replace it with", () => {
    const article = baseArticle({
      blocks: [{ type: "cta", title: "Working brief", body: "Pending SERP validation.", primary: { label: "TBD", href: "#" } }],
    });
    const result = replaceDraftCta(article);
    expect(result.changed).toBe(false);
    expect(result.needsManualReview).toHaveLength(1);
  });

  it("leaves a normal CTA untouched", () => {
    const article = baseArticle({
      blocks: [{ type: "cta", title: "Ready to grow?", body: "Book a free audit today.", primary: { label: "Book audit", href: "/audit" } }],
    });
    const result = replaceDraftCta(article);
    expect(result.changed).toBe(false);
    expect(result.blocks).toEqual(article.blocks);
  });
});

describe("read-only detectors", () => {
  it("flags sources with no supported claim mapping", () => {
    const article = baseArticle({
      contentEvidence: {
        sources: [
          { id: "src-1", title: "Referenced", publisher: "Pub", url: "https://example.com/a", accessedAt: "2026-01-01", primarySource: false, supportsClaimIds: [], locale: "global" },
          { id: "src-2", title: "Orphan", publisher: "Pub", url: "https://example.com/b", accessedAt: "2026-01-01", primarySource: false, supportsClaimIds: [], locale: "global" },
        ],
        claims: [{ id: "claim-1", text: "A claim.", requiresEvidence: true, sourceIds: ["src-1"] }],
        factCheckStatus: "needs-review",
        originalInsights: [],
        caseStudyReferences: [],
        complianceNotes: [],
      },
    });
    expect(detectUnmappedSources(article)).toEqual([{ sourceId: "src-2", title: "Orphan" }]);
  });

  it("flags overly long meta titles/descriptions and very short meta titles", () => {
    const long = baseArticle({ metadata: { ...baseArticle().metadata, metaTitle: "x".repeat(65), metaDescription: "y".repeat(170) } });
    expect(detectMetadataLengthWarnings(long)).toEqual(
      expect.arrayContaining([
        { field: "metaTitle", length: 65, issue: "too-long" },
        { field: "metaDescription", length: 170, issue: "too-long" },
      ])
    );
    const short = baseArticle({ metadata: { ...baseArticle().metadata, metaTitle: "Short" } });
    expect(detectMetadataLengthWarnings(short)).toEqual([{ field: "metaTitle", length: 5, issue: "too-short" }]);
  });

  it("flags slugs at/above 75 characters as likely truncated", () => {
    const truncated = "a".repeat(74) + "-bx"; // length 78, last segment "bx" (<=3 chars)
    expect(detectSlugWarning(truncated)).toMatchObject({ likelyTruncated: true, likelyMidWordCut: true });
    expect(detectSlugWarning("a-normal-short-slug")).toBeNull();
  });
});

describe("remediateArticleBlocks — composition, identity safety, and idempotency", () => {
  it("fixes multiple defects at once without touching article identity/metadata/factCheckStatus", () => {
    const article = baseArticle({
      slug: "keep-me",
      contentEvidence: { ...baseArticle().contentEvidence, factCheckStatus: "needs-review" },
      blocks: [
        { type: "direct-answer", title: "Quick answer", answer: "Answer text." },
        { type: "paragraph", text: "Answer text." },
        { type: "paragraph", text: "This is a Claude-generated draft." },
        { type: "heading", level: 2, text: "Frequently asked questions" },
        { type: "paragraph", text: "What is X?" },
        { type: "paragraph", text: "X is Y." },
        { type: "faq", items: [{ question: "What is X?", answer: "X is Y." }] },
      ],
    });

    const diff = remediateArticleBlocks(article);
    expect(diff.changed).toBe(true);
    expect(diff.afterBlockCount).toBeLessThan(diff.beforeBlockCount);
    // Identity/metadata fields are simply not part of the diff surface.
    expect(article.slug).toBe("keep-me");
    expect(article.contentEvidence.factCheckStatus).toBe("needs-review");
  });

  it("is idempotent: remediating already-clean output again is a no-op", () => {
    const article = baseArticle({
      blocks: [
        { type: "direct-answer", title: "Quick answer", answer: "Answer text." },
        { type: "paragraph", text: "Answer text." },
      ],
    });
    const first = remediateArticleBlocks(article);
    const second = remediateArticleBlocks({ ...article, blocks: first.blocks });
    expect(second.changed).toBe(false);
    expect(second.blocks).toEqual(first.blocks);
  });

  it("does not touch an already-clean, well-structured article (TC-001/TC-006 style)", () => {
    const article = baseArticle({
      blocks: [
        { type: "direct-answer", title: "Quick answer", answer: "SEO in 2026 blends search and AI." },
        { type: "heading", level: 2, text: "How SEO works today" },
        { type: "paragraph", text: "A fresh paragraph with new information." },
        { type: "comparison-table", caption: "Comparison", columns: ["A", "B"], rows: [["1", "2"]] },
        { type: "faq", items: [{ question: "Is AI search different?", answer: "Yes, it changes discovery." }] },
        { type: "cta", title: "Ready to grow?", body: "Book a free audit today.", primary: { label: "Book audit", href: "/audit" } },
      ],
    });
    const diff = remediateArticleBlocks(article);
    expect(diff.changed).toBe(false);
    expect(diff.blocks).toEqual(article.blocks);
  });
});
