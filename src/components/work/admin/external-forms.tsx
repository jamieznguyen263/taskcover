"use client";

import { useActionState } from "react";
import {
  createExternalInviteAction,
  revokeExternalMembershipAction,
  type ExternalInviteState,
  type TeamActionState,
} from "@/lib/work/actions";

const INVITE_INITIAL: ExternalInviteState = {};
const REVOKE_INITIAL: TeamActionState = {};

export function InviteExternalForm() {
  const [state, formAction, pending] = useActionState(createExternalInviteAction, INVITE_INITIAL);

  return (
    <form action={formAction} className="grid gap-3 sm:max-w-md">
      <label className="grid gap-1 text-sm font-medium text-graphite">
        Email
        <input
          name="email"
          type="email"
          required
          className="min-h-10 rounded-lg border border-line bg-white px-3 text-sm text-graphite"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium text-graphite">
        Collaborator type
        <select
          name="kind"
          required
          defaultValue="freelancer"
          className="min-h-10 rounded-lg border border-line bg-white px-2 text-sm text-graphite"
        >
          <option value="freelancer">Freelancer</option>
          <option value="partner_manager">Partner manager</option>
          <option value="partner_member">Partner member</option>
          <option value="read_only_guest">Read-only guest</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm font-medium text-graphite">
        Organization <span className="font-normal text-muted">(optional, for partners)</span>
        <input
          name="organizationName"
          type="text"
          maxLength={120}
          className="min-h-10 rounded-lg border border-line bg-white px-3 text-sm text-graphite"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium text-graphite">
        Access expires on <span className="font-normal text-muted">(optional)</span>
        <input
          name="accessExpiryAt"
          type="date"
          className="min-h-10 rounded-lg border border-line bg-white px-3 text-sm text-graphite"
        />
      </label>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm font-medium text-graphite">
          <input name="canDownload" type="checkbox" className="h-4 w-4 rounded border-line" />
          Can download files
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-graphite">
          <input name="canUpload" type="checkbox" className="h-4 w-4 rounded border-line" />
          Can upload files
        </label>
      </div>
      {state.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
      {state.inviteUrl ? (
        <div className="rounded-lg border border-line bg-surface-soft p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Invite link (share securely)</p>
          <p className="mt-1 break-all text-sm text-graphite">{state.inviteUrl}</p>
        </div>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-10 w-fit items-center rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create invitation"}
      </button>
    </form>
  );
}

export function RevokeExternalButton({ membershipId, displayName }: { membershipId: string; displayName: string }) {
  const [state, formAction, pending] = useActionState(revokeExternalMembershipAction, REVOKE_INITIAL);

  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="membershipId" value={membershipId} />
      <button
        type="submit"
        disabled={pending}
        aria-label={`Revoke access for ${displayName}`}
        className="rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-medium text-secondary hover:text-red-600 disabled:opacity-60"
      >
        {pending ? "Revoking…" : "Revoke"}
      </button>
      {state.error ? (
        <span role="alert" className="ml-2 text-xs text-red-600">
          {state.error}
        </span>
      ) : null}
    </form>
  );
}
