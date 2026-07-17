"use client";

import { useActionState } from "react";
import {
  addTeamMemberAction,
  createTeamAction,
  removeTeamMemberAction,
  type TeamActionState,
} from "@/lib/work/actions";

const INITIAL_STATE: TeamActionState = {};

export function CreateTeamForm() {
  const [state, formAction, pending] = useActionState(createTeamAction, INITIAL_STATE);

  return (
    <form action={formAction} className="grid gap-3 sm:max-w-md">
      <label className="grid gap-1 text-sm font-medium text-graphite">
        Team name
        <input
          name="name"
          type="text"
          required
          maxLength={80}
          className="min-h-10 rounded-lg border border-line bg-white px-3 text-sm text-graphite"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium text-graphite">
        Description <span className="font-normal text-muted">(optional)</span>
        <input
          name="description"
          type="text"
          maxLength={280}
          className="min-h-10 rounded-lg border border-line bg-white px-3 text-sm text-graphite"
        />
      </label>
      {state.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-10 w-fit items-center rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create team"}
      </button>
    </form>
  );
}

export function AddTeamMemberForm({
  teamId,
  candidates,
}: {
  teamId: string;
  candidates: { userId: string; displayName: string }[];
}) {
  const [state, formAction, pending] = useActionState(addTeamMemberAction, INITIAL_STATE);

  if (candidates.length === 0) {
    return <p className="text-xs text-muted">Everyone is already on this team.</p>;
  }

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="teamId" value={teamId} />
      <label className="sr-only" htmlFor={`add-member-${teamId}`}>
        Add member
      </label>
      <select
        id={`add-member-${teamId}`}
        name="userId"
        required
        defaultValue=""
        className="min-h-9 rounded-lg border border-line bg-white px-2 text-sm text-graphite"
      >
        <option value="" disabled>
          Choose a member…
        </option>
        {candidates.map((candidate) => (
          <option key={candidate.userId} value={candidate.userId}>
            {candidate.displayName}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-9 items-center rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add"}
      </button>
      {state.error ? (
        <p role="alert" className="w-full text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}

export function RemoveTeamMemberButton({
  teamId,
  userId,
  displayName,
}: {
  teamId: string;
  userId: string;
  displayName: string;
}) {
  const [state, formAction, pending] = useActionState(removeTeamMemberAction, INITIAL_STATE);

  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="teamId" value={teamId} />
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        disabled={pending}
        aria-label={`Remove ${displayName} from team`}
        className="rounded px-1.5 text-xs font-medium text-muted hover:text-red-600 disabled:opacity-60"
      >
        Remove
      </button>
      {state.error ? (
        <span role="alert" className="ml-2 text-xs text-red-600">
          {state.error}
        </span>
      ) : null}
    </form>
  );
}
