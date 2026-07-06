# Production Go-Live Checklist

Production launch requires a separate written approval. Do not deploy production, modify DNS, or apply production migrations from this checklist until that approval exists.

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
- [ ] Confirm `INSIGHTS_PROVIDER` production switch is separately approved after staging database verification.
- [ ] Confirm Cloudflare Access/noindex behavior for staging and canonical host behavior for production.
- [ ] Confirm rollback owner and Worker rollback procedure.

## Launch Boundary

Production deployment status: not deployed by Task 17.
DNS status: unchanged by Task 17.
