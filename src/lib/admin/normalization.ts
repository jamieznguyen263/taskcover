import type { InsightBlock } from "@/content/insights.types";
import { insightBlockSchema, tiptapDocumentSchema } from "./validation";

type TiptapNode = {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  text?: string;
  marks?: { type?: string; attrs?: Record<string, unknown> }[];
};

/** Node type name for the structured block atom used by the visual editor. */
export const STRUCTURED_BLOCK_NODE = "structuredBlock";

/** Block types Staff can insert as structured blocks from the editor. */
export const structuredBlockTypes = [
  "direct-answer",
  "key-takeaways",
  "definition",
  "callout",
  "checklist",
  "steps",
  "faq",
  "pros-cons",
  "comparison-table",
  "statistic",
  "expert-insight",
  "cta",
  "image",
] as const;

export type StructuredBlockType = (typeof structuredBlockTypes)[number];

function textOf(node: TiptapNode): string {
  if (typeof node.text === "string") return node.text;
  return (node.content ?? []).map(textOf).join("");
}

function listItems(node: TiptapNode): string[] {
  return (node.content ?? []).map(textOf).map((item) => item.trim()).filter(Boolean);
}

function tableToComparisonTable(node: TiptapNode): InsightBlock | null {
  const rows = (node.content ?? []).filter((row) => row.type === "tableRow");
  if (!rows.length) return null;
  const [head, ...body] = rows;
  const columns = (head.content ?? []).map((cell) => textOf(cell).trim());
  if (!columns.some(Boolean)) return null;
  return {
    type: "comparison-table",
    caption: "",
    columns,
    rows: body.map((row) => (row.content ?? []).map((cell) => textOf(cell).trim())),
  };
}

function structuredBlockToInsightBlock(node: TiptapNode): InsightBlock | null {
  const data = node.attrs?.data;
  if (!data || typeof data !== "object") return null;
  const parsed = insightBlockSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

export function normalizeTiptapToInsightBlocks(document: unknown): InsightBlock[] {
  const parsed = tiptapDocumentSchema.parse(document) as TiptapNode;
  return (parsed.content ?? [])
    .map((node): InsightBlock | null => {
      const text = textOf(node).trim();
      if (node.type === "heading") {
        const rawLevel = node.attrs?.level;
        const level = rawLevel === 3 ? 3 : rawLevel === 4 ? 4 : 2;
        return text ? { type: "heading", level, text } : null;
      }
      if (node.type === "bulletList") return { type: "bullet-list", items: listItems(node) };
      if (node.type === "orderedList") return { type: "numbered-list", items: listItems(node) };
      if (node.type === "blockquote") return text ? { type: "quote", quote: text } : null;
      if (node.type === "horizontalRule") return { type: "divider" };
      if (node.type === "codeBlock") {
        const language = typeof node.attrs?.language === "string" ? node.attrs.language : undefined;
        return text ? { type: "code", code: textOf(node), language } : null;
      }
      if (node.type === "table") return tableToComparisonTable(node);
      if (node.type === STRUCTURED_BLOCK_NODE) return structuredBlockToInsightBlock(node);
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
