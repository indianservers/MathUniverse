import { describe, expect, it } from "vitest";
import { benchmarkCounts, phase2BenchmarkCorpus } from "./phase2Corpus";

describe("versioned phase 2 benchmark corpus", () => {
  it("contains 200 uniquely identified, auditable cases", () => {
    expect(phase2BenchmarkCorpus).toHaveLength(200);
    expect(new Set(phase2BenchmarkCorpus.map((item) => item.id)).size).toBe(200);
    for (const item of phase2BenchmarkCorpus) {
      expect(item.version).toBe("2.0.0");
      expect(item.expectedBehavior.length).toBeGreaterThan(10);
      expect(item.supportedDomain.length).toBeGreaterThan(10);
      expect(item.expectedInteraction.length).toBeGreaterThan(10);
      expect(item.accessibilityExpectation.length).toBeGreaterThan(10);
      expect(item.tolerance).toBeGreaterThanOrEqual(0);
    }
  });

  it("meets each requested category floor", () => {
    expect(benchmarkCounts()).toEqual({ EXPLICIT: 30, DISCONTINUOUS: 15, IMPLICIT: 15, PARAMETRIC: 15, POLAR: 15, REGION: 15, POINT_OF_INTEREST: 20, SCHOOL_GEOMETRY: 20, CONIC: 10, DEGENERACY: 15, TRANSFORMATION: 10, LOCUS: 10, ACCESSIBILITY: 10 });
  });
});
