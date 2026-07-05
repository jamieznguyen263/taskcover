import { describe, expect, it } from "vitest";
import { signCloudinaryParams, validateUploadMetadata } from "./media-provider";

describe("media provider validation", () => {
  it("rejects unsupported and oversized uploads", () => {
    expect(() => validateUploadMetadata({ mimeType: "image/svg+xml", bytes: 10 })).toThrow(/Unsupported/);
    expect(() => validateUploadMetadata({ mimeType: "image/png", bytes: 6 * 1024 * 1024 })).toThrow(/exceeds/);
    expect(() => validateUploadMetadata({ mimeType: "image/webp", bytes: 1024 })).not.toThrow();
  });

  it("signs Cloudinary upload params deterministically", () => {
    const signature = signCloudinaryParams({ timestamp: 123, folder: "taskcover/insights", context: "uploaded_by=user" }, "secret");
    expect(signature).toMatch(/^[a-f0-9]{40}$/);
    expect(signature).toBe(
      signCloudinaryParams({ context: "uploaded_by=user", folder: "taskcover/insights", timestamp: 123 }, "secret")
    );
  });
});
