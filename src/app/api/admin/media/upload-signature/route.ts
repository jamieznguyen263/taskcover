import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/admin/session";
import { getMediaProvider, validateUploadMetadata } from "@/lib/admin/media-provider";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await requireAdminSession();
  const body = await request.json().catch(() => null);
  try {
    validateUploadMetadata({ mimeType: String(body?.mimeType ?? ""), bytes: Number(body?.bytes ?? 0) });
    const signature = await getMediaProvider().createUploadSignature(session.userId);
    return NextResponse.json(signature, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload rejected." }, { status: 400 });
  }
}
