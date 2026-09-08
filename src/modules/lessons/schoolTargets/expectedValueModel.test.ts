import { describe, expect, it } from "vitest";
import { expectedValueModel, rebalanceProbability, simulateExpectedValue, type ThreeValues } from "./expectedValueModel";
describe("expected value balance", () => {
  it("computes mean and correct left/right moments", () => {
    expect(expectedValueModel([0, 1, 2], [.25, .5, .25])).toMatchObject({ mean: 1, products: [0, .5, .5], moments: [-.25, 0, .25], left: .25, right: .25 });
    expect(expectedValueModel([-2, 1, 5], [.5, .3, .2]).mean).toBeCloseTo(.3);
  });
  it("preserves the simplex during repeated slider edits", () => {
    let weights: ThreeValues = [.25, .5, .25];
    for (let i = 0; i < 1000; i++) {
      weights = rebalanceProbability(weights, i % 3, (i % 101) / 100);
      expect(weights.reduce((a, b) => a + b, 0)).toBeCloseTo(1);
      expect(weights.every(p => p >= 0 && p <= 1)).toBe(true);
      const model = expectedValueModel([-2, 1, 5], weights);
      expect(model.left).toBeCloseTo(model.right);
    }
  });
  it("redistributes mass from a point distribution", () => {
    expect(rebalanceProbability([1, 0, 0], 0, .5)).toEqual([.5, .25, .25]);
    expect(expectedValueModel([0, 1, 2], [0, 1, 0]).mean).toBe(1);
  });
  it("generates actual outcomes and running averages", () => {
    const random = [0, .3, .8, .6]; let i = 0;
    expect(simulateExpectedValue([0, 1, 2], [.25, .5, .25], 4, () => random[i++])).toEqual([{ value: 0, average: 0 }, { value: 1, average: .5 }, { value: 2, average: 1 }, { value: 1, average: 1 }]);
  });
  it("rejects invalid distributions and trial batches", () => {
    expect(() => expectedValueModel([0, 1, 2], [.3, .3, .3])).toThrow(RangeError);
    expect(() => simulateExpectedValue([0, 1, 2], [.25, .5, .25], 0)).toThrow(RangeError);
    expect(() => rebalanceProbability([.25, .5, .25], 0, NaN)).toThrow(RangeError);
  });
});
