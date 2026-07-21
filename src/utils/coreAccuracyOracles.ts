export const CORE_ACCURACY_EPSILON = 1e-9;

export function evaluateLinear(m: number, c: number, x: number) {
  return m * x + c;
}

export type QuadraticAnalysis = {
  kind: "quadratic" | "linear" | "constant";
  discriminant: number | null;
  realRoots: number[];
  vertex: { x: number; y: number } | null;
  axis: number | null;
};

export function analyzeQuadratic(a: number, b: number, c: number, epsilon = CORE_ACCURACY_EPSILON): QuadraticAnalysis {
  if (Math.abs(a) <= epsilon) {
    if (Math.abs(b) <= epsilon) return { kind: "constant", discriminant: null, realRoots: [], vertex: null, axis: null };
    return { kind: "linear", discriminant: null, realRoots: [-c / b], vertex: null, axis: null };
  }
  const discriminant = b * b - 4 * a * c;
  const axis = -b / (2 * a);
  const vertex = { x: axis, y: a * axis * axis + b * axis + c };
  if (discriminant < -epsilon) return { kind: "quadratic", discriminant, realRoots: [], vertex, axis };
  if (Math.abs(discriminant) <= epsilon) return { kind: "quadratic", discriminant: 0, realRoots: [axis], vertex, axis };
  const sqrtD = Math.sqrt(discriminant);
  const q = -0.5 * (b + Math.sign(b || 1) * sqrtD);
  const roots = q === 0 ? [(-b + sqrtD) / (2 * a), (-b - sqrtD) / (2 * a)] : [q / a, c / q];
  return { kind: "quadratic", discriminant, realRoots: roots.sort((left, right) => left - right), vertex, axis };
}

export function quadraticResidual(a: number, b: number, c: number, x: number) {
  return a * x * x + b * x + c;
}

export type SlopeSystemAnalysis =
  | { kind: "unique"; x: number; y: number; residual1: number; residual2: number }
  | { kind: "parallel"; distance: number }
  | { kind: "identical" };

export function analyzeSlopeSystem(m1: number, c1: number, m2: number, c2: number, epsilon = CORE_ACCURACY_EPSILON): SlopeSystemAnalysis {
  if (Math.abs(m1 - m2) <= epsilon) {
    if (Math.abs(c1 - c2) <= epsilon) return { kind: "identical" };
    return { kind: "parallel", distance: Math.abs(c2 - c1) / Math.sqrt(m1 * m1 + 1) };
  }
  const x = (c2 - c1) / (m1 - m2);
  const y = evaluateLinear(m1, c1, x);
  return { kind: "unique", x, y, residual1: y - evaluateLinear(m1, c1, x), residual2: y - evaluateLinear(m2, c2, x) };
}

export function greatestCommonDivisor(a: number, b: number) {
  let left = Math.abs(Math.trunc(a));
  let right = Math.abs(Math.trunc(b));
  while (right !== 0) [left, right] = [right, left % right];
  return left;
}

export function leastCommonMultiple(a: number, b: number) {
  if (!Number.isInteger(a) || !Number.isInteger(b)) throw new Error("LCM inputs must be integers.");
  if (a === 0 || b === 0) return 0;
  return Math.abs((a / greatestCommonDivisor(a, b)) * b);
}

export function canonicalModulo(value: number, modulus: number) {
  if (!Number.isInteger(value) || !Number.isInteger(modulus) || modulus <= 0) throw new Error("Modulo needs an integer value and positive integer modulus.");
  return ((value % modulus) + modulus) % modulus;
}

/** Coefficients are ordered from highest power to constant term. */
export function evaluatePolynomial(coefficients: number[], x: number) {
  return coefficients.reduce((value, coefficient) => value * x + coefficient, 0);
}

export function normalizeRational(numerator: number, denominator: number) {
  if (!Number.isInteger(numerator) || !Number.isInteger(denominator)) throw new Error("Rational components must be integers.");
  if (denominator === 0) throw new Error("A rational denominator cannot be zero.");
  const sign = denominator < 0 ? -1 : 1;
  const gcd = greatestCommonDivisor(numerator, denominator) || 1;
  return { numerator: sign * numerator / gcd, denominator: Math.abs(denominator) / gcd };
}

export function isPerfectSquareInteger(value: number) {
  return Number.isInteger(value) && value >= 0 && Number.isInteger(Math.sqrt(value));
}

export function triangleMetrics(a: number, b: number, c: number) {
  const valid = a > 0 && b > 0 && c > 0 && a + b > c && b + c > a && c + a > b;
  if (!valid) return { valid: false as const, area: 0, angleSum: null };
  const semiperimeter = (a + b + c) / 2;
  const area = Math.sqrt(Math.max(0, semiperimeter * (semiperimeter - a) * (semiperimeter - b) * (semiperimeter - c)));
  const angles = [
    Math.acos(clampCosine((b * b + c * c - a * a) / (2 * b * c))),
    Math.acos(clampCosine((a * a + c * c - b * b) / (2 * a * c))),
    Math.acos(clampCosine((a * a + b * b - c * c) / (2 * a * b))),
  ];
  return { valid: true as const, area, angles, angleSum: angles.reduce((sum, angle) => sum + angle, 0) };
}

export function rightTriangleMetrics(a: number, b: number) {
  if (!(a > 0 && b > 0)) throw new Error("Right-triangle legs must be positive.");
  const c = Math.hypot(a, b);
  return { a, b, c, squaredResidual: a * a + b * b - c * c };
}

