# Production Deployment

Production deployment is intentionally explicit. It does not run migrations, does not modify DNS, and does not switch `INSIGHTS_PROVIDER` automatically.

Current production blocker as of 2026-07-08: local database status is staging (`DATABASE_TARGET=staging`, database `taskcover_staging`), and the same Hyperdrive ID is configured for top-level production and staging in `wrangler.jsonc`. Do not deploy database-backed production until a separate production Neon database or branch and production Hyperdrive binding are confirmed.

Pre-deploy gates:

```bash
npm run production:check
npm run db:verify
npm run insights:verify-database
npm test
npm run lint
npm run typecheck
npm run build
npm run build:cloudflare
npm run cf:dry-run
```

Combined local gate:

```bash
npm run production:predeploy
```

Deploy only after explicit approval:

```bash
npm run deploy:cloudflare
```

This expands to:

```bash
npm run build:cloudflare && opennextjs-cloudflare deploy
```

Staging deploy, after staging provider setup and explicit approval:

```bash
npm run build:cloudflare
wrangler deploy --env staging
```

Post-deploy:

```bash
npm run smoke:deployment -- --base-url=https://taskcover.com
npm run production:check
```

If any check fails, roll back the Worker version and keep `INSIGHTS_PROVIDER=local`.

Initial production launch must keep:

```bash
LEAD_SUBMISSION_MODE=disabled
```

Do not use `staging-durable` on `taskcover.com` or `www.taskcover.com`.

## Task 17 Production Boundary

Task 17 did not deploy production, did not change DNS, and did not run production migrations. Production remains blocked until staging verification passes and the user gives separate written approval.

Do not run `npm run deploy:cloudflare` from the default Task 17 workflow. Do not run production migrations unless all three are true:

- `DATABASE_TARGET=production`
- `CONFIRM_PRODUCTION_MIGRATION=YES`
- the user explicitly approves production migration in the current task context
