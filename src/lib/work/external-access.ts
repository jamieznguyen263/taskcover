export type ExternalMembershipKind = "freelancer" | "partner_manager" | "partner_member" | "read_only_guest";

export type ExternalAccessState = "active" | "not-started" | "expired" | "revoked";

export const EXTERNAL_KIND_LABEL: Record<ExternalMembershipKind, string> = {
  freelancer: "Freelancer",
  partner_manager: "Partner manager",
  partner_member: "Partner member",
  read_only_guest: "Read-only guest",
};

/**
 * Pure access-window evaluation for external memberships, checked on every /flow request.
 * Order matters: an explicit revoke beats everything; then the window bounds. A null
 * expiry means "no automatic expiry" (manual revoke only).
 */
export function evaluateExternalAccess(input: {
  now: Date;
  accessStartAt: Date;
  accessExpiryAt: Date | null;
  revokedAt: Date | null;
}): ExternalAccessState {
  if (input.revokedAt) return "revoked";
  if (input.now < input.accessStartAt) return "not-started";
  if (input.accessExpiryAt && input.now >= input.accessExpiryAt) return "expired";
  return "active";
}
