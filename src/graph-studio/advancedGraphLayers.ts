import type { GraphSample } from "../utils/mathEngine/graphSampler";
import { compileFunctionExpression, compileTwoVariableExpression } from "../utils/functionParser";

export type AdvancedGraphStyle = "line" | "points" | "vectors";

export type AdvancedGraphSample = {
  points: GraphSample[];
  normalized: string;
  style: AdvancedGraphStyle;
  family: "sequence" | "recurrence" | "contour" | "polar-range" | "vector-field" | "slope-field";
  error?: string;
};

const MAX_DISCRETE_TERMS = 500;
const MAX_FIELD_ARROWS = 625;

export function sampleAdvancedGraphExpression(input: string, xMin: number, xMax: number): AdvancedGraphSample | null {
  const normalized = input.trim().replace(/\u03b8/gi, "theta").replace(/\s+/g, "");
  const sequence = callArguments(normalized, "seq");
  if (sequence) return safeSample(normalized, "sequence", "points", () => sampleSequence(sequence));

  const recurrence = callArguments(normalized, "recur");
  if (recurrence) return safeSample(normalized, "recurrence", "points", () => sampleRecurrence(recurrence));

  const contour = callArguments(normalized, "contour");
  if (contour) return safeSample(normalized, "contour", "line", () => sampleContours(contour, xMin, xMax));

  const vector = callArguments(normalized, "vector");
  if (vector) return safeSample(normalized, "vector-field", "vectors", () => sampleVectorField(vector, xMin, xMax));

  const slope = callArguments(normalized, "slope");
  if (slope) return safeSample(normalized, "slope-field", "vectors", () => sampleSlopeField(slope, xMin, xMax));

  const polarRange = normalized.match(/^r=(.+),theta=(-?(?:pi|\d+(?:\.\d+)?))\.\.(-?(?:pi|\d+(?:\.\d+)?))$/i);
  if (polarRange) return safeSample(normalized, "polar-range", "line", () => samplePolarRange(polarRange[1], parseBound(polarRange[2]), parseBound(polarRange[3])));
  return null;
}

function sampleSequence(args: string[]) {
  if (args.length < 1 || args.length > 3) throw new Error("Use seq(expression, start, end).");
  const start = args[1] === undefined ? 0 : integer(args[1], "Sequence start");
  const end = args[2] === undefined ? start + 20 : integer(args[2], "Sequence end");
  if (end < start) throw new Error("Sequence end must be at least the start.");
  const count = Math.min(MAX_DISCRETE_TERMS, end - start + 1);
  const fn = compileFunctionExpression(args[0].replace(/\bn\b/gi, "x"));
  return Array.from({ length: count }, (_, index) => {
    const n = start + index;
    const y = fn(n);
    return Number.isFinite(y) ? { x: n, y, valid: true } : { x: n, y: null, valid: false };
  });
}

function sampleRecurrence(args: string[]) {
  if (args.length !== 3) throw new Error("Use recur(initial, next-expression, count). In the next expression, prev is the previous term and n is its index.");
  let value = Number(args[0]);
  const count = Math.min(MAX_DISCRETE_TERMS, Math.max(1, integer(args[2], "Recurrence count")));
  if (!Number.isFinite(value)) throw new Error("Recurrence initial value must be numeric.");
  const next = compileTwoVariableExpression(args[1].replace(/\bprev\b/gi, "x").replace(/\bn\b/gi, "y"));
  const points: GraphSample[] = [];
  for (let n = 0; n < count; n += 1) {
    points.push(Number.isFinite(value) ? { x: n, y: value, valid: true } : { x: n, y: null, valid: false });
    value = next(value, n);
  }
  return points;
}

function sampleContours(args: string[], min: number, max: number) {
  if (args.length !== 2) throw new Error("Use contour(expression, level) or contour(expression, level1;level2).");
  const fn = compileTwoVariableExpression(args[0]);
  const levels = args[1].split(";").map(Number).filter(Number.isFinite).slice(0, 12);
  if (!levels.length) throw new Error("Contour levels must be numeric.");
  return levels.flatMap((level) => sampleImplicit((x, y) => fn(x, y) - level, min, max, 92));
}

function sampleVectorField(args: string[], min: number, max: number) {
  if (args.length !== 2) throw new Error("Use vector(x-component, y-component).");
  const xFn = compileTwoVariableExpression(args[0]);
  const yFn = compileTwoVariableExpression(args[1]);
  return sampleField(min, max, (x, y) => ({ dx: xFn(x, y), dy: yFn(x, y) }));
}

