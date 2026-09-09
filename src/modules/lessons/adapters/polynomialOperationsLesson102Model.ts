export type PolynomialOperation102 = "add" | "subtract" | "multiply";
export type PolynomialCoefficients102 = Record<number, number>;
export type PolynomialTile102 = {
  id: string;
  row: "A" | "B";
  degree: number;
  coefficient: number;
};

export const INITIAL_POLYNOMIAL_A_102: PolynomialCoefficients102 = {
  2: 1,
  1: 3,
  0: 2,
};
export const INITIAL_POLYNOMIAL_B_102: PolynomialCoefficients102 = {
  2: 0,
  1: 2,
  0: 3,
};

export const POLYNOMIAL_PRACTICES_102 = [
  {
    a: { 2: 2, 1: 1, 0: 4 },
    b: { 2: 3, 1: 5, 0: -1 },
    answer: [5, 6, 3],
  },
  {
    a: { 2: 1, 1: -2, 0: 3 },
    b: { 2: 2, 1: 4, 0: 1 },
    answer: [3, 2, 4],
  },
];

export function calculatePolynomial102(
  a: PolynomialCoefficients102,
  b: PolynomialCoefficients102,
  operation: PolynomialOperation102,
): PolynomialCoefficients102 {
  if (operation !== "multiply") {
    const sign = operation === "add" ? 1 : -1;
    return Object.fromEntries(
      [0, 1, 2].map((degree) => [
        degree,
        (a[degree] ?? 0) + sign * (b[degree] ?? 0),
      ]),
    );
  }
  const result: PolynomialCoefficients102 = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const [aDegree, aCoefficient] of Object.entries(a)) {
    for (const [bDegree, bCoefficient] of Object.entries(b)) {
      result[Number(aDegree) + Number(bDegree)] += aCoefficient * bCoefficient;
    }
  }
  return result;
}

export function evaluatePolynomial102(
  coefficients: PolynomialCoefficients102,
  value: number,
) {
  return Object.entries(coefficients).reduce(
    (total, [degree, coefficient]) =>
      total + coefficient * value ** Number(degree),
    0,
  );
}

export function formatPolynomial102(
  coefficients: PolynomialCoefficients102,
  variable = "x",
) {
  const superscripts = ["⁰", "¹", "²", "³", "⁴"];
  const parts: string[] = [];
  for (const degree of Object.keys(coefficients)
    .map(Number)
    .sort((a, b) => b - a)) {
    const coefficient = coefficients[degree] ?? 0;
    if (!coefficient) continue;
    const magnitude = Math.abs(coefficient);
    const variablePart =
      degree === 0
        ? ""
        : degree === 1
          ? variable
          : `${variable}${superscripts[degree] ?? `^${degree}`}`;
    const term = `${degree > 0 && magnitude === 1 ? "" : magnitude}${variablePart}`;
    parts.push(
      parts.length
        ? `${coefficient < 0 ? "−" : "+"} ${term}`
        : coefficient < 0
          ? `−${term}`
          : term,
    );
  }
  return parts.join(" ") || "0";
}

export function polynomialTileLabel102(
  coefficient: number,
  degree: number,
  variable = "x",
  showOne = true,
) {
  if (!coefficient) return "—";
  const magnitude =
    Math.abs(coefficient) === 1 && degree > 0
      ? showOne
        ? "1"
        : ""
      : Math.abs(coefficient);
  return `${coefficient > 0 ? "+" : "−"}${magnitude}${degree === 0 ? "" : degree === 1 ? variable : `${variable}²`}`;
}

export function operationValues102(
  a: PolynomialCoefficients102,
  b: PolynomialCoefficients102,
  operation: PolynomialOperation102,
  value: number,
) {
  const result = calculatePolynomial102(a, b, operation);
  const aValue = evaluatePolynomial102(a, value);
  const bValue = evaluatePolynomial102(b, value);
  const left =
    operation === "add"
      ? aValue + bValue
      : operation === "subtract"
        ? aValue - bValue
        : aValue * bValue;
  const right = evaluatePolynomial102(result, value);
  return { result, left, right, equal: left === right };
}

export const isPolynomialPracticeCorrect102 = (
  answer: number[],
  expected: number[],
) => expected.every((coefficient, index) => answer[index] === coefficient);

export function parsePolynomialTile102(raw: string): PolynomialTile102 | null {
  try {
    const value = JSON.parse(raw) as Partial<PolynomialTile102>;
    if (
      typeof value.id !== "string" ||
      (value.row !== "A" && value.row !== "B") ||
      !Number.isInteger(value.degree) ||
      typeof value.coefficient !== "number" ||
      !Number.isFinite(value.coefficient)
    )
      return null;
    return value as PolynomialTile102;
  } catch {
    return null;
  }
}
