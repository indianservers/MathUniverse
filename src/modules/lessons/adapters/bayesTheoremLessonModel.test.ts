import { describe, expect, it } from "vitest";
import {
  bayesQuestions,
  defaultDiagnosticParameters,
  diagnosticSummary,
  questionAnswer,
} from "./bayesTheoremLessonModel";
describe("Bayes theorem diagnostic model", () => {
  it("builds the target 1000-person confusion matrix", () => {
    expect(diagnosticSummary(defaultDiagnosticParameters)).toMatchObject({
      disease: 100,
      noDisease: 900,
      truePositive: 90,
      falseNegative: 10,
      falsePositive: 90,
      trueNegative: 810,
      positive: 180,
      negative: 820,
      posterior: 0.5,
    });
  });
  it("keeps every population partition balanced", () => {
    const result = diagnosticSummary({
      population: 777,
      baseRate: 0.17,
      sensitivity: 0.83,
      specificity: 0.91,
    });
    expect(result.truePositive + result.falseNegative).toBe(result.disease);
    expect(result.falsePositive + result.trueNegative).toBe(result.noDisease);
    expect(result.positive + result.negative).toBe(777);
  });
  it("solves the target practice parameters without copying its inconsistent answer", () => {
    expect(questionAnswer(bayesQuestions[0])).toBeCloseTo(0.5);
  });
});
