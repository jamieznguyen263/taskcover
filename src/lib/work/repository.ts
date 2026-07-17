import "server-only";

import { and, asc, desc, eq, gt, isNotNull, isNull } from "drizzle-orm";
import { getDb, type AdminDb } from "@/lib/db/client";
import {
  adminInvites,
  adminUsers,
  externalMemberships,
  externalOrganizations,
  flowExternalInvites,
  organizationMemberships,
  teamMemberships,
  teams,
} from "@/lib/db/schema";
import { hashToken, normalizeEmail } from "@/lib/admin/security";
import type { WorkAccessLevel } from "./capabilities";
import type { ExternalMembershipKind } from "./external-access";
import { mapLegacyRoleToAccessLevel } from "./membership";

export type WorkMembership = {
  accessLevel: WorkAccessLevel;
  status: "active" | "disabled";
};

export type WorkMemberSummary = {
  userId: string;
  displayName: string;
  email: string;
  legacyRole: "admin" | "editor";
  accessLevel: WorkAccessLevel;
  status: "active" | "disabled";
};

export type ExternalMembershipRecord = {
  id: string;
  userId: string;
  kind: ExternalMembershipKind;
  organizationName: string | null;
  accessStartAt: Date;
  accessExpiryAt: Date | null;
  canDownload: boolean;
  canUpload: boolean;
  revokedAt: Date | null;
};

export type ExternalCollaboratorSummary = ExternalMembershipRecord & {
  displayName: string;
  email: string;
};

export type WorkTeamSummary = {
  id: string;
  name: string;
  description: string;
  members: { userId: string; displayName: string }[];
};

export class WorkRepository {
  private db: AdminDb;

  constructor(db?: AdminDb) {
    this.db = db ?? getDb();
  }

  /**
   * Self-healing backfill: migration 0005 provisions memberships for users that existed at
   * migration time; users created afterwards (e.g. via CMS invites) get a membership derived
   * from their legacy role on first /flow access. Idempotent under concurrency via the
   * unique user index + onConflictDoNothing.
   */
  async ensureMembership(input: { userId: string; legacyRole: "admin" | "editor" }): Promise<WorkMembership> {
    const existing = await this.getMembership(input.userId);
    if (existing) return existing;

    await this.db
      .insert(organizationMemberships)
      .values({ userId: input.userId, accessLevel: mapLegacyRoleToAccessLevel(input.legacyRole) })
      .onConflictDoNothing({ target: organizationMemberships.userId });

    const created = await this.getMembership(input.userId);
    if (!created) throw new Error("Failed to provision organization membership.");
    return created;
  }

  async getMembership(userId: string): Promise<WorkMembership | null> {
    const rows = await this.db
      .select({
        accessLevel: organizationMemberships.accessLevel,
        status: organizationMemberships.status,
      })
      .from(organizationMemberships)
      .where(eq(organizationMemberships.userId, userId))
      .limit(1);
    return rows[0] ?? null;
  }

  async listMembers(): Promise<WorkMemberSummary[]> {
    const rows = await this.db
      .select({
        userId: adminUsers.id,
        displayName: adminUsers.displayName,
        email: adminUsers.email,
        legacyRole: adminUsers.role,
        accessLevel: organizationMemberships.accessLevel,
        status: organizationMemberships.status,
      })
      .from(organizationMemberships)
      .innerJoin(adminUsers, eq(organizationMemberships.userId, adminUsers.id))
      .orderBy(asc(adminUsers.displayName));
    // Externals never receive organization_memberships rows; the filter narrows the type
    // and defends the invariant.
    return rows.filter((row): row is (typeof row) & { legacyRole: "admin" | "editor" } => row.legacyRole !== "external");
  }

