import { describe, expect, it } from "vitest";
import { boundedEulerValue, eulerError, eulerPoint, evaluateEulerIdentity, radiansLabel, taylorPartialSums } from "./eulerLearningMath";
import { complexLessons, complexPaths } from "./complexLearningContent";

describe("Euler learning mathematics", () => {
  it("computes the direct Taylor sum for the reference angle without inventing convergence", () => {
    const sums = taylorPartialSums(336 * Math.PI / 180, 10);
    expect(sums).toHaveLength(10);
    expect(sums[9].re).toBeCloseTo(11.284425265454843, 10);
    expect(sums[9].im).toBeCloseTo(5.3281124190868, 10);
    expect(eulerError(336, 10)).toBeGreaterThan(11);
  });
  it("supports fifty terms and identifies the first sum meeting the challenge tolerance", () => {
    expect(taylorPartialSums(336 * Math.PI / 180, 50)).toHaveLength(50);
    expect(eulerError(336, 50)).toBeLessThan(1e-12);
    expect(eulerError(336, 25)).toBeGreaterThanOrEqual(1e-6);
    expect(eulerError(336, 26)).toBeLessThan(1e-6);
  });
  it("keeps quarter turns and whole turns on the unit circle", () => {
    for (const [degrees, re, im] of [[0, 1, 0], [90, 0, 1], [180, -1, 0], [270, 0, -1], [360, 1, 0], [720, 1, 0]]) {
      const p = eulerPoint(degrees);
      expect(p.re).toBeCloseTo(re, 12); expect(p.im).toBeCloseTo(im, 12);
      expect(Math.hypot(p.re, p.im)).toBeCloseTo(1, 12);
    }
  });
  it("counts the constant term and converges at π", () => {
    expect(taylorPartialSums(Math.PI, 2)).toEqual([{ re: 1, im: 0 }, { re: 1, im: Math.PI }]);
    expect(eulerError(180, 6)).toBeGreaterThan(1);
    expect(eulerError(180, 24)).toBeLessThan(1e-10);
    expect(eulerError(720, 32)).toBeLessThan(eulerError(720, 6));
  });
  it("does not accept empty or nonfinite answers as zero", () => {
    for (const answer of ["", " ", "NaN", "Infinity", "1"]) expect(evaluateEulerIdentity(answer).correct).toBe(false);
    expect(evaluateEulerIdentity("0").correct).toBe(true);
  });
  it("bounds shared inputs and reports exact radians", () => {
    expect(boundedEulerValue(Infinity, 0, 720, 180)).toBe(180);
    expect(boundedEulerValue(999, 0, 720, 180)).toBe(720);
    expect(radiansLabel(90)).toBe("π/2 rad"); expect(radiansLabel(180)).toBe("π rad");
    expect(radiansLabel(270)).toBe("3π/2 rad"); expect(radiansLabel(720)).toBe("4π rad");
  });
});
describe("Complex studio depth", () => {
  it("covers nine labs with complete reasoning and 27 valid checks", () => {
    expect(Object.keys(complexLessons)).toHaveLength(9);
    for (const lesson of Object.values(complexLessons)) {
      expect(lesson.derivation.length).toBeGreaterThanOrEqual(3);
      expect(lesson.example.length).toBeGreaterThanOrEqual(3);
      expect(lesson.questions).toHaveLength(3);
      for (const q of lesson.questions) { expect(q.correct).toBeGreaterThanOrEqual(0); expect(q.correct).toBeLessThan(q.choices.length); expect(q.explanation.trim()).not.toBe(""); }
    }
    for (const path of complexPaths) for (const id of path.ids) expect(complexLessons[id]).toBeDefined();
  });
});
