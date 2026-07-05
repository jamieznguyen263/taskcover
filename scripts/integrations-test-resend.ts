import { loadEnvConfig } from "@next/env";
import { renderInternalLeadEmail, renderVisitorLeadEmail } from "../src/lib/leads/email-templates";
import { validateEmailAddress, valuePresent } from "../src/lib/ops/production-activation";

loadEnvConfig(process.cwd());

const live = process.argv.includes("--live");
const configured = ["RESEND_API_KEY", "RESEND_FROM_EMAIL", "RESEND_REPLY_TO_EMAIL", "LEAD_NOTIFICATION_EMAIL"].every((name) =>
  valuePresent(process.env[name])
);
const lead = {
  requestType: "seo-audit",
  locale: "en",
  name: "Taskcover Resend Test",
  workEmail: "business@taskcover.com",
  consent: true,
  submittedAt: "2026-07-05T00:00:00.000Z",
  sourcePath: "/integration-test",
  spamSignals: { honeypotPresent: false, turnstileConfigured: false, turnstileVerified: true },
} as const;
const internal = renderInternalLeadEmail(lead, "resend-test");
const visitor = renderVisitorLeadEmail(lead, "resend-test");

const offline = {
  configured,
  fromAddress: validateEmailAddress(process.env.RESEND_FROM_EMAIL),
  replyToAddress: validateEmailAddress(process.env.RESEND_REPLY_TO_EMAIL),
  notificationRecipient: validateEmailAddress(process.env.LEAD_NOTIFICATION_EMAIL),
  domainExpectation: process.env.RESEND_FROM_EMAIL?.includes("@taskcover.com") ? "configured" : "unavailable",
  localizedTemplates: ["en", "fr", "es"],
  htmlAndTextRendered: Boolean(internal.html && internal.text && visitor.html && visitor.text),
  responseTimePromise: "not present",
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Resend verification failed.");
  process.exit(1);
});

async function main() {
  if (!live) {
    console.log(JSON.stringify({ mode: "offline", sentEmail: false, offline }, null, 2));
    if (!offline.htmlAndTextRendered) process.exitCode = 1;
    return;
  }
  if (!configured) {
    console.error("Resend live test requires RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_REPLY_TO_EMAIL, and LEAD_NOTIFICATION_EMAIL.");
    process.exit(1);
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "content-type": "application/json",
      "Idempotency-Key": "taskcover-resend-activation-test-2026-07-05",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.LEAD_NOTIFICATION_EMAIL,
      reply_to: process.env.RESEND_REPLY_TO_EMAIL,
      subject: "[Taskcover activation test] Resend delivery check",
      html: visitor.html,
      text: visitor.text,
    }),
  });
  console.log(JSON.stringify({ mode: "live", sentEmail: response.ok, status: response.status }, null, 2));
  if (!response.ok) process.exitCode = 1;
}
