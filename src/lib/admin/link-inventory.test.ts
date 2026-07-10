import { describe, expect, it } from "vitest";
import { createDraftArticle } from "./content-model";
import { collectExistingHrefs, duplicateAnchorWarnings, LocalInventoryLinkProvider } from "./link-inventory";

function draft() {
  return createDraftArticle({ groupId: "group", translationGroupId: "translation", slug: "links-test", category: "seo-guides", locale: "en", author: "Editor" }).article;
}

describe("Local internal-link inventory", () => {
  it("lists only indexable keep/improve routes plus published articles", () => {
    const provider = new LocalInventoryLinkProvider([{ slug: "a", category: "seo-guides", h1: "Article A", focusKeyword: "topic a" }]);
    const targets = provider.listTargets();
    expect(targets.length).toBeGreaterThan(5);
    expect(targets.some((target) => target.href === "/insights/seo-guides/a")).toBe(true);
    expect(targets.every((target) => target.href.startsWith("/"))).toBe(true);
  });

  it("always proposes the funnel-stage conversion path and never the article itself", () => {
    const article = draft();
    const suggestions = new LocalInventoryLinkProvider().suggest(article, new Set());
    expect(suggestions.some((suggestion) => suggestion.href === "/free-seo-audit")).toBe(true);
    expect(suggestions.some((suggestion) => suggestion.href === "/insights/seo-guides/links-test")).toBe(false);

    const decision = { ...article, searchStrategy: { ...article.searchStrategy, funnelStage: "decision" as const } };
    expect(new LocalInventoryLinkProvider().suggest(decision, new Set()).some((suggestion) => suggestion.href === "/book-a-call")).toBe(true);
  });

  it("excludes hrefs that are already linked", () => {
    const article = draft();
    const suggestions = new LocalInventoryLinkProvider().suggest(article, new Set(["/free-seo-audit"]));
    expect(suggestions.some((suggestion) => suggestion.href === "/free-seo-audit")).toBe(false);
  });

  it("collects existing hrefs across link groups and warns on duplicate anchors", () => {
    const article = draft();
    article.internalLinking.serviceLinks = [{ label: "SEO services", href: "/services/seo" }];
    article.internalLinking.suggestedInternalLinks = [{ label: "seo services", href: "/services/technical-seo" }];
    expect(collectExistingHrefs(article).has("/services/seo")).toBe(true);
    const warnings = duplicateAnchorWarnings(article);
    expect(warnings.length).toBe(1);
    expect(warnings[0]).toContain("seo services");
  });
});
