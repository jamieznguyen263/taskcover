import { describe, expect, it } from "vitest";
import { buildSitemapEntries, renderSitemapXml } from "./sitemap";

const fixedLastModified = new Date("2026-07-05T00:00:00.000Z");

describe("Taskcover sitemap", () => {
  it("builds canonical localized sitemap entries with hreflang alternates", async () => {
    const entries = await buildSitemapEntries(fixedLastModified);
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://taskcover.com/");
    expect(urls).toContain("https://taskcover.com/fr");
    expect(urls).toContain("https://taskcover.com/es");
    expect(urls).toContain("https://taskcover.com/services/seo-agency");
    expect(urls).toContain("https://taskcover.com/fr/services/seo-agency");
    expect(urls).toContain("https://taskcover.com/es/services/seo-agency");
    expect(urls).toContain("https://taskcover.com/services/website-development");
    expect(urls).toContain("https://taskcover.com/fr/services/website-development");
    expect(urls).toContain("https://taskcover.com/es/services/website-development");
    expect(urls.every((url) => !url.includes("localhost"))).toBe(true);

    const homepage = entries.find((entry) => entry.url === "https://taskcover.com/");
    expect(homepage?.alternates.languages).toEqual({
      en: "https://taskcover.com/",
      fr: "https://taskcover.com/fr",
      es: "https://taskcover.com/es",
      "x-default": "https://taskcover.com/",
    });
  });

  it("renders XML that preserves localized alternates", async () => {
    const xml = renderSitemapXml(await buildSitemapEntries(fixedLastModified));

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    expect(xml).toContain('<loc>https://taskcover.com/fr/services/seo-agency</loc>');
    expect(xml).toContain('<loc>https://taskcover.com/services/website-development</loc>');
    expect(xml).toContain('hreflang="es" href="https://taskcover.com/es/services/seo-agency"');
    expect(xml).toContain("<lastmod>2026-07-05T00:00:00.000Z</lastmod>");
  });
});
