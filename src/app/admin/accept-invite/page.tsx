import { connection } from "next/server";
import { AdminUnavailable } from "@/components/admin/admin-shell";
import { AcceptInviteForm } from "@/components/admin/login-form";
import { getAdminIntegrationStatus } from "@/lib/admin/env";

export default async function AcceptInvitePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  await connection();
  if (!getAdminIntegrationStatus().databaseConfigured) return <AdminUnavailable />;
  const token = (await searchParams).token ?? "";

  return (
    <main data-admin-root className="min-h-screen bg-surface-soft px-5 py-12">
      <div className="mx-auto max-w-md rounded-xl border border-line bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">Invitation</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-graphite">Create your Admin account</h1>
        <p className="mt-2 text-sm leading-6 text-secondary">Invitation tokens are single-use and expire automatically.</p>
        <div className="mt-6">
          <AcceptInviteForm token={token} />
        </div>
      </div>
    </main>
  );
}
