import "server-only";

import { and, asc, count, eq, isNull } from "drizzle-orm";
import { getDb, type AdminDb } from "@/lib/db/client";
import { adminUsers, clientContacts, clients, projects } from "@/lib/db/schema";
import type { ClientHealthState } from "./client-health";

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

export type ClientDetail = {
  id: string;
  name: string;
  healthState: ClientHealthState;
  healthReason: string;
  accountManagerId: string | null;
  accountManagerName: string | null;
  contacts: ClientContact[];
  projects: { id: string; name: string; kind: "client" | "internal"; archivedAt: Date | null }[];
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

    return { ...client, contacts, projects: clientProjects };
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
