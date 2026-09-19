/**
 * A Next layout cannot read the current pathname, but /flow's layout needs it to send a
 * signed-out visitor back to the page they asked for after login. Next 16 Proxy is
 * Node-runtime only and OpenNext Cloudflare cannot deploy it, so the Cloudflare Worker entry
 * sets this header instead and the layout reads it.
 *
 * Shared here so the Worker and the layout agree on the name, and so the matching rule is
 * testable without booting either.
 */
export const FLOW_PATHNAME_HEADER = "x-flow-pathname";

/** True for the Flow app's own routes only — never `/flowers`, never `/admin`. */
export function isFlowPathname(pathname: string): boolean {
  return pathname === "/flow" || pathname.startsWith("/flow/");
}
