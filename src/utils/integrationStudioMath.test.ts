import { describe, expect, it } from "vitest";
import { calculateIntegration, enforcePartitionCount, parseIntegrationQuery } from "./integrationStudioMath";

describe("integration studio mathematics", () => {
  it("computes all supported approximation methods", () => {
    for (const method of ["left", "midpoint", "right", "trapezoid", "simpson"] as const) {
      const result = calculateIntegration((x) => x * x, -2, 4, 50, method);
      expect(result.n).toBe(50);
      expect(Number.isFinite(result.approximation)).toBe(true);
      expect(result.reference).toBeCloseTo(24, 8);
    }
  });

  it("supports reversed bounds and preserves integral orientation", () => {
    const forward = calculateIntegration((x) => x * x, -2, 4, 50, "midpoint");
    const reversed = calculateIntegration((x) => x * x, 4, -2, 50, "midpoint");
    expect(reversed.approximation).toBeCloseTo(-forward.approximation, 10);
    expect(reversed.reference).toBeCloseTo(-forward.reference, 10);
    expect(reversed.signedArea).toBeCloseTo(-forward.signedArea, 10);
    expect(reversed.geometricArea).toBeCloseTo(forward.geometricArea, 10);
  });

  it("retains every control represented in a shared URL", () => {
    expect(parseIntegrationQuery("?v_function=x%5E2&v_g_function=x&v_lower_a=4&v_upper_b=-2&v_partitions_n=50&v_method=simpson&v_between_curves=1&v_mode=between")).toMatchObject({
      expression: "x^2", secondExpression: "x", lower: 4, upper: -2, partitions: 50,
      method: "simpson", betweenCurves: true, mode: "between",
    });
  });

  it("clamps partition buttons and keeps Simpson counts even", () => {
    expect(enforcePartitionCount(-20, "midpoint")).toBe(2);
    expect(enforcePartitionCount(500, "midpoint")).toBe(100);
    expect(enforcePartitionCount(51, "simpson")).toBe(52);
  });
});
