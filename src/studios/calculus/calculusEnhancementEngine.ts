export type Unary = (x: number) => number;

export function epsilonDelta(fn: Unary, point: number, limit: number, epsilon: number, radius = 4) {
  if (epsilon <= 0) return null;
  for (let probe = radius; probe >= 1e-6; probe /= 1.08) {
    let valid = true;
    for (let index = 1; index <= 80; index++) {
      for (const sign of [-1, 1]) if (Math.abs(fn(point + sign * probe * index / 80) - limit) >= epsilon) valid = false;
    }
    if (valid) return { epsilon, delta: probe, verified: true };
  }
  return { epsilon, delta: 0, verified: false };
}

export function oneSidedLimits(fn: Unary, point: number, h = 1e-5) {
  return { left: fn(point - h), right: fn(point + h), exists: Math.abs(fn(point - h) - fn(point + h)) < Math.sqrt(h) };
}

export function sequenceLimit(term: (n: number) => number, target: number, start = 10, count = 6) {
  const terms = Array.from({ length: count }, (_, index) => ({ n: start * 10 ** index, value: term(start * 10 ** index) }));
  return { target, terms, finalError: Math.abs(terms.at(-1)!.value - target) };
}

export function classifyDiscontinuity(left: number, right: number, value?: number) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) return "infinite" as const;
  if (Math.abs(left - right) > 1e-6) return "jump" as const;
  if (value === undefined || !Number.isFinite(value) || Math.abs(value - left) > 1e-6) return "removable" as const;
  return "continuous" as const;
}

export function lhopitalEligibility(input: { numeratorLimit: number; denominatorLimit: number; differentiableNearby: boolean; derivativeDenominatorNonzero: boolean }) {
  const indeterminate = (nearly(input.numeratorLimit, 0) && nearly(input.denominatorLimit, 0)) || (!Number.isFinite(input.numeratorLimit) && !Number.isFinite(input.denominatorLimit));
  return { eligible: indeterminate && input.differentiableNearby && input.derivativeDenominatorNonzero, indeterminate };
}

export function secantToTangent(fn: Unary, point: number, h: number) {
  const secant = (fn(point + h) - fn(point)) / h;
  const step = Math.max(1e-6, Math.abs(h) / 1000);
  const tangent = (fn(point + step) - fn(point - step)) / (2 * step);
  return { secant, tangent, error: Math.abs(secant - tangent) };
}

export function derivativeRuleTree(expression: string) {
  const product = expression.match(/^(.+)\*(.+)$/), chain = expression.match(/^(sin|cos|exp)\((.+)\)$/);
  if (chain) return { rule: "chain", outer: chain[1], children: [chain[2]] };
  if (product) return { rule: "product", outer: expression, children: [product[1], product[2]] };
  return { rule: "elementary", outer: expression, children: [] };
}

export function implicitCircleTangent(x: number, y: number, radius: number) {
  const residual = x * x + y * y - radius * radius;
  if (Math.abs(y) < 1e-12) return { slope: Infinity, normal: [x, y] as const, residual };
  return { slope: -x / y, normal: [x, y] as const, residual };
}

export function polynomialMotion(position: [number, number, number, number], time: number) {
  const [a, b, c, d] = position;
  return { position: a * time ** 3 + b * time ** 2 + c * time + d, velocity: 3 * a * time ** 2 + 2 * b * time + c, acceleration: 6 * a * time + 2 * b, jerk: 6 * a };
}

export function linearization(fn: Unary, derivative: Unary, point: number, x: number) {
  const approximation = fn(point) + derivative(point) * (x - point), actual = fn(x);
  return { approximation, actual, error: Math.abs(actual - approximation) };
}

export function circleRelatedRates(radius: number, radiusRate: number) {
  return { areaRate: 2 * Math.PI * radius * radiusRate, circumferenceRate: 2 * Math.PI * radiusRate };
}

export function rectangleOptimization(perimeter: number) {
  const width = perimeter / 4;
  return { width, height: width, maximumArea: width * width };
}

export function meanValuePointQuadratic(a: number, b: number, left: number, right: number) {
  if (nearly(left, right) || nearly(a, 0)) return null;
  const secantSlope = a * (left + right) + b;
  return { c: (secantSlope - b) / (2 * a), secantSlope };
}

export function simpsonIntegral(fn: Unary, left: number, right: number, intervals = 200) {
  const count = Math.max(2, intervals + (intervals % 2));
  const h = (right - left) / count;
  let sum = fn(left) + fn(right);
  for (let index = 1; index < count; index++) sum += (index % 2 ? 4 : 2) * fn(left + index * h);
  return sum * h / 3;
}

export function ftcAccumulator(fn: Unary, start: number, x: number) {
  const value = simpsonIntegral(fn, start, x);
  const h = 1e-4, derivative = (simpsonIntegral(fn, start, x + h) - simpsonIntegral(fn, start, x - h)) / (2 * h);
  return { value, derivative, integrand: fn(x), residual: Math.abs(derivative - fn(x)) };
}

