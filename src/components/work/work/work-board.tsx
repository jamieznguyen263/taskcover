"use client";

import { useOptimistic, useRef, useState, useTransition } from "react";
import Link from "next/link";
import type { WorkItemSummary } from "@/lib/work/work-repository";
import { moveWorkStatusAction, quickAddWorkAction, renameWorkItemAction } from "@/lib/work/work-actions";
import {
  WAITING_TARGET_LABEL,
  WAITING_TARGETS,
  WORK_STATUS_LABEL,
  WORK_STATUSES,
  WORK_TYPE_LABEL,
  type WaitingTarget,
  type WorkStatus,
} from "@/lib/work/work-domain";

const STATUS_DOT: Record<WorkStatus, string> = {
  to_do: "bg-slate-400",
  in_progress: "bg-brand-teal",
  waiting: "bg-amber-500",
  review: "bg-violet-500",
  done: "bg-emerald-500",
};

type OptimisticMove = { id: string; status: WorkStatus };

export function WorkBoard({
  projectId,
  items,
  canManage,
}: {
  projectId: string;
  items: WorkItemSummary[];
  canManage: boolean;
}) {
  const [optimisticItems, applyMove] = useOptimistic(items, (state, move: OptimisticMove) =>
    state.map((item) =>
      item.id === move.id
        ? { ...item, status: move.status, waitingTarget: move.status === "waiting" ? item.waitingTarget : null }
        : item
    )
  );
  const [, startTransition] = useTransition();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<WorkStatus | null>(null);
  const [pendingWaiting, setPendingWaiting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function commitMove(id: string, status: WorkStatus, waitingTarget: WaitingTarget | null = null) {
    setError(null);
    startTransition(async () => {
      applyMove({ id, status });
      const result = await moveWorkStatusAction({ workItemId: id, projectId, status, waitingTarget });
      if (!result.ok) setError(result.error);
    });
  }

  function handleDrop(status: WorkStatus) {
    const id = draggingId;
    setDraggingId(null);
    setDropTarget(null);
    if (!id) return;
    const current = items.find((item) => item.id === id);
    if (!current || current.status === status) return;
    // Waiting needs a target ("waiting for whom?") — collect it before committing.
    if (status === "waiting") setPendingWaiting(id);
    else commitMove(id, status);
  }

  return (
    <div>
      {error ? (
        <p role="alert" className="mb-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {WORK_STATUSES.map((status) => {
          const columnItems = optimisticItems.filter((item) => item.status === status);
          const isDropTarget = dropTarget === status && draggingId !== null;
          return (
            <div
              key={status}
              onDragOver={
                canManage
                  ? (event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                      if (dropTarget !== status) setDropTarget(status);
                    }
                  : undefined
              }
              onDragLeave={canManage ? () => setDropTarget((current) => (current === status ? null : current)) : undefined}
              onDrop={canManage ? () => handleDrop(status) : undefined}
              className={`flex flex-col rounded-xl border p-2 transition-colors ${
                isDropTarget ? "border-brand-teal bg-surface-tint" : "border-line-soft bg-surface-soft"
              }`}
            >
              <p className="mb-2 flex items-center gap-1.5 px-1 text-xs font-semibold uppercase tracking-wide text-muted">
                <span className={`h-2 w-2 rounded-full ${STATUS_DOT[status]}`} aria-hidden="true" />
                {WORK_STATUS_LABEL[status]}
                <span className="ml-auto">{columnItems.length}</span>
              </p>
              <div className="grid gap-2">
                {columnItems.map((item) => (
                  <BoardCard
                    key={item.id}
                    item={item}
                    projectId={projectId}
                    draggable={canManage}
                    onDragStart={() => setDraggingId(item.id)}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setDropTarget(null);
                    }}
                    isDragging={draggingId === item.id}
                  />
                ))}
              </div>
              {canManage && status !== "waiting" ? (
                <QuickAdd projectId={projectId} status={status} onError={setError} />
              ) : null}
            </div>
          );
        })}
      </div>

      {pendingWaiting ? (
        <WaitingTargetPrompt
          onCancel={() => setPendingWaiting(null)}
          onConfirm={(target) => {
            const id = pendingWaiting;
            setPendingWaiting(null);
            commitMove(id, "waiting", target);
          }}
        />
      ) : null}
    </div>
  );
}

