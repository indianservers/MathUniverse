export type C = { re: number; im: number };

export function addC(a: C, b: C): C {
  return { re: a.re + b.re, im: a.im + b.im };
}

export function subC(a: C, b: C): C {
  return { re: a.re - b.re, im: a.im - b.im };
}

export function mulC(a: C, b: C): C {
  return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
}

export function divC(a: C, b: C): C {
  const den = b.re * b.re + b.im * b.im;
  if (den === 0) return { re: Number.NaN, im: Number.NaN };
  return { re: (a.re * b.re + a.im * b.im) / den, im: (a.im * b.re - a.re * b.im) / den };
}

export function conjC(z: C): C {
  return { re: z.re, im: -z.im };
}

export function modC(z: C): number {
  return Math.hypot(z.re, z.im);
}

export function argC(z: C): number {
  return Math.atan2(z.im, z.re);
}

export function fromPolar(r: number, deg: number): C {
  const rad = (deg * Math.PI) / 180;
  return { re: r * Math.cos(rad), im: r * Math.sin(rad) };
}

export function wrapDeg(deg: number, branch = -180): number {
  let t = deg;
  while (t < branch) t += 360;
  while (t >= branch + 360) t -= 360;
  return t;
}

export function nthRoots(z: C, n: number): C[] {
  const count = Math.max(1, Math.round(n));
  const r = modC(z) ** (1 / count);
  const th = argC(z);
  return Array.from({ length: count }, (_, k) => {
    const a = (th + 2 * Math.PI * k) / count;
    return { re: r * Math.cos(a), im: r * Math.sin(a) };
  });
}

export function fmtSigned(n: number, digits = 2): string {
  const v = Number.isFinite(n) ? n : 0;
  const abs = Math.abs(v).toFixed(digits);
  return v < 0 ? `−${abs}` : abs;
}

export function fmtC(z: C, digits = 2): string {
  const im = z.im;
  const sign = im < 0 ? "−" : "+";
  return `${z.re.toFixed(digits)} ${sign} ${Math.abs(im).toFixed(digits)}i`;
}

export function fact(n: number): number {
  let f = 1;
  for (let i = 2; i <= n; i += 1) f *= i;
  return f;
}

export function iPower(n: number): C {
  const k = ((n % 4) + 4) % 4;
  if (k === 0) return { re: 1, im: 0 };
  if (k === 1) return { re: 0, im: 1 };
  if (k === 2) return { re: -1, im: 0 };
  return { re: 0, im: -1 };
}

export function taylorExpITheta(theta: number, terms: number): C {
  let sum: C = { re: 0, im: 0 };
  for (let n = 0; n < terms; n += 1) {
    const coeff = (theta ** n) / fact(n);
    const iN = iPower(n);
    sum = addC(sum, { re: iN.re * coeff, im: iN.im * coeff });
  }
  return sum;
}

export function mobius(z: C, a: C, b: C, c: C, d: C): C {
  return divC(addC(mulC(a, z), b), addC(mulC(c, z), d));
}

export function invertC(z: C): C {
  return divC({ re: 1, im: 0 }, z);
}

export function quadraticRoots(A: C, B: C, C0: C): C[] {
  const disc = subC(mulC(B, B), mulC({ re: 4, im: 0 }, mulC(A, C0)));
  const r = Math.sqrt(Math.max(0, modC(disc)));
  const half = argC(disc) / 2;
  const sqrtD = { re: r * Math.cos(half), im: r * Math.sin(half) };
  const den = mulC({ re: 2, im: 0 }, A);
  return [divC(addC(mulC({ re: -1, im: 0 }, B), sqrtD), den), divC(subC(mulC({ re: -1, im: 0 }, B), sqrtD), den)];
}

export function seriesRLC(f: number, R: number, L: number, Ccap: number) {
  const w = 2 * Math.PI * f;
  const xl = w * L;
  const xc = 1 / (w * Ccap);
  const X = xl - xc;
  const zMag = Math.hypot(R, X);
  const phi = Math.atan2(X, R);
  return { w, xl, xc, X, zMag, phi, pf: Math.cos(phi) };
}
