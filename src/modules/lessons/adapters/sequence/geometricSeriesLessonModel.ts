export const GEOMETRIC_SERIES_DEFAULTS = {
  first: 3,
  ratio: 0.5,
  count: 10,
} as const;

const clean = (value: number) => Number(value.toFixed(6));

export function geometricSeriesAnalysis(
  firstValue: number,
  ratioValue: number,
  countValue: number,
) {
  const first = clean(Number.isFinite(firstValue) ? firstValue : 0),
    ratio = clean(Number.isFinite(ratioValue) ? ratioValue : 0),
    count = Math.max(
      1,
      Math.min(20, Math.round(Number.isFinite(countValue) ? countValue : 1)),
    ),
    terms = Array.from({ length: count }, (_, index) =>
      clean(first * ratio ** index),
    ),
    partials = terms.reduce<number[]>(
      (values, value) => [...values, clean(value + (values.at(-1) ?? 0))],
      [],
    ),
    finite = partials.at(-1) ?? 0,
    formulaFinite = clean(
      ratio === 1
        ? first * count
        : (first * (1 - ratio ** count)) / (1 - ratio),
    ),
    converges = Math.abs(ratio) < 1,
    infinite = converges ? clean(first / (1 - ratio)) : null,
    maximumTermMagnitude = Math.max(1, ...terms.map(Math.abs)),
    plotMinimum = Math.min(0, ...partials, infinite ?? 0),
    plotMaximum = Math.max(0, ...partials, infinite ?? 0),
    plotPadding = Math.max(1, (plotMaximum - plotMinimum) * 0.08);

  return {
    first,
    ratio,
    count,
    terms,
    partials,
    finite,
    formulaFinite,
    converges,
    infinite,
    maximumTermMagnitude,
    plotMin: plotMinimum - plotPadding,
    plotMax: plotMaximum + plotPadding,
  };
}

export function infiniteGeometricSeriesSum(first: number, ratio: number) {
  return geometricSeriesAnalysis(first, ratio, 1).infinite;
}
