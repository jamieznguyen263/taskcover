import { describe, expect, it } from "vitest";
import { isCommandMenuShortcut } from "./command-menu-shortcut";

describe("isCommandMenuShortcut", () => {
  it("matches Ctrl+K", () => {
    expect(isCommandMenuShortcut({ key: "k", ctrlKey: true, metaKey: false })).toBe(true);
  });

  it("matches Cmd+K (metaKey), case-insensitively", () => {
    expect(isCommandMenuShortcut({ key: "K", ctrlKey: false, metaKey: true })).toBe(true);
  });

  it("does not match K without a modifier", () => {
    expect(isCommandMenuShortcut({ key: "k", ctrlKey: false, metaKey: false })).toBe(false);
  });

  it("does not match Ctrl+ a different letter", () => {
    expect(isCommandMenuShortcut({ key: "j", ctrlKey: true, metaKey: false })).toBe(false);
  });
});
