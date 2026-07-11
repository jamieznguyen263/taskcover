import { describe, expect, it } from "vitest";
import { extractYouTubeId, isValidYouTubeId } from "./youtube";

describe("YouTube helpers", () => {
  it("extracts the video ID from every common URL shape", () => {
    expect(extractYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractYouTubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractYouTubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractYouTubeId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractYouTubeId("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("passes a bare 11-character ID through", () => {
    expect(extractYouTubeId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("validates IDs", () => {
    expect(isValidYouTubeId("dQw4w9WgXcQ")).toBe(true);
    expect(isValidYouTubeId("short")).toBe(false);
    expect(isValidYouTubeId("has spaces!!")).toBe(false);
  });
});
