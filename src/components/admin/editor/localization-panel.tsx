"use client";

import { useState } from "react";
import { AlertTriangle, Copy } from "lucide-react";
import type { InsightArticle } from "@/content/insights.types";
import type { Locale } from "@/lib/i18n";
import { Field, SelectInput, SmallButton, TextArea, TextInput } from "./controls";

export type SiblingLocalization = {
  locale: Locale;
  draftVersion: number;
  article: InsightArticle;
};

type Localization = InsightArticle["localization"];

export function LocalizationPanel({
  article,
  editable,
  update,
  siblings,
  onCopyBodyFromSource,
}: {
  article: InsightArticle;
  editable: boolean;
  update: (value: Partial<InsightArticle>) => void;
  siblings: SiblingLocalization[];
  onCopyBodyFromSource: (sourceLocale: Locale) => void;
}) {
  const localization = article.localization;
  const set = (patch: Partial<Localization>) => update({ localization: { ...localization, ...patch } });
  const sourceLocale = localization.sourceLocale ?? "en";
  const source = siblings.find((sibling) => sibling.locale === sourceLocale && sibling.locale !== article.locale);
  const [confirmBodyCopy, setConfirmBodyCopy] = useState(false);

  const outdated = source && localization.syncedFromSourceVersion !== undefined && source.draftVersion > localization.syncedFromSourceVersion;
  const neverSynced = source && localization.syncedFromSourceVersion === undefined;

  return (
    <div className="grid gap-5">
      <section className="grid gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Locale status</h3>
        <div className="grid gap-1.5">
          {siblings.map((sibling) => (
            <div key={sibling.locale} className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${sibling.locale === article.locale ? "border-brand-teal bg-surface-tint" : "border-line bg-white"}`}>
              <span className="text-sm font-semibold text-graphite">{sibling.locale.toUpperCase()}</span>
              <span className="text-xs text-secondary">{sibling.article.h1}</span>
              <span className="ml-auto flex items-center gap-2 text-xs">
                <span className={sibling.article.localization.translationStatus === "complete" ? "text-emerald-700" : "text-amber-700"}>
                  {sibling.article.localization.translationStatus === "complete" ? "Complete" : "Needs review"}
                </span>
                <span className="text-muted">v{sibling.draftVersion}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Translation workflow — {article.locale.toUpperCase()}</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Source locale" hint="The locale this localization translates from.">
            <SelectInput
              value={sourceLocale}
              disabled={!editable}
              onChange={(next) => set({ sourceLocale: next })}
              options={siblings.filter((sibling) => sibling.locale !== article.locale).map((sibling) => ({ value: sibling.locale, label: sibling.locale.toUpperCase() }))}
            />
          </Field>
          <Field label="Assigned translator">
            <TextInput value={localization.assignedTranslator ?? ""} disabled={!editable} onChange={(assignedTranslator) => set({ assignedTranslator: assignedTranslator || undefined })} />
          </Field>
          <Field label="Translation status">
            <SelectInput
              value={localization.translationStatus}
              disabled={!editable}
              onChange={(translationStatus) => set({ translationStatus })}
              options={[
                { value: "needs-review", label: "Needs review" },
                { value: "complete", label: "Complete" },
              ] as const}
            />
          </Field>
          <Field label="Locale review status" hint="Independent review of this locale.">
            <SelectInput
              value={localization.localeReviewStatus ?? "pending"}
              disabled={!editable}
              onChange={(localeReviewStatus) => set({ localeReviewStatus })}
              options={[
                { value: "pending", label: "Pending" },
                { value: "approved", label: "Approved" },
                { value: "changes-requested", label: "Changes requested" },
              ] as const}
            />
          </Field>
          <Field label="Locale-specific primary keyword" hint="Localized query research, not a direct translation.">
            <TextInput value={localization.localeKeyword ?? ""} disabled={!editable} onChange={(localeKeyword) => set({ localeKeyword: localeKeyword || undefined })} />
          </Field>
        </div>
        <Field label="Translation notes">
          <TextArea value={localization.translationNotes} disabled={!editable} onChange={(translationNotes) => set({ translationNotes })} rows={2} />
        </Field>
        <p className="rounded-lg border border-line bg-surface-soft p-3 text-xs leading-5 text-secondary">
          Localization is more than translation: the slug, SEO title, meta description, and keyword for this locale are edited on their own tabs while this locale is selected.
          Locale-specific sources belong in Content &amp; Evidence with the locale field set.
        </p>
      </section>

      {source ? (
        <section className="grid gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Compare with source ({source.locale.toUpperCase()})</h3>
            {editable ? (
              <SmallButton onClick={() => set({ syncedFromSourceVersion: source.draftVersion })}>Mark as synced with source v{source.draftVersion}</SmallButton>
            ) : null}
          </div>
          {outdated || neverSynced ? (
            <p role="alert" className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {neverSynced
                ? "This localization has never been marked as synced with its source."
                : `The ${source.locale.toUpperCase()} source has changed since this localization was last synced (source v${source.draftVersion}, synced at v${localization.syncedFromSourceVersion}).`}
            </p>
          ) : (
            <p className="text-xs text-emerald-700">Marked as synced with the source draft.</p>
          )}

          <div className="grid gap-2">
            <CompareRow label="H1" source={source.article.h1} current={article.h1} editable={editable} onCopy={() => update({ h1: source.article.h1 })} />
            <CompareRow label="Excerpt" source={source.article.excerpt} current={article.excerpt} editable={editable} onCopy={() => update({ excerpt: source.article.excerpt })} />
            <CompareRow
              label="SEO title"
              source={source.article.metadata.metaTitle}
              current={article.metadata.metaTitle}
              editable={editable}
              onCopy={() => update({ metadata: { ...article.metadata, metaTitle: source.article.metadata.metaTitle } })}
            />
            <CompareRow
              label="Meta description"
              source={source.article.metadata.metaDescription}
              current={article.metadata.metaDescription}
              editable={editable}
              onCopy={() => update({ metadata: { ...article.metadata, metaDescription: source.article.metadata.metaDescription } })}
            />
          </div>

          {editable ? (
            <div className="rounded-xl border border-line bg-white p-3">
              <p className="text-sm font-medium text-graphite">Replace document body with the {source.locale.toUpperCase()} source body</p>
              <p className="mt-1 text-xs text-secondary">This overwrites the entire {article.locale.toUpperCase()} document so you can retranslate from the latest source. It cannot be merged.</p>
              {confirmBodyCopy ? (
                <div className="mt-2 flex gap-2">
                  <SmallButton tone="danger" onClick={() => { onCopyBodyFromSource(source.locale); setConfirmBodyCopy(false); }}>Yes, overwrite the {article.locale.toUpperCase()} body</SmallButton>
                  <SmallButton onClick={() => setConfirmBodyCopy(false)}>Cancel</SmallButton>
                </div>
              ) : (
                <div className="mt-2">
                  <SmallButton onClick={() => setConfirmBodyCopy(true)}>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    Copy body from source…
                  </SmallButton>
                </div>
              )}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function CompareRow({ label, source, current, editable, onCopy }: { label: string; source: string; current: string; editable: boolean; onCopy: () => void }) {
  const same = source.trim() === current.trim();
  return (
    <div className="grid gap-2 rounded-xl border border-line bg-white p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}{same ? " · identical (translate it)" : ""}</p>
        {editable ? (
          <SmallButton ariaLabel={`Copy ${label} from source`} onClick={onCopy}>
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            Copy source
          </SmallButton>
        ) : null}
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <div className="rounded-lg bg-surface-soft p-2 text-xs leading-5 text-secondary"><span className="font-semibold text-muted">Source: </span>{source || "—"}</div>
        <div className="rounded-lg bg-surface-tint p-2 text-xs leading-5 text-secondary"><span className="font-semibold text-muted">This locale: </span>{current || "—"}</div>
      </div>
    </div>
  );
}
