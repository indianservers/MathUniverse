export type AngleUnit = "degrees" | "radians" | "gradians";
export type Complex = { real: number; imaginary: number };

export function toRadians(value: number, unit: AngleUnit) { return unit === "degrees" ? value * Math.PI / 180 : unit === "gradians" ? value * Math.PI / 200 : value; }
export function fromRadians(value: number, unit: AngleUnit) { return unit === "degrees" ? value * 180 / Math.PI : unit === "gradians" ? value * 200 / Math.PI : value; }

const notable = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];
export function snapNotableAngle(degrees: number, tolerance = 3) {
  const normalized = ((degrees % 360) + 360) % 360;
  const nearest = notable.reduce((best, candidate) => Math.abs(candidate - normalized) < Math.abs(best - normalized) ? candidate : best, notable[0]);
  return { input: degrees, snapped: Math.abs(nearest - normalized) <= tolerance ? nearest % 360 : normalized, exact: Math.abs(nearest - normalized) <= tolerance };
}

export function sixTrigFunctions(angleRadians: number) {
  const sin = Math.sin(angleRadians), cos = Math.cos(angleRadians);
  return { sin, cos, tan: safeDivide(sin, cos), csc: safeDivide(1, sin), sec: safeDivide(1, cos), cot: safeDivide(cos, sin) };
}

export function referenceTriangle(angleRadians: number) {
  const x = Math.cos(angleRadians), y = Math.sin(angleRadians);
  return { x, y, hypotenuse: 1, quadrant: x >= 0 && y >= 0 ? 1 : x < 0 && y >= 0 ? 2 : x < 0 ? 3 : 4, referenceAngle: Math.atan2(Math.abs(y), Math.abs(x)) };
}

export function inverseBranch(functionName: "asin" | "acos" | "atan", value: number) {
  const inDomain = functionName === "atan" || Math.abs(value) <= 1;
  const result = !inDomain ? undefined : functionName === "asin" ? Math.asin(value) : functionName === "acos" ? Math.acos(value) : Math.atan(value);
  return { inDomain, result, range: functionName === "asin" ? "[-π/2, π/2]" : functionName === "acos" ? "[0, π]" : "(-π/2, π/2)" };
}

export function waveTransform(amplitude: number, frequency: number, phase: number, vertical: number, x: number) {
  return { y: amplitude * Math.sin(frequency * x + phase) + vertical, amplitude: Math.abs(amplitude), period: frequency === 0 ? Infinity : 2 * Math.PI / Math.abs(frequency), phaseShift: frequency === 0 ? undefined : -phase / frequency, midline: vertical };
}

export function circleWaveSync(angle: number) { return { circle: { x: Math.cos(angle), y: Math.sin(angle) }, wave: { x: angle, y: Math.sin(angle) } }; }
export function sumDifference(a: number, b: number) { return { sinSum: Math.sin(a) * Math.cos(b) + Math.cos(a) * Math.sin(b), sinDirect: Math.sin(a + b), cosDifference: Math.cos(a) * Math.cos(b) + Math.sin(a) * Math.sin(b), cosDirect: Math.cos(a - b) }; }
export function doubleHalf(angle: number) { return { sinDouble: 2 * Math.sin(angle) * Math.cos(angle), cosDouble: Math.cos(angle) ** 2 - Math.sin(angle) ** 2, sinHalfMagnitude: Math.sqrt(Math.max(0, (1 - Math.cos(angle)) / 2)) }; }

export function verifyIdentity(left: (x: number) => number, right: (x: number) => number, samples = [.17, .43, .91, 1.37]) {
  const residuals = samples.map((x) => Math.abs(left(x) - right(x)));
  return { validOnSamples: residuals.every((r) => r < 1e-10), maxResidual: Math.max(...residuals) };
}

export function sineEquationSolutions(value: number, minimum = 0, maximum = 2 * Math.PI) {
  if (Math.abs(value) > 1) return [];
  const alpha = Math.asin(value), candidates: number[] = [];
  for (let k = -3; k <= 3; k++) for (const solution of [alpha + 2 * Math.PI * k, Math.PI - alpha + 2 * Math.PI * k]) if (solution >= minimum - 1e-10 && solution <= maximum + 1e-10 && !candidates.some((x) => Math.abs(x - solution) < 1e-9)) candidates.push(solution);
  return candidates.sort((a, b) => a - b);
}

export function sinePositiveIntervals(minimum = 0, maximum = 2 * Math.PI) {
  const intervals: Array<[number, number]> = [];
  for (let k = Math.floor(minimum / (2 * Math.PI)) - 1; k <= Math.ceil(maximum / (2 * Math.PI)) + 1; k++) {
    const left = Math.max(minimum, 2 * Math.PI * k), right = Math.min(maximum, Math.PI + 2 * Math.PI * k);
    if (left < right) intervals.push([left, right]);
  }
  return intervals;
}

export function ambiguousSSA(a: number, b: number, angleA: number) {
  const ratio = b * Math.sin(angleA) / a;
  if (ratio > 1 || ratio < -1 || a <= 0 || b <= 0) return [];
  const first = Math.asin(ratio), second = Math.PI - first;
  return [first, second].filter((angleB) => angleA + angleB < Math.PI - 1e-10).map((angleB) => ({ angleB, angleC: Math.PI - angleA - angleB, sideC: a * Math.sin(Math.PI - angleA - angleB) / Math.sin(angleA) }));
}

