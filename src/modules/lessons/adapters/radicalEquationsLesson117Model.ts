export type RadicalProblem117 = {
  offset: number;
  right: number;
  variable: string;
};
export type RadicalSolution117 = {
  candidate: number;
  boundary: number;
  radicand: number;
  principalRoot: number;
  valid: boolean;
  status: "valid" | "extraneous";
};

export const RADICAL_PROBLEMS_117: RadicalProblem117[] = [
  { offset: 1, right: 4, variable: "x" },
  { offset: 4, right: 5, variable: "x" },
  { offset: -3, right: 6, variable: "x" },
  { offset: 2, right: 3, variable: "x" },
];

export const RADICAL_PRACTICES_117: RadicalProblem117[] = [
  { offset: -2, right: 5, variable: "y" },
  { offset: 3, right: 4, variable: "z" },
  { offset: -5, right: 6, variable: "t" },
];

export function radicalInsideText117({ variable, offset }: RadicalProblem117) {
  return `${variable} ${offset < 0 ? "−" : "+"} ${Math.abs(offset)}`;
}

export function solveRadicalEquation117(
  problem: RadicalProblem117,
): RadicalSolution117 {
  const candidate = problem.right * problem.right - problem.offset;
  const boundary = -problem.offset;
  const radicand = candidate + problem.offset;
  const principalRoot = Math.sqrt(radicand);
  const valid =
    candidate >= boundary &&
    problem.right >= 0 &&
    Math.abs(principalRoot - problem.right) < 1e-9;
  return {
    candidate,
    boundary,
    radicand,
    principalRoot,
    valid,
    status: valid ? "valid" : "extraneous",
  };
}

export function radicalSquarePayload117(problem: RadicalProblem117) {
  return `${problem.variable}:${problem.offset}:${problem.right}`;
}

export function isRadicalSquareDrop117(
  payload: string,
  problem: RadicalProblem117,
) {
  return payload.trim() !== "" && payload === radicalSquarePayload117(problem);
}

export function isRadicalPracticeCorrect117(
  problem: RadicalProblem117,
  answer: number,
) {
  const solution = solveRadicalEquation117(problem);
  return (
    solution.valid &&
    Number.isFinite(answer) &&
    Math.abs(answer - solution.candidate) < 1e-9
  );
}
