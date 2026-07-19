import { describe, expect, it } from "vitest";
import { FLOW_UPLOAD_MAX_BYTES, validateFlowFileUpload } from "./file-upload";

describe("validateFlowFileUpload", () => {
  it("accepts a PDF within the size limit", () => {
    expect(validateFlowFileUpload({ mimeType: "application/pdf", bytes: 1_000_000 })).toEqual({});
  });

  it("accepts common office and image types", () => {
    for (const mimeType of [
      "image/png",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/csv",
    ]) {
      expect(validateFlowFileUpload({ mimeType, bytes: 500 })).toEqual({});
    }
  });

  it("rejects a disallowed type", () => {
    expect(validateFlowFileUpload({ mimeType: "application/x-msdownload", bytes: 10 }).error).toBeDefined();
  });

  it("rejects non-positive or oversized files", () => {
    expect(validateFlowFileUpload({ mimeType: "application/pdf", bytes: 0 }).error).toBeDefined();
    expect(validateFlowFileUpload({ mimeType: "application/pdf", bytes: FLOW_UPLOAD_MAX_BYTES + 1 }).error).toBeDefined();
  });
});
