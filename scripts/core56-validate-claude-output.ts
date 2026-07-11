import fs from "node:fs";
import path from "node:path";

type Manifest = {
  batches: { slug: string; title: string; articleIds: string[] }[];
  articles: ManifestArticle[];
};

type ManifestArticle = {
  articleId: string;
  batchSlug: string;
  title: string;
  slug: string;
  primaryKeyword: string;
  moneyPage: string;
  sourceKeys: string[];
};

type ArticlePackage = {
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

type ValidationResult = {
  passed: boolean;
  batchSlug: string;
  expectedArticleIds: string[];
  actualArticleIds: string[];
  errors: string[];
  warnings: string[];
};

const defaultManifestPath = path.join(process.cwd(), "docs", "core56-claude-batches", "manifest.json");
const allowedSchema = new Set(["Article", "BreadcrumbList", "FAQPage"]);
const requiredStringFields: (keyof ArticlePackage)[] = [
  "articleId",
  "title",
  "slug",
  "metaTitle",
  "metaDescription",
  "h1",
  "excerpt",
  "primaryKeyword",
  "searchIntent",
  "targetMarket",
  "targetWords",
  "primaryMoneyPage",
  "originalAssetPlan",
  "authorReviewerNotes",
  "markdown",
];
const requiredArrayFields: (keyof ArticlePackage)[] = [
  "secondaryKeywords",
  "supportingPages",
  "recommendedSchema",
  "sourceKeysUsed",
  "internalLinks",
  "forbiddenClaimsChecklist",
];
const riskyClaimPatterns = [
  /\bguarantee(?:d|s)?\s+(?:rankings?|top\s*10|traffic|revenue|leads?|ai\s+(?:mentions?|citations?))/i,
  /\btop\s*10\s+guarantee/i,
  /\bwill\s+rank\b/i,
  /\bensure\s+(?:rankings?|top\s*10|ai\s+(?:mentions?|citations?))/i,
  /\bguaranteed\s+(?:ai\s+)?(?:mentions?|citations?)/i,
];

const args = parseArgs(process.argv.slice(2));
const batchSlug = args.batch;
const inputFile = args.file;
const manifestPath = args.manifest ?? defaultManifestPath;

if (!batchSlug || !inputFile) {
  console.error("Usage: tsx scripts/core56-validate-claude-output.ts --batch <batch-slug> --file <claude-output.json|md> [--manifest <path>]");
  process.exit(1);
}

const manifest = readJson<Manifest>(manifestPath);
const batch = manifest.batches.find((item) => item.slug === batchSlug);
if (!batch) {
  console.error(`Unknown batch '${batchSlug}'. Available batches: ${manifest.batches.map((item) => item.slug).join(", ")}`);
  process.exit(1);
}

const packages = extractArticlePackages(fs.readFileSync(inputFile, "utf8"));
const result = validateArticlePackages(batch.slug, batch.articleIds, manifest.articles, packages);
console.log(JSON.stringify(result, null, 2));
if (!result.passed) process.exitCode = 1;

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

function extractArticlePackages(raw: string): ArticlePackage[] {
  const direct = tryParsePackages(raw);
  if (direct) return direct;

  const fencedBlocks = [...raw.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi)].map((match) => match[1] ?? "").reverse();
  for (const block of fencedBlocks) {
    const parsed = tryParsePackages(block);
    if (parsed) return parsed;
  }

  throw new Error("Could not parse Claude output. Provide raw JSON or a Markdown response containing a fenced JSON block with articlePackages.");
}

function tryParsePackages(value: string): ArticlePackage[] | null {
  try {
    const parsed = JSON.parse(value.trim()) as unknown;
    if (Array.isArray(parsed)) return parsed as ArticlePackage[];
    if (isRecord(parsed) && Array.isArray(parsed.articlePackages)) return parsed.articlePackages as ArticlePackage[];
    return null;
  } catch {
    return null;
  }
}

