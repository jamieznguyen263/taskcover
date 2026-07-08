# Cloudflare Deployment

Taskcover runs on Cloudflare Workers through OpenNext.

Wrangler values still requiring real Cloudflare values:

| Config | Current value | Source |
| --- | --- | --- |
| Worker name | `taskcover` | Cloudflare Workers project name |
| Staging Worker name | `taskcover-staging` | Cloudflare Workers staging project |
| Hyperdrive binding | `HYPERDRIVE` | Cloudflare Hyperdrive binding name |
| Production Hyperdrive ID | `3a4967f8e714435eb58bda3521531a24` | Cloudflare Hyperdrive dashboard |
| Staging Hyperdrive ID | `1feebc80ed4541f482c7a0f687682bf8` | Cloudflare Hyperdrive dashboard |
| Rate limiting | `LEAD_RATE_LIMITER`, `ADMIN_RATE_LIMITER` | Cloudflare Rate Limiting bindings |
| Durable Object | `RATE_LIMIT_COORDINATOR` | Wrangler Durable Object migration |
| Cron | `*/5 * * * *` | Cloudflare Workers Triggers |
| Compatibility date | `2026-07-05` | Wrangler config |
| Secrets | unset in repo | Cloudflare Dashboard or `wrangler secret put` |

Local Worker preview requires:

```bash
CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE=<development Neon URL>
npm run preview:cloudflare
```

The local value belongs in `.dev.vars` only. If it is missing, `npm run preview:cloudflare` fails with a clear message before OpenNext preview starts.

Production deploy on Windows should use:

```bash
npm run deploy:cloudflare:prod-safe
```

That command prompts for the production Neon connection string with hidden PowerShell input, sets `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` only for the local deploy process, runs `npm run deploy:cloudflare`, and clears the variable after the attempt. This is only for OpenNext/Wrangler local Hyperdrive emulation during deploy packaging; production runtime still uses the configured `HYPERDRIVE` binding.

Never commit the connection string or add `localConnectionString` with a real secret to `wrangler.jsonc`. If the string was ever pasted into chat or logs, rotate the Neon password before deploy.

Safe commands:

```bash
npm run build:cloudflare
npm run cf:typegen
npm run cf:dry-run
npm run production:check
```

Canonical redirect QA:

- `http://taskcover.com/*` redirects to `https://taskcover.com/*`.
- `https://www.taskcover.com/*` redirects to `https://taskcover.com/*`.
- Path is preserved.
- Query string is preserved unless Cloudflare policy explicitly strips unsafe values.
- Preview, staging, and localhost must not redirect to production.
- Sitemap, Open Graph, and canonical tags use `https://taskcover.com`.

Cloudflare Redirect Rule instructions:

1. In Cloudflare Dashboard, open Rules > Redirect Rules.
2. Create a dynamic redirect for hostname `www.taskcover.com`.
3. Target URL: `https://taskcover.com${http.request.uri.path}` with query string preserved.
4. Status: `301` or `308`.
5. Add a separate HTTPS redirect if SSL/TLS settings do not already enforce HTTPS.
6. Do not create a rule that matches preview, staging, or localhost hosts.

Do not deploy production or change DNS without explicit approval.

## Task 17 Cloudflare Status

`production:check` currently classifies Cloudflare as partially configured:

- Worker names and compatibility date are present.
- Durable Object binding and cron schedule are present.
- Top-level production and staging Hyperdrive IDs are configured separately.
- Rate Limiting bindings exist, but namespace IDs `1001` and `1002` must be replaced with real Cloudflare namespace IDs.
- `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` is required for local preview and must stay out of git.

The escalated Task 17 run completed `cf:typegen`, `build:cloudflare`, `cf:dry-run`, and `production:predeploy`. Rerun the gates after any provider or Cloudflare configuration change.
