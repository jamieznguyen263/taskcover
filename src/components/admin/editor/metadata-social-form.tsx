"use client";

import { useMemo } from "react";
import type { InsightArticle } from "@/content/insights.types";
import { metadataGuidance, META_DESCRIPTION_MAX, SEO_TITLE_MAX } from "@/lib/admin/seo-guidance";
import { Field, SelectInput, StatusChip, TextArea, TextInput, type GuidanceStatus } from "./controls";

type Metadata = InsightArticle["metadata"];

export function MetadataSocialForm({
  article,
  editable,
  update,
  publishedSlug,
}: {
  article: InsightArticle;
  editable: boolean;
  update: (value: Partial<InsightArticle>) => void;
  publishedSlug: string | null;
}) {
  const metadata = article.metadata;
  const set = (patch: Partial<Metadata>) => update({ metadata: { ...metadata, ...patch } });
  const guidance = useMemo(() => metadataGuidance(article, publishedSlug), [article, publishedSlug]);
  const byField = (field: string) => guidance.filter((item) => item.field === field);

  const serpTitle = metadata.metaTitle || article.h1 || "Untitled";
  const serpDescription = metadata.metaDescription || article.excerpt || "No description yet.";
  const canonicalPreview = `https://taskcover.com${metadata.canonical || `/insights/${article.category}/${article.slug}`}`;

  return (
    <div className="grid gap-5">
      <section className="grid gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Google preview</h3>
        <div className="rounded-xl border border-line bg-white p-4">
          <p className="truncate text-xs text-emerald-800">{canonicalPreview}</p>
          <p className="mt-1 truncate text-lg leading-6 text-blue-800">{serpTitle.slice(0, SEO_TITLE_MAX)}{serpTitle.length > SEO_TITLE_MAX ? "…" : ""}</p>
          <p className="mt-1 text-sm leading-6 text-secondary">{serpDescription.slice(0, META_DESCRIPTION_MAX)}{serpDescription.length > META_DESCRIPTION_MAX ? "…" : ""}</p>
        </div>
        <p className="text-xs text-muted">Approximate preview. Google may rewrite titles and descriptions; length guidance indicates likely truncation only.</p>
      </section>

      <section className="grid gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Search metadata</h3>
        <GuidedField label="SEO title" hint={`${metadata.metaTitle.length}/${SEO_TITLE_MAX} characters`} results={byField("metaTitle")}>
          <TextInput value={metadata.metaTitle} disabled={!editable} onChange={(metaTitle) => set({ metaTitle })} />
        </GuidedField>
        <GuidedField label="Meta description" hint={`${metadata.metaDescription.length}/${META_DESCRIPTION_MAX} characters`} results={byField("metaDescription")}>
          <TextArea value={metadata.metaDescription} disabled={!editable} rows={3} onChange={(metaDescription) => set({ metaDescription })} />
        </GuidedField>
        <div className="grid gap-3 md:grid-cols-2">
          <GuidedField label="Slug" results={byField("slug")}>
            <TextInput value={article.slug} disabled={!editable} onChange={(slug) => update({ slug })} />
          </GuidedField>
          <GuidedField label="Canonical path" results={byField("canonical")}>
            <TextInput value={metadata.canonical} disabled={!editable} onChange={(canonical) => set({ canonical })} />
          </GuidedField>
          <GuidedField label="Robots" results={byField("robots")}>
            <SelectInput
              value={metadata.robots}
              disabled={!editable}
              onChange={(robots) => set({ robots })}
              options={[
                { value: "index,follow", label: "index,follow (default)" },
                { value: "noindex,nofollow", label: "noindex,nofollow" },
              ] as const}
            />
          </GuidedField>
          <Field label="Breadcrumb label">
            <TextInput value={metadata.breadcrumbLabel} disabled={!editable} onChange={(breadcrumbLabel) => set({ breadcrumbLabel })} />
          </Field>
        </div>
      </section>

      <section className="grid gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Authorship and dates</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Author"><TextInput value={article.author} disabled={!editable} onChange={(author) => update({ author })} /></Field>
          <Field label="Expert reviewer" hint="Only a real person who actually reviewed this article.">
            <TextInput value={article.expertReviewer ?? ""} disabled={!editable} onChange={(expertReviewer) => update({ expertReviewer: expertReviewer || undefined })} />
          </Field>
          <Field label="Published date" hint="Set automatically on publish."><TextInput value={article.publishedAt.slice(0, 10)} disabled onChange={() => undefined} /></Field>
          <Field label="Modified date" hint="Set automatically on save."><TextInput value={article.updatedAt.slice(0, 10)} disabled onChange={() => undefined} /></Field>
        </div>
      </section>

      <section className="grid gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Social preview</h3>
        <div className="max-w-md overflow-hidden rounded-xl border border-line bg-white">
          {metadata.ogImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={metadata.ogImage} alt="Social share preview" className="aspect-[1.91/1] w-full object-cover" />
          ) : (
            <div className="flex aspect-[1.91/1] items-center justify-center bg-surface-soft text-xs text-muted">No share image</div>
          )}
          <div className="border-t border-line p-3">
            <p className="truncate text-sm font-semibold text-graphite">{metadata.ogTitle || metadata.metaTitle || article.h1}</p>
            <p className="line-clamp-2 text-xs text-secondary">{metadata.ogDescription || metadata.metaDescription}</p>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-muted">taskcover.com</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <GuidedField label="Open Graph title" results={byField("ogTitle")}>
            <TextInput value={metadata.ogTitle} disabled={!editable} onChange={(ogTitle) => set({ ogTitle })} placeholder="Defaults to SEO title" />
          </GuidedField>
          <GuidedField label="Open Graph description" results={byField("ogDescription")}>
            <TextInput value={metadata.ogDescription} disabled={!editable} onChange={(ogDescription) => set({ ogDescription })} placeholder="Defaults to meta description" />
          </GuidedField>
          <GuidedField label="Share image URL" results={byField("ogImage")}>
            <TextInput value={metadata.ogImage} disabled={!editable} onChange={(ogImage) => set({ ogImage })} placeholder="https://…" />
          </GuidedField>
          <Field label="X/Twitter image URL">
            <TextInput value={metadata.twitterImage} disabled={!editable} onChange={(twitterImage) => set({ twitterImage })} placeholder="Defaults to share image" />
          </Field>
          <GuidedField label="X/Twitter title" results={byField("twitterTitle")}>
            <TextInput value={metadata.twitterTitle} disabled={!editable} onChange={(twitterTitle) => set({ twitterTitle })} placeholder="Defaults to OG title" />
          </GuidedField>
          <GuidedField label="X/Twitter description" results={byField("twitterDescription")}>
            <TextInput value={metadata.twitterDescription} disabled={!editable} onChange={(twitterDescription) => set({ twitterDescription })} placeholder="Defaults to OG description" />
          </GuidedField>
        </div>
      </section>
    </div>
  );
}

function GuidedField({ label, hint, results, children }: { label: string; hint?: string; results: { status: GuidanceStatus; message: string; code: string }[]; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Field label={label} hint={hint}>{children}</Field>
      {results.map((result) => (
        <p key={result.code} className="flex items-center gap-2 text-xs text-secondary">
          <StatusChip status={result.status} />
          {result.message}
        </p>
      ))}
    </div>
  );
}
