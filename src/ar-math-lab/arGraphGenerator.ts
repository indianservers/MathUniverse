import { classifyEquationInput } from "./arEquationClassifier";
import type { ARGeneratedGraphObject, ARGraphGeometry, ARGraphSettings, EquationClassificationResult } from "./types";

type Token =
  | { type: "number"; value: number }
  | { type: "name"; value: string }
  | { type: "operator"; value: string }
  | { type: "function"; value: string }
  | { type: "leftParen" }
  | { type: "rightParen" }
  | { type: "comma" };

type RpnToken = Exclude<Token, { type: "leftParen" | "rightParen" | "comma" }>;

export type ParameterSliderSpec = { key: string; min: number; max: number; step: number; defaultValue: number };

const supportedFunctions: Record<string, (...values: number[]) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sqrt: Math.sqrt,
  abs: Math.abs,
  log: Math.log10,
  ln: Math.log,
  exp: Math.exp,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  pow: Math.pow,
  min: Math.min,
  max: Math.max,
};

const functionArity: Record<string, number> = { pow: 2, min: 2, max: 2 };
const precedence: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3, "u-": 4 };
const rightAssociative = new Set(["^", "u-"]);
const blockedExpressionTokens = /\b(alert|window|document|globalthis|global|self|process|fetch|eval|function|constructor|prototype|import|export|class|while|for|return|localstorage|sessionstorage|cookie|location)\b/i;
const allowedVariableNames = new Set(["x", "y", "z", "t", "u", "v", "a", "b", "c", "h", "k", "r", "R", "pi", "e"]);

export const defaultGraphSettings: ARGraphSettings = {
  xRange: [-5, 5],
  yRange: [-5, 5],
  tRange: [0, Math.PI * 6],
  uRange: [0, Math.PI * 2],
  vRange: [0, Math.PI * 2],
  resolutionX: 60,
  resolutionY: 60,
  resolutionU: 64,
  resolutionV: 32,
  samples: 300,
  zScale: "auto",
  graphScale: 1,
  curveThickness: 0.035,
  surfaceStyle: "solid-wireframe",
  curveStyle: "line",
  transparent: true,
  wireframe: true,
  pointMarkers: false,
  autoCenter: true,
};

export function settingsFromClassification(classification: EquationClassificationResult): ARGraphSettings {
  return {
    ...defaultGraphSettings,
    xRange: classification.suggestedRanges?.x ?? defaultGraphSettings.xRange,
    yRange: classification.suggestedRanges?.y ?? defaultGraphSettings.yRange,
    tRange: classification.suggestedRanges?.t ?? defaultGraphSettings.tRange,
    uRange: classification.suggestedRanges?.u ?? defaultGraphSettings.uRange,
    vRange: classification.suggestedRanges?.v ?? defaultGraphSettings.vRange,
    resolutionX: classification.suggestedResolution?.x ?? defaultGraphSettings.resolutionX,
    resolutionY: classification.suggestedResolution?.y ?? defaultGraphSettings.resolutionY,
    resolutionU: classification.suggestedResolution?.u ?? defaultGraphSettings.resolutionU,
    resolutionV: classification.suggestedResolution?.v ?? defaultGraphSettings.resolutionV,
    samples: classification.suggestedResolution?.t ?? defaultGraphSettings.samples,
  };
}

export function parameterSliderSpecs(parameters: string[]) {
  return parameters.map((key): ParameterSliderSpec => {
    if (key === "k") return { key, defaultValue: 1, min: 0.1, max: 10, step: 0.1 };
    if (key === "R") return { key, defaultValue: 2, min: 0.1, max: 10, step: 0.1 };
    if (key === "r") return { key, defaultValue: 0.5, min: 0.1, max: 5, step: 0.1 };
    if (key === "h") return { key, defaultValue: 2, min: 0.1, max: 10, step: 0.1 };
    if (["a", "b", "c"].includes(key)) return { key, defaultValue: 1, min: -10, max: 10, step: 0.1 };
    return { key, defaultValue: 1, min: -5, max: 5, step: 0.1 };
  });
}

