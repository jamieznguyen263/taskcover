"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Bold, Heading2, Italic, List, ListOrdered, Quote, Redo2, Save, Undo2 } from "lucide-react";
import type { InsightArticle } from "@/content/insights.types";
import { InsightBlockRenderer } from "@/components/marketing/insights/insight-block-renderer";
import { normalizeTiptapToInsightBlocks } from "@/lib/admin/normalization";

const tabs = [
  "Document",
  "Search Strategy",
  "Content & Evidence",
  "Internal Linking",
  "Metadata & Social",
  "Schema",
  "Localization",
  "Publish QA",
] as const;

type SaveState = "Saved" | "Unsaved changes" | "Saving" | "Save failed" | "Conflict detected";

export function ArticleEditor({ article }: { article: InsightArticle }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Document");
  const [saveState, setSaveState] = useState<SaveState>("Saved");
  const [previewWidth, setPreviewWidth] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [showPreview, setShowPreview] = useState(true);
  const lastSaved = useRef("");
  const initialDoc = useMemo(() => ({
    type: "doc",
    content: [
      { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: article.h1 }] },
      ...article.blocks.slice(0, 8).map((block) => ({ type: "paragraph", content: [{ type: "text", text: "text" in block ? block.text : block.type }] })),
    ],
  }), [article]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Use / for blocks, or write directly." }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialDoc,
    editorProps: {
      attributes: {
        class: "min-h-[520px] rounded-lg border border-line bg-white px-4 py-3 text-sm leading-7 outline-none",
      },
    },
    onUpdate: ({ editor: current }) => {
      const value = JSON.stringify(current.getJSON());
      if (value !== lastSaved.current) setSaveState("Unsaved changes");
    },
  });

  useEffect(() => {
    if (!editor || saveState !== "Unsaved changes") return;
    const timer = window.setTimeout(async () => {
      setSaveState("Saving");
      try {
        const body = JSON.stringify({ editorDocument: editor.getJSON(), expectedVersion: 1 });
        const response = await fetch("/api/admin/insights/autosave", { method: "POST", headers: { "content-type": "application/json" }, body });
        if (response.status === 409) {
          setSaveState("Conflict detected");
          return;
        }
        if (!response.ok) throw new Error("Save failed");
        lastSaved.current = JSON.stringify(editor.getJSON());
        setSaveState("Saved");
      } catch {
        setSaveState("Save failed");
      }
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [editor, saveState]);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (saveState !== "Saved") {
        event.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [saveState]);

  const previewBlocks = editor ? normalizeTiptapToInsightBlocks(editor.getJSON()) : article.blocks;
  const previewArticle: InsightArticle = { ...article, blocks: previewBlocks.length ? previewBlocks : article.blocks };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white p-3">
        <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Editor tabs">
          {tabs.map((tab) => (
            <button key={tab} role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} className="min-h-10 shrink-0 rounded-lg px-3 text-sm font-medium aria-selected:bg-surface-tint aria-selected:text-brand-teal">
              {tab}
            </button>
          ))}
        </div>
        <p className="rounded-full border border-line px-3 py-1 text-xs text-secondary" aria-live="polite">{saveState}</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,0.9fr)]">
        <section className="min-w-0 rounded-xl border border-line bg-white p-4">
          {activeTab === "Document" ? (
            <>
              <Toolbar editor={editor} />
              <EditorContent editor={editor} />
              <div className="mt-3 flex flex-wrap gap-2">
                {["executive summary", "key takeaways", "direct answer", "definition", "callout", "comparison table", "checklist", "evidence/statistic", "FAQ", "CTA"].map((block) => (
                  <button key={block} className="rounded-lg border border-line px-3 py-2 text-xs text-secondary hover:text-brand-teal">+ {block}</button>
                ))}
              </div>
            </>
          ) : (
            <TabPanel name={activeTab} article={article} />
          )}
        </section>

        {showPreview ? (
          <aside className="min-w-0 rounded-xl border border-line bg-white p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-graphite">Side-by-side preview</p>
              <div className="flex gap-1">
                {(["desktop", "tablet", "mobile"] as const).map((item) => (
                  <button key={item} onClick={() => setPreviewWidth(item)} className="rounded-md border border-line px-2 py-1 text-xs text-secondary">{item}</button>
                ))}
                <button onClick={() => setShowPreview(false)} className="rounded-md border border-line px-2 py-1 text-xs text-secondary">hide</button>
              </div>
            </div>
            <div className={previewWidth === "mobile" ? "max-w-[390px]" : previewWidth === "tablet" ? "max-w-[768px]" : "max-w-full"}>
              <InsightBlockRenderer article={previewArticle} locale={article.locale} />
            </div>
          </aside>
        ) : (
          <button onClick={() => setShowPreview(true)} className="min-h-11 rounded-xl border border-line bg-white text-sm text-secondary">Show preview</button>
        )}
      </div>
    </div>
  );
}

function Toolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;
  const buttons = [
    { label: "Bold", icon: Bold, action: () => editor.chain().focus().toggleBold().run() },
    { label: "Italic", icon: Italic, action: () => editor.chain().focus().toggleItalic().run() },
    { label: "Heading", icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "Bullets", icon: List, action: () => editor.chain().focus().toggleBulletList().run() },
    { label: "Numbers", icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run() },
    { label: "Quote", icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run() },
    { label: "Undo", icon: Undo2, action: () => editor.chain().focus().undo().run() },
    { label: "Redo", icon: Redo2, action: () => editor.chain().focus().redo().run() },
    { label: "Save", icon: Save, action: () => editor.commands.focus() },
  ];
  return (
    <div className="mb-3 flex flex-wrap gap-1" role="toolbar" aria-label="Document formatting">
      {buttons.map((button) => {
        const Icon = button.icon;
        return (
          <button key={button.label} type="button" aria-label={button.label} title={button.label} onClick={button.action} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white text-secondary hover:text-brand-teal">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}

function TabPanel({ name, article }: { name: string; article: InsightArticle }) {
  const fields: Record<string, string[]> = {
    "Search Strategy": [article.searchStrategy.focusKeyword, article.searchStrategy.primaryIntent, article.searchStrategy.topicCluster, article.searchStrategy.aiCitationOpportunity],
    "Content & Evidence": article.contentEvidence.sources.map((source) => `${source.publisher}: ${source.title}`),
    "Internal Linking": article.internalLinking.serviceLinks.map((link) => `${link.label} (${link.href})`),
    "Metadata & Social": [article.metadata.metaTitle, article.metadata.metaDescription, article.metadata.canonical, article.metadata.ogTitle],
    Schema: [article.schema.schemaType, ...article.schema.aboutEntities, ...article.schema.mentions],
    Localization: [article.localization.hreflangGroup, article.localization.translationStatus, article.localization.translationNotes],
    "Publish QA": [article.publishQa.summary, article.publishQa.checkedAt],
  };
  return (
    <div className="grid gap-3">
      <h2 className="text-lg font-semibold text-graphite">{name}</h2>
      {(fields[name] ?? []).map((value, index) => (
        <label key={`${name}-${index}`} className="grid gap-1 text-sm text-secondary">
          Field {index + 1}
          <textarea defaultValue={value} className="min-h-20 rounded-lg border border-line bg-surface-soft p-3 text-sm text-graphite" />
        </label>
      ))}
    </div>
  );
}
