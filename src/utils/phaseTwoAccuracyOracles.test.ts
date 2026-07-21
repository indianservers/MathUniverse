import { describe, expect, it } from "vitest";
import { analyzeFiniteRelation, bayesPosterior, breadthFirstSearch, combination, complexPower, complexRoots, crossProduct3, descriptiveStatistics, determinant2, dijkstra, dotProduct, factorial, finiteDifferenceGradient, matrixMultiply, modularPower, truthFunctionsEquivalent } from "./phaseTwoAccuracyOracles";

describe("Phase 2 independent mathematical oracles", () => {
  it("verifies complex roots and combinatorial counts", () => {
    for (const root of complexRoots({ re: 1, im: 0 }, 4)) expect(complexPower(root, 4)).toMatchObject({ re: expect.closeTo(1, 10), im: expect.closeTo(0, 10) });
    expect(factorial(10)).toBe(3628800n);
    expect(combination(10, 3)).toBe(120n);
  });

  it("finds relation witnesses and logical countermodels", () => {
    const relation = analyzeFiniteRelation(["1", "2"], [["1", "1"], ["2", "2"], ["1", "2"]]);
    expect(relation).toMatchObject({ reflexive: true, symmetric: false, antisymmetric: true, transitive: true });
    expect(relation.witnesses.symmetric).toContain("(2,1)");
    expect(truthFunctionsEquivalent(2, ([p, q]) => !(p && q), ([p, q]) => !p || !q)).toEqual({ equivalent: true, counterexample: null });
    expect(truthFunctionsEquivalent(2, ([p, q]) => p || q, ([p, q]) => Boolean(p) !== Boolean(q))).toMatchObject({ equivalent: false });
  });

  it("cross-checks vector and matrix invariants", () => {
    const cross = crossProduct3([1, 2, 3], [4, 5, 6]);
    expect(dotProduct(cross, [1, 2, 3])).toBe(0);
    expect(dotProduct(cross, [4, 5, 6])).toBe(0);
    expect(matrixMultiply([[1, 2], [3, 4]], [[5], [6]])).toEqual([[17], [39]]);
    expect(determinant2([[1, 2], [3, 4]])).toBe(-2);
  });

  it("checks statistics and Bayes normalization", () => {
    expect(descriptiveStatistics([1, 2, 100])).toMatchObject({ mean: 103 / 3, median: 2 });
    expect(descriptiveStatistics([1, 2, 3], true).variance).toBe(1);
    const posterior = bayesPosterior([0.01, 0.99], [0.99, 0.05]);
    expect(posterior.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 12);
    expect(posterior[0]).toBeLessThan(0.2);
  });

  it("enforces graph algorithm preconditions and traversal results", () => {
    const edges = [{ from: "A", to: "B", weight: 2 }, { from: "A", to: "C", weight: 5 }, { from: "B", to: "C", weight: 1 }];
    expect(breadthFirstSearch(["A", "B", "C"], edges, "A")).toEqual(["A", "B", "C"]);
    expect(dijkstra(["A", "B", "C"], edges, "A")).toEqual({ A: 0, B: 2, C: 3 });
    expect(() => dijkstra(["A", "B"], [{ from: "A", to: "B", weight: -1 }], "A")).toThrow(/nonnegative/);
  });

  it("checks engineering gradients and modular cryptography arithmetic", () => {
    expect(finiteDifferenceGradient(([x, y]) => x * x + 3 * y * y, [2, -1])).toEqual([expect.closeTo(4, 7), expect.closeTo(-6, 7)]);
    expect(modularPower(4n, 13n, 497n)).toBe(445n);
  });
});
