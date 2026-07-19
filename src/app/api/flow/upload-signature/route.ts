import { NextResponse, type NextRequest } from "next/server";
import { getMediaProvider } from "@/lib/admin/media-provider";
import { validateFlowFileUpload } from "@/lib/work/file-upload";
import { resolveWorkSession } from "@/lib/work/session";

/**
 * Issues a Cloudinary upload signature for a work-item attachment, reusing the CMS media
 * provider (folder + timestamp are signed). Internal, work:manage only — the browser uploads
 * directly to Cloudinary with the returned signature, then records the file via a server
 * action. Metadata is validated here before any signature is handed out.
 */
export async function POST(request: NextRequest) {
  const resolution = await resolveWorkSession();
  if (resolution.kind !== "active") {
    return NextResponse.json({ error: "Authentication required." }, { status: 401, headers: { "cache-control": "no-store" } });
  }

  const body = (await request.json().catch(() => null)) as { mimeType?: unknown; bytes?: unknown } | null;
  const validation = validateFlowFileUpload({ mimeType: String(body?.mimeType ?? ""), bytes: Number(body?.bytes ?? 0) });
  if (validation.error) {
    return NextResponse.json({ error: validation.error }, { status: 400, headers: { "cache-control": "no-store" } });
  }

  const signature = await getMediaProvider().createUploadSignature();
  if (signature.provider === "unavailable") {
    return NextResponse.json({ error: "File uploads are not configured." }, { status: 503, headers: { "cache-control": "no-store" } });
  }
  return NextResponse.json(signature, { headers: { "cache-control": "no-store" } });
}
