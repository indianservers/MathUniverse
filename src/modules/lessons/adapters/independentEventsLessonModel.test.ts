import { describe, expect, it } from "vitest";
import { conditionalProbability, defaultSpinnerWeights, independenceSummary, normalizeWeights, simulateSpinnerCoin } from "./independentEventsLessonModel";

describe("independent events model", () => {
  it("normalizes editable spinner weights", () => {
    const weights = normalizeWeights({ blue: 49, red: 25, green: 26 });
    expect(weights.blue + weights.red + weights.green).toBeCloseTo(1);
  });

  it("produces a complete reproducible joint table", () => {
    const first = simulateSpinnerCoin(600, defaultSpinnerWeights, true);
    const second = simulateSpinnerCoin(600, defaultSpinnerWeights, true);
    expect(first).toEqual(second);
    expect(independenceSummary(first).total).toBe(600);
  });

  it("detects the deliberately dependent coin model", () => {
    const counts = simulateSpinnerCoin(10000, defaultSpinnerWeights, false);
    expect(independenceSummary(counts).independent).toBe(false);
    expect(conditionalProbability(counts, "blue")).toBeGreaterThan(conditionalProbability(counts, "green"));
  });
});
