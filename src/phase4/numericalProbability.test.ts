import { describe, expect, it } from "vitest";
import { bisection, compositeSimpson } from "./numerical";
import { createDistribution } from "./distributions";
import { runSamplingSimulation } from "./simulation";
import { addQuantities, convertUnit } from "./units";

describe("certified numerical, probability, units and simulation", () => {
  it("reports bisection convergence and residual", () => { const result = bisection((x) => x * x - 2, 1, 2); expect(result.status).toBe("CONVERGED"); expect(result.value).toBeCloseTo(Math.SQRT2, 9); expect(result.residual).toBeLessThan(1e-9); });
  it("does not call an invalid root bracket converged", () => { const result = bisection((x) => x * x + 1, -1, 1); expect(result.status).toBe("INVALID"); expect(result.convergence.converged).toBe(false); });
  it("reports Simpson error estimate", () => { const result = compositeSimpson(Math.sin, 0, Math.PI, 400); expect(result.value).toBeCloseTo(2, 9); expect(result.method).toContain("Simpson"); });
  it("uses stable normal survival and inverse round trips", () => { const normal = createDistribution({ id: "normal", parameters: { mu: 0, sigma: 1 } }); expect(normal.survival(9)).toBeGreaterThan(0); const p = 0.999999; expect(normal.cdf(normal.quantile(p))).toBeCloseTo(p, 9); });
  it("uses expm1 for small exponential probabilities", () => { const exponential = createDistribution({ id: "exponential", parameters: { lambda: 2 } }); expect(exponential.cdf(1e-12)).toBeCloseTo(2e-12, 22); });
  it("replays identical simulations from the same seed", () => { const options = { seed: 42, trials: 250, sampleSize: 20 }; expect(runSamplingSimulation(options).results).toEqual(runSamplingSimulation(options).results); });
  it("round-trips units and rejects incompatible addition", () => { const cm = convertUnit({ value: 2, unit: "m", dimension: "L" }, "cm"); expect(cm.quantity?.value).toBe(200); expect(convertUnit(cm.quantity!, "m").quantity?.value).toBe(2); expect(addQuantities({ value: 1, unit: "m", dimension: "L" }, { value: 1, unit: "s", dimension: "T" }).status).toBe("UNDEFINED"); });
});
