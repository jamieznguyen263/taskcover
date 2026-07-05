# Staging Deployment

Staging must not use the production canonical host and should be protected by Cloudflare Access or another password gate where practical. Add `noindex` behavior at the host or Worker layer before sharing the URL.

1. Create a staging Neon branch/database.
2. Create a staging Hyperdrive binding and replace the staging placeholder in `wrangler.jsonc`.
3. Set staging secrets with Cloudflare Dashboard or `wrangler secret put --env staging`.
4. Keep HubSpot in offline/test behavior unless `--create-test-contact` is explicitly used.
5. Restrict Resend live tests to `business@taskcover.com`.
6. Use a Turnstile widget that includes the staging hostname.
7. Use `CLOUDINARY_UPLOAD_FOLDER=taskcover-staging/insights`.

Commands:

```bash
npm run production:check
npm run production:predeploy
wrangler deploy --env staging
npm run smoke:deployment -- --base-url=https://staging.taskcover.com
```

Do not deploy staging unless credentials are already configured locally and the user explicitly approves the deploy.
