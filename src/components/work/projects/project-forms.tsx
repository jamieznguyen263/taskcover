"use client";

import { useActionState, useState } from "react";
import {
  addProjectMemberAction,
  createProjectAction,
  removeProjectMemberAction,
  type TeamActionState,
} from "@/lib/work/actions";

const INITIAL: TeamActionState = {};

export function CreateProjectForm({ clients }: { clients: { id: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState(createProjectAction, INITIAL);
  const [kind, setKind] = useState<"client" | "internal">("client");

  return (
    <form action={formAction} className="grid gap-3 sm:max-w-md">
      <label className="grid gap-1 text-sm font-medium text-graphite">
        Project name
        <input
          name="name"
          type="text"
          required
          maxLength={160}
          placeholder="e.g. Vivagen — SEO August 2026"
          className="min-h-10 rounded-lg border border-line bg-white px-3 text-sm text-graphite"
        />
      </label>
      <fieldset className="grid gap-1">
        <legend className="text-sm font-medium text-graphite">Kind</legend>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-graphite">
            <input
              type="radio"
              name="kind"
              value="client"
              checked={kind === "client"}
              onChange={() => setKind("client")}
            />
            Client project
          </label>
          <label className="flex items-center gap-2 text-sm text-graphite">
            <input
              type="radio"
              name="kind"
              value="internal"
              checked={kind === "internal"}
              onChange={() => setKind("internal")}
            />
            Internal initiative
          </label>
        </div>
      </fieldset>
      {kind === "client" ? (
        <label className="grid gap-1 text-sm font-medium text-graphite">
          Client
          <select
            name="clientId"
            required
            defaultValue=""
            className="min-h-10 rounded-lg border border-line bg-white px-2 text-sm text-graphite"
          >
            <option value="" disabled>
              Choose a client…
            </option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}
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
        {pending ? "Creating…" : "Create project"}
      </button>
    </form>
  );
}

export function AddProjectMemberForm({
  projectId,
  candidates,
}: {
  projectId: string;
  candidates: { userId: string; displayName: string }[];
}) {
  const [state, formAction, pending] = useActionState(addProjectMemberAction, INITIAL);

  if (candidates.length === 0) {
    return <p className="text-xs text-muted">Everyone is already on this project.</p>;
  }

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="projectId" value={projectId} />
      <label className="sr-only" htmlFor={`add-project-member-${projectId}`}>
        Add member
      </label>
      <select
        id={`add-project-member-${projectId}`}
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

export function RemoveProjectMemberButton({
  projectId,
  userId,
  displayName,
}: {
  projectId: string;
  userId: string;
  displayName: string;
}) {
  const [state, formAction, pending] = useActionState(removeProjectMemberAction, INITIAL);

  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        disabled={pending}
        aria-label={`Remove ${displayName} from project`}
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
