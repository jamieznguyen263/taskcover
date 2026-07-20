import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { resolveSafeRedirect } from "@/lib/admin/safe-redirect";
// Set by the Cloudflare Worker entry for /flow requests; absent under local `next dev`,
// where the `/flow` fallback below applies.
import { FLOW_PATHNAME_HEADER } from "@/lib/work/flow-pathname-header";
import { getAdminIntegrationStatus } from "@/lib/admin/env";
import { evaluateFlowAccess } from "@/lib/work/access-gate";
import { isWorkAppEnabled } from "@/lib/work/feature-flag";
import { resolveWorkSession, type WorkSessionResolution } from "@/lib/work/session";
import { WorkAccessDisabled, WorkShell, WorkUnavailable } from "@/components/work/work-shell";
import { ExternalAccessBlocked, ExternalWorkShell } from "@/components/work/external-shell";

export const metadata: Metadata = {
  title: "Taskcover Flow",
  robots: { index: false, follow: false },
};

export default async function FlowLayout({ children }: { children: React.ReactNode }) {
  if (!isWorkAppEnabled()) notFound();

  await connection();
  const databaseConfigured = getAdminIntegrationStatus().databaseConfigured;
  const resolution: WorkSessionResolution = databaseConfigured ? await resolveWorkSession() : { kind: "none" };

  const decision = evaluateFlowAccess({
    workAppEnabled: true,
    databaseConfigured,
    hasSession: resolution.kind !== "none",
    membershipStatus: resolution.kind === "disabled" ? "disabled" : "active",
  });

  if (decision.kind === "database-unavailable") return <WorkUnavailable />;
  // Carry the destination so signing in returns the visitor to the Flow page they asked for,
  // not the CMS dashboard and not Flow's Home.
  if (decision.kind === "requires-session") {
    const requestedPath = (await headers()).get(FLOW_PATHNAME_HEADER);
    const destination = resolveSafeRedirect(requestedPath, "/flow");
    redirect(`/admin/login?next=${encodeURIComponent(destination)}`);
  }
  if (resolution.kind === "external-blocked") return <ExternalAccessBlocked state={resolution.state} />;
  if (resolution.kind === "external") return <ExternalWorkShell session={resolution.session}>{children}</ExternalWorkShell>;
  if (decision.kind === "membership-disabled" || resolution.kind !== "active") return <WorkAccessDisabled />;

  return <WorkShell session={resolution.session}>{children}</WorkShell>;
}
