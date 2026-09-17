import { describe, expect, it } from "vitest";
import { crtTwo, gcd, hopCycle, inverseMod, solveLinear } from "./modularMath";

describe("modular arithmetic", () => {
  it("finds inverses only when gcd is 1", () => {
    expect(inverseMod(4, 12)).toBeNull();
    expect(inverseMod(5, 11)).toBe(9);
    expect((5 * 9) % 11).toBe(1);
  });

  it("solves linear congruences and CRT pairs", () => {
    expect(solveLinear(4, 8, 12)).toEqual([2, 5, 8, 11]);
    expect(crtTwo(2, 3, 3, 5)).toEqual({ x: 8, modulus: 15 });
    expect(gcd(12, 18)).toBe(6);
    expect(hopCycle(5, 12)[0]).toBe(0);
  });
});
