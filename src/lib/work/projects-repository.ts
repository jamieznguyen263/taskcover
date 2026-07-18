import "server-only";

import { and, asc, desc, eq, isNull } from "drizzle-orm";
import { getDb, type AdminDb } from "@/lib/db/client";
import { adminUsers, clients, projectMemberships, projects } from "@/lib/db/schema";

export type ProjectSummary = {
  id: string;
  name: string;
  kind: "client" | "internal";
  clientName: string | null;
  createdAt: Date;
};

export type ProjectDetail = {
  id: string;
  name: string;
  kind: "client" | "internal";
  description: string;
  clientId: string | null;
  clientName: string | null;
  members: { userId: string; displayName: string }[];
};

export class ProjectsRepository {
  private db: AdminDb;

  constructor(db?: AdminDb) {
    this.db = db ?? getDb();
  }

  async listProjects(): Promise<ProjectSummary[]> {
    return this.db
      .select({
        id: projects.id,
        name: projects.name,
        kind: projects.kind,
        clientName: clients.name,
        createdAt: projects.createdAt,
      })
      .from(projects)
      .leftJoin(clients, eq(projects.clientId, clients.id))
      .where(isNull(projects.archivedAt))
      .orderBy(desc(projects.createdAt));
  }

  async getProject(projectId: string): Promise<ProjectDetail | null> {
    const projectRows = await this.db
      .select({
        id: projects.id,
        name: projects.name,
        kind: projects.kind,
        description: projects.description,
        clientId: projects.clientId,
        clientName: clients.name,
      })
      .from(projects)
      .leftJoin(clients, eq(projects.clientId, clients.id))
      .where(and(eq(projects.id, projectId), isNull(projects.archivedAt)))
      .limit(1);
    const project = projectRows[0];
    if (!project) return null;

    const members = await this.db
      .select({ userId: projectMemberships.userId, displayName: adminUsers.displayName })
      .from(projectMemberships)
      .innerJoin(adminUsers, eq(projectMemberships.userId, adminUsers.id))
      .where(eq(projectMemberships.projectId, projectId))
      .orderBy(asc(adminUsers.displayName));

    return { ...project, members };
  }

  /**
   * Transactional creation (blueprint FLOW-005): the project and its creator's membership
   * land together or not at all, so a project is never ownerless.
   */
  async createProject(input: {
    name: string;
    description: string;
    kind: "client" | "internal";
    clientId: string | null;
    createdBy: string;
  }) {
    return this.db.transaction(async (tx) => {
      const [project] = await tx
        .insert(projects)
        .values({
          name: input.name,
          description: input.description,
          kind: input.kind,
          clientId: input.kind === "client" ? input.clientId : null,
          createdBy: input.createdBy,
        })
        .returning({ id: projects.id });
      await tx.insert(projectMemberships).values({ projectId: project.id, userId: input.createdBy });
      return project;
    });
  }

  async addProjectMember(input: { projectId: string; userId: string }) {
    await this.db.insert(projectMemberships).values(input).onConflictDoNothing();
  }

  async removeProjectMember(input: { projectId: string; userId: string }) {
    await this.db
      .delete(projectMemberships)
      .where(and(eq(projectMemberships.projectId, input.projectId), eq(projectMemberships.userId, input.userId)));
  }
}
