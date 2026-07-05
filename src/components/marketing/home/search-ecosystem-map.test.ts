import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("SearchEcosystemMap visual behavior", () => {
  const source = readFileSync(
    path.join(process.cwd(), "src/components/marketing/home/search-ecosystem-map.tsx"),
    "utf8",
  );

  it("keeps the desktop map as an organic floating network, not a static clock", () => {
    expect(source).toContain("surfaceMotion");
    expect(source).toContain("networkPath");
    expect(source).toContain("pathLength");
    expect(source).toContain("strokeDasharray");
    expect(source).toContain("x: motionSpec.x");
    expect(source).toContain("y: motionSpec.y");
    expect(source).not.toContain("{labels.startHere}");
  });

  it("preserves interactive, accessible surface nodes", () => {
    expect(source).toContain("type=\"button\"");
    expect(source).toContain("aria-label={surface.ariaLabel}");
    expect(source).toContain("aria-pressed={isActive}");
    expect(source).toContain("onMouseEnter={() => setActiveId(surface.id)}");
    expect(source).toContain("onFocus={() => setActiveId(surface.id)}");
    expect(source).toContain("focus-visible:outline");
  });

  it("uses stronger colored hierarchy for the explanation cards", () => {
    expect(source).toContain("border-cyan-200");
    expect(source).toContain("border-emerald-200");
    expect(source).toContain("border-teal-200");
    expect(source).toContain("bg-[linear-gradient");
    expect(source).toContain("useReducedMotion");
  });
});
