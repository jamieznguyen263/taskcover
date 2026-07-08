# Lead Delivery Architecture

Lead acceptance is database-first.

## Submission Modes

`LEAD_SUBMISSION_MODE` is a hard gate:

- `disabled`: default fail-closed mode. The API validates input but does not accept or store a lead.
- `test`: local UI-only success path. It returns a safe test reference and thank-you redirect without Neon, outbox, Resend, or HubSpot side effects.
- `staging-durable`: staging-only durable path. It verifies Turnstile when configured, writes the lead and outbox jobs to Neon, and returns success after the transaction commits. It fails closed on `taskcover.com` and `www.taskcover.com`.
- `production-durable`: production-only durable path. It fails closed unless `APP_URL` and `NEXT_PUBLIC_APP_URL` are `https://taskcover.com`, production Hyperdrive is bound, Cloudflare `LEAD_RATE_LIMITER` is available, Resend is configured, and Turnstile is configured with hostname `taskcover.com` and action `lead-submit`.

## Order

1. Normalize and validate payload.
2. Reject honeypot spam and malformed payloads.
3. Verify production durable prerequisites when `LEAD_SUBMISSION_MODE=production-durable`.
4. Apply rate limiting.
5. Verify Turnstile when configured.
6. Insert or return the lead in `lead_submissions`.
7. Create deterministic jobs in `lead_delivery_jobs`.
8. Return success after the database transaction commits.
9. Retry Resend and HubSpot through the outbox processor.

External API calls never run inside the acceptance transaction.

## Idempotency

- Lead key: deterministic hash of request type, locale, email, source path, website, company, and message.
- Delivery job key: lead ID plus provider job type.
- Resend key: lead ID, template type, locale, and recipient.
- HubSpot: normalized email is the contact lookup key; stored provider IDs prevent duplicate work after first sync.

## Failure Behavior

- Database failure: no success redirect.
- Resend/HubSpot failure after acceptance: lead remains accepted and the job retries.
- Permanent provider failures move to `dead-letter`.
- Missing provider config cancels/skips provider jobs without discarding the lead.