  async listTeams(): Promise<WorkTeamSummary[]> {
    const teamRows = await this.db
      .select({ id: teams.id, name: teams.name, description: teams.description })
      .from(teams)
      .where(isNull(teams.archivedAt))
      .orderBy(asc(teams.name));
    if (teamRows.length === 0) return [];

    const memberRows = await this.db
      .select({
        teamId: teamMemberships.teamId,
        userId: teamMemberships.userId,
        displayName: adminUsers.displayName,
      })
      .from(teamMemberships)
      .innerJoin(adminUsers, eq(teamMemberships.userId, adminUsers.id))
      .orderBy(asc(adminUsers.displayName));

    const membersByTeam = new Map<string, { userId: string; displayName: string }[]>();
    for (const row of memberRows) {
      const list = membersByTeam.get(row.teamId) ?? [];
      list.push({ userId: row.userId, displayName: row.displayName });
      membersByTeam.set(row.teamId, list);
    }
    return teamRows.map((team) => ({ ...team, members: membersByTeam.get(team.id) ?? [] }));
  }

  async createTeam(input: { name: string; description: string; createdBy: string }) {
    const [team] = await this.db
      .insert(teams)
      .values({ name: input.name, description: input.description, createdBy: input.createdBy })
      .returning({ id: teams.id });
    return team;
  }

  async addTeamMember(input: { teamId: string; userId: string }) {
    await this.db
      .insert(teamMemberships)
      .values({ teamId: input.teamId, userId: input.userId })
      .onConflictDoNothing();
  }

  async removeTeamMember(input: { teamId: string; userId: string }) {
    await this.db
      .delete(teamMemberships)
      .where(and(eq(teamMemberships.teamId, input.teamId), eq(teamMemberships.userId, input.userId)));
  }

  // --- FLOW-003: external collaborators -------------------------------------------------

  async getExternalMembership(userId: string): Promise<ExternalMembershipRecord | null> {
    const rows = await this.db
      .select({
        id: externalMemberships.id,
        userId: externalMemberships.userId,
        kind: externalMemberships.kind,
        organizationName: externalOrganizations.name,
        accessStartAt: externalMemberships.accessStartAt,
        accessExpiryAt: externalMemberships.accessExpiryAt,
        canDownload: externalMemberships.canDownload,
        canUpload: externalMemberships.canUpload,
        revokedAt: externalMemberships.revokedAt,
      })
      .from(externalMemberships)
      .leftJoin(externalOrganizations, eq(externalMemberships.externalOrganizationId, externalOrganizations.id))
      .where(eq(externalMemberships.userId, userId))
      .limit(1);
    return rows[0] ?? null;
  }

  /**
   * Lazy provisioning mirror of ensureMembership, for externals: the invite metadata row
   * (flow_external_invites) written when the invitation was created becomes the membership
   * on the collaborator's first /flow visit after accepting through the standard
   * accept-invite flow. Returns null when no accepted external invite exists — that user
   * has no Flow access at all (deny-by-default).
   */
  async ensureExternalMembership(input: { userId: string; email: string }): Promise<ExternalMembershipRecord | null> {
    const existing = await this.getExternalMembership(input.userId);
    if (existing) return existing;

    const inviteRows = await this.db
      .select({
        kind: flowExternalInvites.kind,
        externalOrganizationId: flowExternalInvites.externalOrganizationId,
        accessStartAt: flowExternalInvites.accessStartAt,
        accessExpiryAt: flowExternalInvites.accessExpiryAt,
        canDownload: flowExternalInvites.canDownload,
        canUpload: flowExternalInvites.canUpload,
      })
      .from(flowExternalInvites)
      .innerJoin(adminInvites, eq(flowExternalInvites.inviteId, adminInvites.id))
      .where(
        and(
          eq(adminInvites.normalizedEmail, normalizeEmail(input.email)),
          isNotNull(adminInvites.acceptedAt),
          isNull(adminInvites.revokedAt)
        )
      )
      .orderBy(desc(adminInvites.acceptedAt))
      .limit(1);
    const invite = inviteRows[0];
    if (!invite) return null;

    await this.db
      .insert(externalMemberships)
      .values({
        userId: input.userId,
        externalOrganizationId: invite.externalOrganizationId,
        kind: invite.kind,
        accessStartAt: invite.accessStartAt,
        accessExpiryAt: invite.accessExpiryAt,
        canDownload: invite.canDownload,
        canUpload: invite.canUpload,
      })
      .onConflictDoNothing({ target: externalMemberships.userId });

    return this.getExternalMembership(input.userId);
  }

