import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { JSDOM } from "jsdom";

type Severity = "critical" | "high" | "medium" | "low" | "info";

type CrawlFinding = {
  severity: Severity;
  url: string;
  issue: string;
  evidence?: string;
};

type PageReport = {
  url: string;
  status: number;
  redirectChain: string[];
  finalUrl: string;
  canonical: string | null;
  robots: string | null;
  title: string | null;
  metaDescription: string | null;
  h1Count: number;
  h1Text: string[];
  serverLang: string | null;
  renderedLang: string | null;
  hreflang: Record<string, string>;
  openGraph: {
    title: string | null;
    description: string | null;
    url: string | null;
    image: string | null;
  };
  structuredDataTypes: string[];
  internalLinks: string[];
  images: { src: string; alt: string | null; missingAlt: boolean }[];
  indexable: boolean;
  sitemapIncluded: boolean;
};

function argValue(name: string, fallback?: string) {
  const inline = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const baseUrl = argValue("--base-url") ?? "http://localhost:3000";
const limit = Number(argValue("--limit", "400"));
const output = argValue("--output", ".next\\seo-crawl-report.json");
const outputPath = output ?? ".next\\seo-crawl-report.json";
const base = new URL(baseUrl);

const pageExtensions = /\.(png|jpe?g|webp|gif|svg|ico|css|js|mjs|map|json|txt|xml|pdf|woff2?)$/i;
const pageCache = new Map<string, Promise<{ status: number; finalUrl: string; redirectChain: string[]; body: string }>>();
const assetCache = new Map<string, Promise<number>>();

function sameOriginUrl(value: string, currentUrl: string) {
  try {
    const url = new URL(value, currentUrl);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    if (url.origin !== base.origin) return null;
    url.hash = "";
    return url;
  } catch {
    return null;
  }
}

function isCrawlablePage(url: URL) {
  if (pageExtensions.test(url.pathname)) return false;
  if (url.pathname.startsWith("/_next/")) return false;
  if (url.pathname.startsWith("/api/")) return false;
  return true;
}

function normalizedPageKey(url: URL) {
  return `${url.pathname}${url.search}`;
}

async function fetchPage(url: string) {
  if (pageCache.has(url)) return pageCache.get(url)!;
  const task = fetchPageUncached(url);
  pageCache.set(url, task);
  return task;
}

async function fetchPageUncached(url: string) {
  const redirectChain: string[] = [];
  let current = url;
  for (let i = 0; i < 8; i += 1) {
    const response = await fetch(current, {
      redirect: "manual",
      headers: { "user-agent": "TaskcoverSeoCrawler/1.0" },
    });
    redirectChain.push(`${response.status} ${current}`);
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return { status: response.status, finalUrl: current, redirectChain, body: "" };
      current = new URL(location, current).toString();
      continue;
    }
    return {
      status: response.status,
      finalUrl: current,
      redirectChain,
      body: await response.text(),
    };
  }
  return { status: 599, finalUrl: current, redirectChain, body: "" };
}

async function fetchAssetStatus(url: string) {
  if (assetCache.has(url)) return assetCache.get(url)!;
  const task = fetch(url, {
    headers: { "user-agent": "TaskcoverSeoCrawler/1.0" },
  })
    .then((response) => response.status)
    .catch(() => 599);
  assetCache.set(url, task);
  return task;
}

async function fetchSitemapPaths() {
  const url = new URL("/sitemap.xml", base).toString();
  const result = await fetchPage(url);
  if (result.status !== 200) return { status: result.status, paths: [] as string[] };
  const paths = [...result.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
    const loc = new URL(match[1]);
    return `${loc.pathname}${loc.search}`;
  });
  return { status: result.status, paths };
}

async function fetchRobots() {
  const result = await fetchPage(new URL("/robots.txt", base).toString());
  return { status: result.status, body: result.body };
}

