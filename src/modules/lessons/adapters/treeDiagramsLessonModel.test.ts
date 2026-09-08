import { describe, expect, it } from "vitest";
import { buildProbabilityTree, targetProbability } from "./treeDiagramsLessonModel";

describe("tree diagrams model", () => {
  const parameters = { pA: 0.6, pBGivenA: 0.3, pBGivenNotA: 0.8 };
  it("multiplies the four terminal paths", () => {
    expect(buildProbabilityTree(parameters).map((path) => path.probability)).toEqual([0.18, 0.42, 0.32000000000000006, 0.07999999999999999]);
  });
  it("adds terminal paths for target events and preserves total probability", () => {
    const paths = buildProbabilityTree(parameters);
    expect(targetProbability(paths, "b")).toBeCloseTo(0.5);
    expect(paths.reduce((sum, path) => sum + path.probability, 0)).toBeCloseTo(1);
  });
  it("adds a real third stage when requested", () => {
    const paths = buildProbabilityTree({ ...parameters, pC: 0.25 });
    expect(paths).toHaveLength(8);
    expect(targetProbability(paths, "c")).toBeCloseTo(0.25);
  });
});