  async listExternalCollaborators(): Promise<ExternalCollaboratorSummary[]> {
    return this.db
      .select({
        id: externalMemberships.id,
        userId: externalMemberships.userId,
        kind: externalMemberships.kind,
        organizationName: externalOrganizations.name,
        accessStartAt: externalMemberships.accessStartAt,
        accessExpiryAt: externalMemberships.accessExpiryAt,
        canDownload: externalMemberships.canDownload,
        canUpload: externalMemberships.canUpload,
        revokedAt: externalMemberships.revokedAt,
        displayName: adminUsers.displayName,
        email: adminUsers.email,
      })
      .from(externalMemberships)
      .innerJoin(adminUsers, eq(externalMemberships.userId, adminUsers.id))
      .leftJoin(externalOrganizations, eq(externalMemberships.externalOrganizationId, externalOrganizations.id))
      .orderBy(asc(adminUsers.displayName));
  }

  async listPendingExternalInvites() {
    return this.db
      .select({
        inviteId: adminInvites.id,
        email: adminInvites.email,
        kind: flowExternalInvites.kind,
        organizationName: externalOrganizations.name,
        expiresAt: adminInvites.expiresAt,
        createdAt: adminInvites.createdAt,
      })
      .from(flowExternalInvites)
      .innerJoin(adminInvites, eq(flowExternalInvites.inviteId, adminInvites.id))
      .leftJoin(externalOrganizations, eq(flowExternalInvites.externalOrganizationId, externalOrganizations.id))
      .where(and(isNull(adminInvites.acceptedAt), isNull(adminInvites.revokedAt), gt(adminInvites.expiresAt, new Date())))
      .orderBy(desc(adminInvites.createdAt));
  }

  /**
   * Creates the standard admin_invites row (role='external', so the existing accept-invite
   * page works unchanged) plus the Flow metadata row, atomically. Organization is
   * find-or-created by name when provided.
   */
  async createExternalInvite(input: {
    email: string;
    kind: ExternalMembershipKind;
    organizationName: string | null;
    organizationKind: "freelancer" | "partner";
    accessExpiryAt: Date | null;
    canDownload: boolean;
    canUpload: boolean;
    token: string;
    expiresAt: Date;
    invitedBy: string;
  }) {
    return this.db.transaction(async (tx) => {
      let organizationId: string | null = null;
      if (input.organizationName) {
        const [organization] = await tx
          .insert(externalOrganizations)
          .values({ name: input.organizationName, kind: input.organizationKind })
          .onConflictDoUpdate({ target: externalOrganizations.name, set: { updatedAt: new Date() } })
          .returning({ id: externalOrganizations.id });
        organizationId = organization.id;
      }

      const [invite] = await tx
        .insert(adminInvites)
        .values({
          email: input.email,
          normalizedEmail: normalizeEmail(input.email),
          role: "external",
          tokenHash: hashToken(input.token),
          expiresAt: input.expiresAt,
          invitedBy: input.invitedBy,
        })
        .returning({ id: adminInvites.id });

      await tx.insert(flowExternalInvites).values({
        inviteId: invite.id,
        externalOrganizationId: organizationId,
        kind: input.kind,
        accessExpiryAt: input.accessExpiryAt,
        canDownload: input.canDownload,
        canUpload: input.canUpload,
        createdBy: input.invitedBy,
      });

      return invite;
    });
  }

  async revokeExternalMembership(input: { membershipId: string; revokedBy: string }) {
    await this.db
      .update(externalMemberships)
      .set({ revokedAt: new Date(), revokedBy: input.revokedBy, updatedAt: new Date() })
      .where(and(eq(externalMemberships.id, input.membershipId), isNull(externalMemberships.revokedAt)));
  }
}
