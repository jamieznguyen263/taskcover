/** @vitest-environment jsdom */
import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AnswerHero, AnswerServices, AnswerNeeds, answerServices } from "./answer-opening";
import { HomeEvidence } from "./decision-studio/home-evidence";

const preference = vi.hoisted(() => ({ reduced: false }));
vi.mock("./use-reduced-motion", () => ({ useReducedMotion: () => preference.reduced }));
vi.mock("next/link", async () => {
  const React = await import("react");
  return { default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => React.createElement("a", { href, ...props }, children) };
});
vi.mock("next/image", async () => {
  const React = await import("react");
  return { default: (props: Record<string, unknown>) => { const safe = { ...props }; delete safe.fill; delete safe.preload; return React.createElement("img", safe); } };
});
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let host: HTMLDivElement;
beforeEach(() => {
  preference.reduced = false;
  vi.stubGlobal("IntersectionObserver", class { observe() {} unobserve() {} disconnect() {} });
  host = document.createElement("div"); document.body.appendChild(host); root = createRoot(host);
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", { configurable: true, value: function(this: HTMLDialogElement) { this.setAttribute("open", ""); } });
  Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value: function(this: HTMLDialogElement) { this.removeAttribute("open"); } });
});
afterEach(() => { act(() => root.unmount()); host.remove(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
function render(node: ReactNode) { act(() => root.render(node)); }

describe("Answer opening", () => {
  it("ships readable hero and real actions in server HTML before motion starts", () => {
    const html = renderToString(<AnswerHero />);
    expect(html).toContain("Be the");
    expect(html).toContain('href="/contact"');
    expect(html).toContain('href="#where-we-help"');
    expect(html).not.toContain("opacity:0");
    expect(html).not.toContain("British Council");
  });

  it("lets the visitor pause lens motion and keeps reduced-motion preference authoritative", () => {
    render(<AnswerHero />);
    const toggle = host.querySelector<HTMLButtonElement>(".answer-motion-toggle")!;
    act(() => toggle.click());
    expect(toggle.getAttribute("aria-pressed")).toBe("true");
    expect(host.querySelector("section")?.getAttribute("data-motion-paused")).toBe("true");
    preference.reduced = true;
    act(() => toggle.click());
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
    expect(host.querySelector("section")?.getAttribute("data-motion-paused")).toBe("true");
    expect(host.querySelector('a[href="/contact"]')).not.toBeNull();
  });

  it("supports keyboard previews without intercepting the five service destinations", () => {
    render(<AnswerServices />);
    const rows = [...host.querySelectorAll<HTMLAnchorElement>(".answer-service-row")];
    expect(rows.map(row => row.getAttribute("href"))).toEqual(answerServices.map(item => item.href));
    act(() => rows[3].focus());
    expect(rows[3].dataset.active).toBe("true");
    expect(host.querySelector(".answer-preview-copy")?.textContent).toContain("prompt, model and date");
    // Touch/click retains native navigation, rather than requiring a first tap to preview.
    const click = new MouseEvent("click", { bubbles: true, cancelable: true });
    act(() => rows[3].dispatchEvent(click));
    expect(click.defaultPrevented).toBe(false);
  });

  it("retains client detail and video behavior when the opening replaces the marquee", () => {
    render(<HomeEvidence opening={<AnswerNeeds />} />);
    const partners = host.querySelectorAll(".answer-partners button");
    expect(partners).toHaveLength(7);
    expect(host.querySelector(".client-repeat")).toBeNull();
    const sky = host.querySelector<HTMLButtonElement>('button[aria-label^="Skyscanner:"]')!;
    act(() => { sky.focus(); sky.click(); });
    expect(host.querySelector("dialog")?.textContent).toContain("Platform team");
    act(() => host.querySelector<HTMLButtonElement>('button[aria-label="Close dialog"]')!.click());
    expect(document.activeElement).toBe(sky);
    expect(host.querySelector("iframe")).toBeNull();
    act(() => host.querySelector<HTMLButtonElement>(".video-poster")!.click());
    expect(host.querySelector("iframe")?.src).toContain("e79aaa106884ac0987ade3e89e22bfba");
  });
});
