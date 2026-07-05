import fs from "node:fs";
import { loadEnvConfig } from "@next/env";
import { buildWranglerAudit, localHyperdriveVariableFor, valuePresent } from "../src/lib/ops/production-activation";

loadEnvConfig(process.cwd());

const raw = fs.readFileSync("wrangler.jsonc", "utf8");
const config = JSON.parse(raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "")) as Record<string, unknown>;
const audit = buildWranglerAudit(config);
const binding = audit.hyperdriveBindings[0] ?? "HYPERDRIVE";
const localVariable = localHyperdriveVariableFor(binding);

if (!audit.hyperdriveBindings.includes(binding)) {
  console.error("Cloudflare preview cannot verify Hyperdrive because no wrangler hyperdrive binding is configured.");
  process.exit(1);
}

if (!valuePresent(process.env[localVariable])) {
  console.error(`Cloudflare local preview requires ${localVariable} in .dev.vars or the environment.`);
  console.error("Use a disposable/development Neon connection string for local preview only. Do not commit the value.");
  process.exit(1);
}

console.log(`Cloudflare local preview Hyperdrive variable present: ${localVariable}`);
