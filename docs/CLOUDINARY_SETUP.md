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
