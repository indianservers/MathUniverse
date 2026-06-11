import { compileFunctionExpression, compileTwoVariableExpression } from "../utils/functionParser";

export type GraphKind = "explicit" | "implicit" | "parametric" | "polar" | "piecewise" | "inequality";

export type SamplePoint = { x: number; y: number; move?: boolean };
export type SegmentSample = { points: SamplePoint[]; reason?: string };
export type ImplicitCell = { x: number; y: number; width: number; height: number };
export type ParameterRange = { min: number; max: number };

export type GraphDescriptor =
  | { kind: "explicit"; expression: string }
  | { kind: "implicit"; left: string; right: string }
  | { kind: "parametric"; xExpression: string; yExpression: string; parameter: string; range?: ParameterRange }
  | { kind: "polar"; rExpression: string; parameter: string; range?: ParameterRange }
  | { kind: "piecewise"; branches: PiecewiseBranch[] }
  | { kind: "inequality"; left: string; operator: "<" | "<=" | ">" | ">="; right: string };

export type PiecewiseBranch = {
  expression: string;
  condition?: string;
};

export type GraphViewport = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

export type GraphSample =
  | { kind: "explicit" | "parametric" | "polar" | "piecewise"; segments: SegmentSample[]; warnings: string[] }
  | { kind: "implicit"; cells: ImplicitCell[]; segments: SegmentSample[]; warnings: string[] }
  | { kind: "inequality"; cells: ImplicitCell[]; warnings: string[] };

const DEFAULT_VIEWPORT: GraphViewport = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };

export function parseGraphDescriptor(input: string): GraphDescriptor {
  const expression = input.trim();
  if (isPiecewiseExpression(expression)) return { kind: "piecewise", branches: parsePiecewise(expression) };
  const inequality = expression.match(/^(.+?)(<=|>=|<|>)(.+)$/);
  if (inequality) {
    return { kind: "inequality", left: cleanSide(inequality[1]), operator: inequality[2] as "<" | "<=" | ">" | ">=", right: cleanSide(inequality[3]) };
  }
  const polar = parsePolar(expression);
  if (polar) return polar;
  const parametric = parseParametric(expression);
  if (parametric) return parametric;
  const equality = splitTopLevelEquality(expression);
  if (equality && /(^|[^a-z])y([^a-z]|$)/i.test(equality.left + equality.right)) {
    return { kind: "implicit", left: cleanSide(equality.left), right: cleanSide(equality.right) };
  }
  return { kind: "explicit", expression: cleanSide(expression.replace(/^y\s*=/i, "")) };
}

export function sampleGraph(input: string | GraphDescriptor, viewport: Partial<GraphViewport> = {}, samples = 480): GraphSample {
  const descriptor = typeof input === "string" ? parseGraphDescriptor(input) : input;
  const view = { ...DEFAULT_VIEWPORT, ...viewport };
  if (descriptor.kind === "explicit") return { kind: "explicit", segments: sampleExplicit(descriptor.expression, view, samples), warnings: [] };
  if (descriptor.kind === "piecewise") return { kind: "piecewise", segments: samplePiecewise(descriptor.branches, view, samples), warnings: [] };
  if (descriptor.kind === "parametric") return { kind: "parametric", segments: sampleParametric(descriptor, view, samples), warnings: [] };
  if (descriptor.kind === "polar") return { kind: "polar", segments: samplePolar(descriptor, view, samples), warnings: [] };
  if (descriptor.kind === "implicit") {
    const implicit = sampleImplicit(descriptor.left, descriptor.right, view);
    return { kind: "implicit", cells: implicit.cells, segments: implicit.segments, warnings: implicit.segments.length ? [] : ["No visible contour found in the current viewport."] };
  }
  return { kind: "inequality", cells: sampleInequality(descriptor, view), warnings: [] };
}

function sampleExplicit(expression: string, viewport: GraphViewport, samples: number) {
  const fn = compileFunctionExpression(expression);
  const points: SamplePoint[] = [];
  let previous: SamplePoint | null = null;
  for (let index = 0; index <= samples; index += 1) {
    const x = viewport.xMin + ((viewport.xMax - viewport.xMin) * index) / samples;
    const y = fn(x);
    if (!Number.isFinite(y) || Math.abs(y) > Math.max(1e6, Math.abs(viewport.yMax - viewport.yMin) * 1e4)) {
      previous = null;
      continue;
    }
    const move: boolean = !previous || Math.abs(y - previous.y) > Math.max(8, (viewport.yMax - viewport.yMin) * 0.5);
    const point: SamplePoint = { x, y, move };
    points.push(point);
    previous = point;
  }
  return splitSegments(points);
}

