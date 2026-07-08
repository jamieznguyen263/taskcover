import { type Locale } from "@/lib/i18n";
import { isDatabaseConfigured, isHyperdriveConfigured } from "@/lib/db/client";
import { parseLeadPayload, thankYouPathFor } from "./schema";
import { acceptLeadDurably } from "./acceptance";
import { checkRateLimit, isProductionRateLimitConfigured, rateLimitKeyFromRequest } from "./rate-limit";
import { getLeadSubmissionMode, isCanonicalProductionLeadOrigin, isProductionLeadOrigin } from "./mode";
import { hasHoneypotSignal, isTurnstileConfigured, verifyTurnstile } from "./spam";
import { isResendConfigured } from "./resend";
import type { LeadSubmissionResult } from "./types";

type SubmissionInput = {
  payload: unknown;
  ip: string;
};

function requestTypeHint(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "unknown";
  const value = (payload as Record<string, unknown>).requestType;
  return typeof value === "string" ? value : "unknown";
}

function productionLeadReadinessFailure(): string | null {
  if (!isCanonicalProductionLeadOrigin()) return "production-origin";
  if (!isHyperdriveConfigured()) return "hyperdrive";
  if (!isDatabaseConfigured()) return "database";
  if (!isTurnstileConfigured()) return "turnstile";
  if (process.env.TURNSTILE_EXPECTED_HOSTNAME !== "taskcover.com") return "turnstile-hostname";
  if (process.env.TURNSTILE_EXPECTED_ACTION !== "lead-submit") return "turnstile-action";
  if (!isProductionRateLimitConfigured()) return "rate-limit";
  if (!isResendConfigured()) return "resend";
  return null;
}

function unavailableResult(requestType: LeadSubmissionResult["requestType"], adapter = "lead-submission-mode"): LeadSubmissionResult {
  return {
    status: "not-configured",
    requestType,
    messageKey: "delivery-unavailable",
    delivery: [{ status: "not-configured", adapter }],
  };
}

export async function submitLead({ payload, ip }: SubmissionInput): Promise<LeadSubmissionResult> {
  const mode = getLeadSubmissionMode();
  const submittedAt = new Date().toISOString();
  const rateLimitKey = rateLimitKeyFromRequest(ip, requestTypeHint(payload));
  const parsed = parseLeadPayload({
    payload,
    submittedAt,
    spamSignals: {
      honeypotPresent: false,
      rateLimitKey,
      turnstileConfigured: isTurnstileConfigured(),
      turnstileVerified: false,
    },
  });

  if (hasHoneypotSignal(parsed.honeypotValue)) {
    return { status: "spam-rejected", messageKey: "spam" };
  }

  if (!parsed.success) {
    return { status: "validation-error", fieldErrors: parsed.fieldErrors };
  }

  if (mode === "disabled" || (mode === "staging-durable" && isProductionLeadOrigin())) {
    return unavailableResult(parsed.lead.requestType);
  }

  if (mode === "production-durable") {
    const failure = productionLeadReadinessFailure();
    if (failure) return unavailableResult(parsed.lead.requestType, `production-durable:${failure}`);
  }

  const rateLimit = await checkRateLimit({ key: rateLimitKey });
  if (!rateLimit.allowed) {
    return { status: "spam-rejected", messageKey: "spam" };
  }

  const turnstile = await verifyTurnstile(parsed.turnstileToken, ip);
  if (turnstile.configured && !turnstile.verified) {
    return { status: "spam-rejected", messageKey: "spam" };
  }

  parsed.lead.spamSignals = {
    ...parsed.lead.spamSignals,
    honeypotPresent: false,
    turnstileConfigured: turnstile.configured,
    turnstileVerified: turnstile.verified,
  };

  if (mode === "test") {
    return {
      status: "success",
      requestType: parsed.lead.requestType,
      redirectPath: thankYouPathFor(parsed.lead.locale as Locale, parsed.lead.requestType),
      leadReference: `test_${rateLimitKey}`,
      delivery: [{ status: "accepted", adapter: "safe-test-adapter" }],
    };
  }

  try {
    const accepted = await acceptLeadDurably(parsed.lead);
    return {
      status: "success",
      requestType: parsed.lead.requestType,
      redirectPath: thankYouPathFor(parsed.lead.locale as Locale, parsed.lead.requestType),
      leadReference: accepted.id,
      delivery: [{ status: "accepted", adapter: "neon-outbox" }],
    };
  } catch {
    return {
      status: isDatabaseConfigured() ? "temporary-error" : "not-configured",
      requestType: parsed.lead.requestType,
      messageKey: isDatabaseConfigured() ? "temporary-error" : "delivery-unavailable",
      delivery: [{ status: isDatabaseConfigured() ? "temporary-error" : "not-configured", adapter: "neon-outbox" }],
    };
  }
}
