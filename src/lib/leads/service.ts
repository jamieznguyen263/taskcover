import { type Locale } from "@/lib/i18n";
import { parseLeadPayload, thankYouPathFor } from "./schema";
import { getLeadDeliveryAdapters } from "./adapters";
import { checkRateLimit, rateLimitKeyFromRequest } from "./rate-limit";
import { hasHoneypotSignal, isTurnstileConfigured, verifyTurnstile } from "./spam";
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

export async function submitLead({ payload, ip }: SubmissionInput): Promise<LeadSubmissionResult> {
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

  const rateLimit = await checkRateLimit({ key: rateLimitKey });
  if (!rateLimit.allowed) {
    return { status: "spam-rejected", messageKey: "spam" };
  }

  const turnstile = await verifyTurnstile(parsed.turnstileToken, ip);
  if (turnstile.configured && !turnstile.verified) {
    return { status: "spam-rejected", messageKey: "spam" };
  }

  if (!parsed.success) {
    return { status: "validation-error", fieldErrors: parsed.fieldErrors };
  }

  parsed.lead.spamSignals = {
    ...parsed.lead.spamSignals,
    honeypotPresent: false,
    turnstileConfigured: turnstile.configured,
    turnstileVerified: turnstile.verified,
  };

  const adapters = getLeadDeliveryAdapters().filter((adapter) => adapter.isConfigured());
  if (adapters.length === 0) {
    return {
      status: "not-configured",
      requestType: parsed.lead.requestType,
      messageKey: "delivery-unavailable",
      delivery: [{ status: "not-configured", adapter: "none" }],
    };
  }

  const delivery = await Promise.all(adapters.map((adapter) => adapter.deliver(parsed.lead)));
  if (delivery.some((result) => result.status === "accepted")) {
    return {
      status: "success",
      requestType: parsed.lead.requestType,
      redirectPath: thankYouPathFor(parsed.lead.locale as Locale, parsed.lead.requestType),
      delivery,
    };
  }

  if (delivery.some((result) => result.status === "temporary-error")) {
    return {
      status: "temporary-error",
      requestType: parsed.lead.requestType,
      messageKey: "temporary-error",
      delivery,
    };
  }

  return {
    status: "rejected",
    requestType: parsed.lead.requestType,
    messageKey: "rejected",
    delivery,
  };
}
