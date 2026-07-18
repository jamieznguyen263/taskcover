import "server-only";

import { and, desc, eq, inArray, ne, or } from "drizzle-orm";
import { getDb, type AdminDb } from "@/lib/db/client";
import { adminUsers, notifications } from "@/lib/db/schema";
import {
  countsAsUnread,
  isActiveInInbox,
  type NotificationKind,
  type NotificationState,
} from "./notification-domain";

export type NotificationRow = {
  id: string;
  kind: NotificationKind;
  state: NotificationState;
  actorName: string | null;
  title: string;
  body: string;
  href: string;
  snoozedUntil: Date | null;
  createdAt: Date;
};

export class NotificationRepository {
  private db: AdminDb;

  constructor(db?: AdminDb) {
    this.db = db ?? getDb();
  }

  /**
   * Emits a notification, but never to the actor themselves (you don't get an Inbox item
   * for assigning work to yourself), and it de-duplicates an existing still-open item for
   * the same recipient+target+kind so re-saving a work item doesn't spam the Inbox.
   */
  async emit(input: {
    recipientId: string;
    actorId: string;
    kind: NotificationKind;
    targetType: string;
    targetId: string;
    projectId: string | null;
    title: string;
    body?: string;
    href?: string;
  }): Promise<void> {
    if (input.recipientId === input.actorId) return;

    const existing = await this.db
      .select({ id: notifications.id })
      .from(notifications)
      .where(
        and(
          eq(notifications.recipientId, input.recipientId),
          eq(notifications.targetType, input.targetType),
          eq(notifications.targetId, input.targetId),
          eq(notifications.kind, input.kind),
          ne(notifications.state, "done")
        )
      )
      .limit(1);
    if (existing[0]) return;

    await this.db.insert(notifications).values({
      recipientId: input.recipientId,
      actorId: input.actorId,
      kind: input.kind,
      targetType: input.targetType,
      targetId: input.targetId,
      projectId: input.projectId,
      title: input.title,
      body: input.body ?? "",
      href: input.href ?? "",
    });
  }

  async listActive(recipientId: string, now = new Date()): Promise<NotificationRow[]> {
    const rows = await this.db
      .select({
        id: notifications.id,
        kind: notifications.kind,
        state: notifications.state,
        actorName: adminUsers.displayName,
        title: notifications.title,
        body: notifications.body,
        href: notifications.href,
        snoozedUntil: notifications.snoozedUntil,
        createdAt: notifications.createdAt,
      })
      .from(notifications)
      .leftJoin(adminUsers, eq(notifications.actorId, adminUsers.id))
      .where(eq(notifications.recipientId, recipientId))
      .orderBy(desc(notifications.createdAt))
      .limit(200);

    // Inbox membership (done hidden, pending snoozes hidden) is decided by the same pure
    // helper the badge uses, so list and count never disagree.
    return rows.filter((row) => isActiveInInbox({ state: row.state, snoozedUntil: row.snoozedUntil, now }));
  }

  async unreadCount(recipientId: string, now = new Date()): Promise<number> {
    const rows = await this.db
      .select({ state: notifications.state, snoozedUntil: notifications.snoozedUntil })
      .from(notifications)
      .where(
        and(
          eq(notifications.recipientId, recipientId),
          or(eq(notifications.state, "unread"), eq(notifications.state, "snoozed"))
        )
      );
    return rows.filter((row) => countsAsUnread({ state: row.state, snoozedUntil: row.snoozedUntil, now })).length;
  }

  /** Owns the transition; only the recipient may mutate their own notification. */
  async setState(input: {
    id: string;
    recipientId: string;
    state: NotificationState;
    snoozedUntil?: Date | null;
  }): Promise<void> {
    await this.db
      .update(notifications)
      .set({
        state: input.state,
        snoozedUntil: input.state === "snoozed" ? (input.snoozedUntil ?? null) : null,
        updatedAt: new Date(),
      })
      .where(and(eq(notifications.id, input.id), eq(notifications.recipientId, input.recipientId)));
  }

  async markAllRead(recipientId: string): Promise<void> {
    await this.db
      .update(notifications)
      .set({ state: "read", updatedAt: new Date() })
      .where(
        and(
          eq(notifications.recipientId, recipientId),
          inArray(notifications.state, ["unread", "snoozed"])
        )
      );
  }
}
