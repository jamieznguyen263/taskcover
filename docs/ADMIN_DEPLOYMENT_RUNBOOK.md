# Admin Deployment Runbook

Local setup:

1. Install dependencies: `npm install`
2. Copy `.env.example` into local env storage.
3. Keep `INSIGHTS_PROVIDER=local` until database import is verified.
4. Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`.

Database setup:

1. Configure `DATABASE_URL`.
2. Run `npm run db:migrate`.
3. Run `npm run admin:create -- admin@example.com`.
4. Run `npm run insights:import`.
5. Verify 6 article groups and 18 localizations.
6. Verify published snapshots and public routes in database mode.

Production publishing setup:

1. Configure Cloudinary variables.
2. Configure `PUBLISH_CRON_SECRET`.
3. Set `PUBLISH_SCHEDULER_PROVIDER` to the real scheduler provider.
4. Configure external cron to POST `/api/internal/publishing/run` with the secret header.
5. Test manual publish and scheduled publish.
6. Switch `INSIGHTS_PROVIDER=database`.

Rollback:

Set `INSIGHTS_PROVIDER=local` and redeploy. The public site will use local Insights content while Admin data remains preserved in PostgreSQL.

Backups:

Back up PostgreSQL before migrations and before bulk imports. Published revisions are immutable but do not replace database backups.
