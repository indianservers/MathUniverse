import { describe, expect, it } from "vitest";
import { solveProblem } from "./problemSolverEngine";
import type { SolverConfidence } from "./types/solverResult";

type GoldenCase = {
  input: string;
  answerIncludes?: string;
  confidence: SolverConfidence;
};

const arithmeticCases: GoldenCase[] = Array.from({ length: 30 }, (_, index) => {
  const left = index + 2;
  const right = index + 3;
  return {
    input: `${left} + ${right}`,
    answerIncludes: String(left + right),
    confidence: "verified",
  };
});

const linearCases: GoldenCase[] = Array.from({ length: 25 }, (_, index) => {
  const coefficient = (index % 5) + 1;
  const solution = index - 12;
  const constant = index % 7 - 3;
  const right = coefficient * solution + constant;
  return {
    input: `${coefficient}x + ${constant} = ${right}`,
    answerIncludes: `x = ${solution}`,
    confidence: "verified",
  };
});

const quadraticCases: GoldenCase[] = Array.from({ length: 15 }, (_, index) => {
  const leftRoot = index % 5;
  const rightRoot = leftRoot + 2;
  const sum = leftRoot + rightRoot;
  const product = leftRoot * rightRoot;
  return {
    input: `x^2 - ${sum}x + ${product} = 0`,
    answerIncludes: `x = ${leftRoot}, ${rightRoot}`,
    confidence: "verified",
  };
});

const identityAndContradictionCases: GoldenCase[] = [
  { input: "0x + 5 = 5", answerIncludes: "all real numbers", confidence: "verified" },
  { input: "x = x", answerIncludes: "all real numbers", confidence: "verified" },
  { input: "x + 1 = x + 1", answerIncludes: "all real numbers", confidence: "verified" },
  { input: "2x + 3 = 2x + 3", answerIncludes: "all real numbers", confidence: "verified" },
  { input: "0x + 5 = 8", answerIncludes: "No solution", confidence: "verified" },
  { input: "x + 1 = x + 2", answerIncludes: "No solution", confidence: "verified" },
  { input: "3x - 4 = 3x + 8", answerIncludes: "No solution", confidence: "verified" },
  { input: "7 = 8", answerIncludes: "No solution", confidence: "verified" },
];

const expressionCases: GoldenCase[] = [
  { input: "2 + 3 * 4", answerIncludes: "14", confidence: "verified" },
  { input: "sqrt(34)", answerIncludes: "Approximate", confidence: "verified" },
  { input: "log(100)", answerIncludes: "2", confidence: "verified" },
  { input: "ln(e)", answerIncludes: "1", confidence: "verified" },
  { input: "sin(30)", answerIncludes: "0.5", confidence: "verified" },
  { input: "cos(60)", answerIncludes: "0.5", confidence: "verified" },
  { input: "tan(45)", answerIncludes: "1", confidence: "verified" },
  { input: "15% of 200", answerIncludes: "30", confidence: "verified" },
  { input: "gcd 48 180", answerIncludes: "12", confidence: "verified" },
  { input: "lcm 12 18", answerIncludes: "36", confidence: "verified" },
  { input: "minimum 9, 4, 12", answerIncludes: "4", confidence: "verified" },
  { input: "maximum 9, 4, 12", answerIncludes: "12", confidence: "verified" },
];

const calculusAndDataCases: GoldenCase[] = [
  { input: "derivative of x^2", answerIncludes: "2x", confidence: "verified" },
  { input: "derivative of x^3 + 2x", answerIncludes: "3x^2 + 2", confidence: "verified" },
  { input: "integrate 2x", answerIncludes: "x^2 + C", confidence: "verified" },
  { input: "integral of x^2", answerIncludes: "x^3/3 + C", confidence: "verified" },
  { input: "limit x->0 sin(x)/x", answerIncludes: "1", confidence: "verified" },
  { input: "mean of 4, 6, 8, 10", answerIncludes: "7", confidence: "verified" },
  { input: "median of 4, 6, 8, 10", answerIncludes: "7", confidence: "verified" },
  { input: "mode of 2, 3, 3, 5", answerIncludes: "3", confidence: "verified" },
  { input: "range of 4, 6, 8, 10", answerIncludes: "6", confidence: "verified" },
  { input: "determinant [[1,2],[3,4]]", answerIncludes: "-2", confidence: "verified" },
];

const partialCases: GoldenCase[] = [
  { input: "differentiate x^x", answerIncludes: "x", confidence: "partially-supported" },
  { input: "integrate exp(-x^2)", answerIncludes: "erf", confidence: "partially-supported" },
];

const unsupportedCases: GoldenCase[] = [
  { input: "Laplace transform of sin(t)", confidence: "unsupported" },
  { input: "Fourier series of x", confidence: "unsupported" },
  { input: "Newton Raphson method", confidence: "unsupported" },
  { input: "second order differential equation", confidence: "unsupported" },
  { input: "prove Fermat last theorem", confidence: "unsupported" },
  { input: "plot sin(x)", confidence: "unsupported" },
  { input: "graph y = x^2", confidence: "unsupported" },
  { input: "Navier Stokes solution", confidence: "unsupported" },
  { input: "Bessel function J0", confidence: "unsupported" },
  { input: "Runge Kutta y'=x", confidence: "unsupported" },
];

const goldenCases = [
  ...arithmeticCases,
  ...linearCases,
  ...quadraticCases,
  ...identityAndContradictionCases,
  ...expressionCases,
  ...calculusAndDataCases,
  ...partialCases,
  ...unsupportedCases,
];

describe("problem solver trust certification", () => {
  it("keeps the golden-answer suite above 100 cases", () => {
    expect(goldenCases.length).toBeGreaterThanOrEqual(100);
  });

  it.each(goldenCases)("certifies $input", ({ input, answerIncludes, confidence }) => {
    const output = solveProblem(input);
    expect(output.trust.confidence).toBe(confidence);
    expect(output.result.confidenceStatus).toBe(confidence);
    expect(output.trust.verification).toBeDefined();

    if (confidence === "unsupported") {
      expect(output.result.canCopy).toBe(false);
      expect(output.trust.unsupportedReason).toBeTruthy();
      expect(output.trust.answer).toBeUndefined();
      expect(output.trust.verification?.passed).toBe(true);
      return;
    }

    expect(output.trust.answer).toBeTruthy();
    expect(output.trust.verification?.passed).toBe(true);
    if (answerIncludes) expect(output.trust.answer).toContain(answerIncludes);
  });
});