export function riemannComparison(fn: Unary, left: number, right: number, intervals: number) {
  const h = (right - left) / intervals;
  let leftSum = 0, rightSum = 0, midpoint = 0, trapezoid = 0;
  for (let index = 0; index < intervals; index++) {
    const x0 = left + index * h, x1 = x0 + h;
    leftSum += fn(x0) * h; rightSum += fn(x1) * h; midpoint += fn((x0 + x1) / 2) * h; trapezoid += (fn(x0) + fn(x1)) * h / 2;
  }
  return { left: leftSum, right: rightSum, midpoint, trapezoid };
}

export function adaptiveIntegral(fn: Unary, left: number, right: number, tolerance = 1e-7) {
  let intervals = 4, previous = simpsonIntegral(fn, left, right, intervals), current = previous;
  do { previous = current; intervals *= 2; current = simpsonIntegral(fn, left, right, intervals); } while (Math.abs(current - previous) > tolerance && intervals < 131072);
  return { value: current, errorEstimate: Math.abs(current - previous) / 15, intervals };
}

export function substitutionBounds(transform: Unary, left: number, right: number) { return { original: [left, right] as const, transformed: [transform(left), transform(right)] as const }; }

export function integrationByParts(u: Unary, dvAntiderivative: Unary, du: Unary, left: number, right: number) {
  const boundary = u(right) * dvAntiderivative(right) - u(left) * dvAntiderivative(left);
  const remainder = simpsonIntegral((x) => dvAntiderivative(x) * du(x), left, right);
  return { boundary, remainder, value: boundary - remainder };
}

export function partialFractionsLinear(numeratorSlope: number, numeratorConstant: number, root1: number, root2: number) {
  if (nearly(root1, root2)) return null;
  const A = (numeratorSlope * root1 + numeratorConstant) / (root1 - root2);
  const B = (numeratorSlope * root2 + numeratorConstant) / (root2 - root1);
  return { A, B };
}

export function improperPIntegral(power: number) { return { converges: power > 1, value: power > 1 ? 1 / (power - 1) : Infinity, criterion: "∫₁∞ x^-p dx converges iff p>1" }; }

export function revolutionVolumes(radius: Unary, left: number, right: number) {
  const washers = Math.PI * simpsonIntegral((x) => radius(x) ** 2, left, right);
  const shells = 2 * Math.PI * simpsonIntegral((x) => Math.abs(x * radius(x)), left, right);
  return { washers, shells };
}

export function odeMethodComparison(f: (x: number, y: number) => number, x0: number, y0: number, x1: number, steps: number) {
  const h = (x1 - x0) / steps; let euler = y0, heun = y0, rk4 = y0, x = x0;
  for (let index = 0; index < steps; index++, x += h) {
    euler += h * f(x, euler);
    const h1 = f(x, heun), h2 = f(x + h, heun + h * h1); heun += h * (h1 + h2) / 2;
    const k1 = f(x, rk4), k2 = f(x + h / 2, rk4 + h * k1 / 2), k3 = f(x + h / 2, rk4 + h * k2 / 2), k4 = f(x + h, rk4 + h * k3); rk4 += h * (k1 + 2 * k2 + 2 * k3 + k4) / 6;
  }
  return { euler, heun, rk4 };
}

export function convergenceTest(input: { kind: "geometric" | "p-series" | "ratio"; parameter: number }) {
  if (input.kind === "geometric") return { converges: Math.abs(input.parameter) < 1, reason: "|r| < 1" };
  if (input.kind === "p-series") return { converges: input.parameter > 1, reason: "p > 1" };
  return { converges: input.parameter < 1, reason: "ratio limit < 1" };
}

export function taylorApproximation(kind: "exp" | "sin" | "cos", x: number, degree: number) {
  let sum = 0;
  for (let n = 0; n <= degree; n++) {
    const derivative = kind === "exp" ? 1 : kind === "sin" ? [0, 1, 0, -1][n % 4] : [1, 0, -1, 0][n % 4];
    sum += derivative * x ** n / factorial(n);
  }
  const actual = kind === "exp" ? Math.exp(x) : kind === "sin" ? Math.sin(x) : Math.cos(x);
  return { approximation: sum, actual, error: Math.abs(actual - sum), degree };
}

export function divergenceFluxLinear(field: { pX: number; qY: number }, rectangle: { width: number; height: number }) {
  const divergence = field.pX + field.qY, area = rectangle.width * rectangle.height;
  return { divergence, area, flux: divergence * area, theorem: "planar divergence theorem" };
}

function factorial(n: number) { let value = 1; for (let index = 2; index <= n; index++) value *= index; return value; }
function nearly(a: number, b: number) { return Math.abs(a - b) < 1e-10; }
