import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin/session";
import { isCmsRole } from "@/lib/admin/permissions";
import { AdminRepository } from "@/lib/admin/repository";
import { ContentConflictError, ContentStateError } from "@/lib/admin/content-model";
import { getAdminIntegrationStatus } from "@/lib/admin/env";

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session || !isCmsRole(session.role)) return NextResponse.json({ error: "Authentication required." }, { status: 401, headers: { "cache-control": "no-store" } });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  try {
    const repo = new AdminRepository();
    const articleId = String(body.articleId ?? "");
    const expectedVersion = Number(body.expectedVersion);
    if (body.revisionId) {
      const restored = await repo.restorePublishedRevision({
        articleId,
        revisionId: String(body.revisionId),
        expectedVersion,
        actorId: session.userId,
        role: session.role,
        note: typeof body.note === "string" ? body.note : undefined,
      });
      return NextResponse.json({ ok: true, ...restored }, { headers: { "cache-control": "no-store" } });
    }
    const changed = await repo.transitionArticle({
      articleId,
      expectedVersion,
      to: String(body.to ?? "") as never,
      note: typeof body.note === "string" ? body.note : undefined,
      scheduledAt: typeof body.scheduledAt === "string" ? body.scheduledAt : undefined,
      actorId: session.userId,
      role: session.role,
      schedulerConfigured: getAdminIntegrationStatus().schedulerConfigured,
    });
    return NextResponse.json({ ok: true, ...changed }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    const status = error instanceof ContentConflictError ? 409 : error instanceof ContentStateError ? 422 : error instanceof Error && error.message.startsWith("Forbidden") ? 403 : 400;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Workflow action failed." }, { status, headers: { "cache-control": "no-store" } });
  }
}
