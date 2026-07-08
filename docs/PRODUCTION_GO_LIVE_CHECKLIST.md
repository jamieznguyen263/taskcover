# Production Go-Live Checklist

Production launch requires a separate written approval. Do not deploy production, modify DNS, or apply production migrations from this checklist until that approval exists.

## Current Readiness Snapshot

Recorded on 2026-07-08 from `main` at `085dd83e4dc2fdd2c40240c4003251b3aa6b0711`.

- Current git status contains only untracked QA folders: `.qa-pricing/`, `.qa-search-motion/`, `.qa-visual-13c/`. Leave them untouched.
- Local `npm run production:check -- --json` reports `DATABASE_TARGET=staging`, `LEAD_SUBMISSION_MODE=disabled`, `INSIGHTS_PROVIDER=database` from local env, and configured local secrets without printing values.
- Local `npm run db:status` connects to a staging database named `taskcover_staging`, with migrations `0000_bored_dark_phoenix.sql` and `0001_lame_the_liberteens.sql` applied.
- `wrangler.jsonc` has production Worker `taskcover`, staging Worker `taskcover-staging`, Durable Object binding `RATE_LIMIT_COORDINATOR`, cron `*/5 * * * *`, and rate-limit namespace placeholders `1001` / `1002`.
- `wrangler.jsonc` keeps production public vars at `APP_URL=https://taskcover.com`, `NEXT_PUBLIC_APP_URL=https://taskcover.com`, `INSIGHTS_PROVIDER=database`, and `LEAD_SUBMISSION_MODE=disabled`.
- `wrangler.jsonc` preserves production Hyperdrive ID `3a4967f8e714435eb58bda3521531a24` and staging Hyperdrive ID `1feebc80ed4541f482c7a0f687682bf8`.
- Wrangler login, production DB migration, production Admin verification, and production Insights verification have passed. Do not bind production domains until Worker URL smoke passes.

## Exact Deployment Commands From Repo Config

The repo has no `wrangler.toml`. Deployment is controlled by `package.json`, `wrangler.jsonc`, and `open-next.config.ts`.

Staging Worker command, after staging secrets and staging Hyperdrive are configured:

```bash
npm run build:cloudflare
wrangler deploy --env staging
```

Production Worker command, after production DB/Hyperdrive, secrets, DNS plan, and explicit launch approval:

```bash
npm run deploy:cloudflare:prod-safe
```

`npm run deploy:cloudflare:prod-safe` prompts for the production Neon connection string with hidden PowerShell input, sets `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` only for the deploy process, runs the existing production deploy command, and clears the variable afterward.

The underlying command still expands to:

```bash
npm run build:cloudflare && opennextjs-cloudflare deploy
```

Do not guess alternate command names. `npm run production:predeploy` is a local gate only; it does not deploy.

## Production Public Vars To Paste

Paste these as Cloudflare production Worker variables, not secrets. Keep `LEAD_SUBMISSION_MODE=disabled` for the first production deploy.

```bash
APP_URL=https://taskcover.com
NEXT_PUBLIC_APP_URL=https://taskcover.com
INSIGHTS_PROVIDER=database
LEAD_SUBMISSION_MODE=disabled
RESEND_FROM_EMAIL=Taskcover Agency <business@taskcover.com>
RESEND_REPLY_TO_EMAIL=business@taskcover.com
LEAD_NOTIFICATION_EMAIL=business@taskcover.com
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<production site key>
TURNSTILE_SITE_KEY=<production site key>
TURNSTILE_EXPECTED_HOSTNAME=taskcover.com
TURNSTILE_EXPECTED_ACTION=lead-submit
```

Production `INSIGHTS_PROVIDER=database` is allowed because production DB migration, import, and verification have passed. Keep `LEAD_SUBMISSION_MODE=disabled` until a separate production lead capture launch is approved.

## Production Secrets To Paste

Paste these through Cloudflare Dashboard secrets or interactive `wrangler secret put`. Never paste values into chat, commit them, or pass them as command arguments.

```bash
wrangler secret put AUTH_SESSION_SECRET
wrangler secret put PREVIEW_TOKEN_SECRET
wrangler secret put RESEND_API_KEY
wrangler secret put TURNSTILE_SECRET_KEY
```

Use `DATABASE_URL` only for local production scripts when explicitly running approved production DB commands. Runtime should prefer the production Hyperdrive binding. HubSpot, Cloudinary, and Cron secrets are later items and are not required for the initial website publish while lead capture remains disabled.

## Production Database And Hyperdrive Blocker

Production database-backed runtime is blocked until a real production Neon database or branch exists and the production Hyperdrive binding points to it. Do not silently reuse staging DB or staging Hyperdrive for production.

