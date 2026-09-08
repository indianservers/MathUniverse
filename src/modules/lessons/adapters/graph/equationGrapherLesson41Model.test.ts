import { describe, expect, it } from "vitest";
import {
  equationCurvePath,
  equationIntersections,
  equationPointAnalysis,
  equationPointFromPixels,
} from "./equationGrapherLesson41Model";

describe("equation grapher lesson 41 model", () => {
  it("reports mathematically accurate membership for the target point", () => {
    const results = equationPointAnalysis(2, 1);
    expect(results.map((result) => result.satisfies)).toEqual([
      false,
      false,
      false,
    ]);
    expect(results[0].leftValue).toBeCloseTo(25 / 36);
    expect(results[1].rightValue).toBe(2);
    expect(results[2].leftValue).toBe(5);
  });

  it("recognizes points that really lie on each solution set", () => {
    expect(equationPointAnalysis(3, 0)[0].satisfies).toBe(true);
    expect(equationPointAnalysis(2, 2)[1].satisfies).toBe(true);
    expect(equationPointAnalysis(0, 3)[2].satisfies).toBe(true);
  });

  it("generates curves, intersections, and snapped graph coordinates", () => {
    expect(equationCurvePath("ellipse").split(" ")).toHaveLength(361);
    expect(equationIntersections()).toHaveLength(6);
    expect(equationPointFromPixels(450, 255, true)).toEqual({ x: 2, y: 1 });
  });
});
