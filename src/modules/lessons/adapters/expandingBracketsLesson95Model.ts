export type ExpansionPractice95 = {
  factor: number;
  variable: string;
  constant: number;
};

export const EXPANSION_PRACTICES_95: ExpansionPractice95[] = [
  { factor: 3, variable: "y", constant: 5 },
  { factor: 2, variable: "a", constant: 4 },
  { factor: 5, variable: "m", constant: 2 },
  { factor: 3, variable: "n", constant: -2 },
];

export const expansionSign95 = (value: number) =>
  value < 0 ? `− ${Math.abs(value)}` : `+ ${value}`;

export const expansionBracket95 = (variable: string, constant: number) =>
  `(${variable} ${expansionSign95(constant)})`;

export const expandedExpression95 = (
  factor: number,
  variable: string,
  constant: number,
) => `${factor}${variable} ${expansionSign95(factor * constant)}`;

export function expansionValues95(
  factor: number,
  constant: number,
  checkValue: number,
) {
  const original = factor * (checkValue + constant);
  const distributed = factor * checkValue + factor * constant;
  return { original, distributed, equivalent: original === distributed };
}

export function isExpansionAnswer95(
  answer: string,
  factor: number,
  variable: string,
  constant: number,
) {
  const normalize = (value: string) =>
    value.replace(/\s/g, "").replace(/-/g, "−").toLowerCase();
  return (
    normalize(answer) ===
    normalize(expandedExpression95(factor, variable, constant))
  );
}