function sampleSlopeField(args: string[], min: number, max: number) {
  if (args.length !== 1) throw new Error("Use slope(dy/dx expression).");
  const fn = compileTwoVariableExpression(args[0]);
  return sampleField(min, max, (x, y) => ({ dx: 1, dy: fn(x, y) }));
}

function sampleField(min: number, max: number, evaluate: (x: number, y: number) => { dx: number; dy: number }) {
  const span = Math.max(0.1, max - min);
  const columns = Math.min(25, Math.max(9, Math.round(span * 1.2)));
  const rows = columns;
  const length = span / columns * 0.7;
  const points: GraphSample[] = [];
  for (let row = 0; row < rows && row * columns < MAX_FIELD_ARROWS; row += 1) {
    const y = min + (row + 0.5) / rows * span;
    for (let column = 0; column < columns; column += 1) {
      const x = min + (column + 0.5) / columns * span;
      const vector = evaluate(x, y);
      const magnitude = Math.hypot(vector.dx, vector.dy);
      if (!Number.isFinite(magnitude) || magnitude < 1e-12) continue;
      const dx = vector.dx / magnitude * length / 2;
      const dy = vector.dy / magnitude * length / 2;
      points.push({ x: x - dx, y: y - dy, valid: true }, { x: x + dx, y: y + dy, valid: true }, { x, y: null, valid: false });
    }
  }
  return points;
}

function samplePolarRange(expression: string, start: number, end: number) {
  if (!(end > start)) throw new Error("Polar angle end must be greater than the start.");
  const fn = compileFunctionExpression(expression.replace(/theta/gi, "x"));
  return Array.from({ length: 720 }, (_, index) => {
    const theta = start + index / 719 * (end - start);
    const radius = fn(theta);
    return Number.isFinite(radius) ? { x: radius * Math.cos(theta), y: radius * Math.sin(theta), valid: true } : { x: theta, y: null, valid: false };
  });
}

function sampleImplicit(fn: (x: number, y: number) => number, min: number, max: number, resolution: number) {
  const points: GraphSample[] = [];
  const step = (max - min) / resolution;
  for (let row = 0; row < resolution; row += 1) {
    const y = min + row * step;
    for (let column = 0; column < resolution; column += 1) {
      const x = min + column * step;
      const corners = [{ x, y }, { x: x + step, y }, { x: x + step, y: y + step }, { x, y: y + step }].map((point) => ({ ...point, value: fn(point.x, point.y) }));
      if (!corners.every((corner) => Number.isFinite(corner.value))) continue;
      const hits = [[0, 1], [1, 2], [2, 3], [3, 0]].flatMap(([from, to]) => {
        const a = corners[from]; const b = corners[to];
        if (a.value !== 0 && b.value !== 0 && Math.sign(a.value) === Math.sign(b.value)) return [];
        const ratio = Math.abs(a.value - b.value) < 1e-12 ? 0.5 : a.value / (a.value - b.value);
        return [{ x: a.x + (b.x - a.x) * ratio, y: a.y + (b.y - a.y) * ratio, valid: true } as GraphSample];
      });
      for (let index = 0; index + 1 < hits.length; index += 2) points.push(hits[index], hits[index + 1], { x, y: null, valid: false });
    }
  }
  return points;
}

function safeSample(normalized: string, family: AdvancedGraphSample["family"], style: AdvancedGraphStyle, sample: () => GraphSample[]): AdvancedGraphSample {
  try { return { points: sample(), normalized, style, family }; }
  catch (error) { return { points: [], normalized, style, family, error: error instanceof Error ? error.message : "Invalid advanced graph layer." }; }
}

function callArguments(input: string, name: string) {
  const prefix = `${name}(`;
  if (!input.toLowerCase().startsWith(prefix) || !input.endsWith(")")) return null;
  return splitTopLevel(input.slice(prefix.length, -1));
}

function splitTopLevel(value: string) {
  const parts: string[] = []; let depth = 0; let start = 0;
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === "(") depth += 1;
    if (value[index] === ")") depth -= 1;
    if (value[index] === "," && depth === 0) { parts.push(value.slice(start, index)); start = index + 1; }
  }
  parts.push(value.slice(start));
  return parts;
}

function integer(value: string, label: string) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) throw new Error(`${label} must be an integer.`);
  return parsed;
}

function parseBound(value: string) {
  if (/^-?pi$/i.test(value)) return value.startsWith("-") ? -Math.PI : Math.PI;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error("Polar angle bounds must be numbers or pi.");
  return parsed;
}
