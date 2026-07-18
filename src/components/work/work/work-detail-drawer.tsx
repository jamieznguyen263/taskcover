"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { DetailDrawer } from "@/components/work/detail-drawer";
import type { WorkItemDetail } from "@/lib/work/work-repository";
import type { ActivityEntry, WorkComment } from "@/lib/work/discussion-repository";
import {
  addChecklistItemAction,
  addWorkCommentAction,
  toggleChecklistItemAction,
  updateWorkDetailsAction,
  updateWorkStatusAction,
  type WorkActionState,
} from "@/lib/work/work-actions";
import {
  WAITING_TARGET_LABEL,
  WAITING_TARGETS,
  WORK_STATUS_LABEL,
  WORK_STATUSES,
  WORK_TYPE_LABEL,
  WORK_TYPES,
} from "@/lib/work/work-domain";

const INITIAL: WorkActionState = {};

export function WorkDetailDrawer({
  projectId,
  item,
  comments,
  activity,
  members,
  canManage,
  canPostInternal,
}: {
  projectId: string;
  item: WorkItemDetail;
  comments: WorkComment[];
  activity: ActivityEntry[];
  members: { userId: string; displayName: string }[];
  canManage: boolean;
  canPostInternal: boolean;
}) {
  const router = useRouter();
  const close = () => router.push(`/flow/projects/${projectId}`, { scroll: false });

  return (
    <DetailDrawer open onClose={close} title={item.title} description={WORK_TYPE_LABEL[item.type]}>
      <div className="flex flex-col gap-6">
        {canManage ? <StatusSection projectId={projectId} item={item} /> : <ReadOnlyStatus item={item} />}

        {canManage ? (
          <DetailsSection projectId={projectId} item={item} members={members} />
        ) : (
          <ReadOnlyDetails item={item} />
        )}

        <ChecklistSection projectId={projectId} item={item} canManage={canManage} />

        {item.dependencyIds.length > 0 ? (
          <section>
            <h3 className="text-sm font-semibold text-graphite">Depends on</h3>
            <p className="mt-1 text-sm text-secondary">
              {item.dependencyIds.length} upstream item{item.dependencyIds.length === 1 ? "" : "s"}.
            </p>
          </section>
        ) : null}

        <CommentsSection
          projectId={projectId}
          workItemId={item.id}
          comments={comments}
          canPostInternal={canPostInternal}
        />

        <ActivitySection activity={activity} />
      </div>
    </DetailDrawer>
  );
}

function ReadOnlyStatus({ item }: { item: WorkItemDetail }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-graphite">Status</h3>
      <p className="mt-1 text-sm text-secondary">
        {WORK_STATUS_LABEL[item.status]}
        {item.waitingTarget ? ` — waiting on ${WAITING_TARGET_LABEL[item.waitingTarget]}` : ""}
      </p>
    </section>
  );
}

function StatusSection({ projectId, item }: { projectId: string; item: WorkItemDetail }) {
  const [state, formAction, pending] = useActionState(updateWorkStatusAction, INITIAL);

  return (
    <section>
      <h3 className="text-sm font-semibold text-graphite">Status</h3>
      <form action={formAction} className="mt-2 grid gap-2">
        <input type="hidden" name="workItemId" value={item.id} />
        <input type="hidden" name="projectId" value={projectId} />
        <div className="flex flex-wrap items-center gap-2">
          <select
            name="status"
            defaultValue={item.status}
            className="min-h-9 rounded-lg border border-line bg-white px-2 text-sm text-graphite"
          >
            {WORK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {WORK_STATUS_LABEL[status]}
              </option>
            ))}
          </select>
          <select
            name="waitingTarget"
            defaultValue={item.waitingTarget ?? ""}
            aria-label="Waiting for whom"
            className="min-h-9 rounded-lg border border-line bg-white px-2 text-sm text-graphite"
          >
            <option value="">Waiting for… (if Waiting)</option>
            {WAITING_TARGETS.map((target) => (
              <option key={target} value={target}>
                {WAITING_TARGET_LABEL[target]}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-9 items-center rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal disabled:opacity-60"
          >
            {pending ? "Saving…" : "Update"}
          </button>
        </div>
        <input
          name="waitingNote"
          type="text"
          defaultValue={item.waitingNote}
          placeholder="Waiting note (optional)"
          className="min-h-9 rounded-lg border border-line bg-white px-3 text-sm text-graphite"
        />
        {state.error ? (
          <p role="alert" className="text-sm text-red-600">
            {state.error}
          </p>
        ) : null}
      </form>
    </section>
  );
}

function ReadOnlyDetails({ item }: { item: WorkItemDetail }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-graphite">Details</h3>
      <dl className="mt-2 grid gap-1 text-sm">
        <div className="flex gap-2">
          <dt className="text-muted">Owner</dt>
          <dd className="text-graphite">{item.ownerName ?? "—"}</dd>
        </div>
        {item.reviewerName ? (
          <div className="flex gap-2">
            <dt className="text-muted">Reviewer</dt>
            <dd className="text-graphite">{item.reviewerName}</dd>
          </div>
        ) : null}
        {item.description ? <dd className="mt-1 text-secondary">{item.description}</dd> : null}
      </dl>
    </section>
  );
}

