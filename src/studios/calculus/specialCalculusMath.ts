export function gammaIntegrand(s: number, x: number) {
  if (x <= 0 || s <= 0) return 0;
  const log = (s - 1) * Math.log(x) - x;
  if (log < -80) return 0;
  return Math.exp(log);
}

function simpson(f: (x: number) => number, a: number, b: number, n: number) {
  const count = n % 2 === 0 ? n : n + 1;
  const h = (b - a) / count;
  let sum = f(a) + f(b);
  for (let index = 1; index < count; index += 1) {
    sum += (index % 2 === 0 ? 2 : 4) * f(a + index * h);
  }
  return (sum * h) / 3;
}

const lanczos = [
  0.99999999999980993,
  676.5203681218851,
  -1259.1392167224028,
  771.32342877765313,
  -176.61502916214059,
  12.507343278686905,
  -0.13857109526572012,
  9.9843695780195716e-6,
  1.5056327351493116e-7,
];

export function gammaNumeric(s: number): number {
  if (!(s > 0)) return Number.NaN;
  if (s < 0.5) return Math.PI / (Math.sin(Math.PI * s) * gammaNumeric(1 - s));
  const z = s - 1;
  let sum = lanczos[0];
  for (let index = 1; index < lanczos.length; index += 1) sum += lanczos[index] / (z + index);
  const t = z + 7.5;
  return Math.sqrt(2 * Math.PI) * t ** (z + 0.5) * Math.exp(-t) * sum;
}

export function gammaWindowIntegral(s: number, upper = 12) {
  if (!(s > 0)) return Number.NaN;
  return simpson((x) => gammaIntegrand(s, x), Math.min(1e-4, upper / 20), upper, 900);
}

export function gammaRecurrence(s: number) {
  return { left: gammaNumeric(s + 1), right: s * gammaNumeric(s) };
}

export function betaIntegrand(p: number, q: number, x: number) {
  if (x <= 0 || x >= 1 || p <= 0 || q <= 0) return 0;
  const log = (p - 1) * Math.log(x) + (q - 1) * Math.log(1 - x);
  if (log < -80) return 0;
  return Math.exp(log);
}

export function betaNumeric(p: number, q: number) {
  if (p <= 0 || q <= 0) return Number.NaN;
  return simpson((x) => betaIntegrand(p, q, x), 1e-5, 1 - 1e-5, 1200);
}

export function betaFromGamma(p: number, q: number) {
  return (gammaNumeric(p) * gammaNumeric(q)) / gammaNumeric(p + q);
}

export function wallisBeta(m: number, n: number) {
  return 0.5 * betaNumeric(m / 2, n / 2);
}

export function trigPowerIntegral(m: number, n: number) {
  return simpson((theta) => Math.sin(theta) ** (m - 1) * Math.cos(theta) ** (n - 1), 1e-4, Math.PI / 2 - 1e-4, 800);
}

export function jacobian2(xu: number, xv: number, yu: number, yv: number) {
  return xu * yv - xv * yu;
}

export function polarPoint(r: number, theta: number) {
  return { x: r * Math.cos(theta), y: r * Math.sin(theta), jacobian: r };
}

export function cylindricalPoint(r: number, theta: number, z: number) {
  return { x: r * Math.cos(theta), y: r * Math.sin(theta), z, jacobian: r };
}

export function sphericalPoint(rho: number, phi: number, theta: number) {
  return {
    x: rho * Math.sin(phi) * Math.cos(theta),
    y: rho * Math.sin(phi) * Math.sin(theta),
    z: rho * Math.cos(phi),
    jacobian: rho * rho * Math.sin(phi),
  };
}

export function squareToDiamond(u: number, v: number) {
  return { x: (u + v) / 2, y: (u - v) / 2, jacobian: -0.5 };
}
