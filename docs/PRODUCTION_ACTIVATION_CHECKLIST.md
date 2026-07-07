# Production Activation Checklist

Do not paste secrets into chat. Store secrets through `.dev.vars`, `.env.local`, `wrangler secret put`, Cloudflare Dashboard, Neon Dashboard, or provider dashboards. Production deploy, DNS changes, live CRM writes, live email sends, and production migrations require separate explicit approval.

For the provider-by-provider paste list and local/staging workflow, use `docs/PROVIDER_ACTIVATION_CHECKLIST.md`.

| Step | Owner | Required value | Exact command | Expected output | Failure condition | Rollback step |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Cloudflare account and Workers Paid | User | Workers Paid enabled, account ID known | `npm run production:check` | Cloudflare-related categories listed | Workers Paid unavailable | Stop before deploy |
| 2. Neon project and branch | User | Development/staging/production branches | `npm run production:check` | Database category reports configured or unavailable | Unknown database target | Do not run migrations |
| 3. Hyperdrive | User | Binding `HYPERDRIVE`, real Hyperdrive ID | `npm run production:check` | Hyperdrive binding and local variable reported | Placeholder ID remains | Keep `INSIGHTS_PROVIDER=local` |
| 4. Drizzle migration | Codex/User | `DATABASE_TARGET=development` or `staging` | `npm run db:status` then `npm run db:migrate` | Host/database and pending count only | Missing target or DB URL | Restore Neon branch/backup |
| 5. First Admin | User | Admin email and password entered interactively | `npm run admin:create -- admin@taskcover.com` | `Admin ready: ...` | Existing Admin without `--update-existing` | Disable Admin row or rotate again |
| 6. Insights import | Codex/User | Local content and safe DB | `npm run insights:import` | Import completes without secrets | Counts mismatch | Re-import on disposable DB |
| 7. Database provider verification | Codex/User | 6 groups, 18 localizations | `npm run insights:verify-database` | Counts and visibility checks pass | Duplicate/missing/invalid content | Keep provider local |
| 8. Resend domain | User | Verified `taskcover.com`, sender values | `npm run integrations:test-resend` | Offline template and format checks pass | Invalid sender or missing key | Disable visitor confirmation |
| 9. HubSpot Private App | User | Token, pipeline ID, new lead stage ID | `npm run integrations:test-hubspot` | Offline mapping list printed | Missing token/stage/pipeline | Disable HubSpot jobs |
| 10. Cal.com | User | HTTPS booking URL without PII query params | `npm run integrations:test-calcom` | `safe: true` or hidden when missing | HTTP, bad host, PII params | Hide CTA by unsetting URL |
| 11. Turnstile | User | Test keys locally, real keys outside local | `npm run integrations:test-turnstile` | Host/action expectations printed | Missing real production host config | Disable lead acceptance or fail closed |
| 12. Rate Limiting | User | Cloudflare bindings for production | `npm run rate-limits:verify` | Lead/admin limits and expiry pass | Raw IP in key or no expiry | Use memory only in dev |
| 13. Durable Objects | User | Binding `RATE_LIMIT_COORDINATOR` | `npm run production:check` | Durable Objects configured | Binding missing | Use Cloudflare limiter only |
| 14. Cloudinary | User | Signed upload credentials and folder | `npm run integrations:test-cloudinary` | Signature shape and restrictions reported | Unsigned upload path required | Disable media uploads |
| 15. Cron Trigger | User | `*/5 * * * *` or approved schedule | `npm run scheduler:verify` | Scheduler wiring reported | No cron schedule | Keep manual publishing endpoint |
| 16. Staging deployment | User | Staging Worker and secrets | `npm run production:predeploy` | All local gates pass | Any gate fails | Do not deploy staging |
| 17. End-to-end lead test | Codex/User | Mock first, test provider next | `npm run leads:smoke` | Seven scenarios pass, no real sends | Validation/idempotency failure | Keep `LEAD_SUBMISSION_MODE=disabled` |
| 18. Admin publishing test | User | Staging Admin session | `npm run insights:verify-database` | Draft/future/archived not exposed | Content exposure mismatch | Switch provider back to local |
| 19. Production deployment | User | Explicit approval and secrets configured | `npm run deploy:cloudflare` | Worker deploy succeeds | Unexpected migration/DNS action | Roll back Worker version |
| 20. DNS and canonical host | User | `taskcover.com`, `www` redirect rule | `npm run smoke:deployment -- --base-url=https://taskcover.com` | Canonical and redirect checks pass | Loop or preview redirected | Disable redirect rule |
| 21. Post-deploy verification | Codex/User | Production base URL | `npm run smoke:deployment -- --base-url=https://taskcover.com` | No obvious 5xx or loops | Any failed route | Roll back Worker version |
| 22. Rollback readiness | User | Rollback owner and Neon backup known | `npm run production:check` | Missing values visible | No restore plan | Do not deploy |

