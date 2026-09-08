import { describe, expect, it } from "vitest";
import { bestRationalSearch, rationalAnswer, rationalTargets, type RationalTarget } from "./bestRationalModel";
describe("best rational search", () => {
  it("finds actual pi winners under the reference and practice budgets", () => {
    expect(bestRationalSearch("pi", 110, "absolute").best).toMatchObject({ p: 333, q: 106, type: "Convergent" });
    expect(bestRationalSearch("pi", 100, "absolute").best).toMatchObject({ p: 311, q: 99, type: "Semi-convergent" });
    expect(bestRationalSearch("pi", 200, "absolute").best).toMatchObject({ p: 355, q: 113 });
    expect(bestRationalSearch("pi", 110, "absolute").ranked[2]).toMatchObject({ p: 289, q: 92 });
  });
  it("distinguishes error metrics and returns a budget-exceeding next milestone", () => {
    expect(bestRationalSearch("pi", 100, "second").best).toMatchObject({ p: 22, q: 7 });
    expect(bestRationalSearch("pi", 110, "absolute").next).toEqual({ p: 355, q: 113 });
  });
  it("matches an independent exhaustive integer search for all targets and caps 1 to 100", () => {
    for (const target of Object.keys(rationalTargets) as RationalTarget[]) for (let cap = 1; cap <= 100; cap++) for (const metric of ["absolute", "second"] as const) {
      const result = bestRationalSearch(target, cap, metric), alpha = rationalTargets[target].value;
      let minimum = Infinity;
      for (let q = 1; q <= cap; q++) for (let p = Math.floor(alpha) * q; p <= Math.ceil(alpha) * q; p++) minimum = Math.min(minimum, metric === "absolute" ? Math.abs(alpha - p / q) : Math.abs(alpha * q - p));
      expect(result.best[metric]).toBeCloseTo(minimum, 12);
      expect(result.records.every((c, i) => i === 0 || c[metric] < result.records[i - 1][metric])).toBe(true);
    }
  });
  it("searches the full maximum budget and preserves metric relation", () => {
    for (const target of Object.keys(rationalTargets) as RationalTarget[]) {
      const result = bestRationalSearch(target, 10000, "absolute");
      expect(result.candidates.every(c => c.q <= 10000)).toBe(true);
      expect(result.next!.q).toBeGreaterThan(10000);
      for (const c of result.candidates) expect(c.second).toBeCloseTo(c.q * c.absolute, 9);
    }
  });
  it("validates budgets and exact practice fractions", () => {
    expect(() => bestRationalSearch("pi", 0, "absolute")).toThrow();
    expect(() => bestRationalSearch("pi", 10001, "absolute")).toThrow();
    expect(rationalAnswer("710/226", 355, 113)).toBe(true);
    expect(rationalAnswer("355/112", 355, 113)).toBe(false);
    expect(rationalAnswer("0/0", 355, 113)).toBe(false);
    expect(rationalAnswer("", 355, 113)).toBe(false);
  });
});
