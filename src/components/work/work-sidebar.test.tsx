/**
 * @vitest-environment jsdom
 */

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WorkSidebar } from "./work-sidebar";

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
});

function classTokens(element: Element | null | undefined) {
  return element?.className.split(/\s+/).filter(Boolean) ?? [];
}

function renderSidebar(navContext: Parameters<typeof WorkSidebar>[0]["navContext"]) {
  mountedContainer = document.createElement("div");
  document.body.appendChild(mountedContainer);
  mountedRoot = createRoot(mountedContainer);
  act(() => {
    mountedRoot?.render(<WorkSidebar navContext={navContext} inboxUnread={0} />);
  });
  return mountedContainer;
}

describe("WorkSidebar", () => {
  it("is hidden below the lg breakpoint and persistent at lg and above", () => {
    const container = renderSidebar({ accessLevel: "member", legacyRole: "editor" });
    const aside = container.querySelector("aside");

    expect(classTokens(aside)).toContain("hidden");
    expect(classTokens(aside)).toContain("lg:block");
  });

  it("hides Administration and Content CMS for a member with an editor legacy role", () => {
    const container = renderSidebar({ accessLevel: "member", legacyRole: "editor" });
    expect(container.textContent).not.toContain("Content CMS");
    expect(container.textContent).not.toContain("Administration");
  });

  it("shows enabled Administration and Content CMS links for an admin", () => {
    const container = renderSidebar({ accessLevel: "admin", legacyRole: "admin" });
    expect(container.textContent).toContain("Content CMS");
    expect(container.textContent).toContain("Administration");
    expect(container.querySelector('a[href="/flow/admin"]')).not.toBeNull();
    expect(container.querySelector('a[href="/admin"]')).not.toBeNull();
  });
});
