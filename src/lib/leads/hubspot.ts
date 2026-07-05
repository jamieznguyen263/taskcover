import "server-only";

import type { LeadDeliveryJobType } from "./acceptance";
import type { ProviderDeliveryResult } from "./resend";
import type { NormalizedLead } from "./types";

const hubspotBase = "https://api.hubapi.com";

export function isHubSpotConfigured() {
  return Boolean(process.env.HUBSPOT_PRIVATE_APP_TOKEN && process.env.HUBSPOT_PIPELINE_ID && process.env.HUBSPOT_NEW_LEAD_STAGE_ID);
}

export async function deliverHubSpotJob(jobType: LeadDeliveryJobType, lead: NormalizedLead, leadId: string): Promise<ProviderDeliveryResult> {
  if (!isHubSpotConfigured()) return { status: "skipped", category: "configuration" };
  if (jobType === "hubspot-contact-sync") return upsertContact(lead, leadId);
  if (jobType === "hubspot-company-sync") return upsertCompany(lead, leadId);
  if (jobType === "hubspot-deal-sync") return createDeal(lead, leadId);
  return { status: "failed", category: "non-retryable" };
}

async function upsertContact(lead: NormalizedLead, leadId: string) {
  const [firstname, ...rest] = lead.name.split(/\s+/);
  return hubspotFetch("/crm/v3/objects/contacts", {
    method: "POST",
    body: {
      properties: {
        email: lead.workEmail,
        firstname,
        lastname: rest.join(" "),
        company: lead.company,
        website: lead.websiteUrl,
        taskcover_original_lead_reference: leadId,
      },
    },
  });
}

async function upsertCompany(lead: NormalizedLead, leadId: string) {
  if (!lead.company && !lead.websiteUrl) return { status: "skipped", category: "no-company-data" } as const;
  return hubspotFetch("/crm/v3/objects/companies", {
    method: "POST",
    body: {
      properties: {
        name: lead.company,
        domain: lead.websiteUrl ? new URL(lead.websiteUrl).hostname.replace(/^www\./, "") : undefined,
        taskcover_original_lead_reference: leadId,
      },
    },
  });
}

async function createDeal(lead: NormalizedLead, leadId: string) {
  return hubspotFetch("/crm/v3/objects/deals", {
    method: "POST",
    body: {
      properties: {
        dealname: `Taskcover ${lead.requestType} - ${lead.company ?? lead.workEmail}`,
        pipeline: process.env.HUBSPOT_PIPELINE_ID,
        dealstage: process.env.HUBSPOT_NEW_LEAD_STAGE_ID,
        taskcover_original_lead_reference: leadId,
      },
    },
  });
}

async function hubspotFetch(path: string, init: { method: string; body: unknown }): Promise<ProviderDeliveryResult> {
  const response = await fetch(`${hubspotBase}${path}`, {
    method: init.method,
    headers: {
      authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(stripUndefined(init.body)),
  });
  if (response.ok || response.status === 409) {
    const data = (await response.json().catch(() => ({}))) as { id?: string };
    return { status: "succeeded", providerId: data.id };
  }
  if (response.status === 401 || response.status === 403) return { status: "failed", category: "authentication", statusCodeCategory: "4xx" };
  if (response.status === 400) return { status: "failed", category: "invalid-property", statusCodeCategory: "4xx" };
  if (response.status === 429) return { status: "retry", category: "rate-limited", statusCodeCategory: "429" };
  if (response.status >= 500) return { status: "retry", category: "retryable", statusCodeCategory: "5xx" };
  return { status: "failed", category: "non-retryable", statusCodeCategory: "4xx" };
}

function stripUndefined(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(stripUndefined);
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined).map(([key, item]) => [key, stripUndefined(item)]));
}
