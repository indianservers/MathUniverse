import { describe, expect, it } from "vitest";
import { sampledGraphIntersections } from "./sampleIntersections";

const series = (id: string, pairs: Array<[number, number]>) => ({
  id,
  points: pairs.map(([x, y]) => ({ x, y, valid: true })),
});

describe("sampledGraphIntersections", () => {
  it("finds the origin when two lines use different sample positions", () => {
    const result = sampledGraphIntersections([
      series("up", [[-1, -1], [-0.3, -0.3], [0.4, 0.4], [1, 1]]),
      series("down", [[-1, 1], [-0.2, 0.2], [0.5, -0.5], [1, -1]]),
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].x).toBeCloseTo(0, 8);
    expect(result[0].y).toBeCloseTo(0, 8);
  });

  it("finds two parabola and plane crossings, then clears them when a source is removed", () => {
    const parabola = series("parabola", [[-3, 9], [-2, 4], [-1, 1], [0, 0], [1, 1], [2, 4], [3, 9]]);
    const plane = series("plane", [[-3, 4], [3, 4]]);
    expect(sampledGraphIntersections([parabola, plane])).toEqual([{ x: -2, y: 4 }, { x: 2, y: 4 }]);
    expect(sampledGraphIntersections([parabola])).toEqual([]);
  });
});
