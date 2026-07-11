import { describe, expect, it } from "vitest";
import { buildImageSources, cloudinaryLqip, isCloudinaryUrl } from "./image";

const CLOUD = "https://res.cloudinary.com/qma93rrv/image/upload/v1/taskcover/insights/a.jpg";

describe("Cloudinary image helpers", () => {
  it("detects Cloudinary URLs", () => {
    expect(isCloudinaryUrl(CLOUD)).toBe(true);
    expect(isCloudinaryUrl("https://example.com/a.jpg")).toBe(false);
    expect(isCloudinaryUrl("/local.png")).toBe(false);
  });

  it("builds responsive srcset with f_auto/q_auto/c_limit for Cloudinary URLs", () => {
    const sources = buildImageSources(CLOUD);
    expect(sources.srcSet).toBeTruthy();
    expect(sources.srcSet).toContain("f_auto,q_auto,c_limit,w_320");
    expect(sources.srcSet).toContain("1600w");
    expect(sources.fallbackSrc).toContain("w_1280");
    expect(sources.sizes).toContain("100vw");
  });

  it("passes non-Cloudinary URLs through unchanged with no srcset", () => {
    const sources = buildImageSources("https://example.com/a.jpg");
    expect(sources.fallbackSrc).toBe("https://example.com/a.jpg");
    expect(sources.srcSet).toBeUndefined();
  });

  it("produces a blurred LQIP only for Cloudinary URLs", () => {
    expect(cloudinaryLqip(CLOUD)).toContain("e_blur");
    expect(cloudinaryLqip("https://example.com/a.jpg")).toBeNull();
  });
});
