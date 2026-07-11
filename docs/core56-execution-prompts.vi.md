# Core 56 Execution Prompts

Muc tieu: hoan thien va publish 56 bai Insights theo cach EN-first, co QA ky thuat, khong tao schema gia, khong phat hanh hreflang cho ban dich chua ton tai, va khong de draft lam hong published surface.

## Prompt 0 - Technical SEO Foundation

**Input:** repo hien tai, admin workflow, sitemap, article metadata, hreflang, publish QA.

**Action:** sua he thong de admin co the luu/publish bai EN truoc; sitemap doc tu database khi bat provider; hreflang chi hien thi locale da publish; preview/admin noindex; build/test pass.

**Output:** nen ky thuat san sang cho Core 56.

**Gate:** `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`.

Status: done.

## Prompt 1 - Database Verifier And Backfill Safety

**Input:** DB sau khi import draft Core 56, static seed published articles, script verify hien tai.

**Action:** tach published surface voi draft/backfill inventory. Published surface fail neu seed published thieu, duplicate slug dang live, published pointer khong co snapshot, scheduled unpublished content bi expose, archived content bi expose, hoac workflow status sai. Draft Core 56 thieu FR/ES chi la backlog warning.

**Output:** `npm run insights:verify-database` pass khi public SEO sach va van bao ro backlog Core 56.

**Gate:** verify DB, typecheck, lint, test, build.

Status: done.

## Prompt 2 - Batch Selection And Brief

**Input:** workbook Core 56, current published URLs, keyword ownership docs, existing internal-link map.

**Action:** chon batch 3-4 bai co uu tien cao, tranh cannibalization, gan primary intent, secondary intent, slug, CTA, evidence needs, internal links, schema type, publish risk.

**Output:** batch brief ngan gon cho tung bai.

**Gate:** khong trung slug, khong trung primary keyword voi service/market/industry page, moi bai co at least 3 internal link targets.

Status: done. Detailed Claude batch briefs are exported to `docs/core56-claude-batches/`, with tracking in `docs/core56-claude-batches/manifest.json`.
Publication stage tracking starts in `docs/core56-claude-batches/publication-tracker.csv`.
Ready-to-send one-file Claude prompts are generated in `docs/core56-claude-ready-prompts/`.

## Prompt 3 - Article Draft Production

**Input:** batch brief, Google Search guidance, evidence sources, Taskcover service positioning.

**Action:** viet bai EN day du gom title, meta, h1, excerpt, outline H2/H3, content blocks, FAQ neu that su can, source-backed claims, internal links, schema config, publish QA snapshot.

**Output:** file `src/content/backfill/core56-batch-XX.ts`.

**Gate:** khong invent stats/quotes, khong keyword stuffing, khong fake ranking promise, moi factual claim co evidence hoac duoc viet nhu judgement/khuyen nghi.

Claude output must follow `docs/core56-claude-output-contract.md` before Codex converts it to `InsightArticle`. For the cleanest handoff, send Claude the matching one-file prompt from `docs/core56-claude-ready-prompts/` instead of manually combining the master prompt, output contract, and batch brief.

Codex conversion is handled by `npm run core56:claude:validate` followed by `npm run core56:claude:convert`. The backfill importer auto-loads every `src/content/backfill/core56-batch-*.ts` module, so new Claude-approved batches do not need manual importer edits.

## Prompt 4 - Content QA And Technical QA

**Input:** batch file va DB preview draft.

**Action:** chay validate, publish QA, internal-link QA, duplicate slug QA, metadata/canonical/hreflang review, schema safety review.

**Output:** danh sach pass/fail va cac patch can sua.

**Gate:** `npm run insights:backfill:validate`, `npm run insights:verify-database`, `npm run typecheck`, `npm run lint`, `npm test`.

## Prompt 5 - Import And Publish

**Input:** batch da pass QA, target DB, publish strategy.

**Action:** import draft vao DB, review tren admin/preview, publish EN theo thu tu uu tien, giu FR/ES unpublished cho den khi ban dich dat QA.

**Output:** URL live EN cho tung bai, sitemap co URL moi, hreflang dung voi locale dang live.

**Gate:** public page render 200, canonical dung, Article schema dung, Breadcrumb schema dung, sitemap include live URL, no draft URL leak.

Use `docs/core56-backfill-publication-runbook.vi.md` for the exact validate, convert, import, publish, and tracker update flow.

## Prompt 6 - Post-Publish Monitoring

**Input:** live URLs, Search Console, analytics, crawl/SEO check.

**Action:** submit sitemap/URLs, kiem tra indexability, monitor impressions/clicks/query drift, cap nhat internal links tu bai moi va tu cac page lien quan.

**Output:** post-publish log va backlog update cho article 57+.

**Gate:** khong co 404/canonical mismatch/schema error/noindex sai; query mapping khong cannibalize page tien chuyen doi.

Article 57+ weekly operations continue through `docs/weekly-insights-57-plus-sop.vi.md`.