function validateArticlePackages(
  batchSlug: string,
  expectedArticleIds: string[],
  manifestArticles: ManifestArticle[],
  packages: ArticlePackage[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const actualArticleIds = packages.map((item) => stringValue(item.articleId)).filter(Boolean);
  const expected = new Set(expectedArticleIds);
  const actual = new Set(actualArticleIds);

  for (const articleId of expectedArticleIds) {
    if (!actual.has(articleId)) errors.push(`Missing article package: ${articleId}`);
  }
  for (const articleId of actualArticleIds) {
    if (!expected.has(articleId)) errors.push(`Unexpected article package for this batch: ${articleId}`);
  }
  for (const duplicate of duplicates(actualArticleIds)) {
    errors.push(`Duplicate article package: ${duplicate}`);
  }

  const manifestById = new Map(manifestArticles.map((article) => [article.articleId, article]));
  for (const article of packages) {
    const articleId = stringValue(article.articleId);
    if (!articleId) {
      errors.push("Article package is missing articleId.");
      continue;
    }
    const manifestArticle = manifestById.get(articleId);
    if (!manifestArticle) {
      errors.push(`${articleId}: no manifest entry found.`);
      continue;
    }
    if (manifestArticle.batchSlug !== batchSlug) {
      errors.push(`${articleId}: belongs to ${manifestArticle.batchSlug}, not ${batchSlug}.`);
      continue;
    }
    validateArticlePackage(article, manifestArticle, errors, warnings);
  }

  return {
    passed: errors.length === 0,
    batchSlug,
    expectedArticleIds,
    actualArticleIds,
    errors,
    warnings,
  };
}

function validateArticlePackage(article: ArticlePackage, manifestArticle: ManifestArticle, errors: string[], warnings: string[]) {
  const articleId = manifestArticle.articleId;
  for (const field of requiredStringFields) {
    if (!stringValue(article[field])) errors.push(`${articleId}: missing required string field '${field}'.`);
  }
  for (const field of requiredArrayFields) {
    if (!Array.isArray(article[field]) || (article[field] as unknown[]).length === 0) {
      errors.push(`${articleId}: missing required non-empty array field '${field}'.`);
    }
  }

  const articleSlug = stringValue(article.slug);
  const normalizedArticleSlug = slugify(articleSlug);
  const expectedSlug = slugify(manifestArticle.slug);
  if (articleSlug && articleSlug !== normalizedArticleSlug) {
    errors.push(`${articleId}: slug '${articleSlug}' must be lowercase kebab-case without leading or trailing hyphens.`);
  }
  if (normalizedArticleSlug && normalizedArticleSlug !== expectedSlug) {
    errors.push(`${articleId}: slug '${normalizedArticleSlug}' does not match manifest slug '${expectedSlug}'.`);
  }
  if (stringValue(article.primaryKeyword) && stringValue(article.primaryKeyword).toLowerCase() !== manifestArticle.primaryKeyword.toLowerCase()) {
    errors.push(`${articleId}: primaryKeyword '${stringValue(article.primaryKeyword)}' does not match manifest primary keyword '${manifestArticle.primaryKeyword}'.`);
  }
  if (stringValue(article.primaryMoneyPage) && stringValue(article.primaryMoneyPage) !== manifestArticle.moneyPage) {
    errors.push(`${articleId}: primaryMoneyPage '${stringValue(article.primaryMoneyPage)}' does not match manifest money page '${manifestArticle.moneyPage}'.`);
  }

  const markdown = stringValue(article.markdown);
  const h1 = stringValue(article.h1);
  if (markdown && h1 && !markdown.includes(h1)) warnings.push(`${articleId}: markdown does not contain the exact H1 text.`);
  if (markdown && !markdown.trimStart().startsWith("# ")) warnings.push(`${articleId}: markdown should start with a single H1.`);

  const recommendedSchema = stringArray(article.recommendedSchema);
  for (const schema of recommendedSchema) {
    if (!allowedSchema.has(schema)) errors.push(`${articleId}: unsupported schema '${schema}'. Allowed: Article, BreadcrumbList, FAQPage.`);
  }
  const faqItems = Array.isArray(article.faq) ? article.faq : [];
  if (recommendedSchema.includes("FAQPage") && faqItems.length === 0) errors.push(`${articleId}: FAQPage schema is recommended but faq array is empty.`);
  if (!recommendedSchema.includes("FAQPage") && faqItems.length > 0) {
    warnings.push(`${articleId}: faq entries exist but FAQPage is not listed in recommendedSchema.`);
  }

  const sourceKeysUsed = sourceKeySet(article.sourceKeysUsed);
  for (const key of manifestArticle.sourceKeys) {
    if (!sourceKeysUsed.has(key)) errors.push(`${articleId}: missing workbook source key '${key}' in sourceKeysUsed.`);
  }

  const internalUrls = internalLinkUrls(article.internalLinks);
  if (!internalUrls.has(manifestArticle.moneyPage)) errors.push(`${articleId}: internalLinks must include primary money page '${manifestArticle.moneyPage}'.`);

  const metaTitle = stringValue(article.metaTitle);
  const metaDescription = stringValue(article.metaDescription);
  if (metaTitle.length > 70) warnings.push(`${articleId}: metaTitle is ${metaTitle.length} characters; target is about 60.`);
  if (metaDescription.length > 170) warnings.push(`${articleId}: metaDescription is ${metaDescription.length} characters; target is about 145-160.`);
  if (metaDescription.length < 120) warnings.push(`${articleId}: metaDescription is ${metaDescription.length} characters; consider 145-160 unless intentionally shorter.`);

  const riskText = [markdown, stringValue(article.title), stringValue(article.metaDescription)].join("\n");
  for (const pattern of riskyClaimPatterns) {
    if (pattern.test(riskText)) errors.push(`${articleId}: risky guarantee claim detected (${pattern}).`);
  }

  if (!isRecord(article.publishQaNotes)) errors.push(`${articleId}: publishQaNotes must be an object.`);
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean) : [];
}

function sourceKeySet(value: unknown) {
  const keys = new Set<string>();
  if (!Array.isArray(value)) return keys;
  for (const item of value) {
    if (typeof item === "string") keys.add(item.trim());
    if (isRecord(item) && typeof item.key === "string") keys.add(item.key.trim());
  }
  return keys;
}

function internalLinkUrls(value: unknown) {
  const urls = new Set<string>();
  if (!Array.isArray(value)) return urls;
  for (const item of value) {
    if (typeof item === "string") urls.add(item.trim());
    if (isRecord(item) && typeof item.url === "string") urls.add(item.url.trim());
  }
  return urls;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function duplicates(values: string[]) {
  const seen = new Set<string>();
  const duplicateSet = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicateSet.add(value);
    seen.add(value);
  }
  return [...duplicateSet].sort();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