export function generateARGraphObject(input: string, settings: ARGraphSettings, parameters: Record<string, number>): ARGeneratedGraphObject {
  const classification = classifyEquationInput(input);
  if (classification.errors?.length && classification.suggestedRenderer === "unsupported") {
    throw new Error(classification.errors[0]);
  }
  const effectiveParameters = { ...(classification.suggestedParameters ?? {}), ...parameters };

  let geometry: ARGraphGeometry;
  if (classification.suggestedRenderer === "surface_mesh") {
    geometry = generateExplicitSurfaceMesh({
      expression: stripLeftSide(input, "z"),
      xRange: settings.xRange,
      yRange: settings.yRange,
      resolutionX: settings.resolutionX,
      resolutionY: settings.resolutionY,
      parameters: effectiveParameters,
      zScale: settings.zScale,
    });
  } else if (classification.suggestedRenderer === "curve_3d") {
    const parts = parseAssignments(input);
    geometry = generateParametricCurve({
      xExpression: parts.x,
      yExpression: parts.y,
      zExpression: parts.z,
      tRange: settings.tRange,
      samples: settings.samples,
      parameters: effectiveParameters,
    });
  } else if (classification.suggestedRenderer === "parametric_surface_mesh") {
    const parts = parseAssignments(input);
    geometry = generateParametricSurfaceMesh({
      xExpression: parts.x,
      yExpression: parts.y,
      zExpression: parts.z,
      uRange: settings.uRange,
      vRange: settings.vRange,
      resolutionU: settings.resolutionU,
      resolutionV: settings.resolutionV,
      parameters: effectiveParameters,
    });
  } else if (classification.suggestedRenderer === "predefined_sphere") {
    geometry = generateParametricSurfaceMesh({
      xExpression: "r * sin(u) * cos(v)",
      yExpression: "r * sin(u) * sin(v)",
      zExpression: "r * cos(u)",
      uRange: settings.uRange,
      vRange: settings.vRange,
      resolutionU: settings.resolutionU,
      resolutionV: settings.resolutionV,
      parameters: effectiveParameters,
    });
  } else if (classification.suggestedRenderer === "predefined_cylinder") {
    geometry = generateParametricSurfaceMesh({
      xExpression: "r * cos(u)",
      yExpression: "r * sin(u)",
      zExpression: "v",
      uRange: settings.uRange,
      vRange: settings.vRange,
      resolutionU: settings.resolutionU,
      resolutionV: settings.resolutionV,
      parameters: effectiveParameters,
    });
  } else if (classification.suggestedRenderer === "predefined_cone") {
    geometry = generateParametricSurfaceMesh({
      xExpression: "v * cos(u)",
      yExpression: "v * sin(u)",
      zExpression: "h - v",
      uRange: settings.uRange,
      vRange: settings.vRange,
      resolutionU: settings.resolutionU,
      resolutionV: settings.resolutionV,
      parameters: effectiveParameters,
    });
  } else {
    throw new Error("This equation type is not supported yet. Try z = f(x, y) or a parametric equation.");
  }

  return {
    id: `ar-graph-${Date.now()}`,
    name: graphNameFor(classification),
    equation: input,
    type: classification.type,
    visible: true,
    locked: false,
    transform: { scale: settings.graphScale, rotation: [0, 0, 0], position: [0, 0.45, 0] },
    settings,
    geometry,
    parameterValues: effectiveParameters,
    explanation: classification.educationalHint ?? "Generated graph object ready for AR, camera overlay, and 3D preview.",
    classification,
    status: geometry.warnings?.length ? "warning" : "ready",
  };
}

export function generateExplicitSurfaceMesh(options: {
  expression: string;
  xRange: [number, number];
  yRange: [number, number];
  resolutionX: number;
  resolutionY: number;
  parameters: Record<string, number>;
  zScale: number | "auto";
}): Extract<ARGraphGeometry, { kind: "surface" }> {
  const fn = compileExpression(options.expression);
  const rx = clampInteger(options.resolutionX, 8, 120);
  const ry = clampInteger(options.resolutionY, 8, 120);
  const raw: Array<{ x: number; y: number; z: number | null }> = [];
  const validZ: number[] = [];
  let invalidPointCount = 0;

  for (let iy = 0; iy < ry; iy += 1) {
    const y = lerp(options.yRange, iy / Math.max(1, ry - 1));
    for (let ix = 0; ix < rx; ix += 1) {
      const x = lerp(options.xRange, ix / Math.max(1, rx - 1));
      const z = safeEval(fn, { x, y, ...options.parameters });
      if (z === null) invalidPointCount += 1;
      else validZ.push(z);
      raw.push({ x, y, z });
    }
  }

  if (!validZ.length) throw new Error("This graph has no finite points. Try changing the range or equation.");
  const minZ = Math.min(...validZ);
  const maxZ = Math.max(...validZ);
  const span = Math.max(1e-6, maxZ - minZ);
  const autoScale = options.zScale === "auto" ? Math.min(1, 4 / span) : options.zScale;
  const vertices: number[] = [];
  const colors: number[] = [];
  raw.forEach((point) => {
    const z = point.z ?? 0;
    const ratio = (z - minZ) / span;
    vertices.push(point.x, z * autoScale, point.y);
    colors.push(0.08 + 0.75 * ratio, 0.75 - 0.35 * ratio, 0.95 - 0.75 * ratio);
  });
  const indices = buildGridIndices(rx, ry, (a, b, c, d) => raw[a].z !== null && raw[b].z !== null && raw[c].z !== null && raw[d].z !== null);
  const warnings = buildWarnings(invalidPointCount, raw.length, Math.max(rx, ry));
  return { kind: "surface", vertices, indices, colors, valueStats: { minZ, maxZ, invalidPointCount }, warnings };
}

