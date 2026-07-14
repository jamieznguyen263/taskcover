import { describe, expect, it } from "vitest";
import { createDraftArticle } from "@/lib/admin/content-model";
import { getRequiredTranslations, isRequiredLocale, resolveRequiredLocales } from "./publication-policy";

function article(locale: "en" | "fr" | "es") {
  return createDraftArticle({
    groupId: "group",
    translationGroupId: "translation",
    slug: "publication-policy",
    category: "seo-guides",
    locale,
    author: "Editor",
  }).article;
}

describe("Insight publication locale policy", () => {
  it("treats the localizations stored in the group as the atomic publication set", () => {
    const translations = [article("en")];
    expect(resolveRequiredLocales(translations)).toEqual(["en"]);
    expect(getRequiredTranslations(translations).map((item) => item.locale)).toEqual(["en"]);
    expect(isRequiredLocale(translations, "en")).toBe(true);
    expect(isRequiredLocale(translations, "fr")).toBe(false);
  });

  it("keeps stable global locale order regardless of database row order", () => {
    const translations = [article("es"), article("en"), article("fr")];
    expect(resolveRequiredLocales(translations)).toEqual(["en", "fr", "es"]);
    expect(getRequiredTranslations(translations).map((item) => item.locale)).toEqual(["en", "fr", "es"]);
  });

  it("returns an empty publication set when a group has no localizations", () => {
    expect(resolveRequiredLocales([])).toEqual([]);
  });
});
