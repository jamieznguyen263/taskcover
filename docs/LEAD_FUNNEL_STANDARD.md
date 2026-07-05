# Taskcover Lead Funnel Standard

Task 9 adds a localized EN/FR/ES lead funnel for `/free-seo-audit`, `/book-a-call`, `/contact`, and `/thank-you`. French and Spanish keep English slugs under `/fr` and `/es`.

## Page Purposes

- Free SEO Audit: three-step diagnostic assessment wizard.
- Book a Call: strategy-call request planner, not a confirmed booking.
- Contact: intent-based request routing desk.
- Thank You: localized confirmation after accepted delivery.

## Architecture

Lead types, normalized fields, and adapter contracts live in `src/lib/leads/types.ts`. Validation lives in `src/lib/leads/schema.ts`. Delivery adapters live in `src/lib/leads/adapters.ts`. Final submissions post to `src/app/api/leads/route.ts`.

Supported lead types are `seo-audit`, `strategy-call`, `general-contact`, `media-inquiry`, `private-reference`, `partnership`, `seo-mentor`, `ppc-inquiry`, and `other`.

Delivery adapters return `accepted`, `rejected`, `not-configured`, or `temporary-error`. `not-configured` is never converted into success.

## Current Adapters

- Safe test adapter, enabled only with `LEAD_SUBMISSION_MODE=test`.
- Generic lead webhook adapter via `LEAD_WEBHOOK_URL`.
- Generic CRM webhook adapter via `CRM_WEBHOOK_URL`.
- Future notification, storage, and calendar adapter stubs.

Default future notification recipient: `business@taskcover.com`.

## Submission Behavior

Server-side submission flow:

1. Parse JSON payload.
2. Normalize and validate fields.
3. Reject honeypot submissions.
4. Rate-limit final submit attempts.
5. Verify Turnstile only when both keys are configured.
6. Attempt configured delivery adapters.
7. Redirect only when at least one adapter returns `accepted`.

When no adapter is configured, the form shows a localized direct email fallback to `business@taskcover.com` and does not redirect to thank-you.

## Spam Protection

Honeypot is always rendered. Rate limiting defaults to memory for development and single-instance QA only. Production must use a durable edge-safe provider such as Cloudflare KV, Durable Objects, Upstash Redis, or another shared store. Cloudflare Turnstile renders only when a site key is configured and verifies server-side only when both site and secret keys exist.

## Validation

Custom TypeScript validation avoids adding a new dependency. It validates required fields, email, URL, enum values, consent, field lengths, allowed fields, and preferred call-window count. It trims strings, lowercases email, normalizes URLs, removes empty optional fields, and rejects malformed payloads.

Client validation is progressive for usability. Server validation is authoritative.

## Analytics

`src/lib/leads/analytics.ts` exposes provider-neutral events. Payloads must not include names, emails, full URLs, free-text messages, or PII. Allowed metadata includes form type, locale, step, service category, industry, market, intent, and success/error category.

If `window.dataLayer` exists, sanitized events are pushed there. No GA4 or GTM tag is installed by this task.

## Thank-You Behavior

Thank-you pages are noindex and excluded from sitemap. They support safe request-type query values and never place PII in the URL. They include request-specific confirmation, next steps without response-time promises, relevant case-study and sample-audit pathways, and analytics-ready conversion hooks.

## CTA Routing Standard

- Free audit: localized `/free-seo-audit`
- Strategy call: localized `/book-a-call`
- Contact: localized `/contact`
- Private reference: localized `/contact?intent=private-reference`
- Media inquiry: localized `/contact?intent=media`

Language switching preserves safe `intent` and `type` query values only.

## Environment Variables

See `.env.example` for documented configuration:

- `LEAD_SUBMISSION_MODE`
- `LEAD_NOTIFICATION_EMAIL`
- `LEAD_WEBHOOK_URL`
- `CRM_WEBHOOK_URL`
- `CALENDAR_PROVIDER`
- `CALENDAR_BOOKING_URL`
- `TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `RATE_LIMIT_PROVIDER`
- `RATE_LIMIT_NAMESPACE`

## Future Provider Steps

1. Choose delivery provider: email service, CRM, webhook queue, or durable storage.
2. Implement a `LeadDeliveryAdapter` returning explicit statuses.
3. Configure provider secrets only in server environment variables.
4. Add durable rate limiting for production.
5. Add a real `CalendarAdapter` before claiming confirmed bookings.
6. QA no-PII logging and analytics before launch.

## Task 12 Data Request

Supported lead types now include `data-request`.

Data Request is a privacy/data request pathway for access, correction, deletion,
marketing opt-out, cookie/preference questions, and other privacy requests. It
uses the same anti-spam, rate-limit, Turnstile-ready, and database-first lead
architecture as other public forms.

The form must not collect government ID or sensitive documents by default. It
may state that Taskcover can require identity verification before acting. If
providers are unavailable, it must show a direct-email fallback instead of a
false success.
