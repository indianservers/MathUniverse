import { describe, expect, it } from "vitest";
import { calculateRiemann, defaultIntegrationFormulaState, generateFormulaPartitions, normalizeFormulaPartitions, parseIntegrationFormulaQuery, resolveIntegrationFormulaId } from "./integrationFormulaStudioMath";

describe("integration formula studio mathematics", () => {
  const square = (x: number) => x * x;

  it("generates left, midpoint, and right samples", () => {
    expect(generateFormulaPartitions(square, 0, 4, 8, "left")[0].sampleX).toBe(0);
    expect(generateFormulaPartitions(square, 0, 4, 8, "midpoint")[0].sampleX).toBe(.25);
    expect(generateFormulaPartitions(square, 0, 4, 8, "right")[0].sampleX).toBe(.5);
  });

  it("generates trapezoids with endpoint heights", () => {
    const part = generateFormulaPartitions(square, 0, 4, 8, "trapezoid")[0];
    expect(part.y0).toBe(0);
    expect(part.y1).toBe(.25);
    expect(part.area).toBeCloseTo(.0625, 8);
  });

  it("computes width, approximation, exact comparison, and errors", () => {
    const result = calculateRiemann(square, 0, 4, 8, "midpoint", 64 / 3);
    expect(result.dx).toBe(.5);
    expect(result.approximation).toBeCloseTo(21.25, 10);
    expect(result.exact).toBeCloseTo(64 / 3, 10);
    expect(result.absoluteError).toBeCloseTo(1 / 12, 10);
    expect(result.relativeError).toBeCloseTo(.390625, 6);
    expect(result.signedError).toBeLessThan(0);
  });

  it("rejects invalid bounds", () => expect(() => generateFormulaPartitions(square, 4, 0, 8, "midpoint")).toThrow(/Lower bound/));

  it("restores URL state and clamps partition counts", () => {
    expect(parseIntegrationFormulaQuery("?v_n=12&v_formula=average-value&v_method=right")).toMatchObject({ n: 12, formulaId: "average-value", method: "right" });
    expect(parseIntegrationFormulaQuery("?v_n=999&v_lower_a=5&v_upper_b=2")).toMatchObject({ n: 64, lower: 0, upper: 4 });
    expect(normalizeFormulaPartitions(1)).toBe(2);
  });

  it("falls back to the selected default formula and reset state", () => {
    expect(resolveIntegrationFormulaId("unknown")).toBe("riemann-sum");
    expect(defaultIntegrationFormulaState).toEqual({ n: 8, lower: 0, upper: 4, method: "midpoint", formulaId: "riemann-sum", learning: "Visual" });
  });
});
