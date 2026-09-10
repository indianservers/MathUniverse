export type AbsoluteValueEquation121 = {
  center: number;
  distance: number;
  variable: string;
};

export const ABSOLUTE_VALUE_EXAMPLES_121: AbsoluteValueEquation121[] = [
  { center: 3, distance: 2, variable: "x" },
  { center: -4, distance: 3, variable: "y" },
  { center: 1, distance: -2, variable: "x" },
];

export const ABSOLUTE_VALUE_PRACTICE_121: AbsoluteValueEquation121 = {
  center: -4,
  distance: 3,
  variable: "y",
};

export function solveAbsoluteValueEquation121(
  equation: AbsoluteValueEquation121,
) {
  const solvable = equation.distance >= 0;
  const left = solvable ? equation.center - equation.distance : Number.NaN;
  const right = solvable ? equation.center + equation.distance : Number.NaN;
  const leftCheck = solvable
    ? Math.abs(left - equation.center) === equation.distance
    : false;
  const rightCheck = solvable
    ? Math.abs(right - equation.center) === equation.distance
    : false;
  return {
    solvable,
    left,
    right,
    leftCheck,
    rightCheck,
    valid: solvable && leftCheck && rightCheck,
  };
}

export function isAbsoluteValuePracticeCorrect121(
  first: number,
  second: number,
) {
  if (!Number.isFinite(first) || !Number.isFinite(second)) return false;
  const expected = solveAbsoluteValueEquation121(ABSOLUTE_VALUE_PRACTICE_121);
  const answers = [first, second].sort((left, right) => left - right);
  return answers[0] === expected.left && answers[1] === expected.right;
}
