# Turnstile and Rate Limiting

## Turnstile

Variables:

- `TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `TURNSTILE_EXPECTED_HOSTNAME`
- `TURNSTILE_EXPECTED_ACTION=lead-submit`

When configured, verification fails closed. Tokens and raw bot payloads are not persisted.

## Rate Limiting

Local development uses `RATE_LIMIT_PROVIDER=memory`.

Production should use:

- Cloudflare Rate Limiting binding for fast per-location limits.
- `RATE_LIMIT_COORDINATOR` Durable Object when coordinated counters are required.

Raw IP addresses are hashed before constructing application rate-limit keys.
