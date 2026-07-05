import { processLeadDeliveryJobs, recoverStaleLeadDeliveryLocks } from "../src/lib/leads/outbox";

async function main() {
  await recoverStaleLeadDeliveryLocks();
  const result = await processLeadDeliveryJobs();
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Lead delivery processing failed.");
  process.exit(1);
});
