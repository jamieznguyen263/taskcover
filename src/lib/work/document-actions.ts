"use server";

import { revalidatePath } from "next/cache";
import { reportActionFailure } from "./action-error";
import { hasCapability } from "./capabilities";
import { DocumentRepository, type DocumentKind } from "./document-repository";
import { resolveCommentVisibility, type CommentVisibility } from "./discussion-repository";
import { requireWorkSession } from "./session";
import { WorkItemRepository } from "./work-repository";

export type DocumentActionState = { error?: string };

const DOCUMENT_KINDS: readonly DocumentKind[] = [
  "strategy",
  "brief",
  "meeting_note",
  "sop",
  "report",
  "proposal",
  "research",
  "decision",
  "general",
];

function parseKind(raw: string): DocumentKind {
  return (DOCUMENT_KINDS as readonly string[]).includes(raw) ? (raw as DocumentKind) : "general";
}

/** Only users who can see internal notes may keep a document internal; else it's shared. */
function resolveDocVisibility(formValue: FormDataEntryValue | null, canInternal: boolean): CommentVisibility {
  return resolveCommentVisibility({ wantsInternal: formValue === "internal", canViewInternal: canInternal });
}

export async function createDocumentAction(
  _state: DocumentActionState,
  formData: FormData
): Promise<DocumentActionState> {
  const session = await requireWorkSession("docs:manage");

  const title = String(formData.get("title") ?? "").trim();
  const kind = parseKind(String(formData.get("kind") ?? "general"));
  const body = String(formData.get("body") ?? "");
  const clientId = String(formData.get("clientId") ?? "").trim() || null;
  const projectId = String(formData.get("projectId") ?? "").trim() || null;
  const visibility = resolveDocVisibility(
    formData.get("visibility"),
    hasCapability(session.accessLevel, "internal-notes:view")
  );
  if (!title) return { error: "A document needs a title." };
  if (title.length > 200) return { error: "Title must be at most 200 characters." };

  try {
    await new DocumentRepository().create({ title, kind, body, visibility, clientId, projectId, createdBy: session.userId });
  } catch (error) {
    reportActionFailure("createDocumentAction", error);
    return { error: "Could not create the document." };
  }
  revalidatePath("/flow/docs");
  return {};
}

export async function saveDocumentAction(_state: DocumentActionState, formData: FormData): Promise<DocumentActionState> {
  const session = await requireWorkSession("docs:manage");

  const documentId = String(formData.get("documentId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const kind = parseKind(String(formData.get("kind") ?? "general"));
  const body = String(formData.get("body") ?? "");
  const visibility = resolveDocVisibility(
    formData.get("visibility"),
    hasCapability(session.accessLevel, "internal-notes:view")
  );
  if (!documentId) return { error: "Missing document." };
  if (!title) return { error: "A document needs a title." };

  const result = await new DocumentRepository().saveNewVersion({
    documentId,
    title,
    kind,
    body,
    visibility,
    editorId: session.userId,
  });
  if (result.error) return { error: result.error };
  revalidatePath(`/flow/docs/${documentId}`);
  revalidatePath("/flow/docs");
  return {};
}

/**
 * FLOW-011 meeting-note action extraction, applied. The caller has already reviewed the
 * candidate titles in the preview UI and selected which to create — this action never runs
 * autonomously. Each selected title becomes a work item owned by the creator in the given
 * project, linked back to the document.
 */
export async function createWorkFromActionsAction(
  _state: DocumentActionState,
  formData: FormData
): Promise<DocumentActionState> {
  const session = await requireWorkSession("work:manage");

  const documentId = String(formData.get("documentId") ?? "");
  const projectId = String(formData.get("projectId") ?? "");
  const selected = formData.getAll("action").map((value) => String(value)).filter(Boolean);
  if (!documentId || !projectId) return { error: "Choose a project to create the work in." };
  if (selected.length === 0) return { error: "Select at least one action to create." };

  const workRepo = new WorkItemRepository();
  const docRepo = new DocumentRepository();
  try {
    for (const title of selected) {
      const item = await workRepo.createWorkItem({
        projectId,
        type: "task",
        title: title.slice(0, 200),
        description: "",
        ownerId: session.userId,
        dueAt: null,
        parentId: null,
        createdBy: session.userId,
      });
      await docRepo.linkWork({ documentId, workItemId: item.id });
    }
  } catch (error) {
    reportActionFailure("createWorkFromActionsAction", error);
    return { error: "Could not create work from the selected actions." };
  }
  // The creator owns the new work, so no assignment notification is needed (emit() no-ops
  // for the actor anyway).
  revalidatePath(`/flow/docs/${documentId}`);
  revalidatePath(`/flow/projects/${projectId}`);
  return {};
}
