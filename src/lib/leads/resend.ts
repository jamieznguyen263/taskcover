import "server-only";

import type { LeadDeliveryJobType } from "./acceptance";
import { renderInternalLeadEmail, renderVisitorLeadEmail, resendIdempotencyKey } from "./email-templates";
import type { NormalizedLead } from "./types";

export type ProviderDeliveryResult =
  | { status: "succeeded"; providerId?: string }
  | { status: "skipped"; category: string }
  | { status: "retry"; category: string; statusCodeCategory?: string }
  | { status: "failed"; category: string; statusCodeCategory?: string };

export function isResendConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.RESEND_FROM_EMAIL &&
      process.env.RESEND_REPLY_TO_EMAIL &&
      process.env.LEAD_NOTIFICATION_EMAIL
  );
}

export async function deliverResendJob(jobType: LeadDeliveryJobType, lead: NormalizedLead, leadId: string): Promise<ProviderDeliveryResult> {
  if (!isResendConfigured()) return { status: "skipped", category: "configuration" };
  const internal = jobType === "resend-internal-notification";
  const recipient = internal ? process.env.LEAD_NOTIFICATION_EMAIL! : lead.workEmail;
  const template = internal ? renderInternalLeadEmail(lead, leadId) : renderVisitorLeadEmail(lead, leadId);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "content-type": "application/json",
      "Idempotency-Key": resendIdempotencyKey(leadId, jobType, lead.locale, recipient),
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to: recipient,
      reply_to: process.env.RESEND_REPLY_TO_EMAIL,
      subject: template.subject,
      html: template.html,
      text: template.text,
    }),
  });

  if (response.ok) {
    const data = (await response.json().catch(() => ({}))) as { id?: string };
    return { status: "succeeded", providerId: data.id };
  }
  if (response.status === 401 || response.status === 403) return { status: "failed", category: "authentication", statusCodeCategory: "4xx" };
  if (response.status === 422) return { status: "failed", category: "invalid-recipient", statusCodeCategory: "4xx" };
  if (response.status === 429) return { status: "retry", category: "rate-limited", statusCodeCategory: "429" };
  if (response.status >= 500) return { status: "retry", category: "retryable", statusCodeCategory: "5xx" };
  return { status: "failed", category: "non-retryable", statusCodeCategory: "4xx" };
}
