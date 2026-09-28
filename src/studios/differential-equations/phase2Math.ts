import { compileTwoVariableExpression } from "../../utils/functionParser";
import { cauchyIndicial, characteristic, classifySystem, type Characteristic } from "./engineeringMath";

export type XY = { x: number; y: number };
export type NumericStep = {
  n: number; x: number; euler: number; heun: number; rk4: number;
  eulerSlope: number; predictor: number; endSlope: number;
  k1: number; k2: number; k3: number; k4: number;
  nextEuler: number; nextHeun: number; nextRk4: number;
  exact: number | null;
};

export const numericalExamples = [
  { label: "y′ = x − y", rule: "x-y" },
  { label: "y′ = y", rule: "y" },
  { label: "y′ = −2y", rule: "-2*y" },
  { label: "y′ = x²", rule: "x^2" },
  { label: "y′ = sin(x)", rule: "sin(x)" },
  { label: "y′ = x − y²", rule: "x-y^2" },
];

function canonical(rule: string) {
  return rule.toLowerCase().replace(/[−–]/g, "-").replace(/\s+/g, "").replace(/^y['′]=/, "").replace(/^dy\/dx=/, "").replace(/\*/g, "");
}

export function exactNumericSolution(rule: string, x0: number, y0: number): ((x: number) => number) | null {
  switch (canonical(rule)) {
    case "x-y": return (x) => x - 1 + (y0 - x0 + 1) * Math.exp(x0 - x);
    case "y": return (x) => y0 * Math.exp(x - x0);
    case "-2y": return (x) => y0 * Math.exp(-2 * (x - x0));
    case "x^2": return (x) => y0 + (x ** 3 - x0 ** 3) / 3;
    case "sin(x)": return (x) => y0 + Math.cos(x0) - Math.cos(x);
    default: return null;
  }
}

export function compileNumericRule(rule: string): { fn: ((x: number, y: number) => number) | null; error: string } {
  try {
    const clean = rule.replace(/[−–]/g, "-").replace(/′/g, "'").replace(/^\s*(?:y'|dy\s*\/\s*dx)\s*=\s*/i, "").trim();
    const fn = compileTwoVariableExpression(clean);
    if (!Number.isFinite(fn(0.37, 0.43))) return { fn: null, error: "The slope is not defined near the sample point." };
    return { fn, error: "" };
  } catch (error) {
    return { fn: null, error: error instanceof Error ? error.message : "Enter a valid slope rule." };
  }
}

export function numericSteps(fn: (x: number, y: number) => number, x0: number, y0: number, h: number, count: number, exact: ((x: number) => number) | null = null): NumericStep[] {
  if (![x0, y0, h, count].every(Number.isFinite) || h <= 0 || count < 1 || count > 200 || h * count > 100) return [];
  let euler = y0; let heun = y0; let rk4 = y0;
  const rows: NumericStep[] = [];
  for (let n = 0; n < count; n += 1) {
    const x = x0 + n * h;
    const eulerSlope = fn(x, euler);
    const predictor = heun + h * fn(x, heun);
    const endSlope = fn(x + h, predictor);
    const nextEuler = euler + h * eulerSlope;
    const nextHeun = heun + h * (fn(x, heun) + endSlope) / 2;
    const k1 = fn(x, rk4);
    const k2 = fn(x + h / 2, rk4 + h * k1 / 2);
    const k3 = fn(x + h / 2, rk4 + h * k2 / 2);
    const k4 = fn(x + h, rk4 + h * k3);
    const nextRk4 = rk4 + h * (k1 + 2 * k2 + 2 * k3 + k4) / 6;
    if (![euler, heun, rk4, eulerSlope, predictor, endSlope, nextEuler, nextHeun, k1, k2, k3, k4, nextRk4].every(Number.isFinite) || Math.max(Math.abs(nextEuler), Math.abs(nextHeun), Math.abs(nextRk4)) > 1e8) break;
    rows.push({ n, x, euler, heun, rk4, eulerSlope, predictor, endSlope, k1, k2, k3, k4, nextEuler, nextHeun, nextRk4, exact: exact ? exact(x) : null });
    euler = nextEuler; heun = nextHeun; rk4 = nextRk4;
  }
  return rows;
}

export function numericError(rows: NumericStep[], h: number, exact: ((x: number) => number) | null) {
  const last = rows.at(-1);
  if (!last || !exact) return null;
  const value = exact(last.x + h);
  if (!Number.isFinite(value)) return null;
  return { exact: value, euler: Math.abs(last.nextEuler - value), heun: Math.abs(last.nextHeun - value), rk4: Math.abs(last.nextRk4 - value) };
}

export function samplePoints(fn: (x: number) => number, start: number, end: number, count = 180): XY[] {
  return Array.from({ length: count + 1 }, (_, index) => {
    const x = start + (end - start) * index / count;
    let y = Number.NaN;
    try { y = fn(x); } catch { /* A singular value becomes a path break. */ }
    return { x, y };
  });
}

export function rootText(roots: Characteristic) {
  if (roots.kind === "distinct") return `r₁ = ${numberText(roots.r1 ?? 0)}, r₂ = ${numberText(roots.r2 ?? 0)}`;
  if (roots.kind === "repeated") return `r = ${numberText(roots.r1 ?? 0)} (repeated)`;
  if (roots.kind === "complex") return `r = ${numberText(roots.alpha ?? 0)} ± ${numberText(roots.beta ?? 0)}i`;
  return "Leading coefficient must be nonzero.";
}

export function numberText(value: number, digits = 3) { return Number.isFinite(value) ? String(Number(value.toFixed(digits))) : "—"; }

export function homogeneousBasis(roots: Characteristic, x: number): [number, number] {
  if (roots.kind === "distinct") return [Math.exp((roots.r1 ?? 0) * x), Math.exp((roots.r2 ?? 0) * x)];
  if (roots.kind === "repeated") { const base = Math.exp((roots.r1 ?? 0) * x); return [base, x * base]; }
  if (roots.kind === "complex") { const envelope = Math.exp((roots.alpha ?? 0) * x); return [envelope * Math.cos((roots.beta ?? 0) * x), envelope * Math.sin((roots.beta ?? 0) * x)]; }
  return [Number.NaN, Number.NaN];
}

export function integrateSecondOrder(a: number, b: number, c: number, forcing: (x: number) => number, y0: number, v0: number, xMax = 4, h = 0.02) {
  if (a === 0 || ![a, b, c, y0, v0, xMax, h].every(Number.isFinite) || h <= 0) return [];
  const points: Array<{ x: number; y: number; v: number }> = [{ x: 0, y: y0, v: v0 }];
  const acceleration = (x: number, y: number, v: number) => (forcing(x) - b * v - c * y) / a;
  let x = 0; let y = y0; let v = v0;
  for (let n = 0; n < Math.min(1500, Math.ceil(xMax / h)); n += 1) {
    const k1y = v; const k1v = acceleration(x, y, v);
    const k2y = v + h * k1v / 2; const k2v = acceleration(x + h / 2, y + h * k1y / 2, v + h * k1v / 2);
    const k3y = v + h * k2v / 2; const k3v = acceleration(x + h / 2, y + h * k2y / 2, v + h * k2v / 2);
    const k4y = v + h * k3v; const k4v = acceleration(x + h, y + h * k3y, v + h * k3v);
    y += h * (k1y + 2 * k2y + 2 * k3y + k4y) / 6;
    v += h * (k1v + 2 * k2v + 2 * k3v + k4v) / 6;
    x += h;
    if (![x, y, v].every(Number.isFinite) || Math.abs(y) > 1e8) break;
    points.push({ x, y, v });
  }
  return points;
}

/** Fundamental pair and zero-initial-value particular response for variable coefficients. */
export function integrateVariation(
  p: (x: number) => number,
  q: (x: number) => number,
  g: (x: number) => number,
  xMax = 3.2,
  h = 0.01,
) {
  type State = [number, number, number, number, number, number];
  const derivative = (x: number, s: State): State => [
    s[1], -p(x) * s[1] - q(x) * s[0],
    s[3], -p(x) * s[3] - q(x) * s[2],
    s[5], g(x) - p(x) * s[5] - q(x) * s[4],
  ];
  const add = (s: State, k: State, scale: number) => s.map((value, index) => value + scale * k[index]) as State;
  let state: State = [1, 0, 0, 1, 0, 0];
  const points = [{ x: 0, y1: 1, v1: 0, y2: 0, v2: 1, yp: 0, vp: 0 }];
  const steps = Math.min(1500, Math.ceil(xMax / h));
  for (let index = 0; index < steps; index += 1) {
    const x = index * h;
    const k1 = derivative(x, state);
    const k2 = derivative(x + h / 2, add(state, k1, h / 2));
    const k3 = derivative(x + h / 2, add(state, k2, h / 2));
    const k4 = derivative(x + h, add(state, k3, h));
    state = state.map((value, component) => value + h * (k1[component] + 2 * k2[component] + 2 * k3[component] + k4[component]) / 6) as State;
    if (state.some((value) => !Number.isFinite(value) || Math.abs(value) > 1e8)) break;
    points.push({ x: (index + 1) * h, y1: state[0], v1: state[1], y2: state[2], v2: state[3], yp: state[4], vp: state[5] });
  }
  let u1 = 0, u2 = 0;
  return points.map((point, index) => {
    const w = point.y1 * point.v2 - point.v1 * point.y2;
    const d1 = -point.y2 * g(point.x) / w;
    const d2 = point.y1 * g(point.x) / w;
    if (index > 0) {
      const previous = points[index - 1];
      const previousW = previous.y1 * previous.v2 - previous.v1 * previous.y2;
      u1 += h * (-previous.y2 * g(previous.x) / previousW + d1) / 2;
      u2 += h * (previous.y1 * g(previous.x) / previousW + d2) / 2;
    }
    return { ...point, u1, u2, yVariation: u1 * point.y1 + u2 * point.y2 };
  });
}

export type TrialBasis = { power: number; rate: number; frequency: number; trig: "plain" | "cos" | "sin" };
export function fitUndetermined(
  a: number, b: number, c: number,
  forcing: (x: number) => number,
  basis: TrialBasis[],
) {
  if (!basis.length || basis.length > 16 || a === 0 || ![a, b, c].every(Number.isFinite)) return null;
  const evaluate = (term: TrialBasis, x: number) => {
    const { power: m, rate: r, frequency: w, trig } = term;
    const angle = w * x;
    const t = trig === "cos" ? Math.cos(angle) : trig === "sin" ? Math.sin(angle) : 1;
    const dt = trig === "cos" ? -w * Math.sin(angle) : trig === "sin" ? w * Math.cos(angle) : 0;
    const envelope = Math.exp(r * x);
    const xm = x ** m, xm1 = m ? x ** (m - 1) : 0, xm2 = m > 1 ? x ** (m - 2) : 0;
    const value = envelope * xm * t;
    const first = envelope * (m * xm1 * t + xm * (r * t + dt));
    const second = envelope * (m * (m - 1) * xm2 * t + 2 * m * xm1 * (r * t + dt) + xm * ((r * r - w * w) * t + 2 * r * dt));
    return { value, operator: a * second + b * first + c * value };
  };
  const count = basis.length;
  const matrix = Array.from({ length: count }, (_, row) => {
    const x = 0.19 + row * 0.21;
    return [...basis.map((term) => evaluate(term, x).operator), forcing(x)];
  });
  if (matrix.some((row) => row.some((value) => !Number.isFinite(value)))) return null;
  for (let col = 0; col < count; col += 1) {
    let pivot = col;
    for (let row = col + 1; row < count; row += 1) if (Math.abs(matrix[row][col]) > Math.abs(matrix[pivot][col])) pivot = row;
    if (Math.abs(matrix[pivot][col]) < 1e-10) return null;
    [matrix[col], matrix[pivot]] = [matrix[pivot], matrix[col]];
    const scale = matrix[col][col];
    for (let j = col; j <= count; j += 1) matrix[col][j] /= scale;
    for (let row = 0; row < count; row += 1) if (row !== col) {
      const factor = matrix[row][col];
      for (let j = col; j <= count; j += 1) matrix[row][j] -= factor * matrix[col][j];
    }
  }
  const coefficients = matrix.map((row) => row[count]);
  const particular = (x: number) => basis.reduce((sum, term, index) => sum + coefficients[index] * evaluate(term, x).value, 0);
  const residual = [0.13, 0.47, 0.91, 1.37, 1.89].reduce((maximum, x) => {
    const modeled = basis.reduce((sum, term, index) => sum + coefficients[index] * evaluate(term, x).operator, 0);
    return Math.max(maximum, Math.abs(modeled - forcing(x)));
  }, 0);
  if (!Number.isFinite(residual) || residual > 1e-4 * (1 + Math.max(...coefficients.map(Math.abs)))) return null;
  return { coefficients, particular, residual };
}

export type VectorField = (x: number, y: number) => [number, number];
export function vectorTrajectory(field: VectorField, start: XY, steps = 240, h = 0.035) {
  const march = (sign: number) => {
    const points: XY[] = []; let { x, y } = start;
    for (let i = 0; i < steps; i += 1) {
      if (![x, y].every(Number.isFinite) || Math.hypot(x, y) > 12) break;
      points.push({ x, y });
      const dt = sign * h;
      const k1 = field(x, y); const k2 = field(x + dt * k1[0] / 2, y + dt * k1[1] / 2);
      const k3 = field(x + dt * k2[0] / 2, y + dt * k2[1] / 2); const k4 = field(x + dt * k3[0], y + dt * k3[1]);
      x += dt * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]) / 6;
      y += dt * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]) / 6;
    }
    return points;
  };
  return [...march(-1).reverse(), ...march(1).slice(1)];
}

