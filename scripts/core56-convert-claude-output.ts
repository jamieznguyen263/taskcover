import fs from "node:fs";
import path from "node:path";
import type { InsightArticle, InsightBlock, InsightCategorySlug, InsightFaqItem, InsightLink, InsightSource } from "../src/content/insights.types";

type Manifest = {
  articles: ManifestArticle[];
};

type ManifestArticle = {
  articleId: string;
  batchSlug: string;
  role: string;
  cluster: string;
  title: string;
  slug: string;
  primaryKeyword: string;
  moneyPage: string;
  targetWords: string;
  sourceKeys: string[];
  primaryRankingRisk: string;
};

type ClaudeSource = string | { key?: unknown; url?: unknown; title?: unknown; publisher?: unknown; primarySource?: unknown };
type ClaudeLink = string | { url?: unknown; href?: unknown; anchor?: unknown; label?: unknown; note?: unknown };

type ClaudeArticlePackage = {
  articleId?: unknown;
  title?: unknown;
  slug?: unknown;
  metaTitle?: unknown;
  metaDescription?: unknown;
  h1?: unknown;
  excerpt?: unknown;
  primaryKeyword?: unknown;
  secondaryKeywords?: unknown;
  searchIntent?: unknown;
  targetMarket?: unknown;
  targetWords?: unknown;
  primaryMoneyPage?: unknown;
  supportingPages?: unknown;
  recommendedSchema?: unknown;
  sourceKeysUsed?: unknown;
  internalLinks?: unknown;
  forbiddenClaimsChecklist?: unknown;
  originalAssetPlan?: unknown;
  authorReviewerNotes?: unknown;
  markdown?: unknown;
  faq?: unknown;
  publishQaNotes?: unknown;
};

const today = new Date().toISOString().slice(0, 10);
const defaultManifestPath = path.join(process.cwd(), "docs", "core56-claude-batches", "manifest.json");
const coverImage = "/brand/og-default.svg";

const args = parseArgs(process.argv.slice(2));
const batchSlug = args.batch;
const inputFile = args.file;
const outputFile = args.out;
const manifestPath = args.manifest ?? defaultManifestPath;

if (!batchSlug || !inputFile || !outputFile) {
  console.error("Usage: tsx scripts/core56-convert-claude-output.ts --batch <batch-slug> --file <claude-output.json|md> --out <src/content/backfill/core56-batch-XX.ts>");
  process.exit(1);
}

const manifest = readJson<Manifest>(manifestPath);
const manifestById = new Map(manifest.articles.map((article) => [article.articleId, article]));
const packages = extractArticlePackages(fs.readFileSync(inputFile, "utf8"));
const articles = packages.map((item) => toInsightArticle(item, manifestById, batchSlug));
const variableName = variableNameFor(outputFile);

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, renderTsModule(variableName, articles), "utf8");
console.log(`Converted ${articles.length} Claude article package(s) to ${outputFile}`);

function parseArgs(values: string[]) {
  const output: Record<string, string> = {};
  for (let index = 0; index < values.length; index += 1) {
    const token = values[index];
    if (!token?.startsWith("--")) continue;
    const key = token.slice(2);
    const value = values[index + 1];
    if (!value || value.startsWith("--")) {
      output[key] = "true";
      continue;
    }
    output[key] = value;
    index += 1;
  }
  return output;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function extractArticlePackages(raw: string): ClaudeArticlePackage[] {
  const direct = tryParsePackages(raw);
  if (direct) return direct;
  const fencedBlocks = [...raw.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi)].map((match) => match[1] ?? "").reverse();
  for (const block of fencedBlocks) {
    const parsed = tryParsePackages(block);
    if (parsed) return parsed;
  }
  throw new Error("Could not parse Claude output. Provide raw JSON or Markdown with a fenced JSON articlePackages block.");
}

function tryParsePackages(value: string): ClaudeArticlePackage[] | null {
  try {
    const parsed = JSON.parse(value.trim()) as unknown;
    if (Array.isArray(parsed)) return parsed as ClaudeArticlePackage[];
    if (isRecord(parsed) && Array.isArray(parsed.articlePackages)) return parsed.articlePackages as ClaudeArticlePackage[];
    return null;
  } catch {
    return null;
  }
}

