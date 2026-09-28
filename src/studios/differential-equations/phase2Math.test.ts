import { describe, expect, it } from "vitest";
import { cauchyIndicial, classifySystem, exactNumericSolution, fitUndetermined, integrateVariation, numericError, numericSteps, vectorTimeSeries } from "./phase2Math";
import { newtonTemperature, oscillatorSample } from "./engineeringMath";

describe("Phase 2 numerical mathematics", () => {
  it("computes Euler, Heun, and RK4 with improving accuracy", () => {
    const exact = exactNumericSolution("y", 0, 1);
    expect(exact).not.toBeNull();
    const rows = numericSteps((_x, y) => y, 0, 1, .2, 5, exact);
    const errors = numericError(rows, .2, exact);
    expect(rows).toHaveLength(5);
    expect(rows[0].nextEuler).toBeCloseTo(1.2);
    expect(rows[0].predictor).toBeCloseTo(1.2);
    expect(rows[0].nextHeun).toBeCloseTo(1.22);
    expect(errors).not.toBeNull();
    expect(errors!.heun).toBeLessThan(errors!.euler);
    expect(errors!.rk4).toBeLessThan(errors!.heun);
    const finer = numericError(numericSteps((_x, y) => y, 0, 1, .1, 10, exact), .1, exact);
    expect(finer!.euler).toBeLessThan(errors!.euler);
  });

  it("classifies root and matrix cases from coefficients", () => {
    expect(cauchyIndicial(1, -3, 4).kind).toBe("repeated");
    expect(cauchyIndicial(1, 1, 1).kind).toBe("complex");
    expect(classifySystem(-1, -1, 1, -1).label).toBe("stable spiral");
    expect(classifySystem(1, 0, 0, -1).label).toBe("saddle");
  });

  it("integrates a rotation and cooling toward ambient", () => {
    const orbit = vectorTimeSeries((x, y) => [-y, x], { x: 1, y: 0 }, 100, .04);
    expect(Math.hypot(orbit.at(-1)!.x, orbit.at(-1)!.y)).toBeCloseTo(1, 3);
    expect(newtonTemperature(90, 20, .1, 60)).toBeGreaterThan(20);
    expect(newtonTemperature(90, 20, .1, 60)).toBeLessThan(21);
  });

  it("increasing damping reduces a free oscillator envelope", () => {
    const noDamping = oscillatorSample(1, 0, 4, 1, 0, 15);
    const damping = oscillatorSample(1, .7, 4, 1, 0, 15);
    expect(Math.abs(damping.x)).toBeLessThan(Math.abs(noDamping.x));
  });

  it("keeps variable-coefficient fundamental solutions independent", () => {
    const points = integrateVariation((x) => x, (x) => 1 + x * x, Math.sin, 1);
    const at = points.at(-1)!;
    const wronskian = at.y1 * at.v2 - at.v1 * at.y2;
    expect(wronskian).toBeCloseTo(Math.exp(-0.5), 3);
    expect(Number.isFinite(at.yp)).toBe(true);
    expect(points[0].yp).toBe(0);
    expect(at.yVariation).toBeCloseTo(at.yp, 3);
  });

  it("fits a resonant undetermined-coefficients trial", () => {
    const fit = fitUndetermined(1, -3, 2, Math.exp, [{ power: 1, rate: 1, frequency: 0, trig: "plain" }]);
    expect(fit).not.toBeNull();
    expect(fit!.coefficients[0]).toBeCloseTo(-1);
    expect(fit!.particular(0.5)).toBeCloseTo(-0.5 * Math.exp(0.5));
  });
});
