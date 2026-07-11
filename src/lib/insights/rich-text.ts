import type { InsightRichText } from "@/content/insights.types";

export function richTextToPlainText(value: InsightRichText): string {
  if (typeof value === "string") return value;
  return value.map((segment) => segment.text).join("");
}

export function richTextLinks(value: InsightRichText): string[] {
  if (typeof value === "string") return [];
  return value.flatMap((segment) => segment.marks?.filter((mark) => mark.type === "link").map((mark) => mark.href) ?? []);
}

export function richTextKey(value: InsightRichText): string {
  return richTextToPlainText(value);
}
