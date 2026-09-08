import { describe, expect, it } from "vitest";
import { checkProbabilityInput, drawBall, multiplicationTree, pathProbability, reducedProbability } from "./multiplicationRuleModel";
describe("two-draw multiplication model", () => {
  it("computes all without-replacement paths and normalization", () => {
    const tree = multiplicationTree();
    expect(tree.map(p => p.value)).toEqual([.3, .3, .30000000000000004, .1]);
    expect(tree.reduce((sum, p) => sum + p.value, 0)).toBeCloseTo(1);
    expect(reducedProbability(tree[0].numerator, tree[0].denominator)).toBe("3/10");
  });
  it("restores counts for replacement and changes path probabilities", () => {
    const tree = multiplicationTree(true);
    expect(tree[0].value).toBeCloseTo(.36);
    expect(tree[3].value).toBeCloseTo(.16);
    expect(tree.reduce((sum, p) => sum + p.value, 0)).toBeCloseTo(1);
  });
  it("prevents repeated physical balls only without replacement and caps at two draws", () => {
    expect(drawBall(["R1"], "R1", false)).toEqual(["R1"]);
    expect(drawBall(["R1"], "R1", true)).toEqual(["R1", "R1"]);
    expect(drawBall(["R1"], "B1", false)).toEqual(["R1", "B1"]);
    expect(drawBall(["R1", "B1"], "R2", true)).toEqual(["R1", "B1"]);
  });
  it("calculates the three practice outcomes including an extra green ball", () => {
    expect(pathProbability(4, 1, 5, false, false).value).toBeCloseTo(.2);
    expect(pathProbability(2, 2, 5, true, false).value).toBeCloseTo(.1);
    expect(pathProbability(3, 3, 5, true, true).value).toBeCloseTo(.36);
  });
  it("checks fractions and decimals without evaluating expressions", () => {
    expect(checkProbabilityInput("1/5", .2)).toBe(true);
    expect(checkProbabilityInput("0.36", .36)).toBe(true);
    expect(checkProbabilityInput("1/0", .2)).toBe(false);
    expect(checkProbabilityInput("", 0)).toBe(false);
    expect(checkProbabilityInput("2+3", 5)).toBe(false);
  });
});
