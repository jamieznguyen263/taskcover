import { describe, expect, it } from "vitest";
import {
  buildProductionChecks,
  buildWranglerAudit,
  deploymentSmokePlan,
  localHyperdriveVariableFor,
  migrationGuard,
  noPiiLogLine,
  redactValue,
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
    });
    expect(audit.hyperdriveBindings).toEqual(["HYPERDRIVE"]);
    expect(audit.hyperdrivePlaceholderIds).toEqual(["HYPERDRIVE"]);
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
