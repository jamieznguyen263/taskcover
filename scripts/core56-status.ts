import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import type { InsightArticle } from "../src/content/insights.types";

type Manifest = {
  batchCount: number;
  articleCount: number;
  batches: { slug: string; title: string; file: string; articleIds: string[] }[];
  articles: { articleId: string; batchSlug: string; title: string; slug: string; moneyPage: string }[];
};

type TrackerRow = {
  article_id: string;
  batch_slug: string;
  claude_output_status: string;
  validation_status: string;
  converted_backfill_file: string;
  import_status: string;
  publish_status: string;
  post_publish_qa_status: string;
};

const manifestPath = path.join(process.cwd(), "docs", "core56-claude-batches", "manifest.json");
const trackerPath = path.join(process.cwd(), "docs", "core56-claude-batches", "publication-tracker.csv");
const backfillDir = path.join(process.cwd(), "src", "content", "backfill");

loadEnvConfig(process.cwd());

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Core 56 status audit failed.");
  process.exit(1);
});

async function main() {
  const manifest = readJson<Manifest>(manifestPath);
  const trackerRows = fs.existsSync(trackerPath) ? parseCsv(fs.readFileSync(trackerPath, "utf8")) : [];
  const backfillArticles = await loadBackfillArticles();
  const backfillArticleIds = backfillArticles.map((article) => article.id.replace(/^core56-/, "").toUpperCase());
  const dbStatus = process.env.DATABASE_URL ? await readDatabaseStatus(process.env.DATABASE_URL) : null;

  const manifestIds = manifest.articles.map((article) => article.articleId);
  const trackerIds = trackerRows.map((row) => row.article_id);
  const result = {
    passed: true,
    counts: {
      manifestBatches: manifest.batchCount,
      manifestArticles: manifest.articleCount,
      trackerRows: trackerRows.length,
      convertedBackfillArticles: backfillArticles.length,
      databaseCore56Groups: dbStatus?.groups ?? null,
      databaseCore56Localizations: dbStatus?.localizations ?? null,
      databaseCore56PublishedSnapshots: dbStatus?.publishedSnapshots ?? null,
      databaseCore56PublishedGroups: dbStatus?.publishedGroups ?? null,
    },
    manifestCoverage: {
      duplicateManifestIds: duplicates(manifestIds),
      trackerMissingIds: sortedDifference(manifestIds, trackerIds),
      trackerExtraIds: sortedDifference(trackerIds, manifestIds),
      backfillMissingIds: sortedDifference(manifestIds, backfillArticleIds),
      backfillExtraIds: sortedDifference(backfillArticleIds, manifestIds),
    },
    trackerStatus: summarizeTracker(trackerRows),
    backfillArticles: backfillArticles.map((article) => ({
      articleId: article.id.replace(/^core56-/, "").toUpperCase(),
      slug: article.slug,
      category: article.category,
      status: article.status,
      locale: article.locale,
    })),
    databaseStatus: dbStatus,
    incompleteObjective: {
      needsClaudeOutputFor: sortedDifference(manifestIds, backfillArticleIds),
      needsImportOrPublishEvidence: dbStatus ? Math.max(0, manifest.articleCount - dbStatus.groups) : manifest.articleCount,
      goalComplete: false,
      reason: "The objective requires 56 completed, QA'd, imported, and published articles. Current evidence does not prove that state.",
    },
  };

  console.log(JSON.stringify(result, null, 2));
}

async function loadBackfillArticles(): Promise<InsightArticle[]> {
  if (!fs.existsSync(backfillDir)) return [];
  const articles: InsightArticle[] = [];
  const files = fs
    .readdirSync(backfillDir)
    .filter((file) => /^core56-batch-.+\.ts$/.test(file))
    .sort();
  for (const file of files) {
    const moduleExports = (await import(pathToFileURL(path.join(backfillDir, file)).href)) as Record<string, unknown>;
    for (const value of Object.values(moduleExports)) {
      if (isInsightArticleArray(value)) articles.push(...value);
    }
  }
  return articles;
}

async function readDatabaseStatus(databaseUrl: string) {
  const sql = postgres(databaseUrl, { max: 1, prepare: false });
  try {
    const [row] = await sql<{
      groups: number;
      localizations: number;
      published_snapshots: number;
      published_groups: number;
      draft_groups: number;
    }[]>`
      SELECT
        (SELECT count(*)::int FROM insight_article_groups WHERE creation_key LIKE 'core56-%') AS groups,
        (
          SELECT count(*)::int
          FROM insight_article_localizations l
          JOIN insight_article_groups g ON g.id = l.article_group_id
          WHERE g.creation_key LIKE 'core56-%'
        ) AS localizations,
        (
          SELECT count(*)::int
          FROM insight_article_localizations l
          JOIN insight_article_groups g ON g.id = l.article_group_id
          WHERE g.creation_key LIKE 'core56-%' AND l.published_snapshot IS NOT NULL
        ) AS published_snapshots,
        (SELECT count(*)::int FROM insight_article_groups WHERE creation_key LIKE 'core56-%' AND published_revision_group_id IS NOT NULL) AS published_groups,
        (SELECT count(*)::int FROM insight_article_groups WHERE creation_key LIKE 'core56-%' AND draft_workflow_status = 'draft') AS draft_groups
    `;
    return {
      groups: row?.groups ?? 0,
      localizations: row?.localizations ?? 0,
      publishedSnapshots: row?.published_snapshots ?? 0,
      publishedGroups: row?.published_groups ?? 0,
      draftGroups: row?.draft_groups ?? 0,
    };
  } finally {
    await sql.end({ timeout: 5 }).catch(() => undefined);
  }
}

function summarizeTracker(rows: TrackerRow[]) {
  return {
    claudeOutput: countBy(rows, "claude_output_status"),
    validation: countBy(rows, "validation_status"),
    import: countBy(rows, "import_status"),
    publish: countBy(rows, "publish_status"),
    postPublishQa: countBy(rows, "post_publish_qa_status"),
  };
}

function parseCsv(raw: string): TrackerRow[] {
  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]!).map((header) => header.replace(/^\uFEFF/, "").trim());
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])) as TrackerRow;
  });
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
      continue;
    }
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (char === "," && !quoted) {
      values.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  values.push(current);
  return values;
}

function countBy(rows: TrackerRow[], field: keyof TrackerRow) {
  return rows.reduce<Record<string, number>>((counts, row) => {
    const value = row[field] || "(empty)";
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function sortedDifference(left: string[], right: string[]) {
  const rightSet = new Set(right);
  return [...new Set(left.filter((item) => !rightSet.has(item)))].sort();
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

function isInsightArticleArray(value: unknown): value is InsightArticle[] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Partial<InsightArticle>;
      return typeof candidate.id === "string" && typeof candidate.slug === "string" && candidate.locale === "en" && Array.isArray(candidate.blocks);
    })
  );
}
