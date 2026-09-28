import { describe, expect, it } from "vitest";
import { rk4Curve, sampleCurve } from "./Phase1Graph";

describe("Phase 1 differential equation plots", () => {
  it("integrates a first-order solution in both directions from its initial point", () => {
    const points = rk4Curve((_x, y) => -y, { x: 0, y: 1 }, { xMin: -2, xMax: 2, yMin: -1, yMax: 8 });
    const near = (x: number) => points.reduce((best, point) => Math.abs(point.x - x) < Math.abs(best.x - x) ? point : best);
    expect(near(0).y).toBeCloseTo(1, 5);
    expect(near(1).y).toBeCloseTo(Math.exp(-1), 3);
    expect(near(-1).y).toBeCloseTo(Math.E, 3);
  });

  it("keeps undefined function values as graph breaks", () => {
    const points = sampleCurve((x) => 1 / x, -1, 1, 10);
    expect(points[5].y).toBe(Infinity);
    expect(points[0].y).toBe(-1);
    expect(points[10].y).toBe(1);
  });
});
