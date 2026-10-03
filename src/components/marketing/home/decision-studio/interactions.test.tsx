/** @vitest-environment jsdom */
import { act, StrictMode, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DecisionStudio } from "./decision-studio";
import { HomeEvidence } from "./home-evidence";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
vi.mock("next/link", async () => {
  const React = await import("react");
  return { default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => React.createElement("a", { href, ...props }, children) };
});
vi.mock("next/image", async () => {
  const React = await import("react");
  return { default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => React.createElement("img", props) };
});
let root: Root;
let host: HTMLDivElement;
beforeEach(() => {
  host = document.createElement("div"); document.body.appendChild(host); root = createRoot(host);
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", { configurable: true, value: vi.fn(function(this: HTMLDialogElement) { this.setAttribute("open", ""); }) });
  Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value: vi.fn(function(this: HTMLDialogElement) { this.removeAttribute("open"); }) });
});
afterEach(() => { act(() => root.unmount()); host.remove(); vi.restoreAllMocks(); });

function render(node: ReactNode) { act(() => root.render(<StrictMode>{node}</StrictMode>)); }
function button(text: string) {
  const found = [...host.querySelectorAll<HTMLButtonElement>("button")].find((item) => item.textContent?.includes(text) && !item.closest("[inert]"));
  if (!found) throw new Error("Missing button: " + text);
  return found;
}
function click(element: HTMLElement) { act(() => { element.focus(); element.click(); }); }
function changeScenario(value: string) {
  const select = host.querySelector("select")!;
  act(() => { select.value = value; select.dispatchEvent(new Event("change", { bubbles: true })); });
}
function setText(element: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const prototype = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(prototype, "value")!.set!;
  act(() => { setter.call(element, value); element.dispatchEvent(new Event("input", { bubbles: true })); });
}
function close() { click(host.querySelector<HTMLButtonElement>('button[aria-label="Close dialog"]')!); }

describe("Decision Studio interactions", () => {
  it("retains selected questions across audiences and exports an escaped, unsent brief", async () => {
    render(<DecisionStudio />);
    click(button("Keep this question"));
    changeScenario("b2b"); click(button("Keep this question"));
    click(button("My questions (2)"));
    expect(host.querySelector("dialog")?.textContent).toContain("Services & Consulting");
    expect(host.querySelector("dialog")?.textContent).toContain("B2B Software");
    click(button("Create my conversation brief"));
    setText(host.querySelector<HTMLInputElement>('input[name="website"]')!, "example.com");
    setText(host.querySelector<HTMLTextAreaElement>('textarea[name="goal"]')!, "<script>alert(1)</script>");
    act(() => host.querySelector("form.brief-form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
    expect(host.querySelector("pre")?.textContent).toContain("<script>alert(1)</script>");
    expect(host.querySelector("dialog script")).toBeNull();
    expect(host.querySelector("pre")?.textContent).toContain("Nothing has been sent");
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error("Denied")) } });
    await act(async () => { button("Copy brief").click(); });
    expect(host.querySelector<HTMLTextAreaElement>("#copy-fallback")?.value).toContain("example.com");
  });

  it("opens working notes, restores focus and resets the practice state when the audience changes", () => {
    render(<DecisionStudio />);
    const trigger = button("Open the working note");
    click(trigger);
    expect(host.querySelector("dialog")?.hasAttribute("open")).toBe(true);
    act(() => host.querySelector("dialog")!.dispatchEvent(new Event("cancel", { bubbles: false, cancelable: true })));
    expect(host.querySelector("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
    click(button("Choose"));
    click(host.querySelector<HTMLInputElement>('input[value="brief"]')!);
    setText(host.querySelector<HTMLInputElement>(".sample-form input")!, "Check the room dimensions");
    act(() => host.querySelector(".sample-form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
    expect(host.querySelector(".sample-content")?.textContent).toContain("No enquiry, order, or payment");
    changeScenario("ecommerce");
    expect(host.querySelector<HTMLInputElement>(".sample-form input")?.value).toBe("");
    expect(host.querySelector(".sample-confirmation")).toBeNull();
  });
});

describe("Homepage evidence interactions", () => {
  it("loads video only after a click and removes the player when closed", () => {
    render(<HomeEvidence />);
    expect(host.querySelector("iframe")).toBeNull();
    const trigger = host.querySelector<HTMLButtonElement>(".video-poster")!;
    click(trigger);
    expect(host.querySelector("iframe")?.src).toContain("e79aaa106884ac0987ade3e89e22bfba");
    close();
    expect(host.querySelector("iframe")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("supports keyboard case tabs and keeps the meaning of the client figures explicit", () => {
    render(<HomeEvidence />);
    click(host.querySelector<HTMLButtonElement>("#case-tab-scope")!);
    const scope = host.querySelector("#case-panel-scope")!;
    expect(scope.hasAttribute("hidden")).toBe(false);
    expect(scope.textContent).toContain("21,323");
    act(() => host.querySelector("#case-tab-scope")!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })));
    expect(host.querySelector("#case-tab-priorities")?.getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement?.id).toBe("case-tab-priorities");
    click(host.querySelector<HTMLButtonElement>("#case-tab-ai")!);
    click(button("B2B journeys"));
    expect(host.querySelector("#case-panel-ai")?.textContent).toContain("not been reproduced");
    click(button("Pause movement"));
    expect(host.querySelector(".client-marquee")?.classList.contains("is-paused")).toBe(true);
    expect(host.querySelector(".client-repeat")?.hasAttribute("inert")).toBe(true);
  });
});
