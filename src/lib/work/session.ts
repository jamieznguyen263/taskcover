import "server-only";

import { getAdminSession } from "@/lib/admin/session";
import { CAPABILITIES_BY_ACCESS_LEVEL, type WorkAccessLevel, type WorkCapability, WorkAuthorizationError } from "./capabilities";
import { evaluateExternalAccess, type ExternalAccessState, type ExternalMembershipKind } from "./external-access";
import { WorkRepository } from "./repository";

/**
 * Taskcover Flow reuses the existing Admin session (one identity, one login system).
 * Internal users (CMS admin/editor) are enriched with their organization membership
 * (FLOW-002); external collaborators (role 'external', FLOW-003) resolve through
 * external_memberships instead and never receive internal capabilities. Both membership
 * kinds are provisioned lazily and idempotently, so backfills are self-healing.
 */
export type WorkSession = {
  userId: string;
  sessionId: string;
  email: string;
  displayName: string;
  legacyRole: "admin" | "editor";
  accessLevel: WorkAccessLevel;
};

export type ExternalWorkSession = {
  userId: string;
  sessionId: string;
  email: string;
  displayName: string;
  kind: ExternalMembershipKind;
  canDownload: boolean;
  canUpload: boolean;
  accessExpiryAt: Date | null;
};

export type WorkSessionResolution =
  | { kind: "none" }
  | { kind: "disabled" }
  | { kind: "external-blocked"; state: Exclude<ExternalAccessState, "active"> | "no-membership" }
  | { kind: "external"; session: ExternalWorkSession }
  | { kind: "active"; session: WorkSession };

export async function resolveWorkSession(): Promise<WorkSessionResolution> {
  const adminSession = await getAdminSession();
  if (!adminSession) return { kind: "none" };
  const repo = new WorkRepository();

  if (adminSession.role === "external") {
    const membership = await repo.ensureExternalMembership({
      userId: adminSession.userId,
      email: adminSession.email,
    });
    if (!membership) return { kind: "external-blocked", state: "no-membership" };
    const state = evaluateExternalAccess({
      now: new Date(),
      accessStartAt: membership.accessStartAt,
      accessExpiryAt: membership.accessExpiryAt,
      revokedAt: membership.revokedAt,
    });
    if (state !== "active") return { kind: "external-blocked", state };
    return {
      kind: "external",
      session: {
        userId: adminSession.userId,
        sessionId: adminSession.sessionId,
        email: adminSession.email,
        displayName: adminSession.displayName,
        kind: membership.kind,
        canDownload: membership.canDownload,
        canUpload: membership.canUpload,
        accessExpiryAt: membership.accessExpiryAt,
      },
    };
  }

  const membership = await repo.ensureMembership({
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

/**
 * Deny-by-default guard for internal pages and server actions below /flow. External
 * sessions never pass — internal capabilities simply do not exist for them.
 */
export async function requireWorkSession(capability?: WorkCapability): Promise<WorkSession> {
  const resolution = await resolveWorkSession();
  if (resolution.kind !== "active") throw new WorkAuthorizationError(capability ?? "flow:access");
  if (capability && !CAPABILITIES_BY_ACCESS_LEVEL[resolution.session.accessLevel].includes(capability)) {
    throw new WorkAuthorizationError(capability);
  }
  return resolution.session;
}
