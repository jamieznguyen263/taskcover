# Cloudinary Setup

Required variables:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_UPLOAD_FOLDER`

Production uploads are signed server-side. The API secret is never returned to the browser.

Upload validation:

- Allowed MIME: WebP, AVIF, PNG, JPEG.
- Max size: 5 MB.
- Folder is restricted through the signature parameters.
- Media metadata and usage tracking remain in the Admin database.