Production remains not deployed until step 19 is explicitly approved and completed.

## Task 17 Staging Activation Status

Current Task 17 verification is documented in:

- `docs/PRODUCTION_PROVIDER_ACTIVATION_REPORT.md`
- `docs/STAGING_VERIFICATION_REPORT.md`
- `docs/PRODUCTION_GO_LIVE_CHECKLIST.md`

No local `.env`, `.env.local`, or `.dev.vars` file was present during Task 17 verification. Live staging activation remains blocked until the missing provider values are configured outside git. `production:check` now reports the required Task 17 readiness categories and prints setup locations for missing values without printing secret values.

Additional placeholders to resolve before staging deploy:

- top-level and staging Hyperdrive IDs in `wrangler.jsonc`
- Cloudflare Rate Limiting namespace IDs currently represented by `1001` and `1002`
- `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` for local Worker preview
- staging `DATABASE_URL` and `DATABASE_TARGET=staging` for DB scripts

## Task 16 Analytics, Consent, And SEM Gate

Task 16 still does not deploy production, modify DNS, run external migrations,
or activate real ads.

Before SEM go-live:

1. Complete legal review of Privacy Policy, Cookie Policy, banner copy,
   Cookie Preferences, and ad-measurement disclosures.
2. Configure `NEXT_PUBLIC_GTM_ID` and set `NEXT_PUBLIC_GTM_ENABLED=true` only
   after consent QA passes.
3. Configure GA4 in GTM. Do not hardcode a GA4 measurement ID in source.
4. Configure `NEXT_PUBLIC_GOOGLE_ADS_ID` and conversion labels for Free SEO
   Audit, Strategy Call, and Contact only after Google Ads actions exist.
5. Keep Microsoft UET and LinkedIn Insight disabled until separately reviewed.
6. QA reject non-essential, analytics-only, marketing-only, and accept-all
   states.
7. Confirm no Admin, API, preview, invite, internal, or debug route loads
   tracking.
8. Confirm accepted lead success is the primary conversion source and
   thank-you views remain supporting events only.
9. Confirm browser dataLayer contains no PII or raw click IDs.
10. Confirm CRM lifecycle stages before importing offline conversions.

## Task 12 Legal Review Gate

Before launch, Privacy Policy, Cookie Policy, Terms, Accessibility Statement,
Data Request copy, cookie preference architecture, consent banner, analytics
events, and advertising measurement plan must receive final legal review.
Provider activation must follow the Task 16 gate above.

## Task 13 Commercial SEO Prelaunch Notes

- Production remains not deployed by Task 13.
- DNS remains unchanged by Task 13.
- No Google Ads, GA4, GTM, or consent banner scripts were added.
- Future SEM activation should wait for consent/tracking events and launch-ready
  provider secrets.
- Commercial SEO docs should be reviewed before adding new pages so future work
  does not create duplicate or doorway URLs.

## Task 14 Technical SEO Prelaunch Gate

Run these before any staging or production deployment approval:

```bash
npm run production:check
npm test
npm run lint
npm run typecheck
npm run build
npm run build:cloudflare
npm run cf:dry-run
npm run launch:qa
npm run seo:check
npm run seo:crawl -- --base-url=http://localhost:3100
```

The SEO crawl requires a locally running production server, for example
`PORT=3100 npm run start` after `npm run build`.

Post-deployment production-only checks still required:

- Fetch `https://taskcover.com/robots.txt` and `/sitemap.xml`.
- Verify `taskcover.com` canonical host and `www` redirect after DNS approval.
- Re-run route smoke checks against the deployed base URL.
- Validate Search Console, social unfurl previews, CDN cache headers, and legal
  review status.

## Task 15 Performance/Accessibility Gate

Task 15 does not deploy production, change DNS, add tracking scripts, configure
production secrets, or run external migrations.

Before staging approval, also run:

```bash
npm run perf:check
npm run a11y:check
npm run visual:check
npm run launch:qa -- --base-url=http://localhost:3100
```

After staging deployment, collect lab Core Web Vitals and responsive screenshots
for homepage, pricing, representative work/proof pages, Insights article, lead
forms, trust/legal pages, and FR/ES pricing mentor variants.
