export type ExponentialProblem118 = {
  base: number;
  exponent: number;
  variable: string;
};

export const EXPONENTIAL_EXAMPLES_118: ExponentialProblem118[] = [
  { base: 2, exponent: 5, variable: "x" },
  { base: 3, exponent: 3, variable: "x" },
  { base: 4, exponent: 3, variable: "x" },
  { base: 5, exponent: 2, variable: "x" },
];

export const EXPONENTIAL_PRACTICES_118: ExponentialProblem118[] = [
  { base: 3, exponent: 4, variable: "y" },
  { base: 2, exponent: 6, variable: "n" },
  { base: 5, exponent: 3, variable: "t" },
];

export function exponentialTarget118({
  base,
  exponent,
}: ExponentialProblem118) {
  return base ** exponent;
}

export function solveExponentialEquation118(base: number, target: number) {
  const exactExponent =
    target > 0 && base > 0 && base !== 1
      ? Math.log(target) / Math.log(base)
      : Number.NaN;
  const matchable =
    Number.isFinite(exactExponent) &&
    Math.abs(exactExponent - Math.round(exactExponent)) < 1e-9;
  const solvedExponent = matchable ? Math.round(exactExponent) : exactExponent;
  const checkedValue = Number.isFinite(solvedExponent)
    ? base ** solvedExponent
    : Number.NaN;
  return {
    exactExponent,
    solvedExponent,
    matchable,
    checkedValue,
    valid:
      Number.isFinite(checkedValue) && Math.abs(checkedValue - target) < 1e-8,
  };
}

export function exponentialPowerLadder118(
  base: number,
  requiredExponent: number,
  minimum = 5,
) {
  const count = Math.max(
    minimum,
    Number.isFinite(requiredExponent) ? Math.ceil(requiredExponent) : minimum,
  );
  return Array.from(
    { length: Math.min(8, Math.max(1, count)) },
    (_, index) => ({ exponent: index + 1, value: base ** (index + 1) }),
  );
}

export function exponentialRungPayload118(base: number, target: number) {
  return `${base}:${target}`;
}

export function isExponentialRungDrop118(
  payload: string,
  base: number,
  target: number,
) {
  return (
    payload.trim() !== "" && payload === exponentialRungPayload118(base, target)
  );
}

export function isExponentialPracticeCorrect118(
  problem: ExponentialProblem118,
  answer: number,
) {
  return (
    Number.isFinite(answer) &&
    Math.abs(problem.base ** answer - exponentialTarget118(problem)) < 1e-9
  );
}
