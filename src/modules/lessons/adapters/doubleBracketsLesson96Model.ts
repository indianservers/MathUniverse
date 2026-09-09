export type DoubleBracketsChallenge96 = {
  variable: string;
  first: number;
  second: number;
};

export const DOUBLE_BRACKETS_CHALLENGES_96: DoubleBracketsChallenge96[] = [
  { variable: "y", first: 4, second: 1 },
  { variable: "a", first: 2, second: 5 },
  { variable: "m", first: 3, second: 2 },
  { variable: "p", first: -2, second: 5 },
];

const sign96 = (value: number) =>
  value < 0 ? `− ${Math.abs(value)}` : `+ ${value}`;

const signedTerm96 = (coefficient: number, term: string) => {
  const magnitude = Math.abs(coefficient);
  const value = `${magnitude === 1 ? "" : magnitude}${term}`;
  return coefficient < 0 ? `− ${value}` : `+ ${value}`;
};

export const binomial96 = (variable: string, constant: number) =>
  `(${variable} ${sign96(constant)})`;

export const doubleBracketsExpression96 = (
  variable: string,
  first: number,
  second: number,
) => `${binomial96(variable, first)}${binomial96(variable, second)}`;

export const fourProducts96 = (
  variable: string,
  first: number,
  second: number,
) => ({
  square: `${variable}²`,
  firstMiddle: `${second}${variable}`,
  secondMiddle: `${first}${variable}`,
  constant: first * second,
});

export const uncombinedExpression96 = (
  variable: string,
  first: number,
  second: number,
) => {
  const products = fourProducts96(variable, first, second);
  return `${products.square} ${signedTerm96(second, variable)} ${signedTerm96(first, variable)} ${sign96(products.constant)}`;
};

export const expandedExpression96 = (
  variable: string,
  first: number,
  second: number,
) => {
  const middle = first + second;
  const constant = first * second;
  const middlePart = middle === 0 ? "" : ` ${signedTerm96(middle, variable)}`;
  const constantPart = constant === 0 ? "" : ` ${sign96(constant)}`;
  return `${variable}²${middlePart}${constantPart}`;
};

export function substitutionProof96(
  first: number,
  second: number,
  value: number,
) {
  const original = (value + first) * (value + second);
  const expanded = value ** 2 + (first + second) * value + first * second;
  return { original, expanded, equivalent: original === expanded };
}

export function isDoubleBracketsAnswer96(
  answer: string,
  variable: string,
  first: number,
  second: number,
) {
  const normalize = (value: string) =>
    value
      .replace(/\s/g, "")
      .replace(/-/g, "−")
      .replace(new RegExp(`${variable}\\^2`, "gi"), `${variable}²`)
      .toLowerCase();
  return (
    normalize(answer) ===
    normalize(expandedExpression96(variable, first, second))
  );
}
