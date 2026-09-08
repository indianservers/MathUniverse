import { describe, expect, it } from "vitest";
import {
  gammaAnalysis,
  gammaCdf,
  gammaDensity,
  simulateGammaArrival,
} from "./gammaLessonModel";
describe("gamma lesson model", () => {
  it("computes target shape-scale summaries and probabilities", () => {
    const r = gammaAnalysis(3, 2);
    expect(r.mean).toBe(6);
    expect(r.variance).toBe(12);
    expect(r.std).toBeCloseTo(3.464, 3);
    expect(r.mode).toBe(4);
    expect(gammaDensity(6, 3, 2)).toBeCloseTo(0.112, 3);
    expect(gammaCdf(8, 3, 2)).toBeCloseTo(0.7619, 4);
  });
  it("simulates the r-th Poisson arrival", () => {
    const r = simulateGammaArrival(0.5, 3, 533);
    expect(r.arrivals).toHaveLength(8);
    expect(r.waitingTime).toBeGreaterThan(0);
    expect(r.arrivals.every((v, i, a) => i === 0 || v > a[i - 1])).toBe(true);
  });
});
