import { describe, expect, it } from "vitest";
import { createDraftArticle } from "./content-model";
import { collectExistingHrefs, duplicateAnchorWarnings, isConcretePublicRoute, LocalInventoryLinkProvider } from "./link-inventory";

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

  it("never surfaces dynamic template routes or non-public paths as link targets", () => {
    const targets = new LocalInventoryLinkProvider().listTargets();
    expect(targets.some((target) => target.href.includes("["))).toBe(false);
    expect(targets.some((target) => /^\/(admin|api|preview|login|accept-invite)(\/|$)/.test(target.href))).toBe(false);
  });

  it("classifies concrete public routes correctly", () => {
    expect(isConcretePublicRoute("/services/seo-audit")).toBe(true);
    expect(isConcretePublicRoute("/industries/[slug]")).toBe(false);
    expect(isConcretePublicRoute("/insights/[categorySlug]/[articleSlug]")).toBe(false);
    expect(isConcretePublicRoute("/admin/insights")).toBe(false);
    expect(isConcretePublicRoute("/api/admin/insights/autosave")).toBe(false);
    expect(isConcretePublicRoute("https://example.com/x")).toBe(false);
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

  it("collects hrefs embedded in rich body text", () => {
    const article = draft();
    article.blocks = [
      { type: "paragraph", text: [{ text: "SEO services", marks: [{ type: "link", href: "/services/seo-agency" }] }] },
      { type: "bullet-list", items: [[{ text: "Free SEO audit", marks: [{ type: "link", href: "/free-seo-audit" }] }]] },
    ];
    const hrefs = collectExistingHrefs(article);
    expect(hrefs.has("/services/seo-agency")).toBe(true);
    expect(hrefs.has("/free-seo-audit")).toBe(true);
  });
});