function collectStructuredDataTypes(document: Document) {
  const types: string[] = [];
  for (const script of Array.from(document.querySelectorAll('script[type="application/ld+json"]'))) {
    try {
      const parsed = JSON.parse(script.textContent ?? "");
      const records = Array.isArray(parsed) ? parsed : [parsed, ...(Array.isArray(parsed["@graph"]) ? parsed["@graph"] : [])];
      for (const record of records) {
        const type = record?.["@type"];
        if (Array.isArray(type)) types.push(...type.map(String));
        if (typeof type === "string") types.push(type);
      }
    } catch {
      types.push("INVALID_JSON_LD");
    }
  }
  return [...new Set(types)];
}

function metaContent(document: Document, selector: string) {
  return document.querySelector<HTMLMetaElement>(selector)?.content?.trim() || null;
}

function linkHref(document: Document, selector: string) {
  return document.querySelector<HTMLLinkElement>(selector)?.href || null;
}

function pageLocale(pathname: string) {
  if (pathname === "/fr" || pathname.startsWith("/fr/")) return "fr";
  if (pathname === "/es" || pathname.startsWith("/es/")) return "es";
  return "en";
}

function parsePage(url: string, result: Awaited<ReturnType<typeof fetchPage>>, sitemapPaths: Set<string>): PageReport {
  const serverLang = result.body.match(/<html[^>]*\slang=["']([^"']+)["']/i)?.[1] ?? null;
  const dom = new JSDOM(result.body, {
    url: result.finalUrl,
    runScripts: "dangerously",
    beforeParse(window: Window & typeof globalThis) {
      window.requestAnimationFrame = (callback: FrameRequestCallback) =>
        window.setTimeout(() => callback(Date.now()), 0);
      window.cancelAnimationFrame = (id: number) => window.clearTimeout(id);
    },
  });
  const document = dom.window.document;
  const internalLinks = [...new Set(
    Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))
      .map((anchor) => sameOriginUrl(anchor.getAttribute("href") ?? "", result.finalUrl))
      .filter((item): item is URL => Boolean(item))
      .map(normalizedPageKey)
  )];
  const images = Array.from(document.querySelectorAll<HTMLImageElement>("img[src]")).map((image) => ({
    src: image.getAttribute("src") ?? "",
    alt: image.getAttribute("alt"),
    missingAlt: !image.hasAttribute("alt"),
  }));
  const final = new URL(result.finalUrl);
  const path = normalizedPageKey(final);
  const robots = metaContent(document, 'meta[name="robots" i]');
  return {
    url,
    status: result.status,
    redirectChain: result.redirectChain,
    finalUrl: result.finalUrl,
    canonical: linkHref(document, 'link[rel="canonical" i]'),
    robots,
    title: document.querySelector("title")?.textContent?.trim() || null,
    metaDescription: metaContent(document, 'meta[name="description" i]'),
    h1Count: document.querySelectorAll("h1").length,
    h1Text: Array.from(document.querySelectorAll("h1")).map((h1) => h1.textContent?.replace(/\s+/g, " ").trim() ?? ""),
    serverLang,
    renderedLang: document.documentElement.lang || null,
    hreflang: Object.fromEntries(
      Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="alternate" i][hreflang]')).map((link) => [
        link.hreflang,
        link.href,
      ])
    ),
    openGraph: {
      title: metaContent(document, 'meta[property="og:title" i]'),
      description: metaContent(document, 'meta[property="og:description" i]'),
      url: metaContent(document, 'meta[property="og:url" i]'),
      image: metaContent(document, 'meta[property="og:image" i]'),
    },
    structuredDataTypes: collectStructuredDataTypes(document),
    internalLinks,
    images,
    indexable: result.status === 200 && !/noindex/i.test(robots ?? ""),
    sitemapIncluded: sitemapPaths.has(path),
  };
}

/**
 * Insight article detail pages (/insights/[category]/[article]) may legitimately
 * omit fr/es hreflang: getInsightAlternateLanguages() (src/lib/insights/content.ts)
 * only advertises locales that have a published sibling in the same translation
 * group, so English-only articles never link to a fr/es URL that would 404.
 * Category listing pages (/insights/[category]) are unaffected and still require
 * full locale coverage.
 */
function isInsightArticleDetailPath(pathname: string) {
  const stripped = pathname.replace(/^\/(fr|es)(?=\/|$)/, "");
  return /^\/insights\/[^/]+\/[^/]+\/?$/.test(stripped);
}

