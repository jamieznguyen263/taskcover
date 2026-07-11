"use client";

import { useMemo } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import type { InsightArticle } from "@/content/insights.types";
import { articleJsonLd, faqJsonLd } from "@/lib/insights/seo";
import { ChipListInput, Field, SelectInput, SmallButton } from "./controls";

type SchemaConfig = InsightArticle["schema"];

export function SchemaBuilder({ article, editable, update }: { article: InsightArticle; editable: boolean; update: (value: Partial<InsightArticle>) => void }) {
  const schema = article.schema;
  const set = (patch: Partial<SchemaConfig>) => update({ schema: { ...schema, ...patch } });

  const bodyFaqItems = useMemo(
    () => article.blocks.filter((block): block is Extract<typeof block, { type: "faq" }> => block.type === "faq").flatMap((block) => block.items),
    [article.blocks]
  );
  const faqOutOfSync = useMemo(() => {
    if (schema.faqItems.length !== bodyFaqItems.length) return true;
    return schema.faqItems.some((item) => !bodyFaqItems.some((visible) => visible.question === item.question && visible.answer === item.answer));
  }, [schema.faqItems, bodyFaqItems]);

  const jsonLdPreview = useMemo(() => {
    const documents: unknown[] = [articleJsonLd(article, article.locale)];
    const faq = faqJsonLd(article);
    if (faq) documents.push(faq);
    return JSON.stringify(documents.length === 1 ? documents[0] : documents, null, 2);
  }, [article]);

  return (
    <div className="grid gap-5">
      <div className="rounded-lg border border-line bg-surface-soft p-3 text-xs leading-5 text-secondary">
        Structured data must describe only what is real and visible on the page. AggregateRating, Review, invented Person entities, and awards are not supported. FAQ schema must
        exactly match visible FAQ blocks — Publish QA enforces this.
      </div>

      <section className="grid gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Article schema</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Schema type" hint="BlogPosting is a subtype of Article for blog-style content.">
            <SelectInput
              value={schema.schemaType}
              disabled={!editable}
              onChange={(schemaType) => set({ schemaType })}
              options={[
                { value: "Article", label: "Article" },
                { value: "BlogPosting", label: "BlogPosting" },
              ] as const}
            />
          </Field>
        </div>
        <Field label="About entities" hint="What the article is primarily about (schema.org about).">
          <ChipListInput values={schema.aboutEntities} disabled={!editable} onChange={(aboutEntities) => set({ aboutEntities })} />
        </Field>
        <Field label="Mentioned entities" hint="Entities discussed but not the core topic (schema.org mentions).">
          <ChipListInput values={schema.mentions} disabled={!editable} onChange={(mentions) => set({ mentions })} />
        </Field>
        <Field label="Citation URLs" hint="External sources cited by this article (schema.org citation).">
          <ChipListInput values={schema.citationReferences} disabled={!editable} onChange={(citationReferences) => set({ citationReferences })} placeholder="https://…" />
        </Field>
        {article.contentEvidence.sources.length > 0 && editable ? (
          <SmallButton
            onClick={() => {
              const urls = article.contentEvidence.sources.filter((source) => !source.primarySource && source.url).map((source) => source.url);
              set({ citationReferences: [...new Set([...schema.citationReferences, ...urls])] });
            }}
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Import independent sources from Evidence
          </SmallButton>
        ) : null}
      </section>

      <section className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">FAQ schema ({schema.faqItems.length})</h3>
          {editable ? (
            <SmallButton tone={faqOutOfSync ? "primary" : "default"} onClick={() => set({ faqItems: bodyFaqItems })}>
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Sync from body FAQ blocks ({bodyFaqItems.length})
            </SmallButton>
          ) : null}
        </div>
        {faqOutOfSync ? (
          <p role="alert" className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            FAQ schema does not match the FAQ blocks in the document. Publishing is blocked until they match — use “Sync from body FAQ blocks”.
          </p>
        ) : (
          <p className="text-xs text-emerald-700">FAQ schema matches the visible FAQ content{schema.faqItems.length === 0 ? " (none present — FAQPage schema will not be emitted)" : ""}.</p>
        )}
        {schema.faqItems.map((item, index) => (
          <div key={index} className="rounded-lg border border-line-soft bg-surface-soft p-3">
            <p className="text-sm font-medium text-graphite">{item.question || "Untitled question"}</p>
            <p className="mt-1 text-xs leading-5 text-secondary">{item.answer}</p>
          </div>
        ))}
        <p className="text-xs text-muted">FAQ items are edited in the document via FAQ blocks; the schema mirrors them exactly.</p>
      </section>

      <section className="grid gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">JSON-LD preview</h3>
        <p className="text-xs text-muted">Exactly what the public page will emit for this locale (Organization publisher and breadcrumbs are added by the page template).</p>
        <pre className="max-h-96 overflow-auto rounded-xl border border-line bg-graphite p-4 text-xs leading-5 text-white">{jsonLdPreview}</pre>
      </section>
    </div>
  );
}
