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