export function vectorTimeSeries(field: VectorField, start: XY, steps = 240, h = 0.04) {
  const points: Array<{ t: number; x: number; y: number }> = [{ t: 0, ...start }];
  let { x, y } = start;
  for (let i = 0; i < steps; i += 1) {
    const k1 = field(x, y), k2 = field(x + h * k1[0] / 2, y + h * k1[1] / 2);
    const k3 = field(x + h * k2[0] / 2, y + h * k2[1] / 2), k4 = field(x + h * k3[0], y + h * k3[1]);
    x += h * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]) / 6;
    y += h * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]) / 6;
    if (![x, y].every(Number.isFinite) || Math.hypot(x, y) > 1e5) break;
    points.push({ t: (i + 1) * h, x, y });
  }
  return points;
}

export function numericalJacobian(field: VectorField, x = 0, y = 0) {
  const h = 1e-4;
  const xp = field(x + h, y), xm = field(x - h, y), yp = field(x, y + h), ym = field(x, y - h);
  return { a: (xp[0] - xm[0]) / (2 * h), b: (yp[0] - ym[0]) / (2 * h), c: (xp[1] - xm[1]) / (2 * h), d: (yp[1] - ym[1]) / (2 * h) };
}

export { cauchyIndicial, characteristic, classifySystem };
