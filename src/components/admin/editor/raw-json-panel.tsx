"use client";

import { useState } from "react";
import type { InsightArticle } from "@/content/insights.types";

const sections = ["searchStrategy", "contentEvidence", "internalLinking", "metadata", "schema", "localization"] as const;
type Section = (typeof sections)[number];

/**
 * Developer-mode raw JSON access. Hidden from Staff; Admin only. The visual
 * forms are the supported editing surface — this exists for debugging and
 * exceptional data fixes.
 */
export function RawJsonPanel({ article, editable, update, setError }: { article: InsightArticle; editable: boolean; update: (value: Partial<InsightArticle>) => void; setError: (value: string) => void }) {
  const [section, setSection] = useState<Section>("searchStrategy");
  const [text, setText] = useState(() => JSON.stringify(article[section], null, 2));

  const switchSection = (next: Section) => {
    setSection(next);
    setText(JSON.stringify(article[next], null, 2));
    setError("");
  };

  return (
    <div className="grid gap-3">
      <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
        Developer mode. Edits here bypass the structured forms but not validation — invalid JSON cannot be saved, and the typed schema is enforced server-side on save.
      </p>
      <div className="flex flex-wrap gap-1" role="tablist" aria-label="Raw JSON sections">
        {sections.map((item) => (
          <button
            key={item}
            role="tab"
            aria-selected={section === item}
            onClick={() => switchSection(item)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${section === item ? "bg-surface-tint text-brand-teal" : "text-secondary hover:text-brand-teal"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <textarea
        disabled={!editable}
        value={text}
        onChange={(event) => {
          const next = event.target.value;
          setText(next);
          try {
            const parsed = JSON.parse(next);
            update({ [section]: parsed } as Partial<InsightArticle>);
            setError("");
          } catch {
            setError(`${section} contains invalid JSON and cannot be saved.`);
          }
        }}
        className="min-h-[24rem] rounded-lg border border-line bg-surface-soft p-3 font-mono text-xs disabled:opacity-70"
      />
    </div>
  );
}
