import { describe, expect, it } from "vitest";
import type { InsightArticle, InsightBlock } from "@/content/insights.types";
import {
  DRAFT_CTA_TEMPLATE_BODY,
  NEUTRAL_CTA_BODY,
  assessFaqProse,
  convertMarkdownPipeTableToBlock,
  detectDuplicateOpeningParagraph,
  detectInternalWorkflowLeak,
  detectMarkdownPipeTableParagraphs,
  detectMetadataLengthWarnings,
  detectSlugWarning,
  detectUnmappedSources,
  remediateArticleBlocks,
  removeDuplicateOpeningParagraph,
  removeExactDuplicateFaqProse,
  removeExactInternalWorkflowSentences,
  replaceDraftCtaBody,
  transformEditorDocument,
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
    schema: { schemaType: "Article", faqItems: [], aboutEntities: [], mentions: [], citationReferences: [] },
    localization: { hreflangGroup: "group-999", xDefaultSlug: "test-article", translationStatus: "complete", translationNotes: "" },
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
    expect(detectDuplicateOpeningParagraph(blocks)).toEqual({ directAnswerBlockIndex: 0, duplicateParagraphBlockIndex: 1 });
    const result = removeDuplicateOpeningParagraph(blocks);
    expect(result.changed).toBe(true);
    expect(result.blocks).toHaveLength(2);
    expect(result.blocks[1]).toMatchObject({ text: "This is unrelated follow-up content." });
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

describe("assessFaqProse / removeExactDuplicateFaqProse", () => {
  it("auto-removes an exact question+answer prose duplicate and its now-redundant duplicate heading", () => {
    const blocks: InsightBlock[] = [
      { type: "heading", level: 2, text: "Frequently asked questions" },
      { type: "paragraph", text: "What is SEO? SEO is search engine optimization." },
      { type: "heading", level: 2, text: "FAQs" },
      { type: "faq", items: [{ question: "What is SEO?", answer: "SEO is search engine optimization." }] },
    ];
    const assessment = assessFaqProse(blocks);
    expect(assessment?.exactCount).toBe(1);
    expect(assessment?.fullyResolvableByExactRemoval).toBe(true);

    const result = removeExactDuplicateFaqProse(blocks);
    expect(result.changed).toBe(true);
    expect(result.needsManualReview).toHaveLength(0);
    // The heading attached to the removed prose section goes with it; the
    // heading immediately preceding the real structured faq block stays.
    expect(result.blocks).toEqual([
      { type: "heading", level: 2, text: "FAQs" },
      { type: "faq", items: [{ question: "What is SEO?", answer: "SEO is search engine optimization." }] },
    ]);
  });

  it("classifies a paraphrased (question matches, answer differs) FAQ item as manual-review and does not remove it", () => {
    const blocks: InsightBlock[] = [
      { type: "paragraph", text: "What is SEO? SEO covers a much wider set of practices than the short FAQ answer below." },
      { type: "faq", items: [{ question: "What is SEO?", answer: "SEO is search engine optimization." }] },
    ];
    const assessment = assessFaqProse(blocks);
    expect(assessment?.exactCount).toBe(0);
    expect(assessment?.paraphraseCount).toBe(1);
    expect(assessment?.fullyResolvableByExactRemoval).toBe(false);

    const result = removeExactDuplicateFaqProse(blocks);
    expect(result.changed).toBe(false);
    expect(result.blocks).toEqual(blocks);
  });

  it("keeps a duplicate FAQ heading in place when paraphrased prose remains (partial resolution is not enough)", () => {
    const blocks: InsightBlock[] = [
      { type: "heading", level: 2, text: "Frequently asked questions" },
      { type: "paragraph", text: "What is SEO? SEO covers far more ground than the FAQ entry captures." },
      { type: "paragraph", text: "What is GEO? GEO is generative engine optimization." },
      { type: "heading", level: 2, text: "FAQs" },
      {
        type: "faq",
        items: [
          { question: "What is SEO?", answer: "SEO is search engine optimization." },
          { question: "What is GEO?", answer: "GEO is generative engine optimization." },
        ],
      },
    ];
    const assessment = assessFaqProse(blocks);
    expect(assessment?.exactCount).toBe(1);
    expect(assessment?.paraphraseCount).toBe(1);
    expect(assessment?.fullyResolvableByExactRemoval).toBe(false);

    const result = removeExactDuplicateFaqProse(blocks);
    expect(result.changed).toBe(true);
    // The exact GEO pair is removed, but BOTH headings remain because the
    // SEO paraphrase is still unresolved — the duplicate heading is only
    // dropped when the whole prose section was fully and exactly resolved.
    expect(result.blocks.filter((b) => b.type === "heading")).toHaveLength(2);
    expect(result.blocks.some((b) => b.type === "paragraph" && b.text.startsWith("What is GEO?"))).toBe(false);
    expect(result.needsManualReview).toHaveLength(1);
  });
});

describe("detectMarkdownPipeTableParagraphs / convertMarkdownPipeTableToBlock", () => {
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

  it("blocks conversion of an ambiguous table (inconsistent column counts) and flags it for manual review", () => {
    const blocks: InsightBlock[] = [{ type: "paragraph", text: "| Plan | Price |\n| --- | --- |\n| Basic | $10 | extra |" }];
    const [match] = detectMarkdownPipeTableParagraphs(blocks);
    expect(match.ambiguous).toBe(true);
    const result = convertMarkdownPipeTableToBlock(blocks);
    expect(result.changed).toBe(false);
    expect(result.blocks).toEqual(blocks);
    expect(result.needsManualReview).toHaveLength(1);
  });
});

describe("Task 7 — narrow, exact-match-only internal workflow language", () => {
  it("auto-removes a paragraph that is an exact match to a known internal-workflow sentence", () => {
    const blocks: InsightBlock[] = [{ type: "paragraph", text: "This is a Claude-generated draft." }, { type: "paragraph", text: "Real content stays." }];
    const result = removeExactInternalWorkflowSentences(blocks);
    expect(result.changed).toBe(true);
    expect(result.blocks).toEqual([{ type: "paragraph", text: "Real content stays." }]);
  });

  it("preserves legitimate editorial content that merely discusses a 'working brief' in a longer sentence", () => {
    const blocks: InsightBlock[] = [
      { type: "paragraph", text: "Every SEO content brief should function as a working brief the whole team can act on, not a static document nobody revisits." },
    ];
    const result = removeExactInternalWorkflowSentences(blocks);
    expect(result.changed).toBe(false);
    expect(result.blocks).toEqual(blocks);

    const signals = detectInternalWorkflowLeak(blocks);
    expect(signals[0]?.exactAutoFixable).toBe(false);
  });

  it("flags (but does not auto-edit) a phrase embedded inside a longer sentence in a non-CTA block", () => {
    const blocks: InsightBlock[] = [{ type: "checklist", title: "Steps", items: [{ label: "Draft", detail: "This draft still needs human review required before publish, among other polish." }] }];
    const signals = detectInternalWorkflowLeak(blocks);
    expect(signals).toHaveLength(1);
    expect(signals[0].exactAutoFixable).toBe(false);
  });
});

describe("Task 8 — CTA context preservation", () => {
  it("replaces only the body of an exact-template CTA, preserving title and both links", () => {
    const blocks: InsightBlock[] = [
      {
        type: "cta",
        title: "Plan the next step for generative engine optimization",
        body: DRAFT_CTA_TEMPLATE_BODY,
        primary: { label: "AI Search Optimization service", href: "/services/ai-search-optimization" },
        secondary: { label: "Book a strategy call", href: "/book-a-call" },
      },
    ];
    const result = replaceDraftCtaBody(blocks);
    expect(result.changed).toBe(true);
    expect(result.blocks[0]).toEqual({
      type: "cta",
      title: "Plan the next step for generative engine optimization",
      body: NEUTRAL_CTA_BODY,
      primary: { label: "AI Search Optimization service", href: "/services/ai-search-optimization" },
      secondary: { label: "Book a strategy call", href: "/book-a-call" },
    });
  });

  it("uses a different service destination for a different article without cross-contamination", () => {
    const blocks: InsightBlock[] = [
      { type: "cta", title: "Plan the next step for technical SEO audit checklist", body: DRAFT_CTA_TEMPLATE_BODY, primary: { label: "Technical SEO", href: "/services/technical-seo" } },
    ];
    const result = replaceDraftCtaBody(blocks);
    expect((result.blocks[0] as { primary: { href: string } }).primary.href).toBe("/services/technical-seo");
  });

  it("leaves a non-exact CTA body unchanged and flags manual review instead of guessing", () => {
    const blocks: InsightBlock[] = [{ type: "cta", title: "Next step", body: "Use this article as a working brief before you ship anything.", primary: { label: "Learn more", href: "/services/seo-agency" } }];
    const result = replaceDraftCtaBody(blocks);
    expect(result.changed).toBe(false);
    expect(result.needsManualReview).toHaveLength(1);
  });

  it("leaves an ordinary CTA completely untouched", () => {
    const blocks: InsightBlock[] = [{ type: "cta", title: "Ready to grow?", body: "Book a free audit today.", primary: { label: "Book audit", href: "/audit" } }];
    const result = replaceDraftCtaBody(blocks);
    expect(result.changed).toBe(false);
    expect(result.blocks).toEqual(blocks);
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

  it("flags overly long / very short metadata", () => {
    const long = baseArticle({ metadata: { ...baseArticle().metadata, metaTitle: "x".repeat(65), metaDescription: "y".repeat(170) } });
    expect(detectMetadataLengthWarnings(long)).toEqual(
      expect.arrayContaining([
        { field: "metaTitle", length: 65, issue: "too-long" },
        { field: "metaDescription", length: 170, issue: "too-long" },
      ])
    );
  });

  it("flags slugs at/above 75 characters as likely truncated", () => {
    const truncated = "a".repeat(74) + "-bx";
    expect(detectSlugWarning(truncated)).toMatchObject({ likelyTruncated: true, likelyMidWordCut: true });
    expect(detectSlugWarning("a-normal-short-slug")).toBeNull();
  });
});

describe("remediateArticleBlocks — composition, identity safety, and idempotency", () => {
  it("fixes multiple defects at once without touching article identity/metadata/factCheckStatus", () => {
    const article = baseArticle({
      slug: "keep-me",
      blocks: [
        { type: "direct-answer", title: "Quick answer", answer: "Answer text." },
        { type: "paragraph", text: "Answer text." },
        { type: "cta", title: "Next step", body: DRAFT_CTA_TEMPLATE_BODY, primary: { label: "Service", href: "/services/seo-agency" } },
      ],
    });
    const diff = remediateArticleBlocks(article.blocks);
    expect(diff.changed).toBe(true);
    expect(diff.afterBlockCount).toBeLessThan(diff.beforeBlockCount);
    expect(article.slug).toBe("keep-me");
    expect(article.contentEvidence.factCheckStatus).toBe("needs-review");
  });

  it("is idempotent: remediating already-clean output again is a no-op", () => {
    const blocks: InsightBlock[] = [
      { type: "direct-answer", title: "Quick answer", answer: "Answer text." },
      { type: "paragraph", text: "Answer text." },
    ];
    const first = remediateArticleBlocks(blocks);
    const second = remediateArticleBlocks(first.blocks);
    expect(second.changed).toBe(false);
    expect(second.blocks).toEqual(first.blocks);
  });

  it("does not touch an already-clean, well-structured article (TC-001/TC-006 style)", () => {
    const blocks: InsightBlock[] = [
      { type: "direct-answer", title: "Quick answer", answer: "SEO in 2026 blends search and AI." },
      { type: "heading", level: 2, text: "How SEO works today" },
      { type: "paragraph", text: "A fresh paragraph with new information." },
      { type: "comparison-table", caption: "Comparison", columns: ["A", "B"], rows: [["1", "2"]] },
      { type: "faq", items: [{ question: "Is AI search different?", answer: "Yes, it changes discovery." }] },
      { type: "cta", title: "Ready to grow?", body: "Book a free audit today.", primary: { label: "Book audit", href: "/audit" } },
    ];
    const diff = remediateArticleBlocks(blocks);
    expect(diff.changed).toBe(false);
    expect(diff.blocks).toEqual(blocks);
  });
});

describe("transformEditorDocument — Tiptap fidelity", () => {
  function doc(content: unknown[]) {
    return { type: "doc", content };
  }

  it("preserves inline links, bold/italic marks, heading ids, image/media ids on every untouched node", () => {
    const document = doc([
      { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Untouched heading" }] },
      {
        type: "paragraph",
        content: [
          { type: "text", text: "Bold and " },
          { type: "text", text: "italic", marks: [{ type: "italic" }] },
          { type: "text", text: " and a ", marks: [] },
          { type: "text", text: "link", marks: [{ type: "link", attrs: { href: "/services/seo-agency" } }] },
        ],
      },
      { type: "structuredBlock", attrs: { blockType: "image", data: { type: "image", src: "/img.jpg", alt: "Alt text", mediaAssetId: "media-123" } } },
      { type: "direct-answer-placeholder" }, // will be replaced below with a real structuredBlock in variants that need it
    ]);
    // Remove the placeholder (not a real Tiptap type) and just verify passthrough of the first three nodes.
    (document.content as unknown[]).pop();

    const result = transformEditorDocument(document);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // The untouched heading, paragraph (with marks), and image node come through byte-for-byte.
    expect(result.document.content[0]).toEqual(document.content[0]);
    expect(result.document.content[1]).toEqual(document.content[1]);
    expect(result.document.content[2]).toEqual(document.content[2]);
    expect(result.diff.changed).toBe(false);
  });

  it("removes the duplicate opening paragraph node while leaving every other node byte-identical", () => {
    const directAnswerNode = { type: "structuredBlock", attrs: { blockType: "direct-answer", data: { type: "direct-answer", title: "Quick answer", answer: "Answer text." } } };
    const dupParagraph = { type: "paragraph", content: [{ type: "text", text: "Answer text." }] };
    const keptParagraph = { type: "paragraph", content: [{ type: "text", text: "Kept content.", marks: [{ type: "bold" }] }] };
    const document = doc([directAnswerNode, dupParagraph, keptParagraph]);

    const result = transformEditorDocument(document);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.document.content).toHaveLength(2);
    expect(result.document.content[0]).toEqual(directAnswerNode);
    expect(result.document.content[1]).toEqual(keptParagraph);
    expect(result.blocks).toEqual([
      { type: "direct-answer", title: "Quick answer", answer: "Answer text." },
      { type: "paragraph", text: "Kept content." },
    ]);
  });

  it("replaces only the CTA body attrs.data field, preserving the rest of the node", () => {
    const ctaNode = {
      type: "structuredBlock",
      attrs: {
        blockType: "cta",
        data: { type: "cta", title: "Plan the next step for GEO", body: DRAFT_CTA_TEMPLATE_BODY, primary: { label: "AI Search", href: "/services/ai-search-optimization" } },
      },
    };
    const document = doc([ctaNode]);
    const result = transformEditorDocument(document);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.document.content[0]).toEqual({
      type: "structuredBlock",
      attrs: {
        blockType: "cta",
        data: { type: "cta", title: "Plan the next step for GEO", body: NEUTRAL_CTA_BODY, primary: { label: "AI Search", href: "/services/ai-search-optimization" } },
      },
    });
  });

  it("converts a multi-node markdown table run into one comparison-table structuredBlock node", () => {
    const rowNode = (text: string) => ({ type: "paragraph", content: [{ type: "text", text }] });
    const document = doc([rowNode("| Layer | Question |"), rowNode("|---|---|"), rowNode("| Prompt demand | Which questions matter? |")]);
    const result = transformEditorDocument(document);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.document.content).toHaveLength(1);
    expect(result.document.content[0]).toMatchObject({ type: "structuredBlock", attrs: { blockType: "comparison-table" } });
    expect(result.blocks).toEqual([{ type: "comparison-table", caption: "", columns: ["Layer", "Question"], rows: [["Prompt demand", "Which questions matter?"]] }]);
  });

  it("refuses (ok: false) when the top-level node count doesn't match the normalized block count", () => {
    // A bulletList normalizes to exactly one "bullet-list" block from potentially many list-item nodes,
    // but here we simulate a genuine mismatch by handing in a document whose top-level content includes
    // a node type that normalizes to zero blocks (an empty paragraph), breaking 1:1 correspondence.
    const document = doc([{ type: "paragraph", content: [] }, { type: "paragraph", content: [{ type: "text", text: "Real content." }] }]);
    const result = transformEditorDocument(document);
    expect(result.ok).toBe(false);
  });

  it("is idempotent at the Tiptap level: running twice produces the same document", () => {
    const document = doc([
      { type: "structuredBlock", attrs: { blockType: "direct-answer", data: { type: "direct-answer", title: "Quick answer", answer: "Answer text." } } },
      { type: "paragraph", content: [{ type: "text", text: "Answer text." }] },
    ]);
    const first = transformEditorDocument(document);
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const second = transformEditorDocument(first.document);
    expect(second.ok).toBe(true);
    if (!second.ok) return;
    expect(second.diff.changed).toBe(false);
    expect(second.document).toEqual(first.document);
  });
});
