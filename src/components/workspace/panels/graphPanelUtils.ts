import { roundTo } from "../../../utils/math";
import { parseGraphDescriptor, sampleGraph } from "../../../workspace/graphSampler";

export type ResultTableRow = { x: number; y: number; label?: string };
export type PlotKind = "function" | "inequality" | "scatter" | "regression" | "implicit" | "parametric" | "polar" | "piecewise";
export type PlotItem = { id: string; expression: string; color: string; name?: string; kind?: PlotKind; points?: ResultTableRow[]; visible?: boolean; locked?: boolean; trace?: boolean };
export type GraphViewport = { xMin: number; xMax: number; yMin: number; yMax: number; width: number; height: number };

export type SampledPlotLayer = {
  id: string;
  color: string;
  kind: PlotKind | "error";
  paths: string[];
  cells: { x: number; y: number; width: number; height: number }[];
  error?: string;
};

export type RegressionModel = "linear" | "quadratic" | "exponential" | "polynomial";

export const graphInputPresets = [
  { label: "Circle implicit", expression: "x^2 + y^2 = 9" },
  { label: "Lissajous", expression: "x=3*sin(2*t), y=2*cos(3*t), t=0..2*pi" },
  { label: "Rose polar", expression: "r=4*sin(3*theta), theta=0..2*pi" },
  { label: "Piecewise", expression: "if(x<0,-x,x)" },
];

export function createGraphPlot(expression: string, color: string, kind?: PlotKind): PlotItem {
  return {
    id: crypto.randomUUID(),
    expression,
    color,
    kind: kind ?? inferPlotKind(expression),
    visible: true,
  };
}

export function buildAddedGraphPlots(plots: PlotItem[], expression: string, colors: string[], kind?: PlotKind) {
  return [createGraphPlot(expression, colors[plots.length % colors.length], kind), ...plots].slice(0, 10);
}

export function removeGraphPlotById(plots: PlotItem[], id: string) {
  return plots.filter((plot) => plot.id !== id);
}

export function samplePlotLayer(plot: PlotItem, viewport: GraphViewport, sliderA: number, sliderB: number): SampledPlotLayer {
  const expression = applyGraphParameters(plot.expression, sliderA, sliderB);
  if (plot.kind === "scatter" || plot.kind === "regression") {
    return { id: plot.id, color: plot.color, kind: plot.kind, paths: [graphPath(stripInequality(expression), viewport)].filter(Boolean), cells: [] };
  }
  try {
    const sample = sampleGraph(expression, viewport, 520);
    if (sample.kind === "implicit") {
      return {
        id: plot.id,
        color: plot.color,
        kind: "implicit",
        paths: sample.segments.map((segment) => graphSegmentPath(segment.points, viewport)).filter(Boolean),
        cells: sample.cells,
      };
    }
    if ("segments" in sample) {
      return {
        id: plot.id,
        color: plot.color,
        kind: sample.kind === "explicit" ? "function" : sample.kind,
        paths: sample.segments.map((segment) => graphSegmentPath(segment.points, viewport)).filter(Boolean),
        cells: [],
      };
    }
    return { id: plot.id, color: plot.color, kind: sample.kind, paths: [], cells: sample.cells };
  } catch (error) {
    return { id: plot.id, color: plot.color, kind: "error", paths: [], cells: [], error: error instanceof Error ? error.message : "Graph sampling failed" };
  }
}

export function graphSegmentPath(points: { x: number; y: number; move?: boolean }[], viewport: GraphViewport) {
  return points
    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
    .map((point, index) => `${index === 0 || point.move ? "M" : "L"}${scaleX(point.x, viewport).toFixed(2)},${scaleY(point.y, viewport).toFixed(2)}`)
    .join(" ");
}

