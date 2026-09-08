import { describe, expect, it } from "vitest";
import {
  CUBICS_54,
  FIT_BOUNDS_54,
  averageRate54,
  criticalPoints54,
  cubicDerivative54,
  cubicValue54,
  graphPath54,
  roots54,
  xFromPixel54,
} from "./graphInspectorLesson54Model";

describe("graphInspectorLesson54Model", () => {
  const cubic = CUBICS_54[0];

  it("computes the target cubic's real probe values", () => {
    expect(cubicValue54(cubic, 1.2)).toBeCloseTo(-1.872);
    expect(cubicDerivative54(cubic, 1.2)).toBeCloseTo(1.32);
  });

  it("derives roots, extrema, and average rate", () => {
    expect(roots54(cubic).map((point) => point.x)).toEqual(
      expect.arrayContaining([
        expect.closeTo(-Math.sqrt(3), 3),
        expect.closeTo(0, 3),
        expect.closeTo(Math.sqrt(3), 3),
      ]),
    );
    expect(criticalPoints54(cubic)).toEqual([
      { x: -1, y: 2 },
      { x: 1, y: -2 },
    ]);
    expect(averageRate54(cubic)).toBe(-2);
  });

  it("generates graph geometry and maps a cursor", () => {
    expect(
      graphPath54(cubic, FIT_BOUNDS_54, 500, 300).split(" ").length,
    ).toBeGreaterThan(150);
    expect(xFromPixel54(250, FIT_BOUNDS_54, 500)).toBe(0);
  });
});
