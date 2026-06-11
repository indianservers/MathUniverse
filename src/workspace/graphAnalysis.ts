import { compileFunctionExpression } from "../utils/functionParser";

export type GraphAnalysisWindow = {
  xMin: number;
  xMax: number;
  samples?: number;
};

export type GraphCriticalPoint = {
  x: number;
  y: number;
  kind: "root" | "minimum" | "maximum" | "intersection";
};

export type TangentLine = {
  x: number;
  y: number;
  slope: number;
  equation: string;
};

export function findRoots(expression: string, window: GraphAnalysisWindow = { xMin: -20, xMax: 20 }): GraphCriticalPoint[] {
  const fn = compileFunctionExpression(expression);
  const roots = scanSignChanges(fn, window).map((interval) => bisect(fn, interval[0], interval[1]));
  return uniqueNumbers(roots, 1e-4).map((x) => ({ x: round(x), y: round(fn(x)), kind: "root" as const }));
}

export function findExtrema(expression: string, window: GraphAnalysisWindow = { xMin: -10, xMax: 10 }): GraphCriticalPoint[] {
  const fn = compileFunctionExpression(expression);
  const derivative = (x: number) => numericDerivative(fn, x);
  const roots = scanSignChanges(derivative, window).map((interval) => bisect(derivative, interval[0], interval[1]));
  return uniqueNumbers(roots, 1e-3).map((x) => {
    const second = numericDerivative(derivative, x);
    return { x: round(x), y: round(fn(x)), kind: second >= 0 ? "minimum" as const : "maximum" as const };
  });
}

export function findIntersections(firstExpression: string, secondExpression: string, window: GraphAnalysisWindow = { xMin: -20, xMax: 20 }): GraphCriticalPoint[] {
  const first = compileFunctionExpression(firstExpression);
  const second = compileFunctionExpression(secondExpression);
  const delta = (x: number) => first(x) - second(x);
  const hits = scanSignChanges(delta, window).map((interval) => bisect(delta, interval[0], interval[1]));
  return uniqueNumbers(hits, 1e-4).map((x) => ({ x: round(x), y: round(first(x)), kind: "intersection" as const }));
}

export function tangentAt(expression: string, x: number): TangentLine {
  const fn = compileFunctionExpression(expression);
  const y = fn(x);
  const slope = numericDerivative(fn, x);
  const intercept = y - slope * x;
  return {
    x: round(x),
    y: round(y),
    slope: round(slope),
    equation: `y=${round(slope)}*x${intercept >= 0 ? "+" : ""}${round(intercept)}`,
  };
}

export function analyzeExplicitGraph(expression: string, window: GraphAnalysisWindow = { xMin: -10, xMax: 10 }) {
  const roots = findRoots(expression, window);
  const extrema = findExtrema(expression, window);
  const tangentAtZero = tangentAt(expression, 0);
  return {
    expression,
    roots,
    extrema,
    tangentAtZero,
    yIntercept: tangentAtZero.y,
  };
}

function scanSignChanges(fn: (x: number) => number, window: GraphAnalysisWindow) {
  const samples = window.samples ?? 640;
  const intervals: Array<[number, number]> = [];
  let previousX = window.xMin;
  let previousY = safe(fn, previousX);
  for (let index = 1; index <= samples; index += 1) {
    const x = window.xMin + ((window.xMax - window.xMin) * index) / samples;
    const y = safe(fn, x);
    if (Number.isFinite(previousY) && Number.isFinite(y) && (previousY === 0 || y === 0 || previousY * y < 0)) intervals.push([previousX, x]);
    previousX = x;
    previousY = y;
  }
  return intervals;
}

function bisect(fn: (x: number) => number, low: number, high: number) {
  let lo = low;
  let hi = high;
  for (let index = 0; index < 48; index += 1) {
    const mid = (lo + hi) / 2;
    if (safe(fn, lo) * safe(fn, mid) <= 0) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

function numericDerivative(fn: (x: number) => number, x: number) {
  const h = 1e-4;
  return (fn(x + h) - fn(x - h)) / (2 * h);
}

function uniqueNumbers(values: number[], tolerance: number) {
  return values.filter((value, index) => Number.isFinite(value) && values.findIndex((other) => Math.abs(other - value) < tolerance) === index);
}

function safe(fn: (x: number) => number, x: number) {
  try {
    return fn(x);
  } catch {
    return Number.NaN;
  }
}

function round(value: number) {
  return Math.round(value * 1_000_000) / 1_000_000;
}
