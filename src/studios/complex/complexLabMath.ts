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
