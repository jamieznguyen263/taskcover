# Lead Delivery Architecture

Lead acceptance is database-first.

## Order

1. Normalize and validate payload.
2. Apply rate limiting.
3. Verify Turnstile when configured.
4. Insert or return the lead in `lead_submissions`.
5. Create deterministic jobs in `lead_delivery_jobs`.
6. Return success after the database transaction commits.
7. Retry Resend and HubSpot through the outbox processor.

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
