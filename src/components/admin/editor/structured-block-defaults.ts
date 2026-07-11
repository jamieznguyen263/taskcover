import type { InsightBlock } from "@/content/insights.types";
import type { StructuredBlockType } from "@/lib/admin/normalization";

export const structuredBlockMeta: Record<StructuredBlockType, { label: string; description: string }> = {
  "direct-answer": { label: "Direct answer", description: "Concise answer to the core question, placed near the top." },
  "key-takeaways": { label: "Key takeaways", description: "Scannable summary list of the article's main points." },
  definition: { label: "Definition", description: "Term plus a clear one-paragraph definition." },
  callout: { label: "Callout", description: "Highlighted note, tip, or warning." },
  checklist: { label: "Checklist", description: "Actionable checklist with labels and detail." },
  steps: { label: "Step-by-step process", description: "Numbered process with a title and body per step." },
  faq: { label: "FAQ", description: "Question and answer pairs. Kept in sync with FAQ schema." },
  "pros-cons": { label: "Pros & cons", description: "Balanced two-column comparison." },
  "comparison-table": { label: "Comparison table", description: "Captioned table comparing options." },
  statistic: { label: "Statistic", description: "A single highlighted metric. Link it to an evidence source." },
  "expert-insight": { label: "Expert insight", description: "First-party experience or practitioner commentary." },
  cta: { label: "Call to action", description: "Primary conversion prompt with buttons." },
  image: { label: "Image", description: "Image with required alt text and optional caption." },
  video: { label: "YouTube video", description: "Embed a YouTube video (privacy-friendly, lazy-loaded)." },
  "decision-framework": { label: "Decision framework", description: "Signal → recommended action pairs." },
  "case-study-reference": { label: "Case study reference", description: "Link to a Taskcover case study." },
  "sample-audit-reference": { label: "Sample audit reference", description: "Link to a Taskcover sample audit." },
  "related-service": { label: "Related service", description: "Link to a related Taskcover service." },
};

export function defaultStructuredBlockData(type: StructuredBlockType): InsightBlock {
  switch (type) {
    case "direct-answer":
      return { type, title: "Direct answer", answer: "" };
    case "key-takeaways":
      return { type, title: "Key takeaways", items: [""] };
    case "definition":
      return { type, term: "", definition: "" };
    case "callout":
      return { type, title: "", body: "", tone: "blue" };
    case "checklist":
      return { type, title: "Checklist", items: [{ label: "", detail: "" }] };
    case "steps":
      return { type, title: "Process", steps: [{ title: "", body: "" }] };
    case "faq":
      return { type, items: [{ question: "", answer: "" }] };
    case "pros-cons":
      return { type, title: "Pros and cons", pros: [""], cons: [""] };
    case "comparison-table":
      return { type, caption: "", columns: ["Option", "Details"], rows: [["", ""]] };
    case "statistic":
      return { type, value: "", label: "" };
    case "expert-insight":
      return { type, title: "Expert insight", body: "" };
    case "cta":
      return { type, title: "", body: "", primary: { label: "", href: "" } };
    case "image":
      return { type, src: "", alt: "" };
    case "video":
      return { type, provider: "youtube", videoId: "", title: "" };
    case "decision-framework":
      return { type, title: "Decision framework", criteria: [{ signal: "", action: "" }] };
    case "case-study-reference":
    case "sample-audit-reference":
    case "related-service":
      return { type, title: "", href: "", summary: "" };
  }
}
