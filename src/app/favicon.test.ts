import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Regression guard for the favicon.
 *
 * `src/app/favicon.ico` is a Next.js metadata-convention file, so Next decodes
 * it during `next dev` and the build. Palette-mode (color type 3) PNGs embedded
 * in the ICO are rejected by Next's image decoder ("The PNG is not in RGBA
 * format!"), which 500s every page in dev. Keep the embedded PNGs truecolor
 * (RGB/RGBA) so the icon stays decodable.
 */
function pngColorType(png: Buffer): number {
  // PNG signature (8) + IHDR length (4) + "IHDR" (4) = offset 16; IHDR is
  // width(4) height(4) bitDepth(1) colorType(1) => colorType at offset 25.
  return png[25];
}

describe("favicon.ico", () => {
  it("embeds only truecolor PNGs (no palette-mode images Next cannot decode)", () => {
    const buf = readFileSync(join(process.cwd(), "src/app/favicon.ico"));
    expect(buf.readUInt16LE(0)).toBe(0); // reserved
    expect(buf.readUInt16LE(2)).toBe(1); // type = icon
    const count = buf.readUInt16LE(4);
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const entry = 6 + i * 16;
      const bytes = buf.readUInt32LE(entry + 8);
      const offset = buf.readUInt32LE(entry + 12);
      const blob = buf.subarray(offset, offset + bytes);
      const isPng = blob[0] === 0x89 && blob[1] === 0x50 && blob[2] === 0x4e && blob[3] === 0x47;
      // ICO entries may be BMP; only PNG payloads have the decode restriction.
      if (!isPng) continue;
      const colorType = pngColorType(blob);
      // 2 = RGB, 6 = RGBA (truecolor). 3 = palette (rejected by Next's decoder).
      expect([2, 6]).toContain(colorType);
    }
  });
});
