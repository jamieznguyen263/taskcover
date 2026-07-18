import { describe, expect, it } from "vitest";
import { extractActions } from "./action-extraction";

describe("extractActions", () => {
  it("extracts unchecked task boxes and skips checked ones", () => {
    const body = ["- [ ] Follow up with Vivagen", "- [x] Sent the invoice", "* [ ] Book the room"].join("\n");
    expect(extractActions(body).map((a) => a.title)).toEqual(["Follow up with Vivagen", "Book the room"]);
  });

  it("recognises ACTION/TODO/Follow-up markers with various separators", () => {
    const body = ["ACTION: send the proposal", "TODO - book the venue", "Follow up – call the client"].join("\n");
    expect(extractActions(body).map((a) => a.title)).toEqual([
      "send the proposal",
      "book the venue",
      "call the client",
    ]);
  });

  it("recognises the '@name to do X' pattern", () => {
    expect(extractActions("@Mai to draft the September brief").map((a) => a.title)).toEqual([
      "draft the September brief",
    ]);
  });

  it("de-duplicates case-insensitively and reports source line numbers", () => {
    const body = ["Notes from the call", "- [ ] Send recap", "ACTION: send recap"].join("\n");
    const actions = extractActions(body);
    expect(actions).toHaveLength(1);
    expect(actions[0]).toEqual({ title: "Send recap", sourceLine: 2 });
  });

  it("ignores ordinary prose and empty input", () => {
    expect(extractActions("We discussed the roadmap and agreed on priorities.")).toEqual([]);
    expect(extractActions("")).toEqual([]);
  });

  it("clips very long titles to 200 characters", () => {
    const long = "x".repeat(300);
    expect(extractActions(`- [ ] ${long}`)[0].title).toHaveLength(200);
  });
});
