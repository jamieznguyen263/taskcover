# HubSpot Setup

Required variables:

- `HUBSPOT_PRIVATE_APP_TOKEN`
- `HUBSPOT_PIPELINE_ID`
- `HUBSPOT_NEW_LEAD_STAGE_ID`

## Private App

Create a HubSpot Private App with minimum CRM object scopes for contacts, companies, deals, and associations.

## Properties

The implementation sends `taskcover_original_lead_reference` as an optional custom property. Create it for contacts, companies, and deals before enabling live sync, or remove it from mapping after review.

Failures from invalid properties are categorized and do not discard the original lead.
