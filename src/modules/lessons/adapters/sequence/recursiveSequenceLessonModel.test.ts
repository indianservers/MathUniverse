import { describe, expect, it } from "vitest";
import {
  parseRecursiveRule,
  recursiveRuleLabel,
  recursiveSequenceAnalysis,
} from "./recursiveSequenceLessonModel";
describe("recursive sequence model", () => {
  it("computes the target affine recurrence", () => {
    const rule = parseRecursiveRule("0.6a + 4")!,
      result = recursiveSequenceAnalysis(rule, 2);
    const expected = [
      2, 5.2, 7.12, 8.272, 8.9632, 9.37792, 9.626752, 9.7760512, 9.86563072,
      9.919378432,
    ];
    result.terms.forEach((value, index) =>
      expect(value).toBeCloseTo(expected[index], 10),
    );
    expect(result.fixed).toBeCloseTo(10);
    expect(result.stable).toBe(true);
    expect(result.behavior).toBe("Convergent");
    expect(recursiveRuleLabel(rule)).toBe("0.6aₙ₋₁ + 4");
  });
  it("distinguishes divergence, cycles, and nonlinear behavior", () => {
    expect(
      recursiveSequenceAnalysis({ kind: "affine", m: 2, b: 0 }, 2).behavior,
    ).toBe("Divergent");
    expect(
      recursiveSequenceAnalysis({ kind: "affine", m: -1, b: 0 }, 2).behavior,
    ).toBe("Period-2 cycle");
    expect(
      recursiveSequenceAnalysis({ kind: "logistic", r: 3.2 }, 0.2).behavior,
    ).toBe("Period-2 cycle");
  });
  it("rejects invalid recurrence input", () => {
    expect(parseRecursiveRule("a + unknown")).toBeNull();
  });
});
