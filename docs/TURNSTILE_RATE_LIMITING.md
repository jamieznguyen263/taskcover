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

Rate-limit logic passed local verification with privacy-safe hashed keys. Cloudflare bindings are declared, but the namespace IDs in `wrangler.jsonc` must be replaced with real Cloudflare values before staging.
