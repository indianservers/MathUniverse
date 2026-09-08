import { describe, expect, it } from "vitest";
import * as trig from "./trigonometryEnhancementEngine";

describe("Trigonometry enhancement engine", () => {
  it("supports exact angles, units, six functions, reference triangles, and inverse branches", () => {
    expect(trig.snapNotableAngle(44).snapped).toBe(45);
    expect(trig.fromRadians(trig.toRadians(200, "gradians"), "degrees")).toBeCloseTo(180);
    expect(trig.sixTrigFunctions(Math.PI / 4).tan).toBeCloseTo(1);
    expect(trig.referenceTriangle(3 * Math.PI / 4).quadrant).toBe(2);
    expect(trig.inverseBranch("asin", 2).inDomain).toBe(false);
  });

  it("covers waves and identity verification", () => {
    expect(trig.waveTransform(2, 3, .5, 1, .2).period).toBeCloseTo(2 * Math.PI / 3);
    expect(trig.circleWaveSync(.7).circle.y).toBeCloseTo(trig.circleWaveSync(.7).wave.y);
    expect(trig.sumDifference(.3, .7).sinSum).toBeCloseTo(trig.sumDifference(.3, .7).sinDirect);
    expect(trig.doubleHalf(.4).sinDouble).toBeCloseTo(Math.sin(.8));
    expect(trig.verifyIdentity((x) => Math.sin(x) ** 2 + Math.cos(x) ** 2, () => 1).validOnSamples).toBe(true);
  });

  it("solves equations, inequalities, and triangle cases", () => {
    expect(trig.sineEquationSolutions(.5)).toHaveLength(2);
    expect(trig.sinePositiveIntervals()).toEqual([[0, Math.PI]]);
    expect(trig.ambiguousSSA(10, 12, Math.PI / 6)).toHaveLength(2);
    const triangle = trig.solveTriangleSAS(3, 4, Math.PI / 2);
    expect(triangle.sideC).toBeCloseTo(5);
    expect(trig.triangleUncertainty(3, 4, Math.PI / 2, .01).spread).toBeGreaterThan(0);
  });

  it("covers application, polar, phasor, Fourier, and advanced modes", () => {
    expect(trig.heightFromElevation(10, Math.PI / 4).height).toBeCloseTo(10);
    expect(trig.bearingVector(10, Math.PI / 2).east).toBeCloseTo(10);
    expect(trig.polarRose(4, 0).petals).toBe(8);
    expect(trig.addPhasors({ magnitude: 1, phase: 0 }, { magnitude: 1, phase: Math.PI }).magnitude).toBeCloseTo(0);
    expect(trig.fourierSynthesis(Math.PI / 2, 8).value).toBeGreaterThan(.9);
    expect(trig.beatWave(1, 10, 12, .1).beatFrequency).toBe(2);
    expect(trig.sphericalTriangleSide(Math.PI / 2, Math.PI / 2, Math.PI / 2).c).toBeCloseTo(Math.PI / 2);
    expect(trig.hyperbolicFunctions(1).identityResidual).toBeLessThan(1e-12);
    expect(trig.singularityStability(Math.PI / 2).stable).toBe(false);
    expect(trig.exactAngleValue(30)).toMatchObject({ sin: "1/2", cos: "√3/2", exact: true });
  });
});
