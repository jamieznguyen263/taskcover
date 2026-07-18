export type ExtractedAction = { title: string; sourceLine: number };

/**
 * Deterministic meeting-note action extraction (FLOW-011). No LLM, no external API — a
 * transparent, testable parser the user always reviews before anything is created. It
 * recognises the conventions people already use in notes:
 *   - unchecked task boxes:            "- [ ] Follow up with Vivagen"
 *   - explicit action/todo markers:    "ACTION: send the proposal", "TODO - book the room"
 *   - the "@name to do X" pattern:      "@Mai to draft the brief"
 * Checked boxes ("- [x]") are treated as already done and skipped. Titles are trimmed and
 * de-duplicated (case-insensitive); anything longer than 200 chars is clipped.
 *
 * "Preview before AI-created records / no autonomous execution" (blueprint FLOW-011): this
 * only returns candidates. Creating work items from them is a separate, explicit user step.
 */
const UNCHECKED_BOX = /^[-*]\s*\[\s\]\s*(.+)$/i;
const CHECKED_BOX = /^[-*]\s*\[[xX]\]\s*/;
const MARKER = /^(?:action|todo|to-do|task|follow[-\s]?up)\s*[:\-–]\s*(.+)$/i;
const ASSIGNEE = /^@[\w.-]+\s+to\s+(.+)$/i;

function normalize(title: string): string {
  return title.trim().replace(/\s+/g, " ").slice(0, 200);
}

export function extractActions(body: string): ExtractedAction[] {
  const lines = body.split(/\r?\n/);
  const seen = new Set<string>();
  const actions: ExtractedAction[] = [];

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) return;
    if (CHECKED_BOX.test(line)) return; // already done

    let title: string | null = null;
    const box = line.match(UNCHECKED_BOX);
    const marker = line.match(MARKER);
    const assignee = line.match(ASSIGNEE);
    if (box) title = box[1];
    else if (marker) title = marker[1];
    else if (assignee) title = assignee[1];

    if (!title) return;
    const normalized = normalize(title);
    if (!normalized) return;
    const key = normalized.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    actions.push({ title: normalized, sourceLine: index + 1 });
  });

  return actions;
}
