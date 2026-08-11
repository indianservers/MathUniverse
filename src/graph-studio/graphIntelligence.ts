import { compileFunctionExpression, compileTwoVariableExpression } from "../utils/functionParser";
import {
  symbolicDerivative,
  symbolicExpand,
  symbolicFactor,
  symbolicIntegral,
  symbolicSimplify,
  trySymbolic,
  type SymbolicResult,
} from "../utils/symbolic";

export type IntelligenceStatus = "exact" | "numerical" | "heuristic" | "unsupported";

export type IntelligenceFinding = {
  label: string;
  value: string;
  status: IntelligenceStatus;
  method: string;
};

export type CasAction = "simplify" | "expand" | "factor" | "differentiate" | "integrate";

export function normalizeExplicitExpression(source: string) {
  const trimmed = source.trim();
  if (/^y\s*=/i.test(trimmed)) return trimmed.replace(/^y\s*=/i, "").trim();
  if (/^[a-zA-Z][a-zA-Z0-9_]*\s*\(x\)\s*=/.test(trimmed)) return trimmed.slice(trimmed.indexOf("=") + 1).trim();
  return trimmed;
}

export function runGraphCasAction(source: string, action: CasAction): SymbolicResult | null {
  const expression = normalizeExplicitExpression(source);
  if (!expression || expression.includes("=") || /^\s*\(/.test(expression) && /^\s*\([^)]*,/.test(expression)) return null;
  const operation = {
    simplify: symbolicSimplify,
    expand: symbolicExpand,
    factor: symbolicFactor,
    differentiate: symbolicDerivative,
    integrate: symbolicIntegral,
  }[action];
  return trySymbolic(() => operation(expression));
}

export function analyzeFunction(source: string, xMin: number, xMax: number): IntelligenceFinding[] {
  const expression = normalizeExplicitExpression(source);
  let fn: (x: number) => number;
  try {
    fn = compileFunctionExpression(expression);
  } catch {
    return [{ label: "Function analysis", value: "This relation is not an explicit real function of x.", status: "unsupported", method: "Parser classification" }];
  }

  const count = 720;
  const step = (xMax - xMin) / count;
  const points = Array.from({ length: count + 1 }, (_, index) => {
    const x = xMin + index * step;
    return { x, y: safeValue(() => fn(x)) };
  });
  const valid = points.filter((point) => point.y !== null) as Array<{ x: number; y: number }>;
  if (valid.length < 5) return [{ label: "Visible domain", value: "Too few real samples for analysis.", status: "unsupported", method: `${count + 1} viewport samples` }];

  const symmetry = detectSymmetry(fn, Math.min(Math.abs(xMin), Math.abs(xMax)));
  const periodicity = detectPeriod(expression, fn, xMin, xMax);
  const monotonic = derivativeIntervals(valid, step);
  const inflections = findInflections(valid, step);
  const discontinuities = countDiscontinuities(points, valid);
  const family = classifyFamily(expression);
  const ys = valid.map((point) => point.y);

  return [
    { label: "Family", value: family.value, status: family.status, method: family.method },
    { label: "Visible real domain", value: `${round(valid[0].x)} to ${round(valid.at(-1)!.x)} (${valid.length}/${points.length} samples valid)`, status: "numerical", method: `Uniform viewport sampling, h=${round(step)}` },
    { label: "Visible range", value: `${round(Math.min(...ys))} to ${round(Math.max(...ys))}`, status: "numerical", method: "Minimum and maximum of valid viewport samples" },
    { label: "Symmetry", value: symmetry.value, status: symmetry.status, method: symmetry.method },
    { label: "Periodicity", value: periodicity.value, status: periodicity.status, method: periodicity.method },
    { label: "Monotonicity", value: monotonic || "No stable increasing/decreasing interval detected", status: "numerical", method: "Central slope signs merged with tolerance" },
    { label: "Inflection candidates", value: inflections.length ? inflections.slice(0, 8).map(round).join(", ") : "None visible", status: "numerical", method: "Second finite-difference sign changes" },
    { label: "Discontinuity candidates", value: `${discontinuities}`, status: "heuristic", method: "Invalid samples and jumps larger than 12x median adjacent change" },
  ];
}

export type SurfaceDifferential = {
  point: { x: number; y: number; z: number };
  gradient: { x: number; y: number; magnitude: number };
  normal: [number, number, number];
  tangentPlane: string;
  steps: string[];
  status: "numerical";
};

export function analyzeSurfaceDifferential(source: string, x: number, y: number, h = 0.001): SurfaceDifferential | null {
  let fn: (x: number, y: number) => number;
  try {
    fn = compileTwoVariableExpression(source.replace(/^z\s*=/i, ""));
  } catch {
    return null;
  }
  const z = safeValue(() => fn(x, y));
  const xp = safeValue(() => fn(x + h, y));
  const xm = safeValue(() => fn(x - h, y));
  const yp = safeValue(() => fn(x, y + h));
  const ym = safeValue(() => fn(x, y - h));
  if ([z, xp, xm, yp, ym].some((value) => value === null)) return null;
  const fx = (xp! - xm!) / (2 * h);
  const fy = (yp! - ym!) / (2 * h);
  const magnitude = Math.hypot(fx, fy);
  const length = Math.hypot(fx, fy, 1);
  const normal: [number, number, number] = [-fx / length, 1 / length, -fy / length];
  return {
    point: { x, y, z: z! },
    gradient: { x: fx, y: fy, magnitude },
    normal,
    tangentPlane: `z = ${round(z!)} ${signed(fx)}(x ${signed(-x)}) ${signed(fy)}(y ${signed(-y)})`,
    status: "numerical",
    steps: [
      `Use central differences with h = ${h}.`,
      `f_x = [f(x+h,y)-f(x-h,y)]/(2h) = ${round(fx)}.`,
      `f_y = [f(x,y+h)-f(x,y-h)]/(2h) = ${round(fy)}.`,
      `Gradient magnitude = sqrt(f_x^2+f_y^2) = ${round(magnitude)}.`,
      `The surface normal is normalize(-f_x, 1, -f_y).`,
    ],
  };
}

export function buildTransformation(source: string, a: number, b: number, h: number, k: number) {
  const expression = normalizeExplicitExpression(source);
  const shifted = expression.replace(/\bx\b/g, `((${round(b)})*(x-(${round(h)})))`);
  return `(${round(a)})*(${shifted})+(${round(k)})`;
}

function detectSymmetry(fn: (x: number) => number, radius: number) {
  if (radius <= 0) return { value: "Not testable in this window", status: "unsupported" as const, method: "Needs a window spanning both signs" };
  const samples = Array.from({ length: 40 }, (_, index) => radius * (index + 1) / 40);
  const pairs = samples.flatMap((x) => {
    const positive = safeValue(() => fn(x));
    const negative = safeValue(() => fn(-x));
    return positive === null || negative === null ? [] : [{ positive, negative }];
  });
  if (pairs.length < 10) return { value: "Insufficient paired real samples", status: "unsupported" as const, method: "Paired f(x), f(-x) sampling" };
  const scale = Math.max(1, ...pairs.flatMap((pair) => [Math.abs(pair.positive), Math.abs(pair.negative)]));
  const evenError = Math.max(...pairs.map((pair) => Math.abs(pair.positive - pair.negative))) / scale;
  const oddError = Math.max(...pairs.map((pair) => Math.abs(pair.positive + pair.negative))) / scale;
  if (evenError < 1e-5) return { value: "Even about the y-axis", status: "numerical" as const, method: `max normalized |f(x)-f(-x)|=${round(evenError)}` };
  if (oddError < 1e-5) return { value: "Odd about the origin", status: "numerical" as const, method: `max normalized |f(x)+f(-x)|=${round(oddError)}` };
  return { value: "Neither even nor odd", status: "numerical" as const, method: "40 paired samples across the symmetric window" };
}

function detectPeriod(expression: string, fn: (x: number) => number, xMin: number, xMax: number) {
  const candidates = /sin|cos|tan/.test(expression) ? [Math.PI * 2, Math.PI, Math.PI / 2] : [];
  for (const period of candidates) {
    if (period >= xMax - xMin) continue;
    const errors = Array.from({ length: 80 }, (_, index) => xMin + (index / 79) * (xMax - xMin - period)).flatMap((x) => {
      const a = safeValue(() => fn(x));
      const b = safeValue(() => fn(x + period));
      return a === null || b === null ? [] : [Math.abs(a - b)];
    });
    if (errors.length > 30 && Math.max(...errors) < 1e-5) return { value: `Period approximately ${round(period)}${period === Math.PI * 2 ? " (2pi)" : period === Math.PI ? " (pi)" : ""}`, status: "numerical" as const, method: "Shift agreement over 80 samples" };
  }
  return { value: candidates.length ? "No standard trig period verified in this window" : "Not inferred", status: "heuristic" as const, method: "Tests common periods only; this is not a proof of nonperiodicity" };
}

function derivativeIntervals(points: Array<{ x: number; y: number }>, step: number) {
  const signs = points.slice(1).map((point, index) => ({ x: point.x, sign: Math.abs(point.y - points[index].y) < 1e-7 ? 0 : Math.sign(point.y - points[index].y) }));
  const groups: Array<{ sign: number; start: number; end: number }> = [];
  signs.forEach((item) => {
    const last = groups.at(-1);
    if (!last || last.sign !== item.sign || item.x - last.end > step * 2.2) groups.push({ sign: item.sign, start: item.x - step, end: item.x });
    else last.end = item.x;
  });
  return groups.filter((group) => group.sign !== 0 && group.end - group.start > step * 8).slice(0, 6).map((group) => `${group.sign > 0 ? "increasing" : "decreasing"} on (${round(group.start)}, ${round(group.end)})`).join("; ");
}

function findInflections(points: Array<{ x: number; y: number }>, step: number) {
  const second = points.slice(1, -1).map((point, index) => ({ x: point.x, value: (points[index + 2].y - 2 * point.y + points[index].y) / (step * step) }));
  return second.slice(1).flatMap((item, index) => second[index].value * item.value < 0 && Math.abs(item.value - second[index].value) < 1e5 ? [item.x] : []);
}

function countDiscontinuities(points: Array<{ x: number; y: number | null }>, valid: Array<{ x: number; y: number }>) {
  const changes = valid.slice(1).map((point, index) => Math.abs(point.y - valid[index].y)).filter(Number.isFinite).sort((a, b) => a - b);
  const median = changes[Math.floor(changes.length / 2)] || 1;
  let count = points.filter((point) => point.y === null).length ? 1 : 0;
  for (let index = 1; index < points.length; index += 1) {
    const a = points[index - 1].y;
    const b = points[index].y;
    if (a !== null && b !== null && Math.abs(b - a) > median * 12 && Math.abs(b - a) > 2) count += 1;
  }
  return count;
}

function classifyFamily(expression: string): Pick<IntelligenceFinding, "value" | "status" | "method"> {
  if (/sin|cos|tan/.test(expression)) return { value: "Trigonometric", status: "heuristic", method: "Recognized function tokens" };
  if (/exp|e\^/.test(expression)) return { value: "Exponential", status: "heuristic", method: "Recognized function tokens" };
  if (/ln|log/.test(expression)) return { value: "Logarithmic", status: "heuristic", method: "Recognized function tokens" };
  if (/sqrt|abs/.test(expression)) return { value: "Algebraic piece/domain restricted", status: "heuristic", method: "Recognized function tokens" };
  if (/^[0-9x+\-*/().^\s]+$/i.test(expression)) return { value: "Polynomial or rational", status: "heuristic", method: "Algebraic token classification" };
  return { value: "General explicit function", status: "heuristic", method: "No narrower family recognized" };
}

function safeValue(action: () => number) {
  try {
    const value = action();
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

function round(value: number) {
  const rounded = Math.round(value * 1_000_000) / 1_000_000;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function signed(value: number) {
  return value >= 0 ? `+ ${round(value)}` : `- ${round(Math.abs(value))}`;
}