function toInsightArticle(input: ClaudeArticlePackage, manifestById: Map<string, ManifestArticle>, expectedBatchSlug: string): InsightArticle {
  const articleId = requiredString(input.articleId, "articleId");
  const manifest = manifestById.get(articleId);
  if (!manifest) throw new Error(`${articleId}: no manifest entry found.`);
  if (manifest.batchSlug !== expectedBatchSlug) throw new Error(`${articleId}: belongs to ${manifest.batchSlug}, not ${expectedBatchSlug}.`);

  const h1 = requiredString(input.h1, "h1");
  const slug = slugify(requiredString(input.slug, "slug"));
  const category = categoryFor(manifest);
  const faqItems = faqItemsFor(input.faq);
  const internalLinks = linksFor(input.internalLinks);
  const serviceLinks = internalLinks.filter((link) => link.href.startsWith("/services/"));
  const industryLinks = internalLinks.filter((link) => link.href.startsWith("/industries/"));
  const marketLinks = internalLinks.filter((link) => link.href.startsWith("/markets/"));
  const sampleAuditLinks = internalLinks.filter((link) => link.href.startsWith("/work/sample-audits"));
  const blocks = [
    ...markdownToBlocks(requiredString(input.markdown, "markdown"), h1),
    ...(faqItems.length ? [{ type: "heading" as const, level: 2 as const, text: "Frequently asked questions", id: "faq" }, { type: "faq" as const, items: faqItems }] : []),
    ...internalLinks.map((link): InsightBlock => ({
      type: "related-service",
      title: link.label,
      href: link.href,
      summary: link.note ?? `Related Taskcover page for ${h1}.`,
    })),
    {
      type: "cta",
      title: `Plan the next step for ${manifest.primaryKeyword}`,
      body: "Use this article as a working brief, then validate sources, internal links, and live SERP assumptions before publishing.",
      primary: internalLinks[0] ?? { label: "Book a strategy call", href: "/book-a-call" },
      secondary: { label: "Book a strategy call", href: "/book-a-call" },
    } satisfies InsightBlock,
  ];

  const sources = sourcesFor(input.sourceKeysUsed);
  const sourceIds = sources.map((source) => source.id);
  const tags = unique([manifest.cluster, manifest.role, manifest.primaryKeyword, ...stringArray(input.secondaryKeywords)]).slice(0, 8);
  const supportingEntities = unique([manifest.cluster, manifest.role, ...stringArray(input.secondaryKeywords)]).filter((item) => item !== manifest.primaryKeyword);
  const metaTitle = requiredString(input.metaTitle, "metaTitle");
  const metaDescription = requiredString(input.metaDescription, "metaDescription");
  const relatedArticleSlugs = internalLinks
    .map((link) => link.href.match(/^\/insights\/[^/]+\/([^/]+)$/)?.[1])
    .filter((value): value is string => Boolean(value) && value !== slug);

  return {
    id: `core56-${articleId.toLowerCase()}`,
    slug,
    translationGroupId: `core56-${articleId.toLowerCase()}`,
    locale: "en",
    internalTitle: `${articleId}: ${h1}`,
    h1,
    excerpt: requiredString(input.excerpt, "excerpt"),
    category,
    tags,
    author: "Taskcover Editorial Team",
    expertReviewer: "Taskcover SEO Review",
    editor: "Taskcover Editorial Desk",
    status: "draft",
    publishedAt: today,
    updatedAt: today,
    lastFactCheckedAt: today,
    readingTime: readingTime(blocks),
    coverImage,
    coverImageAlt: `${h1} editorial framework.`,
    coverImageCaption: "Taskcover Core 56 editorial asset placeholder pending final design.",
    blocks,
    searchStrategy: {
      focusKeyword: requiredString(input.primaryKeyword, "primaryKeyword"),
      secondaryKeywords: stringArray(input.secondaryKeywords),
      primaryIntent: requiredString(input.searchIntent, "searchIntent"),
      secondaryIntents: ["commercial investigation", "implementation planning", "risk assessment"],
      targetAudience: "Founders, marketing leaders, SEO leads, content leads, and revenue teams",
      funnelStage: funnelStageFor(manifest),
      coreQuestion: firstQuestion(input.markdown) ?? `How should a business approach ${manifest.primaryKeyword}?`,
      primaryEntity: manifest.primaryKeyword,
      supportingEntities,
      topicCluster: manifest.cluster,
      parentPillar: manifest.role,
      targetMarkets: targetMarketsFor(requiredString(input.targetMarket, "targetMarket")),
      serpObservations: [
        "Generated from Claude output and Taskcover Core 56 workbook brief.",
        "Live SERP validation is still required before final publish approval.",
      ],
      featuredSnippetOpportunity: "Use the opening answer, descriptive headings, and structured blocks for extractable answers.",
      aiCitationOpportunity: "Use source-backed passages, consistent entities, and visible evidence notes; no AI citation is guaranteed.",
      uniqueInformationGain: requiredString(input.originalAssetPlan, "originalAssetPlan"),
      refreshTrigger: `Refresh on the workbook update cycle and whenever source guidance changes. Ranking risk: ${manifest.primaryRankingRisk}`,
    },
    contentEvidence: {
      sources,
      claims: [
        {
          id: `${articleId.toLowerCase()}-source-backed-claims`,
          text: "Material SEO claims in this draft must be checked against the listed source keys before publication.",
          requiresEvidence: true,
          sourceIds,
        },
      ],
      factCheckStatus: "needs-review",
      originalInsights: [requiredString(input.originalAssetPlan, "originalAssetPlan")],
      caseStudyReferences: [],
      complianceNotes: [
        "Claude-generated draft. Human SEO/editorial review required before publish.",
        "No ranking, traffic, revenue, AI mention, or AI citation guarantees are permitted.",
        ...stringArray(input.forbiddenClaimsChecklist),
      ],
    },
    internalLinking: {
      requiredInternalLinks: internalLinks,
      suggestedInternalLinks: [],
      serviceLinks,
      industryLinks,
      marketLinks,
      caseStudyLinks: [],
      sampleAuditLinks,
      relatedArticleSlugs,
      recommendedAnchors: internalLinks.map((link) => link.label),
    },
    metadata: {
      metaTitle,
      metaDescription,
      canonical: `/insights/${category}/${slug}`,
      robots: "index,follow",
      ogTitle: metaTitle,
      ogDescription: metaDescription,
      ogImage: coverImage,
      twitterTitle: metaTitle,
      twitterDescription: metaDescription,
      twitterImage: coverImage,
      breadcrumbLabel: h1,
    },
    schema: {
      schemaType: "Article",
      faqItems,
      aboutEntities: [manifest.primaryKeyword, ...supportingEntities],
      mentions: tags,
      citationReferences: sources.map((source) => source.url),
    },
    localization: {
      hreflangGroup: `core56-${articleId.toLowerCase()}`,
      xDefaultSlug: slug,
      translationStatus: "complete",
      translationNotes: "English source article generated from Claude output. FR/ES localizations must be created after EN review and publish.",
      sourceLocale: "en",
      localeReviewStatus: "approved",
      localeKeyword: requiredString(input.primaryKeyword, "primaryKeyword"),
    },
    publishQa: {
      summary: "Converted from Claude Core 56 output. Requires source, SERP, and editor review before publish.",
      checkedAt: today,
    },
  };
}

