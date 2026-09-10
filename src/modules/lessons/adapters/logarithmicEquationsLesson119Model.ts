export type LogarithmicProblem119 = {
  base: number;
  exponent: number;
  variable: string;
};

export const LOGARITHMIC_EXAMPLES_119: LogarithmicProblem119[] = [
  { base: 2, exponent: 5, variable: "x" },
  { base: 10, exponent: 3, variable: "x" },
  { base: 3, exponent: 4, variable: "y" },
];

export const LOGARITHMIC_PRACTICES_119: LogarithmicProblem119[] = [
  { base: 3, exponent: 4, variable: "y" },
  { base: 2, exponent: 6, variable: "n" },
  { base: 5, exponent: 3, variable: "t" },
];

export function logarithmicExpectedValue119(problem: LogarithmicProblem119) {
  return problem.base ** problem.exponent;
}

export function solveLogarithmicEquation119(
  problem: LogarithmicProblem119,
  candidate: number,
) {
  const expectedValue = logarithmicExpectedValue119(problem);
  const domainPass = candidate > 0;
  const logValue =
    domainPass && problem.base > 0 && problem.base !== 1
      ? Math.log(candidate) / Math.log(problem.base)
      : Number.NaN;
  const verified =
    Number.isFinite(logValue) && Math.abs(logValue - problem.exponent) < 1e-8;
  return { expectedValue, domainPass, logValue, verified };
}

export function logarithmicPowerLadder119(
  problem: LogarithmicProblem119,
  minimum = 5,
) {
  const count = Math.min(8, Math.max(minimum, problem.exponent));
  return Array.from({ length: count }, (_, index) => ({
    exponent: index + 1,
    value: problem.base ** (index + 1),
  }));
}

export function isLogarithmicPracticeCorrect119(
  problem: LogarithmicProblem119,
  answer: number,
) {
  return (
    Number.isFinite(answer) &&
    Math.abs(answer - logarithmicExpectedValue119(problem)) < 1e-8
  );
}
