# Resend Setup

Production sender:

- From: `Taskcover Agency <business@taskcover.com>`
- Reply-to: `business@taskcover.com`
- Notification recipient: `business@taskcover.com`

Required values:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_REPLY_TO_EMAIL`
- `LEAD_NOTIFICATION_EMAIL`

Offline verification:

```bash
npm run integrations:test-resend
```

Optional live verification sends one clearly labeled test email to the configured notification recipient:

```bash
npm run integrations:test-resend -- --live
```

Do not send live visitor emails during builds, tests, or default smoke checks.

## Task 17 Status

Offline Resend verification passed template rendering, but live Resend is not activated in this workspace. Required missing values:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_REPLY_TO_EMAIL`
- `LEAD_NOTIFICATION_EMAIL`

Run the live test only after Resend domain verification and explicit approval for one labeled test email to `business@taskcover.com`.
