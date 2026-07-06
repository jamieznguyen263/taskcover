/**
 * @vitest-environment jsdom
 */

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getPricingContent } from "@/lib/content";
import { PricingInteractiveFlow } from "./pricing-interactive-flow";
import { PricingTabs } from "./pricing-tabs";

let mountedRoot: Root | null = null;
let mountedContainer: HTMLDivElement | null = null;

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

beforeEach(() => {
  window.history.replaceState(null, "", "/pricing");
  window.matchMedia =
    window.matchMedia ??
    vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  HTMLElement.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  if (mountedRoot) {
    act(() => mountedRoot?.unmount());
  }
  mountedRoot = null;
  mountedContainer?.remove();
  mountedContainer = null;
});

function render(element: React.ReactNode) {
  mountedContainer = document.createElement("div");
  document.body.appendChild(mountedContainer);
  mountedRoot = createRoot(mountedContainer);
  act(() => {
    mountedRoot?.render(element);
  });
  return mountedContainer;
}

describe("pricing client interactions", () => {
  it("updates the active pricing tab, panel content, and query state", () => {
    const content = getPricingContent("en");
    const container = render(
      <PricingInteractiveFlow content={content} locale="en" initialTab="local" />
    );
    const globalTab = container.querySelector<HTMLButtonElement>("#pricing-tab-global");
    const localTab = container.querySelector<HTMLButtonElement>("#pricing-tab-local");
    const initialPanel = container.querySelector<HTMLElement>('[role="tabpanel"]');

    expect(localTab?.getAttribute("aria-selected")).toBe("true");
    expect(globalTab?.getAttribute("aria-selected")).toBe("false");
    expect(initialPanel?.textContent).toContain("Local SEO Starter");
    expect(initialPanel?.textContent).not.toContain("Global SEO Expansion");

    act(() => {
      globalTab?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const activePanel = container.querySelector<HTMLElement>('[role="tabpanel"]');
    expect(globalTab?.getAttribute("aria-selected")).toBe("true");
    expect(localTab?.getAttribute("aria-selected")).toBe("false");
    expect(activePanel?.textContent).toContain("Global SEO Expansion");
    expect(activePanel?.textContent).not.toContain("Local SEO Starter");
    expect(window.location.search).toBe("?tab=global");
  });

  it("supports keyboard tab navigation", () => {
    const content = getPricingContent("en");
    const container = render(<PricingTabs content={content} locale="en" />);
    const localTab = container.querySelector<HTMLButtonElement>("#pricing-tab-local");
    const nationalTab = container.querySelector<HTMLButtonElement>("#pricing-tab-national");

    expect(localTab?.getAttribute("aria-selected")).toBe("true");

    act(() => {
      localTab?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    });

    expect(nationalTab?.getAttribute("aria-selected")).toBe("true");
  });

  it("uses the compact decision guide to activate matching pricing tabs", () => {
    const content = getPricingContent("en");
    const container = render(
      <PricingInteractiveFlow content={content} locale="en" initialTab="local" />
    );
    const mentorOption = Array.from(container.querySelectorAll<HTMLButtonElement>('[role="option"]')).find(
      (button) => button.textContent?.includes("I need senior SEO guidance")
    );

    expect(mentorOption).toBeTruthy();

    act(() => {
      mentorOption?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const mentorTab = container.querySelector<HTMLButtonElement>("#pricing-tab-mentor");
    const activePanel = container.querySelector<HTMLElement>('[role="tabpanel"]');

    expect(mentorOption?.getAttribute("aria-selected")).toBe("true");
    expect(mentorTab?.getAttribute("aria-selected")).toBe("true");
    expect(activePanel?.textContent).toContain("SEO Mentor Growth Advisory");
    expect(window.location.search).toBe("?tab=mentor");
  });

  it("keeps the full comparison collapsed by default", () => {
    const content = getPricingContent("en");
    const container = render(
      <PricingInteractiveFlow content={content} locale="en" initialTab="local" />
    );
    const fullComparison = container.querySelector<HTMLDetailsElement>("details");

    expect(container.textContent).toContain("View full comparison");
    expect(fullComparison?.open).toBe(false);
  });
});
