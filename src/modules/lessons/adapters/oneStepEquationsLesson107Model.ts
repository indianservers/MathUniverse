export type OneStepEquation107 = {
  id: string;
  label: string;
  inverse: string;
  inverseSymbol: string;
  coefficient: number;
  constant: number;
  right: number;
  leftVariables: number;
  leftUnits: number;
  variableLabel?: string;
  unitTone?: "negative";
};

export type OneStepPractice107 = {
  id: string;
  label: string;
  variable: string;
  coefficient: number;
  constant: number;
  right: number;
};

export const ONE_STEP_EQUATIONS_107: OneStepEquation107[] = [
  {
    id: "add-five",
    label: "x + 5 = 12",
    inverse: "Subtract 5",
    inverseSymbol: "− 5",
    coefficient: 1,
    constant: 5,
    right: 12,
    leftVariables: 1,
    leftUnits: 5,
  },
  {
    id: "subtract-four",
    label: "x − 4 = 9",
    inverse: "Add 4",
    inverseSymbol: "+ 4",
    coefficient: 1,
    constant: -4,
    right: 9,
    leftVariables: 1,
    leftUnits: 4,
    unitTone: "negative",
  },
  {
    id: "triple",
    label: "3x = 18",
    inverse: "Divide by 3",
    inverseSymbol: "÷ 3",
    coefficient: 3,
    constant: 0,
    right: 18,
    leftVariables: 3,
    leftUnits: 0,
  },
  {
    id: "quarter",
    label: "x ÷ 4 = 5",
    inverse: "Multiply by 4",
    inverseSymbol: "× 4",
    coefficient: 0.25,
    constant: 0,
    right: 5,
    leftVariables: 1,
    leftUnits: 0,
    variableLabel: "x/4",
  },
];

export const ONE_STEP_PRACTICES_107: OneStepPractice107[] = [
  {
    id: "y-minus-four",
    label: "y − 4 = 9",
    variable: "y",
    coefficient: 1,
    constant: -4,
    right: 9,
  },
  {
    id: "p-plus-six",
    label: "p + 6 = 15",
    variable: "p",
    coefficient: 1,
    constant: 6,
    right: 15,
  },
];

export function solveOneStepEquation107(
  equation: Pick<OneStepEquation107, "coefficient" | "constant" | "right">,
) {
  return (equation.right - equation.constant) / equation.coefficient;
}

export function evaluateOneStepEquation107(
  equation: Pick<OneStepEquation107, "coefficient" | "constant">,
  value: number,
) {
  return equation.coefficient * value + equation.constant;
}

export function solveOneStepPractice107(practice: OneStepPractice107) {
  return (practice.right - practice.constant) / practice.coefficient;
}

export function evaluateOneStepPractice107(
  practice: OneStepPractice107,
  value: number,
) {
  return practice.coefficient * value + practice.constant;
}

export function isOneStepAnswerCorrect107(
  equation: Pick<OneStepEquation107, "coefficient" | "constant" | "right">,
  value: number,
) {
  return (
    Number.isFinite(value) &&
    Math.abs(evaluateOneStepEquation107(equation, value) - equation.right) <
      1e-9
  );
}

export function isOneStepOperationDrop107(payload: string, equationId: string) {
  return payload.trim() !== "" && payload === equationId;
}

export function shouldResolveBalance107(
  applyBoth: boolean,
  operationDrops: string[],
) {
  return (
    applyBoth ||
    (operationDrops.includes("left") && operationDrops.includes("right"))
  );
}
