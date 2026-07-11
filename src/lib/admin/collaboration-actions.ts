"use server";

import { assertPermission } from "./permissions";
import { AdminRepository } from "./repository";
import { requireAdminSession } from "./session";
import { createCommentInputSchema, resolveCommentInputSchema, updateAssignmentInputSchema } from "./validation";

export type CollaborationActionResult = { error?: string; ok?: boolean };

export async function addCommentAction(input: unknown): Promise<CollaborationActionResult> {
  try {
    const session = await requireAdminSession();
    assertPermission(session.role, "article:comment");
    const parsed = createCommentInputSchema.parse(input);
    await new AdminRepository().createComment({ ...parsed, authorId: session.userId });
    return { ok: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Comment could not be added." };
  }
}

export async function resolveCommentAction(input: unknown): Promise<CollaborationActionResult> {
  try {
    const session = await requireAdminSession();
    assertPermission(session.role, "article:comment");
    const parsed = resolveCommentInputSchema.parse(input);
    await new AdminRepository().resolveComment({ commentId: parsed.commentId, actorId: session.userId, role: session.role });
    return { ok: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Comment could not be resolved." };
  }
}

export async function updateAssignmentAction(input: unknown): Promise<CollaborationActionResult> {
  try {
    const session = await requireAdminSession();
    assertPermission(session.role, "article:assign");
    const parsed = updateAssignmentInputSchema.parse(input);
    await new AdminRepository().updateAssignment({ ...parsed, actorId: session.userId });
    return { ok: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Assignment could not be updated." };
  }
}
