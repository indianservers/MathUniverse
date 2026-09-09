export type MultiStepProblem108 = {
  id: string;
  variable: string;
  coefficient: number;
  constant: number;
  rhs: number;
};

export type MultiStepOperation108 = "constant" | "groups";

export const MULTI_STEP_PROBLEMS_108: MultiStepProblem108[] = [
  {
    id: "two-x-plus-three",
    variable: "x",
    coefficient: 2,
    constant: 3,
    rhs: 11,
  },
  {
    id: "three-x-plus-two",
    variable: "x",
    coefficient: 3,
    constant: 2,
    rhs: 14,
  },
  {
    id: "four-x-minus-five",
    variable: "x",
    coefficient: 4,
    constant: -5,
    rhs: 15,
  },
  {
    id: "five-x-plus-four",
    variable: "x",
    coefficient: 5,
    constant: 4,
    rhs: 29,
  },
];

export const MULTI_STEP_PRACTICES_108: MultiStepProblem108[] = [
  {
    id: "three-y-plus-two",
    variable: "y",
    coefficient: 3,
    constant: 2,
    rhs: 14,
  },
  {
    id: "two-p-minus-six",
    variable: "p",
    coefficient: 2,
    constant: -6,
    rhs: 12,
  },
];

export function solveMultiStepProblem108(problem: MultiStepProblem108) {
  return (problem.rhs - problem.constant) / problem.coefficient;
}

export function intermediateMultiStepValue108(problem: MultiStepProblem108) {
  return problem.rhs - problem.constant;
}

export function evaluateMultiStepProblem108(
  problem: MultiStepProblem108,
  value: number,
) {
  return problem.coefficient * value + problem.constant;
}

export function formatMultiStepExpression108(problem: MultiStepProblem108) {
  const constant =
    problem.constant === 0
      ? ""
      : problem.constant > 0
        ? ` + ${problem.constant}`
        : ` − ${Math.abs(problem.constant)}`;
  return `${problem.coefficient}${problem.variable}${constant} = ${problem.rhs}`;
}

export function multiStepInverseText108(problem: MultiStepProblem108) {
  return problem.constant >= 0
    ? `Subtract ${problem.constant}`
    : `Add ${Math.abs(problem.constant)}`;
}

export function isMultiStepAnswerCorrect108(
  problem: MultiStepProblem108,
  value: number,
) {
  return (
    Number.isFinite(value) &&
    Math.abs(evaluateMultiStepProblem108(problem, value) - problem.rhs) < 1e-9
  );
}

export function validateMultiStepOperation108(
  payload: string,
  problemId: string,
  expected: MultiStepOperation108,
  completed: MultiStepOperation108[],
) {
  const matching = payload === `${problemId}:${expected}`;
  const ordered = expected === "constant" || completed.includes("constant");
  return payload.trim() !== "" && matching && ordered;
}

export function multiStepStageForOperation108(
  operation: MultiStepOperation108,
) {
  return operation === "constant" ? 1 : 2;
}
