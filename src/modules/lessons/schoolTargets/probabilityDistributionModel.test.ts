import { describe, expect, it } from "vitest";
import { DISTRIBUTION_OUTCOMES, distributionModel, FAIR_COIN_MASSES, headCount, probabilityFromChartY, simulateDistribution } from "./probabilityDistributionModel";
describe("three-value PMF", () => {
  it("derives fair-coin bins and cumulative probabilities", () => {
    expect(DISTRIBUTION_OUTCOMES.map(headCount)).toEqual([0, 1, 1, 2]);
    expect(distributionModel(FAIR_COIN_MASSES)).toMatchObject({ total: 1, valid: true, cumulative: [.25, .75, 1], interval: .75 });
  });
  it("rejects missing, excessive, negative and nonfinite mass", () => {
    for (const masses of [[.2, .2, .2], [.5, .5, .5], [-.1, .6, .5], [NaN, 0, 1]] as [number, number, number][]) expect(distributionModel(masses).valid).toBe(false);
    expect(() => simulateDistribution([.2, .2, .2], 20)).toThrow(RangeError);
  });
  it("maps and clamps bar dragging to hundredths", () => {
    expect(probabilityFromChartY(270)).toBe(0);
    expect(probabilityFromChartY(160)).toBe(.5);
    expect(probabilityFromChartY(50)).toBe(1);
    expect(probabilityFromChartY(500)).toBe(0);
    expect(probabilityFromChartY(-10)).toBe(1);
  });
  it("samples the current distribution rather than fabricated counts", () => {
    let i = 0; const values = [0, .249, .25, .5, .749, .75, .999];
    expect(simulateDistribution(FAIR_COIN_MASSES, 7, () => values[i++])).toEqual([2, 3, 2]);
    expect(simulateDistribution([0, 0, 1], 20, () => .5)).toEqual([0, 0, 20]);
    expect(() => simulateDistribution(FAIR_COIN_MASSES, 0)).toThrow(RangeError);
  });
  it("validates every hundredth-step normalized triple", () => {
    for (let a = 0; a <= 100; a++) for (let b = 0; b <= 100 - a; b++) expect(distributionModel([a / 100, b / 100, (100 - a - b) / 100]).valid).toBe(true);
  });
});
