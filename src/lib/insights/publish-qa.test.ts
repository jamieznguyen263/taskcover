import { describe, expect, it } from "vitest";
import type { InsightArticle } from "@/content/insights.types";
import { createDraftArticle } from "@/lib/admin/content-model";
import { validateInsightArticle } from "./publish-qa";

function localizedDrafts(): InsightArticle[] {
  return (["en", "fr", "es"] as const).map(
    (locale) =>
      createDraftArticle({ groupId: "group", translationGroupId: "translation", slug: "qa-test", category: "seo-guides", locale, author: "Editor" }).article
  );
}

function publishable(): InsightArticle[] {
  return localizedDrafts().map((article) => ({
    ...article,
    metadata: { ...article.metadata, metaTitle: "A good title", metaDescription: "A description that says what the reader learns." },
    searchStrategy: {
      ...article.searchStrategy,
      focusKeyword: "seo guide",
      coreQuestion: "How do you build an SEO guide?",
      targetAudience: "Marketing leaders",
    },
    coverImageAlt: "Cover alt",
    localization: { ...article.localization, translationStatus: "complete" as const },
    blocks: [{ type: "direct-answer" as const, title: "TL;DR", answer: "Yes." }, { type: "paragraph" as const, text: "Body." }],
    internalLinking: { ...article.internalLinking, serviceLinks: [{ label: "SEO services", href: "/services/seo" }] },
  }));
}

describe("Publish QA", () => {
  it("passes a complete article and includes the publishable check", () => {
    const [article, ...rest] = publishable();
    const results = validateInsightArticle(article, [article, ...rest]);
    expect(results.filter((result) => result.severity === "error")).toEqual([]);
    expect(results.some((result) => result.code === "publishable")).toBe(true);
  });

  it("attaches group, section, and remediation metadata to failures", () => {
    const [article, ...rest] = localizedDrafts();
    const results = validateInsightArticle(article, [article, ...rest]);
    const metaTitle = results.find((result) => result.code === "missing-meta-title");
    expect(metaTitle?.group).toBe("metadata");
    expect(metaTitle?.section).toBe("metadata");
    expect(metaTitle?.remediation).toBeTruthy();
  });

  it("accepts locale-prefixed canonicals", () => {
    const drafts = publishable();
    const fr = drafts.find((article) => article.locale === "fr")!;
    expect(fr.metadata.canonical).toBe("/fr/insights/seo-guides/qa-test");
    const results = validateInsightArticle(fr, drafts);
    expect(results.some((result) => result.code === "invalid-canonical")).toBe(false);
  });

  it("blocks FAQ schema mismatches", () => {
    const drafts = publishable();
    const article = { ...drafts[0], schema: { ...drafts[0].schema, faqItems: [{ question: "Q", answer: "A" }] } };
    const results = validateInsightArticle(article, drafts);
    expect(results.some((result) => result.code === "faq-schema-mismatch" && result.severity === "error")).toBe(true);
  });

  it("warns when translations are incomplete, internal links are absent, or a direct answer is missing", () => {
    const drafts = localizedDrafts();
    const results = validateInsightArticle(drafts[0], drafts);
    expect(results.some((result) => result.code === "translation-needs-review" && result.severity === "warning")).toBe(true);
    expect(results.some((result) => result.code === "no-internal-links" && result.severity === "warning")).toBe(true);
    expect(results.some((result) => result.code === "geo-direct-answer" && result.severity === "warning")).toBe(true);
  });

  it("blocks image blocks that are missing alt text", () => {
    const drafts = publishable();
    const article = { ...drafts[0], blocks: [...drafts[0].blocks, { type: "image" as const, src: "https://res.cloudinary.com/x/image/upload/a.jpg", alt: "" }] };
    const results = validateInsightArticle(article, drafts);
    expect(results.some((result) => result.code === "image-missing-alt" && result.severity === "error")).toBe(true);

    const withAlt = { ...article, blocks: [...drafts[0].blocks, { type: "image" as const, src: "https://res.cloudinary.com/x/image/upload/a.jpg", alt: "A chart" }] };
    expect(validateInsightArticle(withAlt, drafts).some((result) => result.code === "image-missing-alt")).toBe(false);
  });

  it("blocks claims that require evidence but have none", () => {
    const drafts = publishable();
    const article = {
      ...drafts[0],
      contentEvidence: { ...drafts[0].contentEvidence, claims: [{ id: "c1", text: "Claim", requiresEvidence: true, sourceIds: [] }] },
    };
    const results = validateInsightArticle(article, drafts);
    expect(results.some((result) => result.code === "claim-without-evidence" && result.severity === "error")).toBe(true);
  });

  it("allows a complete English article without placeholder translations", () => {
    const [article] = publishable();
    const results = validateInsightArticle(article, [article]);
    expect(results.filter((result) => result.severity === "error")).toEqual([]);
    expect(results.some((result) => result.code === "publishable")).toBe(true);
  });

  it("blocks required internal links that are planned but not placed in the body", () => {
    const drafts = publishable();
    const article = {
      ...drafts[0],
      internalLinking: { ...drafts[0].internalLinking, requiredInternalLinks: [{ label: "SEO services", href: "/services/seo-agency" }] },
    };
    const results = validateInsightArticle(article, drafts);
    expect(results.some((result) => result.code === "required-links-missing-from-body" && result.severity === "error")).toBe(true);

    const withBodyLink = {
      ...article,
      blocks: [{ type: "paragraph" as const, text: [{ text: "SEO services", marks: [{ type: "link" as const, href: "/services/seo-agency" }] }] }],
    };
    expect(validateInsightArticle(withBodyLink, drafts).some((result) => result.code === "required-links-missing-from-body")).toBe(false);
  });
});
