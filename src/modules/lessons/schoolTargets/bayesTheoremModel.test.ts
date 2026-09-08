import { describe, expect, it } from "vitest";
import { bayesSources, BAYES_PRACTICE, frequencyChips } from "./bayesTheoremModel";
describe("Bayesian source update", () => {
  it("calculates both default posteriors from the evidence denominator", () => {
    const result = bayesSources(.6, .02, .05);
    expect(result.total).toBeCloseTo(.032);
    expect(result.posterior[0]).toBeCloseTo(.375);
    expect(result.posterior[1]).toBeCloseTo(.625);
  });
  it("normalizes nonzero evidence across the full control grid", () => {
    for (let w = 0; w <= 10; w++) for (let a = 0; a <= 10; a++) for (let b = 0; b <= 10; b++) {
      const result = bayesSources(w / 10, a / 10, b / 10);
      if (result.total) {
        expect(result.posterior[0]! + result.posterior[1]!).toBeCloseTo(1);
        expect(result.posterior[0]! * result.total).toBeCloseTo(w / 10 * a / 10);
      } else expect(result.posterior).toEqual([null, null]);
    }
  });
  it("leaves the prior unchanged when likelihoods are equal", () => {
    expect(bayesSources(.2, .3, .3).posterior[0]).toBeCloseTo(.2);
    expect(bayesSources(0, .5, .2).posterior).toEqual([0, 1]);
  });
  it("represents fractional expected evidence chips without inventing whole items", () => {
    const chips = frequencyChips(1.2);
    expect(chips).toHaveLength(2);
    expect(chips.reduce((a, b) => a + b, 0)).toBeCloseTo(1.2);
    expect(frequencyChips(0)).toEqual([]);
    expect(frequencyChips(100)).toHaveLength(100);
  });
  it("corrects the reference practice answer", () => {
    expect(BAYES_PRACTICE.total).toBeCloseTo(.019);
    expect(BAYES_PRACTICE.posterior[1]).toBeCloseTo(12 / 19);
  });
});
