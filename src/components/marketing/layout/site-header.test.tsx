/**
 * @vitest-environment jsdom
 */

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "./site-header";

let currentPathname = "/";
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

vi.mock("next/navigation", () => ({
  usePathname: () => currentPathname,
  useSearchParams: () => new URLSearchParams(),
}));

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
  if (mountedRoot) {
    act(() => mountedRoot?.unmount());
  }
  mountedRoot = null;
  mountedContainer?.remove();
  mountedContainer = null;
  currentPathname = "/";
});

function renderHeader() {
  mountedContainer = document.createElement("div");
  document.body.appendChild(mountedContainer);
  mountedRoot = createRoot(mountedContainer);
  act(() => {
    mountedRoot?.render(<SiteHeader />);
  });
  return mountedContainer;
}

function classTokens(element: Element | null | undefined) {
  return element?.className.split(/\s+/).filter(Boolean) ?? [];
}

describe("SiteHeader mobile navigation", () => {
  it("keeps a desktop mega menu open after pointer focus and click", () => {
    const container = renderHeader();
    const servicesTrigger = container.querySelector<HTMLButtonElement>(
      'button[aria-controls="mega-menu-services"]'
    );

    expect(servicesTrigger).not.toBeNull();
    expect(servicesTrigger?.getAttribute("aria-expanded")).toBe("false");

    act(() => {
      servicesTrigger?.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
      servicesTrigger?.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
      servicesTrigger?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const menu = container.querySelector<HTMLDivElement>("#mega-menu-services");

    expect(servicesTrigger?.getAttribute("aria-expanded")).toBe("true");
    expect(menu).not.toBeNull();
    expect(menu?.textContent).toContain("Recommended first step");
  });

  it("opens the mobile accordion menu and exposes the default services group", () => {
    const container = renderHeader();

    const trigger = container.querySelector<HTMLButtonElement>(
      'button[aria-controls="mobile-primary-menu"]'
    );
    const menu = container.querySelector<HTMLDivElement>("#mobile-primary-menu");
    const servicesGroup = container.querySelector<HTMLButtonElement>(
      'button[aria-controls="mobile-menu-services"]'
    );
    const solutionsGroup = container.querySelector<HTMLButtonElement>(
      'button[aria-controls="mobile-menu-solutions"]'
    );

    expect(trigger).not.toBeNull();
    expect(menu).not.toBeNull();
    expect(servicesGroup).not.toBeNull();
    expect(solutionsGroup).not.toBeNull();
    expect(trigger?.getAttribute("aria-expanded")).toBe("false");
    expect(classTokens(menu)).toContain("hidden");
    expect(servicesGroup?.getAttribute("aria-expanded")).toBe("true");
    expect(solutionsGroup?.getAttribute("aria-expanded")).toBe("false");

    act(() => {
      trigger?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    expect(trigger?.getAttribute("aria-label")).toBe("Close menu");
    expect(classTokens(menu)).toContain("block");
    expect(classTokens(menu)).not.toContain("hidden");
    expect(menu?.querySelectorAll("a[href]").length).toBeGreaterThan(10);
  });

  it("closes the mobile menu after the pathname changes", () => {
    const container = renderHeader();
    const trigger = container.querySelector<HTMLButtonElement>(
      'button[aria-controls="mobile-primary-menu"]'
    );

    act(() => {
      trigger?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(trigger?.getAttribute("aria-expanded")).toBe("true");

    currentPathname = "/services";
    act(() => {
      mountedRoot?.render(<SiteHeader />);
    });

    const rerenderedTrigger = container.querySelector<HTMLButtonElement>(
      'button[aria-controls="mobile-primary-menu"]'
    );
    const rerenderedMenu = container.querySelector<HTMLDivElement>("#mobile-primary-menu");

    expect(rerenderedTrigger?.getAttribute("aria-expanded")).toBe("false");
    expect(classTokens(rerenderedMenu)).toContain("hidden");
  });
});
