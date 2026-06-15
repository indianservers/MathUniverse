import { describe, expect, it } from "vitest";
import {
  degToRad,
  formatRatioValue,
  getTriangleSides,
  getTrigRatios,
  safeDivide,
} from "./TriangleCircleRatioVisualizer";

describe("TriangleCircleRatioVisualizer math helpers", () => {
  it("converts degrees to radians", () => {
    expect(degToRad(180)).toBeCloseTo(Math.PI);
    expect(degToRad(45)).toBeCloseTo(Math.PI / 4);
  });

  it("computes right-triangle sides for requested test angles and hypotenuse values", () => {
    const angles = [1, 15, 30, 45, 60, 75, 89];
    const hypotenuseValues = [1, 2, 5, 10];

    for (const angle of angles) {
      for (const hypotenuse of hypotenuseValues) {
        const sides = getTriangleSides(angle, hypotenuse);
        expect(sides.hypotenuse).toBeCloseTo(hypotenuse);
        expect(sides.opposite).toBeCloseTo(hypotenuse * Math.sin(degToRad(angle)));
        expect(sides.adjacent).toBeCloseTo(hypotenuse * Math.cos(degToRad(angle)));
        expect(Math.hypot(sides.opposite, sides.adjacent)).toBeCloseTo(hypotenuse);
      }
    }
  });

  it("keeps ratios unchanged when triangle size changes", () => {
    const angle = 60;
    const unit = getTriangleSides(angle, 1);
    const large = getTriangleSides(angle, 10);

    expect(safeDivide(unit.opposite, unit.hypotenuse)).toBeCloseTo(safeDivide(large.opposite, large.hypotenuse)!);
    expect(safeDivide(unit.adjacent, unit.hypotenuse)).toBeCloseTo(safeDivide(large.adjacent, large.hypotenuse)!);
    expect(safeDivide(unit.opposite, unit.adjacent)).toBeCloseTo(safeDivide(large.opposite, large.adjacent)!);
  });

  it("computes all six ratios and reciprocal pairs correctly", () => {
    const ratios = getTrigRatios(30);

    expect(ratios.sin).toBeCloseTo(0.5);
    expect(ratios.cos).toBeCloseTo(Math.sqrt(3) / 2);
    expect(ratios.tan).toBeCloseTo(1 / Math.sqrt(3));
    expect(ratios.csc).toBeCloseTo(2);
    expect(ratios.sec).toBeCloseTo(2 / Math.sqrt(3));
    expect(ratios.cot).toBeCloseTo(Math.sqrt(3));
    expect(ratios.csc).toBeCloseTo(1 / ratios.sin!);
    expect(ratios.sec).toBeCloseTo(1 / ratios.cos!);
    expect(ratios.cot).toBeCloseTo(1 / ratios.tan!);
  });

  it("handles undefined values without NaN or Infinity text", () => {
    expect(safeDivide(1, 0)).toBeNull();
    expect(safeDivide(1, Number.NaN)).toBeNull();
    expect(formatRatioValue(null)).toBe("undefined");
    expect(formatRatioValue(Number.POSITIVE_INFINITY)).toBe("undefined");
    expect(formatRatioValue(Number.NaN)).toBe("undefined");
  });

  it("matches unit-circle coordinates when hypotenuse is normalized to 1", () => {
    const sides = getTriangleSides(45, 1);
    const ratios = getTrigRatios(45);

    expect(sides.adjacent).toBeCloseTo(ratios.cos!);
    expect(sides.opposite).toBeCloseTo(ratios.sin!);
    expect(sides.hypotenuse).toBe(1);
  });
});
