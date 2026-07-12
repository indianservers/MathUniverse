import { describe, expect, it } from "vitest";
import {
  areRatiosEquivalent,
  convertLength,
  divideWholeInRatio,
  gcd,
  generateProportionTable,
  getActualDistanceFromMapScale,
  getDirectProportionValue,
  getInverseProportionValue,
  getMapDistanceFromActualScale,
  getMissingProportionValue,
  getPieAnglesFromRatio,
  getPiePercentagesFromRatio,
  getRepresentativeFraction,
  simplifyRatio,
  validateRatioInputs,
} from "./proportionalReasoningMath";

describe("proportional reasoning math helpers", () => {
  it("simplifies and compares ratios", () => {
    expect(gcd(18, 24)).toBe(6);
    expect(simplifyRatio([12, 18])).toEqual([2, 3]);
    expect(areRatiosEquivalent([2, 3], [8, 12])).toBe(true);
    expect(areRatiosEquivalent([2, 3], [8, 10])).toBe(false);
  });

  it("solves direct and inverse proportion values", () => {
    expect(getDirectProportionValue({ x1: 4, y1: 20, x2: 7 }).y2).toBe(35);
    expect(getInverseProportionValue({ x1: 6, y1: 10, x2: 12 }).y2).toBe(5);
  });

  it("solves missing proportion positions", () => {
    expect(getMissingProportionValue({ a: 2, b: 3, c: 8, position: "d" })).toBe(12);
    expect(getMissingProportionValue({ b: 3, c: 8, d: 12, position: "a" })).toBe(2);
    expect(getMissingProportionValue({ a: 2, c: 8, d: 12, position: "b" })).toBe(3);
    expect(getMissingProportionValue({ a: 2, b: 3, d: 12, position: "c" })).toBe(8);
  });

  it("normalizes map scale units", () => {
    expect(convertLength(100000, "cm", "km")).toBe(1);
    expect(getRepresentativeFraction({ mapDistance: 2, actualDistance: 1, mapUnit: "cm", actualUnit: "km" }).denominator).toBe(50000);
    expect(getActualDistanceFromMapScale({ mapDistance: 3.2, scaleDenominator: 50000, mapUnit: "cm", outputUnit: "km" }).actual).toBe(1.6);
    expect(getMapDistanceFromActualScale({ actualDistance: 1.6, scaleDenominator: 50000, actualUnit: "km", outputUnit: "cm" }).map).toBe(3.2);
  });

  it("splits two-term and multi-term ratios", () => {
    expect(divideWholeInRatio(900, [2, 3, 4])).toEqual([200, 300, 400]);
    expect(divideWholeInRatio(120, [1, 2, 3])).toEqual([20, 40, 60]);
  });

  it("creates pie angles and percentages with exact totals after rounding", () => {
    expect(getPieAnglesFromRatio([2, 3, 4]).reduce((a, b) => a + b, 0)).toBe(360);
    expect(getPiePercentagesFromRatio([2, 3, 4]).reduce((a, b) => a + b, 0)).toBe(100);
  });

  it("rejects invalid inputs", () => {
    expect(validateRatioInputs([2]).ok).toBe(false);
    expect(() => getRepresentativeFraction({ mapDistance: 0, actualDistance: 1, mapUnit: "cm", actualUnit: "km" })).toThrow();
  });

  it("generates direct and inverse tables", () => {
    expect(generateProportionTable({ relationshipType: "direct", constant: 3, xValues: [1, 2] })).toEqual([{ x: 1, y: 3 }, { x: 2, y: 6 }]);
    expect(generateProportionTable({ relationshipType: "inverse", constant: 12, xValues: [2, 3] })).toEqual([{ x: 2, y: 6 }, { x: 3, y: 4 }]);
  });
});
