import type { WorkAccessLevel } from "./capabilities";

/**
 * Legacy CMS role → Flow access level mapping used by the migration 0005 backfill and by
 * lazy provisioning for users created after the migration (e.g. via CMS invites). Existing
 * admins run the company, so they land on `admin`; editors get everyday `member` access.
 * Nobody is auto-promoted to `owner` — that elevation is an explicit human decision.
 */
export function mapLegacyRoleToAccessLevel(legacyRole: "admin" | "editor"): WorkAccessLevel {
  return legacyRole === "admin" ? "admin" : "member";
}
