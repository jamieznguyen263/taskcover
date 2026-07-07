import { describe, expect, it } from "vitest";
import { trustPagePaths } from "@/content/trust";
import { getLocalizedSite } from "@/lib/content";
import { localizePath } from "@/lib/i18n";
import { companyDetails } from "@/lib/company";
import { organizationSchema } from "@/lib/seo";
import { parseLeadPayload } from "@/lib/leads/schema";
import { buildSitemapEntries as sitemap } from "@/lib/sitemap";

describe("visitor readiness architecture", () => {
  it("maps trust and legal routes across locales with English slugs", () => {
    expect(localizePath("/privacy-policy", "en")).toBe("/privacy-policy");
    expect(localizePath("/privacy-policy", "fr")).toBe("/fr/privacy-policy");
    expect(localizePath("/how-we-work", "es")).toBe("/es/how-we-work");
  });

  it("uses verified Organization schema fields only", () => {
    expect(organizationSchema()).toMatchObject({
      "@type": "Organization",
      name: companyDetails.brandName,
      legalName: companyDetails.legalOperator,
      alternateName: companyDetails.formalName,
      email: companyDetails.email,
      telephone: companyDetails.phone,
      address: {
        streetAddress: companyDetails.address.street,
        addressLocality: companyDetails.address.city,
        addressRegion: companyDetails.address.region,
        postalCode: companyDetails.address.postalCode,
        addressCountry: companyDetails.address.country,
      },
    });
    expect(JSON.stringify(organizationSchema())).not.toContain("AggregateRating");
  });

  it("includes trust/legal routes in localized footer links", () => {
    const footerHrefs = getLocalizedSite("fr").footer.groups.flatMap((group) => group.links.map((link) => link.href));
    expect(footerHrefs).toContain("/fr/privacy-policy");
    expect(footerHrefs).toContain("/fr/cookie-preferences");
    expect(footerHrefs).toContain("/fr/data-request");
  });

  it("accepts the data-request lead type without requiring sensitive documents", () => {
    const result = parseLeadPayload({
      submittedAt: "2026-07-05T00:00:00.000Z",
      spamSignals: { honeypotPresent: false, turnstileConfigured: false, turnstileVerified: false },
      payload: {
        requestType: "data-request",
        locale: "en",
        name: "Jane Visitor",
        workEmail: "jane@example.com",
        message: "Delete my information.",
        consent: true,
        sourcePath: "/data-request",
        website: "",
      },
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.lead.requestType).toBe("data-request");
  });

  it("includes trust/legal pages in sitemap and excludes private routes", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    for (const path of Object.values(trustPagePaths)) {
      expect(urls).toContain(`https://taskcover.com${path}`);
      expect(urls).toContain(`https://taskcover.com/fr${path}`);
      expect(urls).toContain(`https://taskcover.com/es${path}`);
    }
    expect(urls.some((url) => url.includes("/admin"))).toBe(false);
    expect(urls.some((url) => url.includes("/thank-you"))).toBe(false);
  });
});
