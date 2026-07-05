import { loadEnvConfig } from "@next/env";
import { validateHttpUrl, valuePresent } from "../src/lib/ops/production-activation";

loadEnvConfig(process.cwd());

const live = process.argv.includes("--live");
const bookingUrl = process.env.CALCOM_BOOKING_URL;
const configured = valuePresent(bookingUrl);
let safe = false;
let host = "";
let piiQueryParams: string[] = [];

if (configured) {
  const url = new URL(bookingUrl as string);
  host = url.hostname;
  piiQueryParams = Array.from(url.searchParams.keys()).filter((key) => /email|name|phone|company/i.test(key));
  safe = validateHttpUrl(bookingUrl, { httpsOnly: true, expectedHosts: ["cal.com", "www.cal.com", "app.cal.com"] }) === "valid" && piiQueryParams.length === 0;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Cal.com verification failed.");
  process.exit(1);
});

async function main() {
  let liveStatus: number | undefined;
  if (live && configured && safe) {
    const response = await fetch(bookingUrl as string, { method: "HEAD", redirect: "follow" });
    liveStatus = response.status;
  }

  console.log(
    JSON.stringify(
      {
        configured,
        safe,
        host,
        piiQueryParams,
        ctaWhenMissing: "hidden",
        falseBookingConfirmation: "not implemented",
        liveChecked: Boolean(liveStatus),
        liveStatus,
      },
      null,
      2
    )
  );
  if (configured && !safe) process.exitCode = 1;
}
