import { describe, expect, it } from "vitest";
import {
  isRationalMultiplier101,
  isRationalPracticeAnswer101,
  RATIONAL_EXPRESSIONS_101,
  rationalisation101,
} from "./rationalisationLesson101Model";

describe("rationalisationLesson101Model", () => {
  it("rationalises the target denominator with a matching radical", () => {
    expect(
      rationalisation101(RATIONAL_EXPRESSIONS_101[0], "matching"),
    ).toMatchObject({
      valid: true,
      multiplierLabel: "√2",
      denominatorLabel: "√2",
      denominatorResult: 2,
      resultTop: "√2",
      result: "√2/2",
      decimalMatch: true,
    });
  });

  it("uses a conjugate for a binomial denominator and rejects a wrong multiplier", () => {
    expect(
      rationalisation101(RATIONAL_EXPRESSIONS_101[3], "conjugate"),
    ).toMatchObject({
      valid: true,
      denominatorResult: 1,
      result: "2 − √3",
      decimalMatch: true,
    });
    expect(rationalisation101(RATIONAL_EXPRESSIONS_101[0], "other").valid).toBe(
      false,
    );
  });

  it("grades practice notation and validates drag payloads", () => {
    expect(
      isRationalPracticeAnswer101("3sqrt(5) / 5", {
        numerator: 3,
        radicand: 5,
      }),
    ).toBe(true);
    expect(
      isRationalPracticeAnswer101("3√5/2", { numerator: 3, radicand: 5 }),
    ).toBe(false);
    expect(isRationalMultiplier101("matching")).toBe(true);
    expect(isRationalMultiplier101("random")).toBe(false);
  });
});
