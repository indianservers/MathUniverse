import { describe, expect, it } from "vitest";
import {
  LOGARITHMIC_EXAMPLES_119,
  LOGARITHMIC_PRACTICES_119,
  isLogarithmicPracticeCorrect119,
  logarithmicPowerLadder119,
  solveLogarithmicEquation119,
} from "./logarithmicEquationsLesson119Model";

describe("logarithmicEquationsLesson119Model", () => {
  it("rewrites and verifies the target logarithmic equation", () => {
    expect(
      solveLogarithmicEquation119(LOGARITHMIC_EXAMPLES_119[0], 32),
    ).toEqual({
      expectedValue: 32,
      domainPass: true,
      logValue: 5,
      verified: true,
    });
  });

  it("rejects zero and negative logarithm inputs at the domain gate", () => {
    const result = solveLogarithmicEquation119(LOGARITHMIC_EXAMPLES_119[0], 0);
    expect(result.domainPass).toBe(false);
    expect(result.logValue).toBeNaN();
    expect(result.verified).toBe(false);
  });

  it("keeps positive but incorrect candidates distinct from domain failures", () => {
    const result = solveLogarithmicEquation119(LOGARITHMIC_EXAMPLES_119[0], 16);
    expect(result.domainPass).toBe(true);
    expect(result.logValue).toBe(4);
    expect(result.verified).toBe(false);
  });

  it("extends the power ladder to the required exponent", () => {
    const ladder = logarithmicPowerLadder119(LOGARITHMIC_PRACTICES_119[1]);
    expect(ladder).toHaveLength(6);
    expect(ladder.at(-1)).toEqual({ exponent: 6, value: 64 });
  });

  it("grades practice against the calculated exponential value", () => {
    const practice = LOGARITHMIC_PRACTICES_119[0];
    expect(isLogarithmicPracticeCorrect119(practice, 81)).toBe(true);
    expect(isLogarithmicPracticeCorrect119(practice, 27)).toBe(false);
  });
});
