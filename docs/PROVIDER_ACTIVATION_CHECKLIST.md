# Provider Activation Checklist

Use this checklist when enabling Taskcover providers. Do not paste secrets into chat. Paste secrets only into `.env.local`, `.dev.vars`, `wrangler secret put`, Cloudflare Dashboard, or the provider dashboard.

Default state is safe:

```bash
LEAD_SUBMISSION_MODE=disabled
```

Run this after every env edit:

```bash
npm run production:check
```

## Local Files

Use `.env.local` for local Node scripts:

```bash
copy .env.example .env.local
```

Use `.dev.vars` for Cloudflare local preview:

```bash
copy .dev.vars.example .dev.vars
```

Never commit `.env.local` or `.dev.vars`.

## Lead Submission Modes

| Mode | What it does | Safe use |
| --- | --- | --- |
| `disabled` | Fails closed after validation; no lead is accepted. | Default local/staging/production state. |
| `test` | Allows local UI success and thank-you redirect with a safe test reference; no Neon/outbox/provider side effects. | Local form UX QA only. |
| `staging-durable` | Verifies Turnstile when configured, writes the lead and provider outbox jobs to Neon, then redirects to thank-you. It fails closed on `taskcover.com`/`www.taskcover.com`. | Staging only after Neon, Turnstile, and rate limits are configured. |

No production lead submission mode exists yet. Do not set a production Worker to `staging-durable`.

For the full staging lead path:

1. Set `LEAD_SUBMISSION_MODE=staging-durable` only in staging/local preview.
2. Configure Turnstile and Neon.
3. Submit the Free SEO Audit form against the staging/preview host.
4. Confirm the Neon lead record and outbox jobs.
5. Run `npm run leads:process` or trigger the approved Cron path to deliver Resend/HubSpot jobs.

## What To Paste

### Application

`.env.local`:

```bash
APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
LEAD_SUBMISSION_MODE=disabled
```

`.dev.vars`:

```bash
APP_URL=http://localhost:8787
NEXT_PUBLIC_APP_URL=http://localhost:8787
LEAD_SUBMISSION_MODE=disabled
```

Cloudflare staging public vars:

```bash
APP_URL=https://staging.taskcover.com
NEXT_PUBLIC_APP_URL=https://staging.taskcover.com
LEAD_SUBMISSION_MODE=disabled
```

Cloudflare production public vars for first website publish:

```bash
APP_URL=https://taskcover.com
NEXT_PUBLIC_APP_URL=https://taskcover.com
INSIGHTS_PROVIDER=database
LEAD_SUBMISSION_MODE=disabled
RESEND_FROM_EMAIL=Taskcover Agency <business@taskcover.com>
RESEND_REPLY_TO_EMAIL=business@taskcover.com
LEAD_NOTIFICATION_EMAIL=business@taskcover.com
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<production site key>
TURNSTILE_SITE_KEY=<production site key>
TURNSTILE_EXPECTED_HOSTNAME=taskcover.com
TURNSTILE_EXPECTED_ACTION=lead-submit
```

Use production `INSIGHTS_PROVIDER=database` only after production Neon migration, Insights import, and database verification pass. If production DB is not ready, keep production `INSIGHTS_PROVIDER=local`.

### Neon / Database

`.env.local` for scripts:

```bash
DATABASE_URL=<paste-neon-development-or-staging-url>
DATABASE_TARGET=development
```

Use `DATABASE_TARGET=staging` before staging migrations/imports. Production migrations also require `CONFIRM_PRODUCTION_MIGRATION=YES` and separate approval.

`.dev.vars` for Cloudflare preview:

```bash
DATABASE_URL=<paste-neon-development-or-staging-url>
CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE=<paste-local-preview-neon-url>
```

Staging/production Workers should use Hyperdrive instead of `DATABASE_URL` in runtime code.

### Cloudflare Hyperdrive

Paste the local preview connection string into `.dev.vars`:

```bash
CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE=<paste-local-preview-neon-url>
```

Paste real Hyperdrive IDs into the Cloudflare binding configuration for staging/production. If the ID must be written to `wrangler.jsonc`, have Codex make that code change after the ID is available; do not commit secrets.

