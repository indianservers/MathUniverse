export type Vec = { x: number; y: number };

export function dist(a: Vec, b: Vec): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function midpoint(a: Vec, b: Vec): Vec {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export function slope(a: Vec, b: Vec): number {
  if (Math.abs(b.x - a.x) < 1e-12) return Number.POSITIVE_INFINITY;
  return (b.y - a.y) / (b.x - a.x);
}

export function sectionPoint(a: Vec, b: Vec, m: number, n: number): Vec {
  const den = m + n;
  if (Math.abs(den) < 1e-12) return a;
  return { x: (n * a.x + m * b.x) / den, y: (n * a.y + m * b.y) / den };
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function snapTo(n: number, spacing: number): number {
  if (spacing <= 0) return n;
  return Math.round(n / spacing) * spacing;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function closestFraction(n: number, maxDen = 16): { num: number; den: number } {
  if (!Number.isFinite(n)) return { num: 1, den: 0 };
  let bestNum = Math.round(n);
  let bestDen = 1;
  let bestErr = Math.abs(n - bestNum);
  for (let den = 1; den <= maxDen; den += 1) {
    const num = Math.round(n * den);
    const err = Math.abs(n - num / den);
    if (err < bestErr - 1e-12 || (Math.abs(err - bestErr) < 1e-12 && den < bestDen)) {
      bestNum = num;
      bestDen = den;
      bestErr = err;
    }
  }
  const g = gcd(bestNum, bestDen);
  return { num: bestNum / g, den: bestDen / g };
}

export function fmtNum(n: number, digits = 5): string {
  if (!Number.isFinite(n)) return "∞";
  const v = Math.round(n * 10 ** digits) / 10 ** digits;
  return String(v);
}

export function fmtPretty(n: number, digits = 5): string {
  const frac = closestFraction(n);
  if (frac.den > 1 && Math.abs(n - frac.num / frac.den) < 1e-9) {
    return `${frac.num}/${frac.den}`;
  }
  return fmtNum(n, digits);
}

export function fmtCoord(n: number, fraction: boolean): string {
  if (fraction) {
    const frac = closestFraction(n);
    if (frac.den > 1 && Math.abs(n - frac.num / frac.den) < 1e-8) return `${frac.num}/${frac.den}`;
  }
  const rounded = Math.round(n * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : fmtNum(n, 2);
}

function coeffX(m: number): string {
  if (Math.abs(m - 1) < 1e-12) return "x";
  if (Math.abs(m + 1) < 1e-12) return "−x";
  const frac = closestFraction(m);
  if (frac.den > 1 && Math.abs(m - frac.num / frac.den) < 1e-9) {
    const sign = frac.num < 0 ? "−" : "";
    return `${sign}${Math.abs(frac.num)}/${frac.den}x`;
  }
  return `${fmtNum(m, 4)}x`;
}

function signedConst(n: number): string {
  if (Math.abs(n) < 1e-12) return "";
  const frac = closestFraction(n);
  const body = frac.den > 1 && Math.abs(n - frac.num / frac.den) < 1e-9
    ? `${Math.abs(frac.num)}/${frac.den}`
    : fmtNum(Math.abs(n), 4);
  return n < 0 ? ` − ${body}` : ` + ${body}`;
}

export function slopeInterceptString(m: number, intercept: number): string {
  if (!Number.isFinite(m)) return `x = ${fmtPretty(intercept)}`;
  return `y = ${coeffX(m)}${signedConst(intercept) || " + 0"}`.replace(" + 0", "");
}

export function slopeToGeneral(m: number, intercept: number): { A: number; B: number; C: number } {
  if (!Number.isFinite(m)) return { A: 1, B: 0, C: -intercept };
  const mf = closestFraction(m);
  const bf = closestFraction(intercept);
  const den = (mf.den * bf.den) / gcd(mf.den, bf.den);
  const A = mf.num * (den / mf.den);
  const B = -den;
  const C = bf.num * (den / bf.den);
  const g = gcd(gcd(Math.abs(A), Math.abs(B)), Math.abs(C));
  const sign = A < 0 || (A === 0 && B < 0) ? -1 : 1;
  return { A: (sign * A) / g, B: (sign * B) / g, C: (sign * C) / g };
}

function linearLeft(A: number, B: number): string {
  const xPart = A === 0 ? "" : A === 1 ? "x" : A === -1 ? "−x" : `${A}x`;
  if (B === 0) return xPart || "0";
  const yAbs = Math.abs(B) === 1 ? "y" : `${Math.abs(B)}y`;
  if (!xPart) return B < 0 ? `−${yAbs}` : yAbs;
  return B < 0 ? `${xPart} − ${yAbs}` : `${xPart} + ${yAbs}`;
}

export function lineForms(m: number, intercept: number): { slope: string; standard: string; general: string } {
  const { A, B, C } = slopeToGeneral(m, intercept);
  return {
    slope: slopeInterceptString(m, intercept),
    standard: `${linearLeft(A, B)} = ${-C}`,
    general: `${linearLeft(A, B)}${C >= 0 ? ` + ${C}` : ` − ${-C}`} = 0`,
  };
}

export function intersectSlopeLines(m1: number, b1: number, m2: number, b2: number): Vec | null {
  if (!Number.isFinite(m1) && !Number.isFinite(m2)) return null;
  if (!Number.isFinite(m1)) return { x: b1, y: m2 * b1 + b2 };
  if (!Number.isFinite(m2)) return { x: b2, y: m1 * b2 + b1 };
  if (Math.abs(m1 - m2) < 1e-12) return null;
  const x = (b2 - b1) / (m1 - m2);
  return { x, y: m1 * x + b1 };
}

export function perpendicularBisector(a: Vec, b: Vec): { m: number; intercept: number; mid: Vec } {
  const mid = midpoint(a, b);
  const s = slope(a, b);
  const m = !Number.isFinite(s) ? 0 : Math.abs(s) < 1e-12 ? Number.POSITIVE_INFINITY : -1 / s;
  const intercept = Number.isFinite(m) ? mid.y - m * mid.x : mid.x;
  return { m, intercept, mid };
}

export function riseRun(m: number): { rise: number; run: number } {
  if (!Number.isFinite(m)) return { rise: 1, run: 0 };
  const frac = closestFraction(m);
  return { rise: frac.num, run: frac.den };
}