function markdownToBlocks(markdown: string, h1: string): InsightBlock[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: InsightBlock[] = [
    {
      type: "direct-answer",
      title: "Executive answer",
      answer: firstParagraph(markdown) || `This article explains ${h1}.`,
    },
  ];
  let paragraph: string[] = [];
  let bullets: string[] = [];
  let numbers: string[] = [];

  const flushParagraph = () => {
    const text = paragraph.join(" ").trim();
    if (text) blocks.push({ type: "paragraph", text });
    paragraph = [];
  };
  const flushBullets = () => {
    if (bullets.length) blocks.push({ type: "bullet-list", items: bullets });
    bullets = [];
  };
  const flushNumbers = () => {
    if (numbers.length) blocks.push({ type: "numbered-list", items: numbers });
    numbers = [];
  };
  const flushAll = () => {
    flushParagraph();
    flushBullets();
    flushNumbers();
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushAll();
      continue;
    }
    if (/^#\s+/.test(line)) continue;
    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      flushAll();
      blocks.push({ type: "heading", level: Math.min(4, heading[1]!.length) as 2 | 3 | 4, text: stripMarkdown(heading[2]!) });
      continue;
    }
    const bullet = line.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      flushNumbers();
      bullets.push(stripMarkdown(bullet[1]!));
      continue;
    }
    const numbered = line.match(/^\d+\.\s+(.+)$/);
    if (numbered) {
      flushParagraph();
      flushBullets();
      numbers.push(stripMarkdown(numbered[1]!));
      continue;
    }
    if (/^\|/.test(line)) {
      flushAll();
      blocks.push({ type: "paragraph", text: stripMarkdown(line) });
      continue;
    }
    paragraph.push(stripMarkdown(line));
  }
  flushAll();
  return blocks;
}

function renderTsModule(variableName: string, articles: InsightArticle[]) {
  return [
    'import type { InsightArticle } from "@/content/insights.types";',
    "",
    `export const ${variableName} = ${JSON.stringify(articles, null, 2)} satisfies InsightArticle[];`,
    "",
  ].join("\n");
}

function variableNameFor(outputFile: string) {
  const base = path.basename(outputFile, path.extname(outputFile));
  return `${base.replace(/[^a-zA-Z0-9]+(.)/g, (_, character: string) => character.toUpperCase()).replace(/^[0-9]/, "_$&")}Articles`;
}

