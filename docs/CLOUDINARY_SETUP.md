# Cloudinary Setup

Production uploads must be signed.

Required values:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_UPLOAD_FOLDER`

Allowed MIME types:

- `image/webp`
- `image/avif`
- `image/png`
- `image/jpeg`

Maximum size: 5 MB.

Verification:

```bash
npm run integrations:test-cloudinary
```

The script verifies signing logic and restrictions without uploading. Perform any live upload only from the Admin UI with an explicit staging or production approval.

## Task 17 Status

Offline Cloudinary signing and upload restriction checks passed. Live Cloudinary uploads are not activated in this workspace. Required missing values:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_UPLOAD_FOLDER`

Use `taskcover-staging/insights` for staging.
