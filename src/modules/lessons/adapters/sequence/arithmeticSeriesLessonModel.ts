export const ARITHMETIC_SERIES_DEFAULTS = {
  first: 2,
  difference: 3,
  count: 10,
} as const;

const clean = (value: number) => Number(value.toFixed(6));

export function arithmeticSeriesAnalysis(
  firstValue: number,
  differenceValue: number,
  countValue: number,
) {
  const first = clean(Number.isFinite(firstValue) ? firstValue : 0),
    difference = clean(Number.isFinite(differenceValue) ? differenceValue : 0),
    count = Math.max(
      2,
      Math.min(20, Math.round(Number.isFinite(countValue) ? countValue : 2)),
    ),
    terms = Array.from({ length: count }, (_, index) =>
      clean(first + index * difference),
    ),
    partials = terms.reduce<number[]>(
      (values, value) => [...values, clean(value + (values.at(-1) ?? 0))],
      [],
    ),
    last = terms.at(-1) ?? first,
    pairSum = clean(first + last),
    pairs = Array.from({ length: Math.ceil(count / 2) }, (_, index) => ({
      first: terms[index],
      last: terms[count - 1 - index],
      sum: clean(terms[index] + terms[count - 1 - index]),
    })),
    minimum = Math.min(0, ...terms),
    maximum = Math.max(0, ...terms),
    padding = Math.max(3, (maximum - minimum) * 0.08);

  return {
    first,
    difference,
    count,
    terms,
    partials,
    last,
    pairSum,
    pairs,
    total: partials.at(-1) ?? 0,
    formulaTotal: clean((count / 2) * (2 * first + (count - 1) * difference)),
    plotMin: minimum - padding,
    plotMax: maximum + padding,
  };
}

export function arithmeticSeriesSum(
  first: number,
  difference: number,
  count: number,
) {
  return arithmeticSeriesAnalysis(first, difference, count).total;
}
