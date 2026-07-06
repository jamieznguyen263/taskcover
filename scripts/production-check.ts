import fs from "node:fs";
import { loadEnvConfig } from "@next/env";
import { buildProductionChecks, buildWranglerAudit, setupLocationFor } from "../src/lib/ops/production-activation";

loadEnvConfig(process.cwd());

const args = new Set(process.argv.slice(2));
const asJson = args.has("--json");
const live = args.has("--live");
const wrangler = readWranglerConfig();
const audit = buildWranglerAudit(wrangler);
const checks = buildProductionChecks(process.env, audit);
const payload = {
  mode: live ? "live-opt-in" : "offline",
  liveChecks: live ? "No provider mutations are performed by production:check. Use provider-specific test scripts for live checks." : "disabled",
  wrangler: audit,
  checks,
};

if (asJson) {
  console.log(JSON.stringify(payload, null, 2));
} else {
  console.log(`Taskcover production activation check (${payload.mode})`);
  console.log("Secret values are redacted.\n");
  for (const check of checks) {
    console.log(`${check.category}: ${check.status}`);
    console.log(`  ${check.detail}`);
    if (check.missing.length) {
      console.log("  missing:");
      for (const name of check.missing) {
        console.log(`    ${name}: ${setupLocationFor(name)}`);
      }
    }
    console.log(`  next: ${check.nextAction}`);
  }
  console.log("\nWrangler placeholders requiring real values:");
  console.log(`  worker name: ${audit.workerName || "missing"}`);
  console.log(`  compatibility date: ${audit.compatibilityDate || "missing"}`);
  console.log(`  hyperdrive placeholder ids: ${audit.hyperdrivePlaceholderIds.join(", ") || "none"}`);
  console.log(`  rate limit bindings: ${audit.rateLimitBindings.join(", ") || "none"}`);
  console.log(`  rate limit placeholder namespace ids: ${audit.rateLimitPlaceholderIds.join(", ") || "none"}`);
  console.log(`  durable object bindings: ${audit.durableObjectBindings.join(", ") || "none"}`);
  console.log(`  cron schedules: ${audit.cronSchedules.join(", ") || "none"}`);
  if (audit.stagingWorkerName) console.log(`  staging worker: ${audit.stagingWorkerName}`);
}

const hardFailures = checks.filter((check) => check.status === "invalid format");
if (hardFailures.length) process.exitCode = 1;

function readWranglerConfig() {
  const raw = fs.readFileSync("wrangler.jsonc", "utf8");
  return JSON.parse(stripJsonComments(raw)) as Record<string, unknown>;
}

function stripJsonComments(input: string) {
  return input
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}
