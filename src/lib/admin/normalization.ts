import type { InsightBlock, InsightInlineMark, InsightRichText, InsightRichTextSegment } from "@/content/insights.types";
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
  "video",
  "decision-framework",
  "case-study-reference",
  "sample-audit-reference",
  "related-service",
] as const;

export type StructuredBlockType = (typeof structuredBlockTypes)[number];

function textOf(node: TiptapNode): string {
  if (typeof node.text === "string") return node.text;
  return (node.content ?? []).map(textOf).join("");
}

function isSafeHref(href: string): boolean {
  return href.startsWith("/") || /^https?:\/\/[^\s]+$/i.test(href) || /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(href);
}

function marksOf(node: TiptapNode): InsightInlineMark[] | undefined {
  const marks: InsightInlineMark[] = [];
  for (const mark of node.marks ?? []) {
    if (mark.type === "bold") marks.push({ type: "bold" });
    if (mark.type === "italic") marks.push({ type: "italic" });
    if (mark.type === "code") marks.push({ type: "code" });
    if (mark.type === "link" && typeof mark.attrs?.href === "string" && isSafeHref(mark.attrs.href)) {
      marks.push({ type: "link", href: mark.attrs.href });
    }
  }
  return marks.length ? marks : undefined;
}

function richSegmentsOf(node: TiptapNode): InsightRichTextSegment[] {
  if (typeof node.text === "string") return [{ text: node.text, marks: marksOf(node) }];
  return (node.content ?? []).flatMap(richSegmentsOf);
}

function trimRichSegments(segments: InsightRichTextSegment[]): InsightRichTextSegment[] {
  const trimmed = segments.map((segment) => ({ ...segment })).filter((segment) => segment.text.length > 0);
  if (!trimmed.length) return [];
  trimmed[0] = { ...trimmed[0], text: trimmed[0]!.text.trimStart() };
  const lastIndex = trimmed.length - 1;
  trimmed[lastIndex] = { ...trimmed[lastIndex]!, text: trimmed[lastIndex]!.text.trimEnd() };
  return trimmed.filter((segment) => segment.text.length > 0);
}

function richTextOf(node: TiptapNode): InsightRichText {
  const segments = trimRichSegments(richSegmentsOf(node));
  const hasMarks = segments.some((segment) => segment.marks?.length);
  return hasMarks ? segments : segments.map((segment) => segment.text).join("");
}

function listItems(node: TiptapNode): InsightRichText[] {
  return (node.content ?? []).map(richTextOf).filter((item) => textFromRichText(item).trim());
}

function textFromRichText(value: InsightRichText): string {
  return typeof value === "string" ? value : value.map((segment) => segment.text).join("");
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
      if (node.type === "blockquote") return text ? { type: "quote", quote: richTextOf(node) } : null;
      if (node.type === "horizontalRule") return { type: "divider" };
      if (node.type === "codeBlock") {
        const language = typeof node.attrs?.language === "string" ? node.attrs.language : undefined;
        return text ? { type: "code", code: textOf(node), language } : null;
      }
      if (node.type === "table") return tableToComparisonTable(node);
      if (node.type === STRUCTURED_BLOCK_NODE) return structuredBlockToInsightBlock(node);
      return text ? { type: "paragraph", text: richTextOf(node) } : null;
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
