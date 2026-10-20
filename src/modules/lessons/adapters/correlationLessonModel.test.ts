import { describe, expect, it } from "vitest";
import { correlationDefault, correlationStats } from "./correlationLessonModel";
describe("Correlation model", () => {
  it("computes Pearson statistics", () => {
    const stats = correlationStats();
    expect(stats.r).toBeGreaterThan(0.9);
    expect(stats.n).toBe(9);
  });
  it("recognizes perfect positive pairs", () => {
    expect(
      correlationStats([
        { x: 1, y: 2 },
        { x: 2, y: 4 },
      ]).r,
    ).toBeCloseTo(1);
    expect(correlationDefault).toHaveLength(9);
  });
});


describe("correlation boundaries and fitted line", () => {
  it("calculates the actual regression line in either direction", () => {
    const positive = correlationStats([1,2,3,4].map(x=>({x,y:2*x+1})));
    expect(positive.slope).toBeCloseTo(2);expect(positive.intercept).toBeCloseTo(1);expect(positive.r).toBeCloseTo(1);
    const negative = correlationStats([1,2,3,4].map(x=>({x,y:5-3*x})));
    expect(negative.slope).toBeCloseTo(-3);expect(negative.intercept).toBeCloseTo(5);expect(negative.r).toBeCloseTo(-1);
  });
  it("reports zero-variation correlation as undefined", () => {
    const result = correlationStats([{x:1,y:2},{x:2,y:2},{x:3,y:2}]);
    expect(result.defined).toBe(false);expect(Number.isNaN(result.r)).toBe(true);
    expect(result.slope).toBe(0);expect(result.intercept).toBe(2);
  });
  it("keeps correlation independent of small measurement units", () => {
    const result = correlationStats([1,2,3,4].map(x=>({x:x*1e-8,y:x*2e-8})));
    expect(result.defined).toBe(true);expect(result.r).toBeCloseTo(1);
  });
});
