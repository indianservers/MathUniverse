import { describe, expect, it } from "vitest";
import {
  betaFromGamma,
  betaNumeric,
  cylindricalPoint,
  gammaNumeric,
  gammaRecurrence,
  jacobian2,
  polarPoint,
  sphericalPoint,
  squareToDiamond,
  trigPowerIntegral,
  wallisBeta,
} from "./specialCalculusMath";

describe("Jacobian, Beta, and Gamma calculations", () => {
  it("matches Gamma values, the recurrence, and the half-integer preset", () => {
    expect(gammaNumeric(1)).toBeCloseTo(1, 2);
    expect(gammaNumeric(2)).toBeCloseTo(1, 2);
    expect(gammaNumeric(3)).toBeCloseTo(2, 2);
    expect(gammaNumeric(0.5)).toBeCloseTo(Math.sqrt(Math.PI), 1);
    const recurrence = gammaRecurrence(2.5);
    expect(recurrence.left).toBeCloseTo(recurrence.right, 1);
  });

  it("matches the Beta symmetry and the Gamma identity", () => {
    expect(betaNumeric(2, 3)).toBeCloseTo(betaNumeric(3, 2), 2);
    expect(betaNumeric(2, 3)).toBeCloseTo(betaFromGamma(2, 3), 1);
    expect(trigPowerIntegral(2, 2)).toBeCloseTo(wallisBeta(2, 2), 2);
    expect(trigPowerIntegral(2, 2)).toBeCloseTo(0.5, 2);
  });

  it("uses the coordinate Jacobians from the same convention as the geometry lessons", () => {
    expect(jacobian2(1, 0, 0, 1)).toBeCloseTo(1);
    expect(polarPoint(2, Math.PI / 2).y).toBeCloseTo(2);
    expect(polarPoint(2, 0).jacobian).toBeCloseTo(2);
    expect(cylindricalPoint(3, 0, 4).jacobian).toBeCloseTo(3);
    const sphere = sphericalPoint(2, Math.PI / 2, 0);
    expect(sphere.x).toBeCloseTo(2);
    expect(sphere.z).toBeCloseTo(0, 5);
    expect(sphere.jacobian).toBeCloseTo(4);
    expect(Math.abs(squareToDiamond(1, 1).jacobian)).toBeCloseTo(0.5);
  });
});
