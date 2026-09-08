import { describe, expect, it } from "vitest";
import { convergentCap, isEquivalentConvergent, sqrtTwoConvergents } from "./convergentsModel";
describe("sqrt two convergent laboratory", () => {
  it("computes reference convergents from consistent indexed seeds", () => {
    expect(sqrtTwoConvergents(7).map(c => [c.p, c.q])).toEqual([[1, 1], [3, 2], [7, 5], [17, 12], [41, 29], [99, 70], [239, 169]]);
    expect(sqrtTwoConvergents(6)[5].signedError).toBeCloseTo(99 / 70 - Math.SQRT2, 14);
  });
  it("preserves exact Pell and determinant identities and decreasing alternating errors", () => {
    const all = sqrtTwoConvergents(14);
    all.forEach((c, i) => {
      expect(c.p * c.p - 2 * c.q * c.q).toBe((-1) ** (i + 1));
      expect(c.determinant).toBe((-1) ** (i + 1));
      expect(Math.sign(c.signedError)).toBe((-1) ** (i + 1));
      if (i) expect(Math.abs(c.signedError)).toBeLessThan(Math.abs(all[i - 1].signedError));
      if (i >= 2) { expect(c.p).toBe(2 * all[i - 1].p + all[i - 2].p); expect(c.q).toBe(2 * all[i - 1].q + all[i - 2].q); }
    });
  });
  it("distinguishes best convergent from best absolute-error rational", () => {
    expect(convergentCap(12).best.q).toBe(12);
    expect(convergentCap(20).best.p).toBe(17);
    expect(convergentCap(3).best.p).toBe(3);
    expect(convergentCap(3).bestRational).toMatchObject({ p: 4, q: 3 });
  });
  it("checks every denominator cap against an independent exhaustive fraction search", () => {
    for (let cap = 1; cap <= 100; cap++) {
      const result = convergentCap(cap);
      let bestError = Infinity;
      for (let q = 1; q <= cap; q++) for (let p = q; p <= 2 * q; p++) bestError = Math.min(bestError, Math.abs(p / q - Math.SQRT2));
      expect(result.best.q).toBeLessThanOrEqual(cap);
      expect(result.bestRational.error).toBeCloseTo(bestError, 14);
    }
  });
  it("checks rational answers without floating point tolerances", () => {
    expect(isEquivalentConvergent("198", "140", 99, 70)).toBe(true);
    expect(isEquivalentConvergent("99", "71", 99, 70)).toBe(false);
    expect(isEquivalentConvergent("", "70", 99, 70)).toBe(false);
    expect(isEquivalentConvergent("0", "0", 99, 70)).toBe(false);
    expect(isEquivalentConvergent("1.414", "1", 99, 70)).toBe(false);
  });
  it("rejects invalid counts and caps", () => {
    expect(() => sqrtTwoConvergents(0)).toThrow();
    expect(() => sqrtTwoConvergents(15)).toThrow();
    expect(() => convergentCap(101)).toThrow();
    expect(() => convergentCap(NaN)).toThrow();
  });
});