function DetailsSection({
  projectId,
  item,
  members,
}: {
  projectId: string;
  item: WorkItemDetail;
  members: { userId: string; displayName: string }[];
}) {
  const [state, formAction, pending] = useActionState(updateWorkDetailsAction, INITIAL);
  const dueValue = item.dueAt ? new Date(item.dueAt).toISOString().slice(0, 10) : "";

  return (
    <section>
      <h3 className="text-sm font-semibold text-graphite">Details</h3>
      <form action={formAction} className="mt-2 grid gap-2">
        <input type="hidden" name="workItemId" value={item.id} />
        <input type="hidden" name="projectId" value={projectId} />
        <input
          name="title"
          type="text"
          defaultValue={item.title}
          required
          maxLength={200}
          className="min-h-9 rounded-lg border border-line bg-white px-3 text-sm text-graphite"
        />
        <textarea
          name="description"
          defaultValue={item.description}
          rows={2}
          placeholder="Description"
          className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-graphite"
        />
        <div className="grid gap-2 sm:grid-cols-2">
          <select
            name="type"
            defaultValue={item.type}
            aria-label="Type"
            className="min-h-9 rounded-lg border border-line bg-white px-2 text-sm text-graphite"
          >
            {WORK_TYPES.map((type) => (
              <option key={type} value={type}>
                {WORK_TYPE_LABEL[type]}
              </option>
            ))}
          </select>
          <input
            name="dueAt"
            type="date"
            defaultValue={dueValue}
            aria-label="Due date"
            className="min-h-9 rounded-lg border border-line bg-white px-3 text-sm text-graphite"
          />
          <label className="grid gap-1 text-xs font-medium text-muted">
            Owner (accountable)
            <select
              name="ownerId"
              defaultValue={item.ownerId}
              required
              className="min-h-9 rounded-lg border border-line bg-white px-2 text-sm text-graphite"
            >
              {members.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.displayName}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-xs font-medium text-muted">
            Reviewer (optional)
            <select
              name="reviewerId"
              defaultValue={item.reviewerId ?? ""}
              className="min-h-9 rounded-lg border border-line bg-white px-2 text-sm text-graphite"
            >
              <option value="">None</option>
              {members.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.displayName}
                </option>
              ))}
            </select>
          </label>
        </div>
        {state.error ? (
          <p role="alert" className="text-sm text-red-600">
            {state.error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-9 w-fit items-center rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save details"}
        </button>
      </form>
    </section>
  );
}

function ChecklistSection({
  projectId,
  item,
  canManage,
}: {
  projectId: string;
  item: WorkItemDetail;
  canManage: boolean;
}) {
  const [addState, addAction, addPending] = useActionState(addChecklistItemAction, INITIAL);
  const done = item.checklist.filter((entry) => entry.isDone).length;

  return (
    <section>
      <h3 className="text-sm font-semibold text-graphite">
        Checklist{" "}
        {item.checklist.length > 0 ? (
          <span className="font-normal text-muted">
            ({done}/{item.checklist.length})
          </span>
        ) : null}
      </h3>
      <ul className="mt-2 grid gap-1">
        {item.checklist.map((entry) => (
          <li key={entry.id} className="flex items-center gap-2 text-sm">
            {canManage ? (
              <form action={toggleChecklistItemAction}>
                <input type="hidden" name="checklistItemId" value={entry.id} />
                <input type="hidden" name="projectId" value={projectId} />
                <input type="hidden" name="isDone" value={(!entry.isDone).toString()} />
                <button
                  type="submit"
                  aria-label={entry.isDone ? `Mark ${entry.label} not done` : `Mark ${entry.label} done`}
                  className={`flex h-5 w-5 items-center justify-center rounded border ${
                    entry.isDone ? "border-emerald-500 bg-emerald-500 text-white" : "border-line bg-white"
                  }`}
                >
                  {entry.isDone ? "✓" : ""}
                </button>
              </form>
            ) : (
              <span
                aria-hidden="true"
                className={`flex h-5 w-5 items-center justify-center rounded border ${
                  entry.isDone ? "border-emerald-500 bg-emerald-500 text-white" : "border-line bg-white"
                }`}
              >
                {entry.isDone ? "✓" : ""}
              </span>
            )}
            <span className={entry.isDone ? "text-muted line-through" : "text-graphite"}>{entry.label}</span>
          </li>
        ))}
        {item.checklist.length === 0 ? <li className="text-sm text-muted">No checklist items.</li> : null}
      </ul>
      {canManage ? (
        <form action={addAction} className="mt-2 flex items-center gap-2">
          <input type="hidden" name="workItemId" value={item.id} />
          <input type="hidden" name="projectId" value={projectId} />
          <input
            name="label"
            type="text"
            required
            placeholder="Add a checklist item"
            aria-label="Checklist item label"
            className="min-h-9 flex-1 rounded-lg border border-line bg-white px-3 text-sm text-graphite"
          />
          <button
            type="submit"
            disabled={addPending}
            className="inline-flex min-h-9 items-center rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal disabled:opacity-60"
          >
            Add
          </button>
        </form>
      ) : null}
      {addState.error ? (
        <p role="alert" className="mt-1 text-sm text-red-600">
          {addState.error}
        </p>
      ) : null}
    </section>
  );
}

function CommentsSection({
  projectId,
  workItemId,
  comments,
  canPostInternal,
}: {
  projectId: string;
  workItemId: string;
  comments: WorkComment[];
  canPostInternal: boolean;
}) {
  const [state, formAction, pending] = useActionState(addWorkCommentAction, INITIAL);

  return (
    <section>
      <h3 className="text-sm font-semibold text-graphite">Discussion</h3>
      <ul className="mt-2 grid gap-2">
        {comments.map((comment) => (
          <li
            key={comment.id}
            className={`rounded-lg border p-3 text-sm ${
              comment.visibility === "internal"
                ? "border-amber-200 bg-amber-50"
                : "border-line-soft bg-surface-soft"
            }`}
          >
            <p className="flex items-center gap-2 text-xs text-muted">
              <span className="font-medium text-graphite">{comment.authorName ?? "Unknown"}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                  comment.visibility === "internal" ? "bg-amber-200 text-amber-800" : "bg-surface-tint text-brand-teal"
                }`}
              >
                {comment.visibility === "internal" ? "Internal" : "Shared"}
              </span>
              <span>{new Date(comment.createdAt).toLocaleString()}</span>
            </p>
            <p className="mt-1 whitespace-pre-wrap text-graphite">{comment.body}</p>
          </li>
        ))}
        {comments.length === 0 ? <li className="text-sm text-muted">No comments yet.</li> : null}
      </ul>
      <form action={formAction} className="mt-2 grid gap-2">
        <input type="hidden" name="workItemId" value={workItemId} />
        <input type="hidden" name="projectId" value={projectId} />
        <textarea
          name="body"
          rows={2}
          required
          placeholder="Write a comment…"
          aria-label="Comment"
          className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-graphite"
        />
        <div className="flex flex-wrap items-center gap-3">
          {canPostInternal ? (
            <label className="flex items-center gap-2 text-sm text-graphite">
              <input type="checkbox" name="visibility" value="internal" defaultChecked className="h-4 w-4 rounded border-line" />
              Internal note (hidden from external collaborators)
            </label>
          ) : (
            <span className="text-xs text-muted">Comments you post are shared with collaborators on this work.</span>
          )}
          <button
            type="submit"
            disabled={pending}
            className="ml-auto inline-flex min-h-9 items-center rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal disabled:opacity-60"
          >
            {pending ? "Posting…" : "Post"}
          </button>
        </div>
        {state.error ? (
          <p role="alert" className="text-sm text-red-600">
            {state.error}
          </p>
        ) : null}
      </form>
    </section>
  );
}

function ActivitySection({ activity }: { activity: ActivityEntry[] }) {
  if (activity.length === 0) return null;
  return (
    <section>
      <h3 className="text-sm font-semibold text-graphite">Activity</h3>
      <ol className="mt-2 grid gap-1.5">
        {activity.map((entry) => (
          <li key={entry.id} className="text-xs text-muted">
            <span className="font-medium text-secondary">{entry.actorName ?? "System"}</span> {entry.summary}
            <span className="ml-1">· {new Date(entry.createdAt).toLocaleString()}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
