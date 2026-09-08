import { describe, expect, it } from "vitest";
import {
  geometricSequenceAnalysis,
  solveGeometricUnknown,
} from "./geometricSequenceLessonModel";
describe("geometric sequence model", () => {
  it("computes the target sequence and threshold", () => {
    const r = geometricSequenceAnalysis(3, 2);
    expect(r.terms).toEqual([3, 6, 12, 24, 48, 96, 192, 384, 768, 1536]);
    expect(r.term(10)).toBe(1536);
    expect(r.firstIndexBeyond(100)).toBe(7);
    expect(r.behavior).toBe("Growth");
    expect(r.sign).toBe("All positive");
  });
  it("solves all supported unknowns", () => {
    expect(solveGeometricUnknown("n", 192, 7, 3, 2)).toBe("n = 7");
    expect(solveGeometricUnknown("first", 192, 7, 3, 2)).toBe("a₁ = 3");
    expect(solveGeometricUnknown("ratio", 192, 7, 3, 2)).toBe("r = 2");
  });
  it("classifies decay and alternating terms", () => {
    const r = geometricSequenceAnalysis(4, -0.5);
    expect(r.behavior).toBe("Decay");
    expect(r.sign).toBe("Alternating");
  });
});
