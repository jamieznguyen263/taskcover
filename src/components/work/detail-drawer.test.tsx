/**
 * @vitest-environment jsdom
 */

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DetailDrawer } from "./detail-drawer";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let mountedRoot: Root | null = null;
let mountedContainer: HTMLDivElement | null = null;

afterEach(() => {
  if (mountedRoot) act(() => mountedRoot?.unmount());
  mountedRoot = null;
  mountedContainer?.remove();
  mountedContainer = null;
  document.body.style.overflow = "";
});

function renderDrawer(open: boolean, onClose = vi.fn()) {
  mountedContainer = document.createElement("div");
  document.body.appendChild(mountedContainer);
  mountedRoot = createRoot(mountedContainer);
  act(() => {
    mountedRoot?.render(
      <DetailDrawer open={open} onClose={onClose} title="Preview">
        <button type="button">Inner action</button>
      </DetailDrawer>
    );
  });
  return { container: mountedContainer, onClose };
}

describe("DetailDrawer", () => {
  it("renders nothing when closed", () => {
    const { container } = renderDrawer(false);
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("renders a labelled dialog and moves focus to the close button when open", () => {
    const { container } = renderDrawer(true);
    const dialog = container.querySelector('[role="dialog"]');

    expect(dialog).not.toBeNull();
    expect(dialog?.getAttribute("aria-modal")).toBe("true");
    expect(document.activeElement?.getAttribute("aria-label")).toBe("Close panel");
  });

  it("locks body scroll while open and restores it on close", () => {
    const { onClose } = renderDrawer(true);
    expect(document.body.style.overflow).toBe("hidden");

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(onClose).toHaveBeenCalled();
  });

  it("closes on Escape", () => {
    const onClose = vi.fn();
    renderDrawer(true, onClose);

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when the backdrop is clicked", () => {
    const onClose = vi.fn();
    const { container } = renderDrawer(true, onClose);

    const backdrop = container.querySelector<HTMLDivElement>("[data-drawer-backdrop]");
    act(() => backdrop?.dispatchEvent(new MouseEvent("click", { bubbles: true })));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when clicking inside the panel", () => {
    const onClose = vi.fn();
    const { container } = renderDrawer(true, onClose);

    const panel = container.querySelector<HTMLDivElement>("[data-drawer-panel]");
    act(() => panel?.dispatchEvent(new MouseEvent("click", { bubbles: true })));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("anchors right by default and left when side='left' (used by the mobile nav overlay)", () => {
    mountedContainer = document.createElement("div");
    document.body.appendChild(mountedContainer);
    mountedRoot = createRoot(mountedContainer);
    act(() => {
      mountedRoot?.render(
        <DetailDrawer open onClose={() => {}} title="Menu" side="left">
          <span>Nav</span>
        </DetailDrawer>
      );
    });
    const panel = mountedContainer.querySelector<HTMLDivElement>("[data-drawer-panel]");
    expect(panel?.className).toContain("left-0");
    expect(panel?.className).not.toContain("right-0");
  });
});
