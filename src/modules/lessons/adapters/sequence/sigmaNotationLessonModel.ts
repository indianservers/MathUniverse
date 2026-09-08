export type SigmaCoefficients = {
  ii: number;
  jj: number;
  ij: number;
  i: number;
  j: number;
  c: number;
};
export const DEFAULT_SIGMA_COEFFICIENTS: SigmaCoefficients = {
  ii: 1,
  jj: 0,
  ij: 0,
  i: 0,
  j: 0,
  c: 1,
};
export function parseSigmaSummand(source: string): SigmaCoefficients | null {
  const text = source
    .toLowerCase()
    .replaceAll(" ", "")
    .replaceAll("²", "^2")
    .replaceAll("*", "")
    .replace(/−/g, "-")
    .replace(/(?<!^)-/g, "+-");
  if (!text || /[^0-9ij+\-.^]/.test(text)) return null;
  const output = { ii: 0, jj: 0, ij: 0, i: 0, j: 0, c: 0 };
  for (const term of text.split("+").filter(Boolean)) {
    const add = (key: keyof SigmaCoefficients, token: string) => {
      const prefix = term.replace(token, "");
      output[key] += prefix === "" ? 1 : prefix === "-" ? -1 : Number(prefix);
    };
    if (term.includes("i^2")) add("ii", "i^2");
    else if (term.includes("j^2")) add("jj", "j^2");
    else if (term.includes("ij")) add("ij", "ij");
    else if (term.includes("i")) add("i", "i");
    else if (term.includes("j")) add("j", "j");
    else output.c += Number(term);
    if (Object.values(output).some((value) => !Number.isFinite(value)))
      return null;
  }
  return output;
}
export function evaluateSigmaSummand(
  coefficients: SigmaCoefficients,
  i: number,
  j = 0,
) {
  return (
    coefficients.ii * i * i +
    coefficients.jj * j * j +
    coefficients.ij * i * j +
    coefficients.i * i +
    coefficients.j * j +
    coefficients.c
  );
}
export function sigmaNotationAnalysis(
  lowerValue: number,
  upperValue: number,
  coefficients: SigmaCoefficients,
  nested = false,
  maxTerms = 50,
) {
  const lower = Math.round(Math.max(-1000, Math.min(1000, lowerValue))),
    requestedUpper = Math.round(Math.max(lower, Math.min(1000, upperValue))),
    upper = Math.min(requestedUpper, lower + Math.max(1, maxTerms) - 1),
    indexes = Array.from({ length: upper - lower + 1 }, (_, index) =>
      Number(lower + index),
    ),
    terms = indexes.map((i) =>
      nested
        ? Array.from({ length: Math.max(0, i) }, (_, index) =>
            evaluateSigmaSummand(coefficients, i, index + 1),
          ).reduce((sum, value) => sum + value, 0)
        : evaluateSigmaSummand(coefficients, i),
    ),
    partials = terms.reduce<number[]>(
      (values, value) => [...values, value + (values.at(-1) ?? 0)],
      [],
    ),
    minimum = Math.min(0, ...terms),
    maximum = Math.max(0, ...terms),
    padding = Math.max(1, (maximum - minimum) * 0.08),
    differences = (values: number[]) =>
      values.slice(1).map((value, index) => value - values[index]);
  let level = terms,
    degree = 0;
  while (level.length > 1 && degree < 4) {
    if (level.slice(1).every((value) => Math.abs(value - level[0]) < 1e-8))
      break;
    level = differences(level);
    degree += 1;
  }
  return {
    lower,
    upper,
    requestedUpper,
    truncated: upper !== requestedUpper,
    indexes,
    terms,
    partials,
    total: partials.at(-1) ?? 0,
    plotMin: minimum - padding,
    plotMax: maximum + padding,
    growth:
      degree === 0
        ? "Constant"
        : degree === 1
          ? "Linear"
          : degree === 2
            ? "Quadratic"
            : degree === 3
              ? "Cubic"
              : "Higher-order",
  };
}
