"use client";

import { useMemo } from "react";
import { AlertTriangle, Plus, Trash2 } from "lucide-react";
import type { InsightArticle, InsightLink } from "@/content/insights.types";
import { collectExistingHrefs, duplicateAnchorWarnings, LocalInventoryLinkProvider, type InternalLinkSuggestion } from "@/lib/admin/link-inventory";
import { ChipListInput, Field, SmallButton, TextInput } from "./controls";

type Linking = InsightArticle["internalLinking"];

const linkGroups: { key: keyof Pick<Linking, "requiredInternalLinks" | "suggestedInternalLinks" | "serviceLinks" | "industryLinks" | "marketLinks" | "caseStudyLinks" | "sampleAuditLinks">; label: string; hint: string }[] = [
  { key: "requiredInternalLinks", label: "Required internal links", hint: "Must be present in the article body before publishing." },
  { key: "suggestedInternalLinks", label: "Suggested internal links", hint: "Accepted recommendations to place while writing." },
  { key: "serviceLinks", label: "Service pages", hint: "Related Taskcover service pages." },
  { key: "industryLinks", label: "Industry pages", hint: "Related industry pages." },
  { key: "marketLinks", label: "Market pages", hint: "Related market pages." },
  { key: "caseStudyLinks", label: "Case studies", hint: "Proof supporting this article." },
  { key: "sampleAuditLinks", label: "Sample audits", hint: "Related sample audits." },
];

export function InternalLinkingPanel({
  article,
  editable,
  update,
  publishedArticles,
}: {
  article: InsightArticle;
  editable: boolean;
  update: (value: Partial<InsightArticle>) => void;
  publishedArticles: { slug: string; category: string; h1: string; focusKeyword: string }[];
}) {
  const linking = article.internalLinking;
  const set = (patch: Partial<Linking>) => update({ internalLinking: { ...linking, ...patch } });

  const existingHrefs = useMemo(() => collectExistingHrefs(article), [article]);
  const suggestions = useMemo(
    () => new LocalInventoryLinkProvider(publishedArticles).suggest(article, existingHrefs),
    [article, existingHrefs, publishedArticles]
  );
  const anchorWarnings = useMemo(() => duplicateAnchorWarnings(article), [article]);
  const invalidLinks = useMemo(() => {
    const bad: string[] = [];
    for (const group of linkGroups) {
      for (const link of linking[group.key]) {
        if (link.href && !link.href.startsWith("/") && !/^https?:\/\//.test(link.href)) bad.push(`${group.label}: “${link.href}” is not a valid path or URL.`);
      }
    }
    return bad;
  }, [linking]);

  const acceptSuggestion = (suggestion: InternalLinkSuggestion) => {
    set({ suggestedInternalLinks: [...linking.suggestedInternalLinks, { label: suggestion.anchorText, href: suggestion.href, note: suggestion.reason }] });
  };

  return (
    <div className="grid gap-5">
      {[...anchorWarnings, ...invalidLinks].map((warning) => (
        <p key={warning} role="alert" className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {warning}
        </p>
      ))}

      <section className="grid gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Recommendations from the site inventory</h3>
        {suggestions.length === 0 ? <p className="text-sm text-muted">No further recommendations. Add topic terms in Search Strategy to improve matching.</p> : null}
        <div className="grid gap-2">
          {suggestions.map((suggestion) => (
            <div key={suggestion.href} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-white p-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-graphite">
                  {suggestion.anchorText} <span className="ml-1 font-mono text-xs text-muted">{suggestion.href}</span>
                </p>
                <p className="text-xs text-muted">{suggestion.pageType} · {suggestion.reason}</p>
              </div>
              {editable ? (
                <SmallButton tone="primary" onClick={() => acceptSuggestion(suggestion)}>
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  Add
                </SmallButton>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {linkGroups.map((group) => (
        <LinkListEditor
          key={group.key}
          label={group.label}
          hint={group.hint}
          links={linking[group.key]}
          editable={editable}
          onChange={(links) => set({ [group.key]: links } as Partial<Linking>)}
        />
      ))}

      <section className="grid gap-3">
        <Field label="Related article slugs" hint="Slugs of Insights articles to show as related reading.">
          <ChipListInput values={linking.relatedArticleSlugs} disabled={!editable} onChange={(relatedArticleSlugs) => set({ relatedArticleSlugs })} />
        </Field>
        <Field label="Recommended anchors" hint="Anchor texts other pages should use when linking to this article.">
          <ChipListInput values={linking.recommendedAnchors} disabled={!editable} onChange={(recommendedAnchors) => set({ recommendedAnchors })} />
        </Field>
      </section>
    </div>
  );
}

function LinkListEditor({ label, hint, links, editable, onChange }: { label: string; hint: string; links: InsightLink[]; editable: boolean; onChange: (links: InsightLink[]) => void }) {
  const setLink = (index: number, patch: Partial<InsightLink>) => onChange(links.map((link, i) => (i === index ? { ...link, ...patch } : link)));

  return (
    <section className="grid gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-graphite">
          {label} <span className="ml-1 text-xs font-normal text-muted">{hint}</span>
        </h3>
        {editable ? (
          <SmallButton onClick={() => onChange([...links, { label: "", href: "" }])}>
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add
          </SmallButton>
        ) : null}
      </div>
      {links.length === 0 ? <p className="text-xs text-muted">None.</p> : null}
      {links.map((link, index) => (
        <div key={index} className="grid gap-2 rounded-lg border border-line-soft bg-surface-soft p-3 md:grid-cols-[1fr_1fr_auto]">
          <Field label="Anchor text"><TextInput value={link.label} disabled={!editable} onChange={(next) => setLink(index, { label: next })} /></Field>
          <Field label="Target URL or path"><TextInput value={link.href} disabled={!editable} onChange={(next) => setLink(index, { href: next })} placeholder="/services/…" /></Field>
          {editable ? (
            <div className="self-end">
              <SmallButton tone="danger" ariaLabel={`Remove link ${link.label || index + 1}`} onClick={() => onChange(links.filter((_, i) => i !== index))}>
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </SmallButton>
            </div>
          ) : null}
          <div className="md:col-span-3">
            <Field label="Note"><TextInput value={link.note ?? ""} disabled={!editable} onChange={(next) => setLink(index, { note: next || undefined })} /></Field>
          </div>
        </div>
      ))}
    </section>
  );
}
