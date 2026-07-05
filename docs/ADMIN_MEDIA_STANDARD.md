# Admin Media Standard

Media is accessed through `MediaProvider`, not directly through Cloudinary UI code.

Production Cloudinary rules:

- Signed upload only
- Signature generated server-side
- API secret never exposed to clients
- Upload folder restricted by `CLOUDINARY_UPLOAD_FOLDER`
- Allowed formats: WebP, AVIF, PNG, JPEG
- Max upload size: 5 MB
- SVG uploads are rejected

If Cloudinary is not configured, production upload must be unavailable. Development can use the local/mock adapter, clearly labeled as non-production.

Assets are tracked in `media_assets`; usages are tracked in `media_usages`. Used assets cannot be permanently deleted until usages are resolved.
