import "server-only";

import { getAdminSession } from "@/lib/admin/session";
import { CAPABILITIES_BY_ACCESS_LEVEL, type WorkAccessLevel, type WorkCapability, WorkAuthorizationError } from "./capabilities";
import { WorkRepository } from "./repository";

/**
 * Taskcover Flow reuses the existing Admin session (one identity, one login system) and
 * enriches it with the organization membership introduced in FLOW-002. Membership is
 * provisioned lazily from the legacy CMS role for users created after migration 0005, so
 * the backfill is self-healing. See planning/FLOW_DECISIONS.md.
 */
export type WorkSession = {
  userId: string;
  sessionId: string;
  email: string;
  displayName: string;
  legacyRole: "admin" | "editor";
  accessLevel: WorkAccessLevel;
};

export type WorkSessionResolution =
  | { kind: "none" }
  | { kind: "disabled" }
  | { kind: "active"; session: WorkSession };

export async function resolveWorkSession(): Promise<WorkSessionResolution> {
  const adminSession = await getAdminSession();
  if (!adminSession) return { kind: "none" };

  const membership = await new WorkRepository().ensureMembership({
    userId: adminSession.userId,
    legacyRole: adminSession.role,
  });
  if (membership.status !== "active") return { kind: "disabled" };

  return {
    kind: "active",
    session: {
      userId: adminSession.userId,
      sessionId: adminSession.sessionId,
      email: adminSession.email,
      displayName: adminSession.displayName,
      legacyRole: adminSession.role,
      accessLevel: membership.accessLevel,
    },
  };
}

/** Deny-by-default guard for server actions and pages below the /flow layout. */
export async function requireWorkSession(capability?: WorkCapability): Promise<WorkSession> {
  const resolution = await resolveWorkSession();
  if (resolution.kind !== "active") throw new WorkAuthorizationError(capability ?? "flow:access");
  if (capability && !CAPABILITIES_BY_ACCESS_LEVEL[resolution.session.accessLevel].includes(capability)) {
    throw new WorkAuthorizationError(capability);
  }
  return resolution.session;
}
