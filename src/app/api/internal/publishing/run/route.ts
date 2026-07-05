import { NextResponse, type NextRequest } from "next/server";
import { constantTimeEqual } from "@/lib/admin/security";
import { getPublishScheduler } from "@/lib/admin/scheduler";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const configuredSecret = process.env.PUBLISH_CRON_SECRET;
  const providedSecret = request.headers.get("x-taskcover-publish-secret") ?? "";
  if (!configuredSecret || !constantTimeEqual(configuredSecret, providedSecret)) {
    return new Response(null, { status: 401, headers: { "cache-control": "no-store" } });
  }

  const result = await getPublishScheduler().publishDueArticles();
  return NextResponse.json(result, { headers: { "cache-control": "no-store" } });
}
