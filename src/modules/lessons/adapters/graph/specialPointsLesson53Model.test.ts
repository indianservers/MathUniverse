import { describe, expect, it } from "vitest";
import {
  FIT_BOUNDS_53,
  LINES_53,
  QUADRATICS_53,
  curvePath53,
  formatPoint53,
  intersections53,
  roots53,
  vertex53,
} from "./specialPointsLesson53Model";

describe("specialPointsLesson53Model", () => {
  const quadratic = QUADRATICS_53[0];
  const line = LINES_53[0];

  it("derives the target quadratic's roots and vertex", () => {
    expect(roots53(quadratic)).toEqual([
      { x: -1, y: 0 },
      { x: 3, y: 0 },
    ]);
    expect(vertex53(quadratic)).toEqual({ x: 1, y: -4 });
  });

  it("calculates mathematically correct intersections from both equations", () => {
    const points = intersections53(quadratic, line);
    expect(points[0].x).toBeCloseTo((3 - Math.sqrt(17)) / 2);
    expect(points[1].x).toBeCloseTo((3 + Math.sqrt(17)) / 2);
    expect(points[0].y).toBeCloseTo(points[0].x - 1);
  });

  it("builds graph geometry and concise labels", () => {
    expect(
      curvePath53((x) => x * x, FIT_BOUNDS_53, 400, 300).split(" ").length,
    ).toBeGreaterThan(100);
    expect(formatPoint53({ x: 3, y: 0 })).toBe("(3, 0)");
    expect(formatPoint53({ x: 1.234, y: -2.345 })).toBe("(1.23, -2.35)");
  });
});
