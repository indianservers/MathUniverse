export type FractionEquationProblem109 = {
  id: string;
  variable: string;
  numeratorCoefficient: number;
  denominator: number;
  constant: number;
  rhs: number;
};

export const FRACTION_EXAMPLES_109: FractionEquationProblem109[] = [
  {
    id: "x-over-three-plus-two",
    variable: "x",
    numeratorCoefficient: 1,
    denominator: 3,
    constant: 2,
    rhs: 5,
  },
  {
    id: "two-x-over-five-minus-one",
    variable: "x",
    numeratorCoefficient: 2,
    denominator: 5,
    constant: -1,
    rhs: 3,
  },
  {
    id: "y-over-four-minus-one",
    variable: "y",
    numeratorCoefficient: 1,
    denominator: 4,
    constant: -1,
    rhs: 2,
  },
  {
    id: "three-z-over-two-plus-four",
    variable: "z",
    numeratorCoefficient: 3,
    denominator: 2,
    constant: 4,
    rhs: 10,
  },
];

export const FRACTION_PRACTICES_109: FractionEquationProblem109[] = [
  FRACTION_EXAMPLES_109[2],
  {
    id: "two-p-over-three-plus-one",
    variable: "p",
    numeratorCoefficient: 2,
    denominator: 3,
    constant: 1,
    rhs: 7,
  },
];

export function signedFractionTerm109(value: number) {
  return `${value >= 0 ? "+" : "−"} ${Math.abs(value)}`;
}

export function fractionNumeratorText109(problem: FractionEquationProblem109) {
  return `${problem.numeratorCoefficient === 1 ? "" : problem.numeratorCoefficient}${problem.variable}`;
}

export function fractionEquationText109(problem: FractionEquationProblem109) {
  return `${fractionNumeratorText109(problem)}/${problem.denominator} ${signedFractionTerm109(problem.constant)} = ${problem.rhs}`;
}

export function calculateFractionEquation109(
  problem: FractionEquationProblem109,
) {
  const lcd = problem.denominator;
  const clearedCoefficient = problem.numeratorCoefficient;
  const clearedConstant = problem.constant * lcd;
  const clearedRhs = problem.rhs * lcd;
  const isolatedNumerator = clearedRhs - clearedConstant;
  const solution = isolatedNumerator / clearedCoefficient;
  return {
    lcd,
    clearedCoefficient,
    clearedConstant,
    clearedRhs,
    isolatedNumerator,
    solution,
  };
}

export function evaluateFractionEquation109(
  problem: FractionEquationProblem109,
  value: number,
) {
  return (
    (problem.numeratorCoefficient * value) / problem.denominator +
    problem.constant
  );
}

export function isFractionPracticeCorrect109(
  problem: FractionEquationProblem109,
  lcd: number,
  answer: number,
) {
  return (
    lcd === problem.denominator &&
    Number.isFinite(answer) &&
    Math.abs(evaluateFractionEquation109(problem, answer) - problem.rhs) < 1e-9
  );
}

export function isFractionLcdDrop109(
  payload: string,
  problem: FractionEquationProblem109,
) {
  return (
    payload.trim() !== "" && payload === `${problem.id}:${problem.denominator}`
  );
}
