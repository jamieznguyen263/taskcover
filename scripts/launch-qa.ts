import { existsSync, readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { JSDOM } from "jsdom";
import { publicClientLogoAssets, clientLogoAssets } from "@/content/client-logo-assets";
import { trustPagePaths } from "@/content/trust";
import { getCaseStudySlugs, getIndustrySlugs, getMarketSlugs, getProofPageSlugs, getSampleAuditSlugs, getServiceSlugs, getHomeContent } from "@/lib/content";
import { localInsightsProvider } from "@/lib/insights/local-provider";
import { insightCategorySlugs } from "@/content/insights.types";
import { locales, localizePath, type Locale } from "@/lib/i18n";

type Mode = "perf" | "a11y" | "visual" | "all";
type Severity = "critical" | "high" | "medium" | "low" | "info";
type Status = "passed" | "failed";

type Finding = {
  id: string;
  mode: Exclude<Mode, "all">;
  severity: Severity;
  status: Status;
  message: string;
  evidence?: string;
};

type RenderedPage = {
  path: string;
  status: number;
  htmlSize: number;
  scriptCount: number;
  h1Count: number;
  duplicateIds: string[];
  missingAlt: string[];
  hasHorizontalOverflowRisk: boolean;
};

const cwd = process.cwd();
const srcDir = join(cwd, "src");
const findings: Finding[] = [];

function argValue(name: string, fallback?: string) {
  const inline = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function hasArg(name: string) {
  return process.argv.includes(name);
}

function addFinding(
  mode: Exclude<Mode, "all">,
  condition: boolean,
  id: string,
  severity: Severity,
  message: string,
  evidence?: string
) {
  findings.push({
    id,
    mode,
    severity,
    status: condition ? "passed" : "failed",
    message,
    evidence,
  });
}

function read(path: string) {
  return readFileSync(join(cwd, path), "utf8");
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) return walk(full);
    return [full];
  });
}

function sourceFiles() {
  return walk(srcDir).filter((file) => [".ts", ".tsx"].includes(extname(file)));
}

function toRepoPath(file: string) {
  return relative(cwd, file).replaceAll("\\", "/");
}

function isAdminFile(file: string) {
  const normalized = toRepoPath(file);
  return normalized.includes("/admin/") || normalized.startsWith("src/components/admin/");
}

function isPublicSourceFile(file: string) {
  const normalized = toRepoPath(file);
  if (isAdminFile(file)) return false;
  if (normalized.startsWith("src/app/api/")) return false;
  if (normalized.startsWith("src/lib/admin/")) return false;
  return normalized.startsWith("src/app/") || normalized.startsWith("src/components/marketing/");
}

function getClientComponentFiles(files: string[]) {
  return files.filter((file) => readFileSync(file, "utf8").startsWith('"use client";') || readFileSync(file, "utf8").startsWith("'use client';"));
}

function publicRouteBases() {
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
  return [
    ...staticBases,
    ...getServiceSlugs().map((slug) => `/services/${slug}`),
    ...getIndustrySlugs().map((slug) => `/industries/${slug}`),
    ...getMarketSlugs().map((slug) => `/markets/${slug}`),
    ...getProofPageSlugs().map((slug) => `/proof/${slug}`),
    ...getSampleAuditSlugs().map((slug) => `/work/sample-audits/${slug}`),
    ...getCaseStudySlugs().map((slug) => `/work/case-studies/${slug}`),
    ...insightCategorySlugs.map((slug) => `/insights/${slug}`),
    ...localInsightsProvider.getArticleSlugs().map((item) => `/insights/${item.categorySlug}/${item.articleSlug}`),
  ];
}

function localizedPublicRoutes() {
  return publicRouteBases().flatMap((base) => locales.map((locale) => localizePath(base, locale as Locale)));
}

