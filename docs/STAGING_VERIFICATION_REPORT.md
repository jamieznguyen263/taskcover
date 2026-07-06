# Staging Verification Report

Date: 2026-07-07
Scope: Safe local and staging-readiness verification only.

## Current State

- `git pull origin main` reported the branch was already up to date.
- No `.env`, `.env.local`, or `.dev.vars` file was present in the workspace.
- `.env.example` and `.dev.vars.example` now include `DATABASE_TARGET=development` so migration guard setup is visible without committing secrets.
- `wrangler.jsonc` still contains placeholder Hyperdrive IDs and placeholder-looking rate-limit namespace IDs.
- Production was not deployed and DNS was not changed.

## Verification Results

| Check | Result | Notes |
| --- | --- | --- |
| `production:check` | Passed as a report | Reports 18 Task 17 categories with missing setup locations and no secret values |
| `db:status` | Blocked safely | Refused without `DATABASE_URL` |
| `db:verify` | Blocked safely | Refused without `DATABASE_URL` |
| `admin:verify` | Blocked safely | Requires Admin email and configured DB |
| `insights:verify-database` | Blocked safely | Refused without `DATABASE_URL` |
| `integrations:test-resend` | Passed offline | No email sent; EN/FR/ES templates render |
| `integrations:test-hubspot` | Passed offline | No records created |
| `integrations:test-calcom` | Passed offline | Missing URL hides CTA safely |
| `integrations:test-turnstile` | Passed offline | Token not logged; live token required for live test |
| `integrations:test-cloudinary` | Passed offline | Signing and MIME/size restrictions checked; no upload |
| `leads:smoke` | Passed mock mode | EN/FR/ES SEO Audit, Strategy Call, Contact, Media, Private Reference, and Data Request passed |
| `rate-limits:verify` | Passed local memory behavior | Cloudflare namespace IDs still need real values |
| `scheduler:verify` | Passed static wiring | Cron configured as `*/5 * * * *`; secret missing |
| `preview:cloudflare` | Blocked safely | Refused without `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` |
| `cf:typegen` | Passed after escalation | Generated precise Worker and Durable Object types |
| `build:cloudflare` | Passed after escalation | OpenNext build completed; Windows compatibility warning remains |
| `cf:dry-run` | Passed after escalation | Non-deploying dry-run completed and confirmed placeholder Hyperdrive ID remains |
| `production:predeploy` | Passed after escalation | Non-deploying combined gate passed; readiness report still lists missing provider values |

## Staging URL

No staging Worker URL was available or deployed during this task. Route smoke tests against staging were not run. After staging deploy approval and provider setup, run:

```bash
npm run smoke:deployment -- --base-url=<STAGING_URL>
npm run launch:qa -- --base-url=<STAGING_URL>
npm run seo:crawl -- --base-url=<STAGING_URL>
```

## Route Summary

The verified Next build generated 264 static pages. Route output includes static public routes, SSG localized/content routes, and dynamic server-rendered routes for contact/pricing/thank-you, Admin, and API handlers. EN/FR/ES localized public routing remains present.

## Staging Blockers

1. Configure a safe Neon staging database and set `DATABASE_URL` plus `DATABASE_TARGET=staging` locally for migration/import scripts.
2. Replace top-level and staging Hyperdrive placeholder IDs in `wrangler.jsonc` with real staging IDs.
3. Replace Cloudflare Rate Limiting placeholder namespace IDs.
4. Configure required Cloudflare/provider secrets outside the repository.
5. Rerun Cloudflare build/dry-run after replacing provider placeholders, preferably in WSL on Windows.
6. Deploy staging only after explicit approval; do not bind `taskcover.com`.
