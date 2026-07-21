import { describe, expect, it } from "vitest";
import { getProportionalVisualMode, PROPORTIONAL_FORMULA_IDS } from "./proportionalVisualModel";

describe("proportional reasoning visual routing", () => {
  it("gives every proportional formula its own visual mode", () => {
    expect(PROPORTIONAL_FORMULA_IDS).toHaveLength(12);
    expect(new Set(PROPORTIONAL_FORMULA_IDS).size).toBe(12);
    for (const id of PROPORTIONAL_FORMULA_IDS) expect(getProportionalVisualMode(id)).toBe(id);
    expect(getProportionalVisualMode("unrelated-formula")).toBeNull();
  });
});
