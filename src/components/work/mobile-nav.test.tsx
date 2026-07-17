/**
 * @vitest-environment jsdom
 */

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { FlowNavItem } from "@/lib/work/nav";
import { MobileNav } from "./mobile-nav";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock("next/link", async () => {
  const React = await import("react");
  return {
    default: ({
      href,
      children,
      ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) =>
      React.createElement("a", { href, ...props }, children),
  };
});

let mountedRoot: Root | null = null;
let mountedContainer: HTMLDivElement | null = null;

afterEach(() => {
  if (mountedRoot) act(() => mountedRoot?.unmount());
  mountedRoot = null;
  mountedContainer?.remove();
  mountedContainer = null;
  document.body.style.overflow = "";
});

const primary: FlowNavItem[] = [
  { href: "/flow", label: "Home", enabled: true },
  { href: "/flow/inbox", label: "Inbox", enabled: false },
];
const adminNav: FlowNavItem[] = [{ href: "/admin", label: "Content CMS", enabled: true }];

function renderNav() {
  mountedContainer = document.createElement("div");
  document.body.appendChild(mountedContainer);
  mountedRoot = createRoot(mountedContainer);
  act(() => {
    mountedRoot?.render(<MobileNav primary={primary} adminNav={adminNav} />);
  });
  return mountedContainer;
}

function getTrigger(container: HTMLDivElement) {
  return container.querySelector<HTMLButtonElement>('button[aria-label="Open navigation menu"]')!;
}

describe("MobileNav", () => {
  it("is closed by default; the trigger carries dialog ARIA state", () => {
    const container = renderNav();
    expect(container.querySelector('[role="dialog"]')).toBeNull();

    const trigger = getTrigger(container);
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.getAttribute("aria-controls")).toBeTruthy();
  });

  it("opens the overlay on trigger click and exposes nav links", () => {
    const container = renderNav();
    const trigger = getTrigger(container);

    act(() => trigger.dispatchEvent(new MouseEvent("click", { bubbles: true })));

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog?.querySelector('a[href="/flow"]')).not.toBeNull();
    expect(dialog?.querySelector('a[href="/admin"]')).not.toBeNull();
  });

  it("closes on Escape and restores focus to the trigger", () => {
    const container = renderNav();
    const trigger = getTrigger(container);
    trigger.focus();

    act(() => trigger.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(container.querySelector('[role="dialog"]')).not.toBeNull();

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });

    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("closes when the backdrop is clicked", () => {
    const container = renderNav();
    const trigger = getTrigger(container);
    act(() => trigger.dispatchEvent(new MouseEvent("click", { bubbles: true })));

    const backdrop = container.querySelector<HTMLDivElement>("[data-drawer-backdrop]");
    act(() => backdrop?.dispatchEvent(new MouseEvent("click", { bubbles: true })));

    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it("closes when an enabled nav link is followed", () => {
    const container = renderNav();
    const trigger = getTrigger(container);
    act(() => trigger.dispatchEvent(new MouseEvent("click", { bubbles: true })));

    const homeLink = container.querySelector<HTMLAnchorElement>('a[href="/flow"]');
    act(() => homeLink?.dispatchEvent(new MouseEvent("click", { bubbles: true })));

    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it("locks body scroll while open and restores it on close", () => {
    const container = renderNav();
    const trigger = getTrigger(container);

    act(() => trigger.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(document.body.style.overflow).toBe("hidden");

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(document.body.style.overflow).toBe("");
  });
});
