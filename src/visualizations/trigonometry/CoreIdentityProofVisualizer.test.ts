import { describe, expect, it } from "vitest";
import {
  degToRad,
  evaluateCoreIdentity,
  formatIdentityValue,
  nearZero,
  safeDivide,
  type CoreIdentityId,
} from "./CoreIdentityProofVisualizer";

describe("CoreIdentityProofVisualizer math helpers", () => {
  it("converts degrees to radians", () => {
    expect(degToRad(180)).toBeCloseTo(Math.PI);
    expect(degToRad(90)).toBeCloseTo(Math.PI / 2);
  });

  it("proves sin^2 theta + cos^2 theta = 1 at required angles", () => {
    for (const angle of [0, 30, 45, 60, 90, 180, 270, 360]) {
      const result = evaluateCoreIdentity("sin2-plus-cos2", angle);
      expect(result.defined).toBe(true);
      expect(result.lhs).toBeCloseTo(1);
      expect(result.rhs).toBe(1);
      expect(result.matched).toBe(true);
    }
  });

  it("proves 1 + tan^2 theta = sec^2 theta at valid angles", () => {
    for (const angle of [0, 30, 45, 60, 180, 360]) {
      const result = evaluateCoreIdentity("one-plus-tan2-sec2", angle);
      expect(result.defined).toBe(true);
      expect(result.lhs).toBeCloseTo(result.rhs!);
      expect(result.matched).toBe(true);
    }
  });

  it("marks tangent/secant identity undefined where cos theta is zero", () => {
    for (const angle of [90, 270]) {
      const result = evaluateCoreIdentity("one-plus-tan2-sec2", angle);
      expect(result.defined).toBe(false);
      expect(result.lhs).toBeNull();
      expect(result.rhs).toBeNull();
      expect(result.difference).toBeNull();
      expect(result.reason).toContain("cos theta");
    }
  });

  it("proves 1 + cot^2 theta = cosec^2 theta at valid angles", () => {
    for (const angle of [30, 45, 60, 90, 270]) {
      const result = evaluateCoreIdentity("one-plus-cot2-csc2", angle);
      expect(result.defined).toBe(true);
      expect(result.lhs).toBeCloseTo(result.rhs!);
      expect(result.matched).toBe(true);
    }
  });

  it("marks cotangent/cosecant identity undefined where sin theta is zero", () => {
    for (const angle of [0, 180, 360]) {
      const result = evaluateCoreIdentity("one-plus-cot2-csc2", angle);
      expect(result.defined).toBe(false);
      expect(result.lhs).toBeNull();
      expect(result.rhs).toBeNull();
      expect(result.difference).toBeNull();
      expect(result.reason).toContain("sin theta");
    }
  });

  it("never formats NaN or Infinity as display values", () => {
    expect(safeDivide(1, 0)).toBeNull();
    expect(safeDivide(1, Number.NaN)).toBeNull();
    expect(nearZero(0)).toBe(true);
    expect(formatIdentityValue(Number.NaN)).toBe("undefined");
    expect(formatIdentityValue(Number.POSITIVE_INFINITY)).toBe("undefined");
    expect(formatIdentityValue(null)).toBe("undefined");
  });

  it("uses null for undefined helper output", () => {
    const identityIds: CoreIdentityId[] = ["one-plus-tan2-sec2", "one-plus-cot2-csc2"];
    const tanSec = evaluateCoreIdentity(identityIds[0], 90);
    const cotCsc = evaluateCoreIdentity(identityIds[1], 0);

    expect(tanSec.lhs).toBeNull();
    expect(tanSec.rhs).toBeNull();
    expect(cotCsc.lhs).toBeNull();
    expect(cotCsc.rhs).toBeNull();
  });
});
