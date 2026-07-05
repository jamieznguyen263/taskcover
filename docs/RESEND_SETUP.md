# Resend Setup

Required variables:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_REPLY_TO_EMAIL`
- `LEAD_NOTIFICATION_EMAIL`

Expected values:

- From: `Taskcover Agency <business@taskcover.com>`
- Reply-to: `business@taskcover.com`
- Internal recipient: `business@taskcover.com`

## Domain Authentication

1. Add `taskcover.com` in Resend.
2. Copy exact DKIM/SPF records from the Resend dashboard.
3. Add a conservative DMARC starter policy, for example `p=none`, then tighten after monitoring.
4. Verify the domain in Resend.
5. Send explicit Admin test messages for EN/FR/ES visitor confirmations.

Do not invent DNS values. Copy exact values from Resend.
