# Offline Conversion Readiness

Task 16 prepares for future CRM/offline conversion import without uploading
anything to Google, Microsoft, LinkedIn, or HubSpot in this task.

## Why Offline Conversion Matters

SEM should not optimize only for raw form submit. HubSpot/CRM should later
classify lead quality and business outcomes so campaigns can optimize toward
qualified opportunities and won clients.

Future lifecycle stages:

- New lead
- Contacted
- Qualified
- Strategy call booked
- Proposal sent
- Won
- Lost

## Safe Hook Points

Future CRM/offline conversion logic may use:

- opaque lead ID
- request type
- source page path without query
- locale
- consent state at submission
- safe UTM values when captured with consent
- click IDs only when captured and retained lawfully
- CRM sync status

Do not use:

- names
- emails
- phone numbers
- company names where identifiable
- message text
- website URL
- raw IP
- user agent fingerprint
- Turnstile token
- provider IDs from Resend/HubSpot
- CRM deal IDs in analytics

## Current Implementation

The public forms include safe UTM fields in lead payloads only when analytics
or marketing consent allows attribution storage. Raw click IDs are not sent in
analytics events. Task 16 stores attribution locally for 60 days when allowed.

The backend durable lead reference remains the success anchor. No offline
conversion upload is implemented.

## Future Go-Live Steps

1. Complete legal and provider review.
2. Confirm click-ID retention and disclosure.
3. Add CRM fields for consent state, attribution, source page, request type,
   lifecycle stage, and sync status.
4. Import qualified lead/opportunity/won signals after CRM validation.
5. Keep raw form submit as a diagnostic event, not the only optimization goal.
