/**
 * Admin session cookie options, kept in a plain module (no "server-only") so it
 * is unit-testable.
 *
 * Path MUST be "/" (not "/admin"): the editor's client calls hit API routes
 * under /api/admin/*, and a "/admin"-scoped cookie is never sent there, so
 * autosave, workflow transitions, and media uploads would all return 401.
 * httpOnly + secure + sameSite=lax keep the cookie safe despite the broad path.
 */
export function adminSessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires: expiresAt,
  };
}
