import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  isDatabaseConfigured: vi.fn(() => true),
  isConfigured: vi.fn(() => false),
  publishDueArticles: vi.fn(async () => ({ scanned: 1, published: 1, failed: 0, skipped: 0 })),
  processLeadDeliveryJobs: vi.fn(async () => ({ scanned: 0, processed: 0, succeeded: 0, retrying: 0, deadLetter: 0, skipped: 0 })),
  recoverStaleLeadDeliveryLocks: vi.fn(async () => undefined),
  logOperationalEvent: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({ isDatabaseConfigured: mocks.isDatabaseConfigured }));
vi.mock("@/lib/admin/scheduler", () => ({
  getPublishScheduler: () => ({ isConfigured: mocks.isConfigured, publishDueArticles: mocks.publishDueArticles }),
}));
vi.mock("@/lib/leads/outbox", () => ({
  processLeadDeliveryJobs: mocks.processLeadDeliveryJobs,
  recoverStaleLeadDeliveryLocks: mocks.recoverStaleLeadDeliveryLocks,
}));
vi.mock("@/lib/leads/logging", () => ({ logOperationalEvent: mocks.logOperationalEvent }));

import { runScheduledTasks } from "./scheduled";

describe("Cloudflare scheduled tasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.isDatabaseConfigured.mockReturnValue(true);
    mocks.isConfigured.mockReturnValue(false);
  });

  it("does not publish when the publishing scheduler is disabled", async () => {
    const result = await runScheduledTasks(undefined, Date.UTC(2026, 6, 10));

    expect(mocks.publishDueArticles).not.toHaveBeenCalled();
    expect(mocks.processLeadDeliveryJobs).toHaveBeenCalledOnce();
    expect(result.published).toBeNull();
    expect(result.skipped).toContain("publishing-scheduler-disabled");
  });

  it("publishes due records only when the scheduler is configured", async () => {
    mocks.isConfigured.mockReturnValue(true);
    const result = await runScheduledTasks(undefined, Date.UTC(2026, 6, 10));

    expect(mocks.publishDueArticles).toHaveBeenCalledOnce();
    expect(result.published?.published).toBe(1);
    expect(result.skipped).not.toContain("publishing-scheduler-disabled");
  });
});
