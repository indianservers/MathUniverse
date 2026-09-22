export type SeriesVerdict = "converges" | "diverges" | "inconclusive" | "not-applicable";

export type SeriesCase = {
  id: string;
  name: string;
  term: (n: number) => number;
  absolute: (n: number) => number;
  start: number;
};

export const seriesCases: SeriesCase[] = [
  { id: "geometric", name: "Σ (1/2)^n", term: (n) => 0.5 ** n, absolute: (n) => 0.5 ** n, start: 1 },
  { id: "harmonic", name: "Σ 1/n", term: (n) => 1 / n, absolute: (n) => 1 / n, start: 1 },
  { id: "p2", name: "Σ 1/n²", term: (n) => 1 / n ** 2, absolute: (n) => 1 / n ** 2, start: 1 },
  { id: "factorial", name: "Σ 2^n / n!", term: (n) => 2 ** n / factorial(n), absolute: (n) => 2 ** n / factorial(n), start: 0 },
  { id: "alternating-harmonic", name: "Σ (−1)^(n−1) / n", term: (n) => ((-1) ** (n - 1)) / n, absolute: (n) => 1 / n, start: 1 },
  { id: "alternating-p", name: "Σ (−1)^(n−1) / n²", term: (n) => ((-1) ** (n - 1)) / n ** 2, absolute: (n) => 1 / n ** 2, start: 1 },
  { id: "sqrt", name: "Σ 1/√n", term: (n) => 1 / Math.sqrt(n), absolute: (n) => 1 / Math.sqrt(n), start: 1 },
];

function factorial(n: number) {
  let value = 1;
  for (let k = 2; k <= n; k += 1) value *= k;
  return value;
}

export function sequenceLimit(term: (n: number) => number, start = 1) {
  const samples = [40, 80, 160].map((n) => term(Math.max(start, n)));
  const finite = samples.every((value) => Number.isFinite(value));
  const spread = Math.max(...samples) - Math.min(...samples);
  return { samples, value: samples[samples.length - 1], stable: finite && spread < 0.05 };
}

export function ratioLimit(series: SeriesCase) {
  return sequenceLimit((n) => {
    const current = series.absolute(n);
    const next = series.absolute(n + 1);
    return current === 0 ? 0 : Math.abs(next / current);
  }, series.start);
}

export function rootLimit(series: SeriesCase) {
  return sequenceLimit((n) => Math.abs(series.absolute(n)) ** (1 / n), series.start);
}

export function raabeLimit(series: SeriesCase) {
  return sequenceLimit((n) => {
    const current = series.absolute(n);
    const next = series.absolute(n + 1);
    if (next === 0) return Infinity;
    return n * (current / next - 1);
  }, Math.max(series.start, 2));
}

export function logarithmicLimit(series: SeriesCase) {
  return sequenceLimit((n) => {
    const magnitude = Math.abs(series.absolute(n));
    if (magnitude <= 0) return Infinity;
    return Math.log(1 / magnitude) / Math.log(n);
  }, Math.max(series.start, 2));
}

function threshold(limit: number, equalIsInconclusive: boolean): SeriesVerdict {
  if (!Number.isFinite(limit)) return limit === Infinity ? "diverges" : "inconclusive";
  if (Math.abs(limit - 1) < 0.08 && equalIsInconclusive) return "inconclusive";
  if (limit < 1) return "converges";
  if (limit > 1) return "diverges";
  return "inconclusive";
}

export function nthTermVerdict(series: SeriesCase): SeriesVerdict {
  const limit = sequenceLimit(series.term, series.start);
  if (!limit.stable) return "inconclusive";
  return Math.abs(limit.value) > 0.05 ? "diverges" : "inconclusive";
}

