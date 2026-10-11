import { describe, expect, it } from "vitest";
import {
  multiplicationSequence,
  phaseTex,
  polarValues,
  sameDirectionDegrees,
} from "./referenceSuiteMath";

describe("reference suite live mathematics", () => {
  it("wraps arguments at the chosen branch and leaves zero undefined", () => {
    expect(polarValues({ re: 0, im: -2 }, 0)).toEqual({
      radius: 2,
      angle: 270,
    });
    expect(polarValues({ re: 0, im: -2 }, -180).angle).toBe(-90);
    expect(polarValues({ re: 0, im: 0 }, -180).angle).toBeNull();
  });
  it("repeated multiplication rotates and scales each successive point", () => {
    const values = multiplicationSequence({ re: 1, im: 0 }, 2, 90);
    [
      [1, 0],
      [0, 2],
      [-4, 0],
      [0, -8],
    ].forEach(([re, im], i) => {
      expect(values[i].re).toBeCloseTo(re);
      expect(values[i].im).toBeCloseTo(im);
    });
  });
  it("zero multiplication collapses every subsequent point", () => {
    expect(
      multiplicationSequence({ re: 1, im: 2 }, 0, 45)
        .slice(1)
        .every((z) => Math.hypot(z.re, z.im) === 0),
    ).toBe(true);
  });
  it("checks angular answers modulo a full turn", () => {
    expect(sameDirectionDegrees(-90, 270)).toBe(true);
    expect(sameDirectionDegrees(90, 270)).toBe(false);
    expect(sameDirectionDegrees(NaN, 90)).toBe(false);
  });
  it("writes common phases in radians", () => {
    expect(phaseTex(60)).toBe("\\frac{\\pi}{3}");
    expect(phaseTex(-90)).toBe("-\\frac{\\pi}{2}");
  });
});
