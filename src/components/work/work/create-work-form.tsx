"use client";

import { useActionState } from "react";
import { createWorkItemAction, type WorkActionState } from "@/lib/work/work-actions";
import { WORK_TYPES, WORK_TYPE_LABEL } from "@/lib/work/work-domain";

const INITIAL: WorkActionState = {};

export function CreateWorkForm({
  projectId,
  members,
}: {
  projectId: string;
  members: { userId: string; displayName: string }[];
}) {
  const [state, formAction, pending] = useActionState(createWorkItemAction, INITIAL);

  return (
    <form action={formAction} className="grid gap-3 sm:max-w-lg">
      <input type="hidden" name="projectId" value={projectId} />
      <label className="grid gap-1 text-sm font-medium text-graphite">
        Title
        <input
          name="title"
          type="text"
          required
          maxLength={200}
          className="min-h-10 rounded-lg border border-line bg-white px-3 text-sm text-graphite"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-graphite">
          Type
          <select
            name="type"
            defaultValue="task"
            className="min-h-10 rounded-lg border border-line bg-white px-2 text-sm text-graphite"
          >
            {WORK_TYPES.map((type) => (
              <option key={type} value={type}>
                {WORK_TYPE_LABEL[type]}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-graphite">
          Owner
          <select
            name="ownerId"
            required
            defaultValue=""
            className="min-h-10 rounded-lg border border-line bg-white px-2 text-sm text-graphite"
          >
            <option value="" disabled>
              Choose an owner…
            </option>
            {members.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.displayName}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="grid gap-1 text-sm font-medium text-graphite">
        Due date <span className="font-normal text-muted">(optional)</span>
        <input
          name="dueAt"
          type="date"
          className="min-h-10 rounded-lg border border-line bg-white px-3 text-sm text-graphite sm:max-w-[12rem]"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium text-graphite">
        Description <span className="font-normal text-muted">(optional)</span>
        <textarea
          name="description"
          rows={2}
          className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-graphite"
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
        {pending ? "Creating…" : "Create work"}
      </button>
    </form>
  );
}
