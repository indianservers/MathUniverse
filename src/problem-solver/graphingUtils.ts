import type { ProblemClassification, ProblemSolverResult } from "./problemTypes";
import { generateValueTable, roundNumber, type ValueTableRow } from "./valueTable";

export type GraphPoint = {
  x: number;
  y: number | null;
};

export type GraphCurve = {
  color: string;
  expression: string;
  label: string;
  points: GraphPoint[];
};

export type GraphMarker = {
  color?: string;
  label: string;
  x: number;
  y: number;
};

export type GraphArea = {
  color?: string;
  expression: string;
  from: number;
  to: number;
  points: GraphPoint[];
};

export type ProblemVisualData = {
  areas?: GraphArea[];
  curves: GraphCurve[];
  description: string;
  markers: GraphMarker[];
  table: ValueTableRow[];
  title: string;
  viewport: Viewport;
  warnings: string[];
};

type Viewport = {
  xMax: number;
  xMin: number;
  yMax: number;
  yMin: number;
};

type LinearEquation = {
  a: number;
  b: number;
  c: number;
};

const defaultViewport: Viewport = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };
const sampleColor = "#0891b2";
const compareColor = "#f97316";
const derivativeColor = "#7c3aed";

export function compileFunction(expression: string): ((x: number) => number | null) | null {
  const normalized = normalizeExpression(expression);
  if (!normalized || /[^0-9x+\-*/^().,\sA-Za-z]/.test(normalized)) return null;
  const allowedWords = normalized.match(/[A-Za-z]+/g) ?? [];
  if (allowedWords.some((word) => !["x", "sin", "cos", "tan", "sqrt", "abs", "log", "ln", "exp", "pi"].includes(word.toLowerCase()))) return null;
  const jsExpression = normalized
    .replace(/\^/g, "**")
    .replace(/\bpi\b/gi, "Math.PI")
    .replace(/\bln\(/gi, "Math.log(")
    .replace(/\blog\(/gi, "Math.log(")
    .replace(/\bsin\(/gi, "Math.sin(")
    .replace(/\bcos\(/gi, "Math.cos(")
    .replace(/\btan\(/gi, "Math.tan(")
    .replace(/\bsqrt\(/gi, "Math.sqrt(")
    .replace(/\babs\(/gi, "Math.abs(")
    .replace(/\bexp\(/gi, "Math.exp(")
    .replace(/\bx\b/g, "(x)");
  if (!/^[\d+\-*/().,\sxMathPIlogsqrtabscintpe]+$/.test(jsExpression)) return null;
  return (x: number) => {
    try {
      const value = Number(Function("x", `"use strict"; return (${jsExpression});`)(x));
      return Number.isFinite(value) ? roundNumber(value) : null;
    } catch {
      return null;
    }
  };
}

export function generateFunctionPoints(expression: string, viewport = defaultViewport, count = 161): GraphPoint[] {
  const fn = compileFunction(expression);
  if (!fn) return [];
  return Array.from({ length: count }, (_, index) => {
    const x = viewport.xMin + (index / (count - 1)) * (viewport.xMax - viewport.xMin);
    return { x: roundNumber(x), y: fn(x) };
  });
}

export function buildVisualVerification(classification: ProblemClassification, result: ProblemSolverResult): ProblemVisualData | null {
  if (classification.kind === "linear-equation" || classification.kind === "quadratic-equation" || classification.kind === "polynomial-equation") {
    return equationVisual(classification, result);
  }
  if (classification.kind === "system") return systemVisual(classification, result);
  if (classification.kind === "derivative") return derivativeVisual(classification, result);
  if (classification.kind === "integral") return integralVisual(classification, result);
  if (classification.kind === "simplify" || classification.kind === "factor" || classification.kind === "expand") {
    return expressionVisual(classification.expression ?? classification.normalizedInput, "Expression Visual");
  }
  if (classification.kind === "evaluate" && /\bx\b/i.test(classification.expression ?? classification.normalizedInput)) {
    return expressionVisual(classification.expression ?? classification.normalizedInput, "Expression Visual");
  }
  return null;
}

export function rootsFromSolverResult(result: string): number[] {
  const match = result.match(/x\s*=\s*(.+)$/);
  if (!match) return [];
  return match[1].split(",").map((item) => Number(item.trim())).filter(Number.isFinite);
}

export function equationIntersectionData(equation: string, result: string) {
  const parts = equation.split("=");
  if (parts.length !== 2) return null;
  const left = normalizeExpression(parts[0]);
  const right = normalizeExpression(parts[1]);
  const leftFn = compileFunction(left);
  const rightFn = compileFunction(right);
  if (!leftFn || !rightFn) return null;
  const roots = rootsFromSolverResult(result);
  return {
    left,
    right,
    markers: roots.map((x) => ({ label: `x = ${formatNumber(x)}`, x, y: leftFn(x) })).filter((marker) => marker.y !== null) as GraphMarker[],
  };
}

export function systemIntersectionData(rawInput: string, result: string) {
  const equations = rawInput.replace(/^solve\s+/i, "").split(/\s+and\s+|;|\n/).map((item) => item.trim()).filter(Boolean);
  if (equations.length !== 2) return null;
  const parsed = equations.map(parseLinearEquation);
  if (parsed.some((item) => !item)) return null;
  const solution = parsePointSolution(result);
  if (!solution) return null;
  return {
    equations,
    expressions: parsed.map((equation) => linearToYExpression(equation as LinearEquation)),
    intersection: solution,
  };
}

function equationVisual(classification: ProblemClassification, result: ProblemSolverResult): ProblemVisualData | null {
  if (/all real numbers|no solution/i.test(result.result ?? "")) {
    return {
      curves: [],
      description: "Visual verification is not applicable for identity/contradiction equations.",
      markers: [],
      table: [],
      title: "Equation Visual Verification",
      viewport: defaultViewport,
      warnings: ["Visual verification is not applicable for identity/contradiction equations."],
    };
  }
  const equation = classification.normalizedInput;
  const intersection = equationIntersectionData(equation, result.result ?? "");
  if (!intersection) return null;
  const isZeroComparison = /^0(?:\.0+)?$/.test(intersection.right);
  const baseExpression = isZeroComparison ? intersection.left : `(${intersection.left})-(${intersection.right})`;
  const viewport = autoViewport([generateFunctionPoints(intersection.left), generateFunctionPoints(intersection.right)], intersection.markers);
  const curves: GraphCurve[] = isZeroComparison
    ? [{ color: sampleColor, expression: intersection.left, label: `y = ${formatForDisplay(intersection.left)}`, points: generateFunctionPoints(intersection.left, viewport) }]
    : [
        { color: sampleColor, expression: intersection.left, label: `y = ${formatForDisplay(intersection.left)}`, points: generateFunctionPoints(intersection.left, viewport) },
        { color: compareColor, expression: intersection.right, label: `y = ${formatForDisplay(intersection.right)}`, points: generateFunctionPoints(intersection.right, viewport) },
      ];
  const table = generateValueTable(compileFunction(baseExpression) ?? (() => null), tableXValues(result.result));
  return {
    curves,
    description: isZeroComparison ? "Graph the polynomial and mark its x-intercepts." : "Graph both sides and mark their intersection.",
    markers: intersection.markers.map((marker) => ({ ...marker, color: "#dc2626" })),
    table,
    title: "Equation Visual Verification",
    viewport,
    warnings: curves.length ? [] : ["Could not generate equation graph safely."],
  };
}

function systemVisual(classification: ProblemClassification, result: ProblemSolverResult): ProblemVisualData | null {
  const data = systemIntersectionData(classification.rawInput, result.result ?? "");
  if (!data) return null;
  const rawCurves = data.expressions.map((expression, index) => ({
    color: index === 0 ? sampleColor : compareColor,
    expression,
    label: `Line ${index + 1}: y = ${formatForDisplay(expression)}`,
    points: generateFunctionPoints(expression),
  }));
  const marker = { color: "#dc2626", label: `(${formatNumber(data.intersection.x)}, ${formatNumber(data.intersection.y)})`, x: data.intersection.x, y: data.intersection.y };
  const viewport = autoViewport(rawCurves.map((curve) => curve.points), [marker]);
  return {
    curves: data.expressions.map((expression, index) => ({ ...rawCurves[index], points: generateFunctionPoints(expression, viewport) })),
    description: "Graph both linear equations and mark the intersection solution.",
    markers: [marker],
    table: generateValueTable(compileFunction(data.expressions[0]) ?? (() => null)),
    title: "System Visual Verification",
    viewport,
    warnings: [],
  };
}

function derivativeVisual(classification: ProblemClassification, result: ProblemSolverResult): ProblemVisualData | null {
  const expression = extractDerivativeExpression(classification.rawInput, classification.expression ?? classification.normalizedInput);
  if (!expression) return null;
  const derivative = result.result ?? "";
  const originalPoints = generateFunctionPoints(expression);
  const derivativePoints = generateFunctionPoints(derivative);
  if (!originalPoints.length) return null;
  const curves: GraphCurve[] = [
    { color: sampleColor, expression, label: `f(x) = ${formatForDisplay(expression)}`, points: originalPoints },
  ];
  if (derivativePoints.length) curves.push({ color: derivativeColor, expression: derivative, label: `f'(x) = ${formatForDisplay(derivative)}`, points: derivativePoints });
  const viewport = autoViewport(curves.map((curve) => curve.points), []);
  return {
    curves: curves.map((curve) => ({ ...curve, points: generateFunctionPoints(curve.expression, viewport) })),
    description: derivativePoints.length ? "Compare the original function with its derivative." : "Graph the original function; derivative graph was not safely generated.",
    markers: [],
    table: generateValueTable(compileFunction(expression) ?? (() => null)),
    title: "Derivative Visual Support",
    viewport,
    warnings: derivativePoints.length ? [] : ["Derivative visual comparison was unavailable for this form."],
  };
}

function integralVisual(classification: ProblemClassification, result: ProblemSolverResult): ProblemVisualData | null {
  const definite = parseDefiniteIntegral(classification.rawInput);
  if (definite) {
    const points = generateFunctionPoints(definite.expression);
    const fn = compileFunction(definite.expression);
    if (!points.length || !fn) return null;
    const areaPoints = generateAreaPoints(definite.expression, definite.from, definite.to);
    const approx = approximateIntegral(fn, definite.from, definite.to);
    const viewport = autoViewport([points, areaPoints], []);
    return {
      areas: [{ expression: definite.expression, from: definite.from, points: generateAreaPoints(definite.expression, definite.from, definite.to), to: definite.to }],
      curves: [{ color: sampleColor, expression: definite.expression, label: `f(x) = ${formatForDisplay(definite.expression)}`, points: generateFunctionPoints(definite.expression, viewport) }],
      description: `Approximate shaded area from x = ${formatNumber(definite.from)} to x = ${formatNumber(definite.to)} is ${formatNumber(approx)}.`,
      markers: [],
      table: generateValueTable(fn, [definite.from, (definite.from + definite.to) / 2, definite.to]),
      title: "Definite Integral Visual Support",
      viewport,
      warnings: result.method === "Safe classification" ? ["The visual area is approximate; the symbolic definite integral is not solved in this phase."] : [],
    };
  }
  const expression = classification.expression ?? classification.normalizedInput;
  return expressionVisual(expression, "Integral Visual Support", "Indefinite integral detected: showing the integrand only, without area shading.");
}

function expressionVisual(expression: string, title: string, description = "Graph the expression and show a table of values."): ProblemVisualData | null {
  const points = generateFunctionPoints(expression);
  const fn = compileFunction(expression);
  if (!points.length || !fn) return null;
  const viewport = autoViewport([points], []);
  const hasPossibleDiscontinuity = /\/.*x|x.*\//i.test(expression);
  return {
    curves: [{ color: sampleColor, expression, label: `y = ${formatForDisplay(expression)}`, points: generateFunctionPoints(expression, viewport) }],
    description,
    markers: yInterceptMarker(fn),
    table: generateValueTable(fn),
    title,
    viewport,
    warnings: hasPossibleDiscontinuity ? ["Graph is approximate and may not show discontinuities perfectly. Undefined table rows mark excluded values."] : [],
  };
}

function generateAreaPoints(expression: string, from: number, to: number): GraphPoint[] {
  const fn = compileFunction(expression);
  if (!fn) return [];
  return Array.from({ length: 49 }, (_, index) => {
    const x = from + (index / 48) * (to - from);
    return { x: roundNumber(x), y: fn(x) };
  });
}

function approximateIntegral(fn: (x: number) => number | null, from: number, to: number) {
  const steps = 120;
  const width = (to - from) / steps;
  let total = 0;
  for (let index = 0; index < steps; index += 1) {
    const x = from + (index + 0.5) * width;
    total += (fn(x) ?? 0) * width;
  }
  return total;
}

function parseDefiniteIntegral(rawInput: string) {
  const match = rawInput.match(/^(?:integrate|integral\s+of)\s+(.+?)\s+from\s+([-+]?\d+(?:\.\d+)?)\s+to\s+([-+]?\d+(?:\.\d+)?)$/i);
  if (!match) return null;
  return { expression: normalizeExpression(match[1]), from: Number(match[2]), to: Number(match[3]) };
}

function extractDerivativeExpression(rawInput: string, fallback: string) {
  const match = rawInput.match(/^(?:derivative\s+of|differentiate|d\/dx)\s+(.+?)(?:\s+at\s+x\s*=\s*[-+]?\d+(?:\.\d+)?)?$/i);
  return normalizeExpression(match?.[1] ?? fallback);
}

function yInterceptMarker(fn: (x: number) => number | null): GraphMarker[] {
  const y = fn(0);
  return y === null ? [] : [{ color: "#16a34a", label: `y-intercept ${formatNumber(y)}`, x: 0, y }];
}

function tableXValues(result?: string) {
  const roots = result ? rootsFromSolverResult(result) : [];
  return Array.from(new Set([-3, -2, -1, 0, 1, 2, 3, ...roots])).sort((a, b) => a - b);
}

function parsePointSolution(result: string) {
  const x = result.match(/\bx\s*=\s*([-+]?\d+(?:\.\d+)?)/)?.[1];
  const y = result.match(/\by\s*=\s*([-+]?\d+(?:\.\d+)?)/)?.[1];
  if (x === undefined || y === undefined) return null;
  return { x: Number(x), y: Number(y) };
}

function parseLinearEquation(equation: string): LinearEquation | null {
  const [left, right] = equation.split("=");
  if (right === undefined) return null;
  const leftParsed = parseLinearExpression(left);
  const rightParsed = parseLinearExpression(right);
  if (!leftParsed || !rightParsed) return null;
  return {
    a: (leftParsed.x ?? 0) - (rightParsed.x ?? 0),
    b: (leftParsed.y ?? 0) - (rightParsed.y ?? 0),
    c: rightParsed.constant - leftParsed.constant,
  };
}

function parseLinearExpression(expression: string) {
  const normalized = normalizeExpression(expression);
  const terms = (normalized.startsWith("-") ? normalized : `+${normalized}`).match(/[+-][^+-]+/g) ?? [];
  const parsed: { constant: number; x?: number; y?: number } = { constant: 0 };
  for (const term of terms) {
    const sign = term.startsWith("-") ? -1 : 1;
    const body = term.slice(1);
    if (body.endsWith("x")) {
      const coefficient = body.slice(0, -1).replace(/\*$/, "");
      parsed.x = (parsed.x ?? 0) + sign * (coefficient ? Number(coefficient) : 1);
    } else if (body.endsWith("y")) {
      const coefficient = body.slice(0, -1).replace(/\*$/, "");
      parsed.y = (parsed.y ?? 0) + sign * (coefficient ? Number(coefficient) : 1);
    } else {
      parsed.constant += sign * Number(body);
    }
  }
  if ([parsed.constant, parsed.x ?? 0, parsed.y ?? 0].some((value) => !Number.isFinite(value))) return null;
  return parsed;
}

function linearToYExpression(equation: LinearEquation) {
  if (Math.abs(equation.b) < 1e-9) return "0";
  return `(${equation.c}-${equation.a}*x)/${equation.b}`;
}

function normalizeExpression(value: string) {
  return value.trim()
    .replace(/Ã—|×|·/g, "*")
    .replace(/Ã·|÷/g, "/")
    .replace(/Â²|²/g, "^2")
    .replace(/Â³|³/g, "^3")
    .replace(/âˆ’|−/g, "-")
    .replace(/âˆš\s*\(?\s*([^)\s]+)\s*\)?|√\s*\(?\s*([^)\s]+)\s*\)?/g, (_, mojibakeRadicand: string | undefined, radicand: string | undefined) => `sqrt(${mojibakeRadicand ?? radicand})`)
    .replace(/\s+/g, "")
    .replace(/(\d)([a-zA-Z(])/g, "$1*$2")
    .replace(/([a-zA-Z)])(\d)/g, "$1*$2")
    .replace(/\)([a-zA-Z(])/g, ")*$1");
}

function autoViewport(pointSets: GraphPoint[][], markers: GraphMarker[]): Viewport {
  const values = [...pointSets.flat(), ...markers].filter((point) => point.y !== null && Number.isFinite(point.x) && Number.isFinite(point.y)) as Array<{ x: number; y: number }>;
  if (!values.length) return defaultViewport;
  const yValues = values.map((point) => point.y);
  const yMin = Math.min(defaultViewport.yMin, ...yValues);
  const yMax = Math.max(defaultViewport.yMax, ...yValues);
  const padding = Math.max(1, (yMax - yMin) * 0.08);
  return { ...defaultViewport, yMin: roundNumber(yMin - padding), yMax: roundNumber(yMax + padding) };
}

function formatForDisplay(value: string) {
  return value.replace(/\*/g, "").replace(/\+/g, " + ").replace(/-/g, " - ").replace(/\s+/g, " ").trim().replace(/^-\s*/, "-");
}

function formatNumber(value: number) {
  return `${roundNumber(value)}`;
}