For the production Worker deploy from Windows, do not paste the production Neon connection string into `.dev.vars` or `wrangler.jsonc`. Run:

```bash
npm run deploy:cloudflare:prod-safe
```

The command uses PowerShell `Read-Host -AsSecureString` and sets `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` only for the deploy process so OpenNext/Wrangler can emulate Hyperdrive locally. Production runtime still uses the Cloudflare `HYPERDRIVE` binding. If the production connection string was ever pasted into chat or logs, rotate the Neon password before deployment.

### Auth / Admin

`.env.local` and `.dev.vars`:

```bash
AUTH_SESSION_SECRET=<paste-long-random-secret>
PREVIEW_TOKEN_SECRET=<paste-long-random-secret>
```

Cloudflare staging:

```bash
wrangler secret put AUTH_SESSION_SECRET --env staging
wrangler secret put PREVIEW_TOKEN_SECRET --env staging
```

Cloudflare production:

```bash
wrangler secret put AUTH_SESSION_SECRET
wrangler secret put PREVIEW_TOKEN_SECRET
```

The Admin email is passed to the Admin scripts as an argument, not stored by default.

### Resend

`.env.local` and `.dev.vars`:

```bash
RESEND_API_KEY=<paste-resend-api-key>
RESEND_FROM_EMAIL=Taskcover Agency <business@taskcover.com>
RESEND_REPLY_TO_EMAIL=business@taskcover.com
LEAD_NOTIFICATION_EMAIL=business@taskcover.com
```

Cloudflare staging:

```bash
wrangler secret put RESEND_API_KEY --env staging
```

Cloudflare production:

```bash
wrangler secret put RESEND_API_KEY
```

Set sender, reply-to, and notification recipient as Cloudflare vars or dashboard environment variables. Run:

```bash
npm run integrations:test-resend
```

Live mode is explicit:

```bash
npm run integrations:test-resend -- --live
```

### Turnstile

`.env.local` and `.dev.vars`:

```bash
TURNSTILE_SITE_KEY=<paste-turnstile-site-key>
TURNSTILE_SECRET_KEY=<paste-turnstile-secret-key>
TURNSTILE_EXPECTED_HOSTNAME=localhost
TURNSTILE_EXPECTED_ACTION=lead-submit
```

Cloudflare staging:

```bash
wrangler secret put TURNSTILE_SECRET_KEY --env staging
```

Cloudflare production:

```bash
wrangler secret put TURNSTILE_SECRET_KEY
```

Set `TURNSTILE_SITE_KEY`, `TURNSTILE_EXPECTED_HOSTNAME`, and `TURNSTILE_EXPECTED_ACTION` as Cloudflare vars. Run:

```bash
npm run integrations:test-turnstile
```

Live mode requires a one-time token and does not log it:

```bash
npm run integrations:test-turnstile -- --live --token=<token>
```

### HubSpot

`.env.local` and `.dev.vars`:

```bash
HUBSPOT_PRIVATE_APP_TOKEN=<paste-hubspot-private-app-token>
HUBSPOT_PIPELINE_ID=<paste-hubspot-pipeline-id>
HUBSPOT_NEW_LEAD_STAGE_ID=<paste-hubspot-new-lead-stage-id>
```

Cloudflare staging:

```bash
wrangler secret put HUBSPOT_PRIVATE_APP_TOKEN --env staging
```

Set pipeline and stage IDs as Cloudflare vars. Run:

```bash
npm run integrations:test-hubspot
```

Creating a test contact is explicit:

```bash
npm run integrations:test-hubspot -- --live --create-test-contact
```

### Cal.com

`.env.local`, `.dev.vars`, and Cloudflare vars:

```bash
CALCOM_BOOKING_URL=<paste-https-calcom-booking-url>
```

Do not include `email`, `name`, `phone`, or `company` query params. Run:

```bash
npm run integrations:test-calcom
```

### Cloudinary

`.env.local` and `.dev.vars`:

```bash
CLOUDINARY_CLOUD_NAME=<paste-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<paste-cloudinary-api-key>
CLOUDINARY_API_SECRET=<paste-cloudinary-api-secret>
CLOUDINARY_UPLOAD_FOLDER=taskcover-staging/insights
```

Cloudflare staging:

```bash
wrangler secret put CLOUDINARY_API_SECRET --env staging
```

Set cloud name, API key, and upload folder as Cloudflare vars. Run:

```bash
npm run integrations:test-cloudinary
```

### Rate Limiting / Durable Objects

Local defaults:

```bash
RATE_LIMIT_PROVIDER=memory
AUTH_RATE_LIMIT_PROVIDER=memory
```

Staging/production should use Cloudflare bindings declared in `wrangler.jsonc`:

```bash
RATE_LIMIT_PROVIDER=cloudflare
AUTH_RATE_LIMIT_PROVIDER=cloudflare
RATE_LIMIT_NAMESPACE=taskcover-leads-staging
AUTH_RATE_LIMIT_NAMESPACE=taskcover-admin-auth-staging
```

Replace placeholder Cloudflare Rate Limiting namespace IDs before staging. Run:

```bash
npm run rate-limits:verify
npm run production:check
```

### Cron / Publishing / Outbox

`.env.local` and `.dev.vars`:

```bash
PUBLISH_CRON_SECRET=<paste-long-random-cron-secret>
PUBLISH_SCHEDULER_PROVIDER=disabled
```

Cloudflare staging:

```bash
wrangler secret put PUBLISH_CRON_SECRET --env staging
```

Set `PUBLISH_SCHEDULER_PROVIDER=cloudflare-cron` only after staging validation. Run:

```bash
npm run scheduler:verify
```

### GTM / GA4 / Google Ads / Consent

Leave disabled until legal/consent QA is complete:

```bash
NEXT_PUBLIC_GTM_ID=<paste-gtm-id>
NEXT_PUBLIC_GTM_ENABLED=false
NEXT_PUBLIC_ANALYTICS_DEBUG=false
NEXT_PUBLIC_GOOGLE_ADS_ID=<paste-google-ads-id>
NEXT_PUBLIC_GOOGLE_ADS_FREE_AUDIT_LABEL=<paste-free-audit-conversion-label>
NEXT_PUBLIC_GOOGLE_ADS_STRATEGY_CALL_LABEL=<paste-strategy-call-conversion-label>
NEXT_PUBLIC_GOOGLE_ADS_CONTACT_LABEL=<paste-contact-conversion-label>
NEXT_PUBLIC_MICROSOFT_UET_ID=<paste-microsoft-uet-id>
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=<paste-linkedin-partner-id>
```

Consent mode defaults deny non-essential storage until the visitor opts in.

## Windows / OpenNext Preview Recovery

OpenNext can leave `.open-next` locked on Windows. If `npm run preview:cloudflare` fails with `EPERM` on `.open-next`, stop stale preview processes and retry.

Show the process listening on port 8787:

```powershell
netstat -ano | Select-String ':8787'
```

Stop the port 8787 listener:

```powershell
$listenerIds = netstat -ano | Select-String '127\.0\.0\.1:8787\s+0\.0\.0\.0:0\s+LISTENING' | ForEach-Object { ($_ -split '\s+')[-1] } | Sort-Object -Unique
foreach ($listenerId in $listenerIds) {
  if ($listenerId -match '^\d+$') { Stop-Process -Id ([int]$listenerId) -Force }
}
```

Stop repo-bound Wrangler/OpenNext/Node processes:

```powershell
$workspace = (Resolve-Path -LiteralPath 'C:\Users\Gamelap\taskcover').Path
Get-CimInstance Win32_Process |
  Where-Object {
    $_.CommandLine -and
    ($_.CommandLine -like "*$workspace*" -or $_.CommandLine -like '*opennextjs-cloudflare*' -or $_.CommandLine -like '*wrangler*')
  } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
```

Then run:

```bash
npm run preview:cloudflare -- --port 8787 --log-level debug
```

WSL is optional. Use it only if Windows OpenNext preview remains unstable after clearing stale processes.
