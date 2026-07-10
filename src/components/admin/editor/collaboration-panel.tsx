"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, MessageSquare, Send } from "lucide-react";
import type { AdminRole } from "@/lib/admin/permissions";
import type { ArticleAssignment, ContentComment, WorkflowEventEntry } from "@/lib/admin/repository";
import { addCommentAction, resolveCommentAction, updateAssignmentAction } from "@/lib/admin/collaboration-actions";
import { Field, SelectInput, SmallButton, TextArea, TextInput } from "./controls";

type AssignableUser = { id: string; displayName: string; role: AdminRole };

export function CollaborationPanel({
  articleGroupId,
  role,
  assignment,
  users,
  comments,
  events,
}: {
  articleGroupId: string;
  role: AdminRole;
  assignment: ArticleAssignment;
  users: AssignableUser[];
  comments: ContentComment[];
  events: WorkflowEventEntry[];
}) {
  return (
    <div className="grid gap-5">
      <AssignmentSection articleGroupId={articleGroupId} role={role} assignment={assignment} users={users} />
      <CommentsSection articleGroupId={articleGroupId} role={role} comments={comments} />
      <ActivitySection events={events} />
    </div>
  );
}

function AssignmentSection({ articleGroupId, role, assignment, users }: { articleGroupId: string; role: AdminRole; assignment: ArticleAssignment; users: AssignableUser[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const canAssign = role === "admin";
  const nameOf = (id: string | null) => users.find((user) => user.id === id)?.displayName ?? "Unassigned";

  const userOptions = [{ value: "", label: "Unassigned" }, ...users.map((user) => ({ value: user.id, label: `${user.displayName} (${user.role})` }))];

  const submit = (patch: Partial<{ ownerId: string | null; assigneeId: string | null; reviewerId: string | null; dueDate: string | null; priority: "low" | "normal" | "high" | "urgent" }>) => {
    startTransition(async () => {
      const result = await updateAssignmentAction({ articleGroupId, ...patch });
      if (result.error) setError(result.error);
      else {
        setError("");
        router.refresh();
      }
    });
  };

  return (
    <section className="grid gap-3">
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Assignment</h3>
      {error ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700">{error}</p> : null}
      {canAssign ? (
        <div className="grid gap-3">
          <Field label="Owner">
            <SelectInput value={assignment.ownerId ?? ""} disabled={pending} onChange={(value) => submit({ ownerId: value || null })} options={userOptions} />
          </Field>
          <Field label="Assignee">
            <SelectInput value={assignment.assigneeId ?? ""} disabled={pending} onChange={(value) => submit({ assigneeId: value || null })} options={userOptions} />
          </Field>
          <Field label="Reviewer">
            <SelectInput value={assignment.reviewerId ?? ""} disabled={pending} onChange={(value) => submit({ reviewerId: value || null })} options={userOptions} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Due date">
              <TextInput
                type="date"
                value={assignment.dueDate ? assignment.dueDate.slice(0, 10) : ""}
                disabled={pending}
                onChange={(value) => submit({ dueDate: value ? new Date(`${value}T12:00:00Z`).toISOString() : null })}
              />
            </Field>
            <Field label="Priority">
              <SelectInput
                value={assignment.priority}
                disabled={pending}
                onChange={(priority) => submit({ priority })}
                options={[
                  { value: "low", label: "Low" },
                  { value: "normal", label: "Normal" },
                  { value: "high", label: "High" },
                  { value: "urgent", label: "Urgent" },
                ] as const}
              />
            </Field>
          </div>
        </div>
      ) : (
        <dl className="grid gap-1.5 rounded-xl border border-line bg-white p-3 text-sm">
          <Row label="Owner" value={nameOf(assignment.ownerId)} />
          <Row label="Assignee" value={nameOf(assignment.assigneeId)} />
          <Row label="Reviewer" value={nameOf(assignment.reviewerId)} />
          <Row label="Due" value={assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "No due date"} />
          <Row label="Priority" value={assignment.priority} />
        </dl>
      )}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-graphite">{value}</dd>
    </div>
  );
}

function CommentsSection({ articleGroupId, role, comments }: { articleGroupId: string; role: AdminRole; comments: ContentComment[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [body, setBody] = useState("");
  const [kind, setKind] = useState<"comment" | "change-request">("comment");
  const [error, setError] = useState("");
  const [showResolved, setShowResolved] = useState(false);

  const visible = showResolved ? comments : comments.filter((comment) => !comment.resolvedAt);
  const resolvedCount = comments.filter((comment) => comment.resolvedAt).length;

  const submit = () => {
    if (!body.trim()) return;
    startTransition(async () => {
      const result = await addCommentAction({ articleGroupId, kind, body });
      if (result.error) setError(result.error);
      else {
        setBody("");
        setError("");
        router.refresh();
      }
    });
  };

  return (
    <section className="grid gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">
          <MessageSquare className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
          Comments ({visible.length})
        </h3>
        {resolvedCount > 0 ? (
          <button type="button" onClick={() => setShowResolved((value) => !value)} className="text-xs font-medium text-brand-teal">
            {showResolved ? "Hide resolved" : `Show ${resolvedCount} resolved`}
          </button>
        ) : null}
      </div>
      {error ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700">{error}</p> : null}
      <div className="grid gap-2">
        <TextArea value={body} onChange={setBody} rows={3} placeholder="Leave a note for the team…" disabled={pending} />
        <div className="flex items-center justify-between gap-2">
          {role === "admin" ? (
            <SelectInput
              value={kind}
              onChange={setKind}
              disabled={pending}
              options={[
                { value: "comment", label: "Comment" },
                { value: "change-request", label: "Change request" },
              ] as const}
            />
          ) : <span />}
          <SmallButton tone="primary" onClick={submit} disabled={pending || !body.trim()}>
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            Post
          </SmallButton>
        </div>
      </div>
      <div className="grid gap-2">
        {visible.length === 0 ? <p className="text-xs text-muted">No open comments.</p> : null}
        {visible.map((comment) => (
          <div key={comment.id} className={`grid gap-1 rounded-xl border p-3 ${comment.kind === "change-request" && !comment.resolvedAt ? "border-amber-200 bg-amber-50/60" : "border-line bg-white"} ${comment.resolvedAt ? "opacity-70" : ""}`}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-graphite">
                {comment.authorName ?? "Removed user"}
                <span className="ml-2 font-normal text-muted">{comment.kind.replaceAll("-", " ")} · {comment.createdAt.toLocaleString()}</span>
              </p>
              {!comment.resolvedAt ? (
                <SmallButton
                  ariaLabel="Resolve comment"
                  onClick={() =>
                    startTransition(async () => {
                      const result = await resolveCommentAction({ commentId: comment.id });
                      if (result.error) setError(result.error);
                      else router.refresh();
                    })
                  }
                  disabled={pending}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Resolve
                </SmallButton>
              ) : (
                <span className="text-[11px] text-emerald-700">Resolved{comment.resolvedByName ? ` by ${comment.resolvedByName}` : ""}</span>
              )}
            </div>
            <p className="whitespace-pre-wrap text-sm leading-6 text-secondary">{comment.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ActivitySection({ events }: { events: WorkflowEventEntry[] }) {
  return (
    <section className="grid gap-2">
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Activity</h3>
      {events.length === 0 ? <p className="text-xs text-muted">No workflow activity yet.</p> : null}
      <ol className="grid gap-1.5">
        {events.map((event) => (
          <li key={event.id} className="rounded-lg bg-surface-soft p-2.5 text-xs leading-5">
            <span className="font-medium text-graphite">
              {event.fromStatus ? `${event.fromStatus} → ${event.toStatus}` : `Created as ${event.toStatus}`}
            </span>
            <span className="text-muted"> · {event.actorName ?? "System"} · {event.createdAt.toLocaleString()}</span>
            {event.note ? <p className="mt-1 text-secondary">{event.note}</p> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
