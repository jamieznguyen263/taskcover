import { connection } from "next/server";
import { AdminPageHeader, AdminShell, AdminUnavailable } from "@/components/admin/admin-shell";
import { UserManagement } from "@/components/admin/user-management";
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
  const invites = await new AdminRepository().listPendingInvites();

  return (
    <AdminShell session={session}>
      <AdminPageHeader eyebrow="Users" title="Admin and Editor users" description="Create single-use invitation links manually, change roles, disable accounts, and revoke sessions." />
      <UserManagement users={users.map((user) => ({ ...user, lastLoginAt: user.lastLoginAt?.toISOString() ?? null, createdAt: user.createdAt.toISOString() }))} invites={invites.map((invite) => ({ ...invite, expiresAt: invite.expiresAt.toISOString() }))} />
    </AdminShell>
  );
}
