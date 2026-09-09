export type ParsedFactorPolynomial105 = {
  coefficients: number[];
  valid: boolean;
};

export type FactorDivision105 = {
  products: number[];
  sums: number[];
  quotient: number[];
  remainder: number;
};

export const FACTOR_PROBLEMS_105 = [
  { polynomial: "x² − 3x + 2", factor: "x − 1" },
  { polynomial: "x² − 5x + 6", factor: "x − 2" },
  { polynomial: "x² + x − 6", factor: "x + 3" },
] as const;

const superscripts: Record<string, string> = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
};
const superscriptByPower = ["⁰", "¹", "²", "³", "⁴", "⁵"];

export function parseFactorPolynomial105(
  source: string,
): ParsedFactorPolynomial105 {
  const terms = source
    .replace(/[⁰¹²³⁴⁵]/g, (value) => `^${superscripts[value]}`)
    .replaceAll("−", "-")
    .replace(/\s+/g, "")
    .replace(/-/g, "+-")
    .split("+")
    .filter(Boolean);
  const values = new Map<number, number>();

  for (const term of terms) {
    const variable = term.match(/^([+-]?)(\d*)x(?:\^([0-5]))?$/i);
    const constant = term.match(/^([+-]?\d+)$/);
    if (variable) {
      const sign = variable[1] === "-" ? -1 : 1;
      const coefficient = variable[2] ? sign * Number(variable[2]) : sign;
      const degree = variable[3] ? Number(variable[3]) : 1;
      values.set(degree, (values.get(degree) ?? 0) + coefficient);
    } else if (constant) {
      values.set(0, (values.get(0) ?? 0) + Number(constant[1]));
    } else {
      return { coefficients: [], valid: false };
    }
  }

  const degree = Math.max(0, ...values.keys());
  return {
    coefficients: Array.from(
      { length: degree + 1 },
      (_, index) => values.get(degree - index) ?? 0,
    ),
    valid: terms.length > 0 && degree > 0,
  };
}

export function parseCandidateFactor105(source: string) {
  const match = source
    .replaceAll("−", "-")
    .replace(/\s+/g, "")
    .match(/^x(?:([+-])(\d+))?$/i);
  return match
    ? {
        valid: true,
        root:
          match[1] === "+"
            ? -Number(match[2])
            : match[1] === "-"
              ? Number(match[2])
              : 0,
      }
    : { valid: false, root: 0 };
}

export function evaluateFactorPolynomial105(
  coefficients: number[],
  value: number,
) {
  return coefficients.reduce(
    (result, coefficient) => result * value + coefficient,
    0,
  );
}

export function divideByCandidateFactor105(
  coefficients: number[],
  root: number,
): FactorDivision105 {
  if (coefficients.length === 0) {
    return { products: [], sums: [], quotient: [], remainder: 0 };
  }
  const products = Array(coefficients.length).fill(0) as number[];
  const sums = Array(coefficients.length).fill(0) as number[];
  sums[0] = coefficients[0];
  for (let index = 1; index < coefficients.length; index += 1) {
    products[index] = sums[index - 1] * root;
    sums[index] = coefficients[index] + products[index];
  }
  return {
    products,
    sums,
    quotient: sums.slice(0, -1),
    remainder: sums.at(-1) ?? 0,
  };
}

export function formatFactorPolynomial105(coefficients: number[]) {
  const degree = coefficients.length - 1;
  const parts = coefficients.flatMap((coefficient, index) => {
    if (!coefficient) return [];
    const power = degree - index;
    const symbol =
      power === 0
        ? ""
        : power === 1
          ? "x"
          : `x${superscriptByPower[power] ?? `^${power}`}`;
    const magnitude =
      symbol && Math.abs(coefficient) === 1
        ? symbol
        : `${Math.abs(coefficient)}${symbol}`;
    return [{ coefficient, magnitude }];
  });
  return parts.length
    ? parts
        .map(
          (part, index) =>
            `${index === 0 ? (part.coefficient < 0 ? "−" : "") : part.coefficient < 0 ? " − " : " + "}${part.magnitude}`,
        )
        .join("")
    : "0";
}

export function factorSubstitutionTerms105(
  coefficients: number[],
  value: number,
) {
  const degree = coefficients.length - 1;
  return coefficients
    .map((coefficient, index) => coefficient * value ** (degree - index))
    .join(" + ")
    .replaceAll("+ -", "− ");
}

export function candidateFactorText105(root: number) {
  return root < 0 ? `x + ${Math.abs(root)}` : root === 0 ? "x" : `x − ${root}`;
}

export function factorTheoremVerdict105(
  polynomial: ParsedFactorPolynomial105,
  factor: { valid: boolean; root: number },
  testValue: number,
  evaluated: number,
  remainder: number,
) {
  return (
    polynomial.valid &&
    factor.valid &&
    testValue === factor.root &&
    evaluated === 0 &&
    remainder === 0
  );
}

export function complementaryRoot105(quotient: number[]) {
  return quotient.length === 2 && quotient[0] !== 0
    ? -quotient[1] / quotient[0]
    : Number.NaN;
}

export function isFactorDragPayload105(payload: string, expected: string) {
  return payload.trim() !== "" && payload === expected;
}
