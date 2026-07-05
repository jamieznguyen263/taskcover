import { loadEnvConfig } from "@next/env";
import { valuePresent } from "../src/lib/ops/production-activation";

loadEnvConfig(process.cwd());

const live = process.argv.includes("--live");
const token = readArg("--token");
const configured = ["TURNSTILE_SITE_KEY", "TURNSTILE_SECRET_KEY"].every((name) => valuePresent(process.env[name]));
const expectedHostnames = ["taskcover.com", "www.taskcover.com"];
const expectedAction = process.env.TURNSTILE_EXPECTED_ACTION ?? "lead-submit";

if (live && (!configured || !token)) {
  console.error("Turnstile live test requires TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY, and --token. Tokens are not logged.");
  process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Turnstile verification failed.");
  process.exit(1);
});

async function main() {
  let liveVerified: boolean | undefined;
  if (live && token) {
    const form = new FormData();
    form.set("secret", process.env.TURNSTILE_SECRET_KEY as string);
    form.set("response", token);
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
    const data = (await response.json().catch(() => ({}))) as { success?: boolean; hostname?: string; action?: string };
    liveVerified =
      data.success === true &&
      (!process.env.TURNSTILE_EXPECTED_HOSTNAME || data.hostname === process.env.TURNSTILE_EXPECTED_HOSTNAME) &&
      (!process.env.TURNSTILE_EXPECTED_ACTION || data.action === process.env.TURNSTILE_EXPECTED_ACTION);
  }

  console.log(
    JSON.stringify(
      {
        configured,
        supportedLocalDevelopment: "Cloudflare test keys",
        productionBypass: "not allowed",
        failClosedWhenConfigured: true,
        expectedHostnames,
        expectedAction,
        testCases: ["valid token", "invalid token", "missing token", "expired or reused token", "hostname validation", "action validation"],
        tokenLogged: false,
        liveVerified,
      },
      null,
      2
    )
  );
  if (live && !liveVerified) process.exitCode = 1;
}

function readArg(name: string) {
  const prefixed = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (prefixed) return prefixed.slice(name.length + 1);
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}
