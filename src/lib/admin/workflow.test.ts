import { describe, expect, it } from "vitest";
import { getPublishedInsights } from "@/lib/insights/content";
import { assertWorkflowDecision, isPublishedSnapshotLive } from "./workflow";
import { createDraftArticle } from "./content-model";

function reviewReadyTranslations() {
  return (["en", "fr", "es"] as const).map((locale) => {
    const { article } = createDraftArticle({ groupId: `group-${locale}`, translationGroupId: "translation", slug: "workflow-ready", category: "seo-guides", locale, author: "Editor" });
    return {
      ...article,
      metadata: { ...article.metadata, metaTitle: "Workflow ready guide", metaDescription: "A complete article prepared for workflow approval." },
      searchStrategy: {
        ...article.searchStrategy,
        focusKeyword: "workflow ready guide",
        coreQuestion: "How do teams approve a blog article?",
        targetAudience: "Content editors",
      },
      coverImageAlt: "Workflow checklist",
      localization: { ...article.localization, translationStatus: "complete" as const },
      blocks: [{ type: "direct-answer" as const, title: "TL;DR", answer: "Approval requires complete translations and no blocking QA errors." }],
    };
  });
}

describe("workflow", () => {
  it("requires the English source localization before approval", () => {
    const translations = reviewReadyTranslations().filter((article) => article.locale === "fr");
    expect(() =>
      assertWorkflowDecision({
        from: "in-review",
        to: "approved",
        role: "admin",
        translations,
      })
    ).toThrow(/missing en/);
  });

  it("allows an English-only article to be approved", () => {
    const translations = reviewReadyTranslations().filter((article) => article.locale === "en");
    expect(() =>
      assertWorkflowDecision({
        from: "in-review",
        to: "approved",
        role: "admin",
        translations,
      })
    ).not.toThrow();
  });

  it("allows Admin approval for complete passing translations", async () => {
    const translations = reviewReadyTranslations();
    expect(() =>
      assertWorkflowDecision({
        from: "in-review",
        to: "approved",
        role: "admin",
        translations,
      })
    ).not.toThrow();
  });

  it("keeps future scheduled content out of live published state", async () => {
    const [article] = await getPublishedInsights("en");
    expect(isPublishedSnapshotLive({ ...article!, scheduledAt: "2999-01-01T00:00:00.000Z" })).toBe(false);
  });
});
