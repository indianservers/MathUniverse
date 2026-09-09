export type RationalExpression101 = {
  key: string;
  numerator: number;
  radicand: number;
  constant?: number;
  label: string;
};

export type RationalMultiplier101 = "matching" | "other" | "conjugate";

export const RATIONAL_EXPRESSIONS_101: RationalExpression101[] = [
  { key: "root2", numerator: 1, radicand: 2, label: "1/√2" },
  { key: "root3", numerator: 2, radicand: 3, label: "2/√3" },
  { key: "root5", numerator: 3, radicand: 5, label: "3/√5" },
  {
    key: "conjugate",
    numerator: 1,
    constant: 2,
    radicand: 3,
    label: "1/(2 + √3)",
  },
];

export const RATIONAL_PRACTICES_101 = [
  { numerator: 3, radicand: 5 },
  { numerator: 2, radicand: 7 },
  { numerator: 5, radicand: 3 },
];

export const cleanRationalDecimal101 = (value: number) =>
  Number(value.toFixed(4)).toString();

export function rationalisation101(
  expression: RationalExpression101,
  multiplier: RationalMultiplier101,
) {
  const isConjugate = expression.constant !== undefined;
  const otherRadicand = expression.radicand === 3 ? 2 : 3;
  const multiplierRadicand =
    multiplier === "matching" ? expression.radicand : otherRadicand;
  const denominatorProduct = expression.radicand * multiplierRadicand;
  const simpleValid =
    !isConjugate &&
    multiplier !== "conjugate" &&
    Number.isInteger(Math.sqrt(denominatorProduct));
  const conjugateValid = isConjugate && multiplier === "conjugate";
  const valid = simpleValid || conjugateValid;
  const multiplierLabel =
    multiplier === "conjugate"
      ? `${expression.constant ?? "a"} − √${expression.radicand}`
      : `√${multiplierRadicand}`;
  const denominatorLabel = isConjugate
    ? `${expression.constant} + √${expression.radicand}`
    : `√${expression.radicand}`;
  const denominatorResult = conjugateValid
    ? (expression.constant ?? 0) ** 2 - expression.radicand
    : simpleValid
      ? Math.sqrt(denominatorProduct)
      : `√${denominatorProduct}`;
  const resultTop = conjugateValid
    ? `${expression.numerator === 1 ? "" : expression.numerator}(${multiplierLabel})`
    : simpleValid
      ? `${expression.numerator === 1 ? "" : expression.numerator}√${multiplierRadicand}`
      : String(expression.numerator);
  const result = valid
    ? Number(denominatorResult) === 1
      ? resultTop.replace(/^\((.*)\)$/, "$1")
      : `${resultTop}/${denominatorResult}`
    : `${expression.numerator}/${denominatorLabel}`;
  const originalDecimal =
    expression.numerator /
    ((expression.constant ?? 0) + Math.sqrt(expression.radicand));
  const rationalDecimal = conjugateValid
    ? (expression.numerator *
        ((expression.constant ?? 0) - Math.sqrt(expression.radicand))) /
      Number(denominatorResult)
    : simpleValid
      ? (expression.numerator * Math.sqrt(multiplierRadicand)) /
        Number(denominatorResult)
      : originalDecimal;
  return {
    isConjugate,
    otherRadicand,
    multiplierRadicand,
    denominatorProduct,
    valid,
    multiplierLabel,
    denominatorLabel,
    denominatorResult,
    resultTop,
    result,
    originalDecimal,
    rationalDecimal,
    decimalMatch:
      valid && Math.abs(originalDecimal - rationalDecimal) < 0.0000001,
  };
}

export const rationalPracticeAnswer101 = (practice: {
  numerator: number;
  radicand: number;
}) => `${practice.numerator}√${practice.radicand}/${practice.radicand}`;

export function isRationalPracticeAnswer101(
  answer: string,
  practice: { numerator: number; radicand: number },
) {
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .replace(/\s/g, "")
      .replace(/sqrt\(?([0-9]+)\)?/g, "√$1")
      .replace(/\*/g, "");
  return normalize(answer) === normalize(rationalPracticeAnswer101(practice));
}

export const isRationalMultiplier101 = (
  value: string,
): value is RationalMultiplier101 =>
  value === "matching" || value === "other" || value === "conjugate";
