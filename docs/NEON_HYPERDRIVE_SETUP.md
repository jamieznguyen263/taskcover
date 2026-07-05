# Neon and Hyperdrive Setup

Use separate Neon branches or databases for local development, staging, and production.

Local activation:

```bash
DATABASE_TARGET=development npm run db:status
DATABASE_TARGET=development npm run db:migrate
npm run db:verify
npm run insights:import
npm run insights:verify-database
```

Production migration requires both:

```bash
DATABASE_TARGET=production
CONFIRM_PRODUCTION_MIGRATION=YES
```

Do not rely on the hostname alone for migration safety.

Hyperdrive:

1. Create a Cloudflare Hyperdrive config pointed at the Neon target.
2. Put the real ID in `wrangler.jsonc` for the correct environment.
3. Keep binding name `HYPERDRIVE`.
4. For local preview only, set `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` in `.dev.vars`.

Verification commands:

```bash
npm run production:check
npm run db:verify
npm run insights:verify-database
```
