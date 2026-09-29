import { describe, expect, it } from "vitest";
import { solutionValueAt } from "./directionFieldCompare";

describe("direction field curve comparison", () => {
  it("interpolates at one shared x coordinate", () => {
    expect(solutionValueAt([{ x: -1, y: 1 }, { x: 1, y: 5 }], 0)).toBe(3);
  });

  it("omits a curve when it is outside the integration interval or nonfinite", () => {
    expect(solutionValueAt([{ x: 0, y: 1 }, { x: 1, y: 2 }], -1)).toBeNull();
    expect(solutionValueAt([{ x: 0, y: 1 }, { x: 1, y: Number.NaN }], 0.5)).toBeNull();
  });
});
