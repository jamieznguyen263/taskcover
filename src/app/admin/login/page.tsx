import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getAdminIntegrationStatus } from "@/lib/admin/env";
import { getAdminSession } from "@/lib/admin/session";
import { LoginForm } from "@/components/admin/login-form";
import { AdminUnavailable } from "@/components/admin/admin-shell";

export default async function AdminLoginPage() {
  await connection();
  const status = getAdminIntegrationStatus();
  if (!status.databaseConfigured) return <AdminUnavailable />;
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <div data-admin-root className="min-h-screen bg-surface-soft px-5 py-12">
      <div className="mx-auto max-w-md rounded-xl border border-line bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">Taskcover Admin</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-graphite">Sign in</h1>
        <p className="mt-2 text-sm leading-6 text-secondary">Email/password access only. Public registration is disabled.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
