export type SimultaneousEquation112 = { a: number; b: number; c: number };
export type SimultaneousSystem112 = {
  id: string;
  first: SimultaneousEquation112;
  second: SimultaneousEquation112;
  multipliers: [number, number];
};

export const SIMULTANEOUS_SYSTEMS_112: SimultaneousSystem112[] = [
  {
    id: "sum-difference-seven-one",
    first: { a: 1, b: 1, c: 7 },
    second: { a: 1, b: -1, c: 1 },
    multipliers: [1, 1],
  },
  {
    id: "two-x-plus-y",
    first: { a: 2, b: 1, c: 9 },
    second: { a: 1, b: -1, c: 3 },
    multipliers: [1, 1],
  },
  {
    id: "subtract-parallel-y",
    first: { a: 3, b: 1, c: 11 },
    second: { a: 1, b: 1, c: 7 },
    multipliers: [1, -1],
  },
  {
    id: "double-second",
    first: { a: 1, b: 2, c: 8 },
    second: { a: 1, b: -1, c: 2 },
    multipliers: [1, 2],
  },
];

export const SIMULTANEOUS_PRACTICES_112: SimultaneousSystem112[] = [
  {
    id: "practice-five-one",
    first: { a: 1, b: 1, c: 5 },
    second: { a: 1, b: -1, c: 1 },
    multipliers: [1, 1],
  },
  {
    id: "practice-eight-two",
    first: { a: 1, b: 1, c: 8 },
    second: { a: 1, b: -1, c: 2 },
    multipliers: [1, 1],
  },
];

export const roundSimultaneous112 = (value: number) =>
  Math.round(value * 100) / 100;

export function simultaneousCoefficient112(
  value: number,
  variable: string,
  first = false,
) {
  if (value === 0) return "";
  const magnitude = Math.abs(value) === 1 ? "" : Math.abs(value);
  if (first) return `${value < 0 ? "−" : ""}${magnitude}${variable}`;
  return `${value < 0 ? " − " : " + "}${magnitude}${variable}`;
}

export function simultaneousEquationText112(equation: SimultaneousEquation112) {
  return `${simultaneousCoefficient112(equation.a, "x", true)}${simultaneousCoefficient112(equation.b, "y", equation.a === 0)} = ${equation.c}`;
}

export function solveSimultaneousSystem112(problem: SimultaneousSystem112) {
  const determinant =
    problem.first.a * problem.second.b - problem.second.a * problem.first.b;
  const x = roundSimultaneous112(
    (problem.first.c * problem.second.b - problem.second.c * problem.first.b) /
      determinant,
  );
  const y = roundSimultaneous112(
    (problem.first.a * problem.second.c - problem.second.a * problem.first.c) /
      determinant,
  );
  const firstCheck = roundSimultaneous112(
    problem.first.a * x + problem.first.b * y,
  );
  const secondCheck = roundSimultaneous112(
    problem.second.a * x + problem.second.b * y,
  );
  return {
    determinant,
    x,
    y,
    firstCheck,
    secondCheck,
    valid:
      determinant !== 0 &&
      firstCheck === problem.first.c &&
      secondCheck === problem.second.c,
  };
}

export function scaleSimultaneousEquation112(
  equation: SimultaneousEquation112,
  multiplier: number,
): SimultaneousEquation112 {
  return {
    a: equation.a * multiplier,
    b: equation.b * multiplier,
    c: equation.c * multiplier,
  };
}

export function combineSimultaneousSystem112(problem: SimultaneousSystem112) {
  const first = scaleSimultaneousEquation112(
    problem.first,
    problem.multipliers[0],
  );
  const second = scaleSimultaneousEquation112(
    problem.second,
    problem.multipliers[1],
  );
  return {
    first,
    second,
    combined: {
      a: first.a + second.a,
      b: first.b + second.b,
      c: first.c + second.c,
    },
  };
}

export function simultaneousOperationLabel112(problem: SimultaneousSystem112) {
  const [, second] = problem.multipliers;
  if (second === 1) return "Add equations";
  if (second === -1) return "Subtract equation 2";
  return `Add ${second} × equation 2`;
}

export function simultaneousOperationPayload112(
  problem: SimultaneousSystem112,
  method: string,
) {
  return `${problem.id}:${method}`;
}

export function isSimultaneousOperationDrop112(
  payload: string,
  problem: SimultaneousSystem112,
  method: string,
) {
  return (
    payload.trim() !== "" &&
    payload === simultaneousOperationPayload112(problem, method)
  );
}

export function isSimultaneousPracticeCorrect112(
  problem: SimultaneousSystem112,
  x: number,
  y: number,
) {
  const solution = solveSimultaneousSystem112(problem);
  return (
    Number.isFinite(x) &&
    Number.isFinite(y) &&
    Math.abs(x - solution.x) < 1e-9 &&
    Math.abs(y - solution.y) < 1e-9
  );
}
