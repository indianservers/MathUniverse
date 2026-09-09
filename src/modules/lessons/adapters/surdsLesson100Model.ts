export const isPerfectSquare100 = (value: number) =>
  value >= 0 && Number.isInteger(Math.sqrt(value));

export const cleanSurdDecimal100 = (value: number) =>
  Number(value.toFixed(3)).toString();

export function divisors100(value: number) {
  const result: number[] = [];
  for (let candidate = 1; candidate <= value; candidate += 1) {
    if (value % candidate === 0) result.push(candidate);
  }
  return result;
}

export function largestSquareFactor100(value: number) {
  return divisors100(value).filter(isPerfectSquare100).at(-1) ?? 1;
}

export function squareFactorCandidates100(value: number, selected: number) {
  const factors = divisors100(value).filter((factor) => factor < value);
  if (factors.length <= 5) return factors;
  const preferred = [
    ...factors.slice(0, 4),
    largestSquareFactor100(value),
    selected,
  ];
  return [...new Set(preferred)].sort((a, b) => a - b).slice(-5);
}

export function formatSurd100(coefficient: number, residual: number) {
  if (residual === 1) return String(coefficient);
  return `${coefficient === 1 ? "" : coefficient}√${residual}`;
}

export function simplifySurd100(radicand: number, squareFactor: number) {
  const validSquareFactor =
    squareFactor > 0 &&
    radicand % squareFactor === 0 &&
    isPerfectSquare100(squareFactor);
  const quotient =
    squareFactor > 0 && Number.isInteger(radicand / squareFactor)
      ? radicand / squareFactor
      : radicand;
  const coefficient = validSquareFactor ? Math.sqrt(squareFactor) : 1;
  const residual = validSquareFactor ? quotient : radicand;
  const result = formatSurd100(coefficient, residual);
  const originalDecimal = Math.sqrt(radicand);
  const simplifiedDecimal = coefficient * Math.sqrt(residual);
  return {
    quotient,
    validSquareFactor,
    coefficient,
    residual,
    result,
    originalDecimal,
    simplifiedDecimal,
    decimalMatch:
      validSquareFactor &&
      Math.abs(originalDecimal - simplifiedDecimal) < 0.0000001,
  };
}

export const isSurdPracticeCorrect100 = (choice: string) => choice === "C";

export function factorFromSurdDrop100(
  factorPayload: string,
  radicandPayload: string,
  radicand: number,
) {
  const factor = Number(factorPayload);
  if (Number.isFinite(factor) && factor > 0 && radicand % factor === 0) {
    return factor;
  }
  if (Number(radicandPayload) === radicand) {
    return largestSquareFactor100(radicand);
  }
  return null;
}
