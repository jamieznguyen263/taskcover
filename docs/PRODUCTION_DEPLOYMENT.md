# Production Deployment

Production deployment is intentionally explicit. It does not run migrations, does not modify DNS, and does not switch `INSIGHTS_PROVIDER` automatically.

Current production status as of 2026-07-08: production database migration, Admin verification, Insights verification, and the production Hyperdrive binding have been confirmed. Top-level production Hyperdrive uses `3a4967f8e714435eb58bda3521531a24`; staging remains `1feebc80ed4541f482c7a0f687682bf8`. Keep production lead capture disabled for the first Worker deploy.

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

Deploy only after explicit approval. On Windows, use the safe prompt wrapper so OpenNext/Wrangler can emulate the Hyperdrive binding during the local deploy build without committing or echoing the production Neon connection string:

```bash
npm run deploy:cloudflare:prod-safe
```

The wrapper prompts with PowerShell `Read-Host -AsSecureString`, sets only the current process variable `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE`, runs the existing deploy command, and clears the variable after the deploy attempt. It does not change production Hyperdrive runtime behavior; the deployed Worker still uses the `HYPERDRIVE` binding configured in Cloudflare.

The underlying deploy command remains:

```bash
npm run build:cloudflare && opennextjs-cloudflare deploy
```

Do not add the production Neon connection string to `wrangler.jsonc`, `.env.local`, `.dev.vars`, `.env`, chat, shell history, or committed docs. If the connection string was ever pasted into chat or logs, rotate the Neon password before deployment.

Staging deploy, after staging provider setup and explicit approval:

```bash
npm run build:cloudflare
wrangler deploy --env staging
```

Post-deploy:

```bash
npm run smoke:deployment -- --base-url=<WORKER_URL>
npm run production:check
```

Smoke test the Worker URL before binding `taskcover.com` or `www.taskcover.com`. If any check fails, roll back the Worker version and keep `LEAD_SUBMISSION_MODE=disabled`.

Initial production launch must keep:

```bash
LEAD_SUBMISSION_MODE=disabled
```

Do not use `staging-durable` on `taskcover.com` or `www.taskcover.com`.

Full production lead capture must use `LEAD_SUBMISSION_MODE=production-durable` only after production Turnstile, Hyperdrive, Resend, Cal.com, and non-placeholder Cloudflare Rate Limiting namespace IDs pass `npm run production:check`.

## Task 17 Production Boundary

Task 17 did not deploy production, did not change DNS, and did not run production migrations. Production remains blocked until staging verification passes and the user gives separate written approval.

Do not run `npm run deploy:cloudflare` from the default Task 17 workflow. Do not run production migrations unless all three are true:

- `DATABASE_TARGET=production`
- `CONFIRM_PRODUCTION_MIGRATION=YES`
- the user explicitly approves production migration in the current task context