export function circleMetrics(radius: number, thetaRadians = 2 * Math.PI) {
  if (!(radius > 0)) throw new Error("Circle radius must be positive.");
  return {
    circumference: 2 * Math.PI * radius,
    area: Math.PI * radius * radius,
    arcLength: radius * thetaRadians,
    sectorArea: 0.5 * radius * radius * thetaRadians,
  };
}

export function coordinateMetrics(point1: readonly [number, number], point2: readonly [number, number]) {
  const dx = point2[0] - point1[0];
  const dy = point2[1] - point1[1];
  return { distance: Math.hypot(dx, dy), midpoint: [(point1[0] + point2[0]) / 2, (point1[1] + point2[1]) / 2] as const, slope: dx === 0 ? null : dy / dx };
}

export function similarityMetrics(source: readonly number[], target: readonly number[], epsilon = CORE_ACCURACY_EPSILON) {
  if (source.length !== target.length || source.length === 0 || source.some((side) => side <= 0) || target.some((side) => side <= 0)) return { similar: false as const, scale: null };
  const scale = target[0] / source[0];
  return { similar: target.every((side, index) => Math.abs(side / source[index] - scale) <= epsilon) as boolean, scale };
}

export function unitCirclePoint(thetaRadians: number) {
  const x = Math.cos(thetaRadians);
  const y = Math.sin(thetaRadians);
  return { x, y, radiusResidual: x * x + y * y - 1 };
}

export function sinusoidMetrics(amplitudeCoefficient: number, angularFrequency: number, phase: number, offset: number) {
  return {
    amplitude: Math.abs(amplitudeCoefficient),
    period: angularFrequency === 0 ? null : (2 * Math.PI) / Math.abs(angularFrequency),
    phaseShift: angularFrequency === 0 ? null : -phase / angularFrequency,
    range: [offset - Math.abs(amplitudeCoefficient), offset + Math.abs(amplitudeCoefficient)] as const,
  };
}

export function angularDiameterOfSphere(radius: number, centerDistance: number) {
  if (!(radius >= 0) || !(centerDistance > radius)) throw new Error("Observer must be outside a sphere with nonnegative radius.");
  return 2 * Math.asin(radius / centerDistance);
}

export type SolarEclipseKind = "none" | "partial" | "annular" | "total";

export function classifySolarEclipseAngular(sunDiameter: number, moonDiameter: number, centerSeparation: number): SolarEclipseKind {
  if (sunDiameter < 0 || moonDiameter < 0 || centerSeparation < 0) throw new Error("Angular sizes and separation must be nonnegative.");
  const sunRadius = sunDiameter / 2;
  const moonRadius = moonDiameter / 2;
  if (centerSeparation >= sunRadius + moonRadius) return "none";
  if (centerSeparation > Math.abs(sunRadius - moonRadius)) return "partial";
  return moonRadius >= sunRadius ? "total" : "annular";
}

export function diskOverlapFraction(coveredRadius: number, coveringRadius: number, separation: number) {
  if (!(coveredRadius > 0) || coveringRadius < 0 || separation < 0) throw new Error("Disk radii and separation are invalid.");
  if (separation >= coveredRadius + coveringRadius) return 0;
  if (separation <= Math.abs(coveredRadius - coveringRadius)) return Math.min(1, (coveringRadius * coveringRadius) / (coveredRadius * coveredRadius));
  const a = coveredRadius ** 2 * Math.acos((separation ** 2 + coveredRadius ** 2 - coveringRadius ** 2) / (2 * separation * coveredRadius));
  const b = coveringRadius ** 2 * Math.acos((separation ** 2 + coveringRadius ** 2 - coveredRadius ** 2) / (2 * separation * coveringRadius));
  const lens = 0.5 * Math.sqrt((-separation + coveredRadius + coveringRadius) * (separation + coveredRadius - coveringRadius) * (separation - coveredRadius + coveringRadius) * (separation + coveredRadius + coveringRadius));
  return Math.max(0, Math.min(1, (a + b - lens) / (Math.PI * coveredRadius ** 2)));
}

export function centralDerivative(fn: (x: number) => number, x: number, h = 1e-5) {
  if (!(h > 0)) throw new Error("Derivative step h must be positive.");
  return (fn(x + h) - fn(x - h)) / (2 * h);
}

export function simpsonIntegral(fn: (x: number) => number, a: number, b: number, intervals = 200) {
  const count = intervals % 2 === 0 ? intervals : intervals + 1;
  if (count < 2) throw new Error("Simpson integration needs at least two intervals.");
  const h = (b - a) / count;
  let sum = fn(a) + fn(b);
  for (let index = 1; index < count; index += 1) sum += (index % 2 === 0 ? 2 : 4) * fn(a + index * h);
  return (sum * h) / 3;
}

export function areaBetweenCurves(first: (x: number) => number, second: (x: number) => number, a: number, b: number, intervals = 400) {
  return simpsonIntegral((x) => Math.abs(first(x) - second(x)), a, b, intervals);
}

export function eulerStep(derivative: (x: number, y: number) => number, x: number, y: number, step: number) {
  if (!(step > 0)) throw new Error("Euler step must be positive.");
  return { x: x + step, y: y + step * derivative(x, y) };
}

function clampCosine(value: number) {
  return Math.max(-1, Math.min(1, value));
}
