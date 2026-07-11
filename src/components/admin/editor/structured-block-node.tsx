"use client";

import { useState } from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from "@tiptap/react";
import { ChevronUp, Pencil, Trash2 } from "lucide-react";
import type { InsightBlock } from "@/content/insights.types";
import { STRUCTURED_BLOCK_NODE, structuredBlockTypes, type StructuredBlockType } from "@/lib/admin/normalization";
import { insightBlockSchema } from "@/lib/admin/validation";
import { structuredBlockMeta } from "./structured-block-defaults";
import { StructuredBlockDataForm } from "./structured-block-form";
import { SmallButton } from "./controls";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    structuredBlock: {
      insertStructuredBlock: (blockType: StructuredBlockType, data: InsightBlock) => ReturnType;
    };
  }
}

export const StructuredBlock = Node.create({
  name: STRUCTURED_BLOCK_NODE,
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      blockType: { default: "callout" },
      data: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-structured-block]",
        getAttrs: (element) => {
          const raw = (element as HTMLElement).getAttribute("data-structured-block-data");
          try {
            return { blockType: (element as HTMLElement).getAttribute("data-structured-block"), data: raw ? JSON.parse(raw) : null };
          } catch {
            return false;
          }
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-structured-block": node.attrs.blockType,
        "data-structured-block-data": JSON.stringify(node.attrs.data ?? null),
      }),
    ];
  },

  addCommands() {
    return {
      insertStructuredBlock:
        (blockType, data) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { blockType, data } }),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(StructuredBlockView);
  },
});

function StructuredBlockView({ node, updateAttributes, deleteNode, editor }: NodeViewProps) {
  const blockType = node.attrs.blockType as StructuredBlockType;
  const parsed = insightBlockSchema.safeParse(node.attrs.data);
  const meta = structuredBlockTypes.includes(blockType) ? structuredBlockMeta[blockType] : { label: blockType, description: "" };
  const [editing, setEditing] = useState(false);
  const editable = editor.isEditable;

  return (
    <NodeViewWrapper as="div" data-structured-block-view={blockType} className="my-3 rounded-xl border border-brand-teal/25 bg-surface-tint/40">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-soft px-3 py-2" contentEditable={false} data-drag-handle>
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-teal">{meta.label}</span>
        {editable ? (
          <span className="flex gap-1">
            <SmallButton ariaLabel={editing ? "Collapse block editor" : "Edit block"} onClick={() => setEditing((value) => !value)}>
              {editing ? <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" /> : <Pencil className="h-3.5 w-3.5" aria-hidden="true" />}
              {editing ? "Done" : "Edit"}
            </SmallButton>
            <SmallButton ariaLabel="Delete block" tone="danger" onClick={() => deleteNode()}>
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </SmallButton>
          </span>
        ) : null}
      </div>
      <div className="p-3" contentEditable={false}>
        {editing && editable && parsed.success ? (
          <StructuredBlockDataForm value={parsed.data} onChange={(data) => updateAttributes({ data })} />
        ) : parsed.success ? (
          <StructuredBlockPreview block={parsed.data} />
        ) : (
          <p className="text-sm text-red-700">This block contains invalid data and will be dropped on save. Edit or delete it.</p>
        )}
      </div>
    </NodeViewWrapper>
  );
}

function StructuredBlockPreview({ block }: { block: InsightBlock }) {
  switch (block.type) {
    case "direct-answer":
      return <Preview title={block.title} body={block.answer} />;
    case "key-takeaways":
      return <Preview title={block.title} list={block.items} />;
    case "definition":
      return <Preview title={block.term} body={block.definition} />;
    case "callout":
      return <Preview title={block.title} body={block.body} />;
    case "checklist":
      return <Preview title={block.title} list={block.items.map((item) => [item.label, item.detail].filter(Boolean).join(" — "))} />;
    case "steps":
      return <Preview title={block.title} list={block.steps.map((step, index) => `${index + 1}. ${step.title}`)} />;
    case "faq":
      return <Preview title={`FAQ (${block.items.length})`} list={block.items.map((item) => item.question)} />;
    case "pros-cons":
      return <Preview title={block.title} body={`${block.pros.filter(Boolean).length} pros · ${block.cons.filter(Boolean).length} cons`} />;
    case "comparison-table":
      return <Preview title={block.caption || "Comparison table"} body={`${block.columns.length} columns · ${block.rows.length} rows`} />;
    case "statistic":
      return <Preview title={block.value || "—"} body={block.label} />;
    case "expert-insight":
      return <Preview title={block.title} body={block.body} />;
    case "cta":
      return <Preview title={block.title || "Call to action"} body={block.primary.label ? `Primary: ${block.primary.label}` : "No primary button yet."} />;
    case "image":
      return block.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={block.src} alt={block.alt} className="max-h-64 rounded-lg border border-line object-contain" />
      ) : (
        <Preview title="Image" body="No image URL yet." />
      );
    default:
      return <Preview title={block.type} body="" />;
  }
}

function Preview({ title, body, list }: { title: string; body?: string; list?: string[] }) {
  return (
    <div className="grid gap-1.5">
      <p className="text-sm font-semibold text-graphite">{title || "Untitled"}</p>
      {body ? <p className="line-clamp-3 text-sm leading-6 text-secondary">{body}</p> : null}
      {list ? (
        <ul className="grid gap-1">
          {list.filter(Boolean).slice(0, 6).map((item, index) => (
            <li key={index} className="text-sm leading-6 text-secondary">• {item}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
