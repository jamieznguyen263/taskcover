import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin/session";
import { assertPermission } from "@/lib/admin/permissions";
import { AdminRepository } from "@/lib/admin/repository";
import { ContentConflictError, ContentStateError } from "@/lib/admin/content-model";
import { saveArticleInputSchema } from "@/lib/admin/validation";

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Authentication required." }, { status: 401, headers: { "cache-control": "no-store" } });
  try {
    assertPermission(session.role, "article:edit");
    const body = await request.json().catch(() => null);
    const parsed = saveArticleInputSchema.parse(body);
    const saved = await new AdminRepository().saveArticleDraft({ ...parsed, actorId: session.userId });
    return NextResponse.json({ ok: true, state: "saved", ...saved }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    const status = error instanceof ContentConflictError ? 409 : error instanceof ContentStateError ? 422 : error instanceof Error && error.message.startsWith("Forbidden") ? 403 : 400;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Save failed." }, { status, headers: { "cache-control": "no-store" } });
  }
}
