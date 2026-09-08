export type ConvergenceSeriesType =
  "Geometric" | "p-Series" | "Alternating" | "Factorial" | "Custom";

export type ConvergenceSeriesParameters = {
  type: ConvergenceSeriesType;
  first: number;
  ratio: number;
  power: number;
  scale: number;
  shift: number;
};

const clean = (value: number) => Number(value.toFixed(6));
const finiteOr = (value: number, fallback: number) =>
  Number.isFinite(value) ? value : fallback;

function factorial(n: number) {
  let value = 1;
  for (let index = 2; index <= n; index += 1) value *= index;
  return value;
}

export function convergenceSeriesTerm(
  parameters: ConvergenceSeriesParameters,
  n: number,
) {
  const index = Math.max(1, Math.round(n)),
    first = finiteOr(parameters.first, 0),
    ratio = finiteOr(parameters.ratio, 0),
    power = finiteOr(parameters.power, 2),
    scale = finiteOr(parameters.scale, 1),
    shift = Math.max(-0.9, finiteOr(parameters.shift, 0));
  if (parameters.type === "Geometric") return first * ratio ** (index - 1);
  if (parameters.type === "p-Series") return 1 / index ** power;
  if (parameters.type === "Alternating")
    return (index % 2 ? 1 : -1) / index ** power;
  if (parameters.type === "Factorial") return 1 / factorial(index);
  return scale / (index + shift) ** power;
}

export function convergenceDivergenceAnalysis(
  parameters: ConvergenceSeriesParameters,
  visibleCount = 20,
  approximationCount = 5000,
) {
  const count = Math.max(2, Math.min(40, Math.round(visibleCount))),
    safe = {
      ...parameters,
      first: clean(finiteOr(parameters.first, 0)),
      ratio: clean(finiteOr(parameters.ratio, 0)),
      power: clean(finiteOr(parameters.power, 2)),
      scale: clean(finiteOr(parameters.scale, 1)),
      shift: clean(Math.max(-0.9, finiteOr(parameters.shift, 0))),
    },
    terms = Array.from({ length: count }, (_, index) =>
      clean(convergenceSeriesTerm(safe, index + 1)),
    ),
    partials = terms.reduce<number[]>(
      (values, term) => [...values, clean(term + (values.at(-1) ?? 0))],
      [],
    ),
    isZeroSeries =
      (safe.type === "Geometric" && safe.first === 0) ||
      (safe.type === "Custom" && safe.scale === 0),
    convergent = isZeroSeries
      ? true
      : safe.type === "Geometric"
        ? Math.abs(safe.ratio) < 1
        : safe.type === "p-Series"
          ? safe.power > 1
          : safe.type === "Alternating"
            ? safe.power > 0
            : safe.type === "Factorial"
              ? true
              : safe.power > 1,
    absolute = safe.type === "Alternating" ? safe.power > 1 : convergent,
    nthLimit = isZeroSeries
      ? 0
      : safe.type === "Geometric"
        ? Math.abs(safe.ratio) < 1
          ? 0
          : safe.ratio === 1
            ? safe.first
            : safe.ratio === -1
              ? null
              : safe.ratio > 1
                ? safe.first > 0
                  ? Infinity
                  : -Infinity
                : null
        : safe.type === "p-Series" ||
            safe.type === "Alternating" ||
            safe.type === "Custom"
          ? safe.power > 0
            ? 0
            : null
          : 0,
    ratioLimit =
      safe.type === "Geometric"
        ? Math.abs(safe.ratio)
        : safe.type === "Factorial"
          ? 0
          : 1,
    sampleSize = Math.max(100, Math.min(20_000, approximationCount)),
    infiniteSum = !convergent
      ? null
      : isZeroSeries
        ? 0
        : safe.type === "Geometric"
          ? clean(safe.first / (1 - safe.ratio))
          : safe.type === "Factorial"
            ? clean(Math.E - 1)
            : clean(
                Array.from({ length: sampleSize }, (_, index) =>
                  convergenceSeriesTerm(safe, index + 1),
                ).reduce((sum, value) => sum + value, 0),
              ),
    minimum = Math.min(0, ...partials, infiniteSum ?? 0),
    maximum = Math.max(1, ...partials, infiniteSum ?? 0),
    padding = Math.max(0.1, (maximum - minimum) * 0.05);

  return {
    parameters: safe,
    terms,
    partials,
    convergent,
    absolute,
    nthLimit,
    ratioLimit,
    infiniteSum,
    plotMin: minimum - padding,
    plotMax: maximum + padding,
  };
}

export function geometricComparisonPartials(ratio: number, count = 16) {
  return convergenceDivergenceAnalysis(
    {
      type: "Geometric",
      first: 4,
      ratio,
      power: 2,
      scale: 1,
      shift: 0,
    },
    count,
  ).partials;
}
