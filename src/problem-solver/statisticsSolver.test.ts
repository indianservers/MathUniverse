import { describe, expect, it } from "vitest";
import { classifyProblem } from "./problemClassifier";
import { solveStatistics } from "./statisticsSolver";

function solve(input: string) {
  const classification = classifyProblem(input);
  const result = solveStatistics(classification);
  if (!result) throw new Error(`No statistics result for ${input}`);
  return { classification, result };
}

describe("statistics solver", () => {
  it.each([
    ["mean of 4, 6, 8, 10", "7"],
    ["median of 4, 6, 8, 10", "7"],
    ["mode of 2, 3, 3, 5", "3"],
    ["range of 4, 6, 8, 10", "6"],
  ])("solves basic statistic %s", (input, expected) => {
    const { classification, result } = solve(input);
    expect(classification.kind).toBe("statistics");
    expect(result.result).toBe(expected);
    expect(result.steps.join(" ")).toContain("Final answer");
  });

  it.each([
    ["mean: 4, 6, 8, 10", "7"],
    ["median: 4, 6, 8, 10", "7"],
    ["mode: 2, 3, 3, 5", "3"],
  ])("supports short command %s", (input, expected) => {
    expect(solve(input).result.result).toBe(expected);
  });

  it("computes population variance", () => {
    const { result } = solve("variance of 4, 6, 8, 10");
    expect(result.result).toBe("5");
    expect(result.assumptions.join(" ")).toContain("Population variance");
  });

  it("computes population standard deviation", () => {
    const { result } = solve("standard deviation of 4, 6, 8, 10");
    expect(result.result).toBe("2.2361");
    expect(result.steps.join(" ")).toContain("sqrt(5)");
  });

  it.each([
    ["mean(34,34,56,78)", "50.5"],
    ["AVERAGE(34,34,56,78)", "50.5"],
    ["MEDIAN(34,34,56,78)", "45"],
    ["MODE.SNGL(2, 3, 3, 5)", "3"],
    ["VAR.P(4,6,8,10)", "5"],
    ["VAR.S(4,6,8,10)", "6.6667"],
    ["STDEV.P(4,6,8,10)", "2.2361"],
    ["STDEV.S(4,6,8,10)", "2.582"],
    ["QUARTILES(2,4,6,8,10)", "Q1 = 3, Q2 = 6, Q3 = 9"],
  ])("supports Excel-style statistics formula %s", (input, expected) => {
    const { classification, result } = solve(input);
    expect(classification.kind).toBe("statistics");
    expect(result.result).toContain(expected);
    expect(result.steps.join(" ")).toContain("Final answer");
  });

  it("computes sample variance", () => {
    const { result } = solve("sample variance of 4, 6, 8, 10");
    expect(result.result).toBe("6.6667");
  });

  it("computes quartiles by median-of-halves method", () => {
    const { result } = solve("quartiles of 2, 4, 6, 8, 10");
    expect(result.result).toContain("Q1 = 3");
    expect(result.result).toContain("Q2 = 6");
    expect(result.result).toContain("Q3 = 9");
    expect(result.assumptions.join(" ")).toContain("median-of-halves");
  });

  it("computes five-number summary", () => {
    const { result } = solve("five number summary of 2, 4, 6, 8, 10");
    expect(result.result).toContain("min = 2");
    expect(result.result).toContain("max = 10");
  });

  it("computes frequency table", () => {
    const { result } = solve("frequency table of 1, 2, 2, 3, 3, 3");
    expect(result.result).toBe("1 | 1; 2 | 2; 3 | 3");
  });

  it("computes stats summary", () => {
    const { result } = solve("stats: 4, 6, 8, 10");
    expect(result.result).toContain("count = 4");
    expect(result.result).toContain("mean = 7");
    expect(result.result).toContain("variance = 5");
  });

  it("computes weighted mean", () => {
    const { result } = solve("weighted mean values 80, 90, 100 weights 2, 3, 5");
    expect(result.result).toBe("93");
    expect(result.steps.join(" ")).toContain("weighted mean");
  });

  it("does not crash on non-numeric values", () => {
    const { result } = solve("mean of apple, 4, 6");
    expect(result.result).toBe("5");
    expect(result.warnings.join(" ")).toContain("apple");
  });

  it("warns for invalid data", () => {
    const { result } = solve("mean of apple, pear");
    expect(result.result).toBe("No valid numeric data");
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("warns for mismatched weighted mean counts", () => {
    const { result } = solve("weighted mean values 80, 90 weights 2, 3, 5");
    expect(result.result).toBe("Cannot compute weighted mean");
    expect(result.warnings.join(" ")).toContain("mismatch");
  });
});
