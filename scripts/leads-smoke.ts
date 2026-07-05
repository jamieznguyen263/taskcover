import { loadEnvConfig } from "@next/env";
import crypto from "node:crypto";
import { renderInternalLeadEmail, renderVisitorLeadEmail } from "../src/lib/leads/email-templates";
import { parseLeadPayload, thankYouPathFor } from "../src/lib/leads/schema";
import { rateLimitKeyFromRequest } from "../src/lib/leads/rate-limit";
import { noPiiLogLine } from "../src/lib/ops/production-activation";

loadEnvConfig(process.cwd());

const mode = readArg("--mode") ?? "mock";
if (!["mock", "test-provider", "live-provider"].includes(mode)) {
  console.error("Invalid lead smoke mode. Use mock, test-provider, or live-provider.");
  process.exit(1);
}
if (mode !== "mock" && !process.argv.includes("--allow-provider-side-effects")) {
  console.error("Provider modes require --allow-provider-side-effects. Default mock mode never sends email or modifies HubSpot.");
  process.exit(1);
}

const cases = [
  leadCase("Free SEO Audit EN", "seo-audit", "en", "/free-seo-audit"),
  leadCase("Free SEO Audit FR", "seo-audit", "fr", "/fr/free-seo-audit"),
  leadCase("Free SEO Audit ES", "seo-audit", "es", "/es/free-seo-audit"),
  leadCase("Strategy Call request", "strategy-call", "en", "/book-a-call"),
  leadCase("General Contact", "general-contact", "en", "/contact"),
  leadCase("Media inquiry", "media-inquiry", "en", "/contact?intent=media"),
  leadCase("Private reference request", "private-reference", "en", "/contact?intent=private-reference"),
] as const;

const results = cases.map((item) => {
  const parsed = parseLeadPayload({
    payload: item.payload,
    submittedAt: "2026-07-05T00:00:00.000Z",
    spamSignals: {
      honeypotPresent: false,
      turnstileConfigured: Boolean(process.env.TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY),
      turnstileVerified: mode === "mock",
      rateLimitKey: rateLimitKeyFromRequest("203.0.113.42", item.payload.requestType),
    },
  });

  if (!parsed.success) {
    return { name: item.name, validation: "failed", fields: Object.keys(parsed.fieldErrors) };
  }

  const leadId = leadIdempotencyKey(parsed.lead);
  const visitor = renderVisitorLeadEmail(parsed.lead, leadId, process.env.CALCOM_BOOKING_URL);
  const internal = renderInternalLeadEmail(parsed.lead, leadId);
  const redirectPath = thankYouPathFor(parsed.lead.locale, parsed.lead.requestType);
  const outputLine = `${item.name}:${leadId}:${redirectPath}`;
  return {
    name: item.name,
    validation: "passed",
    turnstileMode: process.env.TURNSTILE_SECRET_KEY ? "configured" : "not configured",
    persistence: mode === "mock" ? "mocked" : "requires configured disposable/test database",
    idempotencyStable: leadId === leadIdempotencyKey({ ...parsed.lead, submittedAt: "later" }),
    outboxJobs: [
      deliveryJobIdempotencyKey(leadId, "resend-internal-notification"),
      deliveryJobIdempotencyKey(leadId, "resend-visitor-confirmation"),
      deliveryJobIdempotencyKey(leadId, "hubspot-contact-sync"),
      deliveryJobIdempotencyKey(leadId, "hubspot-company-sync"),
      deliveryJobIdempotencyKey(leadId, "hubspot-deal-sync"),
    ].length,
    thankYouRedirect: redirectPath,
    calcomCta: process.env.CALCOM_BOOKING_URL ? "configured" : "hidden",
    noPiiInSummary: noPiiLogLine(outputLine) && noPiiLogLine(visitor.subject) && noPiiLogLine(internal.subject),
  };
});

console.log(JSON.stringify({ mode, submittedRealLeads: false, modifiedHubSpot: false, results }, null, 2));
if (results.some((result) => result.validation !== "passed" || ("noPiiInSummary" in result && !result.noPiiInSummary))) process.exitCode = 1;

function readArg(name: string) {
  const prefixed = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (prefixed) return prefixed.slice(name.length + 1);
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function leadCase(name: string, requestType: string, locale: string, sourcePath: string) {
  const base = {
    requestType,
    locale,
    name: "Test Lead",
    workEmail: "test.lead@example.com",
    company: "Taskcover QA",
    websiteUrl: "https://example.com",
    consent: true,
    sourcePath,
    market: "usa",
    industry: "saas-technology",
    serviceInterests: ["technical-seo"],
    primaryChallenge: "Technical visibility.",
    goals: "Validate activation tooling.",
    timeline: "quarter",
    currentTrafficRange: "1000-10000",
    paidSearchActivity: "not-sure",
    preferredTimeZone: "america-eastern",
    preferredCallWindows: ["weekday-morning", "weekday-afternoon"],
    message: "Safe smoke-test message.",
  };
  return { name, payload: base };
}

function leadIdempotencyKey(lead: { requestType: string; locale: string; workEmail: string; sourcePath: string; websiteUrl?: string; company?: string; message?: string; submittedAt?: string }) {
  const stable = [
    lead.requestType,
    lead.locale,
    lead.workEmail,
    lead.sourcePath,
    lead.websiteUrl ?? "",
    lead.company ?? "",
    lead.message ?? "",
  ].join("\n");
  return `lead_${crypto.createHash("sha256").update(stable).digest("hex")}`;
}

function deliveryJobIdempotencyKey(leadId: string, jobType: string, recipientOrTarget = "primary") {
  return `lead_delivery_${crypto.createHash("sha256").update(`${leadId}:${jobType}:${recipientOrTarget}`).digest("hex")}`;
}
