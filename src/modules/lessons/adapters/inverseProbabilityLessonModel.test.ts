import { describe, expect, it } from "vitest";
import { inverseCdf, inverseQuantile, standardQuantile } from "./inverseProbabilityLessonModel";

describe("inverse probability model", () => {
  it("finds the target normal quantile", () => {
    const x = inverseQuantile(0.95, 0, 1, "normal");
    expect(x).toBeCloseTo(1.6449, 4);
    expect(inverseCdf(x, 0, 1, "normal")).toBeCloseTo(0.95, 4);
  });

  it("supports additional location-scale distributions", () => {
    expect(standardQuantile(0.5, "logistic")).toBeCloseTo(0);
    expect(standardQuantile(0.75, "uniform")).toBeCloseTo(0.5);
  });
});
