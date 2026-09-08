import { describe, expect, it } from "vitest";
import { probabilityControl, TOTAL_PRACTICE, totalProbability } from "./totalProbabilityModel";
describe("weighted conditional probabilities", () => {
  it("computes the default weighted total and contribution shares", () => {
    const model = totalProbability(.6, .02, .05);
    expect(model.total).toBeCloseTo(.032);
    expect(model.expectedDefects).toBeCloseTo(3.2);
    expect(model.contributions[0]).toBeCloseTo(.375);
    expect(model.contributions[1]).toBeCloseTo(.625);
  });
  it("preserves source, branch and joint probability sums across controls", () => {
    for (let w = 0; w <= 10; w++) for (let a = 0; a <= 10; a++) for (let b = 0; b <= 10; b++) {
      const model = totalProbability(w / 10, a / 10, b / 10);
      expect(model.sources.reduce((sum, source) => sum + source.defective + source.good, 0)).toBeCloseTo(1);
      expect(model.total).toBeGreaterThanOrEqual(Math.min(a, b) / 10 - 1e-8);
      expect(model.total).toBeLessThanOrEqual(Math.max(a, b) / 10 + 1e-8);
    }
  });
  it("handles zero totals and zero-weight sources without dividing by zero", () => {
    expect(totalProbability(.6, 0, 0).contributions).toEqual([null, null]);
    expect(totalProbability(0, 1, .25).total).toBe(.25);
    expect(totalProbability(1, .25, 1).total).toBe(.25);
    expect(totalProbability(.3, 1, 1).total).toBe(1);
  });
  it("computes all three practice totals", () => {
    const expected = [.039, .0235, .068];
    TOTAL_PRACTICE.forEach((p, i) => expect(totalProbability(p.weight, p.rate1, p.rate2).total).toBeCloseTo(expected[i]));
  });
  it("clamps editable controls and rejects invalid model probabilities", () => {
    expect(probabilityControl(1.2)).toBe(1);
    expect(probabilityControl(-.2)).toBe(0);
    expect(probabilityControl(.237)).toBe(.24);
    expect(() => totalProbability(.5, -1, 0)).toThrow(RangeError);
    expect(() => totalProbability(NaN, 0, 0)).toThrow(RangeError);
  });
});
