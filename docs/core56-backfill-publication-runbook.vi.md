# Core 56 Backfill Publication Runbook

Muc tieu: dua 56 bai Core 56 tu workbook -> Claude draft -> Codex validate/convert -> Insights draft -> publish EN theo dot ngan, khong lam hong technical SEO.

## Source Of Truth

- Workbook: `C:\Users\Gamelap\OneDrive\Desktop\Taskcover.com\Taskcover_Core_56_Final_Outlines_Top10_Readiness_9_5.xlsx`
- Master prompt: `docs/core56-claude-master-prompt.vi.md`
- Detailed batch briefs: `docs/core56-claude-batches/`
- Ready-to-send Claude prompts: `docs/core56-claude-ready-prompts/`
- Batch manifest: `docs/core56-claude-batches/manifest.json`
- Tracker: `docs/core56-claude-batches/publication-tracker.csv`
- Claude output contract: `docs/core56-claude-output-contract.md`

## Stage 0 - Regenerate Briefs And Tracker

Run this after workbook changes:

```powershell
npm run core56:briefs:export
npm run core56:briefs:validate
npm run core56:claude:prompts
npm run core56:claude:prompts:validate
npm run core56:status
```

Gate:

- 11 batch files exist.
- 11 ready-to-send Claude prompts exist and are current.
- Manifest has 56 articles.
- No missing, extra, duplicate, or empty-outline article.
- `publication-tracker.csv` has one row per article.
- `core56:status` reports current converted/imported/published counts from files and DB.

## Stage 1 - Send One Batch To Claude

Send Claude one ready prompt file:

```text
docs/core56-claude-ready-prompts/batch-02-ai-search-core.md
```

The ready prompt already includes:

1. `docs/core56-claude-master-prompt.vi.md`
2. the matching `docs/core56-claude-batches/batch-XX-*.md`
3. `docs/core56-claude-output-contract.md`

Optionally attach the workbook if Claude can use attachments:

```text
C:\Users\Gamelap\OneDrive\Desktop\Taskcover.com\Taskcover_Core_56_Final_Outlines_Top10_Readiness_9_5.xlsx
```

Instruction to Claude: return one batch only, using `articlePackages` JSON.

Update tracker:

- `claude_output_status=sent`

## Stage 2 - Save And Validate Claude Output

Save Claude response inside the workspace, for example:

```text
.claude-output\claude-batch-02.md
```

Validate:

```powershell
npm run core56:claude:validate -- --batch batch-02-ai-search-core --file .claude-output\claude-batch-02.md
```

Gate:

- `passed=true`
- no missing article IDs
- no extra IDs
- no unsupported schema
- no obvious guarantee claims
- source keys and internal links match manifest

Update tracker:

- pass: `validation_status=passed`
- fail: `validation_status=failed`, add issue in `notes`, send revision request to Claude

## Stage 3 - Convert To Backfill Module

Only convert after validation passes:

```powershell
npm run core56:claude:convert -- --batch batch-02-ai-search-core --file .claude-output\claude-batch-02.md --out src\content\backfill\core56-batch-02-ai-search-core.ts
```

Gate:

```powershell
npm run insights:backfill:validate
npm run typecheck
npm run lint
```

Update tracker:

- `converted_backfill_file=src/content/backfill/core56-batch-02-ai-search-core.ts`

## Stage 4 - Import Drafts

Import only after validation passes:

```powershell
npm run insights:backfill:import
npm run insights:verify-database
```

Gate:

- DB verify `passed=true`
- no duplicate published slugs
- no future/archived published exposure
- Core 56 rows appear as EN draft unless intentionally published

Update tracker:

- `import_status=imported-draft`

## Stage 5 - Editorial And Technical Review

For every imported article:

- preview the admin draft
- confirm H1, excerpt, body, FAQ, CTA, internal links
- verify source URLs and dates
- verify no fake stats/results/quotes
- verify Article and BreadcrumbList schema
- verify FAQPage only if visible FAQ exists
- verify canonical path `/insights/{category}/{slug}`
- verify no FR/ES hreflang until FR/ES published

Update tracker:

- `publish_status=ready-for-publish` when approved

## Stage 6 - Publish EN In Short Backfill Batches

Recommended batch size: 3-6 articles per publish window.

After publishing:

```powershell
npm run insights:verify-database
npm run core56:status
npm run seo:check
```

If running a local crawl:

```powershell
npm run seo:crawl -- --base-url=http://localhost:3100
```

Update tracker:

- `publish_status=published`
- `live_url=https://taskcover.com/insights/{category}/{slug}`
- `post_publish_qa_status=passed` after crawl/indexability/schema checks pass

## Stop Conditions

Do not publish an article when:

- Claude output fails validation.
- Backfill validation fails.
- Required source URLs cannot be verified.
- The article makes ranking, revenue, traffic, AI mention, or AI citation guarantees.
- The article contains fabricated client proof, reviews, awards, or metrics.
- Public page has canonical, noindex, schema, sitemap, or hreflang defects.
