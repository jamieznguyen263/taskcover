/**
 * @vitest-environment jsdom
 */

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FlowCommand } from "@/lib/work/commands";
import { CommandMenu } from "./command-menu";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

let mountedRoot: Root | null = null;
let mountedContainer: HTMLDivElement | null = null;

beforeEach(() => {
  // The palette fetches /api/flow/search once the query reaches 2 chars; default to empty.
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [] }) })
  );
});

afterEach(() => {
  if (mountedRoot) act(() => mountedRoot?.unmount());
  mountedRoot = null;
  mountedContainer?.remove();
  mountedContainer = null;
  push.mockClear();
  document.body.style.overflow = "";
  vi.unstubAllGlobals();
});

const commands: FlowCommand[] = [
  { id: "go-home", label: "Go to Home", kind: "navigate", href: "/flow" },
  { id: "go-cms", label: "Go to Content CMS", kind: "navigate", href: "/admin" },
  { id: "sign-out", label: "Sign out", kind: "sign-out" },
];

function renderMenu(onSignOut = vi.fn().mockResolvedValue(undefined)) {
  mountedContainer = document.createElement("div");
  document.body.appendChild(mountedContainer);
  mountedRoot = createRoot(mountedContainer);
  act(() => {
    mountedRoot?.render(<CommandMenu commands={commands} onSignOut={onSignOut} />);
  });
  return { container: mountedContainer, onSignOut };
}

function openViaClick(container: HTMLDivElement) {
  const trigger = container.querySelector<HTMLButtonElement>("button");
  act(() => trigger?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
  return trigger;
}

function input(container: HTMLDivElement) {
  return container.querySelector<HTMLInputElement>('input[role="combobox"]');
}

function typeQuery(container: HTMLDivElement, value: string) {
  const el = input(container)!;
  // React tracks the controlled value, so set through the native setter before dispatching
  // the input event, otherwise React's onChange is skipped.
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  act(() => {
    setter?.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

describe("CommandMenu palette", () => {
  it("is closed by default and opens as a combobox on click", () => {
    const { container } = renderMenu();
    expect(container.querySelector('[role="dialog"]')).toBeNull();

    openViaClick(container);

    expect(container.querySelector('[role="dialog"]')).not.toBeNull();
    expect(input(container)).not.toBeNull();
    expect(container.querySelector('[role="listbox"]')).not.toBeNull();
  });

  it("opens on Ctrl+K and closes on Escape from the input, restoring focus to the trigger", () => {
    const { container } = renderMenu();
    const trigger = container.querySelector<HTMLButtonElement>("button")!;
    trigger.focus();

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
    });
    expect(container.querySelector('[role="dialog"]')).not.toBeNull();

    act(() => {
      input(container)?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });

    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("shows the static commands as options when the query is empty", () => {
    const { container } = renderMenu();
    openViaClick(container);
    const labels = Array.from(container.querySelectorAll("[data-command-item]")).map((el) => el.textContent);
    expect(labels.some((l) => l?.includes("Go to Home"))).toBe(true);
    expect(labels.some((l) => l?.includes("Sign out"))).toBe(true);
  });

  it("filters static commands by the typed query", () => {
    const { container } = renderMenu();
    openViaClick(container);
    typeQuery(container, "cms");
    const labels = Array.from(container.querySelectorAll("[data-command-item]")).map((el) => el.textContent);
    expect(labels.some((l) => l?.includes("Content CMS"))).toBe(true);
    expect(labels.some((l) => l?.includes("Go to Home"))).toBe(false);
  });

  it("navigates when a command option is clicked", () => {
    const { container } = renderMenu();
    openViaClick(container);
    const home = Array.from(container.querySelectorAll<HTMLButtonElement>("[data-command-item]")).find((el) =>
      el.textContent?.includes("Go to Home")
    );
    act(() => home?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(push).toHaveBeenCalledWith("/flow");
  });

  it("calls onSignOut when the sign-out option is chosen", async () => {
    const onSignOut = vi.fn().mockResolvedValue(undefined);
    const { container } = renderMenu(onSignOut);
    openViaClick(container);
    const signOut = Array.from(container.querySelectorAll<HTMLButtonElement>("[data-command-item]")).find((el) =>
      el.textContent?.includes("Sign out")
    );
    await act(async () => {
      signOut?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(onSignOut).toHaveBeenCalled();
  });

  it("selects the active option with Enter after ArrowDown", () => {
    const { container } = renderMenu();
    openViaClick(container);
    const el = input(container)!;
    // First option (Go to Home) is active by default; Enter selects it.
    act(() => el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })));
    expect(push).toHaveBeenCalledWith("/flow");
  });

  it("exposes combobox ARIA and toggles aria-expanded on the trigger", () => {
    const { container } = renderMenu();
    const trigger = container.querySelector<HTMLButtonElement>("button")!;
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    openViaClick(container);

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(input(container)?.getAttribute("aria-autocomplete")).toBe("list");
    expect(input(container)?.getAttribute("aria-controls")).toBe(
      container.querySelector('[role="listbox"]')?.id
    );
  });

  it("locks body scroll while open and restores it on close", () => {
    const { container } = renderMenu();
    expect(document.body.style.overflow).toBe("");
    openViaClick(container);
    expect(document.body.style.overflow).toBe("hidden");
    act(() => {
      input(container)?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(document.body.style.overflow).toBe("");
  });

  it("closes when the backdrop is clicked", () => {
    const { container } = renderMenu();
    openViaClick(container);
    const backdrop = container.querySelector<HTMLDivElement>("[data-command-menu-backdrop]");
    act(() => backdrop?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });
});
