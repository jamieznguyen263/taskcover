import Link from "next/link";
import type { HomeWorkRow } from "@/lib/work/home-repository";
import { homeWorkHref } from "@/lib/work/home-repository";
import { WAITING_TARGET_LABEL, WORK_STATUS_LABEL, WORK_TYPE_LABEL } from "@/lib/work/work-domain";

const STATUS_DOT: Record<string, string> = {
  to_do: "bg-slate-400",
  in_progress: "bg-brand-teal",
  waiting: "bg-amber-500",
  review: "bg-violet-500",
  done: "bg-emerald-500",
};

export function HomeWorkList({
  title,
  rows,
  empty,
  highlight,
  now,
}: {
  title: string;
  rows: HomeWorkRow[];
  empty: string;
  highlight?: boolean;
  now: Date;
}) {
  return (
    <section className={`rounded-xl border bg-white p-4 ${highlight && rows.length > 0 ? "border-amber-300" : "border-line"}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-graphite">{title}</h2>
        <span className="text-xs text-muted">{rows.length}</span>
      </div>
      {rows.length === 0 ? (
        <p className="mt-2 text-sm text-muted">{empty}</p>
      ) : (
        <ul className="mt-3 grid gap-2">
          {rows.map((row) => {
            const overdue = row.dueAt !== null && row.dueAt < now;
            return (
              <li key={row.id}>
                <Link
                  href={homeWorkHref(row)}
                  className="card-lift block rounded-lg border border-line-soft bg-surface-soft p-3 hover:border-brand-teal"
                >
                  <p className="text-sm font-medium text-graphite">{row.title}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span className="inline-flex items-center gap-1">
                      <span className={`h-2 w-2 rounded-full ${STATUS_DOT[row.status]}`} aria-hidden="true" />
                      {WORK_STATUS_LABEL[row.status]}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{row.projectName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{WORK_TYPE_LABEL[row.type]}</span>
                    {row.waitingTarget ? (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">
                        Waiting: {WAITING_TARGET_LABEL[row.waitingTarget]}
                      </span>
                    ) : null}
                    {row.dueAt ? (
                      <span className={overdue ? "font-medium text-red-600" : ""}>
                        {overdue ? "Overdue " : "Due "}
                        {new Date(row.dueAt).toLocaleDateString()}
                      </span>
                    ) : null}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
