# Production Environment Matrix

| Area | Local development | Staging | Production |
| --- | --- | --- | --- |
| Host | `localhost` or Wrangler preview | Cloudflare preview/custom staging host, noindex | `https://taskcover.com` |
| Worker | `npm run preview:cloudflare` | `wrangler deploy --env staging` after approval | `npm run deploy:cloudflare` after approval |
| Database | Direct Neon development URL or disposable DB | Separate Neon branch/database | Production Neon branch/database |
| Hyperdrive | `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` in `.dev.vars` | Staging Hyperdrive ID | Production Hyperdrive ID |
| Insights | `INSIGHTS_PROVIDER=local` until import is verified | May test `database` | Keep `local` until separate go-live approval |
| Resend | Offline templates by default | Test recipient restriction | Verified `taskcover.com` sender |
| HubSpot | Offline mapping by default | Test contact only with explicit flag | Live sync only after approval |
| Cal.com | Optional URL, no PII params | Staging/real booking page link check | Real booking URL |
| Turnstile | Cloudflare test keys | Staging hostname | `taskcover.com`; `www.taskcover.com` only for redirect tests |
| Cloudinary | Signed params only, staging folder if live | `taskcover-staging/insights` | `taskcover/insights` |
| Cron | Disabled or local scheduled test | Enabled after staging approval | Enabled after production approval |
| Secrets | `.env.local` or `.dev.vars` | Cloudflare env secrets | Cloudflare production secrets |

Run `npm run production:check` in every environment. The command is offline by default and redacts secret-like values.

See `docs/PROVIDER_ACTIVATION_CHECKLIST.md` for the owner-facing paste list, lead submission modes, and Windows/OpenNext recovery commands.
