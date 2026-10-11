import { describe, it, expect } from "vitest";
import { invertPoint, mobiusPoint } from "./LociReference";
describe("Loci transformation mathematics", () => {
  it("inversion preserves direction and is involutive", () => {
    const w = invertPoint(1, 1, 2)!;
    expect(w).toEqual({ re: 2, im: 2 });
    expect(invertPoint(w.re, w.im, 2)).toEqual({ re: 1, im: 1 });
    expect(invertPoint(0, 0, 2)).toBeNull();
  });
  it("Mobius computes complex division and rejects its pole", () => {
    expect(mobiusPoint(-2, 0, 1, 0.5, 0.5, 1)).toBeNull();
    expect(mobiusPoint(0, 0, 1, 0.5, 0.5, 1)).toEqual({ re: 0.5, im: 0 });
    const w = mobiusPoint(0, 1, 1, 0.5, 0.5, 1)!;
    expect(w.re).toBeCloseTo(0.8);
    expect(w.im).toBeCloseTo(0.6);
  });
});
