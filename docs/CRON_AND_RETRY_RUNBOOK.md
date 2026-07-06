# Cron and Retry Runbook

The Cloudflare scheduled handler in `worker/taskcover-worker.ts` calls:

- due Insights publisher
- stale lead delivery lock recovery
- lead retry processor

Current schedule:

```text
*/5 * * * *
```

Verification:

```bash
npm run scheduler:verify
wrangler dev --test-scheduled
```

Expected behavior:

- UTC scheduled time.
- Due articles publish once.
- Future articles remain scheduled.
- Duplicate triggers are idempotent.
- Lead retry failure does not stop article publishing.
- Article publish failure does not stop lead retries.
- Batch sizes stay bounded.
- Logs summarize counts without PII.

The secure HTTP publishing endpoint remains available and must not expose scheduler internals publicly.

## Task 17 Status

`npm run scheduler:verify` passed static wiring checks. The cron schedule exists in `wrangler.jsonc`, but `PUBLISH_CRON_SECRET` was not configured locally. Staging still needs an actual scheduled invocation test after Hyperdrive, DB, and secrets are configured.
