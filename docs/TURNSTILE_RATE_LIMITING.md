# Turnstile and Rate Limiting

Turnstile values:

- `TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `TURNSTILE_EXPECTED_HOSTNAME`
- `TURNSTILE_EXPECTED_ACTION=lead-submit`

Allowed production hostnames:

- `taskcover.com`
- `www.taskcover.com` only for redirect testing
- approved staging/preview hostname where applicable

Use Cloudflare test keys in local development and real keys in staging/production. Tokens are never logged.

Rate limiting:

- Cloudflare binding: `LEAD_RATE_LIMITER`
- Cloudflare binding: `ADMIN_RATE_LIMITER`
- Durable Object: `RATE_LIMIT_COORDINATOR`
- Raw IP addresses are hashed before key construction.
- Production lead capture requires `RATE_LIMIT_PROVIDER=cloudflare` and a live `LEAD_RATE_LIMITER` binding.

Cloudflare Rate Limiting namespace setup:

- Wrangler supports rate-limit bindings through the `ratelimits` array in `wrangler.jsonc`.
- `namespace_id` is an account-unique positive integer string used by Cloudflare Rate Limiting. Cloudflare's documentation examples use `1001` and `1002`; in this repo those values are treated as placeholders and must be replaced before `LEAD_SUBMISSION_MODE=production-durable`.
- There is no separate dashboard-created namespace to bind for this Worker API. Pick two account-unique positive integers, replace `LEAD_RATE_LIMITER.namespace_id` and `ADMIN_RATE_LIMITER.namespace_id`, then run `npm run production:check` and `npm run cf:dry-run`.
- Cloudflare docs note that rate limiting bindings are not currently visible in the Cloudflare dashboard; monitor through Workers logs/traces or Analytics Engine after launch.

Verification:

```bash
npm run integrations:test-turnstile
npm run rate-limits:verify
```

Live Turnstile verification requires a token:

```bash
npm run integrations:test-turnstile -- --live --token=<token>
```

Do not expose a public reset endpoint.

## Task 17 Status

Turnstile is not activated in this workspace because keys and hostname settings are missing:

- `TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `TURNSTILE_EXPECTED_HOSTNAME`
- `TURNSTILE_EXPECTED_ACTION`

Rate-limit logic passed local verification with privacy-safe hashed keys. Cloudflare bindings are declared, but the namespace IDs in `wrangler.jsonc` must be replaced with account-unique production values before production durable lead capture.
