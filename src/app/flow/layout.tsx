import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { getAdminIntegrationStatus } from "@/lib/admin/env";
import { evaluateFlowAccess } from "@/lib/work/access-gate";
import { isWorkAppEnabled } from "@/lib/work/feature-flag";
import { getWorkSession } from "@/lib/work/session";
import { WorkShell, WorkUnavailable } from "@/components/work/work-shell";

export const metadata: Metadata = {
  title: "Taskcover Flow",
  robots: { index: false, follow: false },
};

export default async function FlowLayout({ children }: { children: React.ReactNode }) {
  if (!isWorkAppEnabled()) notFound();

  await connection();
  const databaseConfigured = getAdminIntegrationStatus().databaseConfigured;
  const session = databaseConfigured ? await getWorkSession() : null;

  const decision = evaluateFlowAccess({
    workAppEnabled: true,
    databaseConfigured,
    hasSession: Boolean(session),
  });

  if (decision.kind === "database-unavailable") return <WorkUnavailable />;
  if (decision.kind === "requires-session") redirect("/admin/login");

  return <WorkShell session={session!}>{children}</WorkShell>;
}
