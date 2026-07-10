# Admin Auth Security

Taskcover Admin uses email/password authentication with no public registration.

- Passwords are hashed with PBKDF2-HMAC-SHA-256 (100,000 iterations, 128-bit random salt, 256-bit derived key) via the standard Web Crypto API (`src/lib/admin/crypto.ts`), used identically in Node.js and Cloudflare Workers. 100,000 is Cloudflare Workers' hard platform ceiling for `crypto.subtle.deriveBits` PBKDF2 (it rejects anything higher at runtime), not an arbitrary choice — it's below OWASP's 2023 minimum of 600,000 for this reason, and matches OWASP's own pre-2023 PBKDF2-HMAC-SHA256 minimum. Argon2id (hash-wasm) was used originally but never actually worked in production: Cloudflare Workers blocks the dynamic WebAssembly compilation it depends on, so every login silently failed verification while passing in every Node-only test. The hash format is versioned and self-describing (`$pbkdf2-sha256$v=1$i=<iterations>$<salt>$<key>`); unsupported or malformed hashes — including old Argon2id hashes — are never treated as a match and always require a password reset.
- Session cookies are opaque, httpOnly, `SameSite=Lax`, secure in production, and scoped to `/admin`.
- Only token hashes are stored in `admin_sessions`.
- Login failures use generic user-facing errors and structured audit categories.
- Disabled users cannot authenticate.
- Editors cannot approve, publish, schedule, archive, restore published revisions, manage users, view audit logs, or trigger the scheduler.
- Server actions and route handlers must call permission helpers. Hidden buttons are not authorization.

Required setup:

1. Set `DATABASE_URL`.
2. Run `npm run db:migrate`.
3. Run `npm run admin:create -- admin@example.com`.
4. Sign in at `/admin/login`.

Do not commit credentials, password hashes, session tokens, invite tokens, scheduler secrets, or Cloudinary API secrets.

Admin settings, user management, audit logs, approval, publishing, scheduling, archive, restore, and media management are checked server-side. User invitations store only a hash, expire, can be revoked, and are single-use; the manually displayed invitation URL is returned once to the Admin UI. Role changes and disabling an account revoke active sessions.