export function solveTriangleSAS(sideA: number, sideB: number, includedAngle: number) {
  const sideC = Math.sqrt(Math.max(0, sideA ** 2 + sideB ** 2 - 2 * sideA * sideB * Math.cos(includedAngle)));
  const angleA = sideC === 0 ? 0 : Math.acos(clamp((sideB ** 2 + sideC ** 2 - sideA ** 2) / (2 * sideB * sideC)));
  return { sideA, sideB, sideC, angleA, angleB: Math.PI - includedAngle - angleA, angleC: includedAngle, valid: sideA > 0 && sideB > 0 && includedAngle > 0 && includedAngle < Math.PI };
}

export function triangleUncertainty(sideA: number, sideB: number, includedAngle: number, error: number) {
  const values = [-error, error].flatMap((da) => [-error, error].flatMap((db) => [-error, error].map((dc) => solveTriangleSAS(Math.max(.001, sideA + da), Math.max(.001, sideB + db), clampAngle(includedAngle + dc)).sideC)));
  return { minimumSideC: Math.min(...values), maximumSideC: Math.max(...values), spread: Math.max(...values) - Math.min(...values) };
}

export function heightFromElevation(distance: number, elevation: number, observerHeight = 0) { return { height: observerHeight + distance * Math.tan(elevation), horizontalDistance: distance }; }
export function bearingVector(distance: number, bearingRadians: number) { return { east: distance * Math.sin(bearingRadians), north: distance * Math.cos(bearingRadians) }; }
export function polarRose(k: number, angle: number, sine = false) { const radius = sine ? Math.sin(k * angle) : Math.cos(k * angle); return { radius, x: radius * Math.cos(angle), y: radius * Math.sin(angle), petals: Number.isInteger(k) ? (Math.abs(k) % 2 ? Math.abs(k) : 2 * Math.abs(k)) : undefined }; }

export function addPhasors(first: { magnitude: number; phase: number }, second: { magnitude: number; phase: number }) {
  const real = first.magnitude * Math.cos(first.phase) + second.magnitude * Math.cos(second.phase), imaginary = first.magnitude * Math.sin(first.phase) + second.magnitude * Math.sin(second.phase);
  return { real, imaginary, magnitude: Math.hypot(real, imaginary), phase: Math.atan2(imaginary, real) };
}

export function fourierSynthesis(angle: number, harmonics: number) {
  const components = Array.from({ length: Math.max(1, harmonics) }, (_, index) => { const n = 2 * index + 1; return { harmonic: n, amplitude: 4 / (Math.PI * n), value: 4 * Math.sin(n * angle) / (Math.PI * n) }; });
  return { components, value: components.reduce((sum, item) => sum + item.value, 0), target: Math.sign(Math.sin(angle)) };
}

export function beatWave(amplitude: number, f1: number, f2: number, time: number) { return { value: amplitude * (Math.sin(2 * Math.PI * f1 * time) + Math.sin(2 * Math.PI * f2 * time)), beatFrequency: Math.abs(f1 - f2), carrierFrequency: (f1 + f2) / 2 }; }

export function sphericalTriangleSide(a: number, b: number, includedAngle: number) { return { c: Math.acos(clamp(Math.cos(a) * Math.cos(b) + Math.sin(a) * Math.sin(b) * Math.cos(includedAngle))) }; }
export function hyperbolicFunctions(x: number) { const sinh = Math.sinh(x), cosh = Math.cosh(x); return { sinh, cosh, tanh: Math.tanh(x), identityResidual: Math.abs(cosh ** 2 - sinh ** 2 - 1) }; }
export function singularityStability(angle: number) { const cos = Math.cos(angle), tan = Math.tan(angle); return { tan, distanceToCosZero: Math.abs(cos), stable: Math.abs(cos) > 1e-6, warning: Math.abs(cos) <= 1e-6 ? "tan and sec are numerically unstable near cos θ = 0" : undefined }; }

export function exactAngleValue(degrees: number) {
  const snapped = snapNotableAngle(degrees, 1e-9), values: Record<number, [string, string]> = { 0:["0","1"],30:["1/2","√3/2"],45:["√2/2","√2/2"],60:["√3/2","1/2"],90:["1","0"],120:["√3/2","−1/2"],135:["√2/2","−√2/2"],150:["1/2","−√3/2"],180:["0","−1"],210:["−1/2","−√3/2"],225:["−√2/2","−√2/2"],240:["−√3/2","−1/2"],270:["−1","0"],300:["−√3/2","1/2"],315:["−√2/2","√2/2"],330:["−1/2","√3/2"] };
  return { degrees: snapped.snapped, sin: values[snapped.snapped]?.[0], cos: values[snapped.snapped]?.[1], exact: Boolean(values[snapped.snapped]) };
}

function safeDivide(a: number, b: number) { return Math.abs(b) < 1e-12 ? undefined : a / b; }
function clamp(value: number) { return Math.max(-1, Math.min(1, value)); }
function clampAngle(value: number) { return Math.max(1e-6, Math.min(Math.PI - 1e-6, value)); }
