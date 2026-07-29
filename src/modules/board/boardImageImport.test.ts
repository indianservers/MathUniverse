import { describe, expect, it } from "vitest";
import { detectMathRegions, fingerprintStrokes, normalizeReadingOrder, validateBoardImage } from "./boardImageImport";
import type { BoardRecognitionRegion } from "./types";

describe("Board image intake", () => {
  it("validates supported types and size limits", () => {
    expect(validateBoardImage({ type: "image/png", size: 2_000 })).toBe(true);
    expect(() => validateBoardImage({ type: "image/gif", size: 2_000 })).toThrow("UNSUPPORTED_IMAGE");
    expect(() => validateBoardImage({ type: "image/png", size: 9 * 1024 * 1024 })).toThrow("IMAGE_TOO_LARGE");
  });

  it("detects separated horizontal ink regions", () => {
    const width = 80;
    const height = 60;
    const data = new Uint8ClampedArray(width * height * 4).fill(255);
    for (const y of [10, 11, 12, 40, 41, 42]) for (let x = 10; x < 70; x += 1) {
      const offset = (y * width + x) * 4;
      data[offset] = 0; data[offset + 1] = 0; data[offset + 2] = 0; data[offset + 3] = 255;
    }
    const regions = detectMathRegions({ width, height, data, colorSpace: "srgb" } as ImageData);
    expect(regions).toHaveLength(2);
    expect(regions[0].readingOrder).toBe(0);
  });

  it("normalizes manual multi-region reading order", () => {
    const base = { imageElementId: "image", regionType: "single-expression", selected: true, recognitionStatus: "idle" } as const;
    const regions: BoardRecognitionRegion[] = [
      { ...base, id: "lower", bounds: { x: 0, y: 100, width: 10, height: 10 } },
      { ...base, id: "upper", bounds: { x: 0, y: 10, width: 10, height: 10 } },
    ];
    expect(normalizeReadingOrder(regions).map((region) => region.id)).toEqual(["upper", "lower"]);
  });

  it("creates stable recognition fingerprints", async () => {
    const points = [{ x: 1, y: 2 }, { x: 3, y: 4 }];
    expect(await fingerprintStrokes(points)).toBe(await fingerprintStrokes(points));
    expect(await fingerprintStrokes(points)).not.toBe(await fingerprintStrokes([{ x: 9, y: 2 }]));
  });
});
