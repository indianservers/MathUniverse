import { describe, expect, it } from "vitest";
import { spreadFromX, varianceModel } from "./varianceModel";
describe("variance and squared deviations", () => {
  it("computes reference distributions A and B", () => {
    expect(varianceModel(0)).toMatchObject({ values: [0, 1, 2], mean: 1, variance: .5, secondMoment: 1.5 });
    expect(varianceModel(100)).toMatchObject({ values: [-1, 1, 3], mean: 1, variance: 2, secondMoment: 3 });
  });
  it("keeps mean fixed and both variance methods equal at every slider step", () => {
    for (const mode of ["weighted", "equal", "point"] as const) for (let spread = 0; spread <= 100; spread++) {
      const m = varianceModel(spread, mode);
      expect(m.mean).toBeCloseTo(1);
      expect(m.variance).toBeCloseTo(m.shortcut);
      expect(m.sd * m.sd).toBeCloseTo(m.variance);
      expect(m.rows.reduce((sum, row) => sum + row.signed, 0)).toBeCloseTo(0);
    }
  });
  it("increases variance with spread unless all probability is at the center", () => {
    expect(varianceModel(100).variance).toBeGreaterThan(varianceModel(0).variance);
    expect(varianceModel(100, "point").variance).toBe(0);
  });
  it("converts symmetric drag points to spread and clamps", () => {
    expect(spreadFromX(0)).toBe(0);
    expect(spreadFromX(-1)).toBe(100);
    expect(spreadFromX(3)).toBe(100);
    expect(spreadFromX(2.5)).toBe(50);
    expect(spreadFromX(1)).toBe(0);
    expect(() => varianceModel(101)).toThrow(RangeError);
  });
});
