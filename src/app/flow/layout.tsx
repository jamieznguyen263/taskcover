import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
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
  if (decision.kind === "requires-session") redirect("/admin/login");
  if (resolution.kind === "external-blocked") return <ExternalAccessBlocked state={resolution.state} />;
  if (resolution.kind === "external") return <ExternalWorkShell session={resolution.session}>{children}</ExternalWorkShell>;
  if (decision.kind === "membership-disabled" || resolution.kind !== "active") return <WorkAccessDisabled />;

  return <WorkShell session={resolution.session}>{children}</WorkShell>;
}
