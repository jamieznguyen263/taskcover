import { NextResponse, type NextRequest } from "next/server";
import { SearchRepository } from "@/lib/work/search-repository";
import { resolveWorkSession } from "@/lib/work/session";

/**
 * Command-palette live search. Internal-only: `resolveWorkSession` must return an active
 * (internal) session, and `SearchRepository` gates each result type by capability, so the
 * response can never contain a record the caller isn't allowed to open. No-store — results
 * are per-user and must not be cached by any shared layer.
 */
export async function GET(request: NextRequest) {
  const resolution = await resolveWorkSession();
  if (resolution.kind !== "active") {
    return NextResponse.json({ results: [] }, { status: 200, headers: { "cache-control": "no-store" } });
  }

  const query = (request.nextUrl.searchParams.get("q") ?? "").trim();
  if (query.length < 2) {
    return NextResponse.json({ results: [] }, { headers: { "cache-control": "no-store" } });
  }

  const results = await new SearchRepository().search({
    query,
    accessLevel: resolution.session.accessLevel,
    limitPerType: 4,
  });
  return NextResponse.json({ results }, { headers: { "cache-control": "no-store" } });
}
