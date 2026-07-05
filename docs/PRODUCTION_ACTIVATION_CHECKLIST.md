# Production Activation Checklist

Do not run these steps automatically.

## 1. Cloudflare

1. Activate Workers Paid.
2. Connect GitHub/project.
3. Configure `taskcover.com`.
4. Add permanent `www.taskcover.com` to `taskcover.com` redirect.
5. Create Hyperdrive.
6. Create Rate Limiting namespaces.
7. Deploy Durable Object migration.
8. Configure Cron Trigger.
9. Add secrets with `wrangler secret put` or dashboard secrets.
10. Deploy preview.
11. Verify preview.
12. Deploy production only after approval.

## 2. Neon

1. Create project, branch, database, and role.
2. Obtain direct migration URL.
3. Configure Hyperdrive connection.
4. Test connection.
5. Run migrations.
6. Verify tables.
7. Document backup/restore expectations.

## 3. Admin

1. Create first Admin with `npm run admin:create`.
2. Login.
3. Change/test password.
4. Verify session.
5. Test invite acceptance.
6. Verify Admin and Editor permissions.

## 4. Insights

1. Import six article groups.
2. Verify eighteen localizations.
3. Verify published snapshots.
4. Test local provider.
5. Test database provider.
6. Test draft edit, approval, publish now, and schedule.
7. Switch `INSIGHTS_PROVIDER=database`.

## 5. Resend

1. Create account.
2. Add `taskcover.com`.
3. Copy exact DNS records.
4. Verify domain.
5. Configure API key, From, Reply-to.
6. Test internal and visitor EN/FR/ES emails.

## 6. HubSpot

1. Create Free CRM account.
2. Create Private App.
3. Grant minimum scopes.
4. Identify pipeline and New Lead stage IDs.
5. Create optional Taskcover custom properties.
6. Test contact, company, deal, and retry idempotency.

## 7. Cal.com

1. Create account.
2. Connect Google Calendar.
3. Create Taskcover Strategy Call event.
4. Set availability.
5. Configure `CALCOM_BOOKING_URL`.
6. Test EN/FR/ES CTA.

## 8. Turnstile

1. Create widget.
2. Set allowed hostnames.
3. Configure site key and secret.
4. Test valid, invalid, and expired tokens.
5. Verify server-side validation.

## 9. Cloudinary

1. Create account.
2. Configure cloud name and credentials.
3. Configure folder.
4. Test signed upload, metadata, deletion protection, and delivery URL.

## 10. Lead End-to-End

Test SEO Audit EN/FR/ES, Strategy Call, Contact, Media, Private Reference, duplicate submit, provider retry, HubSpot outage, Resend outage, database outage, Turnstile failure, rate limit, thank-you redirect, and Cal.com CTA.

## 11. Production Release

Freeze changes, record commit, backup database, deploy, verify canonical host, crawl priority routes, verify forms, Admin, scheduler, sitemap, robots, logs, and rollback.
