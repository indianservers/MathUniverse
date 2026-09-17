export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

export function hopCycle(a: number, n: number) {
  const hops: number[] = [];
  let cur = 0;
  for (let i = 0; i < n; i += 1) {
    hops.push(cur);
    cur = (cur + a) % n;
    if (cur === 0 && i > 0) break;
  }
  return hops;
}

export function inverseMod(a: number, n: number) {
  if (gcd(a, n) !== 1) return null;
  let t = 0;
  let newT = 1;
  let r = n;
  let newR = ((a % n) + n) % n;
  while (newR !== 0) {
    const q = Math.floor(r / newR);
    [t, newT] = [newT, t - q * newT];
    [r, newR] = [newR, r - q * newR];
  }
  return ((t % n) + n) % n;
}

export function solveLinear(a: number, b: number, n: number) {
  const g = gcd(a, n);
  if (b % g !== 0) return [] as number[];
  const n1 = n / g;
  const inv = inverseMod(a / g, n1);
  if (inv == null) return [];
  const x0 = (inv * (b / g)) % n1;
  return Array.from({ length: g }, (_, i) => (x0 + i * n1) % n);
}

export function crtTwo(a: number, n: number, b: number, m: number) {
  const g = gcd(n, m);
  if ((a - b) % g !== 0) return null;
  const n1 = n / g;
  const m1 = m / g;
  const inv = inverseMod(n1, m1);
  if (inv == null) return null;
  const mod = (n * m) / g;
  const t = ((b - a) / g) * inv;
  const x = ((a + n * t) % mod + mod) % mod;
  return { x, modulus: mod };
}
