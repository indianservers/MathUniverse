import { describe, expect, it } from "vitest";
import { runTrials, trialProbabilities, trialTree, type TrialSettings } from "./bernoulliTrialsModel";
const settings: TrialSettings = { n: 8, p: .7, fatigue: false, depletion: false, third: false };
describe("Bernoulli experiment", () => {
  it("samples actual binary outcomes with fixed probabilities", () => {
    const draws = [.1, .8, .9, .2, .3, .4, .75, .6];
    const result = runTrials(settings, () => draws.shift()!);
    expect(result.map(r => r.outcome)).toEqual(["S", "F", "F", "S", "S", "S", "F", "S"]);
    expect(result.every(r => r.success === .7 && r.other === 0)).toBe(true);
  });
  it("updates fatigue, conditional urn composition and third outcomes", () => {
    expect(trialProbabilities({ ...settings, fatigue: true }, ["S", "F"]).success).toBeCloseTo(.6);
    expect(trialProbabilities({ ...settings, depletion: true }, ["S"]).success).toBeCloseTo(13 / 19);
    expect(trialProbabilities({ ...settings, depletion: true }, ["F"]).success).toBeCloseTo(14 / 19);
    expect(runTrials({ ...settings, third: true }, () => .99).every(r => r.outcome === "O")).toBe(true);
  });
  it("has normalized leaves at every tree depth for all slider probabilities and modes", () => {
    for (let step = 0; step <= 20; step++) for (const mode of [{}, { fatigue: true }, { depletion: true }, { third: true }, { third: true, fatigue: true }]) {
      const tree = trialTree({ ...settings, p: step / 20, ...mode });
      for (let depth = 1; depth <= 3; depth++) expect(tree.filter(node => node.path.length === depth).reduce((sum, node) => sum + node.probability, 0)).toBeCloseTo(1, 12);
      expect(tree.every(node => node.conditional >= 0 && node.conditional <= 1)).toBe(true);
    }
  });
  it("never draws more success or failure balls than the urn contains", () => {
    for (let step = 0; step <= 20; step++) for (const sample of [0, .4, .999999]) {
      const result = runTrials({ ...settings, n: 12, p: step / 20, depletion: true }, () => sample);
      expect(result.filter(r => r.outcome === "S").length).toBeLessThanOrEqual(step);
      expect(result.filter(r => r.outcome === "F").length).toBeLessThanOrEqual(20 - step);
    }
  });
  it("handles certainty and rejects invalid settings and random values", () => {
    expect(runTrials({ ...settings, p: 0 }, () => 0).every(r => r.outcome === "F")).toBe(true);
    expect(runTrials({ ...settings, p: 1 }, () => .99999).every(r => r.outcome === "S")).toBe(true);
    expect(() => runTrials({ ...settings, n: 0 })).toThrow();
    expect(() => runTrials({ ...settings, p: NaN })).toThrow();
    expect(() => runTrials({ ...settings, depletion: true, third: true })).toThrow();
    expect(() => runTrials(settings, () => 1)).toThrow();
  });
});
