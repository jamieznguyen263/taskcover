import { connection } from "next/server";
import { AdminPageHeader, AdminShell, AdminUnavailable } from "@/components/admin/admin-shell";
import { createInviteAction } from "@/lib/admin/actions";
import { getAdminIntegrationStatus } from "@/lib/admin/env";
import { assertPermission } from "@/lib/admin/permissions";
import { AdminRepository } from "@/lib/admin/repository";
import { requireAdminSession } from "@/lib/admin/session";

export default async function AdminUsersPage() {
  await connection();
  if (!getAdminIntegrationStatus().databaseConfigured) return <AdminUnavailable />;
  const session = await requireAdminSession();
  assertPermission(session.role, "users:manage");
  const users = await new AdminRepository().listUsers();

  return (
    <AdminShell session={session}>
      <AdminPageHeader eyebrow="Users" title="Admin and Editor users" description="Create single-use invitation links manually, change roles, disable accounts, and revoke sessions." />
      <form action={createInviteAction} className="mb-4 grid gap-3 rounded-xl border border-line bg-white p-4 sm:grid-cols-[1fr_auto_auto]">
        <label className="grid gap-1 text-sm font-medium text-graphite">Email<input name="email" type="email" required className="min-h-10 rounded-lg border border-line px-3" /></label>
        <label className="grid gap-1 text-sm font-medium text-graphite">Role<select name="role" className="min-h-10 rounded-lg border border-line px-3"><option value="editor">Editor</option><option value="admin">Admin</option></select></label>
        <button className="self-end rounded-lg bg-brand-teal px-4 py-2 text-sm font-semibold text-white">Create invite</button>
      </form>
      <div className="overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-surface-tint text-xs uppercase tracking-wide text-muted"><tr><th className="px-4 py-3">User</th><th>Role</th><th>Status</th><th>Last login</th><th>Created</th></tr></thead>
          <tbody className="divide-y divide-line-soft">
            {users.map((user) => (
              <tr key={user.id}><td className="px-4 py-3"><strong>{user.displayName}</strong><br /><span className="text-muted">{user.email}</span></td><td>{user.role}</td><td>{user.status}</td><td>{user.lastLoginAt?.toLocaleString() ?? "Never"}</td><td>{user.createdAt.toLocaleDateString()}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