function samplePiecewise(branches: PiecewiseBranch[], viewport: GraphViewport, samples: number) {
  const compiled = branches.map((branch) => ({
    fn: compileFunctionExpression(branch.expression),
    condition: branch.condition ? compileCondition(branch.condition) : undefined,
  }));
  const points: SamplePoint[] = [];
  let previous: SamplePoint | null = null;
  for (let index = 0; index <= samples; index += 1) {
    const x = viewport.xMin + ((viewport.xMax - viewport.xMin) * index) / samples;
    const branch = compiled.find((candidate) => !candidate.condition || candidate.condition(x));
    if (!branch) {
      previous = null;
      continue;
    }
    const y = branch.fn(x);
    if (!Number.isFinite(y)) {
      previous = null;
      continue;
    }
    const move: boolean = !previous || Math.abs(y - previous.y) > Math.max(8, (viewport.yMax - viewport.yMin) * 0.5);
    const point: SamplePoint = { x, y, move };
    points.push(point);
    previous = point;
  }
  return splitSegments(points);
}

function sampleParametric(descriptor: Extract<GraphDescriptor, { kind: "parametric" }>, viewport: GraphViewport, samples: number) {
  const fx = compileFunctionExpression(rewriteParameter(descriptor.xExpression, descriptor.parameter));
  const fy = compileFunctionExpression(rewriteParameter(descriptor.yExpression, descriptor.parameter));
  const range = descriptor.range ?? { min: -2 * Math.PI, max: 2 * Math.PI };
  const points: SamplePoint[] = [];
  for (let index = 0; index <= samples; index += 1) {
    const t = range.min + ((range.max - range.min) * index) / samples;
    const x = fx(t);
    const y = fy(t);
    if (Number.isFinite(x) && Number.isFinite(y) && x >= viewport.xMin - 50 && x <= viewport.xMax + 50 && y >= viewport.yMin - 50 && y <= viewport.yMax + 50) points.push({ x, y, move: index === 0 });
  }
  return splitSegments(points);
}

function samplePolar(descriptor: Extract<GraphDescriptor, { kind: "polar" }>, viewport: GraphViewport, samples: number) {
  const fr = compileFunctionExpression(rewriteParameter(descriptor.rExpression, descriptor.parameter));
  const range = descriptor.range ?? { min: -2 * Math.PI, max: 2 * Math.PI };
  const points: SamplePoint[] = [];
  for (let index = 0; index <= samples; index += 1) {
    const theta = range.min + ((range.max - range.min) * index) / samples;
    const r = fr(theta);
    if (!Number.isFinite(r)) continue;
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    if (x >= viewport.xMin - 50 && x <= viewport.xMax + 50 && y >= viewport.yMin - 50 && y <= viewport.yMax + 50) points.push({ x, y, move: index === 0 });
  }
  return splitSegments(points);
}

function sampleImplicit(left: string, right: string, viewport: GraphViewport, grid = 96) {
  const fn = compileTwoVariableExpression(`(${left})-(${right})`);
  const cells: ImplicitCell[] = [];
  const segments: SegmentSample[] = [];
  const dx = (viewport.xMax - viewport.xMin) / grid;
  const dy = (viewport.yMax - viewport.yMin) / grid;
  for (let ix = 0; ix < grid; ix += 1) {
    for (let iy = 0; iy < grid; iy += 1) {
      const x = viewport.xMin + ix * dx;
      const y = viewport.yMin + iy * dy;
      const corners = [
        { x, y, value: fn(x, y) },
        { x: x + dx, y, value: fn(x + dx, y) },
        { x: x + dx, y: y + dy, value: fn(x + dx, y + dy) },
        { x, y: y + dy, value: fn(x, y + dy) },
      ];
      const values = corners.map((corner) => corner.value).filter(Number.isFinite);
      if (values.length >= 2 && Math.min(...values) <= 0 && Math.max(...values) >= 0) {
        cells.push({ x, y, width: dx, height: dy });
        segments.push(...contourSegmentsForCell(corners));
      }
    }
  }
  return { cells, segments };
}

