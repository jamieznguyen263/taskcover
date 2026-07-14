import { describe, expect, it } from "vitest";
import { STRUCTURED_BLOCK_NODE } from "./normalization";
import { contentImportPayloadSchema, prepareContentImport } from "./content-import";

const payload = {
  schemaVersion: 1,
  creationKey: "11111111-1111-4111-8111-111111111111",
  sharedSlug: "generative-engine-optimization-guide",
  category: "ai-search",
  author: "Taskcover Editorial Team",
  publicationLocales: ["en"],
  localizations: {
    en: {
      editorDocument: {
        type: "doc",
        content: [
          {
            type: STRUCTURED_BLOCK_NODE,
            attrs: {
              blockType: "direct-answer",
              data: { type: "direct-answer", title: "Direct answer", answer: "GEO improves how content can be understood and cited by AI answer systems." },
            },
          },
          { type: "paragraph", content: [{ type: "text", text: "The body explains the process." }] },
        ],
      },
      article: {
        internalTitle: "TC-007 — GEO practical guide",
        h1: "Generative Engine Optimization: A Practical Guide",
        excerpt: "A practical framework for improving visibility across AI-assisted discovery.",
        coverImageAlt: "Generative engine optimization framework",
        searchStrategy: {
          focusKeyword: "generative engine optimization",
          coreQuestion: "How does generative engine optimization work?",
          targetMarkets: ["United States", "Canada", "Australia"],
        },
        metadata: {
          metaTitle: "Generative Engine Optimization Guide",
          metaDescription: "Learn how generative engine optimization improves content structure, evidence, entities, and visibility across AI-assisted discovery.",
        },
        localization: { translationStatus: "complete" },
        internalLinking: {
          serviceLinks: [{ label: "AI search optimization", href: "/services/ai-search-optimization" }],
        },
      },
    },
  },
} as const;

describe("structured draft content import", () => {
  it("builds an English-only editor-native draft and derives blocks from Tiptap", () => {
    const prepared = prepareContentImport(payload, {
      groupId: "group-id",
      translationGroupId: "translation-id",
      now: new Date("2026-07-11T00:00:00.000Z"),
    });

    expect(prepared.payload.publicationLocales).toEqual(["en"]);
    expect(prepared.localizations).toHaveLength(1);
    const en = prepared.localizations[0]!;
    expect(en.article.id).toBe("group-id");
    expect(en.article.translationGroupId).toBe("translation-id");
    expect(en.article.status).toBe("draft");
    expect(en.article.blocks[0]?.type).toBe("direct-answer");
    expect(en.article.readingTime).toBeGreaterThanOrEqual(1);
    expect(en.article.searchStrategy.focusKeyword).toBe("generative engine optimization");
    expect(en.article.metadata.canonical).toBe("/insights/ai-search/generative-engine-optimization-guide");
    expect(en.qa.some((result) => result.code === "missing-translation")).toBe(false);
  });

  it("rejects localization payloads outside the atomic publication set", () => {
    expect(() => contentImportPayloadSchema.parse({
      ...payload,
      localizations: {
        ...payload.localizations,
        fr: payload.localizations.en,
      },
    })).toThrow(/publicationLocales/);
  });

  it("rejects duplicate publication locales", () => {
    expect(() => contentImportPayloadSchema.parse({ ...payload, publicationLocales: ["en", "en"] })).toThrow(/duplicates/);
  });
});
