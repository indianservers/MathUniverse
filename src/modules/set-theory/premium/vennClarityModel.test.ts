import { describe, it, expect } from "vitest";
import { operationHelp, operationPartition } from "./vennClarityModel";
import { expressions } from "./math";
const model = {
  universe: ["a", "b", "shared", "c", "outside"],
  setA: ["a", "shared"],
  setB: ["b", "shared"],
  setC: ["c", "shared"],
};
describe("plain language Venn operations", () => {
  it.each(expressions)("partitions U exactly for %s", (expression) => {
    const { included, excluded } = operationPartition(expression, model);
    expect(new Set([...included, ...excluded])).toEqual(
      new Set(model.universe),
    );
    expect(included.some((x) => excluded.includes(x))).toBe(false);
    expect(operationHelp[expression].rule.length).toBeGreaterThan(20);
  });
  it("includes the overlap once in union", () =>
    expect(operationPartition("A ∪ B", model).included).toEqual([
      "a",
      "b",
      "shared",
    ]));
  it("requires both conditions for intersection", () =>
    expect(operationPartition("A ∩ B", model).included).toEqual(["shared"]));
  it("distinguishes directional differences", () => {
    expect(operationPartition("A − B", model).included).toEqual(["a"]);
    expect(operationPartition("B − A", model).included).toEqual(["b"]);
  });
  it("excludes the overlap in symmetric difference", () =>
    expect(operationPartition("A △ B", model).included).toEqual(["a", "b"]));
  it("takes complements relative to U", () =>
    expect(operationPartition("Aᶜ", model).included).toEqual([
      "b",
      "c",
      "outside",
    ]));
  it("handles an empty universe", () =>
    expect(
      operationPartition("A ∪ B", {
        universe: [],
        setA: [],
        setB: [],
        setC: [],
      }),
    ).toEqual({ included: [], excluded: [] }));
});
