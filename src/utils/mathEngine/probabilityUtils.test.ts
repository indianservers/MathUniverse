import { describe, expect, it } from "vitest";
import {
  bayesPosterior,
  diceProbability,
  oneProportionZTest,
  simulateConfidenceIntervals,
  simulateMarkovChain,
  simulateMonteCarloPi,
  simulateRandomWalk,
  simulateSamplingDistribution,
} from "./probabilityUtils";

describe("probabilityUtils advanced simulations", () => {
  it("computes exact dice probabilities", () => {
    expect(diceProbability(7, 2)).toBeCloseTo(6 / 36);
    expect(diceProbability(1, 2)).toBe(0);
    expect(diceProbability(6, 1)).toBeCloseTo(1 / 6);
  });

  it("simulates sampling distributions with CLT metrics", () => {
    const simulation = simulateSamplingDistribution(500, 20, 42);

    expect(simulation.sampleMeans).toHaveLength(500);
    expect(simulation.histogram.length).toBe(12);
    expect(simulation.populationMean).toBe(3.5);
    expect(simulation.meanOfMeans).toBeGreaterThan(3);
    expect(simulation.meanOfMeans).toBeLessThan(4);
    expect(simulation.standardError).toBeGreaterThan(0);
  });

  it("estimates confidence interval coverage", () => {
    const simulation = simulateConfidenceIntervals(80, 30, 0.95, 7);

    expect(simulation.intervals).toHaveLength(80);
    expect(simulation.expectedCaptureRate).toBe(0.95);
    expect(simulation.captureRate).toBeGreaterThan(0.75);
    expect(simulation.captureRate).toBeLessThanOrEqual(1);
  });

  it("runs reproducible random walks and Monte Carlo estimates", () => {
    const firstWalk = simulateRandomWalk(100, 0.55, 99);
    const secondWalk = simulateRandomWalk(100, 0.55, 99);
    const pi = simulateMonteCarloPi(5000, 13);

    expect(firstWalk.finalPosition).toBe(secondWalk.finalPosition);
    expect(firstWalk.path.at(-1)?.trial).toBe(100);
    expect(pi.estimate).toBeGreaterThan(2.9);
    expect(pi.estimate).toBeLessThan(3.4);
    expect(pi.sample.length).toBeLessThanOrEqual(320);
  });

  it("computes Bayes posterior and one-proportion z tests", () => {
    const bayes = bayesPosterior(0.01, 0.99, 0.05);
    const test = oneProportionZTest(60, 100, 0.5);

    expect(bayes.posterior).toBeGreaterThan(0);
    expect(bayes.posterior).toBeLessThan(1);
    expect(test.z).toBeGreaterThan(1);
    expect(test.pValue).toBeGreaterThan(0);
    expect(test.pValue).toBeLessThan(1);
  });

  it("evolves Markov chain probabilities toward a valid distribution", () => {
    const chain = simulateMarkovChain([[0.8, 0.2], [0.3, 0.7]], [1, 0], 12, ["A", "B"]);
    const finalTotal = chain.steadyState.reduce((sum, value) => sum + value, 0);

    expect(chain.steps).toHaveLength(13);
    expect(chain.states).toEqual(["A", "B"]);
    expect(finalTotal).toBeCloseTo(1);
    expect(chain.steadyState.every((value) => value >= 0 && value <= 1)).toBe(true);
  });
});
