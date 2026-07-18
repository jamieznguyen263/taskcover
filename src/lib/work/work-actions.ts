"use server";

import { revalidatePath } from "next/cache";
import { hasCapability } from "./capabilities";
import { DiscussionRepository, resolveCommentVisibility } from "./discussion-repository";
import { requireWorkSession } from "./session";
import { WorkItemRepository } from "./work-repository";
import { isWorkType, resolveStatusChange, WORK_STATUS_LABEL, type WorkType } from "./work-domain";

export type WorkActionState = { error?: string };

function parseDueAt(raw: string): Date | null {
  const value = raw.trim();
  if (!value) return null;
  const parsed = new Date(`${value}T23:59:59`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseType(raw: string): WorkType {
  return isWorkType(raw) ? raw : "task";
}

export async function createWorkItemAction(_state: WorkActionState, formData: FormData): Promise<WorkActionState> {
  const session = await requireWorkSession("work:manage");

  const projectId = String(formData.get("projectId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const type = parseType(String(formData.get("type") ?? "task"));
  const ownerId = String(formData.get("ownerId") ?? "").trim() || session.userId;
  const dueAt = parseDueAt(String(formData.get("dueAt") ?? ""));
  if (!projectId) return { error: "Missing project." };
  if (!title) return { error: "Work needs a title." };
  if (title.length > 200) return { error: "Title must be at most 200 characters." };

  try {
    await new WorkItemRepository().createWorkItem({
      projectId,
      type,
      title,
      description,
      ownerId,
      dueAt,
      parentId: null,
      createdBy: session.userId,
    });
  } catch {
    return { error: "Could not create the work item." };
  }
  revalidatePath(`/flow/projects/${projectId}`);
  return {};
}

export async function updateWorkStatusAction(_state: WorkActionState, formData: FormData): Promise<WorkActionState> {
  const session = await requireWorkSession("work:manage");

  const workItemId = String(formData.get("workItemId") ?? "");
  const projectId = String(formData.get("projectId") ?? "");
  const nextStatus = String(formData.get("status") ?? "");
  const waitingTarget = String(formData.get("waitingTarget") ?? "") || null;
  const waitingNote = String(formData.get("waitingNote") ?? "").trim();
  if (!workItemId || !projectId) return { error: "Missing work item." };

  const resolved = resolveStatusChange({ nextStatus, waitingTarget });
  if (!resolved.ok) return { error: resolved.error };

  try {
    await new WorkItemRepository().updateStatus({
      workItemId,
      projectId,
      status: resolved.status,
      waitingTarget: resolved.waitingTarget,
      waitingNote: resolved.status === "waiting" ? waitingNote : "",
      actorId: session.userId,
      summary: `moved to ${WORK_STATUS_LABEL[resolved.status]}`,
    });
  } catch {
    return { error: "Could not update the status." };
  }
  revalidatePath(`/flow/projects/${projectId}`);
  return {};
}

export async function updateWorkDetailsAction(_state: WorkActionState, formData: FormData): Promise<WorkActionState> {
  await requireWorkSession("work:manage");

  const workItemId = String(formData.get("workItemId") ?? "");
  const projectId = String(formData.get("projectId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const type = parseType(String(formData.get("type") ?? "task"));
  const ownerId = String(formData.get("ownerId") ?? "").trim();
  const reviewerId = String(formData.get("reviewerId") ?? "").trim() || null;
  const dueAt = parseDueAt(String(formData.get("dueAt") ?? ""));
  if (!workItemId || !projectId) return { error: "Missing work item." };
  if (!title) return { error: "Work needs a title." };
  if (!ownerId) return { error: "Work needs exactly one accountable owner." };

  try {
    await new WorkItemRepository().updateDetails({ workItemId, title, description, type, ownerId, reviewerId, dueAt });
  } catch {
    return { error: "Could not save the work item." };
  }
  revalidatePath(`/flow/projects/${projectId}`);
  return {};
}

export async function addChecklistItemAction(_state: WorkActionState, formData: FormData): Promise<WorkActionState> {
  await requireWorkSession("work:manage");

  const workItemId = String(formData.get("workItemId") ?? "");
  const projectId = String(formData.get("projectId") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  if (!workItemId || !projectId) return { error: "Missing work item." };
  if (!label) return { error: "Checklist item needs a label." };

  try {
    await new WorkItemRepository().addChecklistItem({ workItemId, label });
  } catch {
    return { error: "Could not add the checklist item." };
  }
  revalidatePath(`/flow/projects/${projectId}`);
  return {};
}

/** Form-only (no error surface): the checkbox toggle submits directly via `<form action>`. */
export async function toggleChecklistItemAction(formData: FormData): Promise<void> {
  await requireWorkSession("work:manage");

  const checklistItemId = String(formData.get("checklistItemId") ?? "");
  const projectId = String(formData.get("projectId") ?? "");
  const isDone = formData.get("isDone") === "true";
  if (!checklistItemId || !projectId) return;

  await new WorkItemRepository().toggleChecklistItem({ checklistItemId, isDone });
  revalidatePath(`/flow/projects/${projectId}`);
}

export async function addWorkCommentAction(_state: WorkActionState, formData: FormData): Promise<WorkActionState> {
  const session = await requireWorkSession("work:view");

  const workItemId = String(formData.get("workItemId") ?? "");
  const projectId = String(formData.get("projectId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  // Only users who can see internal notes may post internal comments; everyone else's
  // comments are shared. Externals never hold internal-notes:view, so their posts are
  // always shared and can never be silently internal.
  const visibility = resolveCommentVisibility({
    wantsInternal: formData.get("visibility") === "internal",
    canViewInternal: hasCapability(session.accessLevel, "internal-notes:view"),
  });
  if (!workItemId || !projectId) return { error: "Missing work item." };
  if (!body) return { error: "Comment can't be empty." };
  if (body.length > 4000) return { error: "Comment must be at most 4000 characters." };

  try {
    await new DiscussionRepository().addComment({ workItemId, authorId: session.userId, body, visibility });
  } catch {
    return { error: "Could not post the comment." };
  }
  revalidatePath(`/flow/projects/${projectId}`);
  return {};
}
