export type PowerSeriesTarget = "cos x" | "sin x" | "e^x" | "1 / (1 - x)";

const clean = (value: number) => {
  const rounded = Number(value.toFixed(8));
  return Object.is(rounded, -0) ? 0 : rounded;
};

function factorial(n: number) {
  let value = 1;
  for (let index = 2; index <= n; index += 1) value *= index;
  return value;
}

export function powerSeriesCoefficients(
  target: PowerSeriesTarget,
  centerValue: number,
  countValue: number,
) {
  const center = Number.isFinite(centerValue) ? centerValue : 0,
    count = Math.max(1, Math.min(40, Math.round(countValue)));
  return Array.from({ length: count }, (_, n) => {
    if (target === "cos x")
      return clean(Math.cos(center + (n * Math.PI) / 2) / factorial(n));
    if (target === "sin x")
      return clean(Math.sin(center + (n * Math.PI) / 2) / factorial(n));
    if (target === "e^x") return clean(Math.exp(center) / factorial(n));
    if (Math.abs(1 - center) < 1e-9) return 0;
    return clean(1 / (1 - center) ** (n + 1));
  });
}

export function powerSeriesTargetValue(target: PowerSeriesTarget, x: number) {
  if (target === "cos x") return Math.cos(x);
  if (target === "sin x") return Math.sin(x);
  if (target === "e^x") return Math.exp(x);
  return 1 / (1 - x);
}

export function evaluatePowerSeries(
  coefficients: number[],
  center: number,
  degree: number,
  x: number,
) {
  return coefficients
    .slice(0, Math.max(0, degree) + 1)
    .reduce(
      (sum, coefficient, index) => sum + coefficient * (x - center) ** index,
      0,
    );
}

export function formatPowerSeriesCoefficient(value: number) {
  if (Math.abs(value) < 1e-10) return "0";
  const reciprocal = Math.round(1 / Math.abs(value));
  if (reciprocal > 1 && Math.abs(Math.abs(value) - 1 / reciprocal) < 1e-8)
    return `${value < 0 ? "-" : ""}1/${reciprocal}`;
  return clean(value).toString();
}

export function parsePowerSeriesCoefficient(text: string) {
  const normalized = text.trim().replace("−", "-");
  if (normalized.includes("/")) {
    const parts = normalized.split("/");
    if (parts.length !== 2) return null;
    const numerator = Number(parts[0]),
      denominator = Number(parts[1]);
    return Number.isFinite(numerator) &&
      Number.isFinite(denominator) &&
      denominator
      ? clean(numerator / denominator)
      : null;
  }
  const value = Number(normalized);
  return Number.isFinite(value) ? clean(value) : null;
}

export function powerSeriesAnalysis({
  target,
  center: centerValue,
  degree: degreeValue,
  range: rangeValue,
  coefficients,
  preset,
}: {
  target: PowerSeriesTarget;
  center: number;
  degree: number;
  range: number;
  coefficients: number[];
  preset: boolean;
}) {
  const center = clean(Number.isFinite(centerValue) ? centerValue : 0),
    degree = Math.max(1, Math.min(12, Math.round(degreeValue))),
    range = Math.max(0.5, Math.min(6.28, rangeValue)),
    requiredCount = Math.max(9, degree + 1),
    activeCoefficients = (
      preset
        ? powerSeriesCoefficients(target, center, requiredCount)
        : Array.from(
            { length: requiredCount },
            (_, index) => coefficients[index] ?? 0,
          )
    ).map((value) => clean(Number.isFinite(value) ? value : 0)),
    expected = powerSeriesCoefficients(target, center, requiredCount),
    recognizedTarget = activeCoefficients.every(
      (value, index) => Math.abs(value - expected[index]) < 1e-7,
    ),
    finitePairs = activeCoefficients
      .map((value, index) => ({ value, index }))
      .filter((item) => item.index > 0 && Math.abs(item.value) > 1e-12),
    rootEstimates = finitePairs
      .map((item) => 1 / Math.abs(item.value) ** (1 / item.index))
      .filter(Number.isFinite),
    estimatedRadius = rootEstimates.length
      ? rootEstimates.slice(-3).reduce((sum, value) => sum + value, 0) /
        Math.min(3, rootEstimates.length)
      : Infinity,
    radius = recognizedTarget
      ? target === "1 / (1 - x)"
        ? Math.abs(1 - center)
        : Infinity
      : estimatedRadius,
    interval = Number.isFinite(radius)
      ? `(${clean(center - radius)}, ${clean(center + radius)})`
      : "(-∞, ∞)",
    samples = Array.from(
      { length: 81 },
      (_, index) => center - range + (2 * range * index) / 80,
    ),
    graphPoints = samples
      .map((x) => ({
        x,
        target: powerSeriesTargetValue(target, x),
        partial: evaluatePowerSeries(activeCoefficients, center, degree, x),
      }))
      .filter(
        (point) =>
          Number.isFinite(point.target) &&
          Number.isFinite(point.partial) &&
          Math.abs(point.target) < 20 &&
          Math.abs(point.partial) < 100,
      ),
    maxError = Math.max(
      0,
      ...graphPoints.map((point) => Math.abs(point.partial - point.target)),
    ),
    expanded =
      activeCoefficients
        .slice(0, degree + 1)
        .map((value, index) => ({ value, index }))
        .filter(({ value }) => Math.abs(value) > 1e-10)
        .map(({ value, index }, termIndex) => {
          const sign = value < 0 ? "−" : termIndex ? "+" : "",
            magnitude = formatPowerSeriesCoefficient(Math.abs(value)),
            variable = center ? `(x−${center})` : "x",
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
    degree,
    range,
    coefficients: activeCoefficients,
    graphPoints,
    maxError: clean(maxError),
    radius,
    interval,
    recognized: recognizedTarget ? target : "Custom series",
    expanded,
  };
}