export function runNamedTest(series: SeriesCase, test: string): { verdict: SeriesVerdict; detail: string } {
  if (test === "nth") {
    const verdict = nthTermVerdict(series);
    return { verdict, detail: verdict === "diverges" ? "The terms do not go to 0, so the series diverges." : "The terms go to 0, so this test is inconclusive." };
  }
  if (test === "ratio") {
    const limit = ratioLimit(series);
    const verdict = limit.stable ? threshold(limit.value, true) : "inconclusive";
    return { verdict, detail: `The ratio limit is about ${limit.value.toFixed(3)}. Below 1 gives absolute convergence, above 1 gives divergence, and 1 is inconclusive.` };
  }
  if (test === "root") {
    const limit = rootLimit(series);
    const verdict = limit.stable ? threshold(limit.value, true) : "inconclusive";
    return { verdict, detail: `The root limit is about ${limit.value.toFixed(3)}. The same three-way rule as the ratio test applies.` };
  }
  if (test === "raabe") {
    const limit = raabeLimit(series);
    let verdict: SeriesVerdict = "inconclusive";
    if (limit.stable && limit.value > 1.15) verdict = "converges";
    else if (limit.stable && limit.value < 0.85) verdict = "diverges";
    return { verdict, detail: `Raabe's limit n(|a_n/a_(n+1)| − 1) is about ${limit.value.toFixed(3)}. Greater than 1 converges, less than 1 diverges, and 1 is inconclusive.` };
  }
  if (test === "log") {
    const limit = logarithmicLimit(series);
    let verdict: SeriesVerdict = "inconclusive";
    if (limit.stable && limit.value > 1.15) verdict = "converges";
    else if (limit.stable && limit.value < 0.85) verdict = "diverges";
    return { verdict, detail: `The logarithmic limit ln(1/|a_n|) / ln n is about ${limit.value.toFixed(3)}. Greater than 1 converges, less than 1 diverges, and 1 is inconclusive.` };
  }
  if (test === "integral") {
    if (series.id === "p2" || series.id === "geometric" || series.id === "alternating-p") return { verdict: "converges", detail: "The integral of a decreasing positive comparison function converges." };
    if (series.id === "harmonic" || series.id === "sqrt" || series.id === "alternating-harmonic") return { verdict: series.id.startsWith("alternating") ? "not-applicable" : "diverges", detail: series.id.startsWith("alternating") ? "The integral test needs a positive decreasing function. Use it on the absolute series." : "The p-integral with p ≤ 1 diverges, so the series diverges." };
    return { verdict: "not-applicable", detail: "This preset is not set up as an integral test." };
  }
  if (test === "alternating") {
    if (!series.id.startsWith("alternating")) return { verdict: "not-applicable", detail: "The terms are not alternating." };
    const decreasing = series.absolute(20) > series.absolute(40) && series.absolute(40) > series.absolute(80);
    const toZero = Math.abs(series.absolute(160)) < 0.05;
    return { verdict: decreasing && toZero ? "converges" : "inconclusive", detail: "Leibniz needs nonnegative terms, a monotone decrease, and a limit of 0. That gives convergence, not yet absolute convergence." };
  }
  if (test === "absolute") {
    const absolute = runNamedTest({ ...series, id: series.id.replace("alternating-", ""), term: series.absolute, name: "absolute" }, series.id.includes("p") ? "raabe" : "ratio");
    if (series.id === "alternating-harmonic") return { verdict: "diverges", detail: "The absolute series is the harmonic series, which diverges. The alternating series itself converges, so convergence is conditional." };
    if (series.id === "alternating-p") return { verdict: "converges", detail: "The absolute series is a p-series with p = 2, so convergence is absolute." };
    return absolute;
  }
  if (test === "limit-comparison") {
    if (series.id.startsWith("alternating") || series.id === "factorial") {
      return { verdict: "not-applicable", detail: "Limit comparison, as shown here, needs a positive-term partner. Use the ratio test for the factorial series, and the alternating-series test for signed terms." };
    }
    if (series.id === "geometric") {
      const limit = sequenceLimit((n) => series.absolute(n) / (1 / 3) ** n, series.start);
      const shown = Number.isFinite(limit.value) ? limit.value.toExponential(2) : "infinity";
      return { verdict: "inconclusive", detail: `Against Σ (1/3)^n the quotient grows without a positive finite limit (last sample ${shown}). Limit comparison does not decide this geometric series.` };
    }
    const partner = series.id === "p2" ? "Σ 1/n²" : series.id === "harmonic" ? "Σ 1/n" : "Σ 1/√n";
    const verdict = series.id === "p2" ? "converges" : "diverges";
    return { verdict, detail: `The quotient against ${partner} tends to 1, a positive finite limit, so the series ${verdict === "converges" ? "converges" : "diverges"} with that partner.` };
  }
  if (test === "comparison") {
    if (series.id === "p2" || series.id === "geometric") return { verdict: "converges", detail: "A larger convergent series dominates these positive terms." };
    if (series.id === "harmonic" || series.id === "sqrt") return { verdict: "diverges", detail: "A smaller divergent p-series sits underneath these positive terms." };
    return { verdict: "not-applicable", detail: "Direct comparison is shown for the positive p-series and geometric presets." };
  }
  return { verdict: "not-applicable", detail: "Choose a test that matches the shape of the term." };
}

export function rationalCurve(x: number) {
  if (Math.abs(x * x - 1) < 1e-4) return Number.NaN;
  return (x ** 3) / (x * x - 1);
}

export function rationalDerivative(x: number) {
  const denominator = (x * x - 1) ** 2;
  if (denominator < 1e-8) return Number.NaN;
  return (x ** 4 - 3 * x * x) / denominator;
}

export function rationalObliqueGap(x: number) {
  if (Math.abs(x * x - 1) < 1e-4) return Number.NaN;
  return x / (x * x - 1);
}

export function semicubical(x: number) {
  if (x < 0) return null;
  const height = x ** 1.5;
  return { upper: height, lower: -height, slope: 1.5 * Math.sqrt(x) };
}

export function foliumPoint(t: number, a = 1) {
  const denominator = 1 + t ** 3;
  if (Math.abs(denominator) < 1e-4) return null;
  return { x: (3 * a * t) / denominator, y: (3 * a * t * t) / denominator };
}

