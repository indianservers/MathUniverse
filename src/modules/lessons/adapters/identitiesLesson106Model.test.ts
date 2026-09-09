import { describe, expect, it } from "vitest";
import {
  IDENTITY_PRACTICES_106,
  calculateSquareIdentity106,
  identityPracticeExpansion106,
  isIdentityPracticeCorrect106,
  isIdentityTileDrop106,
  sampleSquareIdentity106,
} from "./identitiesLesson106Model";

describe("identitiesLesson106Model", () => {
  it("calculates every region in the target area proof", () => {
    expect(calculateSquareIdentity106(5)).toEqual({
      side: 7,
      xSquared: 25,
      rectangle: 10,
      constantSquared: 4,
      partitionTotal: 49,
      squareTotal: 49,
    });
    expect(sampleSquareIdentity106([0, 3, 5])).toEqual([
      { value: 0, left: 4, right: 4, matches: true },
      { value: 3, left: 25, right: 25, matches: true },
      { value: 5, left: 49, right: 49, matches: true },
    ]);
  });

  it("calculates and grades each practice identity", () => {
    expect(identityPracticeExpansion106(IDENTITY_PRACTICES_106[0])).toBe(
      "y² + 6y + 9",
    );
    expect(identityPracticeExpansion106(IDENTITY_PRACTICES_106[1])).toBe(
      "a² + 8a + 16",
    );
    expect(
      isIdentityPracticeCorrect106("y^2+6y+9", IDENTITY_PRACTICES_106[0]),
    ).toBe(true);
    expect(
      isIdentityPracticeCorrect106("y² + 3y + 9", IDENTITY_PRACTICES_106[0]),
    ).toBe(false);
  });

  it("accepts only lesson-owned area tile payloads", () => {
    expect(isIdentityTileDrop106("x2")).toBe(true);
    expect(isIdentityTileDrop106("top-2x")).toBe(true);
    expect(isIdentityTileDrop106("")).toBe(false);
    expect(isIdentityTileDrop106("unknown")).toBe(false);
  });
});