export function generateParametricCurve(options: {
  xExpression: string;
  yExpression: string;
  zExpression: string;
  tRange: [number, number];
  samples: number;
  parameters: Record<string, number>;
}): Extract<ARGraphGeometry, { kind: "curve" }> {
  const fx = compileExpression(options.xExpression);
  const fy = compileExpression(options.yExpression);
  const fz = compileExpression(options.zExpression);
  const samples = clampInteger(options.samples, 20, 800);
  const points: [number, number, number][] = [];
  let invalidPointCount = 0;
  for (let index = 0; index < samples; index += 1) {
    const t = lerp(options.tRange, index / Math.max(1, samples - 1));
    const scope = { t, ...options.parameters };
    const x = safeEval(fx, scope);
    const y = safeEval(fy, scope);
    const z = safeEval(fz, scope);
    if (x === null || y === null || z === null) invalidPointCount += 1;
    else points.push([x, z, y]);
  }
  if (points.length < 2) throw new Error("The parametric curve has too few finite points.");
  return { kind: "curve", points: normalizePoints(points), valueStats: { invalidPointCount }, warnings: buildWarnings(invalidPointCount, samples, samples) };
}

export function generateParametricSurfaceMesh(options: {
  xExpression: string;
  yExpression: string;
  zExpression: string;
  uRange: [number, number];
  vRange: [number, number];
  resolutionU: number;
  resolutionV: number;
  parameters: Record<string, number>;
}): Extract<ARGraphGeometry, { kind: "surface" }> {
  const fx = compileExpression(options.xExpression);
  const fy = compileExpression(options.yExpression);
  const fz = compileExpression(options.zExpression);
  const ru = clampInteger(options.resolutionU, 8, 120);
  const rv = clampInteger(options.resolutionV, 8, 120);
  const raw: Array<[number, number, number] | null> = [];
  const zValues: number[] = [];
  let invalidPointCount = 0;
  for (let iv = 0; iv < rv; iv += 1) {
    const v = lerp(options.vRange, iv / Math.max(1, rv - 1));
    for (let iu = 0; iu < ru; iu += 1) {
      const u = lerp(options.uRange, iu / Math.max(1, ru - 1));
      const scope = { u, v, ...options.parameters };
      const x = safeEval(fx, scope);
      const y = safeEval(fy, scope);
      const z = safeEval(fz, scope);
      if (x === null || y === null || z === null) {
        raw.push(null);
        invalidPointCount += 1;
      } else {
        raw.push([x, z, y]);
        zValues.push(z);
      }
    }
  }
  if (!zValues.length) throw new Error("This parametric surface has no finite points.");
  const minZ = Math.min(...zValues);
  const maxZ = Math.max(...zValues);
  const normalized = normalizePoints(raw.filter(Boolean) as [number, number, number][]);
  let normalizedIndex = 0;
  const vertices: number[] = [];
  raw.forEach((point) => {
    if (!point) vertices.push(0, 0, 0);
    else vertices.push(...normalized[normalizedIndex++]);
  });
  const indices = buildGridIndices(ru, rv, (a, b, c, d) => raw[a] !== null && raw[b] !== null && raw[c] !== null && raw[d] !== null);
  return { kind: "surface", vertices, indices, valueStats: { minZ, maxZ, invalidPointCount }, warnings: buildWarnings(invalidPointCount, raw.length, Math.max(ru, rv)) };
}

