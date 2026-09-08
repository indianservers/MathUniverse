import { randomLcg } from "d3";
import { describe, expect, it } from "vitest";
import { binomialArrangement, binomialMasses, choosePositions, queryBinomial, sampleBinomial, swapBinomialPositions } from "./binomialDistributionModel";
describe("dedicated binomial laboratory", () => {
  it("calculates the reference result and exact moments", () => {
    const masses = binomialMasses(8, .7);
    expect(masses[6]).toBeCloseTo(.29647548, 10);
    expect(choosePositions(8, 6)).toBe(28);
    expect(masses.reduce((sum, m, r) => sum + m * r, 0)).toBeCloseTo(5.6);
    expect(masses.reduce((sum, m, r) => sum + m * (r - 5.6) ** 2, 0)).toBeCloseTo(1.68);
  });
  it("normalizes every supported n and hundredth p, including certainty", () => {
    for (let n = 1; n <= 20; n++) for (let step = 0; step <= 100; step++) {
      const masses = binomialMasses(n, step / 100);
      expect(masses.reduce((sum, x) => sum + x, 0)).toBeCloseTo(1, 12);
      expect(masses.every(x => x >= 0 && x <= 1)).toBe(true);
    }
    expect(binomialMasses(8, 0)[0]).toBe(1);
    expect(binomialMasses(8, 1)[8]).toBe(1);
  });
  it("sums inclusive query bounds and complementary tails", () => {
    const m = binomialMasses(8, .7);
    expect(queryBinomial(m, "exact", 6)).toBe(m[6]);
    expect(queryBinomial(m, "between", 5, 7)).toBeCloseTo(m[5] + m[6] + m[7]);
    expect(queryBinomial(m, "atMost", 5) + queryBinomial(m, "atLeast", 6)).toBeCloseTo(1);
    expect(() => queryBinomial(m, "between", 7, 4)).toThrow();
  });
  it("enumerates every unique arrangement and preserves successes when swapped", () => {
    for (let n = 1; n <= 10; n++) for (let r = 0; r <= n; r++) {
      const seen = new Set<string>();
      for (let rank = 0; rank < choosePositions(n, r); rank++) {
        const arrangement = binomialArrangement(n, r, rank);
        expect(arrangement.filter(Boolean)).toHaveLength(r);
        expect(swapBinomialPositions(arrangement, 0, n - 1).filter(Boolean)).toHaveLength(r);
        seen.add(arrangement.join(""));
      }
      expect(seen.size).toBe(choosePositions(n, r));
    }
    expect(binomialArrangement(8, 6, 0)).toEqual([true, true, true, true, true, true, false, false]);
  });
  it("uses real D3 samples and summarizes the actual histogram", () => {
    const s = sampleBinomial(8, .7, 2000, randomLcg(42));
    expect(s.counts.reduce((a, b) => a + b, 0)).toBe(2000);
    expect(s.mean).toBeCloseTo(s.counts.reduce((sum, c, k) => sum + c * k, 0) / 2000);
    expect(Math.abs(s.mean - 5.6)).toBeLessThan(.12);
    expect(Math.abs(s.variance - 1.68)).toBeLessThan(.2);
    expect(sampleBinomial(8, 0, 20).counts[0]).toBe(20);
    expect(sampleBinomial(8, 1, 20).counts[8]).toBe(20);
  });
  it("rejects invalid inputs", () => {
    expect(() => binomialMasses(0, .5)).toThrow();
    expect(() => binomialMasses(8, NaN)).toThrow();
    expect(() => choosePositions(8, 9)).toThrow();
    expect(() => binomialArrangement(8, 6, 28)).toThrow();
    expect(() => swapBinomialPositions([true], 0, 1)).toThrow();
    expect(() => sampleBinomial(8, .7, 0)).toThrow();
    expect(() => sampleBinomial(8, .7, 20, () => 1)).toThrow();
  });
});
