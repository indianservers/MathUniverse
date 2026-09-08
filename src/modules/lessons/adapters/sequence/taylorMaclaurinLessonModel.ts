export type TaylorFunction = "e^x" | "sin x" | "cos x" | "ln(1+x)" | "1/(1-x)";

const clean = (value: number) => {
  const rounded = Number(value.toFixed(7));
  return Object.is(rounded, -0) ? 0 : rounded;
};

export function factorial(n: number) {
  let value = 1;
  for (let index = 2; index <= n; index += 1) value *= index;
  return value;
}

export function taylorFunctionValue(fn: TaylorFunction, x: number) {
  if (fn === "e^x") return Math.exp(x);
  if (fn === "sin x") return Math.sin(x);
  if (fn === "cos x") return Math.cos(x);
  if (fn === "ln(1+x)") return x > -1 ? Math.log1p(x) : Number.NaN;
  return Math.abs(1 - x) < 1e-10 ? Number.NaN : 1 / (1 - x);
}

export function taylorCoefficient(
  fn: TaylorFunction,
  center: number,
  order: number,
) {
  if (fn === "e^x") return clean(Math.exp(center) / factorial(order));
  if (fn === "sin x")
    return clean(Math.sin(center + (order * Math.PI) / 2) / factorial(order));
  if (fn === "cos x")
    return clean(Math.cos(center + (order * Math.PI) / 2) / factorial(order));
  if (fn === "ln(1+x)") {
    if (center <= -1) return Number.NaN;
    if (order === 0) return clean(Math.log1p(center));
    return clean((order % 2 ? 1 : -1) / (order * (1 + center) ** order));
  }
  if (Math.abs(1 - center) < 1e-10) return Number.NaN;
  return clean(1 / (1 - center) ** (order + 1));
}

export function taylorDerivativeText(fn: TaylorFunction, order: number) {
  if (fn === "e^x") return "e^x";
  if (fn === "sin x") return ["sin x", "cos x", "-sin x", "-cos x"][order % 4];
  if (fn === "cos x") return ["cos x", "-sin x", "-cos x", "sin x"][order % 4];
  if (fn === "ln(1+x)")
    return order === 0
      ? "ln(1+x)"
      : `${order % 2 ? "" : "-"}${factorial(order - 1)}/(1+x)^${order}`;
  return `${factorial(order)}/(1-x)^${order + 1}`;
}

export function evaluateTaylorPolynomial(
  coefficients: number[],
  center: number,
  order: number,
  x: number,
) {
  return coefficients
    .slice(0, order + 1)
    .reduce(
      (sum, coefficient, index) => sum + coefficient * (x - center) ** index,
      0,
    );
}

const formatMagnitude = (value: number) => {
  if (Math.abs(value - 1) < 1e-8) return "1";
  const reciprocal = Math.round(1 / value);
  return reciprocal > 1 && Math.abs(value - 1 / reciprocal) < 1e-7
    ? `1/${reciprocal}`
    : clean(value).toString();
};

export function taylorMaclaurinAnalysis({
  fn,
  center: centerValue,
  order: orderValue,
  shownOrder: shownOrderValue,
  low: lowValue,
  high: highValue,
}: {
  fn: TaylorFunction;
  center: number;
  order: number;
  shownOrder: number;
  low: number;
  high: number;
}) {
  const center = clean(Number.isFinite(centerValue) ? centerValue : 0),
    order = Math.max(0, Math.min(10, Math.round(orderValue))),
    shownOrder = Math.max(0, Math.min(order, Math.round(shownOrderValue))),
    low = clean(Number.isFinite(lowValue) ? lowValue : -3),
    high = clean(Number.isFinite(highValue) ? highValue : 3),
    validInterval = low < high,
    validCenter =
      (fn !== "ln(1+x)" || center > -1) &&
      (fn !== "1/(1-x)" || Math.abs(center - 1) > 1e-10),
    coefficients = Array.from({ length: order + 1 }, (_, index) =>
      taylorCoefficient(fn, center, index),
    ),
    valid =
      validInterval &&
      validCenter &&
      coefficients.every((coefficient) => Number.isFinite(coefficient)),
    span = validInterval ? high - low : 1,
    samples = valid
      ? Array.from({ length: 81 }, (_, index) => low + (span * index) / 80)
          .map((x) => ({
            x,
            f: taylorFunctionValue(fn, x),
            p: evaluateTaylorPolynomial(coefficients, center, shownOrder, x),
          }))
          .filter(
            (point) =>
              Number.isFinite(point.f) &&
              Number.isFinite(point.p) &&
              Math.abs(point.f) < 50 &&
              Math.abs(point.p) < 100,
          )
      : [],
    maxError = Math.max(
      0,
      ...samples.map((point) => Math.abs(point.f - point.p)),
    ),
    orderErrors = Array.from({ length: 9 }, (_, candidateOrder) =>
      valid
        ? Math.max(
            0,
            ...Array.from({ length: 61 }, (_, index) => {
              const x = low + (span * index) / 60,
                functionValue = taylorFunctionValue(fn, x),
                polynomialValue = evaluateTaylorPolynomial(
                  coefficients,
                  center,
                  Math.min(candidateOrder, order),
                  x,
                );
              return Number.isFinite(functionValue) &&
                Number.isFinite(polynomialValue)
                ? Math.abs(functionValue - polynomialValue)
                : 0;
            }),
          )
        : 0,
    ),
    expanded =
      coefficients
        .slice(0, shownOrder + 1)
        .map((coefficient, index) => ({ coefficient, index }))
        .filter(({ coefficient }) => Math.abs(coefficient) > 1e-10)
        .map(({ coefficient, index }, visibleIndex) => {
          const sign = coefficient < 0 ? "−" : visibleIndex ? "+" : "",
            magnitude = formatMagnitude(Math.abs(coefficient)),
            variable = center
              ? `(x${center > 0 ? "−" : "+"}${Math.abs(center)})`
              : "x",
            power =
              index === 0
                ? ""
                : index === 1
                  ? variable
                  : `${variable}^${index}`;
          return `${sign} ${magnitude === "1" && power ? "" : magnitude}${power}`;
        })
        .join(" ") || "0";

  return {
    center,
    order,
    shownOrder,
    low,
    high,
    valid,
    coefficients,
    samples,
    maxError: clean(maxError),
    orderErrors: orderErrors.map(clean),
    expanded,
  };
}
