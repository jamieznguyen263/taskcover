import "server-only";

import { and, asc, eq, inArray, lte, sql } from "drizzle-orm";
import { getDb, type AdminDb } from "@/lib/db/client";
import { leadDeliveryAttempts, leadDeliveryJobs, leadProviderLinks, leadSubmissions } from "@/lib/db/schema";
import type { LeadDeliveryJobType } from "./acceptance";
import { deliverHubSpotJob } from "./hubspot";
import { logOperationalEvent } from "./logging";
import { deliverResendJob, type ProviderDeliveryResult } from "./resend";
import type { NormalizedLead } from "./types";

export type LeadRetrySummary = {
  scanned: number;
  processed: number;
  succeeded: number;
  retrying: number;
  deadLetter: number;
  skipped: number;
};

const retryableStatuses = ["pending", "retrying"] as const;

export async function processLeadDeliveryJobs(db: AdminDb = getDb(), now = new Date(), batchSize = 10): Promise<LeadRetrySummary> {
  const jobs = await db
    .select()
    .from(leadDeliveryJobs)
    .where(and(inArray(leadDeliveryJobs.status, retryableStatuses), lte(leadDeliveryJobs.nextAttemptAt, now)))
    .orderBy(asc(leadDeliveryJobs.nextAttemptAt))
    .limit(batchSize);

  const summary: LeadRetrySummary = { scanned: jobs.length, processed: 0, succeeded: 0, retrying: 0, deadLetter: 0, skipped: 0 };
  for (const job of jobs) {
    const claim = await claimJob(db, job.id);
    if (!claim) continue;
    summary.processed += 1;
    const started = Date.now();
    try {
      const leadRow = await db.query.leadSubmissions.findFirst({ where: eq(leadSubmissions.id, job.leadId) });
      if (!leadRow) {
        await markJob(db, job.id, { status: "dead-letter", category: "missing-lead", durationMs: Date.now() - started });
        summary.deadLetter += 1;
        continue;
      }
      const result = await deliverProviderJob(job.jobType as LeadDeliveryJobType, normalizeLeadRow(leadRow), leadRow.id);
      await recordResult(db, job.id, job.leadId, job.provider, job.jobType as LeadDeliveryJobType, result, Date.now() - started);
      if (result.status === "succeeded") summary.succeeded += 1;
      else if (result.status === "retry") summary.retrying += 1;
      else if (result.status === "skipped") summary.skipped += 1;
      else summary.deadLetter += 1;
      logOperationalEvent({
        event: "lead_delivery_job",
        provider: job.provider,
        jobType: job.jobType,
        leadId: job.leadId,
        result: result.status,
        durationMs: Date.now() - started,
        retryCount: job.attemptCount + 1,
        statusCodeCategory: "statusCodeCategory" in result ? result.statusCodeCategory : undefined,
      });
    } catch {
      await markJob(db, job.id, { status: "retrying", category: "retryable", durationMs: Date.now() - started });
      summary.retrying += 1;
    }
  }
  return summary;
}

export async function recoverStaleLeadDeliveryLocks(db: AdminDb = getDb(), now = new Date(Date.now() - 15 * 60 * 1000)) {
  await db
    .update(leadDeliveryJobs)
    .set({ status: "retrying", lockedAt: null, lockedBy: null, nextAttemptAt: new Date() })
    .where(and(eq(leadDeliveryJobs.status, "processing"), lte(leadDeliveryJobs.lockedAt, now)));
}

async function claimJob(db: AdminDb, id: string) {
  const [row] = await db
    .update(leadDeliveryJobs)
    .set({ status: "processing", lockedAt: new Date(), lockedBy: "worker", updatedAt: new Date() })
    .where(and(eq(leadDeliveryJobs.id, id), inArray(leadDeliveryJobs.status, retryableStatuses)))
    .returning();
  return row;
}

async function deliverProviderJob(jobType: LeadDeliveryJobType, lead: NormalizedLead, leadId: string): Promise<ProviderDeliveryResult> {
  if (jobType.startsWith("resend-")) return deliverResendJob(jobType, lead, leadId);
  return deliverHubSpotJob(jobType, lead, leadId);
}

