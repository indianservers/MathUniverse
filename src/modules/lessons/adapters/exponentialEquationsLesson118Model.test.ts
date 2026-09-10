import { describe, expect, it } from "vitest";
import {
  EXPONENTIAL_PRACTICES_118,
  exponentialPowerLadder118,
  exponentialRungPayload118,
  isExponentialPracticeCorrect118,
  isExponentialRungDrop118,
  solveExponentialEquation118,
} from "./exponentialEquationsLesson118Model";

describe("exponentialEquationsLesson118Model", () => {
  it("solves the target equation by matching exact powers", () => {
    expect(solveExponentialEquation118(2, 32)).toEqual({
      exactExponent: 5,
      solvedExponent: 5,
      matchable: true,
      checkedValue: 32,
      valid: true,
    });
  });

  it("uses a logarithmic solution when the target is not an integer power", () => {
    const result = solveExponentialEquation118(2, 10);
    expect(result.solvedExponent).toBeCloseTo(3.321928, 6);
    expect(result.matchable).toBe(false);
    expect(result.checkedValue).toBeCloseTo(10, 8);
    expect(result.valid).toBe(true);
  });

  it("extends the power ladder to include larger practice exponents", () => {
    const ladder = exponentialPowerLadder118(2, 6);
    expect(ladder).toHaveLength(6);
    expect(ladder.at(-1)).toEqual({ exponent: 6, value: 64 });
  });

  it("accepts only the matching equation rung payload", () => {
    const payload = exponentialRungPayload118(2, 32);
    expect(isExponentialRungDrop118(payload, 2, 32)).toBe(true);
    expect(isExponentialRungDrop118("", 2, 32)).toBe(false);
    expect(isExponentialRungDrop118(payload, 3, 27)).toBe(false);
  });

  it("grades practice by evaluating the exponential equation", () => {
    const practice = EXPONENTIAL_PRACTICES_118[0];
    expect(isExponentialPracticeCorrect118(practice, 4)).toBe(true);
    expect(isExponentialPracticeCorrect118(practice, 3)).toBe(false);
  });
});
