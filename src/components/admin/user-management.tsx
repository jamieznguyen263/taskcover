"use client";

import { useActionState } from "react";
import { createInviteAction, revokeInviteAction, updateUserAccessAction, type InviteState } from "@/lib/admin/actions";

type UserRow = { id: string; email: string; displayName: string; role: "admin" | "editor"; status: "invited" | "active" | "disabled"; lastLoginAt: string | null; createdAt: string };
type InviteRow = { id: string; email: string; role: "admin" | "editor"; expiresAt: string };

export function UserManagement({ users, invites }: { users: UserRow[]; invites: InviteRow[] }) {
  const [state, action, pending] = useActionState<InviteState, FormData>(createInviteAction, {});
  return <>
    <form action={action} className="mb-4 grid gap-3 rounded-xl border border-line bg-white p-4 sm:grid-cols-[1fr_auto_auto]">
      <label className="grid gap-1 text-sm font-medium">Email<input name="email" type="email" required className="min-h-10 rounded-lg border border-line px-3" /></label>
      <label className="grid gap-1 text-sm font-medium">Role<select name="role" className="min-h-10 rounded-lg border border-line px-3"><option value="editor">Editor</option><option value="admin">Admin</option></select></label>
      <button disabled={pending} className="self-end rounded-lg bg-brand-teal px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Creating…" : "Create invite"}</button>
      {state.error ? <p role="alert" className="text-sm text-red-700 sm:col-span-3">{state.error}</p> : null}
      {state.inviteUrl ? <label className="grid gap-1 text-sm sm:col-span-3">Single-use invitation URL<input readOnly value={state.inviteUrl} className="min-h-10 rounded-lg border border-line bg-surface-soft px-3" /><span className="text-xs text-muted">Copy securely now. Only its hash is stored and the URL is not shown again.</span></label> : null}
    </form>
    {invites.length ? <section className="mb-4 rounded-xl border border-line bg-white p-4"><h2 className="font-semibold">Pending invitations</h2><ul className="mt-3 grid gap-2">{invites.map((invite) => <li key={invite.id} className="flex flex-wrap items-center justify-between gap-3 text-sm"><span>{invite.email} · {invite.role} · expires {new Date(invite.expiresAt).toLocaleString()}</span><form action={revokeInviteAction}><input type="hidden" name="inviteId" value={invite.id} /><button className="rounded-lg border border-line px-3 py-2">Revoke</button></form></li>)}</ul></section> : null}
    <div className="overflow-x-auto rounded-xl border border-line bg-white">
      <table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-surface-tint text-xs uppercase tracking-wide text-muted"><tr><th className="px-4 py-3">User</th><th>Role</th><th>Status</th><th>Last login</th><th>Created</th><th>Access</th></tr></thead>
        <tbody className="divide-y divide-line-soft">{users.map((user) => <tr key={user.id}><td className="px-4 py-3"><strong>{user.displayName}</strong><br /><span className="text-muted">{user.email}</span></td><td>{user.role}</td><td>{user.status}</td><td>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never"}</td><td>{new Date(user.createdAt).toLocaleDateString()}</td><td><form action={updateUserAccessAction} className="flex gap-2"><input type="hidden" name="userId" value={user.id} /><select name="role" defaultValue={user.role} className="rounded border border-line px-2"><option value="editor">Editor</option><option value="admin">Admin</option></select><select name="status" defaultValue={user.status === "disabled" ? "disabled" : "active"} className="rounded border border-line px-2"><option value="active">Active</option><option value="disabled">Disabled</option></select><button className="rounded border border-line px-3 py-2">Update</button></form></td></tr>)}</tbody>
      </table>
    </div>
  </>;
}