function compileExpression(input: string) {
  const rpn = toRpn(tokenize(normalizeExpression(input)));
  return (scope: Record<string, number>) => evaluateRpn(rpn, scope);
}

function normalizeExpression(input: string) {
  const value = input.trim()
    .replace(/\u00f7/g, "/")
    .replace(/\u00d7/g, "*")
    .replace(/\u03c0/g, "pi")
    .replace(/\s+/g, "")
    .replace(/e\^\(/g, "exp(")
    .replace(/e\^([A-Za-z0-9]+)/g, "exp($1)")
    .replace(/(\d|\))(?=([A-Za-z]|\())/g, "$1*");
  if (!value) throw new Error("The equation could not be parsed. Check brackets, operators, and variables.");
  validateMathExpression(value);
  return value;
}

export function validateMathExpression(value: string) {
  if (value.length > 500) throw new Error("Expression is too long. Keep equations under 500 characters for mobile AR.");
  if (blockedExpressionTokens.test(value) || /(=>|;|=|\{|\}|\[|\]|\.\.|::)/.test(value)) throw new Error("Unsupported expression. Use only math functions, numbers, variables, and operators.");
  if (!/^[0-9+\-*/^().,A-Za-z]+$/.test(value)) throw new Error("Invalid characters in expression");
  let depth = 0;
  let maxDepth = 0;
  for (const char of value) {
    if (char === "(") {
      depth += 1;
      maxDepth = Math.max(maxDepth, depth);
    }
    if (char === ")") depth -= 1;
    if (depth < 0) throw new Error("Mismatched parentheses");
  }
  if (depth !== 0) throw new Error("Mismatched parentheses");
  if (maxDepth > 24) throw new Error("Expression nesting is too deep for mobile AR.");
  if (/(\+\+|\*\*|\/\/|\^\^|,,)/.test(value)) throw new Error("Check repeated operators or missing values in the expression.");
}

function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  while (index < expression.length) {
    const char = expression[index];
    if (/\d|\./.test(char)) {
      let raw = "";
      while (index < expression.length && /[\d.]/.test(expression[index])) raw += expression[index++];
      const value = Number(raw);
      if (!Number.isFinite(value)) throw new Error("Invalid number");
      tokens.push({ type: "number", value });
      continue;
    }
    if (/[A-Za-z]/.test(char)) {
      let name = "";
      while (index < expression.length && /[A-Za-z]/.test(expression[index])) name += expression[index++];
      const lower = name.toLowerCase();
      if (supportedFunctions[lower]) tokens.push({ type: "function", value: lower });
      else if (allowedVariableNames.has(name) || allowedVariableNames.has(lower)) tokens.push({ type: "name", value: name });
      else throw new Error(`Unsupported symbol "${name}". Use math variables like x, y, z, t, u, v, a, b, c, h, k, r, R.`);
      continue;
    }
    if (char === "(") tokens.push({ type: "leftParen" });
    else if (char === ")") tokens.push({ type: "rightParen" });
    else if (char === ",") tokens.push({ type: "comma" });
    else if ("+-*/^".includes(char)) {
      const previous = tokens[tokens.length - 1];
      const unary = char === "-" && (!previous || previous.type === "operator" || previous.type === "leftParen" || previous.type === "comma");
      tokens.push({ type: "operator", value: unary ? "u-" : char });
    } else throw new Error("Invalid token");
    index += 1;
  }
  return tokens;
}

function toRpn(tokens: Token[]) {
  const output: RpnToken[] = [];
  const operators: Token[] = [];
  tokens.forEach((token) => {
    if (token.type === "number" || token.type === "name") output.push(token);
    else if (token.type === "function") operators.push(token);
    else if (token.type === "comma") {
      while (operators.length && operators[operators.length - 1].type !== "leftParen") output.push(operators.pop() as RpnToken);
    } else if (token.type === "operator") {
      while (operators.length) {
        const top = operators[operators.length - 1];
        if (top.type === "function" || (top.type === "operator" && (precedence[top.value] > precedence[token.value] || (precedence[top.value] === precedence[token.value] && !rightAssociative.has(token.value))))) output.push(operators.pop() as RpnToken);
        else break;
      }
      operators.push(token);
    } else if (token.type === "leftParen") operators.push(token);
    else {
      while (operators.length && operators[operators.length - 1].type !== "leftParen") output.push(operators.pop() as RpnToken);
      if (!operators.length) throw new Error("Mismatched parentheses");
      operators.pop();
      if (operators[operators.length - 1]?.type === "function") output.push(operators.pop() as RpnToken);
    }
  });
  while (operators.length) {
    const token = operators.pop()!;
    if (token.type === "leftParen" || token.type === "rightParen") throw new Error("Mismatched parentheses");
    output.push(token as RpnToken);
  }
  return output;
}

