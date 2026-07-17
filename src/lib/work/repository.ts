import "server-only";

import { and, asc, eq, isNull } from "drizzle-orm";
import { getDb, type AdminDb } from "@/lib/db/client";
import { adminUsers, organizationMemberships, teamMemberships, teams } from "@/lib/db/schema";
import type { WorkAccessLevel } from "./capabilities";
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
    return this.db
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
}
