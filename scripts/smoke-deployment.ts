import { deploymentSmokePlan, validateHttpUrl } from "../src/lib/ops/production-activation";

const baseUrl = readArg("--base-url");
if (!baseUrl || validateHttpUrl(baseUrl, { httpsOnly: !baseUrl.includes("localhost") }) !== "valid") {
  console.error("Usage: npm run smoke:deployment -- --base-url=https://taskcover.com");
  process.exit(1);
}

const checks = deploymentSmokePlan(baseUrl);

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Deployment smoke test failed.");
  process.exit(1);
});

async function main() {
  const results = [];
  for (const check of checks) {
    const response = await fetch(check.url, { redirect: check.allowRedirect ? "manual" : "follow" });
    const redirectOk = check.allowRedirect && response.status >= 300 && response.status < 400;
    const statusOk = check.expectedStatus ? response.status === check.expectedStatus : response.ok;
    results.push({
      name: check.name,
      status: response.status,
      ok: redirectOk || statusOk,
      redirected: response.redirected || redirectOk,
    });
  }

  console.log(JSON.stringify({ baseUrl, submittedLeads: false, results }, null, 2));
  if (results.some((result) => !result.ok)) process.exitCode = 1;
}

function readArg(name: string) {
  const prefixed = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (prefixed) return prefixed.slice(name.length + 1);
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}
