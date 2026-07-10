"use client";

import { useState } from "react";
import { AlertTriangle, ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { InsightArticle, InsightClaim, InsightSource } from "@/content/insights.types";
import type { Locale } from "@/lib/i18n";
import { ChipListInput, Field, SelectInput, SmallButton, StringListEditor, TextArea, TextInput } from "./controls";

type Evidence = InsightArticle["contentEvidence"];

const URL_SHAPE = /^https?:\/\/[^\s]+$/;

function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export function EvidenceManager({ article, editable, update }: { article: InsightArticle; editable: boolean; update: (value: Partial<InsightArticle>) => void }) {
  const evidence = article.contentEvidence;
  const set = (patch: Partial<Evidence>) => update({ contentEvidence: { ...evidence, ...patch } });

  const claimsNeedingEvidence = evidence.claims.filter((claim) => claim.requiresEvidence && claim.sourceIds.length === 0);

  return (
    <div className="grid gap-5">
      <div className="rounded-lg border border-line bg-surface-soft p-3 text-xs leading-5 text-secondary">
        Every factual claim needs a real, verifiable source. Do not add invented statistics, fake quotes, or experts who did not say the words attributed to them. Publish QA blocks
        claims that require evidence but have none.
      </div>

      {claimsNeedingEvidence.length > 0 ? (
        <p role="alert" className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {claimsNeedingEvidence.length} claim(s) require evidence but have no linked source yet.
        </p>
      ) : null}

      <ClaimsSection evidence={evidence} editable={editable} set={set} />
      <SourcesSection evidence={evidence} editable={editable} set={set} articleLocale={article.locale} />

      <section className="grid gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Fact-check status</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Status">
            <SelectInput
              value={evidence.factCheckStatus}
              disabled={!editable}
              onChange={(factCheckStatus) => set({ factCheckStatus })}
              options={[
                { value: "needs-review", label: "Needs review" },
                { value: "checked", label: "Checked" },
              ] as const}
            />
          </Field>
        </div>
        <Field label="Original first-party insights" hint="Real observations from Taskcover's own work that make this article citable.">
          <StringListEditor values={evidence.originalInsights} disabled={!editable} onChange={(originalInsights) => set({ originalInsights })} />
        </Field>
        <Field label="Case study references" hint="Slugs or URLs of Taskcover case studies backing claims.">
          <ChipListInput values={evidence.caseStudyReferences} disabled={!editable} onChange={(caseStudyReferences) => set({ caseStudyReferences })} />
        </Field>
        <Field label="Compliance notes">
          <StringListEditor values={evidence.complianceNotes} disabled={!editable} onChange={(complianceNotes) => set({ complianceNotes })} />
        </Field>
      </section>
    </div>
  );
}

function ClaimsSection({ evidence, editable, set }: { evidence: Evidence; editable: boolean; set: (patch: Partial<Evidence>) => void }) {
  const setClaim = (id: string, patch: Partial<InsightClaim>) => set({ claims: evidence.claims.map((claim) => (claim.id === id ? { ...claim, ...patch } : claim)) });

  return (
    <section className="grid gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Claims ({evidence.claims.length})</h3>
        {editable ? (
          <SmallButton onClick={() => set({ claims: [...evidence.claims, { id: newId("claim"), text: "", requiresEvidence: true, sourceIds: [] }] })}>
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add claim
          </SmallButton>
        ) : null}
      </div>
      {evidence.claims.length === 0 ? <p className="text-sm text-muted">No claims recorded yet. Add each factual claim the article makes.</p> : null}
      {evidence.claims.map((claim) => (
        <div key={claim.id} className="grid gap-3 rounded-xl border border-line bg-white p-4">
          <div className="flex items-start justify-between gap-2">
            <span className="rounded bg-surface-soft px-2 py-0.5 font-mono text-[11px] text-muted">{claim.id}</span>
            {editable ? (
              <SmallButton tone="danger" ariaLabel={`Remove claim ${claim.id}`} onClick={() => set({ claims: evidence.claims.filter((item) => item.id !== claim.id) })}>
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </SmallButton>
            ) : null}
          </div>
          <Field label="Claim">
            <TextArea value={claim.text} disabled={!editable} rows={2} onChange={(text) => setClaim(claim.id, { text })} placeholder="e.g. 62% of B2B buyers research vendors through AI assistants" />
          </Field>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-medium text-graphite">
              <input
                type="checkbox"
                checked={claim.requiresEvidence}
                disabled={!editable}
                onChange={(event) => setClaim(claim.id, { requiresEvidence: event.target.checked })}
                className="h-4 w-4 rounded border-line"
              />
              Requires evidence
            </label>
            {claim.requiresEvidence && claim.sourceIds.length === 0 ? <span className="text-xs font-semibold text-amber-700">No source linked</span> : null}
          </div>
          <Field label="Linked sources">
            <div className="flex flex-wrap gap-2">
              {evidence.sources.length === 0 ? <span className="text-xs text-muted">Add sources below, then link them here.</span> : null}
              {evidence.sources.map((source) => {
                const linked = claim.sourceIds.includes(source.id);
                return (
                  <button
                    key={source.id}
                    type="button"
                    disabled={!editable}
                    aria-pressed={linked}
                    onClick={() => setClaim(claim.id, { sourceIds: linked ? claim.sourceIds.filter((id) => id !== source.id) : [...claim.sourceIds, source.id] })}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium disabled:opacity-60 ${linked ? "border-brand-teal bg-surface-tint text-brand-teal" : "border-line text-secondary hover:border-brand-teal/40"}`}
                  >
                    {source.title || source.id}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>
      ))}
    </section>
  );
}

function SourcesSection({ evidence, editable, set, articleLocale }: { evidence: Evidence; editable: boolean; set: (patch: Partial<Evidence>) => void; articleLocale: Locale }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const setSource = (id: string, patch: Partial<InsightSource>) => set({ sources: evidence.sources.map((source) => (source.id === id ? { ...source, ...patch } : source)) });

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= evidence.sources.length) return;
    const next = [...evidence.sources];
    [next[index], next[target]] = [next[target], next[index]];
    set({ sources: next });
  };

  const addSource = () => {
    const id = newId("source");
    set({
      sources: [
        ...evidence.sources,
        { id, title: "", publisher: "", url: "", accessedAt: new Date().toISOString().slice(0, 10), primarySource: false, supportsClaimIds: [], locale: articleLocale, notes: "" },
      ],
    });
    setExpanded(id);
  };

  return (
    <section className="grid gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Sources ({evidence.sources.length})</h3>
        {editable ? (
          <SmallButton onClick={addSource}>
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add source
          </SmallButton>
        ) : null}
      </div>
      {evidence.sources.length === 0 ? <p className="text-sm text-muted">No sources yet.</p> : null}
      {evidence.sources.map((source, index) => {
        const urlInvalid = source.url.length > 0 && !URL_SHAPE.test(source.url);
        const isTaskcover = /(^|\/\/)(www\.)?taskcover\.com/i.test(source.url) || source.primarySource;
        const open = expanded === source.id;
        return (
          <div key={source.id} className="rounded-xl border border-line bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3">
              <button type="button" onClick={() => setExpanded(open ? null : source.id)} className="flex-1 text-left">
                <span className="block text-sm font-medium text-graphite">{source.title || "Untitled source"}</span>
                <span className="block text-xs text-muted">
                  {source.publisher || "No publisher"} · {isTaskcover ? "First-party (Taskcover)" : "Independent"} · supports {source.supportsClaimIds.length} claim(s)
                </span>
              </button>
              <div className="flex items-center gap-1">
                {urlInvalid ? <AlertTriangle className="h-4 w-4 text-amber-600" aria-label="Invalid URL" /> : null}
                {editable ? (
                  <>
                    <SmallButton ariaLabel="Move source up" onClick={() => move(index, -1)} disabled={index === 0}><ArrowUp className="h-3.5 w-3.5" aria-hidden="true" /></SmallButton>
                    <SmallButton ariaLabel="Move source down" onClick={() => move(index, 1)} disabled={index === evidence.sources.length - 1}><ArrowDown className="h-3.5 w-3.5" aria-hidden="true" /></SmallButton>
                    <SmallButton
                      tone="danger"
                      ariaLabel={`Remove source ${source.title || source.id}`}
                      onClick={() =>
                        set({
                          sources: evidence.sources.filter((item) => item.id !== source.id),
                          claims: evidence.claims.map((claim) => ({ ...claim, sourceIds: claim.sourceIds.filter((id) => id !== source.id) })),
                        })
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </SmallButton>
                  </>
                ) : null}
              </div>
            </div>
            {open ? (
              <div className="grid gap-3 border-t border-line-soft p-4 md:grid-cols-2">
                <Field label="Source title"><TextInput value={source.title} disabled={!editable} onChange={(title) => setSource(source.id, { title })} /></Field>
                <Field label="Publisher"><TextInput value={source.publisher} disabled={!editable} onChange={(publisher) => setSource(source.id, { publisher })} /></Field>
                <div className="md:col-span-2">
                  <Field label="URL" hint={urlInvalid ? "Must start with http:// or https://" : undefined}>
                    <TextInput value={source.url} disabled={!editable} onChange={(url) => setSource(source.id, { url })} placeholder="https://…" />
                  </Field>
                  {urlInvalid ? <p className="mt-1 text-xs text-amber-700">This URL is not a valid link and Publish QA will block it.</p> : null}
                </div>
                <Field label="Publication date" hint="When the source published this material.">
                  <TextInput type="date" value={source.publishedAt ?? ""} disabled={!editable} onChange={(publishedAt) => setSource(source.id, { publishedAt: publishedAt || undefined })} />
                </Field>
                <Field label="Access date" hint="When you verified the source.">
                  <TextInput type="date" value={source.accessedAt} disabled={!editable} onChange={(accessedAt) => setSource(source.id, { accessedAt })} />
                </Field>
                <Field label="Supported locale">
                  <SelectInput
                    value={source.locale}
                    disabled={!editable}
                    onChange={(locale) => setSource(source.id, { locale })}
                    options={[
                      { value: "global", label: "Global" },
                      { value: "en", label: "English" },
                      { value: "fr", label: "French" },
                      { value: "es", label: "Spanish" },
                    ] as const}
                  />
                </Field>
                <label className="flex items-center gap-2 self-end text-sm font-medium text-graphite">
                  <input type="checkbox" checked={source.primarySource} disabled={!editable} onChange={(event) => setSource(source.id, { primarySource: event.target.checked })} className="h-4 w-4 rounded border-line" />
                  First-party source (Taskcover&apos;s own data or pages)
                </label>
                <div className="md:col-span-2">
                  <Field label="Quote / paraphrase notes" hint="What exactly the source supports, and whether it is quoted or paraphrased.">
                    <TextArea value={source.notes ?? ""} disabled={!editable} rows={2} onChange={(notes) => setSource(source.id, { notes: notes || undefined })} />
                  </Field>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </section>
  );
}