function evaluateRpn(rpn: RpnToken[], scope: Record<string, number>) {
  const stack: number[] = [];
  rpn.forEach((token) => {
    if (token.type === "number") stack.push(token.value);
    else if (token.type === "name") {
      if (token.value.toLowerCase() === "pi") stack.push(Math.PI);
      else if (token.value === "e") stack.push(Math.E);
      else if (scope[token.value] !== undefined) stack.push(scope[token.value]);
      else if (scope[token.value.toLowerCase()] !== undefined) stack.push(scope[token.value.toLowerCase()]);
      else throw new Error(`Missing value for ${token.value}`);
    } else if (token.type === "function") {
      const arity = functionArity[token.value] ?? 1;
      const args = stack.splice(-arity);
      if (args.length !== arity) throw new Error("Missing function argument");
      stack.push(supportedFunctions[token.value](...args));
    } else if (token.type === "operator") {
      if (token.value === "u-") stack.push(-(stack.pop() ?? 0));
      else {
        const right = stack.pop();
        const left = stack.pop();
        if (left === undefined || right === undefined) throw new Error("Missing operand");
        if (token.value === "+") stack.push(left + right);
        if (token.value === "-") stack.push(left - right);
        if (token.value === "*") stack.push(left * right);
        if (token.value === "/") stack.push(left / right);
        if (token.value === "^") stack.push(Math.pow(left, right));
      }
    }
  });
  if (stack.length !== 1) throw new Error("Invalid expression");
  return stack[0];
}

function safeEval(fn: (scope: Record<string, number>) => number, scope: Record<string, number>) {
  try {
    const value = fn(scope);
    return Number.isFinite(value) ? clamp(value, -1e6, 1e6) : null;
  } catch {
    return null;
  }
}

function parseAssignments(input: string) {
  const assignments: Record<string, string> = {};
  input.split(",").forEach((part) => {
    const [left, ...rightParts] = part.split("=");
    const key = left.trim().toLowerCase();
    const value = rightParts.join("=").trim();
    if (key && value) assignments[key] = value;
  });
  if (!assignments.x || !assignments.y || !assignments.z) throw new Error("Parametric equations must include x = ..., y = ..., z = ...");
  return assignments as { x: string; y: string; z: string };
}

function stripLeftSide(input: string, variable: string) {
  return input.replace(new RegExp(`^\\s*${variable}\\s*=\\s*`, "i"), "");
}

function buildGridIndices(cols: number, rows: number, valid: (a: number, b: number, c: number, d: number) => boolean) {
  const indices: number[] = [];
  for (let iy = 0; iy < rows - 1; iy += 1) {
    for (let ix = 0; ix < cols - 1; ix += 1) {
      const a = iy * cols + ix;
      const b = a + 1;
      const c = a + cols;
      const d = c + 1;
      if (valid(a, b, c, d)) indices.push(a, b, c, b, d, c);
    }
  }
  return indices;
}

function normalizePoints(points: [number, number, number][]) {
  const maxAbs = Math.max(1, ...points.flat().map((value) => Math.abs(value)));
  const scale = maxAbs > 4 ? 4 / maxAbs : 1;
  return points.map(([x, y, z]) => [x * scale, y * scale, z * scale] as [number, number, number]);
}

function buildWarnings(invalidPointCount: number, total: number, resolution: number) {
  const warnings: string[] = [];
  if (invalidPointCount / Math.max(1, total) > 0.25) warnings.push("This graph has many undefined points. Try changing the range or equation.");
  if (resolution > 80) warnings.push("High resolution may slow down mobile devices. Consider using 60 or lower.");
  return warnings;
}

function graphNameFor(classification: EquationClassificationResult) {
  if (classification.suggestedRenderer === "curve_3d") return "Parametric curve";
  if (classification.suggestedRenderer === "parametric_surface_mesh") return "Parametric surface";
  if (classification.suggestedRenderer?.startsWith("predefined")) return "Recognized implicit shape";
  return "Explicit surface";
}

function lerp(range: [number, number], t: number) {
  return range[0] + (range[1] - range[0]) * t;
}

function clampInteger(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
