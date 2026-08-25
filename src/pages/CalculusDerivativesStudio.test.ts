import { describe, expect, it } from "vitest";
import {
  analyzeDerivative,
  derivativeModeSnapshot,
  type DerivativeMode,
} from "./CalculusDerivativesStudio";

describe("Calculus Derivatives Studio", () => {
  it("matches the reference tangent and secant values for x squared", () => {
    const result = analyzeDerivative((x) => x * x, 1, 0.5);

    expect(result.fa).toBeCloseTo(1, 8);
    expect(result.fb).toBeCloseTo(2.25, 8);
    expect(result.tangentSlope).toBeCloseTo(2, 5);
    expect(result.secantSlope).toBeCloseTo(2.5, 8);
    expect(result.difference).toBeCloseTo(0.5, 5);
  });

  it("shows secant convergence as h approaches zero", () => {
    const coarse = analyzeDerivative((x) => x * x, 1, 0.5);
    const fine = analyzeDerivative((x) => x * x, 1, 0.001);

    expect(fine.difference).toBeLessThan(coarse.difference);
    expect(fine.secantSlope).toBeCloseTo(fine.tangentSlope, 2);
  });

  it("provides distinct finite models for every derivative tab", () => {
    const modes: DerivativeMode[] = [
      "tangent",
      "rules",
      "chain",
      "implicit",
      "higher",
      "linearization",
    ];
    const expressions = new Set<string>();

    for (const mode of modes) {
      const snapshot = derivativeModeSnapshot(
        mode,
        mode === "implicit" ? 3 : 1,
        0.5,
      );
      expect(Number.isFinite(snapshot.tangentSlope)).toBe(true);
      expect(Number.isFinite(snapshot.secantSlope)).toBe(true);
      expect(snapshot.derivative.length).toBeGreaterThan(0);
      expressions.add(snapshot.expression);
    }

    expect(expressions.size).toBe(modes.length);
  });
});