Owner steps:

1. In Neon, create a separate production branch or database for Taskcover. Name it clearly, for example `taskcover_production`.
2. Copy the production pooled connection string into `.env.local` only when running approved local production scripts. Do not share or commit it.
3. In `.env.local`, set:

```bash
DATABASE_TARGET=production
CONFIRM_PRODUCTION_MIGRATION=YES
```

4. In Cloudflare, create a production Hyperdrive config pointed at the production Neon target. Keep the Worker binding name `HYPERDRIVE`.
5. Confirm only the top-level production `wrangler.jsonc` Hyperdrive ID is `3a4967f8e714435eb58bda3521531a24`. Keep `env.staging.hyperdrive` pointed at `1feebc80ed4541f482c7a0f687682bf8`.
6. Re-run local gates before deployment:

```bash
npm run production:check
npm run db:status
npm run db:migrate
npm run db:verify
npm run insights:import
npm run insights:verify-database
```

Create or verify an Admin user only if the owner explicitly requests it:

```bash
npm run admin:create -- <admin-email>
npm run admin:verify -- <admin-email>
```

## Before Staging

- [ ] Create Neon development/staging database or branch.
- [ ] Set local script env values outside git: `DATABASE_URL`, `DATABASE_TARGET=staging`, `AUTH_SESSION_SECRET`, `PREVIEW_TOKEN_SECRET`.
- [ ] Run `npm run db:status`, `npm run db:migrate`, and `npm run db:verify` against staging only.
- [ ] Create the first Admin with `npm run admin:create -- <admin-email>` and verify with `npm run admin:verify -- <admin-email>`.
- [ ] Import Insights with `npm run insights:import` and verify with `npm run insights:verify-database`.
- [ ] Create staging Hyperdrive and replace only staging-safe placeholder IDs.
- [ ] Configure Cloudflare Rate Limiting namespace IDs and keep Durable Object migration declared.
- [ ] Configure Cloudflare secrets with `wrangler secret put --env staging` or Dashboard.

## Provider Activation

- [ ] Resend: verify `taskcover.com`, configure sender `Taskcover Agency <business@taskcover.com>`, reply-to, and notification recipient.
- [ ] HubSpot: create Private App token and record pipeline/stage IDs. Do not mutate schema from code.
- [ ] Cal.com: set HTTPS `CALCOM_BOOKING_URL` with no visitor PII query parameters.
- [ ] Turnstile: create staging and production widgets with approved hostnames and action `lead-submit`.
- [ ] Cloudinary: configure signed upload credentials and use `taskcover-staging/insights` for staging.
- [ ] Cron: set `PUBLISH_CRON_SECRET` and verify `wrangler dev --test-scheduled` or staging scheduled event behavior.
- [ ] Analytics: configure GTM/GA4/Ads IDs only after consent QA and provider review.

## Staging Gates

```bash
npm run integrations:test-resend
npm run integrations:test-turnstile
npm run production:check
npm test
npm run lint
npm run typecheck
npm run build
npm run build:cloudflare
npm run cf:dry-run
npm run seo:check
npm run launch:qa
npm run production:predeploy
npm run smoke:deployment -- --base-url=<STAGING_URL>
```

Provider live tests remain opt-in:

```bash
npm run integrations:test-resend -- --live
npm run integrations:test-hubspot -- --live
npm run integrations:test-calcom -- --live
npm run integrations:test-turnstile -- --live --token=<token>
npm run leads:smoke -- --mode=test-provider --allow-provider-side-effects
```

## Before Production

- [ ] Confirm legal review for Privacy, Cookie, Terms, Accessibility, consent, analytics, and ad measurement.
- [ ] Confirm staging smoke tests pass for public routes, Admin login, lead acceptance, provider outbox, and Insights database mode.
- [ ] Confirm production Neon backup/restore plan.
- [ ] Confirm production `DATABASE_TARGET=production` and `CONFIRM_PRODUCTION_MIGRATION=YES` only for an explicitly approved production migration window.
- [ ] Confirm production Hyperdrive points to the production Neon target, not staging.
- [ ] Confirm production `LEAD_SUBMISSION_MODE=disabled`.
- [ ] Confirm `INSIGHTS_PROVIDER` production switch is separately approved after staging database verification.
- [ ] Confirm Cloudflare Access/noindex behavior for staging and canonical host behavior for production.
- [ ] Confirm rollback owner and Worker rollback procedure.

## Production Gates

Run these immediately before the production Worker deploy:

```bash
cmd /c npm run integrations:test-resend
cmd /c npm run integrations:test-turnstile
cmd /c npm run production:check
cmd /c npm test
cmd /c npm run lint
cmd /c npm run typecheck
cmd /c npm run build
cmd /c npm run build:cloudflare
cmd /c npm run cf:dry-run
```

