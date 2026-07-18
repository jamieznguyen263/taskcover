import "server-only";

import { and, asc, desc, eq } from "drizzle-orm";
import { getDb, type AdminDb } from "@/lib/db/client";
import {
  activityEvents,
  adminUsers,
  discussionThreads,
  workComments,
  workFileLinks,
  workFiles,
} from "@/lib/db/schema";

export type CommentVisibility = "internal" | "shared";

/**
 * A comment is internal only if the author both asked for internal AND may see internal
 * notes. External collaborators never hold `internal-notes:view`, so their comments can
 * never be silently stored as internal — they are always shared. Pure and unit-tested.
 */
export function resolveCommentVisibility(input: {
  wantsInternal: boolean;
  canViewInternal: boolean;
}): CommentVisibility {
  return input.wantsInternal && input.canViewInternal ? "internal" : "shared";
}

export type WorkComment = {
  id: string;
  authorName: string | null;
  body: string;
  visibility: CommentVisibility;
  createdAt: Date;
};

export type WorkFile = {
  id: string;
  filename: string;
  url: string;
  visibility: CommentVisibility;
  uploaderName: string | null;
  createdAt: Date;
};

export type ActivityEntry = {
  id: string;
  actorName: string | null;
  event: string;
  summary: string;
  createdAt: Date;
};

/**
 * Reads and writes work discussions, files, and the activity timeline. Visibility is
 * enforced here, never in the UI: when `includeInternal` is false (an external
 * collaborator), internal comments/files/activity are filtered out at the query. Callers
 * derive `includeInternal` from the `internal-notes:view` capability, which externals never
 * hold.
 */
export class DiscussionRepository {
  private db: AdminDb;

  constructor(db?: AdminDb) {
    this.db = db ?? getDb();
  }

  private async ensureThread(workItemId: string): Promise<string> {
    const existing = await this.db
      .select({ id: discussionThreads.id })
      .from(discussionThreads)
      .where(eq(discussionThreads.workItemId, workItemId))
      .limit(1);
    if (existing[0]) return existing[0].id;
    const [thread] = await this.db
      .insert(discussionThreads)
      .values({ workItemId })
      .onConflictDoNothing({ target: discussionThreads.workItemId })
      .returning({ id: discussionThreads.id });
    if (thread) return thread.id;
    // Lost the race — read the row the other writer inserted.
    const row = await this.db
      .select({ id: discussionThreads.id })
      .from(discussionThreads)
      .where(eq(discussionThreads.workItemId, workItemId))
      .limit(1);
    return row[0].id;
  }

  async listComments(input: { workItemId: string; includeInternal: boolean }): Promise<WorkComment[]> {
    const rows = await this.db
      .select({
        id: workComments.id,
        authorName: adminUsers.displayName,
        body: workComments.body,
        visibility: workComments.visibility,
        createdAt: workComments.createdAt,
      })
      .from(workComments)
      .innerJoin(discussionThreads, eq(workComments.threadId, discussionThreads.id))
      .leftJoin(adminUsers, eq(workComments.authorId, adminUsers.id))
      .where(
        input.includeInternal
          ? eq(discussionThreads.workItemId, input.workItemId)
          : and(eq(discussionThreads.workItemId, input.workItemId), eq(workComments.visibility, "shared"))
      )
      .orderBy(asc(workComments.createdAt));
    return rows;
  }

  async addComment(input: {
    workItemId: string;
    authorId: string;
    body: string;
    visibility: CommentVisibility;
  }) {
    const threadId = await this.ensureThread(input.workItemId);
    await this.db
      .insert(workComments)
      .values({ threadId, authorId: input.authorId, body: input.body, visibility: input.visibility });
  }

  async listFiles(input: { workItemId: string; includeInternal: boolean }): Promise<WorkFile[]> {
    const rows = await this.db
      .select({
        id: workFiles.id,
        filename: workFiles.filename,
        url: workFiles.url,
        visibility: workFiles.visibility,
        uploaderName: adminUsers.displayName,
        createdAt: workFiles.createdAt,
      })
      .from(workFileLinks)
      .innerJoin(workFiles, eq(workFileLinks.fileId, workFiles.id))
      .leftJoin(adminUsers, eq(workFiles.uploadedBy, adminUsers.id))
      .where(
        input.includeInternal
          ? eq(workFileLinks.workItemId, input.workItemId)
          : and(eq(workFileLinks.workItemId, input.workItemId), eq(workFiles.visibility, "shared"))
      )
      .orderBy(desc(workFiles.createdAt));
    return rows;
  }

  async attachFile(input: {
    workItemId: string;
    filename: string;
    url: string;
    visibility: CommentVisibility;
    uploadedBy: string;
  }) {
    return this.db.transaction(async (tx) => {
      const [file] = await tx
        .insert(workFiles)
        .values({
          filename: input.filename,
          url: input.url,
          visibility: input.visibility,
          uploadedBy: input.uploadedBy,
        })
        .returning({ id: workFiles.id });
      await tx.insert(workFileLinks).values({ fileId: file.id, workItemId: input.workItemId });
      return file;
    });
  }

  async listActivity(input: { workItemId: string; includeInternal: boolean; limit?: number }): Promise<ActivityEntry[]> {
    return this.db
      .select({
        id: activityEvents.id,
        actorName: adminUsers.displayName,
        event: activityEvents.event,
        summary: activityEvents.summary,
        createdAt: activityEvents.createdAt,
      })
      .from(activityEvents)
      .leftJoin(adminUsers, eq(activityEvents.actorId, adminUsers.id))
      .where(
        input.includeInternal
          ? and(eq(activityEvents.targetType, "work_item"), eq(activityEvents.targetId, input.workItemId))
          : and(
              eq(activityEvents.targetType, "work_item"),
              eq(activityEvents.targetId, input.workItemId),
              eq(activityEvents.visibility, "shared")
            )
      )
      .orderBy(desc(activityEvents.createdAt))
      .limit(input.limit ?? 30);
  }
}
