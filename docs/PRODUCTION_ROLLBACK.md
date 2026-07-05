# Production Rollback

Rollback priority is to preserve lead persistence and prevent duplicate provider side effects.

| Scenario | Rollback |
| --- | --- |
| Worker regression | Roll back to the previous Worker version in Cloudflare Dashboard or redeploy the last known good commit. |
| Database-backed Insights issue | Set `INSIGHTS_PROVIDER=local` and redeploy or update the environment variable. |
| Migration issue | Do not assume SQL rollback is safe. Restore from a Neon backup or branch snapshot. |
| Cron issue | Disable the Cron Trigger or set `PUBLISH_SCHEDULER_PROVIDER=disabled`. |
| HubSpot outage | Keep leads persisted, disable HubSpot jobs, retry later from outbox. |
| Resend outage | Preserve lead records and internal notification jobs, retry later. |
| Canonical redirect issue | Disable the Cloudflare Redirect Rule; preview/staging/localhost must not redirect to production. |
| Cloudinary outage | Disable media uploads; keep existing delivery URLs. |
| Turnstile outage | Production should fail closed when enabled; temporarily disable lead acceptance only with approval. |
| Rate-limit binding outage | Prefer fail closed for production submission endpoints; keep memory fallback development-only. |

Do not delete persisted leads during rollback.
