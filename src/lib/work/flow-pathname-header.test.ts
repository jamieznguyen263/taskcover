import { describe, expect, it } from "vitest";
import { resolveSafeRedirect } from "@/lib/admin/safe-redirect";
import { FLOW_PATHNAME_HEADER, isFlowPathname } from "./flow-pathname-header";

describe("Flow pathname forwarding", () => {
  it("matches Flow routes only", () => {
    expect(isFlowPathname("/flow")).toBe(true);
    expect(isFlowPathname("/flow/projects")).toBe(true);
    expect(isFlowPathname("/flow/clients/abc-123")).toBe(true);
    expect(isFlowPathname("/flowers")).toBe(false);
    expect(isFlowPathname("/admin")).toBe(false);
    expect(isFlowPathname("/")).toBe(false);
  });

  it("keeps a stable header name shared by the Worker and the layout", () => {
    expect(FLOW_PATHNAME_HEADER).toBe("x-flow-pathname");
  });

  it("cannot become an open redirect even if the header is forged", () => {
    // The Worker overwrites any inbound value, but the layout still sanitises it.
    expect(resolveSafeRedirect("https://evil.example/flow", "/flow")).toBe("/flow");
    expect(resolveSafeRedirect("//evil.example", "/flow")).toBe("/flow");
    expect(resolveSafeRedirect("/flow\\..\\admin", "/flow")).toBe("/flow");
    expect(resolveSafeRedirect(null, "/flow")).toBe("/flow");
    expect(resolveSafeRedirect("/flow/projects/abc", "/flow")).toBe("/flow/projects/abc");
  });
});
