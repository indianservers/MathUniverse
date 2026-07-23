export type SetPredicateId = "even" | "positive" | "greater-than-two" | "multiple-of-three";
export type SetOperationId = "union" | "intersection" | "a-minus-b" | "b-minus-a" | "symmetric-difference";
export type OdeRuleId = "exponential" | "difference";

export function parseFiniteNumberList(input: string, maxItems = 16) {
  const values = input.split(/[\s,]+/).filter(Boolean).map(Number);
  if (!values.length) return { values: [] as number[], error: "Enter at least one number." };
  if (values.some((value) => !Number.isFinite(value))) return { values: [] as number[], error: "Use comma-separated finite numbers." };
  const unique = Array.from(new Set(values)).slice(0, maxItems).sort((a, b) => a - b);
  return { values: unique, error: values.length > maxItems ? `Only the first ${maxItems} distinct values are used.` : "" };
}

export function setPredicateLabel(predicate: SetPredicateId) {
  if (predicate === "even") return "x is even";
  if (predicate === "positive") return "x > 0";
  if (predicate === "greater-than-two") return "x > 2";
  return "x is a multiple of 3";
}

export function satisfiesSetPredicate(value: number, predicate: SetPredicateId) {
  if (predicate === "even") return Number.isInteger(value) && Math.abs(value % 2) < 1e-9;
  if (predicate === "positive") return value > 0;
  if (predicate === "greater-than-two") return value > 2;
  return Number.isInteger(value) && Math.abs(value % 3) < 1e-9;
}

export function computeSetBuilder(universe: number[], predicate: SetPredicateId) {
  return universe.filter((value) => satisfiesSetPredicate(value, predicate));
}

export function powerSet<T>(source: T[]) {
  return Array.from({ length: 2 ** source.length }, (_, mask) => source.filter((_, index) => Boolean(mask & (1 << index))));
}

export function computeSetOperation(a: number[], b: number[], operation: SetOperationId) {
  const left = new Set(a); const right = new Set(b);
  const universe = Array.from(new Set([...a, ...b])).sort((x, y) => x - y);
  if (operation === "union") return universe;
  if (operation === "intersection") return universe.filter((value) => left.has(value) && right.has(value));
  if (operation === "a-minus-b") return a.filter((value) => !right.has(value));
  if (operation === "b-minus-a") return b.filter((value) => !left.has(value));
  return universe.filter((value) => left.has(value) !== right.has(value));
}

export function classifyTruthResults(results: boolean[]) {
  if (results.length && results.every(Boolean)) return "tautology" as const;
  if (results.length && results.every((value) => !value)) return "contradiction" as const;
  return "contingency" as const;
}

export function quartileSummary(input: number[]) {
  const sorted = [...input].filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return { sorted, min: 0, q1: 0, median: 0, q3: 0, max: 0, iqr: 0, lowerFence: 0, upperFence: 0, whiskerMin: 0, whiskerMax: 0, outliers: [] as number[] };
  const middle = medianOfSorted(sorted);
  const midpoint = Math.floor(sorted.length / 2);
  const lower = sorted.slice(0, midpoint);
  const upper = sorted.slice(sorted.length % 2 ? midpoint + 1 : midpoint);
  const q1 = medianOfSorted(lower.length ? lower : sorted);
  const q3 = medianOfSorted(upper.length ? upper : sorted);
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr; const upperFence = q3 + 1.5 * iqr;
  const nonOutliers = sorted.filter((value) => value >= lowerFence && value <= upperFence);
  return {
    sorted,
    min: sorted[0], q1, median: middle, q3, max: sorted.at(-1)!, iqr, lowerFence, upperFence,
    whiskerMin: nonOutliers[0] ?? sorted[0], whiskerMax: nonOutliers.at(-1) ?? sorted.at(-1)!,
    outliers: sorted.filter((value) => value < lowerFence || value > upperFence),
  };
}

export function eigenInfo2x2(a: number, b: number, c: number, d: number) {
  const trace = a + d; const determinant = a * d - b * c; const discriminant = trace * trace - 4 * determinant;
  if (discriminant < 0) return { trace, determinant, discriminant, real: false as const, eigenvalues: [] as number[], eigenvectors: [] as Array<{ x: number; y: number }> };
  const root = Math.sqrt(discriminant);
  const eigenvalues = [(trace + root) / 2, (trace - root) / 2];
  const eigenvectors = eigenvalues.map((lambda) => normalizeVector(eigenvectorFor(a, b, c, d, lambda)));
  return { trace, determinant, discriminant, real: true as const, eigenvalues, eigenvectors };
}

export function transformVector2x2(a: number, b: number, c: number, d: number, vector: { x: number; y: number }) {
  return { x: a * vector.x + b * vector.y, y: c * vector.x + d * vector.y };
}

export function vectorAlignmentDegrees(left: { x: number; y: number }, right: { x: number; y: number }) {
  const denominator = Math.hypot(left.x, left.y) * Math.hypot(right.x, right.y);
  if (denominator < 1e-10) return 90;
  const cosine = Math.max(-1, Math.min(1, (left.x * right.x + left.y * right.y) / denominator));
  const angle = Math.acos(cosine) * 180 / Math.PI;
  return Math.min(angle, 180 - angle);
}

export function odeSlope(rule: OdeRuleId, x: number, y: number) {
  return rule === "exponential" ? y : x - y;
}

export function eulerSolution(rule: OdeRuleId, x0: number, y0: number, step: number, count = 24) {
  const forward = [{ x: x0, y: y0 }];
  for (let index = 0; index < count; index += 1) {
    const current = forward.at(-1)!;
    forward.push({ x: current.x + step, y: current.y + step * odeSlope(rule, current.x, current.y) });
  }
  const backward = [{ x: x0, y: y0 }];
  for (let index = 0; index < count; index += 1) {
    const current = backward.at(-1)!;
    backward.push({ x: current.x - step, y: current.y - step * odeSlope(rule, current.x, current.y) });
  }
  return [...backward.reverse().slice(0, -1), ...forward];
}

export function simpleInterestModel(principal: number, annualRatePercent: number, timeYears: number) {
  const rate = annualRatePercent / 100;
  const interest = principal * rate * timeYears;
  const amount = principal + interest;
  const steps = Math.max(1, Math.ceil(timeYears));
  const table = Array.from({ length: steps + 1 }, (_, index) => {
    const time = Math.min(timeYears, index);
    return { time, interest: principal * rate * time, amount: principal * (1 + rate * time) };
  });
  if (table.at(-1)?.time !== timeYears) table.push({ time: timeYears, interest, amount });
  return { rate, interest, amount, table };
}

export const cubeFacePairs: Record<string, string> = {
  front: "front", back: "back", left: "left", right: "right", top: "top", bottom: "bottom",
};

function medianOfSorted(values: number[]) {
  const middle = Math.floor(values.length / 2);
  return values.length % 2 ? values[middle] : (values[middle - 1] + values[middle]) / 2;
}

function eigenvectorFor(a: number, b: number, c: number, d: number, lambda: number) {
  const aa = a - lambda; const dd = d - lambda;
  if (Math.abs(b) + Math.abs(aa) > Math.abs(c) + Math.abs(dd)) return Math.abs(b) > 1e-8 ? { x: b, y: -aa } : { x: -dd, y: c };
  return Math.abs(dd) > 1e-8 ? { x: dd, y: -c } : { x: -b, y: aa };
}

function normalizeVector(vector: { x: number; y: number }) {
  const magnitude = Math.hypot(vector.x, vector.y) || 1;
  return { x: vector.x / magnitude, y: vector.y / magnitude };
}

