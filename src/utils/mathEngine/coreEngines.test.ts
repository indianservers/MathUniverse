import { describe, expect, it } from "vitest";
import { circleMetrics, lineEquation, polygonArea, triangleMetrics } from "./geometryUtils";
import { sampleSurface as sampleLegacySurface, generateTableValues, sampleFunction } from "./graphSampler";
import { sampleSurface } from "./graph3dUtils";
import { dotProduct, gaussianElimination, rref, validateMatrix } from "./linearAlgebraUtils";
import { describe as describeData, quartiles, standardDeviation } from "./statisticsUtils";

describe("Math Lab core engine safeguards", () => {
  it("samples bounded 2D functions and supports descending value tables", () => {
    expect(sampleFunction("x^2", -2, 2, 99_999).points).toHaveLength(5000);
    expect(generateTableValues("x", 2, -2, 1).rows.map((row) => row.x)).toEqual([2, 1, 0, -1, -2]);
    expect(generateTableValues("not valid", -1, 1, 1).rows).toHaveLength(0);
  });

  it("handles unsafe and reversed 3D surface options", () => {
    const reversed = sampleSurface("z=x+y", 3, -3, 2, -2, 4);
    expect(reversed.grid).toHaveLength(8);
    expect(reversed.error).toBeUndefined();
    expect(sampleSurface("x+y", 0, 0, -1, 1).error).toMatch(/non-zero interval/);
    expect(sampleSurface("sqrt(-1)", -1, 1, -1, 1).warning).toMatch(/no finite values/);
    expect(sampleLegacySurface("z=x+y", -1, 1, 500)).toHaveLength(120);
  });

  it("validates geometry before calculating measures", () => {
    expect(triangleMetrics(3, 4, 5)).toMatchObject({ valid: true, area: 6, perimeter: 12 });
    expect(triangleMetrics(1, 2, 4).valid).toBe(false);
    expect(circleMetrics(-1).valid).toBe(false);
    expect(lineEquation(2, 1, 2, 8)).toMatchObject({ kind: "vertical", equation: "x = 2" });
    expect(polygonArea([{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 3 }]).area).toBe(6);
  });

  it("adds complete descriptive statistics options", () => {
    expect(quartiles([1, 2, 3, 4, 5])).toEqual({ q1: 1.5, q2: 3, q3: 4.5, iqr: 3 });
    expect(standardDeviation([2, 2, 2])).toBe(0);
    expect(describeData([1, 2, 3, Number.NaN])).toMatchObject({ count: 3, mean: 2, median: 2, minimum: 1, maximum: 3 });
  });

  it("rejects malformed matrix and vector inputs instead of truncating silently", () => {
    expect(Number.isNaN(dotProduct([1, 2], [3]))).toBe(true);
    expect(validateMatrix([[1, 2], [3]])).toMatchObject({ valid: false });
    expect(gaussianElimination([[1, 2], [3]])).toMatchObject({ result: [], error: expect.any(String) });
    expect(rref([[1, 2], [3]])).toMatchObject({ result: [], rank: 0, error: expect.any(String) });
  });
});
