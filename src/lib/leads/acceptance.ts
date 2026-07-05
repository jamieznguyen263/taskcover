import "server-only";

import crypto from "node:crypto";
import { and, eq } from "drizzle-orm";
import { getDb, type AdminDb } from "@/lib/db/client";
import {
  leadDeliveryJobs,
  leadStatusEvents,
  leadSubmissions,
  leadDeliveryJobTypeEnum,
  leadDeliveryProviderEnum,
} from "@/lib/db/schema";
import type { NormalizedLead } from "./types";

export type LeadDeliveryJobType = (typeof leadDeliveryJobTypeEnum.enumValues)[number];
export type LeadDeliveryProvider = (typeof leadDeliveryProviderEnum.enumValues)[number];

export type AcceptedLead = {
  id: string;
  idempotencyKey: string;
  requestType: NormalizedLead["requestType"];
  locale: NormalizedLead["locale"];
  normalizedEmail: string;
  existed: boolean;
};

type LeadTransaction = Parameters<Parameters<AdminDb["transaction"]>[0]>[0];

const requiredJobs: Array<{ provider: LeadDeliveryProvider; jobType: LeadDeliveryJobType }> = [
  { provider: "resend", jobType: "resend-internal-notification" },
  { provider: "resend", jobType: "resend-visitor-confirmation" },
  { provider: "hubspot", jobType: "hubspot-contact-sync" },
  { provider: "hubspot", jobType: "hubspot-company-sync" },
  { provider: "hubspot", jobType: "hubspot-deal-sync" },
];

export function leadIdempotencyKey(lead: NormalizedLead) {
  const stable = [
    lead.requestType,
    lead.locale,
    lead.workEmail,
    lead.sourcePath,
    lead.websiteUrl ?? "",
    lead.company ?? "",
    lead.message ?? "",
  ].join("\n");
  return `lead_${crypto.createHash("sha256").update(stable).digest("hex")}`;
}

export function deliveryJobIdempotencyKey(leadId: string, jobType: LeadDeliveryJobType, recipientOrTarget = "primary") {
  return `lead_delivery_${crypto
    .createHash("sha256")
    .update(`${leadId}:${jobType}:${recipientOrTarget}`)
    .digest("hex")}`;
}

export async function acceptLeadDurably(lead: NormalizedLead, db: AdminDb = getDb()): Promise<AcceptedLead> {
  const idempotencyKey = leadIdempotencyKey(lead);
  return db.transaction(async (tx) => {
    const existing = await tx.query.leadSubmissions.findFirst({
      where: eq(leadSubmissions.idempotencyKey, idempotencyKey),
    });

    if (existing) {
      await ensureLeadJobs(tx, existing.id);
      return {
        id: existing.id,
        idempotencyKey,
        requestType: existing.requestType as NormalizedLead["requestType"],
        locale: existing.locale,
        normalizedEmail: existing.normalizedEmail,
        existed: true,
      };
    }

    const [inserted] = await tx
      .insert(leadSubmissions)
      .values({
        idempotencyKey,
        requestType: lead.requestType,
        locale: lead.locale,
        name: lead.name,
        normalizedEmail: lead.workEmail,
        company: lead.company,
        role: lead.role,
        websiteUrl: lead.websiteUrl,
        market: lead.market,
        industry: lead.industry,
        serviceInterests: lead.serviceInterests ?? [],
        primaryChallenge: lead.primaryChallenge,
        goals: lead.goals,
        timeline: lead.timeline,
        investmentRange: lead.investmentRange,
        currentTrafficRange: lead.currentTrafficRange,
        paidSearchActivity: lead.paidSearchActivity,
        preferredTimeZone: lead.preferredTimeZone,
        preferredCallWindows: lead.preferredCallWindows ?? [],
        message: lead.message,
        sourcePath: lead.sourcePath,
        utmSource: lead.utm?.source,
        utmMedium: lead.utm?.medium,
        utmCampaign: lead.utm?.campaign,
        utmContent: lead.utm?.content,
        utmTerm: lead.utm?.term,
      })
      .returning();

    await ensureLeadJobs(tx, inserted.id);
    await tx.insert(leadStatusEvents).values({
      leadId: inserted.id,
      eventType: "accepted",
      summary: "Lead accepted durably.",
      metadata: { requestType: lead.requestType, locale: lead.locale },
    });

    return {
      id: inserted.id,
      idempotencyKey,
      requestType: lead.requestType,
      locale: lead.locale,
      normalizedEmail: lead.workEmail,
      existed: false,
    };
  });
}

async function ensureLeadJobs(tx: LeadTransaction, leadId: string) {
  for (const job of requiredJobs) {
    const idempotencyKey = deliveryJobIdempotencyKey(leadId, job.jobType);
    const existing = await tx.query.leadDeliveryJobs.findFirst({
      where: and(eq(leadDeliveryJobs.idempotencyKey, idempotencyKey), eq(leadDeliveryJobs.leadId, leadId)),
    });
    if (!existing) {
      await tx.insert(leadDeliveryJobs).values({ leadId, ...job, idempotencyKey });
    }
  }
}
