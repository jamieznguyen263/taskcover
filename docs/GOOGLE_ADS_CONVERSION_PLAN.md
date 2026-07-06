# Google Ads Conversion Plan

Task 16 prepares conversion measurement but does not activate live ads or send
real conversion data without public environment configuration and consent.

## Environment Variables

- `NEXT_PUBLIC_GOOGLE_ADS_ID`
- `NEXT_PUBLIC_GOOGLE_ADS_FREE_AUDIT_LABEL`
- `NEXT_PUBLIC_GOOGLE_ADS_STRATEGY_CALL_LABEL`
- `NEXT_PUBLIC_GOOGLE_ADS_CONTACT_LABEL`

All are empty in examples. Values belong in deployment environment settings,
not source code.

## Primary Conversion Rules

Primary conversion success requires:

1. Lead form validation passes.
2. Anti-spam/rate limit/Turnstile checks pass where configured.
3. Backend durably accepts the lead.
4. API returns `status: "success"` and an opaque `leadReference`.
5. Client fires `lead_form_success` and request-type-specific success once.
6. Marketing consent exists before any Google Ads conversion readiness event.
7. Google Ads ID and the action label are configured.

The thank-you page never emits primary conversion success.

## Conversion Actions

| Request type | App event | Google Ads action | Label env |
| --- | --- | --- | --- |
| Free SEO Audit accepted | `free_audit_request_success` | Free SEO Audit accepted | `NEXT_PUBLIC_GOOGLE_ADS_FREE_AUDIT_LABEL` |
| Strategy Call accepted | `strategy_call_request_success` | Strategy Call request accepted | `NEXT_PUBLIC_GOOGLE_ADS_STRATEGY_CALL_LABEL` |
| General Contact accepted | `contact_request_success` | Qualified Contact accepted | `NEXT_PUBLIC_GOOGLE_ADS_CONTACT_LABEL` |

Secondary events such as media inquiry, private reference, data request,
Cal.com click, pricing tab engagement, and CTA clicks should not be primary
bid-optimization goals by default.

## PII Rules

Conversion payloads must not include name, email, phone, company, message,
website URL, full URL query strings, raw click IDs, IP, user agent, provider
IDs, or CRM deal IDs.

Enhanced conversions and offline upload are not implemented in Task 16.
Review legal, consent, and provider requirements before adding hashing or
server-side uploads.
