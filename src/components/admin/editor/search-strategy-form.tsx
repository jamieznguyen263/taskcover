"use client";

import type { InsightArticle } from "@/content/insights.types";
import { ChipListInput, Field, SelectInput, StringListEditor, TextArea, TextInput } from "./controls";

type Strategy = InsightArticle["searchStrategy"];

export function SearchStrategyForm({ article, editable, update }: { article: InsightArticle; editable: boolean; update: (value: Partial<InsightArticle>) => void }) {
  const strategy = article.searchStrategy;
  const set = (patch: Partial<Strategy>) => update({ searchStrategy: { ...strategy, ...patch } });

  return (
    <div className="grid gap-5">
      <section className="grid gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Target query</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Primary keyword / query" hint="The single query this article targets.">
            <TextInput value={strategy.focusKeyword} disabled={!editable} onChange={(focusKeyword) => set({ focusKeyword })} placeholder="e.g. international seo strategy" />
          </Field>
          <Field label="Core question" hint="The question the article must answer.">
            <TextInput value={strategy.coreQuestion} disabled={!editable} onChange={(coreQuestion) => set({ coreQuestion })} placeholder="e.g. How do you build an international SEO strategy?" />
          </Field>
        </div>
        <Field label="Secondary queries">
          <ChipListInput values={strategy.secondaryKeywords} disabled={!editable} onChange={(secondaryKeywords) => set({ secondaryKeywords })} placeholder="Add a secondary query and press Enter" />
        </Field>
      </section>

      <section className="grid gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Intent and audience</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Primary search intent">
            <TextInput value={strategy.primaryIntent} disabled={!editable} onChange={(primaryIntent) => set({ primaryIntent })} placeholder="e.g. informational — learn a process" />
          </Field>
          <Field label="Funnel stage">
            <SelectInput
              value={strategy.funnelStage}
              disabled={!editable}
              onChange={(funnelStage) => set({ funnelStage })}
              options={[
                { value: "awareness", label: "Awareness" },
                { value: "consideration", label: "Consideration" },
                { value: "decision", label: "Decision" },
                { value: "retention", label: "Retention" },
              ] as const}
            />
          </Field>
          <Field label="Target audience">
            <TextInput value={strategy.targetAudience} disabled={!editable} onChange={(targetAudience) => set({ targetAudience })} placeholder="e.g. in-house marketing leads at B2B SaaS" />
          </Field>
          <Field label="Target markets">
            <ChipListInput values={strategy.targetMarkets} disabled={!editable} onChange={(targetMarkets) => set({ targetMarkets })} placeholder="e.g. United States" />
          </Field>
        </div>
        <Field label="Secondary intents">
          <ChipListInput values={strategy.secondaryIntents} disabled={!editable} onChange={(secondaryIntents) => set({ secondaryIntents })} placeholder="Add an intent and press Enter" />
        </Field>
      </section>

      <section className="grid gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Topic and entities</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Topic cluster">
            <TextInput value={strategy.topicCluster} disabled={!editable} onChange={(topicCluster) => set({ topicCluster })} placeholder="e.g. international-seo" />
          </Field>
          <Field label="Parent pillar" hint="Slug or URL of the pillar this article supports.">
            <TextInput value={strategy.parentPillar} disabled={!editable} onChange={(parentPillar) => set({ parentPillar })} placeholder="e.g. /services/international-seo" />
          </Field>
          <Field label="Primary entity" hint="The main organization, product, or concept this article is about.">
            <TextInput value={strategy.primaryEntity} disabled={!editable} onChange={(primaryEntity) => set({ primaryEntity })} placeholder="e.g. hreflang" />
          </Field>
        </div>
        <Field label="Required entities" hint="Entities the article must name explicitly. The GEO panel tracks coverage.">
          <ChipListInput values={strategy.supportingEntities} disabled={!editable} onChange={(supportingEntities) => set({ supportingEntities })} placeholder="Add an entity and press Enter" />
        </Field>
        <Field label="Intentionally excluded entities" hint="Entities deliberately not covered — the GEO panel will not flag these as missing.">
          <ChipListInput values={strategy.excludedEntities ?? []} disabled={!editable} onChange={(excludedEntities) => set({ excludedEntities })} placeholder="Add an entity and press Enter" />
        </Field>
      </section>

      <section className="grid gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Angle and differentiation</h3>
        <Field label="SERP observations" hint="What actually ranks today — formats, angles, gaps.">
          <StringListEditor values={strategy.serpObservations} disabled={!editable} onChange={(serpObservations) => set({ serpObservations })} placeholder="e.g. Top results are listicles without process detail" />
        </Field>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Featured snippet opportunity">
            <TextArea value={strategy.featuredSnippetOpportunity} disabled={!editable} onChange={(featuredSnippetOpportunity) => set({ featuredSnippetOpportunity })} rows={2} />
          </Field>
          <Field label="AI citation opportunity">
            <TextArea value={strategy.aiCitationOpportunity} disabled={!editable} onChange={(aiCitationOpportunity) => set({ aiCitationOpportunity })} rows={2} />
          </Field>
        </div>
        <Field label="Unique information gain" hint="What this article adds that competitors do not have. First-party data, real experience, original analysis.">
          <TextArea value={strategy.uniqueInformationGain} disabled={!editable} onChange={(uniqueInformationGain) => set({ uniqueInformationGain })} rows={2} />
        </Field>
        <Field label="Refresh trigger" hint="What event or date should trigger a content refresh.">
          <TextInput value={strategy.refreshTrigger} disabled={!editable} onChange={(refreshTrigger) => set({ refreshTrigger })} placeholder="e.g. Google algorithm update or every 6 months" />
        </Field>
      </section>
    </div>
  );
}
