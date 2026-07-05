# Admin Auth Security

Taskcover Admin uses email/password authentication with no public registration.

- Passwords are hashed with Argon2id.
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
