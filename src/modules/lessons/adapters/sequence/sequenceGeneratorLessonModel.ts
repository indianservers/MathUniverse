export type SequenceCoefficients = { a: number; b: number; c: number };
export type SequenceDefinition =
  | { type: "explicit"; coefficients: SequenceCoefficients }
  | { type: "recursive"; start: number; difference: number };

const clean = (value: number) => Number(value.toFixed(8));

export function parseSequencePolynomial(
  source: string,
): SequenceCoefficients | null {
  const text = source
    .toLowerCase()
    .replaceAll(" ", "")
    .replaceAll("²", "^2")
    .replace(/−/g, "-")
    .replace(/(?<!^)-/g, "+-");
  if (!text || /[^0-9n+\-.*^]/.test(text)) return null;
  const result = { a: 0, b: 0, c: 0 };
  for (const raw of text.split("+").filter(Boolean)) {
    const term = raw.replaceAll("*", "");
    if (term.includes("n^2")) {
      const prefix = term.replace("n^2", "");
      result.a += prefix === "" ? 1 : prefix === "-" ? -1 : Number(prefix);
    } else if (term.includes("n")) {
      const prefix = term.replace("n", "");
      result.b += prefix === "" ? 1 : prefix === "-" ? -1 : Number(prefix);
    } else result.c += Number(term);
    if (Object.values(result).some((value) => !Number.isFinite(value)))
      return null;
  }
  return result;
}

export function formatSequencePolynomial(value: SequenceCoefficients) {
  return `${clean(value.a)}n² ${value.b < 0 ? "−" : "+"} ${Math.abs(clean(value.b))}n ${value.c < 0 ? "−" : "+"} ${Math.abs(clean(value.c))}`;
}

export function generateSequence(
  definition: SequenceDefinition,
  firstValue: number,
  lastValue: number,
  stepValue: number,
) {
  const first = Math.round(firstValue),
    last = Math.round(lastValue),
    step = Math.max(1, Math.round(stepValue)),
    indexes: number[] = [];
  for (let n = first; n <= last && indexes.length < 20; n += step)
    indexes.push(n);
  const terms = indexes.map((n, index) =>
    definition.type === "explicit"
      ? definition.coefficients.a * n * n +
        definition.coefficients.b * n +
        definition.coefficients.c
      : definition.start + index * definition.difference,
  );
  const firstDifferences = terms.map((value, index) =>
    index ? value - terms[index - 1] : Number.NaN,
  );
  const secondDifferences = firstDifferences.map((value, index) =>
    index > 1 ? value - firstDifferences[index - 1] : Number.NaN,
  );
  const ratios = terms.map((value, index) =>
    index && terms[index - 1] !== 0 ? value / terms[index - 1] : Number.NaN,
  );
  const cumulativeSums = terms.reduce<number[]>(
    (values, value) => [...values, value + (values.at(-1) ?? 0)],
    [],
  );
  const constant = (values: number[]) =>
    values.length > 0 &&
    values.every((value) => Math.abs(value - values[0]) < 1e-8);
  const constantFirst = constant(firstDifferences.slice(1));
  const constantSecond = constant(secondDifferences.slice(2));
  const constantRatio = constant(ratios.slice(1));
  const classification = constantFirst
    ? "Arithmetic sequence"
    : constantSecond
      ? "Quadratic sequence"
      : constantRatio
        ? "Geometric sequence"
        : "General sequence";
  return {
    indexes,
    terms,
    firstDifferences,
    secondDifferences,
    ratios,
    cumulativeSums,
    constantFirst,
    constantSecond,
    constantRatio,
    classification,
  };
}
