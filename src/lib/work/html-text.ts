/**
 * Converts the rich-editor HTML stored in a document body back to a plain-text outline, so
 * the deterministic meeting-note action extraction (FLOW-011) keeps working unchanged: list
 * items become "- …" lines (a "- [ ] …" a user typed survives as "- [ ] …"), block elements
 * become line breaks, and tags/entities are stripped. Pure and unit-tested; no DOM, so it
 * runs on the server.
 */
export function htmlToText(html: string): string {
  return html
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<\/(p|div|h[1-6]|blockquote|tr)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** True when the HTML has no visible text (empty editor still emits "<p></p>"). */
export function isHtmlEmpty(html: string): boolean {
  return htmlToText(html).length === 0;
}
