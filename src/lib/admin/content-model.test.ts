import { describe, expect, it } from "vitest";
import { createDraftArticle, materializePublishedSnapshot } from "./content-model";

describe("Admin content model", () => {
  it("creates validated locale-specific drafts without public state", () => {
    const value = createDraftArticle({ groupId: "group", translationGroupId: "translation", slug: "qa-draft", category: "seo-guides", locale: "fr", author: "Editor", now: new Date("2026-07-10T00:00:00.000Z") });
    expect(value.article.status).toBe("draft");
    expect(value.article.metadata.canonical).toBe("/fr/insights/seo-guides/qa-draft");
    expect(value.article.blocks.length).toBeGreaterThan(0);
  });

  it("materializes a new immutable published value without mutating the draft", () => {
    const { article } = createDraftArticle({ groupId: "group", translationGroupId: "translation", slug: "qa-draft", category: "seo-guides", locale: "en", author: "Editor" });
    const published = materializePublishedSnapshot(article, new Date("2026-07-10T01:00:00.000Z"));
    expect(published.status).toBe("published");
    expect(article.status).toBe("draft");
    expect(published).not.toBe(article);
  });
});

