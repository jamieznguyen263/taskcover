# Production Environment Matrix

| Area | Local development | Staging | Production |
| --- | --- | --- | --- |
| Host | `localhost` or Wrangler preview | Cloudflare preview/custom staging host, noindex | `https://taskcover.com` |
| Worker | `npm run preview:cloudflare` | `wrangler deploy --env staging` after approval | `npm run deploy:cloudflare:prod-safe` after approval |
| Database | Direct Neon development URL or disposable DB | Separate Neon branch/database | Production Neon branch/database |
| Hyperdrive | `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` in `.dev.vars` | Staging Hyperdrive ID | Production Hyperdrive ID |
| Insights | `INSIGHTS_PROVIDER=local` until import is verified | May test `database` | `INSIGHTS_PROVIDER=database` after production DB verification |
| Resend | Offline templates by default | Test recipient restriction | Verified `taskcover.com` sender |
| HubSpot | Offline mapping by default | Test contact only with explicit flag | Live sync only after approval |
| Cal.com | Optional URL, no PII params | Staging/real booking page link check | Real booking URL |
| Turnstile | Cloudflare test keys | Staging hostname | `taskcover.com`; `www.taskcover.com` only for redirect tests |
| Lead capture | `LEAD_SUBMISSION_MODE=disabled` by default, `test` for UI QA | `staging-durable` after staging DB/providers/rate limits | `production-durable` only after production Hyperdrive, Turnstile, Resend, Cal.com, and Cloudflare rate-limit IDs are ready |
| Cloudinary | Signed params only, staging folder if live | `taskcover-staging/insights` | `taskcover/insights` |
| Cron | Disabled or local scheduled test | Enabled after staging approval | Enabled after production approval |
| Secrets | `.env.local` or `.dev.vars` | Cloudflare env secrets | Cloudflare production secrets |

Run `npm run production:check` in every environment. The command is offline by default and redacts secret-like values.

Production public vars for full lead capture:

```bash
APP_URL=https://taskcover.com
NEXT_PUBLIC_APP_URL=https://taskcover.com
INSIGHTS_PROVIDER=database
LEAD_SUBMISSION_MODE=production-durable
RESEND_FROM_EMAIL=Taskcover Agency <business@taskcover.com>
RESEND_REPLY_TO_EMAIL=business@taskcover.com
LEAD_NOTIFICATION_EMAIL=business@taskcover.com
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<production Turnstile site key>
TURNSTILE_SITE_KEY=<production Turnstile site key>
TURNSTILE_EXPECTED_HOSTNAME=taskcover.com
TURNSTILE_EXPECTED_ACTION=lead-submit
CALCOM_BOOKING_URL=<production Cal.com booking URL>
```

Production secrets:

```bash
AUTH_SESSION_SECRET
PREVIEW_TOKEN_SECRET
RESEND_API_KEY
TURNSTILE_SECRET_KEY
```

Later production secrets when those features are enabled: Cloudinary for Admin media upload, HubSpot for CRM sync, and `PUBLISH_CRON_SECRET` for scheduled publishing.

See `docs/PROVIDER_ACTIVATION_CHECKLIST.md` for the owner-facing paste list, lead submission modes, and Windows/OpenNext recovery commands.
