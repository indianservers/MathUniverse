import { compileFunctionExpression } from "../utils/functionParser";
import type { GraphSample } from "../utils/mathEngine/graphSampler";

export type GraphAsymptotes = { vertical: number[]; horizontal: number[] };

export function sampleTaylorPolynomial(
  expression: string,
  center: number,
  degree: number,
  xMin: number,
  xMax: number,
  samples = 700,
) {
  try {
    const fn = compileFunctionExpression(expression);
    const order = Math.max(1, Math.min(8, Math.round(degree)));
    const scale = Math.max(0.04, Math.min(0.35, (xMax - xMin) / 30));
    const nodes = Array.from(
      { length: order + 1 },
      (_, index) => center + (index - order / 2) * scale,
    );
    const matrix = nodes.map((x) => [
      ...Array.from({ length: order + 1 }, (_, power) => (x - center) ** power),
      fn(x),
    ]);
    const coefficients = solveLinear(matrix);
    if (!coefficients || coefficients.some((value) => !Number.isFinite(value)))
      return {
        points: [] as GraphSample[],
        coefficients: [],
        error: "Taylor approximation is unavailable at this centre.",
      };
    const points = Array.from({ length: samples }, (_, index) => {
      const x = xMin + (index / Math.max(1, samples - 1)) * (xMax - xMin);
      const offset = x - center;
      const y = coefficients.reduce(
        (sum, coefficient, power) => sum + coefficient * offset ** power,
        0,
      );
      return Number.isFinite(y)
        ? { x, y, valid: true }
        : { x, y: null, valid: false };
    });
    return { points, coefficients };
  } catch (error) {
    return {
      points: [] as GraphSample[],
      coefficients: [],
      error:
        error instanceof Error ? error.message : "Taylor approximation failed.",
    };
  }
}

export function detectGraphAsymptotes(
  points: GraphSample[],
  xMin: number,
  xMax: number,
): GraphAsymptotes {
  const vertical: number[] = [];
  const span = xMax - xMin;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const discontinuity =
      previous.valid !== current.valid ||
      (previous.y !== null &&
        current.y !== null &&
        Math.abs(current.y - previous.y) > Math.max(40, span * 8));
    if (discontinuity) vertical.push((previous.x + current.x) / 2);
  }
  const valid = points.filter(
    (point): point is GraphSample & { y: number } =>
      point.valid && point.y !== null,
  );
  const horizontal: number[] = [];
  const edge = Math.max(4, Math.floor(valid.length * 0.025));
  for (const sample of [valid.slice(0, edge), valid.slice(-edge)]) {
    if (sample.length < 3) continue;
    const mean =
      sample.reduce((sum, point) => sum + point.y, 0) / sample.length;
    const spread = Math.max(...sample.map((point) => Math.abs(point.y - mean)));
    if (spread < Math.max(0.04, Math.abs(mean) * 0.015)) horizontal.push(mean);
  }
  return {
    vertical: dedupe(vertical, span / 100),
    horizontal: dedupe(horizontal, 0.04),
  };
}

export function buildTransformationExpression(
  parent: string,
  a: number,
  b: number,
  h: number,
  k: number,
) {
  const base = parent.trim().replace(/^y\s*=\s*/i, "") || "x^2";
  const shifted = base.replace(/\bx\b/g, `((${format(b)})*(x-(${format(h)})))`);
  return `(${format(a)})*(${shifted})+(${format(k)})`;
}

export function sampleCobweb(
  initial: number,
  expression: string,
  count: number,
): GraphSample[] {
  const fn = compileFunctionExpression(expression.replace(/\bprev\b/gi, "x"));
  const points: GraphSample[] = [{ x: initial, y: 0, valid: true }];
  let value = initial;
  for (
    let index = 0;
    index < Math.min(250, Math.max(1, Math.round(count)));
    index += 1
  ) {
    const next = fn(value);
    if (!Number.isFinite(next)) break;
    points.push(
      { x: value, y: next, valid: true },
      { x: next, y: next, valid: true },
    );
    value = next;
  }
  return points;
}

export function precisionSnapX(
  value: number,
  candidates: Array<{ x: number }>,
  span: number,
) {
  const nearby = candidates.reduce<{ x: number } | null>(
    (best, candidate) =>
      Math.abs(candidate.x - value) <= span / 45 &&
      (!best || Math.abs(candidate.x - value) < Math.abs(best.x - value))
        ? candidate
        : best,
    null,
  );
  return nearby?.x ?? value;
}

function solveLinear(matrix: number[][]) {
  const size = matrix.length;
  const next = matrix.map((row) => [...row]);
  for (let column = 0; column < size; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < size; row += 1)
      if (Math.abs(next[row][column]) > Math.abs(next[pivot][column]))
        pivot = row;
    if (Math.abs(next[pivot][column]) < 1e-14) return null;
    [next[column], next[pivot]] = [next[pivot], next[column]];
    const divisor = next[column][column];
    for (let index = column; index <= size; index += 1)
      next[column][index] /= divisor;
    for (let row = 0; row < size; row += 1)
      if (row !== column) {
        const factor = next[row][column];
        for (let index = column; index <= size; index += 1)
          next[row][index] -= factor * next[column][index];
      }
  }
  return next.map((row) => row[size]);
}

function dedupe(values: number[], tolerance: number) {
  return values
    .filter(
      (value, index) =>
        values.findIndex(
          (candidate) => Math.abs(candidate - value) < tolerance,
        ) === index,
    )
    .slice(0, 8);
}
function format(value: number) {
  return Number(value.toFixed(6)).toString();
}
