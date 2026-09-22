import { describe, expect, it } from "vitest";
import {
  bernoulliCases,
  compareMethods,
  exactPresets,
  heunStep,
  homogeneousPresets,
  linearPresets,
  applicableMethods,
  methodPresets,
} from "./firstOrderMath";

describe("first-order differential equation studio math", () => {
  it("classifies each method-selector preset once", () => {
    const methods = methodPresets.map((preset) => preset.method);
    expect(new Set(methods).size).toBe(5);
    expect(methodPresets.find((preset) => preset.id === "exact")?.test).toContain("∂M/∂y = 1");
    const overlap = methodPresets.find((preset) => preset.id === "overlap");
    expect(applicableMethods(overlap!).sort()).toEqual(["linear", "separable"]);
  });

  it("keeps the exact and non-exact tests distinct", () => {
    expect(exactPresets.filter((preset) => preset.exact)).toHaveLength(2);
    expect(exactPresets.find((preset) => preset.id === "not-exact")?.exact).toBe(false);
  });

  it("matches the closed form of y' + y = x", () => {
    const preset = linearPresets[0];
    expect(preset.solution(0, 2)).toBeCloseTo(1);
    expect(preset.solution(1, 0)).toBeCloseTo(0);
    expect(preset.constantFromPoint(0, 1)).toBeCloseTo(2);
  });

  it("recovers the Bernoulli constant solution and the n = 2 substitution", () => {
    expect(bernoulliCases.find((item) => item.n === 1)?.solution?.(3, 4)).toBe(4);
    const curve = bernoulliCases.find((item) => item.n === 2)?.solution;
    expect(curve?.(0, 1)).toBeCloseTo(0.5);
  });

  it("reduces the classic homogeneous slope with a finite field away from y = x", () => {
    const preset = homogeneousPresets.find((item) => item.id === "classic");
    expect(preset?.closedForm).toContain("arctan");
    expect(preset?.field(1, 0)).toBeCloseTo(1);
    expect(Number.isFinite(preset?.field(1, 1))).toBe(false);
  });
  it("places Heun between Euler and RK4 on y' = x − y", () => {
    const [row] = compareMethods(0, 1, 0.5, 4);
    expect(row.eulerError).toBeGreaterThan(row.heunError);
    expect(row.heunError).toBeGreaterThan(row.rk4Error);
    const f = (x: number, y: number) => x - y;
    expect(heunStep(f, 0, 1, 0.5)).toBeCloseTo(1 + 0.25 * ((0 - 1) + (0.5 - (1 + 0.5 * (0 - 1)))));
  });
});
