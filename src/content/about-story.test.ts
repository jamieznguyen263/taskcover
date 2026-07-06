import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { aboutStoryMetadata } from "@/components/marketing/about/about-story-page";
import { getAboutStoryContent, getCaseStudySlugs } from "@/lib/content";
import { companyAddressLine, companyDetails } from "@/lib/company";
import { localizePath, locales, type Locale } from "@/lib/i18n";

describe("about story content", () => {
  it("contains the confirmed founding story across EN/FR/ES", () => {
    for (const locale of locales) {
      const content = getAboutStoryContent(locale);
      const serialized = JSON.stringify(content);

      expect(serialized).toContain("2017");
      expect(serialized).toContain("2018");
      expect(serialized).toContain("2019");
      expect(serialized).toContain("Stoa Global Corporation");
      expect(serialized).toContain("Jamiez Nguyen");
      expect(serialized).toContain("John Edward");
      expect(content.hero.primaryCta.href).toBe("/methodology");
      expect(content.hero.secondaryCta.href).toBe("/free-seo-audit");
    }
  });

  it("implements the required timeline entries without assigning case studies to unsupported years", () => {
    const expectedEnglishYears = ["2017", "2018", "2019", "2020–2021", "2022", "2023–2024", "Today"];
    expect(getAboutStoryContent("en").timeline.entries.map((entry) => entry.year)).toEqual(expectedEnglishYears);

    for (const locale of locales) {
      const years = getAboutStoryContent(locale).timeline.entries.map((entry) => entry.year);
      expect(years.slice(0, 6)).toEqual(["2017", "2018", "2019", "2020–2021", "2022", "2023–2024"]);
      expect(years).toHaveLength(7);
    }
  });

  it("defines Jamiez Nguyen and John Edward leadership entries with no social links", () => {
    const leaders = getAboutStoryContent("en").leadership.leaders;
    expect(leaders.map((leader) => `${leader.name} — ${leader.title}`)).toEqual([
      "Jamiez Nguyen — Founder & CEO",
      "John Edward — CTO",
    ]);
    expect(leaders[0]?.alt).toBe("Jamiez Nguyen, Founder and CEO of Taskcover Agency");
    expect(leaders[1]?.alt).toBe("John Edward, CTO of Taskcover Agency");

    for (const locale of locales) {
      const leadership = getAboutStoryContent(locale).leadership;
      expect(JSON.stringify(leadership)).not.toMatch(/linkedin|twitter|x\.com|facebook|instagram|youtube|sameAs/i);
    }
  });

  it("uses approved team portrait assets across locales", () => {
    for (const locale of locales) {
      const leaders = getAboutStoryContent(locale).leadership.leaders;
      expect(leaders).toHaveLength(2);
      expect(leaders.map((leader) => leader.imagePath)).toEqual([
        "/team/jamiez-nguyen.webp",
        "/team/john-edward.webp",
      ]);
      for (const leader of leaders) {
        expect(leader.imageWidth).toBe(1200);
        expect(leader.imageHeight).toBe(1500);
        const assetPath = path.join(process.cwd(), "public", leader.imagePath.slice(1));
        expect(existsSync(assetPath)).toBe(true);
        expect(statSync(assetPath).size).toBeGreaterThan(10_000);
      }
    }
  });

  it("references only existing case-study slugs in the methodology shaping section", () => {
    const allowedSlugs = new Set(getCaseStudySlugs());

    for (const locale of locales) {
      const capabilities = getAboutStoryContent(locale).methodology.capabilities;
      expect(capabilities).toHaveLength(7);
      for (const capability of capabilities) {
        expect(capability.caseStudySlugs.length).toBeGreaterThan(0);
        for (const slug of capability.caseStudySlugs) {
          expect(allowedSlugs.has(slug)).toBe(true);
        }
      }
    }
  });

  it("uses the confirmed Stoa Global Corporation company details", () => {
    expect(companyDetails.brandName).toBe("Taskcover Agency");
    expect(companyDetails.formalName).toBe("Taskcover Agency by Stoa Global Corporation");
    expect(companyDetails.legalOperator).toBe("Stoa Global Corporation");
    expect(companyAddressLine()).toBe("169 Madison Avenue, New York, NY 10016, United States");
    expect(companyDetails.email).toBe("business@taskcover.com");
    expect(companyDetails.phone).toBe("+1 (802) 802-9299");
  });

  it("localizes visible route data instead of reusing English labels", () => {
    const english = getAboutStoryContent("en");
    const french = getAboutStoryContent("fr");
    const spanish = getAboutStoryContent("es");

    expect(french.hero.h1).not.toBe(english.hero.h1);
    expect(spanish.hero.h1).not.toBe(english.hero.h1);
    expect(french.hero.primaryCta.label).not.toBe("View Our Methodology");
    expect(spanish.hero.secondaryCta.label).not.toBe("Get Free SEO Audit");
    expect(JSON.stringify(french.finalCta)).not.toContain("Book Strategy Call");
    expect(JSON.stringify(spanish.operatingModel.links)).not.toContain("Review pricing");
  });

  it("keeps About metadata canonical, hreflang, and sitemap behavior valid", async () => {
    for (const locale of locales) {
      const metadata = aboutStoryMetadata(locale) as {
        alternates?: { canonical?: string; languages?: Record<string, string> };
      };
      const localizedAbout = localizePath("/about", locale as Locale);
      expect(metadata.alternates?.canonical).toBe(`https://taskcover.com${localizedAbout}`);
      expect(metadata.alternates?.languages?.en).toBe("https://taskcover.com/about");
      expect(metadata.alternates?.languages?.fr).toBe("https://taskcover.com/fr/about");
      expect(metadata.alternates?.languages?.es).toBe("https://taskcover.com/es/about");
      expect(metadata.alternates?.languages?.["x-default"]).toBe("https://taskcover.com/about");
    }

    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls).toContain("https://taskcover.com/about");
    expect(urls).toContain("https://taskcover.com/fr/about");
    expect(urls).toContain("https://taskcover.com/es/about");
  });
});
