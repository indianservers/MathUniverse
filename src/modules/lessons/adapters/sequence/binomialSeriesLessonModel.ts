const clean = (value: number) => {
  const rounded = Number(value.toFixed(9));
  return Object.is(rounded, -0) ? 0 : rounded;
};

export function generalizedBinomialCoefficients(
  alphaValue: number,
  countValue: number,
) {
  const alpha = clean(Number.isFinite(alphaValue) ? alphaValue : 0),
    count = Math.max(1, Math.min(40, Math.round(countValue))),
    values = [1];
  for (let index = 1; index < count; index += 1)
    values.push(clean((values[index - 1] * (alpha - index + 1)) / index));
  return values;
}

export function binomialSeriesAnalysis(
  alphaValue: number,
  xValue: number,
  countValue: number,
) {
  const alpha = clean(
      Math.max(-2, Math.min(2, Number.isFinite(alphaValue) ? alphaValue : 0)),
    ),
    x = clean(
      Math.max(-0.99, Math.min(0.99, Number.isFinite(xValue) ? xValue : 0)),
    ),
    count = Math.max(1, Math.min(15, Math.round(countValue))),
    coefficients = generalizedBinomialCoefficients(alpha, 21),
    terms = coefficients
      .slice(0, count)
      .map((coefficient, index) => clean(coefficient * x ** index)),
    partials = terms.reduce<number[]>(
      (values, term) => [...values, clean(term + (values.at(-1) ?? 0))],
      [],
    ),
    partial = partials.at(-1) ?? 0,
    target = clean((1 + x) ** alpha),
    error = clean(Math.abs(partial - target)),
    errors = Array.from({ length: 21 }, (_, candidate) =>
      clean(
        Math.abs(
          coefficients
            .slice(0, candidate + 1)
            .reduce(
              (sum, coefficient, index) => sum + coefficient * x ** index,
              0,
            ) - target,
        ),
      ),
    ),
    samples = Array.from(
      { length: 81 },
      (_, index) => -0.9 + (1.8 * index) / 80,
    )
      .map((sampleX) => ({
        x: clean(sampleX),
        target: clean((1 + sampleX) ** alpha),
        partial: clean(
          coefficients
            .slice(0, count)
            .reduce(
              (sum, coefficient, index) => sum + coefficient * sampleX ** index,
              0,
            ),
        ),
      }))
      .filter(
        (point) =>
          Number.isFinite(point.target) && Number.isFinite(point.partial),
      ),
    isPolynomial = Number.isInteger(alpha) && alpha >= 0,
    expansion = coefficients
      .slice(0, count)
      .map((coefficient, index) => {
        const sign = coefficient < 0 ? "−" : index ? "+" : "",
          magnitude = clean(Math.abs(coefficient)),
          variable = index === 0 ? "" : index === 1 ? "x" : `x^${index}`;
        return `${sign} ${magnitude === 1 && variable ? "" : magnitude}${variable}`;
      })
      .join(" ");

  return {
    alpha,
    x,
    count,
    coefficients,
    terms,
    partials,
    partial,
    target,
    error,
    errors,
    samples,
    expansion,
    domain: isPolynomial ? "all real x" : "|x| < 1",
    convergesAtInput: isPolynomial || Math.abs(x) < 1,
  };
}
