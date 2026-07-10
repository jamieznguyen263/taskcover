import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin/session";
import { getMediaProvider, validateUploadMetadata } from "@/lib/admin/media-provider";
import { assertPermission } from "@/lib/admin/permissions";

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Authentication required." }, { status: 401, headers: { "cache-control": "no-store" } });
  assertPermission(session.role, "media:upload");
  const body = (await request.json().catch(() => null)) as { mimeType?: unknown; bytes?: unknown } | null;
  try {
    validateUploadMetadata({ mimeType: String(body?.mimeType ?? ""), bytes: Number(body?.bytes ?? 0) });
    const signature = await getMediaProvider().createUploadSignature(session.userId);
    return NextResponse.json(signature, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload rejected." }, { status: 400 });
  }
}