export function graphPath(expression: string, viewport: GraphViewport) {
  const points: string[] = [];
  for (let i = 0; i <= 400; i += 1) {
    const x = viewport.xMin + (i / 400) * (viewport.xMax - viewport.xMin);
    const y = evaluateGraphExpression(expression, x);
    if (!Number.isFinite(y) || y < viewport.yMin - 50 || y > viewport.yMax + 50) continue;
    const sx = scaleX(x, viewport);
    const sy = scaleY(y, viewport);
    points.push(`${points.length ? "L" : "M"}${sx.toFixed(2)},${sy.toFixed(2)}`);
  }
  return points.join(" ");
}

export function inferPlotKind(expression: string): PlotKind {
  const kind = parseGraphDescriptor(expression).kind;
  return kind === "explicit" ? "function" : kind;
}

export function applyGraphParameters(expression: string, a: number, b: number) {
  return expression.replace(/\ba\b/g, `(${a})`).replace(/\bb\b/g, `(${b})`);
}

export function sampleTable(expression: string, label: string, start = -3, end = 3, step = 1) {
  const kind = parseGraphDescriptor(expression).kind;
  if (kind === "explicit" || kind === "piecewise" || kind === "inequality") {
    return generateValueTable(expression, start, end, step).map((row) => ({ ...row, label })).filter((row) => Number.isFinite(row.y));
  }
  try {
    const sample = sampleGraph(expression, { xMin: -10, xMax: 10, yMin: -10, yMax: 10 }, 160);
    const points = "segments" in sample ? sample.segments.flatMap((segment) => segment.points) : sample.cells.map((cell) => ({ x: cell.x + cell.width / 2, y: cell.y + cell.height / 2 }));
    const stride = Math.max(1, Math.floor(points.length / 80));
    return points.filter((_, index) => index % stride === 0).slice(0, 80).map((point) => ({ x: roundTo(point.x, 6), y: roundTo(point.y, 6), label }));
  } catch {
    return [];
  }
}

export function generateValueTable(expression: string, start: number, end: number, step: number) {
  const rows: ResultTableRow[] = [];
  const direction = start <= end ? 1 : -1;
  const safeStep = Math.max(Math.abs(step), 0.0001) * direction;
  for (let x = start; direction > 0 ? x <= end + 1e-9 : x >= end - 1e-9; x += safeStep) {
    try {
      rows.push({ x: roundTo(x, 6), y: roundTo(evaluateGraphExpression(stripInequality(expression), x), 6) });
    } catch {
      rows.push({ x: roundTo(x, 6), y: Number.NaN });
    }
    if (rows.length >= 160) break;
  }
  return rows.filter((row) => Number.isFinite(row.y));
}

export function stripInequality(expression: string) {
  const match = expression.match(/[<>]=?\s*(.+)$/);
  if (match) return match[1];
  return expression.replace(/^y\s*=\s*/i, "");
}

export function scaleX(x: number, viewport: GraphViewport) {
  return ((x - viewport.xMin) / (viewport.xMax - viewport.xMin || 1)) * viewport.width;
}

export function scaleY(y: number, viewport: GraphViewport) {
  return viewport.height - ((y - viewport.yMin) / (viewport.yMax - viewport.yMin || 1)) * viewport.height;
}

export function linearRegression(points: ResultTableRow[]) {
  const n = points.length || 1;
  const sumX = points.reduce((sum, point) => sum + point.x, 0);
  const sumY = points.reduce((sum, point) => sum + point.y, 0);
  const sumXY = points.reduce((sum, point) => sum + point.x * point.y, 0);
  const sumXX = points.reduce((sum, point) => sum + point.x * point.x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept, expression: `${roundTo(slope, 4)}*x${intercept >= 0 ? "+" : ""}${roundTo(intercept, 4)}` };
}

