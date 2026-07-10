"use client";

import { useMemo } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import type { InsightArticle } from "@/content/insights.types";
import { validateInsightArticle, type PublishQaGroup, type PublishQaResult, type PublishQaSection } from "@/lib/insights/publish-qa";

const groupLabels: Record<PublishQaGroup, string> = {
  content: "Content",
  seo: "SEO",
  evidence: "GEO & evidence",
  "internal-links": "Internal links",
  metadata: "Metadata",
  schema: "Schema",
  localization: "Localization",
  media: "Media",
  workflow: "Workflow",
};

const groupOrder: PublishQaGroup[] = ["content", "seo", "evidence", "internal-links", "metadata", "schema", "localization", "media", "workflow"];

export function PublishQaPanel({
  article,
  siblings,
  storedResults,
  onNavigate,
}: {
  article: InsightArticle;
  siblings: InsightArticle[];
  storedResults: PublishQaResult[];
  onNavigate: (section: PublishQaSection) => void;
}) {
  const liveResults = useMemo(() => validateInsightArticle(article, siblings), [article, siblings]);
  const results = liveResults.length ? liveResults : storedResults;

  const errors = results.filter((result) => result.severity === "error").length;
  const warnings = results.filter((result) => result.severity === "warning").length;
  const passed = results.filter((result) => result.severity === "pass").length;

  const grouped = groupOrder
    .map((group) => ({ group, items: results.filter((result) => (result.group ?? "workflow") === group) }))
    .filter((entry) => entry.items.length > 0);

  return (
    <div className="grid gap-4">
      <div className="grid gap-2 sm:grid-cols-3">
        <SummaryTile label="Blocking errors" value={errors} tone={errors > 0 ? "error" : "ok"} />
        <SummaryTile label="Recommendations" value={warnings} tone={warnings > 0 ? "warn" : "ok"} />
        <SummaryTile label="Passed checks" value={passed} tone="ok" />
      </div>
      <p className="text-xs text-muted">
        Checks run live against the current draft of this locale. Blocking errors prevent approval and publishing; recommendations do not. No check scores or predicts rankings.
      </p>

      {grouped.map(({ group, items }) => (
        <section key={group} className="grid gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">{groupLabels[group]}</h3>
          {items.map((item, index) => (
            <div
              key={`${item.code}-${index}`}
              className={`grid gap-1 rounded-xl border p-3 ${item.severity === "error" ? "border-red-200 bg-red-50/50" : item.severity === "warning" ? "border-amber-200 bg-amber-50/50" : "border-line bg-white"}`}
            >
              <div className="flex items-start gap-2">
                {item.severity === "error" ? (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-label="Blocking" />
                ) : item.severity === "warning" ? (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-label="Recommended" />
                ) : (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-label="Passed" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-6 text-graphite">{item.message}</p>
                  {item.remediation ? <p className="text-xs leading-5 text-secondary">{item.remediation}</p> : null}
                </div>
                {item.section && item.severity !== "pass" ? (
                  <button
                    type="button"
                    onClick={() => onNavigate(item.section!)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-line bg-white px-2 py-1 text-xs font-semibold text-brand-teal hover:border-brand-teal/40"
                  >
                    Fix
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

function SummaryTile({ label, value, tone }: { label: string; value: number; tone: "error" | "warn" | "ok" }) {
  const toneClass = tone === "error" ? "border-red-200 bg-red-50 text-red-700" : tone === "warn" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-line bg-white text-graphite";
  return (
    <div className={`rounded-xl border p-3 ${toneClass}`}>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs opacity-80">{label}</p>
    </div>
  );
}
