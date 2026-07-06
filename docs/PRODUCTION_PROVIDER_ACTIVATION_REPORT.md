# Production Provider Activation Report

Date: 2026-07-07
Scope: Task 17 staging/provider readiness. Production was not deployed. DNS was not modified.

## Summary

The repository is current with `origin/main` and provider activation tooling is present. No local activation secrets were found in `.env`, `.env.local`, or `.dev.vars`, so live provider activation could not be performed safely. All provider scripts that were run stayed in offline/mock mode and did not send email, create CRM records, create bookings, upload media, deploy Workers, change DNS, or run database migrations.

## Provider Status

| Area | Status | Evidence | Blocking value or action |
| --- | --- | --- | --- |
| Application env | Missing locally | `npm run production:check` | `APP_URL`, `NEXT_PUBLIC_APP_URL`, `LEAD_SUBMISSION_MODE` |
| Cloudflare Workers/OpenNext | Partially configured | `wrangler.jsonc` has Worker names, cron, DO, and rate-limit bindings | Replace Hyperdrive placeholder IDs before staging deploy |
| Neon / PostgreSQL | Missing locally | `npm run db:status` refused without DB URL | `DATABASE_URL`, `DATABASE_TARGET=development` or `staging` |
| Hyperdrive | Partially configured | Binding name exists; IDs are placeholders | Real top-level and staging `wrangler.hyperdrive.id`; local preview connection string |
| Auth secrets | Missing locally | `production:check` | `AUTH_SESSION_SECRET`, `PREVIEW_TOKEN_SECRET` |
| First Admin | Not activated | `admin:verify` requires an email and DB | Staging DB, auth secret, Admin email/password |
| Insights database | Not activated | `insights:verify-database` refused without DB URL | Staging DB migrations and import |
| Resend | Missing live config | Offline templates render | `RESEND_API_KEY`, sender, reply-to, notification recipient |
| HubSpot | Missing live config | Offline mapping check passed | Private App token, pipeline ID, new lead stage ID |
| Cal.com | Missing live config | Missing URL hides CTA safely | `CALCOM_BOOKING_URL` |
| Turnstile | Missing live config | Offline fail-closed cases listed | Site key, secret key, expected hostname/action |
| Rate Limiting | Partially configured | Bindings exist; namespace IDs look placeholder-like | Replace `1001` and `1002` namespace IDs with real Cloudflare values |
| Durable Objects | Configured in code | `RATE_LIMIT_COORDINATOR` binding and migration exist | Staging deployment verification still required |
| Cloudinary | Missing live config | Offline signing rules checked | Cloud name, API key, API secret, staging upload folder |
| Cron scheduler | Partially configured | `scheduler:verify` passed; cron exists | `PUBLISH_CRON_SECRET`; staging scheduled invocation test |
| GTM/GA4/Ads | Not required in current mode | GTM disabled and IDs missing | Configure IDs only after consent and provider review |
| Consent mode | Configured | Task 16 code and `production:check` | Browser QA required after staging URL exists |
| Lead outbox | Missing durable staging DB | `leads:smoke` passed in mock mode | Staging DB, lead mode, Turnstile, rate limits, provider secrets |

## Commands Run

```bash
git status --short
git pull origin main
cmd /c npm run production:check
cmd /c npm run db:status
cmd /c npm run db:verify
cmd /c npm run admin:verify
cmd /c npm run insights:verify-database
cmd /c npm run integrations:test-resend
cmd /c npm run integrations:test-hubspot
cmd /c npm run integrations:test-calcom
cmd /c npm run integrations:test-turnstile
cmd /c npm run integrations:test-cloudinary
cmd /c npm run leads:smoke
cmd /c npm run rate-limits:verify
cmd /c npm run scheduler:verify
cmd /c npm run cf:typegen
cmd /c npm run build:cloudflare
cmd /c npm run cf:dry-run
cmd /c npm run production:predeploy
```

## Activation Decision

Staging is not ready to deploy from this workspace until provider secrets and real Cloudflare/Neon IDs are configured outside the repository. Production is blocked by the same missing provider values plus the explicit no-production-deploy/no-DNS boundary.
