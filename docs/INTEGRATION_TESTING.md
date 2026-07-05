# Integration Testing

All integration commands are offline by default unless a `--live` or equivalent explicit flag is passed.

| Integration | Offline command | Optional live command |
| --- | --- | --- |
| Environment | `npm run production:check` | `npm run production:check -- --live` does not mutate providers |
| Leads | `npm run leads:smoke` | `npm run leads:smoke -- --mode=test-provider --allow-provider-side-effects` |
| Resend | `npm run integrations:test-resend` | `npm run integrations:test-resend -- --live` sends one labeled email to configured recipient |
| HubSpot | `npm run integrations:test-hubspot` | `npm run integrations:test-hubspot -- --live`; add `--create-test-contact` to write a labeled Contact |
| Cal.com | `npm run integrations:test-calcom` | `npm run integrations:test-calcom -- --live` performs a safe link check |
| Turnstile | `npm run integrations:test-turnstile` | `npm run integrations:test-turnstile -- --live --token=<token>` |
| Cloudinary | `npm run integrations:test-cloudinary` | Use Admin UI for an explicit signed staging upload |
| Rate limiting | `npm run rate-limits:verify` | Cloudflare binding behavior is verified in staging preview |
| Scheduler | `npm run scheduler:verify` | `wrangler dev --test-scheduled` after local Hyperdrive is configured |

Live tests must not print API keys, database URLs, tokens, full provider responses, or lead PII.
