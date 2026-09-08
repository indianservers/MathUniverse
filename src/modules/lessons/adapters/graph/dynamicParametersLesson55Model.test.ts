import { describe, expect, it } from "vitest";
import {
  DEFAULT_DYNAMIC_55,
  DYNAMIC_BOUNDS_55,
  animatedParameters55,
  dynamicCurve55,
  dynamicPeriod55,
  dynamicRange55,
  dynamicValue55,
  scaledBounds55,
} from "./dynamicParametersLesson55Model";

describe("dynamicParametersLesson55Model", () => {
  it("computes the target family values", () => {
    expect(dynamicValue55(DEFAULT_DYNAMIC_55, 0)).toBe(0.5);
    expect(dynamicValue55(DEFAULT_DYNAMIC_55, Math.PI / 3)).toBeCloseTo(2.5);
    expect(dynamicPeriod55(DEFAULT_DYNAMIC_55)).toBeCloseTo((4 * Math.PI) / 3);
    expect(dynamicRange55(DEFAULT_DYNAMIC_55)).toEqual({ min: -1.5, max: 2.5 });
  });

  it("generates curve geometry and bounded zoom", () => {
    expect(
      dynamicCurve55(DEFAULT_DYNAMIC_55, DYNAMIC_BOUNDS_55, 600, 400).split(" ")
        .length,
    ).toBeGreaterThan(150);
    expect(scaledBounds55(4).xMax).toBeCloseTo(DYNAMIC_BOUNDS_55.xMax * 1.6);
    expect(scaledBounds55(0.1).xMin).toBeCloseTo(DYNAMIC_BOUNDS_55.xMin * 0.65);
  });

  it("keeps animated parameters inside the slider domains", () => {
    for (const step of [0, 45, 90, 135, 179]) {
      const value = animatedParameters55(step);
      expect(value.a).toBeGreaterThanOrEqual(0.5);
      expect(value.a).toBeLessThanOrEqual(4);
      expect(value.b).toBeGreaterThanOrEqual(0.5);
      expect(value.b).toBeLessThanOrEqual(2);
      expect(value.c).toBeGreaterThanOrEqual(-1.5);
      expect(value.c).toBeLessThanOrEqual(1.5);
    }
  });
});
