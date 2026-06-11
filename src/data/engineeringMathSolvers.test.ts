import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  engineeringSolverPresets,
  laplaceDecayPreset,
  runBisectionPreset,
  runControlResponsePreset,
  runEigenPreset,
  runHeatGridPreset,
  runJacobianAreaPreset,
  runLinearProgrammingPreset,
  runMarkovQueuePreset,
  runNewtonPreset,
  runOdeComparisonPreset,
  runVectorFieldPreset,
} from "./engineeringMathSolvers";

const pageSource = new URL("../pages/EngineeringMath.tsx", import.meta.url);

describe("engineering math solvers", () => {
  it("solves the benchmark cubic with Newton and bisection", () => {
    const newton = runNewtonPreset();
    const bisection = runBisectionPreset();

    expect(newton.root).toBeCloseTo(1.5213797, 5);
    expect(newton.residual).toBeLessThan(1e-8);
    expect(bisection.root).toBeCloseTo(1.5213797, 5);
    expect(bisection.iterations.length).toBeGreaterThan(10);
  });

  it("compares Euler and RK4 with RK4 closer to the exact value", () => {
    const report = runOdeComparisonPreset();
    const exact = Math.exp(0.5);
    const eulerError = Math.abs((report.euler.at(-1)?.y ?? 0) - exact);
    const rkError = Math.abs((report.rk4.at(-1)?.y ?? 0) - exact);

    expect(report.equation).toBe("y'=0.5y");
    expect(rkError).toBeLessThan(eulerError);
    expect(report.finalError).toBeGreaterThan(0);
  });

  it("evaluates transform, PDE, stochastic, and vector-field presets", () => {
    const jacobian = runJacobianAreaPreset();
    const eigen = runEigenPreset();
    const transform = laplaceDecayPreset(1.2, 2);
    const heat = runHeatGridPreset();
    const markov = runMarkovQueuePreset();
    const field = runVectorFieldPreset();
    const lp = runLinearProgrammingPreset();
    const control = runControlResponsePreset();

    expect(jacobian.mappedArea).toBe(5);
    expect(eigen.eigenvalues[0]).toBeCloseTo(5, 6);
    expect(eigen.eigenvalues[1]).toBeCloseTo(2, 6);
    expect(transform.value).toBeCloseTo(0.3125, 6);
    expect(heat.stable).toBe(true);
    expect(heat.grid).toHaveLength(9);
    expect(markov.stable).toBe(true);
    expect(markov.steadyState[0] + markov.steadyState[1]).toBeCloseTo(1, 6);
    expect(field.divergence).toBeCloseTo(1.6, 6);
    expect(field.curlZ).toBeCloseTo(1.3, 6);
    expect(lp.optimum.value).toBe(2280);
    expect(control.stable).toBe(true);
    expect(control.percentOvershoot).toBeGreaterThan(0);
  });

  it("registers deterministic solver presets for the engineering hub", async () => {
    const source = await readFile(pageSource, "utf8");
    const coveredDomains = new Set(engineeringSolverPresets.map((preset) => preset.domainId));

    expect(engineeringSolverPresets.length).toBeGreaterThanOrEqual(11);
    expect(Array.from(coveredDomains)).toEqual(expect.arrayContaining([
      "engineering-calculus",
      "engineering-linear-algebra",
      "numerical-methods",
      "engineering-differential-equations",
      "transforms-signals",
      "partial-differential-equations",
      "probability-statistics-stochastic",
      "optimization-operations-research",
      "vector-calculus-fields",
      "complex-special-control",
    ]));
    expect(coveredDomains.size).toBe(10);
    expect(source).toContain("Solver Presets");
    expect(source).toContain("engineeringSolverPresets");
  });
});
