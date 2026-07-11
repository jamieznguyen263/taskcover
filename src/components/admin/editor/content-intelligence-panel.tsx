"use client";

import { useMemo } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, CircleAlert } from "lucide-react";
import type { InsightArticle } from "@/content/insights.types";
import { analyzeContentIntelligence, type IntelligenceItem, type IntelligenceSection, type IntelligenceStatus } from "@/lib/admin/content-intelligence";

const statusStyles: Record<IntelligenceStatus, string> = {
  action: "border-red-200 bg-red-50/70 text-red-700",
  watch: "border-amber-200 bg-amber-50/70 text-amber-800",
  pass: "border-emerald-200 bg-emerald-50/70 text-emerald-700",
};

const statusLabels: Record<IntelligenceStatus, string> = {
  action: "Action",
  watch: "Watch",
  pass: "Pass",
};

export function ContentIntelligencePanel({
  article,
  siblings,
  onNavigate,
}: {
  article: InsightArticle;
  siblings: InsightArticle[];
  onNavigate: (section: IntelligenceSection) => void;
}) {
  const groups = useMemo(() => analyzeContentIntelligence(article, siblings), [article, siblings]);
  const items = groups.flatMap((group) => group.items);
  const actions = items.filter((item) => item.status === "action");
  const watch = items.filter((item) => item.status === "watch");
  const passed = items.filter((item) => item.status === "pass");

  return (
    <div className="grid gap-5">
      <section className="grid gap-2 sm:grid-cols-3">
        <SummaryCard label="Needs action" value={actions.length} status={actions.length ? "action" : "pass"} />
        <SummaryCard label="Watch items" value={watch.length} status={watch.length ? "watch" : "pass"} />
        <SummaryCard label="Passed" value={passed.length} status="pass" />
      </section>

      <div className="rounded-lg border border-line bg-surface-soft p-3 text-xs leading-5 text-secondary">
        Content Intelligence checks whether the draft is ready for serious editorial review. It does not predict rankings. Use it to close gaps in strategy, helpful content,
        evidence, internal links, schema, and localization before Publish QA.
      </div>

      {groups.map((group) => (
        <section key={group.id} className="grid gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">{group.label}</h3>
          {group.items.map((item) => (
            <IntelligenceRow key={item.code} item={item} onNavigate={onNavigate} />
          ))}
        </section>
      ))}
    </div>
  );
}

function SummaryCard({ label, value, status }: { label: string; value: number; status: IntelligenceStatus }) {
  return (
    <div className={`rounded-xl border p-3 ${statusStyles[status]}`}>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs opacity-80">{label}</p>
    </div>
  );
}

function IntelligenceRow({ item, onNavigate }: { item: IntelligenceItem; onNavigate: (section: IntelligenceSection) => void }) {
  const Icon = item.status === "pass" ? CheckCircle2 : item.status === "watch" ? AlertTriangle : CircleAlert;
  return (
    <div className={`grid gap-2 rounded-xl border p-3 ${item.status === "pass" ? "border-line bg-white" : item.status === "watch" ? "border-amber-200 bg-amber-50/40" : "border-red-200 bg-red-50/40"}`}>
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${item.status === "pass" ? "text-emerald-600" : item.status === "watch" ? "text-amber-600" : "text-red-600"}`} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-graphite">{item.title}</p>
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusStyles[item.status]}`}>{statusLabels[item.status]}</span>
            {item.status !== "pass" ? <span className="rounded-full border border-line bg-white px-2 py-0.5 text-[11px] font-medium text-muted">{item.priority}</span> : null}
          </div>
          <p className="mt-1 text-xs leading-5 text-secondary">{item.detail}</p>
        </div>
        {item.status !== "pass" ? (
          <button
            type="button"
            onClick={() => onNavigate(item.section)}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-line bg-white px-2 py-1 text-xs font-semibold text-brand-teal hover:border-brand-teal/40"
          >
            Fix
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