Then deploy the Worker before binding custom domains where possible:

```bash
cmd /c npm run deploy:cloudflare:prod-safe
```

OpenNext/Wrangler requires `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` during the local deploy build to emulate the `HYPERDRIVE` binding. The safe deploy command sets it only in the current PowerShell process and child deploy process. This does not alter the production Hyperdrive binding or Cloudflare runtime behavior.

Never commit or log the production Neon connection string. Do not add it to `wrangler.jsonc` as `localConnectionString`, and do not paste it into chat. If it was ever pasted into chat or logs, rotate the Neon password before deploying.

Smoke the Worker URL or preview URL first. Only after smoke passes, attach custom domains.

Required production smoke paths:

```bash
npm run smoke:deployment -- --base-url=<WORKER_URL>
```

The smoke plan includes `/`, `/fr`, `/es`, `/insights`, `/free-seo-audit`, `/contact`, `/book-a-call`, `/admin/login`, `/robots.txt`, and `/sitemap.xml`. Also manually confirm `https://www.taskcover.com` redirects to `https://taskcover.com`.

## Custom Domains

`worker/taskcover-worker.ts` already implements the production canonical strategy: requests to `www.taskcover.com` or HTTP production traffic are redirected to `https://taskcover.com` when `APP_URL` is `https://taskcover.com`.

Cloudflare custom domains can be attached from the dashboard:

1. Cloudflare Dashboard -> Workers & Pages -> `taskcover`.
2. Settings -> Domains & Routes -> Add -> Custom Domain.
3. Add `taskcover.com`.
4. Add `www.taskcover.com` only after confirming the Worker canonical redirect behavior.
5. Confirm certificates are Active/Issued in the same Domains & Routes view.

If custom domains are committed through `wrangler.jsonc`, add them only after Worker smoke passes and after explicit approval:

```jsonc
"routes": [
  { "pattern": "taskcover.com", "custom_domain": true },
  { "pattern": "www.taskcover.com", "custom_domain": true }
]
```

Cloudflare documents that Custom Domains attach all paths on an exact hostname to a Worker and that `custom_domain=true` can be configured under `routes` in `wrangler.jsonc`. Cloudflare also notes that root and `www` are exact matches, so both hosts need a custom domain or a redirect rule with proxied DNS for the redirecting host.

## DNS Safety Snapshot

Resolved on 2026-07-08 before any production routing changes:

- `taskcover.com` A: `104.21.82.200`, `172.67.162.217`
- `taskcover.com` AAAA: `2606:4700:3031::6815:52c8`, `2606:4700:3034::ac43:a2d9`
- `www.taskcover.com` A: `172.67.162.217`, `104.21.82.200`
- `www.taskcover.com` AAAA: `2606:4700:3034::ac43:a2d9`, `2606:4700:3031::6815:52c8`
- `www.taskcover.com` CNAME: no CNAME answer observed.
- `taskcover.com` MX: priority `0` `smtp.secureserver.net`; priority `10` `mailstore1.secureserver.net`
- `taskcover.com` TXT: `google-gws-recovery-domain-verification=73038640`
- `taskcover.com` SPF TXT: `v=spf1 include:secureserver.net -all`
- `_dmarc.taskcover.com` TXT: `v=DMARC1; p=none; rua=mailto:business@taskcover.com; adkim=s; aspf=s`
- `email.taskcover.com` CNAME: `email.secureserver.net`
- Resend/DKIM records: no `resend._domainkey.taskcover.com`, `_domainkey.taskcover.com`, or `mail._domainkey.taskcover.com` answer observed from this session.

Do not change MX, SPF, DKIM, DMARC, Google verification, Resend verification, or email provider records during website routing. Only web records/custom domains should change. Keep `email.taskcover.com` DNS-only, not proxied, unless the email provider explicitly requires otherwise.

After Worker custom domains are active, remove stale web A/CNAME records that still point to old hosting. Do not remove mail records.

## Lead Capture Launch Boundary

Website is live; production lead capture is intentionally disabled until production lead mode and rate limiting are enabled.

For the first production deploy:

```bash
LEAD_SUBMISSION_MODE=disabled
```

Do not set production to `staging-durable`. If real lead capture is required before launch, stop before domain binding and implement a separate `production-durable` mode with production Turnstile hostname validation, production Neon/outbox, Resend notification, Cloudflare rate limiting, no secret logging, tests, and one approved test lead smoke.

## Launch Boundary

Production deployment status: not deployed by Task 17.
DNS status: unchanged by Task 17.
