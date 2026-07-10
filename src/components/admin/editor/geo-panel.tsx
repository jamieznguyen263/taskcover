"use client";

import { useMemo } from "react";
import { AlertTriangle, CheckCircle2, CircleDashed, XCircle } from "lucide-react";
import type { InsightArticle } from "@/content/insights.types";
import { analyzeGeo, type GeoCheckState } from "@/lib/admin/geo-analysis";
import { ChipListInput, Field } from "./controls";

function StateIcon({ state }: { state: GeoCheckState | "present" | "missing" | "excluded" }) {
  if (state === "present") return <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-label="Present" />;
  if (state === "attention") return <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" aria-label="Needs attention" />;
  if (state === "excluded") return <CircleDashed className="h-4 w-4 shrink-0 text-muted" aria-label="Intentionally excluded" />;
  return <XCircle className="h-4 w-4 shrink-0 text-red-600" aria-label="Missing" />;
}

export function GeoPanel({ article, editable, update }: { article: InsightArticle; editable: boolean; update: (value: Partial<InsightArticle>) => void }) {
  const analysis = useMemo(() => analyzeGeo(article), [article]);
  const { citations } = analysis;

  return (
    <div className="grid gap-5">
      <div className="rounded-lg border border-line bg-surface-soft p-3 text-xs leading-5 text-secondary">
        These checks describe the structural facts answer engines rely on: extractable answers, explicit entities, and verifiable evidence. Passing them does not guarantee AI
        citation or visibility — no tool can promise that.
      </div>

      <section className="grid gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Answerability</h3>
        {analysis.answerability.map((check) => (
          <div key={check.code} className="flex items-start gap-3 rounded-xl border border-line bg-white p-3">
            <StateIcon state={check.state} />
            <div>
              <p className="text-sm font-medium text-graphite">{check.label}</p>
              <p className="text-xs leading-5 text-secondary">{check.detail}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Entity coverage</h3>
        {analysis.entities.length === 0 ? (
          <p className="text-sm text-muted">Define the primary entity and required entities in Search Strategy to track coverage here.</p>
        ) : (
          <div className="grid gap-1.5">
            {analysis.entities.map((entity) => (
              <div key={`${entity.role}-${entity.name}`} className="flex items-center gap-3 rounded-lg border border-line bg-white px-3 py-2">
                <StateIcon state={entity.state} />
                <span className="text-sm text-graphite">{entity.name}</span>
                <span className="ml-auto text-xs text-muted">{entity.role}{entity.state === "excluded" ? " · intentionally excluded" : entity.state === "missing" ? " · not named in body" : ""}</span>
              </div>
            ))}
          </div>
        )}
        <Field label="Intentionally excluded entities" hint="Mark entities you deliberately do not cover.">
          <ChipListInput
            values={article.searchStrategy.excludedEntities ?? []}
            disabled={!editable}
            onChange={(excludedEntities) => update({ searchStrategy: { ...article.searchStrategy, excludedEntities } })}
          />
        </Field>
      </section>

      <section className="grid gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Citation readiness</h3>
        <div className="grid gap-2 sm:grid-cols-3">
          <SummaryTile label="Claims tracked" value={citations.totalClaims} />
          <SummaryTile label="Independently supported" value={citations.claimsIndependentlySupported} />
          <SummaryTile label="Missing evidence" value={citations.claimsWithoutEvidence.length} alert={citations.claimsWithoutEvidence.length > 0} />
        </div>
        <IssueList title="Claims without any evidence (blocks publishing)" items={citations.claimsWithoutEvidence.map((claim) => claim.text || claim.id)} severity="error" />
        <IssueList title="Claims backed only by first-party sources" items={citations.claimsFirstPartyOnly.map((claim) => claim.text || claim.id)} severity="warn" hint="Independent evidence makes claims citable by answer engines." />
        <IssueList title="Statistics without a linked source" items={citations.unverifiedStatistics} severity="warn" />
        <IssueList title="Sources missing publication date" items={citations.sourcesMissingDate} severity="warn" />
        <IssueList title="Sources missing publisher" items={citations.sourcesMissingPublisher} severity="warn" />
        <IssueList title="Sources with invalid URLs" items={citations.sourcesInvalidUrl} severity="error" />
        {citations.totalClaims === 0 ? <p className="text-sm text-muted">No claims tracked yet. Record factual claims in Content &amp; Evidence so their support can be verified.</p> : null}
      </section>
    </div>
  );
}

function SummaryTile({ label, value, alert }: { label: string; value: number; alert?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${alert ? "border-red-200 bg-red-50" : "border-line bg-white"}`}>
      <p className={`text-2xl font-semibold ${alert ? "text-red-700" : "text-graphite"}`}>{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

function IssueList({ title, items, severity, hint }: { title: string; items: string[]; severity: "error" | "warn"; hint?: string }) {
  if (!items.length) return null;
  return (
    <div className={`rounded-xl border p-3 ${severity === "error" ? "border-red-200 bg-red-50/60" : "border-amber-200 bg-amber-50/60"}`}>
      <p className="text-sm font-semibold text-graphite">{title}</p>
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
      <ul className="mt-2 grid gap-1">
        {items.map((item, index) => (
          <li key={index} className="text-sm leading-6 text-secondary">• {item}</li>
        ))}
      </ul>
    </div>
  );
}
