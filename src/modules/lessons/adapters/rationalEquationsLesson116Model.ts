export type RationalProblem116 = {
  numerator: number;
  restriction: number;
  right: number;
  variable: string;
};
export type RationalSolution116 = {
  numerator: number;
  denominator: number;
  value: number;
  status: "unique" | "none" | "infinite";
  restrictionSatisfied: boolean;
  substitutionSatisfied: boolean;
};

export const RATIONAL_PROBLEMS_116: RationalProblem116[] = [
  { numerator: 1, restriction: 2, right: 3, variable: "x" },
  { numerator: 2, restriction: 1, right: 4, variable: "x" },
  { numerator: 3, restriction: -2, right: 2, variable: "x" },
  { numerator: 4, restriction: 3, right: 5, variable: "x" },
];

export const RATIONAL_PRACTICES_116: RationalProblem116[] = [
  { numerator: 2, restriction: -1, right: 4, variable: "y" },
  { numerator: 3, restriction: 2, right: 2, variable: "z" },
  { numerator: 5, restriction: -2, right: 3, variable: "t" },
];

function gcd116(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd116(b, a % b);
}

export function solveRationalEquation116({
  numerator,
  restriction,
  right,
}: RationalProblem116): RationalSolution116 {
  if (right === 0) {
    const status = numerator === 0 ? "infinite" : "none";
    return {
      numerator: 0,
      denominator: 1,
      value: Number.NaN,
      status,
      restrictionSatisfied: true,
      substitutionSatisfied: status === "infinite",
    };
  }
  const rawNumerator = right * restriction + numerator;
  const divisor = gcd116(rawNumerator, right) || 1;
  let denominator = right / divisor;
  let numeratorExact = rawNumerator / divisor;
  if (denominator < 0) {
    denominator *= -1;
    numeratorExact *= -1;
  }
  const value = numeratorExact / denominator;
  const restrictionSatisfied = value !== restriction;
  const substitutionSatisfied =
    restrictionSatisfied &&
    Math.abs(numerator / (value - restriction) - right) < 1e-9;
  return {
    numerator: numeratorExact,
    denominator,
    value,
    status: substitutionSatisfied ? "unique" : "none",
    restrictionSatisfied,
    substitutionSatisfied,
  };
}

export function rationalDenominatorText116({
  restriction,
  variable,
}: RationalProblem116) {
  return `${variable} ${restriction < 0 ? "+" : "−"} ${Math.abs(restriction)}`;
}

export function rationalExactText116(
  solution: Pick<RationalSolution116, "numerator" | "denominator">,
) {
  return solution.denominator === 1
    ? `${solution.numerator}`
    : `${solution.numerator}/${solution.denominator}`;
}

export function parseRationalAnswer116(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return Number.NaN;
  const parts = trimmed.split("/").map(Number);
  if (parts.length === 1) return parts[0];
  if (parts.length !== 2 || parts[1] === 0) return Number.NaN;
  return parts[0] / parts[1];
}

export function rationalMultiplierPayload116(problem: RationalProblem116) {
  return `${problem.variable}:${problem.restriction}`;
}

export function isRationalMultiplierDrop116(
  payload: string,
  problem: RationalProblem116,
) {
  return (
    payload.trim() !== "" && payload === rationalMultiplierPayload116(problem)
  );
}

export function isRationalPracticeCorrect116(
  problem: RationalProblem116,
  answer: string,
) {
  const solution = solveRationalEquation116(problem);
  const value = parseRationalAnswer116(answer);
  return (
    solution.status === "unique" &&
    Number.isFinite(value) &&
    Math.abs(value - solution.value) < 1e-9
  );
}
