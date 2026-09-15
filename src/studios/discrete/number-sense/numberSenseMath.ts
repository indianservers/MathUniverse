export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x || 1;
}

export function absDistance(a: number, b: number) {
  return Math.abs(a - b);
}

export function orderedValues(values: number[]) {
  return [...new Set(values.filter((n) => Number.isFinite(n)))].sort((x, y) => x - y);
}

export function formatSigned(n: number, digits = 4) {
  if (!Number.isFinite(n)) return "—";
  if (Number.isInteger(n)) return String(n);
  const factor = 10 ** digits;
  const rounded = Math.round(n * factor) / factor;
  return String(rounded);
}

export function formatFraction(num: number, den: number) {
  if (den === 0) return "undefined";
  const sign = num * den < 0 ? "-" : "";
  const n = Math.abs(Math.trunc(num));
  const d = Math.abs(Math.trunc(den));
  const g = gcd(n, d);
  return `${sign}${n / g}/${d / g}`;
}

export function mixedNumber(num: number, den: number) {
  if (den === 0) return "undefined";
  const sign = num * den < 0 ? "-" : "";
  const n = Math.abs(Math.trunc(num));
  const d = Math.abs(Math.trunc(den));
  const g = gcd(n, d);
  const nn = n / g;
  const dd = d / g;
  const whole = Math.floor(nn / dd);
  const rem = nn % dd;
  if (rem === 0) return `${sign}${whole}`;
  if (whole === 0) return `${sign}${nn}/${dd}`;
  return `${sign}${whole} ${rem}/${dd}`;
}

export function equivalentFraction(num: number, den: number, k: number) {
  const factor = Math.max(1, Math.trunc(k));
  return { num: num * factor, den: den * factor };
}

export function compareFractions(aNum: number, aDen: number, bNum: number, bDen: number) {
  const left = aNum * bDen;
  const right = bNum * aDen;
  if (left === right) return 0;
  return left > right ? 1 : -1;
}

export function simplifyRatio(a: number, b: number) {
  const g = gcd(a, b);
  return { a: Math.trunc(a) / g, b: Math.trunc(b) / g };
}

export function scaleRatio(a: number, b: number, k: number) {
  return { a: a * k, b: b * k };
}

export function ratioToPercentParts(a: number, b: number) {
  const total = a + b;
  if (total === 0) return { left: 0, right: 0 };
  return { left: (100 * a) / total, right: (100 * b) / total };
}

export function integerPower(base: number, exp: number) {
  if (!Number.isInteger(exp)) return Number.NaN;
  if (exp >= 0) return base ** exp;
  return 1 / base ** -exp;
}

export function roundHalfUp(n: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.sign(n) * Math.round(Math.abs(n) * factor + Number.EPSILON) / factor;
}

export function placeValueParts(n: number) {
  const ones = Math.trunc(n);
  const absFrac = Math.round(Math.abs(n - ones) * 100);
  return { ones, tenths: Math.floor(absFrac / 10), hundredths: absFrac % 10 };
}

export function mapDistance(cm: number, kmPerCm: number) {
  return cm * kmPerCm;
}

export type LengthUnit = "mm" | "cm" | "m" | "km";

export function convertLength(value: number, from: LengthUnit, to: LengthUnit) {
  const toMm = { mm: 1, cm: 10, m: 1000, km: 1_000_000 };
  return (value * toMm[from]) / toMm[to];
}

export function randomInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function unitRate(a: number, b: number) {
  if (a === 0) return { perFirst: Number.NaN, perSecond: b === 0 ? Number.NaN : 0 };
  return { perFirst: b / a, perSecond: a / b };
}

export function missingRatioValue(a: number, b: number, known: number, knownIsFirst: boolean) {
  if (a === 0) return Number.NaN;
  return knownIsFirst ? (known * b) / a : (known * a) / b;
}

export function percentOf(part: number, of: number) {
  if (of === 0) return 0;
  return (100 * part) / of;
}

export function representativeFraction(kmPerCm: number) {
  return { left: 1, right: Math.round(kmPerCm * 100_000) };
}

export function scaleSegment(length: number, k: number) {
  return length * k;
}

export function oppositeInt(n: number) {
  return -n;
}

export function placeValueThousandths(n: number) {
  const ones = Math.trunc(n);
  const absFrac = Math.round(Math.abs(n - ones) * 1000);
  return {
    ones,
    tenths: Math.floor(absFrac / 100),
    hundredths: Math.floor((absFrac % 100) / 10),
    thousandths: absFrac % 10,
  };
}

