"use server";

import { redirect } from "next/navigation";
import { assertPermission } from "./permissions";
import { AdminRepository } from "./repository";
import { requireAdminSession } from "./session";
import { createArticleInputSchema } from "./validation";

export type ContentActionState = { error?: string };

export async function createArticleAction(_state: ContentActionState, formData: FormData): Promise<ContentActionState> {
  const session = await requireAdminSession();
  assertPermission(session.role, "article:create");
  const result = createArticleInputSchema.safeParse({
    creationKey: String(formData.get("creationKey") ?? ""),
    sharedSlug: String(formData.get("sharedSlug") ?? ""),
    category: String(formData.get("category") ?? ""),
  });
  if (!result.success) return { error: result.error.issues[0]?.message ?? "Invalid article details." };

  try {
    const created = await new AdminRepository().createArticleDraft({
      ...result.data,
      actorId: session.userId,
      author: session.displayName,
    });
    redirect(`/admin/insights/${created.articleId}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { error: error instanceof Error ? error.message : "Article could not be created." };
  }
}

function isRedirectError(error: unknown) {
  return typeof error === "object" && error !== null && "digest" in error && String((error as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT");
}
