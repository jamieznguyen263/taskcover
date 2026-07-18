import "server-only";

import { and, eq, ilike, isNull } from "drizzle-orm";
import { getDb, type AdminDb } from "@/lib/db/client";
import { clients, documents, projects, workItems } from "@/lib/db/schema";
import { hasCapability, type WorkAccessLevel } from "./capabilities";

export type SearchResult = {
  type: "client" | "project" | "work" | "document";
  id: string;
  title: string;
  subtitle: string;
  href: string;
};

/**
 * Permission-aware search (FLOW-011): every branch is gated by the caller's capabilities, so
 * a result set can never contain something the user isn't allowed to open. Deterministic
 * substring match (ILIKE) — no LLM, no ranking model. Internal-visibility documents are
 * excluded unless the caller holds internal-notes:view.
 */
export class SearchRepository {
  private db: AdminDb;

  constructor(db?: AdminDb) {
    this.db = db ?? getDb();
  }

  async search(input: { query: string; accessLevel: WorkAccessLevel; limitPerType?: number }): Promise<SearchResult[]> {
    const term = input.query.trim();
    if (term.length < 2) return [];
    const like = `%${term}%`;
    const limit = input.limitPerType ?? 5;
    const results: SearchResult[] = [];

    if (hasCapability(input.accessLevel, "clients:view")) {
      const rows = await this.db
        .select({ id: clients.id, name: clients.name })
        .from(clients)
        .where(and(ilike(clients.name, like), isNull(clients.archivedAt)))
        .limit(limit);
      for (const row of rows) {
        results.push({ type: "client", id: row.id, title: row.name, subtitle: "Client", href: `/flow/clients/${row.id}` });
      }
    }

    if (hasCapability(input.accessLevel, "projects:view")) {
      const rows = await this.db
        .select({ id: projects.id, name: projects.name })
        .from(projects)
        .where(and(ilike(projects.name, like), isNull(projects.archivedAt)))
        .limit(limit);
      for (const row of rows) {
        results.push({ type: "project", id: row.id, title: row.name, subtitle: "Project", href: `/flow/projects/${row.id}` });
      }
    }

    if (hasCapability(input.accessLevel, "work:view")) {
      const rows = await this.db
        .select({ id: workItems.id, title: workItems.title, projectId: workItems.projectId })
        .from(workItems)
        .where(ilike(workItems.title, like))
        .limit(limit);
      for (const row of rows) {
        results.push({
          type: "work",
          id: row.id,
          title: row.title,
          subtitle: "Work",
          href: `/flow/projects/${row.projectId}?work=${row.id}`,
        });
      }
    }

    if (hasCapability(input.accessLevel, "docs:view")) {
      const canSeeInternal = hasCapability(input.accessLevel, "internal-notes:view");
      const rows = await this.db
        .select({ id: documents.id, title: documents.title })
        .from(documents)
        .where(
          canSeeInternal
            ? and(ilike(documents.title, like), isNull(documents.archivedAt))
            : and(ilike(documents.title, like), isNull(documents.archivedAt), eq(documents.visibility, "shared"))
        )
        .limit(limit);
      for (const row of rows) {
        results.push({ type: "document", id: row.id, title: row.title, subtitle: "Document", href: `/flow/docs/${row.id}` });
      }
    }

    return results;
  }
}
