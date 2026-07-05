import { loadEnvConfig } from "@next/env";
import { valuePresent } from "../src/lib/ops/production-activation";

loadEnvConfig(process.cwd());

const live = process.argv.includes("--live");
const createContact = process.argv.includes("--create-test-contact");
const configured = ["HUBSPOT_PRIVATE_APP_TOKEN", "HUBSPOT_PIPELINE_ID", "HUBSPOT_NEW_LEAD_STAGE_ID"].every((name) =>
  valuePresent(process.env[name])
);
const optionalProperties = [
  "taskcover_original_lead_reference",
  "taskcover_request_type",
  "taskcover_market",
  "taskcover_service_interests",
  "taskcover_source_path",
  "taskcover_preferred_timezone",
];

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "HubSpot verification failed.");
  process.exit(1);
});

async function main() {
  if (!live) {
    console.log(
      JSON.stringify(
        {
          mode: "offline",
          configured,
          requiredPropertyMappings: ["email", "firstname", "lastname", "company", "website", "pipeline", "dealstage"],
          optionalTaskcoverProperties: optionalProperties,
          createdRecords: false,
        },
        null,
        2
      )
    );
    return;
  }
  if (!configured) {
    console.error("HubSpot live test requires token, pipeline ID, and new-lead stage ID.");
    process.exit(1);
  }
  const pipelineResponse = await fetch(`https://api.hubapi.com/crm/v3/pipelines/deals/${process.env.HUBSPOT_PIPELINE_ID}`, {
    headers: { authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}` },
  });
  let contactStatus: number | undefined;
  if (createContact) {
    const contactResponse = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: { authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`, "content-type": "application/json" },
      body: JSON.stringify({
        properties: {
          email: "taskcover.activation.test@example.com",
          firstname: "Taskcover",
          lastname: "Activation Test",
          taskcover_original_lead_reference: "activation-test-2026-07-05",
        },
      }),
    });
    contactStatus = contactResponse.status;
  }
  console.log(JSON.stringify({ mode: "live", pipelineStatus: pipelineResponse.status, createdContact: createContact, contactStatus }, null, 2));
  if (!pipelineResponse.ok || (createContact && contactStatus && contactStatus >= 400 && contactStatus !== 409)) process.exitCode = 1;
}
