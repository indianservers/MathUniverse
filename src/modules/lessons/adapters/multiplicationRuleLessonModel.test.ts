import { describe, expect, it } from "vitest";
import {
  conditionalHeads,
  multiplicationTree,
  probabilityFraction,
} from "./multiplicationRuleLessonModel";

describe("multiplication rule lesson model", () => {
  it("builds twelve equally likely die-then-fair-coin paths", () => {
    const paths = multiplicationTree("die", "fair", false);
    expect(paths).toHaveLength(12);
    expect(paths[4]).toMatchObject({ first: "3", second: "H", probability: 1 / 12 });
    expect(paths.reduce((sum, path) => sum + path.probability, 0)).toBeCloseTo(1);
  });

  it("supports a biased independent second stage", () => {
    const paths = multiplicationTree("coin", "biased", false);
    expect(paths).toHaveLength(4);
    expect(paths[0].probability).toBeCloseTo(0.35);
  });

  it("recalculates conditional probabilities for a dependent model", () => {
    expect(conditionalHeads("3", "fair", true)).toBeCloseTo(3 / 7);
    const paths = multiplicationTree("die", "fair", true);
    expect(paths.reduce((sum, path) => sum + path.probability, 0)).toBeCloseTo(1);
  });

  it("formats familiar path probabilities as fractions", () => {
    expect(probabilityFraction(1 / 12)).toBe("1/12");
  });
});
