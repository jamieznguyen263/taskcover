"use client";

import { useState } from "react";
import Link from "next/link";
import type { WorkItemSummary } from "@/lib/work/work-repository";
import { WORK_STATUS_LABEL, WORK_TYPE_LABEL } from "@/lib/work/work-domain";
import { WorkBoard } from "./work-board";

const STATUS_DOT: Record<string, string> = {
  to_do: "bg-slate-400",
  in_progress: "bg-brand-teal",
  waiting: "bg-amber-500",
  review: "bg-violet-500",
  done: "bg-emerald-500",
};

export function WorkViews({
  projectId,
  items,
  canManage,
}: {
  projectId: string;
  items: WorkItemSummary[];
  canManage: boolean;
}) {
  const [view, setView] = useState<"list" | "board">("board");

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
        <WorkBoard projectId={projectId} items={items} canManage={canManage} />
      )}
    </div>
  );
}
