# Sprint S00 — Core 56 Portfolio Hygiene & Safety

Status: implementation, unit tests, and read-only staging-authorization checks complete. **No database writes have been made.** This is a clean, S00-only replacement for the earlier draft PR #9, which mixed in unrelated pipeline work and had several correctness/safety gaps a reviewer correctly flagged (see §9).

## 1. Scope

This PR contains only: pure hygiene detectors/transforms, a shared Core-56 identity module, a read-only audit script, and a dry-run/staging-write remediation script — plus their tests. It does **not** depend on and does **not** contain the batch-authoring pipeline, generated backfill content, Claude outputs, or any editor/content-intelligence/renderer/sitemap/wrangler changes (that work lives in the separate, still-open PR #8 and is out of scope here).

Files changed (8, all within the agreed allowlist):
- `src/lib/admin/core56-hygiene.ts` (+ `.test.ts`) — pure detectors/transforms over `InsightBlock[]`, plus a Tiptap-editorDocument-level transform.
- `src/lib/admin/core56-identity.ts` (+ `.test.ts`) — the one small shared module: strict `core56-tc-###` creation-key parsing and the "exactly 56, no dupes, no gaps" assertion, used by both scripts.
- `scripts/insights-audit-core56.ts` — read-only audit.
- `scripts/insights-remediate-core56.ts` (+ `.test.ts`) — dry-run (default) and staging-write remediation.
- `package.json` (two new npm scripts), `vitest.config.ts` (run `scripts/**/*.test.ts`), `.gitignore` (narrow addition for local raw artifacts).

## 2. How Core 56 is discovered (no dependency on the unmerged pipeline)

`insights-audit-core56.ts` and `insights-remediate-core56.ts` both query `insight_article_groups`/`insight_article_localizations` directly for `creation_key ~ '^core56-tc-[0-9]{3}$'` — no manifest, tracker CSV, or backfill content module is read. `assertCore56Identity` (in `core56-identity.ts`) then requires **exactly 56 unique** article groups matching `TC-001`..`TC-056`, with no duplicates and no gaps; both scripts **refuse to continue** (exit non-zero) if that assertion fails, rather than reporting numbers against a broken corpus. On the current database this assertion **passes** (56/56, verified).

## 3. Workflow safety model (Task 3)

The remediator never raw-updates `draft_workflow_status`. Per-status behavior:

| Status | Behavior |
| --- | --- |
| `draft` | Only status eligible for an S00 staging draft update. |
| `published` | Reported `requires-reopen`; never modified. Must be reopened to `draft` through the normal Taskcover Admin workflow (`article:edit`) first. |
| `in-review` / `approved` / `scheduled` | Reported `requires-reopen`; skipped. |
| `archived` | `hard-stop`. |
| `TC-027` / `TC-028` / `TC-056` | `hard-stop` regardless of workflow status (YMYL/benchmark, needs a named human reviewer). |
| missing snapshot | `missing`. |
| schema validation failure | `invalid`. |

**On the live database today, all 56 groups are `published`** — so this run classified all 53 non-hard-stop articles as `requires-reopen` and made **zero writes**, which is the correct, conservative outcome given current reality. The draft-only write path is fully implemented and unit-tested (14 tests) using synthetic `draft`-status fixtures, ready to activate once articles are actually reopened through the normal workflow.

## 4. Accountable actor (Task 4)

`--write` requires `--actor-email=<address>`, resolved against `admin_users` by normalized email. Refused unless the account is `active` and holds the `article:edit` permission. The actor's UUID is written into every `admin_audit_logs` row for the mutation — there is no code path that writes a content-mutation audit log with a null actor.

## 5. Environment authorization (Task 5) — exact match only, no substrings

Replaced the earlier substring-based host check. `resolveWriteAuthorization` requires **all** of: `DATABASE_TARGET === "staging"`, `--target=staging`, and `--confirm-staging-identity=<value>` that **exactly** equals either the resolved database host or its SHA-256 fingerprint (via the existing `hashForLog`/`summarizeUrl` helpers in `src/lib/ops/production-activation.ts`) — a substring match is explicitly rejected. Production (`DATABASE_TARGET=production` or `--target=production`) is refused outright. `--source=fixture` (offline/test mode) can never authorize a write, unconditionally. The report always distinguishes `requestedMode` / `authorizationResult` / `executedMode` / `resolvedHostFingerprint` / `refusalReason` — a refused write is reported as `executedMode: "write-refused"`, never mislabeled as an ordinary dry run.

**Verified against the live environment this session:** `DATABASE_TARGET` in this checkout does not resolve consistently to `"staging"` (the `.env.local` contradiction found during original S00 orientation), and the actually-resolved `DATABASE_URL` is the **production** host. `resolveWriteAuthorization` correctly refuses under these real conditions (confirmed via the dry-run run below, host fingerprint `c4865a...` — a one-way SHA-256 hash, not the hostname itself). No `--write` invocation was attempted against this database, live or otherwise, at any point.

## 6. FAQ classification (Task 6)

`assessFaqProse` classifies each FAQ item's prose counterpart independently as `exact` (question **and** answer match the structured FAQ item exactly, normalized — auto-removable, and the duplicate heading is removed **only** when every item in the section resolved this way), `paraphrase` (question matches, answer wording differs — **never** auto-removed, always a manual-review item, and the duplicate heading is **kept** whenever any paraphrased prose remains), or `none`.

The dry-run/write classification model distinguishes all 8 states: `no-change`, `auto-fix-safe`, `auto-fix-with-manual-follow-up`, `manual-review`, `requires-reopen`, `hard-stop`, `missing`, `invalid`.

## 7. Narrowed workflow-phrase removal (Task 7) and CTA context preservation (Task 8)

Verified against the live corpus: the only internal-workflow-language leak in all 56 articles lives inside a CTA body, and it is byte-identical across every occurrence: *"Use this article as a working brief, then validate sources, internal links, and live SERP assumptions before publishing."* — only the CTA **title** and its **real service link** vary per article. Given this, the fix is narrow and exact:

- `removeExactInternalWorkflowSentences` only removes a **whole paragraph** that is an **exact, normalized match** to one of a small set of known internal-workflow sentence templates — a phrase occurring inside a longer sentence, a list item, or any non-paragraph block is left untouched and instead surfaced as a manual-review signal (`detectInternalWorkflowLeak`). A regression test proves a legitimate editorial sentence that merely discusses a "working brief" in passing is preserved verbatim.
- `replaceDraftCtaBody` only swaps the CTA's `body` field when it is an **exact match** to the one confirmed template; the CTA's `title`, `primary` link, and `secondary` link are preserved unchanged. Different articles keep their own distinct, already-correct service link (tested explicitly). Anything else CTA-shaped is left alone and flagged for manual review rather than replaced with generic boilerplate.

## 8. Editor-document fidelity (Task 9)

`transformEditorDocument` edits the Tiptap `editorDocument` node tree **directly** — it does not reconstruct the document from `blocks`. It calls the existing, unmodified `normalizeTiptapToInsightBlocks` (from `src/lib/admin/normalization.ts`, imported read-only, not changed) to verify a strict 1:1 correspondence between top-level Tiptap nodes and normalized blocks before making any edit; if that correspondence can't be established, the article is routed to `manual-review` instead of risking an incorrect edit. Every node **not** touched by a specific fix passes through byte-for-byte — proven by tests asserting exact preservation of inline links, bold/italic marks, heading structure, and image/media-asset ids on untouched nodes. The CTA fix is a shallow clone of the existing `structuredBlock` node with only `attrs.data.body` replaced (title/links untouched at the JSON level, not just semantically). The whole pipeline is idempotent at the Tiptap level (tested).

## 9. What changed from the superseded PR #9

PR #9 (left open as a reference, now superseded) had real problems this PR fixes: it depended on the unmerged core56 batch-authoring pipeline and mixed in unrelated editor/content-intelligence changes (~90 files); its write path would have raw-updated `draft_workflow_status`; it had no actor requirement; its staging-host check used substring matching; it reported "0 manual review" while dozens of paraphrased FAQ duplicates existed; its phrase-removal and CTA-replacement logic was overly broad; and it rebuilt the Tiptap document from blocks, which would have silently dropped inline formatting. All of the above are addressed here.

## 10. Exact affected counts (measured against the live database)

`npm run insights:audit-core56`, identity assertion passed (56/56):

| Signal | Count |
| --- | --- |
| Internal workflow language leak (any) | 55 / 56 |
| — of which exactly auto-fixable (CTA template match) | 54 / 56 |
| Duplicate opening paragraph (exact) | 54 / 56 |
| FAQ items with an exact prose duplicate (auto-fixable) | 42 / 56 articles have ≥1 |
| FAQ items with a paraphrased prose duplicate (manual review only) | 46 / 56 articles have ≥1 |
| Markdown pipe-table rows stored as paragraphs | 47 / 56 |
| No related article slugs | 54 / 56 |
| No body image/visual | 56 / 56 |
| Slug likely truncated (≥75 chars) | 28 / 56 |
| Metadata length warning(s) | 37 / 56 |
| `factCheckStatus: needs-review` (never changed by this PR) | 54 / 56 |
| Sources with no claim/evidence mapping | 1 / 56 |
| Currently not in `draft` status | 56 / 56 |
| Schema validation failures | 0 / 56 |

TC-001 and TC-006 remain the two lowest-defect articles (1 and 2 residual defects respectively — both only the "no body visual" signal the whole corpus shares, plus one extra minor item for TC-006), confirming they already have the stronger structured format.

## 11. Dry-run classification (measured)

`npm run insights:remediate-core56` (default dry-run) against the live database:

| Status | Count |
| --- | --- |
| `requires-reopen` | 53 |
| `hard-stop` | 3 (TC-027, TC-028, TC-056) |
| `auto-fix-safe` / `auto-fix-with-manual-follow-up` / `manual-review` / `no-change` | 0 (none currently in `draft`) |

Writes applied: **0**. `noPublishedSnapshotEverChanged: true`.

## 12. Tests and results

- `src/lib/admin/core56-hygiene.test.ts` — 26 tests: exact duplicate-opening removal, near-duplicate preservation, exact FAQ duplicate removal, paraphrased FAQ → manual review, duplicate FAQ heading retained while paraphrased prose remains, safe multi-node table conversion, ambiguous table → manual review, exact internal-sentence removal, legitimate "working brief" content preserved, CTA context preservation (including per-article distinct service links), Tiptap fidelity (marks/heading/media-id preservation, CTA in-place edit, table merge, node/block-mismatch refusal, idempotency), and non-degradation of an already-clean article.
- `src/lib/admin/core56-identity.test.ts` — 8 tests for the strict creation-key/identity assertion.
- `scripts/insights-remediate-core56.test.ts` — 31 tests: arg parsing, exact-match-only environment authorization (dry-run default, fixture-mode-never-writes, production refusal, target mismatch, substring-match refusal, known-production-identity refusal, exact hostname/fingerprint success), actor resolution (missing/unknown/inactive/valid), the full 8-state workflow classification, Publish-QA before/after comparison (new-error abort, existing vs. introduced warnings), and identity/metadata/evidence-unchanged verification.
- **Full repo suite**: `npm test` → 247/247 passing across 47 files. `npm run lint` clean. `npx tsc --noEmit` clean. `npm run build` succeeds.
- These are local command results from this session, not a GitHub Actions status check — no CI is configured in this repository to report a status on the PR.

## 13. Staging identity and true staging validation — BLOCKED, needs the user

This session has read-only access to the same database used throughout S00 orientation, which resolves to the **production** host (confirmed by cross-referencing `.env.production.local`), and no access to the Neon dashboard, `wrangler hyperdrive list`, or any deployed staging Worker/Admin login. Concretely, this environment cannot:

- Independently identify or create a genuine Neon staging branch.
- Log into a deployed `/admin/insights` to reopen TC-001/006/003/007/027/028/056 to `draft` through the real Admin workflow.
- Visually inspect the Admin editor or a public preview.

**What was verified instead, safely, without writing anywhere:** the audit and dry-run commands ran against the live database (read-only), the identity assertion passed, and every safety gate (workflow-status handling, environment authorization, actor resolution) was exercised with 31+26+8 unit tests using fixtures — including a live confirmation that `--write` is correctly unreachable in this actual environment as configured.

**To complete Task 13, the user needs to either:** (a) provide a verified staging `DATABASE_URL` and an active admin account email so a future session can run the real staging validation end-to-end (dry-run, reopen via Admin UI, `--write`, re-run for idempotency, inspect Admin/public preview), or (b) perform that validation themselves using this PR's code once a real staging branch exists. This PR does not claim staging validation happened — it did not.

## 14. Rollback plan

- Nothing is published, approved, or scheduled by this code. A reopened article sits in `draft`; `publishedSnapshot` is never touched by anything in this PR, so the live site is unaffected regardless of what happens to the draft.
- Every real write (once one ever happens) is one transaction per article with an `admin_audit_logs` row recording the actor, `transformationVersion: "core56-s00-hygiene-v1"`, before/after block checksums, and the exact list of changes applied — a bad batch can be identified precisely and the affected `draft_snapshot` restored from the immutable `insight_article_revisions` history (untouched by this code) via the normal Taskcover restore flow.
- `npm run insights:audit-core56` is safe to re-run before/after any real write to diff exact counts.

## 15. Recommendation

Approve this PR's code/tests/safety model as the S00-only replacement for #9. Do not run `--write` until a real staging environment is independently confirmed and someone with Admin access reopens representative articles to `draft` per §13. Close #9 once this PR is reviewed and accepted as its replacement.
