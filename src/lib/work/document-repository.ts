import "server-only";

import { and, asc, desc, eq, isNull } from "drizzle-orm";
import { getDb, type AdminDb } from "@/lib/db/client";
import {
  adminUsers,
  clients,
  documents,
  documentVersions,
  documentWorkLinks,
  projects,
  workItems,
} from "@/lib/db/schema";
import type { CommentVisibility } from "./discussion-repository";

export type DocumentKind =
  | "strategy"
  | "brief"
  | "meeting_note"
  | "sop"
  | "report"
  | "proposal"
  | "research"
  | "decision"
  | "general";

export type DocumentSummary = {
  id: string;
  title: string;
  kind: DocumentKind;
  visibility: CommentVisibility;
  clientName: string | null;
  projectName: string | null;
  updatedAt: Date;
};

export type DocumentVersionEntry = { version: number; authorName: string | null; createdAt: Date };

export type DocumentDetail = {
  id: string;
  title: string;
  kind: DocumentKind;
  body: string;
  version: number;
  visibility: CommentVisibility;
  clientId: string | null;
  clientName: string | null;
  projectId: string | null;
  projectName: string | null;
  updatedByName: string | null;
  updatedAt: Date;
  versions: DocumentVersionEntry[];
  linkedWork: { id: string; title: string; projectId: string }[];
};

export class DocumentRepository {
  private db: AdminDb;

  constructor(db?: AdminDb) {
    this.db = db ?? getDb();
  }

  async list(input: { includeInternal: boolean }): Promise<DocumentSummary[]> {
    const base = this.db
      .select({
        id: documents.id,
        title: documents.title,
        kind: documents.kind,
        visibility: documents.visibility,
        clientName: clients.name,
        projectName: projects.name,
        updatedAt: documents.updatedAt,
      })
      .from(documents)
      .leftJoin(clients, eq(documents.clientId, clients.id))
      .leftJoin(projects, eq(documents.projectId, projects.id));

    const rows = await (input.includeInternal
      ? base.where(isNull(documents.archivedAt))
      : base.where(and(isNull(documents.archivedAt), eq(documents.visibility, "shared")))
    ).orderBy(desc(documents.updatedAt));
    return rows;
  }

  async get(input: { documentId: string; includeInternal: boolean }): Promise<DocumentDetail | null> {
    const rows = await this.db
      .select({
        id: documents.id,
        title: documents.title,
        kind: documents.kind,
        body: documents.body,
        version: documents.version,
        visibility: documents.visibility,
        clientId: documents.clientId,
        clientName: clients.name,
        projectId: documents.projectId,
        projectName: projects.name,
        updatedByName: adminUsers.displayName,
        updatedAt: documents.updatedAt,
      })
      .from(documents)
      .leftJoin(clients, eq(documents.clientId, clients.id))
      .leftJoin(projects, eq(documents.projectId, projects.id))
      .leftJoin(adminUsers, eq(documents.updatedBy, adminUsers.id))
      .where(and(eq(documents.id, input.documentId), isNull(documents.archivedAt)))
      .limit(1);
    const doc = rows[0];
    if (!doc) return null;
    // Internal documents are invisible to anyone without internal-notes visibility.
    if (doc.visibility === "internal" && !input.includeInternal) return null;

    const [versions, linkedWork] = await Promise.all([
      this.db
        .select({
          version: documentVersions.version,
          authorName: adminUsers.displayName,
          createdAt: documentVersions.createdAt,
        })
        .from(documentVersions)
        .leftJoin(adminUsers, eq(documentVersions.createdBy, adminUsers.id))
        .where(eq(documentVersions.documentId, input.documentId))
        .orderBy(desc(documentVersions.version)),
      this.db
        .select({ id: workItems.id, title: workItems.title, projectId: workItems.projectId })
        .from(documentWorkLinks)
        .innerJoin(workItems, eq(documentWorkLinks.workItemId, workItems.id))
        .where(eq(documentWorkLinks.documentId, input.documentId))
        .orderBy(asc(workItems.title)),
    ]);

    return { ...doc, versions, linkedWork };
  }

  async create(input: {
    title: string;
    kind: DocumentKind;
    body: string;
    visibility: CommentVisibility;
    clientId: string | null;
    projectId: string | null;
    createdBy: string;
  }) {
    const [doc] = await this.db
      .insert(documents)
      .values({
        title: input.title,
        kind: input.kind,
        body: input.body,
        visibility: input.visibility,
        clientId: input.clientId,
        projectId: input.projectId,
        createdBy: input.createdBy,
        updatedBy: input.createdBy,
      })
      .returning({ id: documents.id });
    return doc;
  }

  /**
   * Saves an edit as a new version transactionally: the *previous* body is snapshotted into
   * document_versions, then the live row is bumped. History is therefore append-only and a
   * document always has its full lineage. Version numbers are sequential per document.
   */
  async saveNewVersion(input: {
    documentId: string;
    title: string;
    kind: DocumentKind;
    body: string;
    visibility: CommentVisibility;
    editorId: string;
  }): Promise<{ error?: string }> {
    return this.db.transaction(async (tx) => {
      const current = await tx
        .select({
          version: documents.version,
          title: documents.title,
          body: documents.body,
          createdBy: documents.createdBy,
        })
        .from(documents)
        .where(eq(documents.id, input.documentId))
        .limit(1);
      const doc = current[0];
      if (!doc) return { error: "Document not found." };

      // Snapshot the outgoing version before overwriting.
      await tx.insert(documentVersions).values({
        documentId: input.documentId,
        version: doc.version,
        title: doc.title,
        body: doc.body,
        createdBy: doc.createdBy,
      });

      await tx
        .update(documents)
        .set({
          title: input.title,
          kind: input.kind,
          body: input.body,
          visibility: input.visibility,
          version: doc.version + 1,
          updatedBy: input.editorId,
          updatedAt: new Date(),
        })
        .where(eq(documents.id, input.documentId));
      return {};
    });
  }

  async linkWork(input: { documentId: string; workItemId: string }) {
    await this.db.insert(documentWorkLinks).values(input).onConflictDoNothing();
  }

  async unlinkWork(input: { documentId: string; workItemId: string }) {
    await this.db
      .delete(documentWorkLinks)
      .where(
        and(eq(documentWorkLinks.documentId, input.documentId), eq(documentWorkLinks.workItemId, input.workItemId))
      );
  }
}
