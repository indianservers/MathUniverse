export type ParsedPolynomial103 = { coefficients: number[]; valid: boolean };
export type SyntheticPractice103 = { polynomial: string; divisor: string };

export const SYNTHETIC_PRACTICES_103: SyntheticPractice103[] = [
  { polynomial: "x² + 7x + 12", divisor: "x + 3" },
  { polynomial: "x³ − 2x² − 5x + 6", divisor: "x − 1" },
];

const SUPERSCRIPTS_103: Record<string, string> = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
};

export function parsePolynomial103(source: string): ParsedPolynomial103 {
  const normalized = source
    .replace(/[⁰¹²³⁴⁵]/g, (value) => `^${SUPERSCRIPTS_103[value]}`)
    .replaceAll("−", "-")
    .replace(/\s+/g, "")
    .replace(/-/g, "+-");
  const terms = normalized.split("+").filter(Boolean);
  const map = new Map<number, number>();
  for (const term of terms) {
    const variable = term.match(/^([+-]?)(\d*)x(?:\^([0-5]))?$/i);
    const constant = term.match(/^([+-]?\d+)$/);
    if (variable) {
      const sign = variable[1] === "-" ? -1 : 1;
      const coefficient = variable[2] ? Number(variable[2]) * sign : sign;
      const degree = variable[3] ? Number(variable[3]) : 1;
      map.set(degree, (map.get(degree) ?? 0) + coefficient);
    } else if (constant) {
      map.set(0, (map.get(0) ?? 0) + Number(constant[1]));
    } else return { coefficients: [], valid: false };
  }
  const degree = Math.max(0, ...map.keys());
  return {
    coefficients: Array.from(
      { length: degree + 1 },
      (_, index) => map.get(degree - index) ?? 0,
    ),
    valid: terms.length > 0 && degree > 0,
  };
}

export function parseSyntheticDivisor103(source: string) {
  const match = source
    .replaceAll("−", "-")
    .replace(/\s+/g, "")
    .match(/^x(?:([+-])(\d+))?$/i);
  if (!match) return { synthetic: 0, valid: false };
  if (!match[1]) return { synthetic: 0, valid: true };
  return {
    synthetic: match[1] === "+" ? -Number(match[2]) : Number(match[2]),
    valid: true,
  };
}

export function syntheticDivide103(coefficients: number[], synthetic: number) {
  const products = Array(coefficients.length).fill(0) as number[];
  const sums = Array(coefficients.length).fill(0) as number[];
  sums[0] = coefficients[0] ?? 0;
  for (let index = 1; index < coefficients.length; index += 1) {
    products[index] = sums[index - 1] * synthetic;
    sums[index] = coefficients[index] + products[index];
  }
  return {
    products,
    sums,
    quotient: sums.slice(0, -1),
    remainder: sums.at(-1) ?? 0,
  };
}

export function formatSyntheticPolynomial103(
  coefficients: number[],
  variable = "x",
) {
  const degree = coefficients.length - 1;
  const terms = coefficients.flatMap((coefficient, index) => {
    if (coefficient === 0) return [];
    const power = degree - index;
    const symbol =
      power === 0
        ? ""
        : power === 1
          ? variable
          : `${variable}${["⁰", "¹", "²", "³", "⁴", "⁵"][power]}`;
    const absolute = Math.abs(coefficient);
    return [
      {
        coefficient,
        magnitude: symbol && absolute === 1 ? symbol : `${absolute}${symbol}`,
      },
    ];
  });
  if (!terms.length) return "0";
  return terms
    .map(
      (term, index) =>
        `${index === 0 ? (term.coefficient < 0 ? "−" : "") : term.coefficient < 0 ? " − " : " + "}${term.magnitude}`,
    )
    .join("");
}

export function syntheticExpansionMatches103(
  coefficients: number[],
  synthetic: number,
  quotient: number[],
  remainder: number,
) {
  const rebuilt = Array(coefficients.length).fill(0) as number[];
  quotient.forEach((coefficient, index) => {
    rebuilt[index] += coefficient;
    rebuilt[index + 1] -= synthetic * coefficient;
  });
  rebuilt[rebuilt.length - 1] += remainder;
  return rebuilt.every(
    (coefficient, index) => coefficient === coefficients[index],
  );
}

export function isSyntheticPracticeCorrect103(
  products: number[],
  sums: number[],
  quotient: number[],
  remainder: number,
  expected: ReturnType<typeof syntheticDivide103>,
) {
  return (
    products.every((value, index) => value === expected.products[index + 1]) &&
    sums.every((value, index) => value === expected.sums[index]) &&
    quotient.every((value, index) => value === expected.quotient[index]) &&
    remainder === expected.remainder
  );
}

export const isSyntheticDrop103 = (payload: string, expected: number) =>
  payload.trim() !== "" && Number(payload) === expected;
