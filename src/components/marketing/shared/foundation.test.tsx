import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FAQAccordion } from "./faq-accordion";
import { CTAButton } from "./cta-button";
import { Section } from "./section";
import { buildSitemapEntries } from "@/lib/sitemap";
import robots from "@/app/robots";
import { metadata } from "@/app/styleguide/page";

describe("marketing foundation regressions", () => {
  it("server-renders every collapsed FAQ answer, including nested links, without adding schema", () => {
    const html = renderToStaticMarkup(<FAQAccordion items={[
      { q: "First question", a: "First server-rendered answer" },
      { q: "Second question", a: <a href="#services">Explore services</a> },
    ]} />);
    expect(html).toContain("First server-rendered answer");
    expect(html).toContain('href="#services"');
    expect(html).toContain("Explore services");
    expect(html.match(/role="region"/g)).toHaveLength(2);
    expect(html.match(/aria-expanded="false"/g)).toHaveLength(2);
    expect(html).toContain("data-[state=closed]:hidden");
    expect(html).not.toContain("application/ld+json");
  });

  it.each(["primary", "secondary", "outline", "ghost"] as const)("preserves cal.com analytics and anchor attributes for %s", (variant) => {
    const html = renderToStaticMarkup(<CTAButton variant={variant} href="https://cal.com/taskcover" target="_blank" rel="noreferrer">Book</CTAButton>);
    expect(html).toContain('data-analytics="cta"');
    expect(html).toContain('data-analytics-provider="calcom"');
    expect(html).toContain('href="https://cal.com/taskcover"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noreferrer"');
  });

  it.each(["soft", "tint"] as const)("keeps the legacy %s section prop and polymorphic element", (background) => {
    const html = renderToStaticMarkup(<Section background={background} as="article" aria-label="Legacy section">Content</Section>);
    expect(html).toMatch(/^<article /);
    expect(html).toContain('aria-label="Legacy section"');
    expect(html).toContain("Content</article>");
  });

  it("keeps the styleguide non-indexable and outside the sitemap", async () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(robots().rules).toMatchObject({ disallow: expect.arrayContaining(["/styleguide"]) });
    const entries = await buildSitemapEntries();
    expect(entries.some(({ url }) => new URL(url).pathname.startsWith("/styleguide"))).toBe(false);
  });
});
