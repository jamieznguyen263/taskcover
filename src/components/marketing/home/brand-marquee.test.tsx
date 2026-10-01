/** @vitest-environment jsdom */
import { act } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { expect, it, vi } from "vitest";
import { getHomeContent } from "@/lib/content";
import { BrandMarquee } from "./brand-marquee";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
let prefersReducedMotion = false;
vi.mock("motion/react", () => ({ useReducedMotion: () => prefersReducedMotion }));
vi.mock("next/link", async () => {
  const React = await import("react");
  return { default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => React.createElement("a", { href, ...props }, children) };
});
vi.mock("next/image", async () => {
  const React = await import("react");
  return { default: ({ src, alt, width, height }: React.ImgHTMLAttributes<HTMLImageElement>) => React.createElement("img", { src, alt, width, height }) };
});

it("hydrates the server rail before honoring the browser reduced-motion preference", async () => {
  const content = getHomeContent("fr").brandExperience;
  const logos = content.logos.slice(0, 2);
  const view = <BrandMarquee {...content} logos={logos} />;
  const host = document.createElement("div");
  document.body.appendChild(host);
  const recoverableErrors: unknown[] = [];
  let root: Root | undefined;
  try {
    prefersReducedMotion = false;
    host.innerHTML = renderToString(view);
    prefersReducedMotion = true;
    await act(async () => {
      root = hydrateRoot(host, view, { onRecoverableError: (error) => recoverableErrors.push(error) });
    });
    expect(recoverableErrors).toEqual([]);
    expect(host.querySelector("ul")).toBeNull();
    expect(host.querySelectorAll("img")).toHaveLength(logos.length * 2);
  } finally {
    act(() => root?.unmount());
    host.remove();
    prefersReducedMotion = false;
  }
});