function auditPage(page: PageReport, sitemapPaths: Set<string>) {
  const findings: CrawlFinding[] = [];
  const final = new URL(page.finalUrl);
  const path = normalizedPageKey(final);
  const expectedLocale = pageLocale(final.pathname);
  const isArticleDetail = isInsightArticleDetailPath(final.pathname);

  if (page.status >= 500) findings.push({ severity: "critical", url: page.url, issue: "Route returned 5xx", evidence: String(page.status) });
  if (page.status === 404 && sitemapPaths.has(path)) findings.push({ severity: "critical", url: page.url, issue: "Sitemap URL returned 404" });
  if (page.status >= 400 && page.status !== 404) findings.push({ severity: "high", url: page.url, issue: "Route returned non-OK status", evidence: String(page.status) });

  if (page.indexable) {
    if (!page.title) findings.push({ severity: "critical", url: page.url, issue: "Indexable page is missing title" });
    if (!page.metaDescription) findings.push({ severity: "high", url: page.url, issue: "Indexable page is missing meta description" });
    if (!page.canonical) findings.push({ severity: "high", url: page.url, issue: "Indexable page is missing canonical" });
    if (page.h1Count !== 1) findings.push({ severity: "high", url: page.url, issue: "Indexable page should have exactly one H1", evidence: String(page.h1Count) });
    const requiredHreflang = isArticleDetail ? ["en", "x-default"] : ["en", "fr", "es", "x-default"];
    for (const code of requiredHreflang) {
      if (!page.hreflang[code]) findings.push({ severity: "high", url: page.url, issue: `Missing hreflang ${code}` });
    }
    if (!page.openGraph.title) findings.push({ severity: "medium", url: page.url, issue: "Missing OG title" });
    if (!page.openGraph.description) findings.push({ severity: "medium", url: page.url, issue: "Missing OG description" });
    if (!page.openGraph.url) findings.push({ severity: "medium", url: page.url, issue: "Missing OG URL" });
    if (!page.openGraph.image) findings.push({ severity: "medium", url: page.url, issue: "Missing OG image" });
  }

  if (page.sitemapIncluded && !page.indexable) {
    findings.push({ severity: "critical", url: page.url, issue: "Sitemap URL is not indexable", evidence: page.robots ?? String(page.status) });
  }

  if (page.status === 200 && page.renderedLang !== expectedLocale) {
    findings.push({ severity: "high", url: page.url, issue: "Rendered html lang does not match route locale", evidence: `expected=${expectedLocale} actual=${page.renderedLang}` });
  } else if (page.status === 200 && page.serverLang && page.serverLang !== expectedLocale) {
    findings.push({ severity: "info", url: page.url, issue: "Server HTML lang is corrected by the pre-paint script", evidence: `server=${page.serverLang} rendered=${page.renderedLang}` });
  }

  if (page.structuredDataTypes.includes("INVALID_JSON_LD")) {
    findings.push({ severity: "high", url: page.url, issue: "Invalid JSON-LD found" });
  }

  for (const image of page.images) {
    if (image.missingAlt) findings.push({ severity: "medium", url: page.url, issue: "Image missing alt attribute", evidence: image.src });
  }

  const bodyText = `${page.title ?? ""} ${page.metaDescription ?? ""} ${page.h1Text.join(" ")}`;
  if (expectedLocale === "fr" && /\b(Get Free SEO Audit|Book Strategy Call|View market)\b/.test(bodyText)) {
    findings.push({ severity: "medium", url: page.url, issue: "Potential English metadata/UI text on French route" });
  }
  if (expectedLocale === "es" && /\b(Get Free SEO Audit|Book Strategy Call|View market)\b/.test(bodyText)) {
    findings.push({ severity: "medium", url: page.url, issue: "Potential English metadata/UI text on Spanish route" });
  }

  return findings;
}

