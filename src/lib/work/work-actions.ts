"use server";

import { revalidatePath } from "next/cache";
import { hasCapability } from "./capabilities";
import { DiscussionRepository, resolveCommentVisibility } from "./discussion-repository";
import { validateFlowFileUpload } from "./file-upload";
import { NotificationRepository } from "./notification-repository";
import { requireWorkSession } from "./session";
import { WorkItemRepository } from "./work-repository";
import {
  isWorkStatus,
  isWorkType,
  resolveStatusChange,
  WORK_STATUS_LABEL,
  type WorkStatus,
  type WorkType,
} from "./work-domain";

export type WorkActionState = { error?: string };
export type MoveResult = { ok: true } | { ok: false; error: string };

/**
 * Direct-call action for the board (drag-and-drop and inline quick-add) — invoked from a
 * transition with an object argument rather than a <form>, so the UI can update optimistically
 * and roll back on `{ ok: false }`. Still fully guarded: work:manage + the Waiting invariant.
 */
export async function moveWorkStatusAction(input: {
  workItemId: string;
  projectId: string;
  status: string;
  waitingTarget?: string | null;
}): Promise<MoveResult> {
  const session = await requireWorkSession("work:manage");
  const resolved = resolveStatusChange({
    nextStatus: input.status,
    waitingTarget: input.waitingTarget ?? null,
  });
  if (!resolved.ok) return { ok: false, error: resolved.error };
  if (!input.workItemId || !input.projectId) return { ok: false, error: "Missing work item." };

  try {
    await new WorkItemRepository().updateStatus({
      workItemId: input.workItemId,
      projectId: input.projectId,
      status: resolved.status,
      waitingTarget: resolved.waitingTarget,
      waitingNote: "",
      actorId: session.userId,
      summary: `moved to ${WORK_STATUS_LABEL[resolved.status]}`,
    });
  } catch {
    return { ok: false, error: "Could not move the work item." };
  }
  revalidatePath(`/flow/projects/${input.projectId}`);
  return { ok: true };
}

/** Inline rename from the board card (double-click) — direct-call, guarded by work:manage. */
export async function renameWorkItemAction(input: {
  workItemId: string;
  projectId: string;
  title: string;
}): Promise<MoveResult> {
  await requireWorkSession("work:manage");
  const title = input.title.trim();
  if (!input.workItemId || !input.projectId) return { ok: false, error: "Missing work item." };
  if (!title) return { ok: false, error: "Title can't be empty." };
  if (title.length > 200) return { ok: false, error: "Title must be at most 200 characters." };

  try {
    await new WorkItemRepository().renameWorkItem({ workItemId: input.workItemId, title });
  } catch {
    return { ok: false, error: "Could not rename the work item." };
  }
  revalidatePath(`/flow/projects/${input.projectId}`);
  return { ok: true };
}

export async function quickAddWorkAction(input: {
  projectId: string;
  title: string;
  status: string;
}): Promise<MoveResult> {
  const session = await requireWorkSession("work:manage");
  const title = input.title.trim();
  if (!input.projectId) return { ok: false, error: "Missing project." };
  if (!title) return { ok: false, error: "Work needs a title." };
  if (title.length > 200) return { ok: false, error: "Title must be at most 200 characters." };
  // Quick-add never creates directly into Waiting (that needs a target); fall back to To do.
  const status: WorkStatus = isWorkStatus(input.status) && input.status !== "waiting" ? input.status : "to_do";

  try {
    await new WorkItemRepository().createWorkItem({
      projectId: input.projectId,
      type: "task",
      title,
      description: "",
      ownerId: session.userId,
      dueAt: null,
      parentId: null,
      createdBy: session.userId,
      status,
    });
  } catch {
    return { ok: false, error: "Could not add the work item." };
  }
  revalidatePath(`/flow/projects/${input.projectId}`);
  return { ok: true };
}

function workHref(projectId: string, workItemId: string) {
  return `/flow/projects/${projectId}?work=${workItemId}`;
}

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

  let created: { id: string };
  try {
    created = await new WorkItemRepository().createWorkItem({
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
  // Notify the owner they've been assigned (emit() no-ops when owner is the creator).
  await new NotificationRepository().emit({
    recipientId: ownerId,
    actorId: session.userId,
    kind: "assignment",
    targetType: "work_item",
    targetId: created.id,
    projectId,
    title: `You were assigned “${title}”`,
    body: `${session.displayName} assigned you this work.`,
    href: workHref(projectId, created.id),
  });
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
  const session = await requireWorkSession("work:manage");

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
  // Notify owner and reviewer. emit() de-dupes an existing open item, so re-saving without
  // changing the assignee doesn't spam the Inbox.
  const notifications = new NotificationRepository();
  await notifications.emit({
    recipientId: ownerId,
    actorId: session.userId,
    kind: "assignment",
    targetType: "work_item",
    targetId: workItemId,
    projectId,
    title: `You own “${title}”`,
    body: `${session.displayName} updated this work.`,
    href: workHref(projectId, workItemId),
  });
  if (reviewerId) {
    await notifications.emit({
      recipientId: reviewerId,
      actorId: session.userId,
      kind: "review_request",
      targetType: "work_item",
      targetId: workItemId,
      projectId,
      title: `Review requested: “${title}”`,
      body: `${session.displayName} asked you to review this work.`,
      href: workHref(projectId, workItemId),
    });
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

/**
 * Records a file the browser already uploaded to Cloudinary (via the signed
 * /api/flow/upload-signature). Re-validates size/type server-side so a tampered client can't
 * record something the signature endpoint would have rejected, and applies the same
 * internal|shared visibility rule as comments.
 */
export async function attachWorkFileAction(input: {
  workItemId: string;
  projectId: string;
  filename: string;
  url: string;
  contentType: string;
  sizeBytes: number;
  wantsInternal: boolean;
}): Promise<WorkActionState> {
  const session = await requireWorkSession("work:manage");
  if (!input.workItemId || !input.projectId) return { error: "Missing work item." };
  if (!input.url || !input.filename) return { error: "Missing uploaded file." };
  const fileCheck = validateFlowFileUpload({ mimeType: input.contentType, bytes: input.sizeBytes });
  if (fileCheck.error) return { error: fileCheck.error };

  const visibility = resolveCommentVisibility({
    wantsInternal: input.wantsInternal,
    canViewInternal: hasCapability(session.accessLevel, "internal-notes:view"),
  });

  try {
    await new DiscussionRepository().attachFile({
      workItemId: input.workItemId,
      filename: input.filename.slice(0, 255),
      url: input.url,
      contentType: input.contentType,
      sizeBytes: input.sizeBytes,
      visibility,
      uploadedBy: session.userId,
    });
  } catch {
    return { error: "Could not attach the file." };
  }
  revalidatePath(`/flow/projects/${input.projectId}`);
  return {};
}
