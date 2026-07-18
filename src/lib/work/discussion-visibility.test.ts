import { describe, expect, it } from "vitest";
import { resolveCommentVisibility } from "./discussion-repository";

describe("resolveCommentVisibility", () => {
  it("keeps a comment internal only when the author wants internal AND may see internal notes", () => {
    expect(resolveCommentVisibility({ wantsInternal: true, canViewInternal: true })).toBe("internal");
  });

  it("downgrades to shared when the author cannot see internal notes (e.g. an external collaborator)", () => {
    expect(resolveCommentVisibility({ wantsInternal: true, canViewInternal: false })).toBe("shared");
  });

  it("is shared when internal was not requested", () => {
    expect(resolveCommentVisibility({ wantsInternal: false, canViewInternal: true })).toBe("shared");
    expect(resolveCommentVisibility({ wantsInternal: false, canViewInternal: false })).toBe("shared");
  });
});
