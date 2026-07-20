import "server-only";

import { and, asc, count, desc, eq, inArray, isNull, ne, or } from "drizzle-orm";
import { getDb, type AdminDb } from "@/lib/db/client";
import {
  activityEvents,
  adminUsers,
  clientContacts,
  clients,
  documents,
  projects,
  workItems,
} from "@/lib/db/schema";
import type { ClientHealthState } from "./client-health";
import type { DocumentKind } from "./document-repository";
import type { WorkStatus, WorkType } from "./work-domain";

export type ClientSummary = {
  id: string;
  name: string;
  healthState: ClientHealthState;
  healthReason: string;
  accountManagerName: string | null;
  projectCount: number;
};

export type ClientContact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleTitle: string;
};

export type ClientWorkEntry = {
  id: string;
  title: string;
  type: WorkType;
  status: WorkStatus;
  projectId: string;
  projectName: string;
  ownerName: string | null;
  dueAt: Date | null;
};

export type ClientDocumentEntry = {
  id: string;
  title: string;
  kind: DocumentKind;
  updatedAt: Date;
};

export type ClientActivityEntry = {
  id: string;
  summary: string;
  actorName: string | null;
  createdAt: Date;
};

export type ClientDetail = {
  id: string;
  name: string;
  healthState: ClientHealthState;
  healthReason: string;
  accountManagerId: string | null;
  accountManagerName: string | null;
  contacts: ClientContact[];
  projects: { id: string; name: string; kind: "client" | "internal"; archivedAt: Date | null }[];
  /** Open work across every project owned by this client, most urgent first. */
  openWork: ClientWorkEntry[];
  doneWorkCount: number;
  documents: ClientDocumentEntry[];
  activity: ClientActivityEntry[];
};

export class ClientsRepository {
  private db: AdminDb;

  constructor(db?: AdminDb) {
    this.db = db ?? getDb();
  }

  async listClients(): Promise<ClientSummary[]> {
    return this.db
      .select({
        id: clients.id,
        name: clients.name,
        healthState: clients.healthState,
        healthReason: clients.healthReason,
        accountManagerName: adminUsers.displayName,
        projectCount: count(projects.id),
      })
      .from(clients)
      .leftJoin(adminUsers, eq(clients.accountManagerId, adminUsers.id))
      .leftJoin(projects, and(eq(projects.clientId, clients.id), isNull(projects.archivedAt)))
      .where(isNull(clients.archivedAt))
      .groupBy(clients.id, adminUsers.displayName)
      .orderBy(asc(clients.name));
  }

  async getClient(clientId: string): Promise<ClientDetail | null> {
    const clientRows = await this.db
      .select({
        id: clients.id,
        name: clients.name,
        healthState: clients.healthState,
        healthReason: clients.healthReason,
        accountManagerId: clients.accountManagerId,
        accountManagerName: adminUsers.displayName,
      })
      .from(clients)
      .leftJoin(adminUsers, eq(clients.accountManagerId, adminUsers.id))
      .where(and(eq(clients.id, clientId), isNull(clients.archivedAt)))
      .limit(1);
    const client = clientRows[0];
    if (!client) return null;

    const [contacts, clientProjects] = await Promise.all([
      this.db
        .select({
          id: clientContacts.id,
          name: clientContacts.name,
          email: clientContacts.email,
          phone: clientContacts.phone,
          roleTitle: clientContacts.roleTitle,
        })
        .from(clientContacts)
        .where(eq(clientContacts.clientId, clientId))
        .orderBy(asc(clientContacts.name)),
      this.db
        .select({ id: projects.id, name: projects.name, kind: projects.kind, archivedAt: projects.archivedAt })
        .from(projects)
        .where(eq(projects.clientId, clientId))
        .orderBy(asc(projects.name)),
    ]);

    const workspace = await this.getWorkspaceSlices(
      clientId,
      clientProjects.map((project) => project.id)
    );

    return { ...client, contacts, projects: clientProjects, ...workspace };
  }

  /**
   * Work, documents, and activity all hang off a client indirectly (through its projects),
   * which is why they are resolved here rather than by each caller: the Client Workspace is
   * the one place that answers "what is actually happening for this client?".
   *
   * Batched by project-id list so the page stays free of N+1 queries. A client with no
   * projects short-circuits — documents can still be attached to the client directly.
   */
  private async getWorkspaceSlices(
    clientId: string,
    projectIds: string[]
  ): Promise<Pick<ClientDetail, "openWork" | "doneWorkCount" | "documents" | "activity">> {
    const documentScope = projectIds.length
      ? or(eq(documents.clientId, clientId), inArray(documents.projectId, projectIds))
      : eq(documents.clientId, clientId);

    const [openWork, doneWork, clientDocuments, activity] = await Promise.all([
      projectIds.length
        ? this.db
            .select({
              id: workItems.id,
              title: workItems.title,
              type: workItems.type,
              status: workItems.status,
              projectId: workItems.projectId,
              projectName: projects.name,
              ownerName: adminUsers.displayName,
              dueAt: workItems.dueAt,
            })
            .from(workItems)
            .innerJoin(projects, eq(workItems.projectId, projects.id))
            .leftJoin(adminUsers, eq(workItems.ownerId, adminUsers.id))
            .where(and(inArray(workItems.projectId, projectIds), ne(workItems.status, "done")))
            // NULL due dates sort last in Postgres ASC, so dated work surfaces first.
            .orderBy(asc(workItems.dueAt), asc(workItems.createdAt))
            .limit(25)
        : Promise.resolve([]),
      projectIds.length
        ? this.db
            .select({ total: count(workItems.id) })
            .from(workItems)
            .where(and(inArray(workItems.projectId, projectIds), eq(workItems.status, "done")))
        : Promise.resolve([{ total: 0 }]),
      this.db
        .select({
          id: documents.id,
          title: documents.title,
          kind: documents.kind,
          updatedAt: documents.updatedAt,
        })
        .from(documents)
        .where(and(isNull(documents.archivedAt), documentScope))
        .orderBy(desc(documents.updatedAt))
        .limit(10),
      projectIds.length
        ? this.db
            .select({
              id: activityEvents.id,
              summary: activityEvents.summary,
              actorName: adminUsers.displayName,
              createdAt: activityEvents.createdAt,
            })
            .from(activityEvents)
            .leftJoin(adminUsers, eq(activityEvents.actorId, adminUsers.id))
            .where(inArray(activityEvents.projectId, projectIds))
            .orderBy(desc(activityEvents.createdAt))
            .limit(15)
        : Promise.resolve([]),
    ]);

    return {
      openWork,
      doneWorkCount: doneWork[0]?.total ?? 0,
      documents: clientDocuments,
      activity,
    };
  }

  async createClient(input: { name: string; accountManagerId: string | null; createdBy: string }) {
    const [client] = await this.db
      .insert(clients)
      .values({ name: input.name, accountManagerId: input.accountManagerId, createdBy: input.createdBy })
      .returning({ id: clients.id });
    return client;
  }

  async updateClientHealth(input: { clientId: string; state: ClientHealthState; reason: string }) {
    await this.db
      .update(clients)
      .set({ healthState: input.state, healthReason: input.reason, updatedAt: new Date() })
      .where(eq(clients.id, input.clientId));
  }

  async addContact(input: { clientId: string; name: string; email: string; phone: string; roleTitle: string }) {
    await this.db.insert(clientContacts).values(input);
  }

  async removeContact(input: { clientId: string; contactId: string }) {
    await this.db
      .delete(clientContacts)
      .where(and(eq(clientContacts.id, input.contactId), eq(clientContacts.clientId, input.clientId)));
  }
}
