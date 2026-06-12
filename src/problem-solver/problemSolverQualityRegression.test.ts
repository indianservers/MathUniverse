import { describe, expect, it } from "vitest";
import { solveAlgebraSteps } from "./algebraStepSolver";
import { solveCalculus } from "./calculusSolver";
import { solveExpressionOperation } from "./expressionOperationSolver";
import { buildVisualVerification } from "./graphingUtils";
import { recognizeMathInput } from "./intelligence/mathRecognizer";
import { solveMatrix } from "./matrixSolver";
import { classifyProblem } from "./problemClassifier";
import type { ProblemClassification, ProblemIntentKind, ProblemSolverResult } from "./problemTypes";
import { solveStatistics } from "./statisticsSolver";
import { solveSystem } from "./systemSolver";

const equationKinds: ProblemIntentKind[] = ["linear-equation", "quadratic-equation", "polynomial-equation"];

function solve(input: string): { classification: ProblemClassification; result: ProblemSolverResult } {
  const classification = classifyProblem(input);
  if (equationKinds.includes(classification.kind)) {
    const algebra = solveAlgebraSteps(classification.normalizedInput);
    if (algebra) {
      return {
        classification,
        result: {
          assumptions: classification.assumptions,
          canCopy: true,
          kind: classification.kind,
          method: algebra.method,
          normalizedInput: classification.normalizedInput,
          restrictions: algebra.restrictions,
          result: algebra.finalAnswer,
          steps: algebra.steps,
          title: algebra.kind,
          verification: algebra.verification,
          warnings: [...classification.warnings, ...algebra.warnings],
        },
      };
    }
  }
  const result =
    solveExpressionOperation(classification) ??
    solveCalculus(classification) ??
    solveSystem(classification) ??
    solveStatistics(classification) ??
    solveMatrix(classification) ??
    safeResult(classification);
  return { classification, result };
}

function safeResult(classification: ProblemClassification): ProblemSolverResult {
  return {
    assumptions: classification.assumptions,
    canCopy: false,
    kind: classification.kind,
    method: "Safe classification",
    normalizedInput: classification.normalizedInput,
    result: classification.kind === "unsupported" ? "Unsupported problem type" : `Detected: ${classification.kind}`,
    steps: ["No deterministic solver was called for this form."],
    title: classification.kind,
    warnings: classification.warnings,
  };
}

describe("problem solver quality regression", () => {
  it.each([
    ["0x + 5 = 5", "Solution: all real numbers"],
    ["x = x", "Solution: all real numbers"],
    ["x + 1 = x + 1", "Solution: all real numbers"],
  ])("handles identity equation %s", (input, expected) => {
    const { result } = solve(input);
    expect(result.result).toBe(expected);
    expect(result.warnings.join(" ").toLowerCase()).toContain("identity");
  });

  it.each([
    ["0x + 5 = 8", "No solution"],
    ["x + 1 = x + 2", "No solution"],
  ])("handles contradiction equation %s", (input, expected) => {
    const { result } = solve(input);
    expect(result.result).toBe(expected);
    expect(result.warnings.join(" ").toLowerCase()).toContain("contradiction");
  });

  it.each([
    ["log(100)", "2"],
    ["ln(e)", "1"],
  ])("evaluates logarithm %s", (input, expected) => {
    const { result } = solve(input);
    expect(result.result).toBe(expected);
    expect(result.warnings).toEqual([]);
    expect(result.restrictions).toEqual([]);
  });

  it.each([
    ["sqrt(-1)", "No real value", "negative"],
    ["log(0)", "Undefined over the real numbers", "positive argument"],
    ["log(-5)", "Undefined over the real numbers", "positive argument"],
  ])("fails safely for invalid real-domain input %s", (input, expected, warning) => {
    const { result } = solve(input);
    expect(result.result).toBe(expected);
    expect(result.canCopy).toBe(false);
    expect(result.warnings.join(" ").toLowerCase()).toContain(warning.toLowerCase());
  });

  it.each([
    ["sqrt(x-2)", "x >= 2"],
    ["ln(x-1)", "x > 1"],
    ["1/(x-1)", "x != 1"],
  ])("reports expression domain for %s", (input, restriction) => {
    const { result } = solve(input);
    expect(result.restrictions).toContain(restriction);
    expect(result.result).toContain("Domain:");
  });

  it("solves unicode-arrow limit", () => {
    const { result } = solve("limit x→0 sin(x)/x");
    expect(result.result).toBe("1");
    expect(result.method).toBe("Standard limit");
  });

  it("does not claim deterministic steps for unsupported engineering recognition", () => {
    const { classification, result } = solve("Laplace transform of sin(t)");
    const recognition = recognizeMathInput("Laplace transform of sin(t)", "Unsupported");
    expect(classification.kind).toBe("unsupported");
    expect(result.canCopy).toBe(false);
    expect(recognition.categories).toContain("engineering");
    expect(recognition.suggestions.join(" ")).toContain("Full solving for this topic may be a future feature.");
  });

  it("suppresses filler-word noise but flags meaningful unknown words", () => {
    const mean = recognizeMathInput("mean of 4, 6, 8, 10", "Statistics");
    expect(mean.audit.unmatchedSegments).not.toContain("of");
    expect(mean.suggestions).not.toContain("Some words were not recognized as math keywords. Try a clearer mathematical expression.");

    const unknown = recognizeMathInput("apple mango x + 2", "Unsupported");
    expect(unknown.audit.unmatchedSegments).toEqual(expect.arrayContaining(["apple", "mango"]));
  });

  it("handles invalid matrix syntax safely", () => {
    const { result } = solve("[[1,2],[3]]");
    expect(result.result).toBe("Invalid matrix input");
    expect(result.canCopy).toBe(false);
    expect(result.warnings.join(" ")).toContain("Invalid matrix syntax");
  });

  it("warns when sample variance has too few values", () => {
    const { result } = solve("sample variance of 4");
    expect(result.result).toBe("Cannot compute sample variance");
    expect(result.canCopy).toBe(false);
    expect(result.warnings.join(" ")).toContain("Too few values");
  });

  it("keeps graph/table safe around rational discontinuities", () => {
    const { classification, result } = solve("1/(x-1)");
    const visual = buildVisualVerification(classification, result);
    expect(visual?.table.some((row) => row.x === 1 && row.y === null)).toBe(true);
    expect(visual?.warnings.join(" ")).toContain("discontinuities");
  });
});
