"use client";

import { useState } from "react";
import Link from "next/link";
import type { WorkItemSummary } from "@/lib/work/work-repository";
import {
  WAITING_TARGET_LABEL,
  WORK_STATUS_LABEL,
  WORK_STATUSES,
  WORK_TYPE_LABEL,
} from "@/lib/work/work-domain";

const STATUS_DOT: Record<string, string> = {
  to_do: "bg-slate-400",
  in_progress: "bg-brand-teal",
  waiting: "bg-amber-500",
  review: "bg-violet-500",
  done: "bg-emerald-500",
};

function WorkCard({ item, projectId }: { item: WorkItemSummary; projectId: string }) {
  return (
    <Link
      href={`/flow/projects/${projectId}?work=${item.id}`}
      scroll={false}
      className="block rounded-lg border border-line bg-white p-3 text-left hover:border-brand-teal"
    >
      <p className="text-sm font-medium text-graphite">{item.title}</p>
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
    </Link>
  );
}

export function WorkViews({ projectId, items }: { projectId: string; items: WorkItemSummary[] }) {
  const [view, setView] = useState<"list" | "board">("list");

  if (items.length === 0) {
    return <p className="text-sm text-muted">No work yet — create the first item below.</p>;
  }

  return (
    <div>
      <div className="mb-3 inline-flex rounded-lg border border-line bg-white p-0.5" role="tablist" aria-label="Work view">
        {(["list", "board"] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={view === option}
            onClick={() => setView(option)}
            className={`min-h-8 rounded-md px-3 text-sm font-medium capitalize ${
              view === option ? "bg-surface-tint text-brand-teal" : "text-secondary"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {view === "list" ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="py-2">Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Owner</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 font-medium text-graphite">
                    <Link href={`/flow/projects/${projectId}?work=${item.id}`} scroll={false} className="hover:text-brand-teal">
                      {item.title}
                    </Link>
                  </td>
                  <td className="py-3 text-secondary">{WORK_TYPE_LABEL[item.type]}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1.5 text-secondary">
                      <span className={`h-2 w-2 rounded-full ${STATUS_DOT[item.status]}`} aria-hidden="true" />
                      {WORK_STATUS_LABEL[item.status]}
                    </span>
                  </td>
                  <td className="py-3 text-secondary">{item.ownerName ?? "—"}</td>
                  <td className="py-3 text-secondary">{item.dueAt ? new Date(item.dueAt).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {WORK_STATUSES.map((status) => {
            const columnItems = items.filter((item) => item.status === status);
            return (
              <div key={status} className="rounded-xl border border-line-soft bg-surface-soft p-2">
                <p className="mb-2 flex items-center gap-1.5 px-1 text-xs font-semibold uppercase tracking-wide text-muted">
                  <span className={`h-2 w-2 rounded-full ${STATUS_DOT[status]}`} aria-hidden="true" />
                  {WORK_STATUS_LABEL[status]}
                  <span className="ml-auto">{columnItems.length}</span>
                </p>
                <div className="grid gap-2">
                  {columnItems.map((item) => (
                    <WorkCard key={item.id} item={item} projectId={projectId} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
