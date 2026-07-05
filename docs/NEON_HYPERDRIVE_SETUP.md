# Neon and Hyperdrive Setup

Neon is the source of truth for lead submissions and Admin content.

## URLs

- `DATABASE_URL`: direct Neon URL for local development, Drizzle generation, migrations, and CLI scripts.
- `HYPERDRIVE.connectionString`: runtime URL exposed by the Cloudflare binding in production.

Do not commit either URL.

## Setup

1. Create a Neon project and production branch/database.
2. Create a direct migration connection string with SSL enabled.
3. Create a Cloudflare Hyperdrive config that points to the Neon pooled/runtime endpoint.
4. Put the Hyperdrive ID into `wrangler.jsonc`.
5. Run migrations only after credentials are confirmed.
6. Verify with `SELECT 1` and `npm run insights:verify-database`.

Static public builds do not require database connectivity.
