import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getAdminIntegrationStatus } from "@/lib/admin/env";
import { getAdminSession } from "@/lib/admin/session";
import { resolveSafeRedirect } from "@/lib/admin/safe-redirect";
import { LoginForm } from "@/components/admin/login-form";
import { AdminUnavailable } from "@/components/admin/admin-shell";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  await connection();
  const status = getAdminIntegrationStatus();
  if (!status.databaseConfigured) return <AdminUnavailable />;
  // `next` carries the page the visitor originally asked for (e.g. /flow); it is validated
  // to same-origin paths so it can never bounce someone off-site.
  const { next } = await searchParams;
  const destination = resolveSafeRedirect(next);
  const session = await getAdminSession();
  if (session) redirect(destination);

  return (
    <main data-admin-root className="min-h-screen bg-surface-soft px-5 py-12">
      <div className="mx-auto max-w-md rounded-xl border border-line bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">Taskcover Admin</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-graphite">Sign in</h1>
        <p className="mt-2 text-sm leading-6 text-secondary">Email/password access only. Public registration is disabled.</p>
        <div className="mt-6">
          <LoginForm next={destination} />
        </div>
      </div>
    </main>
  );
}
