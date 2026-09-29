import { describe, expect, it } from "vitest";
import { drawSample, sampleMeans, spreadOf } from "./cltSimulation";

describe("sampling and CLT simulation", () => {
  it("reproduces a seeded sample and calculates its mean", () => {
    const sample = drawSample("skewed", 12, 41);
    expect(drawSample("skewed", 12, 41)).toEqual(sample);
    expect(sample.mean).toBeCloseTo(sample.values.reduce((a, b) => a + b, 0) / 12);
  });

  it("larger samples produce a narrower sampling distribution", () => {
    const small = sampleMeans("skewed", 5, 400, 100);
    const large = sampleMeans("skewed", 40, 400, 100);
    expect(spreadOf(large)).toBeLessThan(spreadOf(small));
  });
});
