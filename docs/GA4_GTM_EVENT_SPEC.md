# GA4 / GTM Event Spec

Events are typed in `src/lib/analytics/events.ts` and dispatched through
`src/lib/analytics/data-layer.ts`.

## DataLayer Shape

Each event uses:

```json
{
  "event": "lead_form_success",
  "event_name": "lead_form_success"
}
```

Parameters are sanitized before push. Full URLs, names, emails, phone numbers,
company values, message text, website URLs, raw IPs, user agents, Turnstile
tokens, session tokens, Admin IDs, HubSpot/Resend IDs, CRM deal IDs, and raw
click IDs are not allowed.

## Event Names

Page and engagement:

- `page_view_safe`
- `cta_click`
- `pricing_tab_view`
- `pricing_decision_select`
- `case_study_view`
- `sample_audit_view`
- `insight_article_view`
- `cookie_banner_view`
- `cookie_preferences_update`

Lead funnel:

- `lead_form_view`
- `lead_form_start`
- `lead_form_step_complete`
- `lead_form_validation_error`
- `lead_form_submit_attempt`
- `lead_form_success`
- `lead_form_delivery_unavailable`
- `lead_form_error`

Specific accepted lead events:

- `free_audit_request_success`
- `strategy_call_request_success`
- `contact_request_success`
- `media_inquiry_success`
- `private_reference_request_success`
- `data_request_success`

Scheduling:

- `calcom_cta_view`
- `calcom_cta_click`

Supporting:

- `thank_you_view`
- `google_ads_conversion_ready`

## Safe Parameters

Supported parameters include locale, page path without query, page type,
service/industry/market slug, pricing tab, form type, request type, funnel
step, success category, error category, safe UTM fields, and click-id presence
booleans.

Raw click IDs are captured only in local attribution storage after consent and
are not pushed to dataLayer.

## GA4 Mapping Candidates

Recommended custom dimensions:

- `locale`
- `page_type`
- `form_type`
- `request_type`
- `pricing_tab`
- `service_slug`
- `industry_slug`
- `market_slug`
- `funnel_step`
- `error_category`
- `success_category`

GA4 should be configured in GTM after legal/provider review. No GA4 measurement
ID is hardcoded in the app.