async function main() {
  const sitemap = await fetchSitemapPaths();
  const robots = await fetchRobots();
  const sitemapPaths = new Set(sitemap.paths);
  const queue = [
    ...sitemap.paths.map((path) => new URL(path, base).toString()),
    new URL("/pricing?tab=mentor", base).toString(),
    new URL("/fr/pricing?tab=mentor", base).toString(),
    new URL("/es/pricing?tab=mentor", base).toString(),
    new URL("/thank-you", base).toString(),
    new URL("/admin", base).toString(),
    new URL("/admin/insights/example/preview", base).toString(),
    new URL("/not-a-real-route-for-seo-crawl", base).toString(),
  ];
  const seen = new Set<string>();
  const pages: PageReport[] = [];
  const linkRefs = new Map<string, Set<string>>();

  while (queue.length > 0 && seen.size < limit) {
    const next = queue.shift();
    if (!next) break;
    const key = normalizedPageKey(new URL(next));
    if (seen.has(key)) continue;
    seen.add(key);
    const result = await fetchPage(next);
    if ((result.status === 200 && /<html/i.test(result.body.slice(0, 5000))) || result.body.includes("<html")) {
      const page = parsePage(next, result, sitemapPaths);
      pages.push(page);
      for (const link of page.internalLinks) {
        if (page.indexable) {
          if (!linkRefs.has(link)) linkRefs.set(link, new Set());
          linkRefs.get(link)!.add(key);
        }
        const linkUrl = new URL(link, base);
        if (page.indexable && isCrawlablePage(linkUrl) && !seen.has(normalizedPageKey(linkUrl))) {
          queue.push(linkUrl.toString());
        }
      }
      for (const image of page.images) {
        const imageUrl = sameOriginUrl(image.src, page.finalUrl);
        if (!imageUrl || image.src.startsWith("data:")) continue;
        const status = await fetchAssetStatus(imageUrl.toString());
        if (status >= 400) {
          page.images = page.images.map((item) => item === image ? { ...item, src: `${item.src} (broken:${status})` } : item);
        }
      }
    } else {
      pages.push({
        url: next,
        status: result.status,
        redirectChain: result.redirectChain,
        finalUrl: result.finalUrl,
        canonical: null,
        robots: null,
        title: null,
        metaDescription: null,
        h1Count: 0,
        h1Text: [],
        serverLang: null,
        renderedLang: null,
        hreflang: {},
        openGraph: { title: null, description: null, url: null, image: null },
        structuredDataTypes: [],
        internalLinks: [],
        images: [],
        indexable: false,
        sitemapIncluded: sitemapPaths.has(key),
      });
    }
  }

  const findings = pages.flatMap((page) => auditPage(page, sitemapPaths));
  for (const [link, refs] of linkRefs) {
    const linkedPage = pages.find((page) => normalizedPageKey(new URL(page.url)) === link || normalizedPageKey(new URL(page.finalUrl)) === link);
    if (linkedPage && linkedPage.status >= 400) {
      findings.push({
        severity: "high",
        url: [...refs].slice(0, 3).join(", "),
        issue: "Broken internal link",
        evidence: `${link} returned ${linkedPage.status}`,
      });
    }
  }

  for (const page of pages) {
    for (const image of page.images.filter((item) => item.src.includes("(broken:"))) {
      findings.push({ severity: "high", url: page.url, issue: "Broken image", evidence: image.src });
    }
  }

  const report = {
    baseUrl: base.toString().replace(/\/$/, ""),
    crawledAt: new Date().toISOString(),
    robots: {
      status: robots.status,
      hasSitemap: robots.body.includes("Sitemap:"),
      disallowsPrivatePaths: ["/admin", "/api", "/thank-you"].every((path) => robots.body.includes(path)),
    },
    sitemap: {
      status: sitemap.status,
      urlCount: sitemap.paths.length,
    },
    pages,
    findings,
    summary: {
      crawledPages: pages.length,
      indexablePages: pages.filter((page) => page.indexable).length,
      critical: findings.filter((finding) => finding.severity === "critical").length,
      high: findings.filter((finding) => finding.severity === "high").length,
      medium: findings.filter((finding) => finding.severity === "medium").length,
      low: findings.filter((finding) => finding.severity === "low").length,
      info: findings.filter((finding) => finding.severity === "info").length,
    },
  };

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`SEO crawl complete: ${report.summary.crawledPages} pages, ${report.summary.critical} critical, ${report.summary.high} high. Report: ${outputPath}`);
  if (report.summary.critical > 0 || report.summary.high > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
