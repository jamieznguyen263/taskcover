import type { InsightBlock } from "@/content/insights.types";
import { tiptapDocumentSchema } from "./validation";

type TiptapNode = {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  text?: string;
  marks?: { type?: string; attrs?: Record<string, unknown> }[];
};

function textOf(node: TiptapNode): string {
  if (typeof node.text === "string") return node.text;
  return (node.content ?? []).map(textOf).join("");
}

function listItems(node: TiptapNode): string[] {
  return (node.content ?? []).map(textOf).map((item) => item.trim()).filter(Boolean);
}

export function normalizeTiptapToInsightBlocks(document: unknown): InsightBlock[] {
  const parsed = tiptapDocumentSchema.parse(document) as TiptapNode;
  return (parsed.content ?? [])
    .map((node): InsightBlock | null => {
      const text = textOf(node).trim();
      if (node.type === "heading") {
        const level = node.attrs?.level === 3 ? 3 : 2;
        return text ? { type: "heading", level, text } : null;
      }
      if (node.type === "bulletList") return { type: "bullet-list", items: listItems(node) };
      if (node.type === "orderedList") return { type: "numbered-list", items: listItems(node) };
      if (node.type === "blockquote") return text ? { type: "quote", quote: text } : null;
      if (node.type === "horizontalRule") return { type: "divider" };
      return text ? { type: "paragraph", text } : null;
    })
    .filter((block): block is InsightBlock => Boolean(block));
}

export function createStarterTiptapDocument(title = "Untitled article") {
  return {
    type: "doc",
    content: [
      { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: title }] },
      { type: "paragraph", content: [{ type: "text", text: "Write the draft body here." }] },
    ],
  };
}