function BoardCard({
  item,
  projectId,
  draggable,
  onDragStart,
  onDragEnd,
  isDragging,
}: {
  item: WorkItemSummary;
  projectId: string;
  draggable: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [, startRename] = useTransition();

  function saveRename() {
    const next = title.trim();
    setEditing(false);
    if (!next || next === item.title) {
      setTitle(item.title);
      return;
    }
    startRename(async () => {
      const result = await renameWorkItemAction({ workItemId: item.id, projectId, title: next });
      if (!result.ok) setTitle(item.title);
    });
  }

  return (
    <div
      draggable={draggable && !editing}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", item.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className={`card-lift rounded-lg border border-line bg-white p-3 ${
        draggable && !editing ? "cursor-grab active:cursor-grabbing" : ""
      } ${isDragging ? "opacity-50" : ""}`}
    >
      {editing ? (
        <input
          autoFocus
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onBlur={saveRename}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              saveRename();
            } else if (event.key === "Escape") {
              event.preventDefault();
              setTitle(item.title);
              setEditing(false);
            }
          }}
          maxLength={200}
          aria-label="Rename work item"
          className="w-full rounded border border-brand-teal bg-white px-1 text-sm font-medium text-graphite outline-none"
        />
      ) : (
        <Link
          href={`/flow/projects/${projectId}?work=${item.id}`}
          scroll={false}
          onDoubleClick={
            draggable
              ? (event) => {
                  event.preventDefault();
                  setTitle(item.title);
                  setEditing(true);
                }
              : undefined
          }
          title={draggable ? "Double-click to rename" : undefined}
          className="block text-sm font-medium text-graphite hover:text-brand-teal"
        >
          {item.title}
        </Link>
      )}
      <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span>{WORK_TYPE_LABEL[item.type]}</span>
        <span aria-hidden="true">·</span>
        <span>{item.ownerName ?? "Unassigned"}</span>
        {item.waitingTarget ? (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">
            Waiting: {WAITING_TARGET_LABEL[item.waitingTarget]}
          </span>
        ) : null}
        {item.dueAt ? <span>Due {new Date(item.dueAt).toLocaleDateString()}</span> : null}
      </p>
    </div>
  );
}

function QuickAdd({
  projectId,
  status,
  onError,
}: {
  projectId: string;
  status: WorkStatus;
  onError: (message: string | null) => void;
}) {
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function submit() {
    const title = value.trim();
    if (!title) return;
    onError(null);
    setValue("");
    startTransition(async () => {
      const result = await quickAddWorkAction({ projectId, title, status });
      if (!result.ok) {
        onError(result.error);
        setValue(title);
      }
      inputRef.current?.focus();
    });
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="mt-2"
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={pending}
        maxLength={200}
        placeholder="+ Add work"
        aria-label={`Add work to ${WORK_STATUS_LABEL[status]}`}
        className="min-h-9 w-full rounded-lg border border-line bg-white px-2.5 text-sm text-graphite placeholder:text-muted focus:border-brand-teal"
      />
    </form>
  );
}

function WaitingTargetPrompt({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: (target: WaitingTarget) => void;
}) {
  const [target, setTarget] = useState<WaitingTarget>("client");

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-graphite/40 p-4" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Waiting for whom?"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-xl border border-line bg-white p-4 shadow-xl"
      >
        <h3 className="text-sm font-semibold text-graphite">Waiting for whom?</h3>
        <p className="mt-1 text-xs text-muted">Waiting always records who or what you&apos;re blocked on.</p>
        <select
          value={target}
          onChange={(event) => setTarget(event.target.value as WaitingTarget)}
          aria-label="Waiting target"
          className="mt-3 min-h-10 w-full rounded-lg border border-line bg-white px-2 text-sm text-graphite"
        >
          {WAITING_TARGETS.map((option) => (
            <option key={option} value={option}>
              {WAITING_TARGET_LABEL[option]}
            </option>
          ))}
        </select>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-9 rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(target)}
            className="min-h-9 rounded-lg border border-brand-teal bg-brand-teal px-3 text-sm font-medium text-white"
          >
            Move to Waiting
          </button>
        </div>
      </div>
    </div>
  );
}
