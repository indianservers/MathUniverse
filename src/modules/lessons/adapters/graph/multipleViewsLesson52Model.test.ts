import { describe, expect, it } from "vitest";
import {
  MULTIPLE_FULL_BOUNDS,
  detailBounds,
  multipleCurvePath,
  multipleViewSlope,
  multipleViewValue,
  multipleXFromPixel,
} from "./multipleViewsLesson52Model";

describe("multiple graphics views lesson 52 model", () => {
  it("matches the target shared cursor value", () => {
    expect(multipleViewValue(2)).toBeCloseTo(1.409297, 6);
    expect(multipleViewSlope(2)).toBeCloseTo(-0.166147, 6);
  });

  it("creates a detail window centered on the same point", () => {
    const bounds = detailBounds(2);
    expect(bounds.xMin).toBe(1.6);
    expect((bounds.yMin + bounds.yMax) / 2).toBeCloseTo(multipleViewValue(2));
  });

  it("generates full and detail curves and pointer mapping", () => {
    expect(
      multipleCurvePath(MULTIPLE_FULL_BOUNDS, 400, 260).split(" "),
    ).toHaveLength(401);
    expect(
      multipleCurvePath(detailBounds(2), 400, 260).split(" "),
    ).toHaveLength(401);
    expect(multipleXFromPixel(280, MULTIPLE_FULL_BOUNDS, 400)).toBe(2);
  });
});