export function regressionModel(points: ResultTableRow[], model: RegressionModel) {
  const clean = points.filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
  if (model === "linear") {
    const fit = linearRegression(clean);
    return { expression: fit.expression, detail: `Linear least-squares fit y = ${fit.expression}.` };
  }
  if (model === "exponential") {
    const positive = clean.filter((point) => point.y > 0);
    const fit = linearRegression(positive.map((point) => ({ x: point.x, y: Math.log(point.y) })));
    const a = Math.exp(fit.intercept);
    const b = fit.slope;
    return { expression: `${roundTo(a, 5)}*exp(${roundTo(b, 5)}*x)`, detail: "Exponential regression by fitting ln(y)=ln(a)+b*x." };
  }
  const degree = model === "quadratic" ? 2 : 3;
  const coeffs = polynomialRegression(clean, degree);
  const expression = coeffs.map((coeff, index) => {
    const power = degree - index;
    const rounded = roundTo(coeff, 5);
    if (Math.abs(rounded) < 1e-9) return "";
    if (power === 0) return `${rounded}`;
    if (power === 1) return `${rounded}*x`;
    return `${rounded}*x^${power}`;
  }).filter(Boolean).join("+").replace(/\+-/g, "-");
  return { expression: expression || "0", detail: `${model === "quadratic" ? "Quadratic" : "Cubic polynomial"} least-squares regression.` };
}

function polynomialRegression(points: ResultTableRow[], degree: number) {
  const size = degree + 1;
  const matrix = Array.from({ length: size }, (_, row) => Array.from({ length: size }, (_, col) => points.reduce((sum, point) => sum + point.x ** (row + col), 0)));
  const vector = Array.from({ length: size }, (_, row) => points.reduce((sum, point) => sum + point.y * point.x ** row, 0));
  const solved = solveLinearSystem(matrix, vector);
  return solved.reverse();
}

function solveLinearSystem(matrix: number[][], vector: number[]) {
  const n = vector.length;
  const augmented = matrix.map((row, index) => [...row, vector[index]]);
  for (let pivot = 0; pivot < n; pivot += 1) {
    let best = pivot;
    for (let row = pivot + 1; row < n; row += 1) if (Math.abs(augmented[row][pivot]) > Math.abs(augmented[best][pivot])) best = row;
    [augmented[pivot], augmented[best]] = [augmented[best], augmented[pivot]];
    const divisor = augmented[pivot][pivot] || 1;
    for (let col = pivot; col <= n; col += 1) augmented[pivot][col] /= divisor;
    for (let row = 0; row < n; row += 1) {
      if (row === pivot) continue;
      const factor = augmented[row][pivot];
      for (let col = pivot; col <= n; col += 1) augmented[row][col] -= factor * augmented[pivot][col];
    }
  }
  return augmented.map((row) => row[n]);
}

function evaluateGraphExpression(expression: string, x: number) {
  const safe = expression
    .replace(/\^/g, "**")
    .replace(/\bpi\b/gi, "Math.PI")
    .replace(/\be\b/g, "Math.E")
    .replace(/\bsin\b/gi, "Math.sin")
    .replace(/\bcos\b/gi, "Math.cos")
    .replace(/\btan\b/gi, "Math.tan")
    .replace(/\basin\b/gi, "Math.asin")
    .replace(/\bacos\b/gi, "Math.acos")
    .replace(/\batan\b/gi, "Math.atan")
    .replace(/\bsqrt\b/gi, "Math.sqrt")
    .replace(/\bcbrt\b/gi, "Math.cbrt")
    .replace(/\babs\b/gi, "Math.abs")
    .replace(/\bln\b/gi, "Math.log")
    .replace(/\blog\b/gi, "Math.log10")
    .replace(/\bexp\b/gi, "Math.exp");
  if (!/^[0-9x+*/().,\s*MATHPIEabceghilnopqrstxyz-]+$/i.test(safe) || /[;={}'"]/.test(safe) || safe.includes("[") || safe.includes("]")) throw new Error("Unsupported expression");
  return Function("x", `"use strict"; return (${safe});`)(x) as number;
}
