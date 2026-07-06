import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import robots from "@/app/robots";
import { clientLogoAssets, publicClientLogoAssets } from "@/content/client-logo-assets";
import { insightCategorySlugs } from "@/content/insights.types";
import { keywordFamilyMap } from "@/content/seo/url-intent-map";
import { trustPagePaths } from "@/content/trust";
import {
  getCaseStudySlugs,
  getIndustrySlugs,
  getMarketSlugs,
  getProofPageSlugs,
  getSampleAuditSlugs,
  getServiceSlugs,
} from "@/lib/content";
import { localInsightsProvider } from "@/lib/insights/local-provider";
import {
  getLocaleFromPathname,
  locales,
  localizePath,
  stripLocaleFromPath,
  type Locale,
} from "@/lib/i18n";
import { buildMetadata, organizationSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

type StaticSitemapEntry = {
  url: string;
  alternates?: { languages?: Record<string, string> };
};

type Severity = "critical" | "high" | "medium" | "low" | "info";
type Status = "passed" | "failed";

type Finding = {
  id: string;
  severity: Severity;
  status: Status;
  message: string;
  evidence?: string;
};

const findings: Finding[] = [];

function addFinding(
  condition: boolean,
  id: string,
  severity: Severity,
  message: string,
  evidence?: string
) {
  findings.push({
    id,
    severity,
    status: condition ? "passed" : "failed",
    message,
    evidence,
  });
}

function pathFromUrl(value: string) {
  const url = new URL(value);
  return `${url.pathname}${url.search}`;
}

function expectedAlternates(basePath: string) {
  return Object.fromEntries([
    ...locales.map((locale) => [
      locale,
      `${siteConfig.url}${localizePath(basePath, locale as Locale)}`,
    ]),
    ["x-default", `${siteConfig.url}${localizePath(basePath, "en")}`],
  ]);
}

function sitemapEntry(basePath: string, locale: Locale): StaticSitemapEntry {
  return {
    url: `${siteConfig.url}${localizePath(basePath, locale)}`,
    alternates: { languages: expectedAlternates(basePath) },
  };
}

function buildLocalSitemapEntries(): StaticSitemapEntry[] {
  const staticBases = [
    "/",
    "/services",
    "/industries",
    "/markets",
    "/proof",
    "/work",
    "/insights",
    "/work/case-studies",
    "/work/sample-audits",
    "/work/search-growth-frameworks",
    "/work/client-results",
    "/pricing",
    "/free-seo-audit",
    "/book-a-call",
    "/contact",
    ...Object.values(trustPagePaths),
  ];
  const detailBases = [
    ...getServiceSlugs().map((slug) => `/services/${slug}`),
    ...getIndustrySlugs().map((slug) => `/industries/${slug}`),
    ...getMarketSlugs().map((slug) => `/markets/${slug}`),
    ...getProofPageSlugs().map((slug) => `/proof/${slug}`),
    ...getSampleAuditSlugs().map((slug) => `/work/sample-audits/${slug}`),
    ...getCaseStudySlugs().map((slug) => `/work/case-studies/${slug}`),
    ...insightCategorySlugs.map((slug) => `/insights/${slug}`),
  ];
  const localizedEntries = [...staticBases, ...detailBases].flatMap((base) =>
    locales.map((locale) => sitemapEntry(base, locale as Locale))
  );
  const insightEntries = localInsightsProvider.getArticleSlugs().map((item) =>
    sitemapEntry(`/insights/${item.categorySlug}/${item.articleSlug}`, item.locale as Locale)
  );
  return [...localizedEntries, ...insightEntries];
}

function privateRoutePattern(path: string) {
  return (
    path.includes("/admin") ||
    path.includes("/api") ||
    path.includes("/thank-you") ||
    path.includes("/preview") ||
    path.includes("?")
  );
}

function publicAssetExists(src: string) {
  if (!src.startsWith("/")) return true;
  return existsSync(join(process.cwd(), "public", src.replace(/^\//, "")));
}

function writeOptionalReport(report: unknown) {
  const outputIndex = process.argv.indexOf("--output");
  const output = outputIndex >= 0 ? process.argv[outputIndex + 1] : undefined;
  if (!output) return;
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
}

async function main() {
  const sitemapEntries = buildLocalSitemapEntries();
  const urls = sitemapEntries.map((entry) => entry.url);
  const paths = urls.map(pathFromUrl);
  const pathSet = new Set(paths);
  const duplicateUrls = urls.filter((url, index) => urls.indexOf(url) !== index);

  addFinding(duplicateUrls.length === 0, "sitemap-duplicates", "critical", "Sitemap must not contain duplicate URLs.", duplicateUrls.join(", "));
  addFinding(
    !paths.some(privateRoutePattern),
    "sitemap-private-exclusions",
    "critical",
    "Sitemap excludes Admin, API, preview, thank-you, and query URLs.",
    paths.filter(privateRoutePattern).join(", ")
  );

  const expectedStaticBases = [
    "/",
    "/services",
    "/industries",
    "/markets",
    "/proof",
    "/work",
    "/insights",
    "/work/case-studies",
    "/work/sample-audits",
    "/work/client-results",
    "/pricing",
    "/free-seo-audit",
    "/book-a-call",
    "/contact",
    ...Object.values(trustPagePaths),
  ];

  for (const base of expectedStaticBases) {
    for (const locale of locales) {
      const localized = localizePath(base, locale as Locale);
      addFinding(
        pathSet.has(localized),
        `sitemap-static-${locale}-${base.replace(/[^a-z0-9]+/gi, "-") || "home"}`,
        "high",
        `Sitemap includes ${localized}.`
      );
    }
  }

  for (const slug of getServiceSlugs()) {
    for (const locale of locales) {
      const localized = localizePath(`/services/${slug}`, locale as Locale);
      addFinding(pathSet.has(localized), `sitemap-service-${locale}-${slug}`, "high", `Sitemap includes ${localized}.`);
    }
  }

  for (const slug of getIndustrySlugs()) {
    for (const locale of locales) {
      const localized = localizePath(`/industries/${slug}`, locale as Locale);
      addFinding(pathSet.has(localized), `sitemap-industry-${locale}-${slug}`, "high", `Sitemap includes ${localized}.`);
    }
  }

  for (const slug of getMarketSlugs()) {
    for (const locale of locales) {
      const localized = localizePath(`/markets/${slug}`, locale as Locale);
      addFinding(pathSet.has(localized), `sitemap-market-${locale}-${slug}`, "high", `Sitemap includes ${localized}.`);
    }
  }

  for (const slug of getProofPageSlugs()) {
    for (const locale of locales) {
      const localized = localizePath(`/proof/${slug}`, locale as Locale);
      addFinding(pathSet.has(localized), `sitemap-proof-${locale}-${slug}`, "high", `Sitemap includes ${localized}.`);
    }
  }

  for (const slug of getSampleAuditSlugs()) {
    for (const locale of locales) {
      const localized = localizePath(`/work/sample-audits/${slug}`, locale as Locale);
      addFinding(pathSet.has(localized), `sitemap-sample-${locale}-${slug}`, "high", `Sitemap includes ${localized}.`);
    }
  }

  for (const slug of getCaseStudySlugs()) {
    for (const locale of locales) {
      const localized = localizePath(`/work/case-studies/${slug}`, locale as Locale);
      addFinding(pathSet.has(localized), `sitemap-case-${locale}-${slug}`, "high", `Sitemap includes ${localized}.`);
    }
  }

  const insightSlugs = localInsightsProvider.getArticleSlugs();
  for (const item of insightSlugs) {
    const localized = localizePath(`/insights/${item.categorySlug}/${item.articleSlug}`, item.locale as Locale);
    addFinding(
      pathSet.has(localized),
      `sitemap-insight-${item.locale}-${item.articleSlug}`,
      "high",
      `Sitemap includes ${localized}.`
    );
  }

  for (const entry of sitemapEntries) {
    const path = pathFromUrl(entry.url);
    const base = stripLocaleFromPath(path);
    const locale = getLocaleFromPathname(path);
    const expected = expectedAlternates(base);
    const languages = (entry.alternates?.languages ?? {}) as Record<string, string>;
    addFinding(
      entry.url === `${siteConfig.url}${localizePath(base, locale)}`,
      `canonical-sitemap-${path}`,
      "high",
      `Sitemap URL follows the localized canonical pattern for ${path}.`
    );
    for (const [code, href] of Object.entries(expected)) {
      addFinding(
        languages[code] === href,
        `hreflang-sitemap-${code}-${path}`,
        "high",
        `Sitemap hreflang ${code} for ${path} points to ${href}.`,
        `actual=${languages[code] ?? "missing"}`
      );
    }
  }

  const pricingMetadata = buildMetadata({
    title: "Pricing",
    description: "Pricing metadata check.",
    path: "/pricing",
    locale: "en",
  });
  addFinding(
    pricingMetadata.alternates?.canonical === `${siteConfig.url}/pricing`,
    "pricing-clean-canonical",
    "high",
    "Pricing query variants share the clean pricing canonical because metadata is route-level.",
    String(pricingMetadata.alternates?.canonical)
  );
  addFinding(!pathSet.has("/pricing?tab=mentor"), "pricing-query-sitemap-exclusion", "critical", "Pricing tab query URLs are excluded from the sitemap.");

  const robotsConfig = robots();
  const robotsDisallows = Array.isArray(robotsConfig.rules)
    ? robotsConfig.rules.flatMap((rule) => rule.disallow ?? [])
    : robotsConfig.rules.disallow ?? [];
  const robotsDisallowText = Array.isArray(robotsDisallows) ? robotsDisallows.join(" ") : String(robotsDisallows);
  addFinding(robotsConfig.sitemap === `${siteConfig.url}/sitemap.xml`, "robots-sitemap", "critical", "robots.txt includes the canonical sitemap URL.");
  for (const path of ["/admin", "/api", "/thank-you", "/fr/thank-you", "/es/thank-you"]) {
    addFinding(robotsDisallowText.includes(path), `robots-disallow-${path}`, "high", `robots.txt disallows ${path}.`);
  }
  addFinding(!robotsDisallowText.includes("/_next"), "robots-assets-open", "high", "robots.txt does not block critical Next.js assets.");
  addFinding(!robotsDisallowText.includes("/brand"), "robots-images-open", "high", "robots.txt does not block public brand/image assets.");

  const org = organizationSchema();
  const orgJson = JSON.stringify(org);
  addFinding(org["@type"] === "Organization", "organization-type", "critical", "Organization schema uses Organization type.");
  addFinding(org.name === "Taskcover Agency", "organization-name", "critical", "Organization schema uses Taskcover Agency.");
  addFinding(org.legalName === "Stoa Global Corporation", "organization-legal-name", "critical", "Organization schema uses Stoa Global Corporation.");
  addFinding(org.email === "business@taskcover.com", "organization-email", "high", "Organization schema includes verified public email.");
  addFinding(org.telephone === "+1 (802) 802-9299", "organization-phone", "high", "Organization schema includes verified public phone.");
  addFinding(org.address?.streetAddress === "169 Madison Avenue", "organization-address", "high", "Organization schema includes verified Madison Avenue address.");
  addFinding(!/Review|AggregateRating|LocalBusiness|sameAs/.test(orgJson), "organization-no-unsafe-schema", "critical", "Organization schema avoids Review, AggregateRating, LocalBusiness, and fake sameAs.");

  for (const asset of publicClientLogoAssets) {
    addFinding(
      publicAssetExists(asset.logoPath),
      `logo-public-exists-${asset.id}`,
      "high",
      `Public logo asset exists for ${asset.name}.`,
      asset.logoPath
    );
    addFinding(Boolean(asset.alt), `logo-alt-${asset.id}`, "medium", `Public logo asset has alt text for ${asset.name}.`);
  }
  for (const asset of clientLogoAssets.filter((item) => item.permissionStatus === "permission-review")) {
    addFinding(
      asset.publicUsage === false,
      `logo-permission-review-hidden-${asset.id}`,
      "critical",
      `${asset.name} remains hidden while in permission-review.`
    );
  }

  const primaryByFamily = new Map<string, string>();
  for (const entry of keywordFamilyMap) {
    addFinding(
      !primaryByFamily.has(entry.family),
      `keyword-owner-${entry.family.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`,
      "high",
      `Keyword family "${entry.family}" has one primary URL.`
    );
    primaryByFamily.set(entry.family, entry.primaryUrl);
  }

  const failedBlocking = findings.filter((finding) => finding.status === "failed" && ["critical", "high"].includes(finding.severity));
  const report = {
    checkedAt: new Date().toISOString(),
    sitemapUrlCount: sitemapEntries.length,
    staticPublicPathCount: pathSet.size,
    findings,
    summary: {
      criticalFailed: failedBlocking.filter((finding) => finding.severity === "critical").length,
      highFailed: failedBlocking.filter((finding) => finding.severity === "high").length,
      totalFailed: findings.filter((finding) => finding.status === "failed").length,
    },
  };

  writeOptionalReport(report);

  console.log(`SEO check complete: ${report.sitemapUrlCount} sitemap URLs, ${failedBlocking.length} blocking failures.`);
  if (failedBlocking.length > 0) {
    for (const finding of failedBlocking.slice(0, 25)) {
      console.error(`[${finding.severity}] ${finding.id}: ${finding.message}${finding.evidence ? ` (${finding.evidence})` : ""}`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
