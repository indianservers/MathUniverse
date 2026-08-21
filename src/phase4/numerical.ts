import type { CertifiedCasResult, ConvergenceReport } from "./types";
import { verifiedStep } from "./transformationRules";

export type NumericalOutcome = { status: "CONVERGED" | "NON_CONVERGENT" | "INVALID"; value?: number; method: string; precision: number; tolerance: number; residual?: number; convergence: ConvergenceReport; warnings: string[] };

export function bisection(fn: (x: number) => number, lower: number, upper: number, options: { tolerance?: number; maximumIterations?: number; precision?: number } = {}): NumericalOutcome {
  const tolerance = options.tolerance ?? 1e-10;
  const maximumIterations = options.maximumIterations ?? 100;
  const precision = options.precision ?? 12;
  let left = lower; let right = upper; let fLeft = fn(left); const fRight = fn(right);
  if (![left, right, fLeft, fRight].every(Number.isFinite)) return failure("Bisection", precision, tolerance, maximumIterations, "The bracket contains a non-finite value.");
  if (fLeft === 0) return success(left, 0, "Bisection", precision, tolerance, 0, maximumIterations, "The lower endpoint is an exact root.");
  if (fLeft * fRight > 0) return failure("Bisection", precision, tolerance, maximumIterations, "Endpoint values do not have opposite signs.");
  const history: number[] = [];
  for (let iteration = 1; iteration <= maximumIterations; iteration += 1) {
    const midpoint = (left + right) / 2; const fMid = fn(midpoint); history.push(midpoint);
    if (!Number.isFinite(fMid)) return failure("Bisection", precision, tolerance, maximumIterations, "A non-finite midpoint value interrupted convergence.", iteration, history);
    if (Math.abs(fMid) <= tolerance || Math.abs(right - left) / 2 <= tolerance) return success(midpoint, Math.abs(fMid), "Bisection", precision, tolerance, iteration, maximumIterations, "Residual or bracket width met tolerance.", history);
    if (fLeft * fMid <= 0) right = midpoint; else { left = midpoint; fLeft = fMid; }
  }
  return failure("Bisection", precision, tolerance, maximumIterations, "Iteration limit reached before tolerance.", maximumIterations, history);
}

export function compositeSimpson(fn: (x: number) => number, lower: number, upper: number, subintervals = 200, tolerance = 1e-9): NumericalOutcome {
  const n = Math.max(2, Math.floor(subintervals / 2) * 2); const h = (upper - lower) / n;
  let sum = fn(lower) + fn(upper);
  if (!Number.isFinite(sum)) return failure("Composite Simpson", 12, tolerance, n, "Non-finite endpoint value.");
  for (let index = 1; index < n; index += 1) { const value = fn(lower + index * h); if (!Number.isFinite(value)) return failure("Composite Simpson", 12, tolerance, n, `Non-finite sample at index ${index}.`, index); sum += (index % 2 ? 4 : 2) * value; }
  const value = sum * h / 3;
  const coarse = n >= 4 ? compositeSimpsonRaw(fn, lower, upper, n / 2) : value;
  const residual = Math.abs(value - coarse) / 15;
  return { status: residual <= tolerance ? "CONVERGED" : "NON_CONVERGENT", value, method: "Composite Simpson", precision: 12, tolerance, residual, convergence: { converged: residual <= tolerance, iterations: n, maximumIterations: n, reason: residual <= tolerance ? "Richardson error estimate met tolerance." : "Estimated quadrature error exceeds tolerance." }, warnings: residual <= tolerance ? [] : ["Increase the even subinterval count or relax tolerance."] };
}

export function numericalCasResult(inputNodeId: string, outcome: NumericalOutcome, input: string): CertifiedCasResult {
  const value = outcome.value;
  return { status: outcome.status === "CONVERGED" ? "APPROXIMATE" : "NON_CONVERGENT", inputNodeId, resultNodeIds: value === undefined ? [] : [`${inputNodeId}-numeric`], conditions: [], excludedValues: [], assumptionsUsed: [], assumptionLabels: [], branches: [], approximateResult: value === undefined ? undefined : { kind: "DECIMAL", coefficient: String(value), scale: 0, precision: outcome.precision, roundingMode: "HALF_EVEN" }, approximateExpression: value?.toPrecision(outcome.precision), numericalMethod: outcome.method, precision: outcome.precision, tolerance: outcome.tolerance, residual: outcome.residual, convergence: outcome.convergence, steps: [verifiedStep(outcome.method === "Bisection" ? "NUMERIC.BISECTION" : "NUMERIC.SIMPSON", input, value === undefined ? "no converged result" : String(value), [], outcome.status === "CONVERGED" ? "VERIFIED" : "FAILED")], diagnostics: outcome.warnings.map((message) => ({ code: "NUMERICAL_WARNING", severity: "WARNING", message })), provenance: [] };
}

function compositeSimpsonRaw(fn: (x: number) => number, lower: number, upper: number, n: number) { const h = (upper - lower) / n; let sum = fn(lower) + fn(upper); for (let i = 1; i < n; i += 1) sum += (i % 2 ? 4 : 2) * fn(lower + i * h); return sum * h / 3; }
function success(value: number, residual: number, method: string, precision: number, tolerance: number, iterations: number, maximumIterations: number, reason: string, history: number[] = []): NumericalOutcome { return { status: "CONVERGED", value, residual, method, precision, tolerance, convergence: { converged: true, iterations, maximumIterations, reason, history }, warnings: [] }; }
function failure(method: string, precision: number, tolerance: number, maximumIterations: number, reason: string, iterations = 0, history: number[] = []): NumericalOutcome { return { status: reason.includes("Iteration limit") ? "NON_CONVERGENT" : "INVALID", method, precision, tolerance, convergence: { converged: false, iterations, maximumIterations, reason, history }, warnings: [reason] }; }
