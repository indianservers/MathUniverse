import { describe, expect, it } from "vitest";
import {
  argandComplex,
  argandNumber,
  complexLabel,
} from "./argandReferenceMath";

describe("Argand answer input", () => {
  it("accepts the reference distance and angle formats", () => {
    expect(argandNumber("√20")).toBeCloseTo(Math.hypot(3 - -1, 4 - 2));
    expect(argandNumber("sqrt(20)")).toBeCloseTo(Math.sqrt(20));
    expect(argandNumber("53.1°")).toBe(53.1);
    expect(argandNumber("π/4")).toBeCloseTo(Math.PI / 4);
    expect(argandNumber("-2pi/3")).toBeCloseTo((-2 * Math.PI) / 3);
  });
  it("rejects blank and executable expressions", () => {
    expect(argandNumber("")).toBeNaN();
    expect(argandNumber("Math.sqrt(20)")).toBeNaN();
    expect(argandComplex("")).toBeNull();
  });
  it("handles the conjugate sign and unit imaginary coefficient", () => {
    expect(argandComplex("3 − 4i")).toEqual([3, -4]);
    expect(argandComplex("-2 + i")).toEqual([-2, 1]);
    expect(complexLabel(3, -4)).toBe("3 − 4i");
    expect(complexLabel(-2, 5)).toBe("-2 + 5i");
  });
});
