# Cloudflare Deployment

Taskcover runs on Cloudflare Workers through OpenNext.

Wrangler values still requiring real Cloudflare values:

| Config | Current value | Source |
| --- | --- | --- |
| Worker name | `taskcover` | Cloudflare Workers project name |
| Staging Worker name | `taskcover-staging` | Cloudflare Workers staging project |
| Hyperdrive binding | `HYPERDRIVE` | Cloudflare Hyperdrive binding name |
| Hyperdrive ID | placeholder zeros | Cloudflare Hyperdrive dashboard |
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
