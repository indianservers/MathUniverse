export type IntegrationMethod = "left" | "midpoint" | "right" | "trapezoid" | "simpson";

export type IntegrationPartition = {
  index: number;
  x0: number;
  x1: number;
  sampleX: number;
  sampleY: number;
  area: number;
  runningSum: number;
};

export type IntegrationResult = {
  method: IntegrationMethod;
  n: number;
  dx: number;
  approximation: number;
  reference: number;
  absoluteError: number;
  relativeError: number;
  signedError: number;
  positiveArea: number;
  negativeArea: number;
  signedArea: number;
  geometricArea: number;
  partitions: IntegrationPartition[];
};

export function enforcePartitionCount(value: number, method: IntegrationMethod) {
  let n = Math.max(2, Math.min(100, Math.round(Number.isFinite(value) ? value : 12)));
  if (method === "simpson" && n % 2 !== 0) n = Math.min(100, n + 1);
  return n;
}

export function generatePartitions(fn: (x: number) => number, lower: number, upper: number, count: number, method: IntegrationMethod) {
  if (lower === upper) throw new Error("The integration interval must have non-zero width.");
  const n = enforcePartitionCount(count, method), dx = (upper - lower) / n;
  let runningSum = 0;
  return Array.from({ length: n }, (_, index): IntegrationPartition => {
    const x0 = lower + index * dx, x1 = x0 + dx;
    const sampleX = method === "left" ? x0 : method === "right" ? x1 : (x0 + x1) / 2;
    const sampleY = finite(fn(sampleX));
    const area = method === "trapezoid" ? (finite(fn(x0)) + finite(fn(x1))) * dx / 2 : sampleY * dx;
    runningSum += area;
    return { index, x0, x1, sampleX, sampleY, area, runningSum };
  });
}

export function approximateIntegral(fn: (x: number) => number, lower: number, upper: number, count: number, method: IntegrationMethod) {
  const n = enforcePartitionCount(count, method), dx = (upper - lower) / n;
  if (lower === upper) throw new Error("The integration interval must have non-zero width.");
  if (method === "simpson") {
    let sum = finite(fn(lower)) + finite(fn(upper));
    for (let index = 1; index < n; index += 1) sum += (index % 2 === 0 ? 2 : 4) * finite(fn(lower + index * dx));
    return sum * dx / 3;
  }
  return generatePartitions(fn, lower, upper, n, method).reduce((sum, partition) => sum + partition.area, 0);
}

export function highPrecisionIntegral(fn: (x: number) => number, lower: number, upper: number, slices = 4000) {
  if (lower === upper) throw new Error("The integration interval must have non-zero width.");
  const n = slices % 2 === 0 ? slices : slices + 1, dx = (upper - lower) / n;
  let sum = finite(fn(lower)) + finite(fn(upper));
  for (let index = 1; index < n; index += 1) sum += (index % 2 === 0 ? 2 : 4) * finite(fn(lower + index * dx));
  return sum * dx / 3;
}

export function areaBreakdown(fn: (x: number) => number, lower: number, upper: number, slices = 5000) {
  if (lower === upper) throw new Error("The integration interval must have non-zero width.");
  const orientation = upper > lower ? 1 : -1;
  const start = Math.min(lower, upper), dx = Math.abs(upper - lower) / slices;
  let positiveArea = 0, negativeArea = 0;
  for (let index = 0; index < slices; index += 1) {
    const mid = start + (index + .5) * dx, value = finite(fn(mid)) * dx;
    if (value >= 0) positiveArea += value;
    else negativeArea += Math.abs(value);
  }
  return { positiveArea, negativeArea, signedArea: orientation * (positiveArea - negativeArea), geometricArea: positiveArea + negativeArea };
}

export function calculateIntegration(fn: (x: number) => number, lower: number, upper: number, count: number, method: IntegrationMethod): IntegrationResult {
  const n = enforcePartitionCount(count, method);
  const approximation = approximateIntegral(fn, lower, upper, n, method);
  const reference = highPrecisionIntegral(fn, lower, upper);
  const breakdown = areaBreakdown(fn, lower, upper);
  const signedError = approximation - reference, absoluteError = Math.abs(signedError);
  return {
    method, n, dx: (upper - lower) / n, approximation, reference, absoluteError,
    relativeError: Math.abs(reference) > 1e-12 ? absoluteError / Math.abs(reference) * 100 : 0,
    signedError, ...breakdown, partitions: generatePartitions(fn, lower, upper, n, method),
  };
}

export function parseIntegrationQuery(search: string) {
  const query = new URLSearchParams(search);
  const lower = numeric(query.get("v_lower_a"), -2), upper = numeric(query.get("v_upper_b"), 3);
  const methodValue = query.get("v_method");
  const method: IntegrationMethod = methodValue === "left" || methodValue === "right" || methodValue === "trapezoid" || methodValue === "simpson" ? methodValue : "midpoint";
  return {
    expression: query.get("v_function") || "x^2",
    secondExpression: query.get("v_g_function") || "x",
    lower: lower !== upper ? lower : -2,
    upper: lower !== upper ? upper : 3,
    partitions: enforcePartitionCount(numeric(query.get("v_partitions_n"), 12), method),
    method,
    betweenCurves: query.get("v_between_curves") === "1",
    mode: query.get("v_mode") || "area",
  };
}

function finite(value: number) {
  if (!Number.isFinite(value)) throw new Error("The function is undefined within the selected interval.");
  return value;
}

function numeric(value: string | null, fallback: number) {
  if (value === null || value.trim() === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
