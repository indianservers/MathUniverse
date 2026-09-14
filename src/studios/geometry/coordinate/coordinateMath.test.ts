import { describe, expect, it } from "vitest";
import {
  dist,
  intersectSlopeLines,
  lineForms,
  midpoint,
  perpendicularBisector,
  riseRun,
  slope,
  slopeToGeneral,
} from "./coordinateMath";

describe("coordinate geometry formulas", () => {
  const A = { x: -3, y: 2 };
  const B = { x: 4, y: -1 };
  const C = { x: 1, y: 4 };

  it("matches AB distance, midpoint, and slopes from the mockup scene", () => {
    expect(dist(A, B)).toBeCloseTo(7.61577, 5);
    expect(midpoint(A, B)).toEqual({ x: 0.5, y: 0.5 });
    expect(slope(A, C)).toBeCloseTo(0.5, 8);
    expect(slope({ x: 0, y: 1 }, { x: 2, y: 2 })).toBeCloseTo(0.5, 8);
  });

  it("writes slope-intercept, standard, and general forms", () => {
    const ell = lineForms(0.5, 1);
    expect(ell.slope).toContain("x");
    expect(ell.slope).toContain("½");
    expect(slopeToGeneral(0.5, 1)).toEqual({ A: 1, B: -2, C: 2 });
    expect(ell.standard).toBe("x − 2y = -2");
    expect(ell.general).toBe("x − 2y + 2 = 0");
    const em = lineForms(1, -2);
    expect(em.standard).toBe("x − y = 2");
    expect(em.general).toBe("x − y − 2 = 0");
    expect(riseRun(0.5)).toEqual({ rise: 1, run: 2 });
  });

  it("intersects ℓ: y = ½x + 1 and m: y = x − 2 at (6, 4)", () => {
    expect(intersectSlopeLines(0.5, 1, 1, -2)).toEqual({ x: 6, y: 4 });
    const pb = perpendicularBisector(A, B);
    expect(pb.mid).toEqual({ x: 0.5, y: 0.5 });
    expect(dist(A, pb.mid)).toBeCloseTo(dist(B, pb.mid), 8);
  });
});
