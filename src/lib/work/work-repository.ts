import "server-only";

import { and, asc, eq, inArray } from "drizzle-orm";
import { getDb, type AdminDb } from "@/lib/db/client";
import {
  activityEvents,
  adminUsers,
  workChecklistItems,
  workDependencies,
  workItemMembers,
  workItems,
} from "@/lib/db/schema";
import type { WaitingTarget, WorkStatus, WorkType } from "./work-domain";

export type WorkItemSummary = {
  id: string;
  type: WorkType;
  title: string;
  status: WorkStatus;
  ownerId: string;
  ownerName: string | null;
  waitingTarget: WaitingTarget | null;
  dueAt: Date | null;
  parentId: string | null;
};

export type WorkItemMember = { userId: string; displayName: string; relation: "contributor" | "watcher" };
export type WorkChecklistEntry = { id: string; label: string; isDone: boolean };

export type WorkItemDetail = {
  id: string;
  projectId: string;
  type: WorkType;
  title: string;
  description: string;
  status: WorkStatus;
  ownerId: string;
  ownerName: string | null;
  reviewerId: string | null;
  reviewerName: string | null;
  waitingTarget: WaitingTarget | null;
  waitingNote: string;
  dueAt: Date | null;
  parentId: string | null;
  members: WorkItemMember[];
  checklist: WorkChecklistEntry[];
  dependencyIds: string[];
};

export class WorkItemRepository {
  private db: AdminDb;

  constructor(db?: AdminDb) {
    this.db = db ?? getDb();
  }

  async listByProject(projectId: string): Promise<WorkItemSummary[]> {
    return this.db
      .select({
        id: workItems.id,
        type: workItems.type,
        title: workItems.title,
        status: workItems.status,
        ownerId: workItems.ownerId,
        ownerName: adminUsers.displayName,
        waitingTarget: workItems.waitingTarget,
        dueAt: workItems.dueAt,
        parentId: workItems.parentId,
      })
      .from(workItems)
      .leftJoin(adminUsers, eq(workItems.ownerId, adminUsers.id))
      .where(eq(workItems.projectId, projectId))
      .orderBy(asc(workItems.position), asc(workItems.createdAt));
  }

  async getById(workItemId: string): Promise<WorkItemDetail | null> {
    const rows = await this.db
      .select({
        id: workItems.id,
        projectId: workItems.projectId,
        type: workItems.type,
        title: workItems.title,
        description: workItems.description,
        status: workItems.status,
        ownerId: workItems.ownerId,
        ownerName: adminUsers.displayName,
        reviewerId: workItems.reviewerId,
        waitingTarget: workItems.waitingTarget,
        waitingNote: workItems.waitingNote,
        dueAt: workItems.dueAt,
        parentId: workItems.parentId,
      })
      .from(workItems)
      .leftJoin(adminUsers, eq(workItems.ownerId, adminUsers.id))
      .where(eq(workItems.id, workItemId))
      .limit(1);
    const item = rows[0];
    if (!item) return null;

    const [reviewerName, members, checklist, dependencies] = await Promise.all([
      item.reviewerId
        ? this.db
            .select({ displayName: adminUsers.displayName })
            .from(adminUsers)
            .where(eq(adminUsers.id, item.reviewerId))
            .limit(1)
            .then((r) => r[0]?.displayName ?? null)
        : Promise.resolve(null),
      this.db
        .select({
          userId: workItemMembers.userId,
          displayName: adminUsers.displayName,
          relation: workItemMembers.relation,
        })
        .from(workItemMembers)
        .innerJoin(adminUsers, eq(workItemMembers.userId, adminUsers.id))
        .where(eq(workItemMembers.workItemId, workItemId))
        .orderBy(asc(adminUsers.displayName)),
      this.db
        .select({ id: workChecklistItems.id, label: workChecklistItems.label, isDone: workChecklistItems.isDone })
        .from(workChecklistItems)
        .where(eq(workChecklistItems.workItemId, workItemId))
        .orderBy(asc(workChecklistItems.position), asc(workChecklistItems.createdAt)),
      this.db
        .select({ dependsOnWorkItemId: workDependencies.dependsOnWorkItemId })
        .from(workDependencies)
        .where(eq(workDependencies.workItemId, workItemId)),
    ]);

    return {
      ...item,
      reviewerName,
      members,
      checklist,
      dependencyIds: dependencies.map((d) => d.dependsOnWorkItemId),
    };
  }

