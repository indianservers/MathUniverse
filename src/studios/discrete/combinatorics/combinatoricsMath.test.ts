import { describe, expect, it } from "vitest";
import {
  ceilDivision,
  combination,
  combinationWithRepetition,
  countLeaves,
  factorial,
  generateBinaryTree,
  generateCombinations,
  generatePermutationTree,
  generatePermutations,
  generateSubsets,
  permutation,
  threeSetUnion,
  twoSetUnion,
  uniqueArrangementCount,
} from "./combinatoricsMath";
import { parseComboMode } from "./combinatoricsMode";

describe("combinatorics math", () => {
  it("matches the required counting identities", () => {
    expect(factorial(4)).toBe(24);
    expect(factorial(5)).toBe(120);
    expect(permutation(6, 3)).toBe(120);
    expect(combination(6, 3)).toBe(20);
    expect(combination(8, 3)).toBe(56);
    expect(generateSubsets(["A", "B", "C"])).toHaveLength(8);
    expect(ceilDivision(13, 4)).toBe(4);
    expect(twoSetUnion(20, 15, 5)).toBe(30);
    expect(threeSetUnion(40, 35, 30, 15, 12, 10, 5)).toBe(73);
    expect(uniqueArrangementCount("BANANA")).toBe(60);
    expect(factorial(5 - 1)).toBe(24);
    expect(combinationWithRepetition(3, 4)).toBe(15);
  });

  it("enumerates small permutations and combinations", () => {
    expect(generatePermutations(["A", "B", "C"]).map((row) => row.join(""))).toEqual([
      "ABC", "ACB", "BAC", "BCA", "CAB", "CBA",
    ]);
    expect(generateCombinations(["A", "B", "C"], 2)).toEqual([["A", "B"], ["A", "C"], ["B", "C"]]);
    expect(countLeaves(generatePermutationTree(["A", "B", "C"]))).toBe(6);
    expect(countLeaves(generateBinaryTree(3))).toBe(8);
  });
});

describe("combinatorics mode routing", () => {
  it("parses slugs and catalog aliases", () => {
    expect(parseComboMode(null)).toBe("arrangements");
    expect(parseComboMode("arrangements")).toBe("arrangements");
    expect(parseComboMode("Arrangements")).toBe("arrangements");
    expect(parseComboMode("Selections")).toBe("selections");
    expect(parseComboMode("Pigeonhole")).toBe("pigeonhole");
    expect(parseComboMode("Inclusion-Exclusion")).toBe("inclusion-exclusion");
    expect(parseComboMode("Generating Tree")).toBe("generating-tree");
    expect(parseComboMode("generating-tree")).toBe("generating-tree");
  });
});
