import { describe, expect, it } from "vitest";
import { INITIAL_SHIPMENTS, shipmentQuantity, transportationFamily, transportationModel } from "./transportationModel";

describe("transportation allocation", () => {
  it("checks the default allocation and route costs", () => {
    expect(transportationModel(INITIAL_SHIPMENTS)).toMatchObject({ rows: [30, 20], columns: [25, 25], feasible: true, costs: [100, 30, 0, 60], cost: 190 });
  });
  it("checks columns even when all supplies are allocated", () => {
    expect(transportationModel([20, 10, 0, 20])).toMatchObject({ rows: [30, 20], columns: [20, 30], rowValid: [true, true], columnValid: [false, false], feasible: false });
  });
  it("checks rows even when warehouse demands are met", () => {
    expect(transportationModel([25, 25, 0, 0])).toMatchObject({ columns: [25, 25], feasible: false });
  });
  it("preserves all four equalities along the corrected feasible family", () => {
    for (let t = 5; t <= 25; t += .25) {
      const values = transportationFamily(t), result = transportationModel(values);
      expect(values[3]).toBe(t - 5);
      expect(result.feasible).toBe(true);
      expect(result.cost).toBeCloseTo(290 - 4 * t);
    }
    expect(transportationModel(transportationFamily(5)).cost).toBe(270);
    expect(transportationModel(transportationFamily(25)).cost).toBe(190);
  });
  it("verifies the practice allocation and minimum across feasible integer plans", () => {
    expect(transportationModel([20, 10, 5, 15])).toMatchObject({ feasible: true, cost: 210 });
    let best = Infinity;
    for (let a = 0; a <= 30; a++) for (let c = 0; c <= 20; c++) {
      const candidate = transportationModel([a, 30 - a, c, 20 - c]);
      if (candidate.feasible) best = Math.min(best, candidate.cost);
    }
    expect(best).toBe(190);
  });
  it("rejects invalid input and bounds editable shipment quantities", () => {
    expect(() => transportationFamily(4)).toThrow(RangeError);
    expect(() => transportationFamily(26)).toThrow(RangeError);
    expect(() => shipmentQuantity(NaN)).toThrow(RangeError);
    expect(shipmentQuantity(-1)).toBe(0);
    expect(shipmentQuantity(55)).toBe(50);
    expect(shipmentQuantity(4.6)).toBe(5);
    expect(transportationModel([-1, 31, 26, -6]).feasible).toBe(false);
  });
});
