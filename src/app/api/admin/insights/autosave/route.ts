import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/admin/session";
import { normalizeTiptapToInsightBlocks } from "@/lib/admin/normalization";

export async function POST(request: NextRequest) {
  const session = await requireAdminSession();
  if (!["admin", "editor"].includes(session.role)) return new Response(null, { status: 403 });
  const body = (await request.json().catch(() => null)) as { editorDocument?: unknown } | null;
  if (!body?.editorDocument) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const blocks = normalizeTiptapToInsightBlocks(body.editorDocument);
  return NextResponse.json({ ok: true, blocks: blocks.length, state: "saved" }, { headers: { "cache-control": "no-store" } });
}