  async createWorkItem(input: {
    projectId: string;
    type: WorkType;
    title: string;
    description: string;
    ownerId: string;
    dueAt: Date | null;
    parentId: string | null;
    createdBy: string;
  }) {
    const [item] = await this.db
      .insert(workItems)
      .values({
        projectId: input.projectId,
        type: input.type,
        title: input.title,
        description: input.description,
        ownerId: input.ownerId,
        dueAt: input.dueAt,
        parentId: input.parentId,
        createdBy: input.createdBy,
      })
      .returning({ id: workItems.id });
    await this.logActivity({
      actorId: input.createdBy,
      workItemId: item.id,
      projectId: input.projectId,
      event: "work.created",
      summary: `created ${input.type} “${input.title}”`,
    });
    return item;
  }

  async updateStatus(input: {
    workItemId: string;
    projectId: string;
    status: WorkStatus;
    waitingTarget: WaitingTarget | null;
    waitingNote: string;
    actorId: string;
    summary: string;
  }) {
    await this.db
      .update(workItems)
      .set({
        status: input.status,
        waitingTarget: input.waitingTarget,
        waitingNote: input.waitingNote,
        completedAt: input.status === "done" ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(workItems.id, input.workItemId));
    await this.logActivity({
      actorId: input.actorId,
      workItemId: input.workItemId,
      projectId: input.projectId,
      event: "work.status_changed",
      summary: input.summary,
    });
  }

  async updateDetails(input: {
    workItemId: string;
    title: string;
    description: string;
    type: WorkType;
    ownerId: string;
    reviewerId: string | null;
    dueAt: Date | null;
  }) {
    await this.db
      .update(workItems)
      .set({
        title: input.title,
        description: input.description,
        type: input.type,
        ownerId: input.ownerId,
        reviewerId: input.reviewerId,
        dueAt: input.dueAt,
        updatedAt: new Date(),
      })
      .where(eq(workItems.id, input.workItemId));
  }

  async addMember(input: { workItemId: string; userId: string; relation: "contributor" | "watcher" }) {
    await this.db.insert(workItemMembers).values(input).onConflictDoNothing();
  }

  async removeMember(input: { workItemId: string; userId: string; relation: "contributor" | "watcher" }) {
    await this.db
      .delete(workItemMembers)
      .where(
        and(
          eq(workItemMembers.workItemId, input.workItemId),
          eq(workItemMembers.userId, input.userId),
          eq(workItemMembers.relation, input.relation)
        )
      );
  }

  async addChecklistItem(input: { workItemId: string; label: string }) {
    await this.db.insert(workChecklistItems).values({ workItemId: input.workItemId, label: input.label });
  }

  async toggleChecklistItem(input: { checklistItemId: string; isDone: boolean }) {
    await this.db
      .update(workChecklistItems)
      .set({ isDone: input.isDone })
      .where(eq(workChecklistItems.id, input.checklistItemId));
  }

  async removeChecklistItem(checklistItemId: string) {
    await this.db.delete(workChecklistItems).where(eq(workChecklistItems.id, checklistItemId));
  }

  /**
   * Adds a finish-to-start dependency, guarding against the obvious integrity breaks: no
   * self-dependency, and no direct A↔B cycle. (Deep cycle detection is a FLOW-008 concern;
   * v1 keeps dependencies "simple" per the blueprint.)
   */
  async addDependency(input: { workItemId: string; dependsOnWorkItemId: string }): Promise<{ error?: string }> {
    if (input.workItemId === input.dependsOnWorkItemId) return { error: "A work item can't depend on itself." };
    const reverse = await this.db
      .select({ workItemId: workDependencies.workItemId })
      .from(workDependencies)
      .where(
        and(
          eq(workDependencies.workItemId, input.dependsOnWorkItemId),
          eq(workDependencies.dependsOnWorkItemId, input.workItemId)
        )
      )
      .limit(1);
    if (reverse[0]) return { error: "That would create a circular dependency." };
    await this.db.insert(workDependencies).values(input).onConflictDoNothing();
    return {};
  }

  async removeDependency(input: { workItemId: string; dependsOnWorkItemId: string }) {
    await this.db
      .delete(workDependencies)
      .where(
        and(
          eq(workDependencies.workItemId, input.workItemId),
          eq(workDependencies.dependsOnWorkItemId, input.dependsOnWorkItemId)
        )
      );
  }

  /** Resolve work-item ids to titles for dependency display without an N+1. */
  async titlesFor(ids: string[]): Promise<Map<string, string>> {
    if (ids.length === 0) return new Map();
    const rows = await this.db
      .select({ id: workItems.id, title: workItems.title })
      .from(workItems)
      .where(inArray(workItems.id, ids));
    return new Map(rows.map((row) => [row.id, row.title]));
  }

  private async logActivity(input: {
    actorId: string;
    workItemId: string;
    projectId: string;
    event: string;
    summary: string;
  }) {
    await this.db.insert(activityEvents).values({
      actorId: input.actorId,
      targetType: "work_item",
      targetId: input.workItemId,
      projectId: input.projectId,
      event: input.event,
      summary: input.summary,
      visibility: "internal",
    });
  }
}