export function polarPoint(theta: number, kind: "cardioid" | "limacon" | "rose" | "lemniscate" | "spiral") {
  if (kind === "cardioid") return 1 + Math.cos(theta);
  if (kind === "limacon") return 1 + 2 * Math.cos(theta);
  if (kind === "rose") return Math.cos(2 * theta);
  if (kind === "spiral") return theta / Math.PI;
  const value = Math.cos(2 * theta);
  return value >= 0 ? Math.sqrt(value) : Number.NaN;
}

export function taylorExp(a: number, b: number, h: number, k: number) {
  const base = Math.exp(a + b);
  const f = Math.exp(a + b + h + k);
  const linear = base * (1 + h + k);
  const quadratic = base * (1 + h + k + ((h + k) ** 2) / 2);
  return { f, linear, quadratic, gradient: [base, base], hessian: [[base, base], [base, base]] };
}

export function taylorTrig(a: number, b: number, h: number, k: number) {
  const f0 = Math.sin(a) * Math.cos(b);
  const fx = Math.cos(a) * Math.cos(b);
  const fy = -Math.sin(a) * Math.sin(b);
  const fxx = -Math.sin(a) * Math.cos(b);
  const fxy = -Math.cos(a) * Math.sin(b);
  const fyy = -Math.sin(a) * Math.cos(b);
  const f = Math.sin(a + h) * Math.cos(b + k);
  const linear = f0 + fx * h + fy * k;
  const quadratic = linear + 0.5 * (fxx * h * h + 2 * fxy * h * k + fyy * k * k);
  return { f, linear, quadratic, gradient: [fx, fy], hessian: [[fxx, fxy], [fxy, fyy]] };
}

export function taylorPolynomial(x: number, y: number) {
  return x * x + x * y + y * y;
}

export function taylorPolynomialExpansion(a: number, b: number, h: number, k: number) {
  const f0 = taylorPolynomial(a, b);
  const fx = 2 * a + b;
  const fy = a + 2 * b;
  const linear = f0 + fx * h + fy * k;
  const quadratic = linear + h * h + h * k + k * k;
  return { f: taylorPolynomial(a + h, b + k), linear, quadratic, gradient: [fx, fy], hessian: [[2, 1], [1, 2]] };
}

export function lagrangeCircle(radius: number) {
  const coordinate = Math.sqrt(radius * radius / 2);
  return {
    max: { x: coordinate, y: coordinate, value: 2 * coordinate, lambda: 1 / (2 * coordinate) },
    min: { x: -coordinate, y: -coordinate, value: -2 * coordinate, lambda: 1 / (-2 * coordinate) },
  };
}

export function lagrangeLine() {
  return { x: 0.5, y: 0.5, value: 0.5, lambda: 1 };
}

export function triangleOrder() {
  const vertical = 0.5;
  const horizontal = 0.5;
  return { vertical, horizontal, equal: Math.abs(vertical - horizontal) < 1e-9, area: 0.5 };
}

export function splitRegionOrder() {
  const left = 0.5;
  const right = 0.5;
  const horizontal = 1;
  return { vertical: left + right, horizontal, equal: true, area: 1 };
}

export function rectangleCentroid(width: number, height: number) {
  return { x: width / 2, y: height / 2, area: width * height };
}

export function variableDensityCentroid(width: number, height: number, slope: number) {
  const mass = height * (width + (slope * width * width) / 2);
  const momentX = height * ((width * width) / 2 + (slope * width ** 3) / 3);
  const momentY = (height * height / 2) * (width + (slope * width * width) / 2);
  return { mass, x: momentX / mass, y: momentY / mass };
}

export function rightTriangleCentroid() {
  return { x: 2 / 3, y: 1 / 3, area: 0.5 };
}

export function rectangleInertia(width: number, height: number, density: number) {
  const ix = density * width * height ** 3 / 3;
  const iy = density * height * width ** 3 / 3;
  return { ix, iy, io: ix + iy, mass: density * width * height, kind: "mass moment about the coordinate axes" };
}

export function diskInertia(radius: number, density: number) {
  const mass = density * Math.PI * radius * radius;
  const io = 0.5 * mass * radius * radius;
  return { io, mass, ix: io / 2, iy: io / 2 };
}

export function annulusInertia(inner: number, outer: number, density: number) {
  const mass = density * Math.PI * (outer ** 2 - inner ** 2);
  const io = 0.5 * density * Math.PI * (outer ** 4 - inner ** 4);
  return { io, mass };
}

export function triangleInertia() {
  return { ix: 1 / 12, iy: 1 / 4, io: 1 / 3, mass: 0.5 };
}

export function boxTriple(a: number, b: number, c: number) {
  return { volume: a * b * c, centroid: [a / 2, b / 2, c / 2], averageX: a / 2 };
}

export function cylinderVolume(radius: number, height: number) {
  return Math.PI * radius * radius * height;
}

export function sphereVolume(radius: number) {
  return (4 / 3) * Math.PI * radius ** 3;
}
