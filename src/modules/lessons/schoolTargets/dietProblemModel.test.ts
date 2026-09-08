import { describe, expect, it } from "vitest";
import { dietMix, dietProblem, servingValue } from "./dietProblemModel";

describe("diet linear programming", () => {
  it("computes the continuous optimum and correct axis corners", () => {
    const result = dietProblem();
    expect(result.optimum).toMatchObject({ x: 2.25, y: 2.25, cost: 20.25, protein: 9, calcium: 9, feasible: true });
    expect(result.vertices).toEqual(expect.arrayContaining([[0, 9], [9, 0], [2.25, 2.25]]));
  });
  it("solves integer servings instead of rounding the continuous optimum", () => {
    expect(dietProblem(9, 9, true).optimum).toMatchObject({ x: 3, y: 2, cost: 22 });
    expect(dietMix(2, 2, 9, 9, true).feasible).toBe(false);
    expect(dietMix(2.25, 2.25, 9, 9, true).feasible).toBe(false);
  });
  it("updates the practice requirement and result", () => {
    expect(dietProblem(12, 12).optimum).toMatchObject({ x: 3, y: 3, cost: 27 });
    expect(dietProblem(12, 12, true).optimum.cost).toBe(27);
    expect(dietMix(2.25, 2.25, 12, 12).feasible).toBe(false);
  });
  it("handles unequal and zero requirements, including axis optima", () => {
    expect(dietProblem(0, 0).optimum.cost).toBe(0);
    expect(dietProblem(0, 9).optimum).toMatchObject({ x: 0, y: 3, cost: 15 });
    expect(dietProblem(9, 0).optimum).toMatchObject({ x: 3, y: 0, cost: 12 });
  });
  it("agrees with independent bounded integer enumeration across requirements", () => {
    for (const p of [0, 3, 9, 12, 20, 30]) for (const c of [0, 4, 9, 12, 25, 30]) {
      let best = Infinity;
      for (let x = 0; x <= 40; x++) for (let y = 0; y <= 40; y++) if (3 * x + y >= p && x + 3 * y >= c) best = Math.min(best, 4 * x + 5 * y);
      expect(dietProblem(p, c, true).optimum.cost).toBe(best);
      expect(dietProblem(p, c).optimum.cost).toBeLessThanOrEqual(best + 1e-8);
    }
  });
  it("snaps draggable servings and rejects invalid requirements", () => {
    expect(servingValue(2.37, false, 14)).toBe(2.25);
    expect(servingValue(2.8, true, 14)).toBe(3);
    expect(servingValue(-2, true, 14)).toBe(0);
    expect(servingValue(20, false, 14)).toBe(14);
    expect(() => dietProblem(-1, 9)).toThrow(RangeError);
    expect(() => dietProblem(9, NaN)).toThrow(RangeError);
  });
});
