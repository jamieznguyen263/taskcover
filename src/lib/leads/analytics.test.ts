import { describe, expect, it } from "vitest";
import { shouldTrackAcceptedLeadSuccess } from "./analytics";

describe("lead analytics success gate", () => {
  it("requires durable accepted success with an opaque lead reference", () => {
    expect(shouldTrackAcceptedLeadSuccess({ status: "temporary-error", requestType: "seo-audit" })).toBe(false);
    expect(shouldTrackAcceptedLeadSuccess({ status: "not-configured", requestType: "seo-audit" })).toBe(false);
    expect(shouldTrackAcceptedLeadSuccess({ status: "success", requestType: "seo-audit" })).toBe(false);
    expect(shouldTrackAcceptedLeadSuccess({ status: "success", requestType: "seo-audit", leadReference: "lead_opaque" })).toBe(true);
  });
});
