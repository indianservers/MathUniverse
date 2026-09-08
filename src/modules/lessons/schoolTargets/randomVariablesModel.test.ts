import { describe, expect, it } from "vitest";
import { randomVariableGroups, RANDOM_VARIABLE_RULES, tossMappedCoins } from "./randomVariablesModel";
describe("outcome-to-number mapping", () => {
  it("groups both one-head outcomes under the same number", () => {
    expect(randomVariableGroups([2, 1, 1, 0])).toEqual([{ value: 2, outcomes: ["HH"], probability: .25 }, { value: 1, outcomes: ["HT", "TH"], probability: .5 }, { value: 0, outcomes: ["TT"], probability: .25 }]);
  });
  it("allows negative, noninteger and constant real mappings", () => {
    expect(randomVariableGroups([-2.5, 0, 0, 3.2]).map(g => g.value)).toEqual([3.2, 0, -2.5]);
    expect(randomVariableGroups([7, 7, 7, 7])[0].outcomes).toHaveLength(4);
    expect(() => randomVariableGroups([NaN, 1, 1, 0])).toThrow(RangeError);
  });
  it("preserves all four outcomes and probability mass under each preset", () => {
    for (const rule of Object.values(RANDOM_VARIABLE_RULES)) {
      const groups = randomVariableGroups(rule.scores);
      expect(groups.flatMap(g => g.outcomes)).toHaveLength(4);
      expect(groups.reduce((sum, g) => sum + g.probability, 0)).toBe(1);
    }
  });
  it("samples two fair coins then applies the active rule", () => {
    const random = [0, 0, 0, .9, .9, 0, .9, .9]; let i = 0;
    expect(tossMappedCoins(4, [2, 1, 1, 0], () => random[i++])).toEqual([{ outcome: "HH", value: 2 }, { outcome: "HT", value: 1 }, { outcome: "TH", value: 1 }, { outcome: "TT", value: 0 }]);
    expect(i).toBe(8);
  });
  it("corrects the tails practice sum and validates batch counts", () => {
    expect(RANDOM_VARIABLE_RULES.tails.scores.reduce((a, b) => a + b, 0)).toBe(4);
    expect(() => tossMappedCoins(-1, [2, 1, 1, 0])).toThrow(RangeError);
  });
});
