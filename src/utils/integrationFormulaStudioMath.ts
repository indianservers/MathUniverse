export type FormulaSamplingMethod = "left" | "midpoint" | "right" | "trapezoid";

export type FormulaPartition = {
  index: number;
  x0: number;
  x1: number;
  sampleX: number;
  sampleY: number;
  y0: number;
  y1: number;
  area: number;
  runningSum: number;
};

export type RiemannCalculation = {
  n: number;
  dx: number;
  approximation: number;
  exact: number;
  signedError: number;
  absoluteError: number;
  relativeError: number;
  partitions: FormulaPartition[];
};

export const integrationFormulaIds = [
  "area-under-curve", "riemann-sum", "definite-integral", "area-between-curves", "ftc", "antiderivative", "power-integration",
  "constant-multiple", "sum-difference", "substitution", "integration-by-parts",
  "definite-reversal", "zero-width", "average-value",
] as const;

export function normalizeFormulaPartitions(value: number) {
  return Math.max(2, Math.min(64, Math.round(Number.isFinite(value) ? value : 8)));
}

export function generateFormulaPartitions(fn: (x: number) => number, lower: number, upper: number, value: number, method: FormulaSamplingMethod) {
  if (!(lower < upper)) throw new Error("Lower bound must be less than upper bound.");
  const n = normalizeFormulaPartitions(value), dx = (upper - lower) / n;
  let runningSum = 0;
  return Array.from({ length: n }, (_, index): FormulaPartition => {
    const x0 = lower + index * dx, x1 = x0 + dx;
    const sampleX = method === "left" ? x0 : method === "right" ? x1 : (x0 + x1) / 2;
    const y0 = finite(fn(x0)), y1 = finite(fn(x1)), sampleY = finite(fn(sampleX));
    const area = (method === "trapezoid" ? (y0 + y1) / 2 : sampleY) * dx;
    runningSum += area;
    return { index, x0, x1, sampleX, sampleY, y0, y1, area, runningSum };
  });
}

export function calculateRiemann(fn: (x: number) => number, lower: number, upper: number, value: number, method: FormulaSamplingMethod, exact?: number): RiemannCalculation {
  const partitions = generateFormulaPartitions(fn, lower, upper, value, method);
  const approximation = partitions.reduce((sum, part) => sum + part.area, 0);
  const reference = exact ?? simpsonReference(fn, lower, upper);
  const signedError = approximation - reference, absoluteError = Math.abs(signedError);
  return {
    n: partitions.length, dx: (upper - lower) / partitions.length, approximation, exact: reference,
    signedError, absoluteError, relativeError: Math.abs(reference) > 1e-12 ? absoluteError / Math.abs(reference) * 100 : 0,
    partitions,
  };
}

export function parseIntegrationFormulaQuery(search: string) {
  const query = new URLSearchParams(search);
  const lower = numeric(query.get("v_lower_a"), 0), upper = numeric(query.get("v_upper_b"), 4);
  const methodValue = query.get("v_method");
  const method: FormulaSamplingMethod = methodValue === "left" || methodValue === "right" || methodValue === "trapezoid" ? methodValue : "midpoint";
  return {
    n: normalizeFormulaPartitions(numeric(query.get("v_n"), 8)),
    lower: lower < upper ? lower : 0,
    upper: lower < upper ? upper : 4,
    method,
    formulaId: resolveIntegrationFormulaId(query.get("v_formula")),
    learning: ["Visual", "Steps", "Intuition", "Common mistake"].includes(query.get("v_learning") ?? "") ? query.get("v_learning")! : "Visual",
  };
}

export function resolveIntegrationFormulaId(value: string | null | undefined) {
  return integrationFormulaIds.includes(value as typeof integrationFormulaIds[number]) ? value! : "riemann-sum";
}

export const defaultIntegrationFormulaState = { n: 8, lower: 0, upper: 4, method: "midpoint" as FormulaSamplingMethod, formulaId: "riemann-sum", learning: "Visual" };

function simpsonReference(fn: (x: number) => number, lower: number, upper: number) {
  const n = 4096, dx = (upper - lower) / n;
  let sum = finite(fn(lower)) + finite(fn(upper));
  for (let index = 1; index < n; index += 1) sum += (index % 2 ? 4 : 2) * finite(fn(lower + index * dx));
  return sum * dx / 3;
}

function finite(value: number) {
  if (!Number.isFinite(value)) throw new Error("Function is undefined in the selected interval.");
  return value;
}

function numeric(value: string | null, fallback: number) {
  if (value === null || value.trim() === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