function sampleInequality(descriptor: Extract<GraphDescriptor, { kind: "inequality" }>, viewport: GraphViewport, grid = 80) {
  const fn = compileTwoVariableExpression(`(${descriptor.left})-(${descriptor.right})`);
  const cells: ImplicitCell[] = [];
  const dx = (viewport.xMax - viewport.xMin) / grid;
  const dy = (viewport.yMax - viewport.yMin) / grid;
  for (let ix = 0; ix < grid; ix += 1) {
    for (let iy = 0; iy < grid; iy += 1) {
      const x = viewport.xMin + (ix + 0.5) * dx;
      const y = viewport.yMin + (iy + 0.5) * dy;
      if (testInequality(fn(x, y), descriptor.operator)) cells.push({ x: viewport.xMin + ix * dx, y: viewport.yMin + iy * dy, width: dx, height: dy });
    }
  }
  return cells;
}

function splitSegments(points: SamplePoint[]): SegmentSample[] {
  const segments: SegmentSample[] = [];
  let current: SamplePoint[] = [];
  points.forEach((point) => {
    if (point.move && current.length) {
      segments.push({ points: current, reason: "discontinuity" });
      current = [];
    }
    current.push(point);
  });
  if (current.length) segments.push({ points: current });
  return segments;
}

function contourSegmentsForCell(corners: Array<{ x: number; y: number; value: number }>): SegmentSample[] {
  if (corners.some((corner) => !Number.isFinite(corner.value))) return [];
  const edgePairs: Array<[number, number]> = [[0, 1], [1, 2], [2, 3], [3, 0]];
  const hits = edgePairs.flatMap(([leftIndex, rightIndex]) => {
    const left = corners[leftIndex];
    const right = corners[rightIndex];
    if (left.value === 0) return [{ x: left.x, y: left.y }];
    if (right.value === 0) return [{ x: right.x, y: right.y }];
    if ((left.value < 0 && right.value < 0) || (left.value > 0 && right.value > 0)) return [];
    const ratio = Math.abs(left.value) / (Math.abs(left.value) + Math.abs(right.value));
    return [{ x: left.x + (right.x - left.x) * ratio, y: left.y + (right.y - left.y) * ratio }];
  });
  const unique = dedupePoints(hits);
  if (unique.length < 2) return [];
  if (unique.length === 2) return [{ points: unique }];
  return [
    { points: [unique[0], unique[1]] },
    { points: [unique[2], unique[3] ?? unique[0]] },
  ];
}

function dedupePoints(points: SamplePoint[]) {
  return points.filter((point, index) => points.findIndex((candidate) => Math.hypot(candidate.x - point.x, candidate.y - point.y) < 1e-9) === index);
}

function parseParametric(expression: string): Extract<GraphDescriptor, { kind: "parametric" }> | null {
  const compact = expression.trim();
  const parts = splitTopLevelCommas(trimWrappingParens(compact));
  if (parts.length < 2) return null;
  const xPart = parts[0].match(/^x\s*=\s*(.+)$/i)?.[1] ?? parts[0];
  const yPart = parts[1].match(/^y\s*=\s*(.+)$/i)?.[1] ?? parts[1];
  const parameter = parameterNameFrom(parts.slice(0, 2).join(","), "t");
  if (!new RegExp(`\\b${parameter}\\b`, "i").test(xPart + yPart)) return null;
  return { kind: "parametric", xExpression: xPart.trim(), yExpression: yPart.trim(), parameter, range: parseParameterRange(parts.slice(2).join(","), parameter) };
}

function parsePolar(expression: string): Extract<GraphDescriptor, { kind: "polar" }> | null {
  const parts = splitTopLevelCommas(expression);
  const first = parts[0]?.trim();
  if (!/^r\s*=/i.test(first)) return null;
  const parameter = parameterNameFrom(parts.join(","), "theta");
  return { kind: "polar", rExpression: cleanSide(first.replace(/^r\s*=/i, "")), parameter, range: parseParameterRange(parts.slice(1).join(","), parameter) };
}