async function recordResult(
  db: AdminDb,
  jobId: string,
  leadId: string,
  provider: "resend" | "hubspot",
  jobType: LeadDeliveryJobType,
  result: ProviderDeliveryResult,
  durationMs: number
) {
  await db.insert(leadDeliveryAttempts).values({
    jobId,
    provider,
    jobType,
    result: result.status,
    errorCategory: "category" in result ? result.category : undefined,
    statusCodeCategory: "statusCodeCategory" in result ? result.statusCodeCategory : undefined,
    durationMs,
  });
  if (result.status === "succeeded") {
    await db.update(leadDeliveryJobs).set({ status: "succeeded", completedAt: new Date(), lockedAt: null, lockedBy: null, updatedAt: new Date() }).where(eq(leadDeliveryJobs.id, jobId));
    if (result.providerId) {
      await db
        .insert(leadProviderLinks)
        .values({ leadId, provider, linkType: jobType, providerId: result.providerId })
        .onConflictDoUpdate({
          target: [leadProviderLinks.leadId, leadProviderLinks.provider, leadProviderLinks.linkType],
          set: { providerId: result.providerId, updatedAt: new Date() },
        });
    }
    return;
  }
  await markJob(db, jobId, {
    status: result.status === "retry" ? "retrying" : result.status === "skipped" ? "cancelled" : "dead-letter",
    category: "category" in result ? result.category : undefined,
    durationMs,
  });
}

async function markJob(db: AdminDb, jobId: string, input: { status: "retrying" | "dead-letter" | "cancelled"; category?: string; durationMs?: number }) {
  const set: Record<string, unknown> = {
    status: input.status,
    attemptCount: sql`${leadDeliveryJobs.attemptCount} + 1`,
    lockedAt: null,
    lockedBy: null,
    lastErrorCategory: input.category,
    lastErrorAt: input.status === "retrying" || input.status === "dead-letter" ? new Date() : undefined,
    updatedAt: new Date(),
  };
  if (input.status === "retrying") {
    set.nextAttemptAt = sql`now() + (${backoffSecondsSql()} || ' seconds')::interval`;
  }
  await db
    .update(leadDeliveryJobs)
    .set(set)
    .where(eq(leadDeliveryJobs.id, jobId));
}

function backoffSecondsSql() {
  return sql<string>`LEAST(3600, POWER(2, LEAST(${leadDeliveryJobs.attemptCount}, 8)) * 60)::text`;
}

function normalizeLeadRow(row: typeof leadSubmissions.$inferSelect): NormalizedLead {
  return {
    requestType: row.requestType as NormalizedLead["requestType"],
    locale: row.locale,
    name: row.name,
    workEmail: row.normalizedEmail,
    company: row.company ?? undefined,
    role: row.role ?? undefined,
    websiteUrl: row.websiteUrl ?? undefined,
    market: row.market ?? undefined,
    industry: row.industry ?? undefined,
    serviceInterests: row.serviceInterests,
    primaryChallenge: row.primaryChallenge ?? undefined,
    goals: row.goals ?? undefined,
    timeline: row.timeline ?? undefined,
    investmentRange: row.investmentRange ?? undefined,
    currentTrafficRange: row.currentTrafficRange ?? undefined,
    paidSearchActivity: row.paidSearchActivity ?? undefined,
    preferredTimeZone: row.preferredTimeZone ?? undefined,
    preferredCallWindows: row.preferredCallWindows,
    message: row.message ?? undefined,
    consent: true,
    submittedAt: row.acceptedAt.toISOString(),
    sourcePath: row.sourcePath,
    utm: {
      source: row.utmSource ?? undefined,
      medium: row.utmMedium ?? undefined,
      campaign: row.utmCampaign ?? undefined,
      content: row.utmContent ?? undefined,
      term: row.utmTerm ?? undefined,
    },
    spamSignals: { honeypotPresent: false, turnstileConfigured: false, turnstileVerified: true },
  };
}
