/**
 * @vitest-environment jsdom
 */

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { WorkItemSummary } from "@/lib/work/work-repository";
import { WorkBoard } from "./work-board";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// work-actions is a "use server" module that transitively pulls server-only; mock it.
vi.mock("@/lib/work/work-actions", () => ({
  moveWorkStatusAction: vi.fn().mockResolvedValue({ ok: true }),
  quickAddWorkAction: vi.fn().mockResolvedValue({ ok: true }),
}));

vi.mock("next/link", async () => {
  const React = await import("react");
  return {
    default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) =>
      React.createElement("a", { href, ...props }, children),
  };
});

let root: Root | null = null;
let container: HTMLDivElement | null = null;

afterEach(() => {
  if (root) act(() => root?.unmount());
  root = null;
  container?.remove();
  container = null;
});

function makeItem(overrides: Partial<WorkItemSummary> & { id: string; status: WorkItemSummary["status"] }): WorkItemSummary {
  return {
    id: overrides.id,
    type: overrides.type ?? "task",
    title: overrides.title ?? `Item ${overrides.id}`,
    status: overrides.status,
    ownerId: "u1",
    ownerName: "Mai",
    waitingTarget: overrides.waitingTarget ?? null,
    dueAt: overrides.dueAt ?? null,
    parentId: null,
  };
}

const items: WorkItemSummary[] = [
  makeItem({ id: "a", status: "to_do", title: "Draft brief" }),
  makeItem({ id: "b", status: "in_progress", title: "Build page" }),
  makeItem({ id: "c", status: "done", title: "Ship it" }),
];

function render(canManage: boolean) {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => {
    root?.render(<WorkBoard projectId="p1" items={items} canManage={canManage} />);
  });
  return container;
}

describe("WorkBoard", () => {
  it("renders all five status columns", () => {
    const el = render(true);
    for (const label of ["To do", "In progress", "Waiting", "Review", "Done"]) {
      expect(el.textContent).toContain(label);
    }
  });

  it("places each card under its status column and links to the drawer URL", () => {
    const el = render(true);
    const draft = el.querySelector('a[href="/flow/projects/p1?work=a"]');
    expect(draft?.textContent).toBe("Draft brief");
  });

  it("shows quick-add inputs for managers on every column except Waiting", () => {
    const el = render(true);
    const quickAdds = el.querySelectorAll('input[aria-label^="Add work to"]');
    // 5 statuses minus Waiting = 4.
    expect(quickAdds.length).toBe(4);
    expect(el.querySelector('input[aria-label="Add work to Waiting"]')).toBeNull();
  });

  it("makes cards draggable for managers and hides quick-add for read-only members", () => {
    const managerEl = render(true);
    expect(managerEl.querySelector('[draggable="true"]')).not.toBeNull();

    act(() => root?.unmount());
    container?.remove();

    const memberEl = render(false);
    expect(memberEl.querySelector('[draggable="true"]')).toBeNull();
    expect(memberEl.querySelectorAll('input[aria-label^="Add work to"]').length).toBe(0);
  });
});
