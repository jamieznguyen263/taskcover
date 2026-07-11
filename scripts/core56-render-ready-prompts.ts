import fs from "node:fs";
import path from "node:path";

type Manifest = {
  batches: {
    slug: string;
    title: string;
    file: string;
    articleIds: string[];
  }[];
};

const args = new Set(process.argv.slice(2));
const validateOnly = args.has("--validate-only");

const root = process.cwd();
const batchDir = path.join(root, "docs", "core56-claude-batches");
const readyDir = path.join(root, "docs", "core56-claude-ready-prompts");
const manifestPath = path.join(batchDir, "manifest.json");
const masterPromptPath = path.join(root, "docs", "core56-claude-master-prompt.vi.md");
const contractPath = path.join(root, "docs", "core56-claude-output-contract.md");

const manifest = readJson<Manifest>(manifestPath);
const masterPrompt = fs.readFileSync(masterPromptPath, "utf8").trim();
const outputContract = fs.readFileSync(contractPath, "utf8").trim();

const renderedFiles = new Map<string, string>();
renderedFiles.set("README.md", renderReadme(manifest));

for (const batch of manifest.batches) {
  const batchBriefPath = path.join(batchDir, batch.file);
  const batchBrief = fs.readFileSync(batchBriefPath, "utf8").trim();
  renderedFiles.set(`${batch.slug}.md`, renderReadyPrompt(batch, masterPrompt, outputContract, batchBrief));
}

if (validateOnly) {
  const failures: string[] = [];

  for (const [file, expected] of renderedFiles) {
    const target = path.join(readyDir, file);
    if (!fs.existsSync(target)) {
      failures.push(`${file}: missing`);
      continue;
    }

    const actual = fs.readFileSync(target, "utf8").trimEnd();
    if (actual !== expected.trimEnd()) {
      failures.push(`${file}: stale`);
    }
  }

  const unexpected = fs.existsSync(readyDir)
    ? fs
        .readdirSync(readyDir)
        .filter((file) => file.endsWith(".md") && !renderedFiles.has(file))
        .sort()
    : [];

  for (const file of unexpected) failures.push(`${file}: unexpected`);

  const result = {
    passed: failures.length === 0,
    promptCount: manifest.batches.length,
    articleCount: manifest.batches.reduce((sum, batch) => sum + batch.articleIds.length, 0),
    failures,
  };

  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) process.exit(1);
} else {
  fs.mkdirSync(readyDir, { recursive: true });
  for (const [file, content] of renderedFiles) {
    fs.writeFileSync(path.join(readyDir, file), `${content.trimEnd()}\n`, "utf8");
  }

  console.log(
    `Rendered ${manifest.batches.length} ready-to-send Claude prompt files for ${manifest.batches.reduce(
      (sum, batch) => sum + batch.articleIds.length,
      0,
    )} Core 56 articles to ${path.relative(root, readyDir)}`,
  );
}

function renderReadme(manifest: Manifest): string {
  const lines = [
    "# Core 56 Ready Claude Prompts",
    "",
    "These files are generated one-file prompts for Claude. Each prompt includes the master instructions, output contract, and one batch brief, so the operator does not need to assemble multiple documents manually.",
    "",
    "Regenerate prompts after changing the master prompt, output contract, or batch briefs:",
    "",
    "```powershell",
    "npm run core56:claude:prompts",
    "```",
    "",
    "Validate the generated prompts are current:",
    "",
    "```powershell",
    "npm run core56:claude:prompts:validate",
    "```",
    "",
    "Recommended execution order:",
    "",
    "| Order | Batch | Articles | Prompt file |",
    "|---:|---|---|---|",
  ];

  manifest.batches.forEach((batch, index) => {
    lines.push(`| ${index + 1} | ${batch.title} | ${batch.articleIds.join(", ")} | \`${batch.slug}.md\` |`);
  });

  lines.push(
    "",
    "After Claude returns a batch, save the response to `.claude-output/claude-<batch>.md`, then run the matching validation and conversion commands from `docs/core56-backfill-publication-runbook.vi.md`.",
  );

  return lines.join("\n");
}

function renderReadyPrompt(
  batch: Manifest["batches"][number],
  masterPrompt: string,
  outputContract: string,
  batchBrief: string,
): string {
  return [
    `# Ready Claude Prompt - ${batch.title}`,
    "",
    "Copy this whole file into Claude as one request. Do not send more than one batch per request.",
    "",
    "## Operator Instruction",
    "",
    "You are Claude. Complete only the article IDs listed in this prompt. Return a complete `articlePackages` JSON payload that passes the Taskcover validation contract below. Do not add articles outside this batch.",
    "",
    `Batch slug: \`${batch.slug}\``,
    `Required article IDs: ${batch.articleIds.map((id) => `\`${id}\``).join(", ")}`,
    "",
    "If live browsing is available, verify current primary sources before writing any current Google, AI Search, schema, hreflang, Core Web Vitals, platform, or standards claim. If live browsing is unavailable, mark the exact claim/source limitation in `publishQaNotes.humanVerificationNeeded` instead of inventing facts.",
    "",
    "The final response must include a fenced JSON block with a top-level `articlePackages` array. Every article package must include full Markdown body content, source URLs, internal links, forbidden-claims checklist, original asset plan, and publish QA notes.",
    "",
    "---",
    "",
    "## Master Prompt",
    "",
    masterPrompt,
    "",
    "---",
    "",
    "## Output Contract",
    "",
    outputContract,
    "",
    "---",
    "",
    "## Batch Brief",
    "",
    batchBrief,
  ].join("\n");
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}
