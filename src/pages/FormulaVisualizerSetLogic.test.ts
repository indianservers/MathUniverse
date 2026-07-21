import { describe, expect, it } from "vitest";
import { getSetLogicVisualMode } from "../utils/setLogicVisualModel";

describe("set theory formula visual routing", () => {
  it.each([
    ["set-union", "union"],
    ["set-intersection", "intersection"],
    ["set-difference", "difference"],
    ["de-morgan-union", "complement"],
    ["cardinality-union", "cardinality"],
    ["cartesian-product", "cartesian"],
    ["implication", "implication"],
    ["biconditional", "biconditional"],
    ["contrapositive", "contrapositive"],
  ] as const)("routes %s to its own %s diagram", (formulaId, expected) => {
    expect(getSetLogicVisualMode(formulaId)).toBe(expected);
  });
});
