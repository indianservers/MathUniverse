import { describe, expect, it } from "vitest";
import { aic, fitMetrics, formatComparisonReport, parseCsvPairs, sampleGrowth } from "./comparisonMath";

describe("model comparison metrics", () => {
  it("gives a quadratic lower RMSE than a line on curved data", () => {
    const { xs, ys } = sampleGrowth();
    const linear = fitMetrics(xs, ys, (x) => 8 + 2 * x);
    const quad = fitMetrics(xs, ys, (x) => 8 + 0.4 * x + 0.12 * x * x);
    expect(quad.rmse).toBeLessThan(linear.rmse);
    expect(aic(quad.rmse, xs.length, 3, 0.1)).toBeLessThan(aic(linear.rmse, xs.length, 2, 0.1) + 20);
  });

  it("imports CSV pairs and formats a report that names Quadratic", () => {
    const data = parseCsvPairs("0,8\n1,8.7\n2,9.6");
    expect(data.xs).toEqual([0, 1, 2]);
    expect(formatComparisonReport([{ name: "Quadratic", rmse: 0.1, r2: 0.9, aic: 4 }])).toContain("Quadratic");
  });
});
