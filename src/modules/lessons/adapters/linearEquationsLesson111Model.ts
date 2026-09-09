export type LinearProblem111 = {
  id: string;
  variable: string;
  a: number;
  b: number;
  c: number;
};

export const LINEAR_PROBLEMS_111: LinearProblem111[] = [
  { id: "four-x-plus-one", variable: "x", a: 4, b: 1, c: 13 },
  { id: "three-x-minus-two", variable: "x", a: 3, b: -2, c: 10 },
  { id: "two-x-plus-five", variable: "x", a: 2, b: 5, c: 17 },
  { id: "negative-two-x-plus-seven", variable: "x", a: -2, b: 7, c: 1 },
];

export const LINEAR_PRACTICES_111: LinearProblem111[] = [
  { id: "two-y-minus-five", variable: "y", a: 2, b: -5, c: 9 },
  { id: "three-p-plus-four", variable: "p", a: 3, b: 4, c: 19 },
];

export function signedLinearTerm111(value: number) {
  return value >= 0 ? `+ ${value}` : `− ${Math.abs(value)}`;
}

export function linearEquationText111(problem: LinearProblem111) {
  return `${problem.a}${problem.variable} ${signedLinearTerm111(problem.b)} = ${problem.c}`;
}

export function linearGraphText111(problem: LinearProblem111) {
  return `y = ${problem.a}${problem.variable} ${signedLinearTerm111(problem.b)}`;
}

export function solveLinearEquation111(problem: LinearProblem111) {
  const intermediate = problem.c - problem.b;
  const solution = intermediate / problem.a;
  const checkValue = problem.a * solution + problem.b;
  return {
    intermediate,
    solution,
    checkValue,
    correct:
      Number.isFinite(solution) && Math.abs(checkValue - problem.c) < 1e-9,
  };
}

export function inverseLinearOperation111(problem: LinearProblem111) {
  return problem.b >= 0
    ? `Subtract ${problem.b}`
    : `Add ${Math.abs(problem.b)}`;
}

export function linearOperationPayload111(
  problem: LinearProblem111,
  operation: "constant" | "coefficient",
) {
  return `${problem.id}:${operation}`;
}

export function isLinearOperationDrop111(
  payload: string,
  problem: LinearProblem111,
  operation: "constant" | "coefficient",
) {
  return (
    payload.trim() !== "" &&
    payload === linearOperationPayload111(problem, operation)
  );
}

export function evaluateLinearGraph111(problem: LinearProblem111, x: number) {
  return problem.a * x + problem.b;
}

export function isLinearPracticeCorrect111(
  problem: LinearProblem111,
  answer: number,
) {
  return (
    Number.isFinite(answer) &&
    Math.abs(answer - solveLinearEquation111(problem).solution) < 1e-9
  );
}