function sampleQaRoutes() {
  return [
    "/",
    "/pricing",
    "/pricing?tab=mentor",
    "/pricing?tab=audits",
    "/services",
    `/services/${getServiceSlugs()[0]}`,
    "/industries",
    `/industries/${getIndustrySlugs()[0]}`,
    "/markets",
    "/work/case-studies",
    `/work/case-studies/${getCaseStudySlugs()[0]}`,
    "/work/client-results",
    "/work/sample-audits",
    `/work/sample-audits/${getSampleAuditSlugs()[0]}`,
    "/insights",
    `/insights/${insightCategorySlugs[0]}`,
    ...localInsightsProvider.getArticleSlugs().slice(0, 1).map((item) => `/insights/${item.categorySlug}/${item.articleSlug}`),
    "/free-seo-audit",
    "/contact",
    "/about",
    "/cookie-preferences",
    "/privacy-policy",
    "/fr/pricing?tab=mentor",
    "/es/pricing?tab=mentor",
    "/fr/privacy-policy",
    "/es/privacy-policy",
    "/not-a-real-route-for-launch-qa",
  ];
}

function publicAssetExists(src: string) {
  if (!src.startsWith("/")) return true;
  return existsSync(join(cwd, "public", src.replace(/^\//, "")));
}

function hasAny(source: string, needles: string[]) {
  return needles.some((needle) => source.includes(needle));
}

function collectDuplicateIds(document: Document) {
  const seen = new Set<string>();
  const duplicateIds = new Set<string>();
  document.querySelectorAll<HTMLElement>("[id]").forEach((element) => {
    const id = element.id;
    if (seen.has(id)) duplicateIds.add(id);
    seen.add(id);
  });
  return [...duplicateIds];
}

function hasHorizontalOverflowRisk(document: Document) {
  return Array.from(document.querySelectorAll<HTMLElement>("[class], [style]")).some((element) => {
    const className = element.getAttribute("class") ?? "";
    const style = element.getAttribute("style") ?? "";
    return (
      /\bw-screen\b/.test(className) ||
      /(?:min-width:\s*(?:9|1\d)\d{2,}px|width:\s*100vw)/i.test(style)
    );
  });
}

function parseRenderedPage(path: string, status: number, html: string): RenderedPage {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const missingAlt = Array.from(document.querySelectorAll<HTMLImageElement>("img[src]"))
    .filter((image) => !image.hasAttribute("alt"))
    .map((image) => image.getAttribute("src") ?? "unknown");
  return {
    path,
    status,
    htmlSize: Buffer.byteLength(html, "utf8"),
    scriptCount: document.querySelectorAll("script[src]").length,
    h1Count: document.querySelectorAll("h1").length,
    duplicateIds: collectDuplicateIds(document),
    missingAlt,
    hasHorizontalOverflowRisk: hasHorizontalOverflowRisk(document),
  };
}

function htmlBudgetFor(path: string) {
  return path === "/" ? 450_000 : 350_000;
}

async function fetchRenderedPages(baseUrl: string) {
  const base = new URL(baseUrl);
  const pages: RenderedPage[] = [];
  for (const path of sampleQaRoutes()) {
    const url = new URL(path, base);
    try {
      const response = await fetch(url, { headers: { "user-agent": "TaskcoverLaunchQA/1.0" } });
      const html = await response.text();
      pages.push(parseRenderedPage(path, response.status, html));
    } catch {
      pages.push({
        path,
        status: 599,
        htmlSize: 0,
        scriptCount: 0,
        h1Count: 0,
        duplicateIds: [],
        missingAlt: [],
        hasHorizontalOverflowRisk: false,
      });
    }
  }
  return pages;
}

function auditPerformance(files: string[]) {
  const clientFiles = getClientComponentFiles(files);
  const publicClientFiles = clientFiles.filter(isPublicSourceFile);
  const bannedPublicImports = [
    "@tiptap/",
    "recharts",
    "@/components/admin",
    "@/lib/admin",
    "@/lib/db",
    "postgres",
    "drizzle-orm",
    "cloudinary",
  ];
  const publicBanned = publicClientFiles
    .map((file) => ({ file, source: readFileSync(file, "utf8") }))
    .filter((item) => hasAny(item.source, bannedPublicImports))
    .map((item) => toRepoPath(item.file));
  const motionWithoutReducedMotion = files
    .map((file) => ({ file, source: readFileSync(file, "utf8") }))
    .filter((item) => item.source.includes("motion/react") && !item.source.includes("useReducedMotion"))
    .map((item) => toRepoPath(item.file));
  const packageJson = JSON.parse(read("package.json")) as { dependencies?: Record<string, string> };
  const homeByLocale = locales.map((locale) => [locale, getHomeContent(locale as Locale)] as const);

  addFinding("perf", localizedPublicRoutes().length >= 240, "route-inventory-size", "info", "Launch QA can inventory the localized public route set.", `${localizedPublicRoutes().length} routes`);
  addFinding("perf", publicClientFiles.length <= 40, "public-client-boundary-count", "medium", "Public client component boundaries stay limited to interactive UI.", `${publicClientFiles.length} public client components`);
  addFinding("perf", publicBanned.length === 0, "public-client-banned-imports", "critical", "Public client components must not import Admin, Tiptap, database, Cloudinary, or chart-only modules.", publicBanned.join(", "));
  addFinding("perf", motionWithoutReducedMotion.length === 0, "motion-reduced-motion-hook", "high", "Motion components should call useReducedMotion or otherwise respect reduced motion.", motionWithoutReducedMotion.join(", "));
  addFinding("perf", Boolean(packageJson.dependencies?.motion), "motion-single-animation-library", "info", "Existing motion dependency is the only public animation library used.");
  addFinding("perf", !files.some((file) => isPublicSourceFile(file) && readFileSync(file, "utf8").includes("from \"recharts\"")), "no-public-recharts-import", "high", "Recharts is not imported into public routes.");
  const heroVideoSource = read("src/components/marketing/home/hero-video-card.tsx");
  addFinding("perf", homeByLocale.every(([, home]) => home.heroVideo.previewIframeUrl?.startsWith("https://customer-0tesip1ipnusoino.cloudflarestream.com/") && home.heroVideo.playerIframeUrl?.startsWith("https://customer-0tesip1ipnusoino.cloudflarestream.com/")), "hero-video-controlled-stream-urls", "critical", "Homepage hero video uses controlled Cloudflare Stream embed URLs.");
  addFinding("perf", homeByLocale.every(([, home]) => home.heroVideo.posterUrl?.includes("/thumbnails/thumbnail.jpg")), "hero-video-poster-fallback", "high", "Homepage hero video keeps a poster fallback for initial render and Stream failure.");
  addFinding("perf", heroVideoSource.includes('loading="lazy"') && heroVideoSource.includes("previewLoaded"), "hero-video-lazy-preview", "high", "Hero video preview iframe is lazy and only shown after load.");
  addFinding("perf", !heroVideoSource.includes("autoPlay"), "hero-video-no-react-autoplay", "high", "Hero video component does not use the React autoPlay prop.");
  addFinding("perf", publicClientLogoAssets.every((asset) => asset.width > 0 && asset.height > 0 && publicAssetExists(asset.logoPath)), "logo-assets-dimensions", "high", "Public logo assets have dimensions and local files.");
  addFinding("perf", clientLogoAssets.filter((asset) => asset.permissionStatus === "permission-review").every((asset) => asset.publicUsage === false), "permission-review-logos-hidden", "critical", "Permission-review brands stay out of public logo usage.");
  addFinding("perf", existsSync(join(cwd, ".open-next")) || existsSync(join(cwd, "open-next.config.ts")), "opennext-config-present", "info", "OpenNext Cloudflare configuration is present for Worker builds.");
}

function auditAccessibility() {
  const header = read("src/components/marketing/layout/site-header.tsx");
  const languageSwitcher = read("src/components/marketing/layout/language-switcher.tsx");
  const pricingTabs = read("src/components/marketing/pricing/pricing-tabs.tsx");
  const pricingFlow = read("src/components/marketing/pricing/pricing-interactive-flow.tsx");
  const leadForm = read("src/components/marketing/leads/lead-form-client.tsx");
  const dataRequest = read("src/components/marketing/trust/data-request-form-client.tsx");
  const cookiePrefs = read("src/components/marketing/trust/cookie-preferences-client.tsx");
  const radialMap = read("src/components/marketing/home/search-ecosystem-map.tsx");
  const faq = read("src/components/marketing/shared/faq-accordion.tsx");
  const layout = read("src/app/layout.tsx");

  addFinding("a11y", layout.includes("<SiteHeader />") && layout.includes("<SiteFooter />") && layout.includes("<main"), "landmarks-present", "high", "Global layout renders header, main, and footer landmarks.");
  addFinding("a11y", header.includes("aria-expanded={expanded}") && header.includes("aria-controls={`mega-menu-${item.id}`}"), "desktop-menu-aria", "high", "Desktop mega menu toggles expose aria-expanded and aria-controls.");
  addFinding("a11y", header.includes("aria-expanded={mobileOpen}") && header.includes('aria-controls="mobile-primary-menu"'), "mobile-menu-aria", "high", "Mobile menu trigger exposes aria-expanded and aria-controls.");
  addFinding("a11y", header.includes('event.key !== "Escape"') && header.includes("mobileTriggerRef.current?.focus()"), "menu-escape-focus", "medium", "Header menus close on Escape and return focus to the mobile trigger.");
  addFinding("a11y", languageSwitcher.includes('aria-haspopup="listbox"') && languageSwitcher.includes("aria-selected={active}") && languageSwitcher.includes("safeQuery"), "language-switcher-a11y", "medium", "Language switcher uses a named listbox pattern and preserves only safe query params.");
  addFinding("a11y", pricingTabs.includes('role="tablist"') && pricingTabs.includes('role="tab"') && pricingTabs.includes("aria-selected={selected}") && pricingTabs.includes("onTabKeyDown"), "pricing-tabs-a11y", "high", "Pricing tabs expose tab roles, selected state, and keyboard navigation.");
  addFinding("a11y", pricingFlow.includes("<details") && pricingFlow.includes("fullComparisonLabel"), "pricing-comparison-collapsed", "medium", "Pricing full comparison remains collapsed with native details/summary.");
  addFinding("a11y", leadForm.includes("ErrorList") && leadForm.includes("focusFirstError") && leadForm.includes("autoComplete") && !leadForm.includes("preventDefault()") || leadForm.includes("event.preventDefault(); void submit"), "lead-form-labels-errors", "high", "Lead forms include labels, autocomplete, error summary, and first-error focus.");
  addFinding("a11y", !leadForm.includes("onPaste"), "forms-paste-allowed", "medium", "Lead forms do not disable paste.");
  addFinding("a11y", dataRequest.includes('aria-labelledby="data-request-title"') && dataRequest.includes("errorSummaryRef") && dataRequest.includes("aria-invalid"), "data-request-error-summary", "high", "Data Request form provides accessible validation feedback.");
  addFinding("a11y", dataRequest.includes("mailto:") && dataRequest.includes("directEmail"), "data-request-email-fallback", "high", "Data Request keeps a direct email fallback when providers are unavailable.");
  addFinding("a11y", cookiePrefs.includes("htmlFor={id}") && cookiePrefs.includes("type=\"checkbox\""), "cookie-controls-labels", "high", "Cookie preference controls have labels and checkbox semantics.");
  addFinding("a11y", radialMap.includes("aria-label={surface.ariaLabel}") && radialMap.includes("aria-pressed={isActive}") && radialMap.includes("onFocus={() => setActiveId(surface.id)}"), "radial-buttons-a11y", "high", "Radial map nodes are buttons with labels, pressed state, and keyboard focus behavior.");
  addFinding("a11y", faq.includes("@radix-ui/react-accordion"), "faq-radix-accordion", "info", "FAQ accordion uses Radix primitives for disclosure semantics.");
}

function auditVisual() {
  const globals = read("src/app/globals.css");
  const header = read("src/components/marketing/layout/site-header.tsx");
  const footer = read("src/components/marketing/layout/site-footer.tsx");
  const pricingTabs = read("src/components/marketing/pricing/pricing-tabs.tsx");
  const pricingView = read("src/components/marketing/pricing/pricing-page-view.tsx");
  const insights = read("src/components/marketing/insights/insight-block-renderer.tsx");
  const articleView = read("src/components/marketing/insights/insights-views.tsx");
  const sampleAudits = read("src/components/marketing/work/sample-audits-view.tsx");
  const logoTile = read("src/components/marketing/shared/client-logo-tile.tsx");
  const brandMarquee = read("src/components/marketing/home/brand-marquee.tsx");

  addFinding("visual", globals.includes("overflow-x: clip") && globals.includes("@supports not (overflow: clip)"), "body-overflow-guard", "critical", "Body has a global horizontal overflow guard.");
  addFinding("visual", globals.includes("@media (prefers-reduced-motion: reduce)") && globals.includes("animation-duration: 0.01ms"), "global-reduced-motion", "high", "Global reduced-motion fallback disables decorative animation.");
  addFinding("visual", header.includes("width={2721}") && header.includes("height={1176}") && header.includes("clamp(6.25rem"), "header-logo-dimensions", "medium", "Header logo has intrinsic dimensions and stronger responsive brand width.");
  addFinding("visual", header.includes("max-h-[calc(100dvh-4rem)]") && header.includes("overflow-y-auto"), "mobile-menu-containment", "high", "Mobile menu is viewport-constrained and scrollable.");
  addFinding("visual", footer.includes("lg:grid-cols-[1.2fr_2fr]") && footer.includes("grid-cols-2") && footer.includes("lg:grid-cols-6"), "footer-responsive-grid", "medium", "Footer groups use responsive grids instead of fixed-width columns.");
  addFinding("visual", pricingTabs.includes("overflow-x-auto") && pricingTabs.includes("shrink-0"), "pricing-tab-overflow", "high", "Pricing tab rail is horizontally scrollable and tabs do not shrink on mobile.");
  addFinding("visual", pricingView.includes("overflow-x-auto") && pricingView.includes("min-w-[280px]"), "pricing-proof-rail-contained", "medium", "Pricing proof cards are contained in a horizontal rail.");
  addFinding("visual", insights.includes("overflow-x-auto") && insights.includes("min-w-[680px]"), "article-table-contained", "high", "Insight article comparison tables stay inside an overflow wrapper.");
  addFinding("visual", articleView.includes("minmax(0,1fr)") && articleView.includes("min-w-0"), "article-layout-minmax", "medium", "Article layout uses minmax/min-w guards for side rails and content.");
  addFinding("visual", sampleAudits.includes("overflow-x-auto") && sampleAudits.includes("min-w-0") && sampleAudits.includes("scroll-px-2"), "sample-audit-overflow-contained", "high", "Sample audits tabs and tables have explicit overflow containment.");
  addFinding("visual", logoTile.includes("aspect-[9/5]") && logoTile.includes("object-contain"), "case-logo-aspect-ratio", "high", "Client logo tiles preserve aspect ratio and avoid distortion.");
  addFinding("visual", brandMarquee.includes("useReducedMotion") && brandMarquee.includes("sm:hidden"), "logo-strip-responsive", "medium", "Homepage logo strip has mobile static layout and reduced-motion static fallback.");
}

async function auditRendered(baseUrl: string) {
  const pages = await fetchRenderedPages(baseUrl);
  for (const page of pages) {
    const isExpected404 = page.path.includes("not-a-real-route");
    addFinding("perf", isExpected404 ? page.status === 404 : page.status < 400, `rendered-status-${page.path}`, isExpected404 ? "info" : "high", `Rendered route ${page.path} returns expected status.`, String(page.status));
    if (!isExpected404 && page.status < 400) {
      const htmlBudget = htmlBudgetFor(page.path);
      addFinding("perf", page.htmlSize < htmlBudget, `html-size-${page.path}`, "medium", `Rendered HTML size for ${page.path} stays below ${Math.round(htmlBudget / 1000)} KB.`, `${page.htmlSize} bytes`);
      addFinding("perf", page.scriptCount <= 45, `script-count-${page.path}`, "medium", `Script request count risk for ${page.path} remains bounded.`, `${page.scriptCount} script tags`);
      addFinding("a11y", page.h1Count === 1, `h1-count-${page.path}`, "high", `Rendered route ${page.path} has exactly one H1.`, String(page.h1Count));
      addFinding("a11y", page.missingAlt.length === 0, `image-alt-${page.path}`, "high", `Rendered route ${page.path} has alt attributes on images.`, page.missingAlt.join(", "));
      addFinding("a11y", page.duplicateIds.length === 0, `duplicate-ids-${page.path}`, "high", `Rendered route ${page.path} has no duplicate IDs.`, page.duplicateIds.join(", "));
      addFinding("visual", !page.hasHorizontalOverflowRisk, `html-overflow-risk-${page.path}`, "medium", `Rendered HTML for ${page.path} has no obvious fixed-width/body overflow risk.`);
    }
  }
}

function writeOptionalReport(report: unknown) {
  const output = argValue("--output");
  if (!output) return;
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
}

async function main() {
  const mode = (argValue("--mode", "all") ?? "all") as Mode;
  if (!["perf", "a11y", "visual", "all"].includes(mode)) {
    throw new Error(`Unsupported mode: ${mode}`);
  }
  const files = sourceFiles();
  if (mode === "perf" || mode === "all") auditPerformance(files);
  if (mode === "a11y" || mode === "all") auditAccessibility();
  if (mode === "visual" || mode === "all") auditVisual();
  const baseUrl = argValue("--base-url");
  if (baseUrl) await auditRendered(baseUrl);

  const selected = mode === "all" ? findings : findings.filter((finding) => finding.mode === mode);
  const blocking = selected.filter((finding) => finding.status === "failed" && ["critical", "high"].includes(finding.severity));
  const report = {
    checkedAt: new Date().toISOString(),
    mode,
    baseUrl: baseUrl ?? null,
    routeInventory: localizedPublicRoutes().length,
    renderedRoutesChecked: baseUrl ? sampleQaRoutes().length : 0,
    findings: selected,
    summary: {
      passed: selected.filter((finding) => finding.status === "passed").length,
      failed: selected.filter((finding) => finding.status === "failed").length,
      criticalFailed: blocking.filter((finding) => finding.severity === "critical").length,
      highFailed: blocking.filter((finding) => finding.severity === "high").length,
    },
  };
  writeOptionalReport(report);

  console.log(`Launch QA ${mode} complete: ${report.summary.passed} passed, ${report.summary.failed} failed, ${blocking.length} blocking.`);
  for (const finding of selected.filter((item) => item.status === "failed").slice(0, 30)) {
    console.error(`[${finding.severity}] ${finding.id}: ${finding.message}${finding.evidence ? ` (${finding.evidence})` : ""}`);
  }
  if (hasArg("--strict-medium")) {
    const mediumFailures = selected.filter((finding) => finding.status === "failed" && finding.severity === "medium");
    if (mediumFailures.length > 0) process.exitCode = 1;
  }
  if (blocking.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
