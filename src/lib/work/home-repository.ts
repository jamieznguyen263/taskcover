import "server-only";

import { and, asc, eq, inArray, ne } from "drizzle-orm";
import { getDb, type AdminDb } from "@/lib/db/client";
import { adminUsers, projects, workItems } from "@/lib/db/schema";
import type { WaitingTarget, WorkStatus, WorkType } from "./work-domain";

export type HomeWorkRow = {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  type: WorkType;
  status: WorkStatus;
  ownerId: string;
  ownerName: string | null;
  waitingTarget: WaitingTarget | null;
  dueAt: Date | null;
};

export type HomeData = {
  myFocus: HomeWorkRow[]; // owned by me, overdue or due soon, still open
  myWork: HomeWorkRow[]; // everything open I own
  needsAttention: HomeWorkRow[]; // I own and it's in review or waiting
  overdue: HomeWorkRow[]; // I own, past due, open
  reviewQueue: HomeWorkRow[]; // I'm the reviewer, status = review (managers/reviewers)
};

const OPEN_STATUSES: WorkStatus[] = ["to_do", "in_progress", "waiting", "review"];

function href(row: { projectId: string; id: string }) {
  return `/flow/projects/${row.projectId}?work=${row.id}`;
}

export { href as homeWorkHref };

export class HomeRepository {
  private db: AdminDb;

  constructor(db?: AdminDb) {
    this.db = db ?? getDb();
  }

  async getForUser(userId: string, now = new Date()): Promise<HomeData> {
    const dueSoonThreshold = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // One scan for everything the user owns that is still open, plus their review queue.
    const [ownedOpen, reviewQueue] = await Promise.all([
      this.db
        .select({
          id: workItems.id,
          projectId: workItems.projectId,
          projectName: projects.name,
          title: workItems.title,
          type: workItems.type,
          status: workItems.status,
          ownerId: workItems.ownerId,
          ownerName: adminUsers.displayName,
          waitingTarget: workItems.waitingTarget,
          dueAt: workItems.dueAt,
        })
        .from(workItems)
        .innerJoin(projects, eq(workItems.projectId, projects.id))
        .leftJoin(adminUsers, eq(workItems.ownerId, adminUsers.id))
        .where(and(eq(workItems.ownerId, userId), inArray(workItems.status, OPEN_STATUSES)))
        .orderBy(asc(workItems.dueAt), asc(workItems.createdAt)),
      this.db
        .select({
          id: workItems.id,
          projectId: workItems.projectId,
          projectName: projects.name,
          title: workItems.title,
          type: workItems.type,
          status: workItems.status,
          ownerId: workItems.ownerId,
          ownerName: adminUsers.displayName,
          waitingTarget: workItems.waitingTarget,
          dueAt: workItems.dueAt,
        })
        .from(workItems)
        .innerJoin(projects, eq(workItems.projectId, projects.id))
        .leftJoin(adminUsers, eq(workItems.ownerId, adminUsers.id))
        .where(and(eq(workItems.reviewerId, userId), eq(workItems.status, "review"), ne(workItems.ownerId, userId)))
        .orderBy(asc(workItems.dueAt), asc(workItems.createdAt)),
    ]);

    const overdue = ownedOpen.filter((row) => row.dueAt !== null && row.dueAt < now);
    const needsAttention = ownedOpen.filter((row) => row.status === "review" || row.status === "waiting");
    const myFocus = ownedOpen.filter(
      (row) => row.dueAt !== null && row.dueAt <= dueSoonThreshold
    );

    return { myFocus, myWork: ownedOpen, needsAttention, overdue, reviewQueue };
  }

  /** Lightweight workload signal for a manager view: open item count per active owner. */
  async workloadByOwner(): Promise<{ ownerId: string; ownerName: string | null; openCount: number }[]> {
    const rows = await this.db
      .select({
        ownerId: workItems.ownerId,
        ownerName: adminUsers.displayName,
        status: workItems.status,
      })
      .from(workItems)
      .leftJoin(adminUsers, eq(workItems.ownerId, adminUsers.id))
      .where(inArray(workItems.status, OPEN_STATUSES));

    const counts = new Map<string, { ownerName: string | null; openCount: number }>();
    for (const row of rows) {
      const entry = counts.get(row.ownerId) ?? { ownerName: row.ownerName, openCount: 0 };
      entry.openCount += 1;
      counts.set(row.ownerId, entry);
    }
    return Array.from(counts.entries())
      .map(([ownerId, value]) => ({ ownerId, ...value }))
      .sort((a, b) => b.openCount - a.openCount);
  }
}
