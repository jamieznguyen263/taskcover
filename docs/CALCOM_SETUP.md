# Cal.com Setup

Required value:

- `CALCOM_BOOKING_URL`

Taskcover only uses a public Cal.com booking URL. No Cal.com API key or webhook secret is required for the current lead flow.

Rules:

- URL must be HTTPS.
- Expected host is `cal.com`, `www.cal.com`, or `app.cal.com`.
- Do not append visitor PII in query parameters.
- CTA appears only when configured.
- CTA is localized by the thank-you page copy.
- The site never shows a false booking confirmation.
- Production value format: `CALCOM_BOOKING_URL=https://cal.com/...`

Verification:

```bash
npm run integrations:test-calcom
npm run integrations:test-calcom -- --live
```

## Task 17 Status

`CALCOM_BOOKING_URL` was not configured during Task 17. The offline check passed because the CTA hides safely when the URL is missing and the site does not claim a booking was confirmed.
