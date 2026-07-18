import { describe, expect, it } from "vitest";
import {
  countsAsUnread,
  isActiveInInbox,
  NOTIFICATION_GROUP,
  resolveSnoozeUntil,
  SNOOZE_PRESETS,
} from "./notification-domain";

const NOW = new Date("2026-07-17T12:00:00Z");
const PAST = new Date("2026-07-17T11:00:00Z");
const FUTURE = new Date("2026-07-17T13:00:00Z");

describe("isActiveInInbox", () => {
  it("shows unread and read items", () => {
    expect(isActiveInInbox({ state: "unread", snoozedUntil: null, now: NOW })).toBe(true);
    expect(isActiveInInbox({ state: "read", snoozedUntil: null, now: NOW })).toBe(true);
  });

  it("hides done items", () => {
    expect(isActiveInInbox({ state: "done", snoozedUntil: null, now: NOW })).toBe(false);
  });

  it("hides a snooze that is still in the future and resurfaces once it elapses", () => {
    expect(isActiveInInbox({ state: "snoozed", snoozedUntil: FUTURE, now: NOW })).toBe(false);
    expect(isActiveInInbox({ state: "snoozed", snoozedUntil: PAST, now: NOW })).toBe(true);
  });
});

describe("countsAsUnread", () => {
  it("counts unread, and elapsed snoozes, but not read/done/pending snoozes", () => {
    expect(countsAsUnread({ state: "unread", snoozedUntil: null, now: NOW })).toBe(true);
    expect(countsAsUnread({ state: "read", snoozedUntil: null, now: NOW })).toBe(false);
    expect(countsAsUnread({ state: "done", snoozedUntil: null, now: NOW })).toBe(false);
    expect(countsAsUnread({ state: "snoozed", snoozedUntil: FUTURE, now: NOW })).toBe(false);
    expect(countsAsUnread({ state: "snoozed", snoozedUntil: PAST, now: NOW })).toBe(true);
  });
});

describe("NOTIFICATION_GROUP", () => {
  it("puts review and approval requests in action_required", () => {
    expect(NOTIFICATION_GROUP.review_request).toBe("action_required");
    expect(NOTIFICATION_GROUP.approval_request).toBe("action_required");
    expect(NOTIFICATION_GROUP.mention).toBe("informational");
  });
});

describe("resolveSnoozeUntil", () => {
  it("resolves known presets to a future instant and rejects unknown ones", () => {
    expect(resolveSnoozeUntil("3h", NOW)).toEqual(new Date("2026-07-17T15:00:00Z"));
    expect(resolveSnoozeUntil("nonsense", NOW)).toBeNull();
  });

  it("every preset resolves to a strictly future time", () => {
    for (const preset of SNOOZE_PRESETS) {
      expect(resolveSnoozeUntil(preset.id, NOW)!.getTime()).toBeGreaterThan(NOW.getTime());
    }
  });
});
