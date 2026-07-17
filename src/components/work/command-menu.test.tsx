/**
 * @vitest-environment jsdom
 */

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { FlowCommand } from "@/lib/work/commands";
import { CommandMenu } from "./command-menu";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

let mountedRoot: Root | null = null;
let mountedContainer: HTMLDivElement | null = null;

afterEach(() => {
  if (mountedRoot) act(() => mountedRoot?.unmount());
  mountedRoot = null;
  mountedContainer?.remove();
  mountedContainer = null;
  push.mockClear();
  document.body.style.overflow = "";
});

const commands: FlowCommand[] = [
  { id: "go-home", label: "Go to Home", kind: "navigate", href: "/flow" },
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

function renderMenuWithCommands(items: FlowCommand[], onSignOut = vi.fn().mockResolvedValue(undefined)) {
  mountedContainer = document.createElement("div");
  document.body.appendChild(mountedContainer);
  mountedRoot = createRoot(mountedContainer);
  act(() => {
    mountedRoot?.render(<CommandMenu commands={items} onSignOut={onSignOut} />);
  });
  return { container: mountedContainer, onSignOut };
}

describe("CommandMenu", () => {
  it("is closed by default and opens when the trigger is clicked", () => {
    const { container } = renderMenu();
    expect(container.querySelector('[role="dialog"]')).toBeNull();

    openViaClick(container);

    expect(container.querySelector('[role="dialog"]')).not.toBeNull();
  });

  it("opens on Ctrl+K and closes on Escape, restoring focus to the trigger", () => {
    const { container } = renderMenu();
    const trigger = container.querySelector<HTMLButtonElement>("button")!;
    trigger.focus();

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
    });
    const dialog = container.querySelector<HTMLDivElement>('[role="dialog"]');
    expect(dialog).not.toBeNull();

    act(() => {
      dialog?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });

    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("navigates when a navigate command is chosen", () => {
    const { container } = renderMenu();
    openViaClick(container);

    const homeOption = Array.from(container.querySelectorAll<HTMLButtonElement>("[data-command-item]")).find(
      (item) => item.textContent === "Go to Home"
    );
    act(() => homeOption?.dispatchEvent(new MouseEvent("click", { bubbles: true })));

    expect(push).toHaveBeenCalledWith("/flow");
  });

  it("calls onSignOut when the sign-out command is chosen", async () => {
    const onSignOut = vi.fn().mockResolvedValue(undefined);
    const { container } = renderMenu(onSignOut);
    openViaClick(container);

    const signOutOption = Array.from(container.querySelectorAll<HTMLButtonElement>("[data-command-item]")).find(
      (item) => item.textContent === "Sign out"
    );
    await act(async () => {
      signOutOption?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onSignOut).toHaveBeenCalled();
  });

  it("closes when clicking the backdrop outside the dialog", () => {
    const { container } = renderMenu();
    openViaClick(container);

    const backdrop = container.querySelector<HTMLDivElement>("[data-command-menu-backdrop]");
    act(() => backdrop?.dispatchEvent(new MouseEvent("click", { bubbles: true })));

    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it("does not use listbox/option semantics for commands", () => {
    const { container } = renderMenu();
    openViaClick(container);

    expect(container.querySelector('[role="listbox"]')).toBeNull();
    expect(container.querySelector('[role="option"]')).toBeNull();
    expect(container.querySelectorAll("[data-command-item]").length).toBeGreaterThan(0);
  });

  it("exposes aria-haspopup, aria-controls, and toggles aria-expanded on the trigger", () => {
    const { container } = renderMenu();
    const trigger = container.querySelector<HTMLButtonElement>("button")!;

    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    const controlsId = trigger.getAttribute("aria-controls");
    expect(controlsId).toBeTruthy();

    openViaClick(container);

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(container.querySelector(`#${controlsId}`)).not.toBeNull();
  });

  it("locks body scroll while open and restores it on close", () => {
    const { container } = renderMenu();
    expect(document.body.style.overflow).toBe("");

    openViaClick(container);
    expect(document.body.style.overflow).toBe("hidden");

    const dialog = container.querySelector<HTMLDivElement>('[role="dialog"]');
    act(() => {
      dialog?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(document.body.style.overflow).toBe("");
  });

  it("guards safely against an empty command list", () => {
    const { container } = renderMenuWithCommands([]);
    const trigger = container.querySelector<HTMLButtonElement>("button")!;

    openViaClick(container);
    const dialog = container.querySelector<HTMLDivElement>('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog?.textContent).toContain("No commands available");
    expect(container.querySelectorAll("[data-command-item]").length).toBe(0);

    act(() => {
      dialog?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
      dialog?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    });
    expect(dialog).not.toBeNull();

    act(() => {
      dialog?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});
