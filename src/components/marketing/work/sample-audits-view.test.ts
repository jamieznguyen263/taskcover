import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("SampleAuditsView responsive containment", () => {
  it("keeps the hero preview and tab rail contained", () => {
    const source = readFileSync(path.join(process.cwd(), "src/components/marketing/work/sample-audits-view.tsx"), "utf8");
    expect(source).toContain("grid min-w-0");
    expect(source).toContain("overflow-hidden rounded-3xl");
    expect(source).toContain("overflow-x-auto");
    expect(source).toContain("scroll-px-2");
    expect(source).toContain("w-[9.5rem] shrink-0");
    expect(source).not.toContain("w-44 shrink-0 rounded-2xl");
  });

  it("prevents body-level horizontal scrolling in global CSS", () => {
    const source = readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
    expect(source).toContain("overflow-x: clip");
    expect(source).toContain("overflow-x: hidden");
  });
});
