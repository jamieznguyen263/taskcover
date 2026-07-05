import { describe, expect, it } from "vitest";
import { validateUploadMetadata } from "./media-provider";

describe("media provider validation", () => {
  it("rejects unsupported and oversized uploads", () => {
    expect(() => validateUploadMetadata({ mimeType: "image/svg+xml", bytes: 10 })).toThrow(/Unsupported/);
    expect(() => validateUploadMetadata({ mimeType: "image/png", bytes: 6 * 1024 * 1024 })).toThrow(/exceeds/);
    expect(() => validateUploadMetadata({ mimeType: "image/webp", bytes: 1024 })).not.toThrow();
  });
});
