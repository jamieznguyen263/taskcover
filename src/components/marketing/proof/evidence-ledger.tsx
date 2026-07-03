import Link from "next/link";
import { ArrowUpRight, FileSearch, ShieldCheck } from "lucide-react";
import type { ProofContent } from "@/content/proof.types";
import type { ProofRecord } from "@/content/proof.types";
import { ProofStatusBadge } from "./proof-status-badge";

export function EmptyEvidenceLedger({
  ui,
  title,
  body,
}: {
  ui: ProofContent["ui"];
  title?: string;
  body?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-6 depth-layered">
      <div aria-hidden="true" className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-gradient-soft blur-3xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface-tint text-brand-teal">
          <FileSearch className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <ProofStatusBadge label={ui.verifiedPublic} tone="verified" />
            <ProofStatusBadge label={ui.permissioned} tone="permission" />
            <ProofStatusBadge label={ui.sourceLinked} tone="source" />
          </div>
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-graphite">
              {title ?? ui.noPublicEvidenceTitle}
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-secondary">
              {body ?? ui.noPublicEvidenceBody}
            </p>
          </div>
          <div className="rounded-2xl border border-brand-teal/20 bg-brand-teal/[0.03] p-4">
            <p className="flex items-start gap-2 text-sm font-medium text-graphite">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" />
              {ui.publicEvidenceRule}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EvidenceLedger({
  records,
  ui,
  emptyTitle,
  emptyBody,
}: {
  records: ProofRecord[];
  ui: ProofContent["ui"];
  emptyTitle?: string;
  emptyBody?: string;
}) {
  if (records.length === 0) {
    return <EmptyEvidenceLedger ui={ui} title={emptyTitle} body={emptyBody} />;
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white depth-layered">
      <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-line bg-surface-tint px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">
            {ui.evidenceLedger}
          </p>
          <p className="mt-1 text-sm text-secondary">{ui.publicEvidenceRule}</p>
        </div>
        <ProofStatusBadge label={ui.verifiedPublic} tone="verified" />
      </div>
      <ul className="divide-y divide-line-soft">
        {records.map((record) => (
          <li key={record.id} className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-base font-semibold text-graphite">{record.title}</p>
              {record.summary ? (
                <p className="mt-1 text-sm leading-relaxed text-secondary">{record.summary}</p>
              ) : null}
              {record.disclosureText ? (
                <p className="mt-2 text-xs text-muted">
                  {ui.disclosure}: {record.disclosureText}
                </p>
              ) : null}
            </div>
            {record.sourceUrl ? (
              <Link
                href={record.sourceUrl}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-brand-teal hover:border-brand-teal/40"
              >
                {ui.source}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
