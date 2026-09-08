import { describe, expect, it } from "vitest";
import { productionMix, productionPlanning, productionQuantity } from "./productionPlanningModel";

describe("production planning", () => {
  it("computes the continuous and whole-product optima independently", () => {
    const result = productionPlanning();
    expect(result.continuous).toMatchObject({ x: 3.6, y: 3.6, profit: 324, feasible: true, wood: 18, labour: 18 });
    expect(result.integer).toMatchObject({ x: 3, y: 4, profit: 320, wood: 18, labour: 17, labourLeft: 1 });
    expect(result.corners.map(p => [p.x, p.y])).toEqual(expect.arrayContaining([[0, 0], [6, 0], [3.6, 3.6], [0, 6]]));
  });
  it("reports overproduction rather than hiding it with resource-meter clipping", () => {
    expect(productionMix(6, 6)).toMatchObject({ profit: 540, wood: 30, labour: 30, feasible: false, woodLeft: -12 });
    expect(productionMix(4, 4, true).feasible).toBe(false);
    expect(productionMix(3.6, 3.6, true).feasible).toBe(false);
    expect(productionMix(-1, 0).feasible).toBe(false);
  });
  it("bounds every feasible tenth-step plan by the computed continuous optimum", () => {
    const best = productionPlanning().continuous.profit;
    for (let ix = 0; ix <= 60; ix++) for (let iy = 0; iy <= 60; iy++) {
      const p = productionMix(ix / 10, iy / 10);
      if (p.feasible) expect(p.profit).toBeLessThanOrEqual(best + 1e-8);
    }
  });
  it("independently confirms the whole-product maximum", () => {
    let best = 0;
    for (let x = 0; x <= 10; x++) for (let y = 0; y <= 10; y++) if (2 * x + 3 * y <= 18 && 3 * x + 2 * y <= 18) best = Math.max(best, 40 * x + 50 * y);
    expect(productionPlanning().integer.profit).toBe(best);
  });
  it("snaps, clamps, and rejects nonfinite quantities", () => {
    expect(productionQuantity(3.64, false)).toBe(3.6);
    expect(productionQuantity(3.6, true)).toBe(4);
    expect(productionQuantity(-1, false)).toBe(0);
    expect(productionQuantity(7, false)).toBe(6);
    expect(() => productionQuantity(NaN, true)).toThrow(RangeError);
  });
});