export function parseRatio(raw: string): { ok: true; a: number; b: number } | { ok: false } {
  const m = raw.trim().replace(/−/g, "-").replace(/\s+/g, "").match(/^(-?\d+):(-?\d+)$/);
  if (!m) return { ok: false };
  return { ok: true, a: Number(m[1]), b: Number(m[2]) };
}

export function ratioGrade(raw: string, expected: string): { ok: boolean; simplestNudge: boolean } {
  const got = parseRatio(raw);
  const want = parseRatio(expected);
  if (!got.ok || !want.ok) return { ok: false, simplestNudge: false };
  const simple = simplifyRatio(got.a, got.b);
  const target = simplifyRatio(want.a, want.b);
  if (simple.a !== target.a || simple.b !== target.b) return { ok: false, simplestNudge: false };
  const already = gcd(got.a, got.b) === 1 && Math.sign(got.a) === Math.sign(simple.a);
  return { ok: true, simplestNudge: !already };
}

export function encodeFigureSnap(data: Record<string, string | number | boolean>) {
  return btoa(JSON.stringify(data));
}

export function decodeFigureSnap(raw: string): Record<string, string | number | boolean> | null {
  try {
    const parsed = JSON.parse(atob(raw)) as Record<string, string | number | boolean>;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function valueToX(value: number, min: number, max: number, left: number, right: number, logScale = false) {
  if (max === min) return (left + right) / 2;
  if (logScale) {
    const lo = Math.log(Math.max(min, Number.EPSILON));
    const hi = Math.log(Math.max(max, Number.EPSILON * 2));
    const t = (Math.log(Math.max(value, Number.EPSILON)) - lo) / (hi - lo);
    return left + t * (right - left);
  }
  return left + ((value - min) / (max - min)) * (right - left);
}

export function xToValue(x: number, min: number, max: number, left: number, right: number, logScale = false) {
  const t = (x - left) / (right - left);
  if (logScale) {
    const lo = Math.log(Math.max(min, Number.EPSILON));
    const hi = Math.log(Math.max(max, Number.EPSILON * 2));
    return Math.exp(lo + t * (hi - lo));
  }
  return min + t * (max - min);
}

export function unitTicks(min: number, max: number, step = 1) {
  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + 1e-9; v += step) ticks.push(Number(v.toFixed(8)));
  return ticks;
}

export function answersMatch(raw: string, expected: number | string) {
  const compact = (s: string) => s.trim().toLowerCase().replace(/−/g, "-").replace(/\s+/g, "");
  const mixed = (s: string) => {
    const m = s.trim().replace(/−/g, "-").match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
    if (!m) return null;
    const den = Number(m[4]);
    if (!den) return null;
    return (m[1] === "-" ? -1 : 1) * (Number(m[2]) + Number(m[3]) / den);
  };
  const leftMix = mixed(raw);
  const rightMix = typeof expected === "string" ? mixed(expected) : null;
  if (leftMix != null && rightMix != null) return Math.abs(leftMix - rightMix) < 1e-9;
  if (leftMix != null && typeof expected === "number") return Math.abs(leftMix - expected) < 0.03;
  const left = compact(raw);
  const right = compact(String(expected));
  if (!left) return false;
  if (left === right) return true;
  const colon = left.match(/^(-?\d+(?:\.\d+)?):(-?\d+(?:\.\d+)?)$/);
  const colonR = right.match(/^(-?\d+(?:\.\d+)?):(-?\d+(?:\.\d+)?)$/);
  if (colon && colonR) {
    const simplified = simplifyRatio(Number(colon[1]), Number(colon[2]));
    const want = simplifyRatio(Number(colonR[1]), Number(colonR[2]));
    return simplified.a === want.a && simplified.b === want.b;
  }
  if (left.includes("/")) {
    const [n, d] = left.split("/");
    if (n && d && Number(d) !== 0) {
      const value = Number(n) / Number(d);
      if (rightMix != null) return Math.abs(value - rightMix) < 1e-9;
      if (typeof expected === "number") return Math.abs(value - expected) < 0.03;
      if (right.includes("/")) {
        const [en, ed] = right.split("/");
        if (en && ed && Number(ed) !== 0) return Math.abs(value - Number(en) / Number(ed)) < 1e-9;
      }
    }
  }
  const numeric = Number(left.replace(/,/g, ""));
  const target = typeof expected === "number" ? expected : Number(right);
  return Number.isFinite(numeric) && Number.isFinite(target) && Math.abs(numeric - target) < 0.03;
}