function categoryFor(article: ManifestArticle): InsightCategorySlug {
  const text = `${article.cluster} ${article.moneyPage}`.toLowerCase();
  if (text.includes("ai search") || text.includes("geo")) return "ai-search";
  if (text.includes("technical") || text.includes("audit") || text.includes("migration") || text.includes("crawl")) return "technical-seo";
  if (text.includes("content") || text.includes("topical") || text.includes("digital pr") || text.includes("link building")) return "content-authority";
  if (text.includes("local") || text.includes("international") || text.includes("franchise") || text.includes("healthcare") || text.includes("travel") || text.includes("education")) return "local-international-seo";
  if (text.includes("ppc")) return "ppc-search-intelligence";
  if (text.includes("consult") || text.includes("mentor") || text.includes("in-house")) return "seo-mentor";
  return "seo-guides";
}

function funnelStageFor(article: ManifestArticle): InsightArticle["searchStrategy"]["funnelStage"] {
  if (/pricing|choose|comparison|agency|consultant/i.test(article.title)) return "decision";
  if (/what|how|guide|checklist|framework|strategy/i.test(article.title)) return "consideration";
  return "awareness";
}

function sourcesFor(value: unknown): InsightSource[] {
  const items = Array.isArray(value) ? (value as ClaudeSource[]) : [];
  return items.map((item, index) => {
    if (typeof item === "string") return sourceFromParts(`source-${index + 1}`, item, undefined, undefined);
    if (isRecord(item)) {
      return sourceFromParts(stringValue(item.key) || `source-${index + 1}`, stringValue(item.url), stringValue(item.title), stringValue(item.publisher), item.primarySource === true);
    }
    return sourceFromParts(`source-${index + 1}`, "", undefined, undefined);
  });
}

function sourceFromParts(key: string, url: string, title?: string, publisher?: string, primarySource?: boolean): InsightSource {
  const safeUrl = url || `https://example.com/${key}`;
  let hostname = "External source";
  try {
    hostname = new URL(safeUrl).hostname.replace(/^www\./, "");
  } catch {
    hostname = "External source";
  }
  return {
    id: slugify(key),
    title: title || key,
    publisher: publisher || hostname,
    url: safeUrl,
    accessedAt: today,
    primarySource: primarySource ?? (hostname.includes("google") || hostname.includes("schema.org")),
    supportsClaimIds: [],
    locale: "global",
  };
}

function linksFor(value: unknown): InsightLink[] {
  const items = Array.isArray(value) ? (value as ClaudeLink[]) : [];
  return uniqueByHref(
    items
      .map((item): InsightLink | null => {
        if (typeof item === "string") return { href: item, label: labelFromHref(item) };
        if (!isRecord(item)) return null;
        const href = stringValue(item.url) || stringValue(item.href);
        if (!href) return null;
        return { href, label: stringValue(item.anchor) || stringValue(item.label) || labelFromHref(href), note: stringValue(item.note) || undefined };
      })
      .filter((item): item is InsightLink => Boolean(item))
  );
}

function faqItemsFor(value: unknown): InsightFaqItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!isRecord(item)) return null;
      const question = stringValue(item.question);
      const answer = stringValue(item.answer);
      return question && answer ? { question, answer } : null;
    })
    .filter((item): item is InsightFaqItem => Boolean(item));
}

function targetMarketsFor(value: string) {
  if (/global english/i.test(value)) return ["Global English"];
  return value.split(/[,;/]/).map((item) => item.trim()).filter(Boolean);
}

function firstQuestion(value: unknown) {
  const markdown = stringValue(value);
  const match = markdown.match(/(?:^|\n)#{2,4}\s+([^#\n?]+\?)/);
  return match?.[1]?.trim();
}

function firstParagraph(markdown: string) {
  return markdown
    .replace(/^# .+$/m, "")
    .split(/\n\s*\n/)
    .map((part) => stripMarkdown(part.trim()))
    .find((part) => part.length > 60);
}

function readingTime(blocks: InsightBlock[]) {
  const words = blocks
    .map((block) => JSON.stringify(block))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function requiredString(value: unknown, field: string) {
  const result = stringValue(value);
  if (!result) throw new Error(`Missing required field '${field}'.`);
  return result;
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean) : [];
}

function stripMarkdown(value: string) {
  return value
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function labelFromHref(href: string) {
  return href.split("/").filter(Boolean).at(-1)?.replace(/-/g, " ") ?? href;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function unique(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function uniqueByHref(links: InsightLink[]) {
  const seen = new Set<string>();
  return links.filter((link) => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
