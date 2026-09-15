import { describe, expect, it } from "vitest";
import { areIndependent, coordinates, gramSchmidt, spanDimension } from "./vectorSpaceMath";

describe("vector space math", () => {
  it("detects dependence and reads coordinates in a basis", () => {
    expect(areIndependent(1, 0, 0, 1)).toBe(true);
    expect(areIndependent(1, 0, 2, 0)).toBe(false);
    expect(spanDimension(2, true)).toBe(2);
    expect(coordinates(3, 1, 1, 0, 0, 1)).toEqual({ s: 3, t: 1 });
  });

  it("orthonormalizes a pair and leaves a residual orthogonal to u1", () => {
    const gs = gramSchmidt(2, 0, 1, 1);
    expect(gs.u1[0]).toBeCloseTo(1);
    expect(gs.u1[1]).toBeCloseTo(0);
    expect(gs.u1[0] * gs.u2[0] + gs.u1[1] * gs.u2[1]).toBeCloseTo(0);
    expect(gs.u1[0] * gs.residual[0] + gs.u1[1] * gs.residual[1]).toBeCloseTo(0);
  });
});
