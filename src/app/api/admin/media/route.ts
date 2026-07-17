import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin/session";
import { assertPermission, isCmsRole } from "@/lib/admin/permissions";
import { AdminRepository } from "@/lib/admin/repository";

const recordSchema = z.object({
  provider: z.literal("cloudinary"),
  providerAssetId: z.string().min(1),
  secureUrl: z.string().url(),
  deliveryUrl: z.string().url().optional(),
  altText: z.string().max(500).optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  bytes: z.number().int().positive().optional(),
  format: z.string().max(20).optional(),
  folder: z.string().max(200).optional(),
}).strict();

export async function GET() {
  const session = await getAdminSession();
  if (!session || !isCmsRole(session.role)) return NextResponse.json({ error: "Authentication required." }, { status: 401, headers: { "cache-control": "no-store" } });
  const assets = await new AdminRepository().listMedia();
  return NextResponse.json(
    { assets: assets.map((a) => ({ id: a.id, url: a.deliveryUrl || a.secureUrl, altText: a.altText, width: a.width, height: a.height, format: a.format })) },
    { headers: { "cache-control": "no-store" } }
  );
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session || !isCmsRole(session.role)) return NextResponse.json({ error: "Authentication required." }, { status: 401, headers: { "cache-control": "no-store" } });
  try {
    assertPermission(session.role, "media:upload");
    const parsed = recordSchema.parse(await request.json());
    const asset = await new AdminRepository().recordMediaAsset({
      ...parsed,
      deliveryUrl: parsed.deliveryUrl ?? parsed.secureUrl,
      uploadedBy: session.userId,
    });
    return NextResponse.json(
      { id: asset.id, url: asset.deliveryUrl || asset.secureUrl, width: asset.width, height: asset.height },
      { headers: { "cache-control": "no-store" } }
    );
  } catch (error) {
    const status = error instanceof Error && error.message.startsWith("Forbidden") ? 403 : 400;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to record media." }, { status, headers: { "cache-control": "no-store" } });
  }
}
