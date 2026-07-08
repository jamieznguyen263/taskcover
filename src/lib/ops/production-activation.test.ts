import { describe, expect, it } from "vitest";
import {
  buildProductionChecks,
  buildWranglerAudit,
  deploymentSmokePlan,
  isActivationStatus,
  localHyperdriveVariableFor,
  migrationGuard,
  noPiiLogLine,
  redactValue,
  setupLocationFor,
  validateHttpUrl,
} from "./production-activation";

describe("production activation safety helpers", () => {
  it("redacts secret-like values", () => {
    expect(redactValue("DATABASE_URL", "postgres://user:pass@example.com/db")).toBe("[configured]");
    expect(redactValue("RESEND_API_KEY", "re_123")).toBe("[configured]");
    expect(redactValue("APP_URL", "https://taskcover.com")).toBe("https://taskcover.com");
  });

  it("requires explicit migration target and production confirmation", () => {
    expect(migrationGuard({}).ok).toBe(false);
    expect(migrationGuard({ DATABASE_TARGET: "development" }).ok).toBe(true);
    expect(migrationGuard({ DATABASE_TARGET: "production" }).ok).toBe(false);
    expect(migrationGuard({ DATABASE_TARGET: "production", CONFIRM_PRODUCTION_MIGRATION: "YES" }).ok).toBe(true);
  });

  it("audits wrangler placeholders and binding names", () => {
    const audit = buildWranglerAudit({
      name: "taskcover",
      compatibility_date: "2026-07-05",
      hyperdrive: [{ binding: "HYPERDRIVE", id: "00000000000000000000000000000000" }],
      ratelimits: [{ name: "LEAD_RATE_LIMITER" }, { name: "ADMIN_RATE_LIMITER" }],
      durable_objects: { bindings: [{ name: "RATE_LIMIT_COORDINATOR" }] },
      triggers: { crons: ["*/5 * * * *"] },
      env: { staging: { name: "taskcover-staging", hyperdrive: [{ binding: "HYPERDRIVE", id: "00000000000000000000000000000000" }] } },
    });
    expect(audit.hyperdriveBindings).toEqual(["HYPERDRIVE"]);
    expect(audit.hyperdrivePlaceholderIds).toEqual(["HYPERDRIVE", "staging.HYPERDRIVE"]);
    expect(localHyperdriveVariableFor("HYPERDRIVE")).toBe("CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE");
  });

  it("reports partially configured integrations without exposing secrets", () => {
    const audit = buildWranglerAudit({
      name: "taskcover",
      compatibility_date: "2026-07-05",
      hyperdrive: [{ binding: "HYPERDRIVE", id: "real-id" }],
      ratelimits: [{ name: "LEAD_RATE_LIMITER" }, { name: "ADMIN_RATE_LIMITER" }],
      durable_objects: { bindings: [{ name: "RATE_LIMIT_COORDINATOR" }] },
      triggers: { crons: ["*/5 * * * *"] },
    });
    const checks = buildProductionChecks(
      {
        APP_URL: "https://taskcover.com",
        NEXT_PUBLIC_APP_URL: "https://taskcover.com",
        LEAD_SUBMISSION_MODE: "disabled",
        RESEND_API_KEY: "re_actual_secret_value",
      },
      audit
    );
    expect(checks.find((check) => check.category === "Resend")?.status).toBe("partially configured");
    expect(JSON.stringify(checks)).not.toContain("re_actual_secret_value");
  });

  it("reports Task 17 readiness categories with approved status values", () => {
    const audit = buildWranglerAudit({
      name: "taskcover",
      compatibility_date: "2026-07-05",
      hyperdrive: [{ binding: "HYPERDRIVE", id: "00000000000000000000000000000000" }],
      ratelimits: [{ name: "LEAD_RATE_LIMITER", namespace_id: "1001" }, { name: "ADMIN_RATE_LIMITER", namespace_id: "1002" }],
      durable_objects: { bindings: [{ name: "RATE_LIMIT_COORDINATOR" }] },
      triggers: { crons: ["*/5 * * * *"] },
      env: { staging: { name: "taskcover-staging" } },
    });
    const checks = buildProductionChecks({}, audit);
    const categories = checks.map((check) => check.category);
    expect(categories).toEqual([
      "Application",
      "Cloudflare",
      "Neon / DATABASE_URL",
      "Hyperdrive",
      "Auth secrets",
      "Admin bootstrap readiness",
      "Insights provider mode",
      "Resend",
      "HubSpot",
      "Cal.com",
      "Turnstile",
      "Cloudinary",
      "Rate Limiting binding",
      "Durable Objects",
      "Cron/scheduler",
      "GTM/GA4/Google Ads readiness",
      "Consent mode readiness",
      "Lead outbox readiness",
    ]);
    expect(checks.every((check) => isActivationStatus(check.status))).toBe(true);
    expect(JSON.stringify(checks)).not.toContain("unavailable");
    expect(checks.find((check) => check.category === "Rate Limiting binding")?.status).toBe("partially configured");
    expect(setupLocationFor("RESEND_API_KEY")).toContain("wrangler secret put");
  });

  it("fails closed when production durable lead mode uses rate-limit placeholder namespace IDs", () => {
    const audit = buildWranglerAudit({
      name: "taskcover",
      compatibility_date: "2026-07-05",
      hyperdrive: [{ binding: "HYPERDRIVE", id: "3a4967f8e714435eb58bda3521531a24" }],
      ratelimits: [{ name: "LEAD_RATE_LIMITER", namespace_id: "1001" }, { name: "ADMIN_RATE_LIMITER", namespace_id: "1002" }],
      durable_objects: { bindings: [{ name: "RATE_LIMIT_COORDINATOR" }] },
      triggers: { crons: ["*/5 * * * *"] },
    });
    const checks = buildProductionChecks(
      {
        APP_URL: "https://taskcover.com",
        NEXT_PUBLIC_APP_URL: "https://taskcover.com",
        LEAD_SUBMISSION_MODE: "production-durable",
        RATE_LIMIT_PROVIDER: "cloudflare",
        RESEND_API_KEY: "re_secret",
        TURNSTILE_SECRET_KEY: "turnstile_secret",
        TURNSTILE_SITE_KEY: "site_key",
        TURNSTILE_EXPECTED_HOSTNAME: "taskcover.com",
        TURNSTILE_EXPECTED_ACTION: "lead-submit",
        CALCOM_BOOKING_URL: "https://cal.com/taskcover/strategy",
      },
      audit
    );
    expect(checks.find((check) => check.category === "Rate Limiting binding")?.status).toBe("invalid format");
    expect(checks.find((check) => check.category === "Lead outbox readiness")?.status).toBe("invalid format");
    expect(JSON.stringify(checks)).not.toContain("re_secret");
    expect(JSON.stringify(checks)).not.toContain("turnstile_secret");
  });

  it("allows production durable readiness only with non-placeholder rate-limit namespaces", () => {
    const audit = buildWranglerAudit({
      name: "taskcover",
      compatibility_date: "2026-07-05",
      hyperdrive: [{ binding: "HYPERDRIVE", id: "3a4967f8e714435eb58bda3521531a24" }],
      ratelimits: [{ name: "LEAD_RATE_LIMITER", namespace_id: "920101" }, { name: "ADMIN_RATE_LIMITER", namespace_id: "920102" }],
      durable_objects: { bindings: [{ name: "RATE_LIMIT_COORDINATOR" }] },
      triggers: { crons: ["*/5 * * * *"] },
    });
    const checks = buildProductionChecks(
      {
        APP_URL: "https://taskcover.com",
        NEXT_PUBLIC_APP_URL: "https://taskcover.com",
        LEAD_SUBMISSION_MODE: "production-durable",
        RATE_LIMIT_PROVIDER: "cloudflare",
        RESEND_API_KEY: "re_secret",
        TURNSTILE_SECRET_KEY: "turnstile_secret",
        TURNSTILE_SITE_KEY: "site_key",
        TURNSTILE_EXPECTED_HOSTNAME: "taskcover.com",
        TURNSTILE_EXPECTED_ACTION: "lead-submit",
        CALCOM_BOOKING_URL: "https://cal.com/taskcover/strategy",
      },
      audit
    );
    expect(checks.find((check) => check.category === "Rate Limiting binding")?.status).toBe("configured");
    expect(checks.find((check) => check.category === "Lead outbox readiness")?.status).toBe("live test required");
  });

  it("validates Cal.com URL host and PII-free smoke output assumptions", () => {
    expect(validateHttpUrl("https://cal.com/taskcover/strategy", { httpsOnly: true, expectedHosts: ["cal.com"] })).toBe("valid");
    expect(validateHttpUrl("http://cal.com/taskcover/strategy", { httpsOnly: true, expectedHosts: ["cal.com"] })).toBe("invalid");
    expect(noPiiLogLine("lead_delivery_abcdef")).toBe(true);
    expect(noPiiLogLine("jamie@example.com")).toBe(false);
  });

  it("builds a deployment smoke plan without lead submission endpoints", () => {
    const plan = deploymentSmokePlan("https://taskcover.com");
    expect(plan.some((check) => check.name === "www redirect")).toBe(true);
    expect(plan.some((check) => check.url.includes("api/leads"))).toBe(false);
  });
});
