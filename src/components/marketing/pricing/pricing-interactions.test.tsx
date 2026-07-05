/**
 * @vitest-environment jsdom
 */

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getPricingContent } from "@/lib/content";
import { PricingDecisionGuide } from "./pricing-decision-guide";
import { PricingTabs } from "./pricing-tabs";

let mountedRoot: Root | null = null;
let mountedContainer: HTMLDivElement | null = null;

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

beforeEach(() => {
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
  it("updates the active pricing tab with accessible aria state", () => {
    const content = getPricingContent("en");
    const container = render(<PricingTabs content={content} locale="en" />);
    const globalTab = container.querySelector<HTMLButtonElement>("#pricing-tab-global");
    const localTab = container.querySelector<HTMLButtonElement>("#pricing-tab-local");

    expect(localTab?.getAttribute("aria-selected")).toBe("true");
    expect(globalTab?.getAttribute("aria-selected")).toBe("false");

    act(() => {
      globalTab?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(globalTab?.getAttribute("aria-selected")).toBe("true");
    expect(localTab?.getAttribute("aria-selected")).toBe("false");
  });

  it("updates the decision-guide recommendation", () => {
    const content = getPricingContent("en");
    const container = render(<PricingDecisionGuide content={content} locale="en" />);
    const notSure = Array.from(container.querySelectorAll<HTMLButtonElement>('[role="option"]')).find(
      (button) => button.textContent?.includes("I am not sure")
    );

    expect(notSure).toBeTruthy();

    act(() => {
      notSure?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(notSure?.getAttribute("aria-selected")).toBe("true");
    expect(container.textContent).toContain("Free SEO Audit");
    expect(container.textContent).toContain("$0");
  });
});
