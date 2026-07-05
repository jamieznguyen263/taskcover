import { NextResponse } from "next/server";
import { submitLead } from "@/lib/leads/service";

export const dynamic = "force-dynamic";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("cf-connecting-ip") ?? "unknown";
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await submitLead({ payload, ip: clientIp(request) });
    return NextResponse.json(result, {
      status: result.status === "success" ? 200 : result.status === "validation-error" ? 400 : 200,
    });
  } catch {
    return NextResponse.json(
      { status: "temporary-error", messageKey: "temporary-error" },
      { status: 200 }
    );
  }
}
