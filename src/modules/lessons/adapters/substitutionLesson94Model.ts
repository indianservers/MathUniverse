export type SubstitutionExpression94 = {
  label: string;
  variable: string;
  coefficient: number;
  power: number;
  constant: number;
  initialValue: number;
};

export type SubstitutionPractice94 = {
  expression: string;
  variable: string;
  value: number;
  substitution: string;
  operation: string;
  answer: number;
};

export const SUBSTITUTION_EXPRESSIONS_94: SubstitutionExpression94[] = [
  {
    label: "3x + 2",
    variable: "x",
    coefficient: 3,
    power: 1,
    constant: 2,
    initialValue: 5,
  },
  {
    label: "x² + 3",
    variable: "x",
    coefficient: 1,
    power: 2,
    constant: 3,
    initialValue: -2,
  },
  {
    label: "2y − 4",
    variable: "y",
    coefficient: 2,
    power: 1,
    constant: -4,
    initialValue: 6,
  },
];

export const SUBSTITUTION_PRACTICE_94: SubstitutionPractice94[] = [
  {
    expression: "4a − 1",
    variable: "a",
    value: 3,
    substitution: "4(3) − 1",
    operation: "12 − 1",
    answer: 11,
  },
  {
    expression: "2b + 5",
    variable: "b",
    value: 4,
    substitution: "2(4) + 5",
    operation: "8 + 5",
    answer: 13,
  },
  {
    expression: "c² + 1",
    variable: "c",
    value: -3,
    substitution: "(−3)² + 1",
    operation: "9 + 1",
    answer: 10,
  },
];

export const substitutionOperator94 = (constant: number) =>
  constant < 0 ? `− ${Math.abs(constant)}` : `+ ${constant}`;

export const calculateSubstitution94 = (
  model: SubstitutionExpression94,
  value: number,
) => model.coefficient * value ** model.power + model.constant;

export function substitutionDisplay94(
  model: SubstitutionExpression94,
  value: number,
  useBrackets: boolean,
) {
  const shownValue =
    value < 0
      ? useBrackets
        ? `(−${Math.abs(value)})`
        : `−${Math.abs(value)}`
      : `(${value})`;
  const variableTerm =
    model.power === 2
      ? `${model.coefficient === 1 ? "" : model.coefficient}${shownValue}²`
      : `${model.coefficient}${shownValue}`;
  const correct = calculateSubstitution94(model, value);
  const interpretedTerm =
    value < 0 && model.power % 2 === 0 && !useBrackets
      ? -model.coefficient * Math.abs(value) ** model.power
      : model.coefficient * value ** model.power;
  return {
    shownValue,
    substituted: `${variableTerm} ${substitutionOperator94(model.constant)}`,
    intermediate: interpretedTerm,
    interpretedResult: interpretedTerm + model.constant,
    correctResult: correct,
    preservesMeaning: interpretedTerm + model.constant === correct,
  };
}
