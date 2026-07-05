# Cloudflare Workers Deployment

Taskcover is prepared for Cloudflare Workers Paid with OpenNext for Cloudflare.

## Configuration

- Adapter: `@opennextjs/cloudflare`
- Wrangler config: `wrangler.jsonc`
- Worker entry: `worker/taskcover-worker.ts`
- OpenNext output: `.open-next/worker.js`
- Static assets: `.open-next/assets`
- Compatibility flags: `nodejs_compat`, `global_fetch_strictly_public`
- Cron: every 5 minutes
- Canonical origin: `https://taskcover.com`

## Commands

- `npm run build`: standard Next.js build.
- `npm run build:cloudflare`: OpenNext Worker build.
- `npm run preview:cloudflare`: local Worker runtime preview.
- `npm run cf:typegen`: generate `cloudflare-env.d.ts`.
- `npm run cf:dry-run`: validate/upload bundle locally without deploying.
- `npm run deploy:cloudflare`: production deploy command. Do not run without approval.

## Required Bindings

- `HYPERDRIVE`: Neon PostgreSQL runtime connectivity.
- `LEAD_RATE_LIMITER`: Cloudflare Rate Limiting binding.
- `ADMIN_RATE_LIMITER`: Cloudflare Rate Limiting binding.
- `RATE_LIMIT_COORDINATOR`: Durable Object namespace for coordinated counters.
- `ASSETS`: OpenNext static assets binding.
- `WORKER_SELF_REFERENCE`: OpenNext service binding.

Replace placeholder IDs in `wrangler.jsonc` after the Cloudflare resources exist.

## Domain

Preferred Cloudflare rule:

- Redirect `https://www.taskcover.com/*` to `https://taskcover.com/$1` with status 301/308.
- Redirect HTTP to HTTPS.

The app-level `src/proxy.ts` also redirects `www.taskcover.com` and HTTP requests only on production hosts.

## Rollback

Use `wrangler versions list`, inspect the previous known-good version, then use `wrangler rollback`. Keep the commit hash and migration state in the release notes.
