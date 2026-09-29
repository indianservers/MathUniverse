import { describe, expect, it } from "vitest";
import { vectorAdd3, vectorAngle3, vectorCross3, vectorDot3, vectorMagnitude3, vectorProjection3, vectorSubtract3, vectorUnit3 } from "./vectorWorkbench3d";

describe("3D vector workbench", () => {
  it("computes component operations and geometric measures", () => {
    const a: [number, number, number] = [2, 1, 1];
    const b: [number, number, number] = [-1, 2, 2];
    expect(vectorAdd3(a, b)).toEqual([1, 3, 3]);
    expect(vectorSubtract3(a, b)).toEqual([3, -1, -1]);
    expect(vectorDot3(a, b)).toBe(2);
    expect(vectorCross3(a, b)).toEqual([0, -5, 5]);
    expect(vectorDot3(vectorCross3(a, b), a)).toBe(0);
    expect(vectorDot3(vectorCross3(a, b), b)).toBe(0);
    expect(vectorMagnitude3([3, 4, 0])).toBe(5);
    expect(vectorProjection3([3, 2, 0], [2, 0, 0])).toEqual([3, 0, 0]);
    expect(vectorAngle3([1, 0, 0], [0, 0, 2])).toBe(90);
  });

  it("handles zero vectors without invalid values", () => {
    expect(vectorUnit3([0, 0, 0])).toBeNull();
    expect(vectorProjection3([1, 2, 3], [0, 0, 0])).toBeNull();
    expect(vectorAngle3([0, 0, 0], [1, 0, 0])).toBeNull();
  });
});
