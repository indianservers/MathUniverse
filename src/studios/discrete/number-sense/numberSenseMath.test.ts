import { describe, expect, it } from "vitest";
import {
  absDistance,
  answersMatch,
  compareFractions,
  convertLength,
  equivalentFraction,
  formatFraction,
  integerPower,
  mapDistance,
  missingRatioValue,
  mixedNumber,
  orderedValues,
  placeValueParts,
  placeValueThousandths,
  representativeFraction,
  roundHalfUp,
  ratioGrade,
  simplifyRatio,
  unitRate,
  valueToX,
} from "./numberSenseMath";

describe("number sense math", () => {
  it("orders unique values and measures absolute distance", () => {
    expect(orderedValues([2, -3, 0, 2, -1])).toEqual([-3, -1, 0, 2]);
    expect(absDistance(-3, 2)).toBe(5);
    expect(absDistance(-7, -2)).toBe(5);
  });

  it("places points by value, not by index", () => {
    const left = valueToX(-3, -3, 7, 0, 100);
    const mid = valueToX(2, -3, 7, 0, 100);
    const right = valueToX(7, -3, 7, 0, 100);
    expect(left).toBe(0);
    expect(right).toBe(100);
    expect(mid).toBeCloseTo(50, 5);
    const gap = (from: number, to: number) => valueToX(to, 1, 8, 0, 70) - valueToX(from, 1, 8, 0, 70);
    expect(gap(2, 4)).toBeCloseTo(2 * gap(1, 2), 5);
  });

  it("simplifies fractions, mixed numbers, and ratios", () => {
    expect(formatFraction(3, 2)).toBe("3/2");
    expect(mixedNumber(3, 2)).toBe("1 1/2");
    expect(equivalentFraction(1, 2, 2)).toEqual({ num: 2, den: 4 });
    expect(compareFractions(3, 5, 2, 3)).toBe(-1);
    expect(simplifyRatio(12, 18)).toEqual({ a: 2, b: 3 });
  });

  it("computes powers, place value, rounding, and map scale", () => {
    expect(integerPower(2, 4)).toBe(16);
    expect(integerPower(2, 0)).toBe(1);
    expect(integerPower(2, -1)).toBe(0.5);
    expect(placeValueParts(0.65)).toEqual({ ones: 0, tenths: 6, hundredths: 5 });
    expect(placeValueParts(1.5)).toEqual({ ones: 1, tenths: 5, hundredths: 0 });
    expect(roundHalfUp(1.26, 1)).toBeCloseTo(1.3, 8);
    expect(mapDistance(3, 5)).toBe(15);
    expect(convertLength(100, "cm", "m")).toBe(1);
    expect(convertLength(2, "km", "m")).toBe(2000);
    expect(unitRate(2, 3).perFirst).toBeCloseTo(1.5, 8);
    expect(missingRatioValue(2, 3, 4, true)).toBe(6);
    expect(representativeFraction(5).right).toBe(500000);
    expect(placeValueThousandths(0.805).thousandths).toBe(5);
    expect(ratioGrade("12:18", "2:3")).toEqual({ ok: true, simplestNudge: true });
    expect(ratioGrade("2:3", "2:3")).toEqual({ ok: true, simplestNudge: false });
    expect(ratioGrade("3:2", "2:3")).toEqual({ ok: false, simplestNudge: false });
  });

  it("matches challenge answers including ratios and fractions", () => {
    expect(answersMatch("-2", -2)).toBe(true);
    expect(answersMatch("2/3", "2/3")).toBe(true);
    expect(answersMatch("10/15", "2/3")).toBe(true);
    expect(answersMatch("12:18", "2:3")).toBe(true);
    expect(answersMatch("0.7", 0.7)).toBe(true);
    expect(answersMatch("1 1/2", "1 1/2")).toBe(true);
    expect(answersMatch("3/2", "1 1/2")).toBe(true);
    expect(answersMatch("3:2", "2:3")).toBe(false);
  });
});
