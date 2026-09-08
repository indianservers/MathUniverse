import { describe, expect, it } from "vitest";
import { boundFromPosition, INFEASIBLE_PRACTICE, overlapModel } from "./infeasibleProblemsModel";

describe("infeasible interval model", () => {
  it("detects the default incompatible bounds and exact gap", () => {
    expect(overlapModel(5, 2)).toMatchObject({ kind: "empty", gap: 3, interval: null });
  });
  it("distinguishes a closed singleton from a nonempty interval", () => {
    expect(overlapModel(2, 2)).toMatchObject({ kind: "point", interval: [2, 2] });
    expect(overlapModel(-2.5, 2)).toMatchObject({ kind: "interval", gap: 0, interval: [-2.5, 2] });
  });
  it("keeps every possible slider pair consistent with the intersection", () => {
    for (let l = -10; l <= 10; l += .5) for (let u = -10; u <= 10; u += .5) {
      const result = overlapModel(l, u);
      expect(result.interval !== null).toBe(l <= u);
      if (result.interval) expect((l + u) / 2 >= l && (l + u) / 2 <= u).toBe(true);
    }
  });
  it("maps drag coordinates, snaps halves and clamps out-of-range pointers", () => {
    expect(boundFromPosition(35)).toBe(-10);
    expect(boundFromPosition(645)).toBe(10);
    expect(boundFromPosition(492.5)).toBe(5);
    expect(boundFromPosition(355)).toBe(.5);
    expect(boundFromPosition(-100)).toBe(-10);
    expect(boundFromPosition(900)).toBe(10);
  });
  it("derives option C as the only infeasible practice system", () => {
    expect(INFEASIBLE_PRACTICE.map(([l, u]) => overlapModel(l, u).kind)).toEqual(["interval", "point", "empty", "interval"]);
  });
  it("rejects nonfinite model input", () => {
    expect(() => overlapModel(NaN, 2)).toThrow(RangeError);
    expect(() => overlapModel(2, Infinity)).toThrow(RangeError);
  });
});
