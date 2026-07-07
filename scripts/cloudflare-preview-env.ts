import fs from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { buildWranglerAudit, localHyperdriveVariableFor, valuePresent } from "../src/lib/ops/production-activation";

export function loadCloudflarePreviewEnv(cwd = process.cwd()) {
  loadEnvConfig(cwd);
  loadDevVars(path.join(cwd, ".dev.vars"));
}

export function assertCloudflarePreviewEnv(cwd = process.cwd()) {
  const raw = fs.readFileSync(path.join(cwd, "wrangler.jsonc"), "utf8");
  const config = JSON.parse(stripJsonComments(raw)) as Record<string, unknown>;
  const audit = buildWranglerAudit(config);
  const binding = audit.hyperdriveBindings[0] ?? "HYPERDRIVE";
  const localVariable = localHyperdriveVariableFor(binding);

  if (!audit.hyperdriveBindings.includes(binding)) {
    console.error("Cloudflare preview cannot verify Hyperdrive because no wrangler hyperdrive binding is configured.");
    return false;
  }

  if (!valuePresent(process.env[localVariable])) {
    console.error(`Cloudflare local preview requires ${localVariable} in .dev.vars or the environment.`);
    console.error("Use a disposable/development Neon connection string for local preview only. Do not commit the value.");
    return false;
  }

  console.log(`Cloudflare local preview Hyperdrive variable present: ${localVariable}`);
  return true;
}

function loadDevVars(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    const [, name, rawValue] = match;
    if (!valuePresent(process.env[name])) {
      process.env[name] = unquoteEnvValue(rawValue.trim());
    }
  }
}

function unquoteEnvValue(value: string) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function stripJsonComments(value: string) {
  return value.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}