function splitTopLevelCommas(expression: string) {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < expression.length; index += 1) {
    const char = expression[index];
    if (char === "(" || char === "[" || char === "{") depth += 1;
    if (char === ")" || char === "]" || char === "}") depth -= 1;
    if (char === "," && depth === 0) {
      parts.push(expression.slice(start, index).trim());
      start = index + 1;
    }
  }
  parts.push(expression.slice(start).trim());
  return parts.filter(Boolean);
}

function trimWrappingParens(expression: string) {
  const trimmed = expression.trim();
  return trimmed.startsWith("(") && trimmed.endsWith(")") ? trimmed.slice(1, -1).trim() : trimmed;
}

function parameterNameFrom(expression: string, fallback: string) {
  if (/\btheta\b/i.test(expression)) return "theta";
  if (/\bt\b/i.test(expression)) return "t";
  const match = expression.match(/\b([a-z])\b/gi)?.find((token) => !["x", "y", "r"].includes(token.toLowerCase()));
  return match ? match.toLowerCase() : fallback;
}

function parseParameterRange(expression: string, parameter: string): ParameterRange | undefined {
  if (!expression.trim()) return undefined;
  const compact = expression.trim();
  const assignment = compact.match(new RegExp(`^${parameter}\\s*=\\s*(.+)$`, "i"))?.[1] ?? compact;
  const range = assignment.match(/^(.+?)(?:\.\.|:)(.+)$/);
  if (!range) return undefined;
  try {
    const min = compileFunctionExpression(range[1])(0);
    const max = compileFunctionExpression(range[2])(0);
    if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) return undefined;
    return min < max ? { min, max } : { min: max, max: min };
  } catch {
    return undefined;
  }
}

function isPiecewiseExpression(expression: string) {
  return /^piecewise\s*\[/i.test(expression) || /^if\s*\(/i.test(expression) || expression.includes("{");
}

function parsePiecewise(expression: string): PiecewiseBranch[] {
  const ifMatch = expression.match(/^if\s*\((.+?),(.+?),(.+)\)$/i);
  if (ifMatch) return [{ condition: ifMatch[1].trim(), expression: ifMatch[2].trim() }, { expression: ifMatch[3].trim() }];
  const body = expression.replace(/^piecewise\s*\[/i, "").replace(/]$/, "").replace(/[{}]/g, "");
  return body.split(";").map((part) => {
    const [condition, branchExpression] = part.includes(":") ? part.split(":") : ["", part];
    return { condition: condition.trim() || undefined, expression: branchExpression.trim() };
  }).filter((branch) => branch.expression);
}

function compileCondition(condition: string) {
  const match = condition.match(/^(.+?)(<=|>=|<|>|==)(.+)$/);
  if (!match) return () => true;
  const left = compileFunctionExpression(match[1]);
  const right = compileFunctionExpression(match[3]);
  return (x: number) => {
    const delta = left(x) - right(x);
    if (match[2] === "<") return delta < 0;
    if (match[2] === "<=") return delta <= 0;
    if (match[2] === ">") return delta > 0;
    if (match[2] === ">=") return delta >= 0;
    return Math.abs(delta) < 1e-9;
  };
}

function rewriteParameter(expression: string, parameter: string) {
  return expression.replace(new RegExp(`\\b${parameter}\\b`, "gi"), "x").replace(/\btheta\b/gi, "x");
}

function splitTopLevelEquality(expression: string) {
  let depth = 0;
  for (let index = 0; index < expression.length; index += 1) {
    const char = expression[index];
    if (char === "(" || char === "[" || char === "{") depth += 1;
    if (char === ")" || char === "]" || char === "}") depth -= 1;
    if (char === "=" && depth === 0 && expression[index - 1] !== "<" && expression[index - 1] !== ">" && expression[index + 1] !== "=") {
      return { left: expression.slice(0, index), right: expression.slice(index + 1) };
    }
  }
  return null;
}

function testInequality(value: number, operator: "<" | "<=" | ">" | ">=") {
  if (!Number.isFinite(value)) return false;
  if (operator === "<") return value < 0;
  if (operator === "<=") return value <= 0;
  if (operator === ">") return value > 0;
  return value >= 0;
}

function cleanSide(value: string) {
  return value.trim().replace(/^y\s*=/i, "");
}
