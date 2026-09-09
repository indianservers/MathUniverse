export type ParsedRemainderPolynomial104 = {
  coefficients: number[];
  valid: boolean;
};

export type RemainderDivision104 = {
  products: number[];
  sums: number[];
  quotient: number[];
  remainder: number;
};

export const REMAINDER_PRACTICES_104 = [
  { polynomial: "x² − 4x + 1", divisor: "x − 2" },
  { polynomial: "x³ + x² − 4x − 4", divisor: "x + 1" },
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

export function parseRemainderPolynomial104(
  source: string,
): ParsedRemainderPolynomial104 {
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

export function parseRemainderDivisor104(source: string) {
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

export function evaluateRemainderPolynomial104(
  coefficients: number[],
  value: number,
) {
  return coefficients.reduce(
    (result, coefficient) => result * value + coefficient,
    0,
  );
}

export function syntheticRemainderDivision104(
  coefficients: number[],
  root: number,
): RemainderDivision104 {
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

export function formatRemainderPolynomial104(coefficients: number[]) {
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

export function remainderSubstitutionText104(
  coefficients: number[],
  value: number,
) {
  const degree = coefficients.length - 1;
  return coefficients
    .map((coefficient, index) => {
      const power = degree - index;
      if (power === 0) return `${coefficient}`;
      const variable =
        power === 1
          ? `(${value})`
          : `(${value})${superscriptByPower[power] ?? `^${power}`}`;
      return `${coefficient === 1 ? "" : coefficient}${variable}`;
    })
    .join(" + ")
    .replaceAll("+ -", "− ");
}

export function remainderEvaluatedTerms104(
  coefficients: number[],
  value: number,
) {
  const degree = coefficients.length - 1;
  return coefficients
    .map((coefficient, index) => coefficient * value ** (degree - index))
    .join(" + ")
    .replaceAll("+ -", "− ");
}

export function remainderReconstructionMatches104(
  coefficients: number[],
  root: number,
  quotient: number[],
  remainder: number,
) {
  if (coefficients.length === 0) return false;
  const result = Array(coefficients.length).fill(0) as number[];
  quotient.forEach((coefficient, index) => {
    result[index] += coefficient;
    result[index + 1] -= root * coefficient;
  });
  result[result.length - 1] += remainder;
  return result.every(
    (coefficient, index) => coefficient === coefficients[index],
  );
}

export function remainderMethodsAgree104(
  polynomial: ParsedRemainderPolynomial104,
  divisor: { valid: boolean; root: number },
  valueA: number,
  evaluated: number,
  remainder: number,
) {
  return (
    polynomial.valid &&
    divisor.valid &&
    valueA === divisor.root &&
    evaluated === remainder
  );
}

export function isRemainderPracticeCorrect104(
  polynomial: ParsedRemainderPolynomial104,
  divisor: { valid: boolean; root: number },
  valueA: number,
  evaluated: number,
  remainder: number,
  answer: number,
) {
  return (
    remainderMethodsAgree104(
      polynomial,
      divisor,
      valueA,
      evaluated,
      remainder,
    ) && answer === remainder
  );
}

export function isRemainderValueDrop104(payload: string, valueA: number) {
  return payload.trim() !== "" && Number(payload) === valueA;
}
