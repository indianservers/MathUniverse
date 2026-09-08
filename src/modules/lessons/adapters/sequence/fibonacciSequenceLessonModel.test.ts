import { describe, expect, it } from "vitest";
import {
  fibonacciSequenceAnalysis,
  fibonacciSpiralSquares,
  GOLDEN_RATIO,
  standardBinet,
} from "./fibonacciSequenceLessonModel";
describe("Fibonacci sequence model", () => {
  it("generates the target terms and ratio convergence", () => {
    const r = fibonacciSequenceAnalysis(1, 1);
    expect(r.terms).toEqual([1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]);
    expect(r.term(10)).toBe(55);
    expect(r.phiErrors.at(-1)).toBeLessThan(r.phiErrors[2]);
    expect(r.ratios.at(-1)).toBeCloseTo(GOLDEN_RATIO, 3);
  });
  it("computes Binet and dynamic spiral geometry", () => {
    expect(standardBinet(10)).toBe(55);
    const first = fibonacciSpiralSquares(fibonacciSequenceAnalysis(1, 1).terms),
      changed = fibonacciSpiralSquares(fibonacciSequenceAnalysis(1, 3).terms);
    expect(first).toHaveLength(7);
    expect(changed[0].size).toBe(first[0].size);
    expect(changed[1].size).not.toBe(first[1].size);
  });
});
