# Privacy and Cookie Architecture

The privacy policy reflects the implemented Taskcover system: public lead forms, Data Request, Admin account/session data, technical request metadata, UTM fields, spam signals, rate-limit signals, Turnstile verification status when configured, database-first lead acceptance through Neon via Hyperdrive, and outbox jobs for Resend and HubSpot.

Named planned or implemented providers: Cloudflare, Neon, Resend, HubSpot, Cal.com, and Cloudinary.

## Cookie Categories

- Strictly necessary: security, Admin sessions, form protection, preferences architecture, rate limiting, and site functionality.
- Preferences: local preference state such as cookie category choices.
- Analytics: reserved for future consent-aware measurement.
- Marketing / advertising: reserved for future consent-aware ad tags and conversion measurement.

## Task 16 Measurement Readiness

Task 16 adds the full localized consent banner, shared Cookie Preferences
integration, consent-mode mapping, GTM readiness, typed dataLayer events,
Google Ads conversion readiness, debug QA tooling, safe attribution capture,
and SEM documentation.

No provider IDs are hardcoded. GTM does not load without
`NEXT_PUBLIC_GTM_ID`, and it still waits for analytics or marketing consent.
Google Ads conversion readiness requires marketing consent plus configured
Google Ads ID and conversion label.

UTM and click-id capture is first-party localStorage only, after analytics or
marketing consent, with 60-day retention. Raw click IDs are not pushed into
dataLayer.

PII is forbidden in analytics events: names, emails, phone numbers, company
values, message text, website URLs, full query URLs, raw IP, user agent,
Turnstile tokens, session tokens, provider IDs, and CRM deal IDs.

Final legal review is required before launch. This document does not claim
GDPR, CCPA, or other legal compliance certification.
