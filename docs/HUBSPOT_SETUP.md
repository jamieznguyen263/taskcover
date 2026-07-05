# HubSpot Setup

Use a HubSpot Private App. Do not alter HubSpot schemas automatically from this repository.

Required values:

- `HUBSPOT_PRIVATE_APP_TOKEN`
- `HUBSPOT_PIPELINE_ID`
- `HUBSPOT_NEW_LEAD_STAGE_ID`

Offline verification:

```bash
npm run integrations:test-hubspot
```

Optional live checks:

```bash
npm run integrations:test-hubspot -- --live
npm run integrations:test-hubspot -- --live --create-test-contact
```

Optional custom properties to create manually:

- `taskcover_original_lead_reference`
- `taskcover_request_type`
- `taskcover_market`
- `taskcover_service_interests`
- `taskcover_source_path`
- `taskcover_preferred_timezone`

Do not create live Contacts or Deals by default.
