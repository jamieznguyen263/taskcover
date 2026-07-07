import { beforeEach, describe, expect, it, vi } from "vitest";
import { leadIdempotencyKey, deliveryJobIdempotencyKey } from "./acceptance";
import { renderInternalLeadEmail, renderVisitorLeadEmail, resendIdempotencyKey } from "./email-templates";
import { getLeadSubmissionMode, isLeadSubmissionMode, isProductionLeadOrigin } from "./mode";
import { rateLimitKeyFromRequest } from "./rate-limit";
import { verifyTurnstile } from "./spam";
import type { NormalizedLead } from "./types";

const lead: NormalizedLead = {
  requestType: "seo-audit",
  locale: "en",
  name: "Jamie Nguyen",
  workEmail: "jamie@example.com",
  company: "Taskcover",
  websiteUrl: "https://taskcover.com",
  market: "usa",
  industry: "saas-technology",
  serviceInterests: ["technical-seo"],
  primaryChallenge: "Indexation",
  goals: "More qualified demand",
  timeline: "quarter",
  consent: true,
  submittedAt: "2026-07-05T00:00:00.000Z",
  sourcePath: "/free-seo-audit",
  spamSignals: { honeypotPresent: false, turnstileConfigured: true, turnstileVerified: true },
};

describe("lead production readiness helpers", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("uses deterministic idempotency keys for lead acceptance and provider jobs", () => {
    expect(leadIdempotencyKey(lead)).toBe(leadIdempotencyKey({ ...lead, submittedAt: "later" }));
    expect(deliveryJobIdempotencyKey("lead-1", "resend-visitor-confirmation")).toBe(
      deliveryJobIdempotencyKey("lead-1", "resend-visitor-confirmation")
    );
    expect(resendIdempotencyKey("lead-1", "resend-visitor-confirmation", "en", "Jamie@Example.com")).toContain(
      "jamie@example.com"
    );
  });

  it("renders internal and visitor email templates without response-time promises", () => {
    const internal = renderInternalLeadEmail(lead, "lead-1");
    const visitor = renderVisitorLeadEmail({ ...lead, locale: "fr" }, "lead-1", "https://cal.com/taskcover/strategy");
    expect(internal.text).toContain("Lead reference: lead-1");
    expect(internal.text).not.toContain("turnstile");
    expect(visitor.text).toContain("https://cal.com/taskcover/strategy");
    expect(visitor.text.toLowerCase()).not.toMatch(/24 hours|48 hours|same day|response time/);
  });

  it("hashes rate-limit keys instead of storing raw IP addresses", () => {
    const key = rateLimitKeyFromRequest("203.0.113.10", "seo-audit");
    expect(key).toContain("seo-audit");
    expect(key).not.toContain("203.0.113.10");
  });

  it("fails closed when configured Turnstile verification fails hostname or action", async () => {
    vi.stubEnv("TURNSTILE_SITE_KEY", "site");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    vi.stubEnv("TURNSTILE_EXPECTED_HOSTNAME", "taskcover.com");
    vi.stubEnv("TURNSTILE_EXPECTED_ACTION", "lead-submit");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ success: true, hostname: "evil.example", action: "lead-submit" }))
    );
    await expect(verifyTurnstile("token", "203.0.113.10")).resolves.toEqual({ configured: true, verified: false });
  });

  it("supports only explicit safe lead submission modes", () => {
    expect(isLeadSubmissionMode("disabled")).toBe(true);
    expect(isLeadSubmissionMode("test")).toBe(true);
    expect(isLeadSubmissionMode("staging-durable")).toBe(true);
    expect(isLeadSubmissionMode("production")).toBe(false);
    expect(getLeadSubmissionMode({ LEAD_SUBMISSION_MODE: "production" })).toBe("disabled");
    expect(isProductionLeadOrigin({ APP_URL: "https://taskcover.com", NEXT_PUBLIC_APP_URL: "" })).toBe(true);
    expect(isProductionLeadOrigin({ APP_URL: "https://staging.taskcover.com", NEXT_PUBLIC_APP_URL: "" })).toBe(false);
  });
});
