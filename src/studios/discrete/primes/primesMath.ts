export type IntParse =
  | { ok: true; value: number }
  | { ok: false; error: string };

export function parseStudioInt(raw: unknown, min: number, max: number, label = "Value"): IntParse {
  if (raw === null || raw === undefined) return { ok: false, error: `${label} is empty.` };
  const text = String(raw).trim();
  if (!text) return { ok: false, error: `${label} is empty.` };
  if (/[eE.]/.test(text) || text.includes("⁄")) {
    return { ok: false, error: `${label} must be a whole number, not a decimal.` };
  }
  if (!/^-?\d+$/.test(text.replace(/,/g, ""))) {
    return { ok: false, error: `${label} must be an integer.` };
  }
  const n = Number(text.replace(/,/g, ""));
  if (!Number.isFinite(n) || Number.isNaN(n)) return { ok: false, error: `${label} is not a number.` };
  if (!Number.isInteger(n)) return { ok: false, error: `${label} must be an integer.` };
  if (n < min || n > max) return { ok: false, error: `${label} must be between ${min} and ${max}.` };
  return { ok: true, value: n };
}

export function clampInt(n: number, min: number, max: number) {
  if (!Number.isFinite(n) || Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

export function isPrime(n: number) {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let f = 5; f * f <= n; f += 6) {
    if (n % f === 0 || n % (f + 2) === 0) return false;
  }
  return true;
}

export function generatePrimes(limit: number) {
  if (!Number.isInteger(limit) || limit < 2) return [] as number[];
  const mark = Array.from({ length: limit + 1 }, () => true);
  mark[0] = false;
  mark[1] = false;
  for (let i = 2; i * i <= limit; i += 1) {
    if (!mark[i]) continue;
    for (let j = i * i; j <= limit; j += i) mark[j] = false;
  }
  const primes: number[] = [];
  for (let i = 2; i <= limit; i += 1) if (mark[i]) primes.push(i);
  return primes;
}

export function primePi(n: number) {
  if (!Number.isInteger(n) || n < 2) return 0;
  return generatePrimes(n).length;
}

export function largestPrimeAtMost(n: number) {
  if (!Number.isInteger(n) || n < 2) return null;
  for (let k = n; k >= 2; k -= 1) if (isPrime(k)) return k;
  return null;
}

export function nextPrimeAfter(n: number, cap = 100_000) {
  let k = Math.floor(n) + 1;
  while (k <= cap) {
    if (isPrime(k)) return k;
    k += 1;
  }
  return null;
}

export function previousPrimeBefore(n: number) {
  let k = Math.ceil(n) - 1;
  while (k >= 2) {
    if (isPrime(k)) return k;
    k -= 1;
  }
  return null;
}

export type PrimePower = { prime: number; exp: number };

export function primeFactors(n: number): PrimePower[] {
  if (!Number.isInteger(n) || n < 2) return [];
  const out: PrimePower[] = [];
  let remaining = n;
  for (let p = 2; p * p <= remaining; p += p === 2 ? 1 : 2) {
    if (remaining % p !== 0) continue;
    let exp = 0;
    while (remaining % p === 0) {
      remaining /= p;
      exp += 1;
    }
    out.push({ prime: p, exp });
  }
  if (remaining > 1) out.push({ prime: remaining, exp: 1 });
  return out;
}

export function primeFactorList(n: number) {
  const list: number[] = [];
  for (const { prime, exp } of primeFactors(n)) {
    for (let i = 0; i < exp; i += 1) list.push(prime);
  }
  return list;
}

export function formatFactorization(powers: PrimePower[], style: "expanded" | "exponent" = "exponent") {
  if (!powers.length) return nStringFallback(powers);
  if (style === "expanded") {
    return powers.flatMap(({ prime, exp }) => Array.from({ length: exp }, () => String(prime))).join(" × ");
  }
  return powers.map(({ prime, exp }) => (exp === 1 ? String(prime) : `${prime}^${exp}`)).join(" × ");
}

export function formatLatexFactorization(powers: PrimePower[]) {
  if (!powers.length) return "1";
  return powers.map(({ prime, exp }) => (exp === 1 ? String(prime) : `${prime}^{${exp}}`)).join(" \\times ");
}

export function divisorCountFormula(n: number) {
  const powers = primeFactors(n);
  if (!powers.length) return n === 1 ? "d(1)=1" : "d(n)=0";
  const product = powers.map(({ exp }) => `(${exp}+1)`).join("");
  return `d(${n})=${product}=${divisorCountFromPowers(powers)}`;
}

function nStringFallback(powers: PrimePower[]) {
  return powers.length ? "" : "1";
}

export function productOfPowers(powers: PrimePower[]) {
  return powers.reduce((acc, { prime, exp }) => acc * prime ** exp, 1);
}

export function divisorCountFromPowers(powers: PrimePower[]) {
  return powers.reduce((acc, { exp }) => acc * (exp + 1), 1);
}

export function divisorCount(n: number) {
  if (!Number.isInteger(n) || n < 1) return 0;
  if (n === 1) return 1;
  return divisorCountFromPowers(primeFactors(n));
}

export function divisors(n: number) {
  if (!Number.isInteger(n) || n < 1) return [] as number[];
  const found: number[] = [];
  for (let d = 1; d * d <= n; d += 1) {
    if (n % d !== 0) continue;
    found.push(d);
    if (d !== n / d) found.push(n / d);
  }
  return found.sort((a, b) => a - b);
}

export function factorPairs(n: number) {
  if (!Number.isInteger(n) || n < 1) return [] as Array<[number, number]>;
  return divisors(n)
    .filter((d) => d <= n / d)
    .map((d) => [d, n / d] as [number, number]);
}

export function nontrivialFactorPairs(n: number) {
  return factorPairs(n).filter(([a, b]) => a !== 1 && b !== 1);
}

export function greedyFactorPair(n: number, last = false): [number, number] | null {
  const pairs = nontrivialFactorPairs(n);
  if (!pairs.length) return null;
  return last ? pairs[pairs.length - 1]! : pairs[0]!;
}

export function greedyFactorLeaves(n: number, last = false): number[] {
  const out: number[] = [];
  const walk = (value: number) => {
    if (!Number.isInteger(value) || value < 2) return;
    if (isPrime(value)) {
      out.push(value);
      return;
    }
    const pair = greedyFactorPair(value, last);
    if (!pair) {
      out.push(value);
      return;
    }
    walk(pair[0]);
    walk(pair[1]);
  };
  walk(n);
  return out;
}

export function gcd(a: number, b: number): number {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return NaN;
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y !== 0) {
    const r = x % y;
    x = y;
    y = r;
  }
  return x;
}

export function gcdMany(values: number[]) {
  if (!values.length) return NaN;
  return values.reduce((acc, n) => gcd(acc, n));
}

export function lcm(a: number, b: number) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return NaN;
  const x = Math.abs(Math.trunc(a));
  const y = Math.abs(Math.trunc(b));
  if (x === 0 || y === 0) return 0;
  return (x / gcd(x, y)) * y;
}

export function lcmMany(values: number[]) {
  if (!values.length) return NaN;
  return values.reduce((acc, n) => lcm(acc, n));
}

export type EuclidRow = { a: number; b: number; q: number; r: number };

export function euclideanSteps(a: number, b: number): EuclidRow[] {
  const steps: EuclidRow[] = [];
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  if (x < y) [x, y] = [y, x];
  if (y === 0) {
    steps.push({ a: x, b: y, q: 0, r: 0 });
    return steps;
  }
  while (y !== 0) {
    const q = Math.floor(x / y);
    const r = x % y;
    steps.push({ a: x, b: y, q, r });
    x = y;
    y = r;
  }
  return steps;
}

export function gcdByMinExponents(nums: number[]): PrimePower[] {
  if (nums.some((n) => !Number.isInteger(n) || n < 1)) return [];
  if (nums.some((n) => n === 0)) return [];
  const maps = nums.map((n) => new Map(primeFactors(n).map((p) => [p.prime, p.exp])));
  const primes = new Set<number>();
  maps.forEach((m) => m.forEach((_, p) => primes.add(p)));
  const out: PrimePower[] = [];
  for (const p of [...primes].sort((a, b) => a - b)) {
    const minExp = Math.min(...maps.map((m) => m.get(p) ?? 0));
    if (minExp > 0) out.push({ prime: p, exp: minExp });
  }
  return out;
}

export function lcmByMaxExponents(nums: number[]): PrimePower[] {
  if (nums.some((n) => !Number.isInteger(n) || n < 1)) return [];
  const maps = nums.map((n) => new Map(primeFactors(Math.max(n, 1)).map((p) => [p.prime, p.exp])));
  const primes = new Set<number>();
  maps.forEach((m) => m.forEach((_, p) => primes.add(p)));
  return [...primes]
    .sort((a, b) => a - b)
    .map((p) => ({ prime: p, exp: Math.max(...maps.map((m) => m.get(p) ?? 0)) }))
    .filter((item) => item.exp > 0);
}

export type VennFactors = { left: number[]; common: number[]; right: number[] };

export function vennPrimeFactors(a: number, b: number): VennFactors {
  const leftBag = primeFactorList(a);
  const rightBag = [...primeFactorList(b)];
  const common: number[] = [];
  const left: number[] = [];
  for (const p of leftBag) {
    const idx = rightBag.indexOf(p);
    if (idx >= 0) {
      common.push(p);
      rightBag.splice(idx, 1);
    } else left.push(p);
  }
  return { left, common, right: rightBag };
}

export type SieveCellState = "neither" | "unprocessed" | "current" | "eliminating" | "composite" | "prime" | "candidate";

export type SieveStep =
  | { kind: "select"; prime: number }
  | { kind: "eliminate"; prime: number; multiple: number; factor: number; already: boolean }
  | { kind: "confirm"; value: number }
  | { kind: "done" };

export function sieveSteps(n: number): SieveStep[] {
  const limit = Math.trunc(n);
  if (!Number.isInteger(limit) || limit < 2) return [{ kind: "done" }];
  const composite = Array.from({ length: limit + 1 }, () => false);
  composite[0] = true;
  composite[1] = true;
  const steps: SieveStep[] = [];
  for (let p = 2; p * p <= limit; p += 1) {
    if (composite[p]) continue;
    steps.push({ kind: "select", prime: p });
    for (let m = p * p, k = p; m <= limit; m += p, k += 1) {
      const already = composite[m];
      steps.push({ kind: "eliminate", prime: p, multiple: m, factor: k, already });
      composite[m] = true;
    }
  }
  for (let v = 2; v <= limit; v += 1) {
    if (!composite[v]) steps.push({ kind: "confirm", value: v });
  }
  steps.push({ kind: "done" });
  return steps;
}

export function applySieveSteps(n: number, upto: number) {
  const limit = Math.trunc(n);
  const states: SieveCellState[] = Array.from({ length: limit + 1 }, () => "unprocessed");
  states[0] = "neither";
  states[1] = "neither";
  const eliminatedBy: Array<number | null> = Array.from({ length: limit + 1 }, () => null);
  const steps = sieveSteps(limit);
  const last = Math.max(0, Math.min(upto, Math.max(0, steps.length - 1)));
  let currentPrime: number | null = null;
  let stage = "unclassified — every integer from 2 is waiting";
  const settleEliminating = () => {
    for (let v = 2; v <= limit; v += 1) {
      if (states[v] === "eliminating") states[v] = "composite";
    }
  };
  for (let i = 0; i <= last; i += 1) {
    const step = steps[i]!;
    settleEliminating();
    if (step.kind === "select") {
      if (currentPrime != null && states[currentPrime] === "current") states[currentPrime] = "prime";
      currentPrime = step.prime;
      states[step.prime] = "current";
      stage = `eliminating multiples of ${step.prime}`;
    } else if (step.kind === "eliminate") {
      if (eliminatedBy[step.multiple] == null) eliminatedBy[step.multiple] = step.prime;
      states[step.multiple] = step.already ? "composite" : "eliminating";
      if (step.already) states[step.multiple] = "composite";
      else if (i === last) states[step.multiple] = "eliminating";
      else states[step.multiple] = "composite";
      stage = step.already
        ? `${step.multiple} was already composite (first hit by ${eliminatedBy[step.multiple]})`
        : `${step.prime} × ${step.factor} = ${step.multiple}`;
    } else if (step.kind === "confirm") {
      if (currentPrime != null && states[currentPrime] === "current") states[currentPrime] = "prime";
      currentPrime = step.value;
      states[step.value] = "prime";
      stage = `remaining unmarked ${step.value} is prime`;
    } else {
      if (currentPrime != null && states[currentPrime] === "current") states[currentPrime] = "prime";
      for (let v = 2; v <= limit; v += 1) {
        if (states[v] === "unprocessed" || states[v] === "current") states[v] = "prime";
      }
      currentPrime = null;
      stage = "complete";
    }
  }
  const sqrtN = Math.floor(Math.sqrt(limit));
  if (currentPrime != null) {
    const threshold = currentPrime * currentPrime;
    for (let v = 2; v <= limit; v += 1) {
      if (states[v] !== "unprocessed") continue;
      if (v >= threshold) states[v] = "candidate";
    }
  }
  const primes: number[] = [];
  const composites: number[] = [];
  for (let v = 2; v <= limit; v += 1) {
    if (states[v] === "prime" || states[v] === "current") primes.push(v);
    if (states[v] === "composite" || states[v] === "eliminating") composites.push(v);
  }
  return {
    states,
    eliminatedBy,
    primes,
    composites,
    currentPrime,
    stage,
    steps,
    sqrtN,
    done: steps[last]?.kind === "done",
  };
}

export function sieveTrace(n: number) {
  const steps = sieveSteps(n);
  return steps.map((step) => {
    if (step.kind === "select") return `Select prime ${step.prime}; start at ${step.prime}² = ${step.prime ** 2}.`;
    if (step.kind === "eliminate") return `${step.prime} × ${step.factor} = ${step.multiple}${step.already ? " (already composite)" : ""}.`;
    if (step.kind === "confirm") return `Unmarked ${step.value} is prime.`;
    return `Sieve complete for 2–${n}.`;
  });
}

export function firstEliminator(n: number) {
  if (!Number.isInteger(n) || n < 4) return null;
  const factors = primeFactors(n);
  return factors[0]?.prime ?? null;
}

export type GapPoint = { prime: number; next: number; gap: number };

export function primeGaps(limit: number): GapPoint[] {
  const primes = generatePrimes(limit);
  const gaps: GapPoint[] = [];
  for (let i = 0; i < primes.length - 1; i += 1) {
    const p = primes[i]!;
    const q = primes[i + 1]!;
    gaps.push({ prime: p, next: q, gap: q - p });
  }
  return gaps;
}

export function twinPrimes(limit: number) {
  const primes = generatePrimes(limit);
  const pairs: Array<[number, number]> = [];
  for (let i = 0; i < primes.length - 1; i += 1) {
    const p = primes[i]!;
    const q = primes[i + 1]!;
    if (q - p === 2 && q <= limit) pairs.push([p, q]);
  }
  return pairs;
}

export function moduloClass(n: number, m: number) {
  if (!Number.isInteger(m) || m === 0) return NaN;
  return ((Math.trunc(n) % m) + m) % m;
}

export type UlamPoint = { n: number; x: number; y: number; prime: boolean };

export function ulamSpiral(limit: number): UlamPoint[] {
  const cap = Math.max(1, Math.trunc(limit));
  const points: UlamPoint[] = [{ n: 1, x: 0, y: 0, prime: false }];
  let x = 0;
  let y = 0;
  let dx = 1;
  let dy = 0;
  let legLen = 1;
  let stepsInLeg = 0;
  let legsDone = 0;
  for (let n = 2; n <= cap; n += 1) {
    x += dx;
    y += dy;
    points.push({ n, x, y, prime: isPrime(n) });
    stepsInLeg += 1;
    if (stepsInLeg === legLen) {
      stepsInLeg = 0;
      const ndx = -dy;
      const ndy = dx;
      dx = ndx;
      dy = ndy;
      legsDone += 1;
      if (legsDone % 2 === 0) legLen += 1;
    }
  }
  return points;
}

export function liApprox(n: number) {
  if (!(n > 1)) return NaN;
  return n / Math.log(n);
}

export type DigitInfo = { digits: number[]; last: number; lastTwo: number; lastThree: number };

export function digitInfo(n: number): DigitInfo {
  const abs = Math.abs(Math.trunc(n));
  const digits = String(abs).split("").map(Number);
  const last = digits[digits.length - 1] ?? 0;
  const lastTwo = abs % 100;
  const lastThree = abs % 1000;
  return { digits, last, lastTwo, lastThree };
}

export function digitSum(n: number) {
  return digitInfo(n).digits.reduce((a, b) => a + b, 0);
}

export function alternatingDigitSum(n: number, fromRight = false) {
  const { digits } = digitInfo(n);
  const ordered = fromRight ? [...digits].reverse() : digits;
  let plus = 0;
  let minus = 0;
  const plusDigits: number[] = [];
  const minusDigits: number[] = [];
  ordered.forEach((d, i) => {
    if (i % 2 === 0) {
      plus += d;
      plusDigits.push(d);
    } else {
      minus += d;
      minusDigits.push(d);
    }
  });
  return { plus, minus, plusDigits, minusDigits, value: plus - minus, fromLeft: !fromRight };
}

export function digitSumChain(n: number) {
  const chain = [Math.abs(Math.trunc(n))];
  let v = chain[0]!;
  while (v >= 10) {
    v = digitSum(v);
    chain.push(v);
  }
  return chain;
}

export function placeValues(n: number) {
  const { digits } = digitInfo(n);
  return digits.map((d, i) => {
    const place = 10 ** (digits.length - 1 - i);
    return { digit: d, place, value: d * place };
  });
}

export function tenMod(d: number) {
  if (!Number.isInteger(d) || d === 0) return NaN;
  return ((10 % d) + d) % d;
}

export function rule7Steps(n: number) {
  const steps: Array<{ value: number; lead: number; last: number; next: number }> = [];
  let v = Math.abs(Math.trunc(n));
  const seen = new Set<number>();
  while (v >= 70 && !seen.has(v)) {
    seen.add(v);
    const last = v % 10;
    const lead = Math.floor(v / 10);
    const next = lead - 2 * last;
    steps.push({ value: v, lead, last, next });
    v = Math.abs(next);
  }
  return { steps, final: v };
}

export type DivisibilityResult = {
  divisor: number;
  divisible: boolean;
  remainder: number;
  title: string;
  lines: string[];
};

export function divisibilityTest(n: number, divisor: number): DivisibilityResult {
  const value = Math.trunc(n);
  const d = Math.trunc(divisor);
  if (!Number.isInteger(value) || !Number.isInteger(d) || d === 0) {
    return { divisor: d, divisible: false, remainder: NaN, title: "Invalid", lines: ["Enter a whole number."] };
  }
  const remainder = ((value % d) + d) % d;
  const divisible = remainder === 0;
  const info = digitInfo(value);
  if (d === 2) {
    return {
      divisor: 2,
      divisible: info.last % 2 === 0,
      remainder,
      title: "Last digit even",
      lines: [
        `10 ≡ 0 (mod 2), so every place except the units digit is already a multiple of 2.`,
        `Last digit = ${info.last}`,
        info.last % 2 === 0 ? `${info.last} is even` : `${info.last} is odd`,
        info.last % 2 === 0 ? `Therefore ${value} is divisible by 2.` : `Therefore ${value} is not divisible by 2.`,
      ],
    };
  }
  if (d === 3) {
    const chain = digitSumChain(value);
    const sum = chain[chain.length - 1] ?? 0;
    return {
      divisor: 3,
      divisible: sum % 3 === 0,
      remainder,
      title: "Digit sum",
      lines: [
        `10 ≡ 1 (mod 3), so n ≡ digit sum (mod 3).`,
        chain.map((v, i) => (i === 0 ? String(v) : `${digitInfo(chain[i - 1]!).digits.join(" + ")} = ${v}`)).join(" → "),
        sum % 3 === 0 ? `${sum} is divisible by 3` : `${sum} is not divisible by 3`,
        `${value} ${sum % 3 === 0 ? "is" : "is not"} divisible by 3.`,
      ],
    };
  }
  if (d === 4) {
    return {
      divisor: 4,
      divisible: info.lastTwo % 4 === 0,
      remainder,
      title: "Last two digits",
      lines: [
        `Last two digits = ${String(info.lastTwo).padStart(Math.min(2, info.digits.length), "0")}`,
        `${info.lastTwo} ÷ 4 = ${Math.floor(info.lastTwo / 4)}${info.lastTwo % 4 ? ` remainder ${info.lastTwo % 4}` : ""}`,
        `${value} ${info.lastTwo % 4 === 0 ? "is" : "is not"} divisible by 4.`,
      ],
    };
  }
  if (d === 5) {
    const ok = info.last === 0 || info.last === 5;
    return {
      divisor: 5,
      divisible: ok,
      remainder,
      title: "Last digit 0 or 5",
      lines: [
        `Last digit = ${info.last}`,
        "A number is divisible by 5 only when its last digit is 0 or 5.",
        ok ? `${value} is divisible by 5.` : `${value} is not divisible by 5.`,
      ],
    };
  }
  if (d === 6) {
    const by2 = divisibilityTest(value, 2);
    const by3 = divisibilityTest(value, 3);
    const ok = by2.divisible && by3.divisible;
    return {
      divisor: 6,
      divisible: ok,
      remainder,
      title: "Divisible by 2 and 3",
      lines: [
        `Divisible by 2? ${by2.divisible ? "yes" : "no"}`,
        `Divisible by 3? ${by3.divisible ? "yes" : "no"}`,
        ok ? `Therefore ${value} is divisible by 6.` : `Therefore ${value} is not divisible by 6.`,
      ],
    };
  }
  if (d === 7) {
    const { steps, final } = rule7Steps(value);
    const ok = final % 7 === 0;
    const lines = steps.map((s) => `${s.lead} − (2 × ${s.last}) = ${s.next}`);
    lines.push(`${final} ${ok ? "is" : "is not"} divisible by 7.`);
    lines.push(`Therefore ${value} ${ok ? "is" : "is not"} divisible by 7.`);
    return { divisor: 7, divisible: ok, remainder, title: "Double last digit and subtract", lines };
  }
  if (d === 8) {
    return {
      divisor: 8,
      divisible: info.lastThree % 8 === 0,
      remainder,
      title: "Last three digits",
      lines: [
        `Last three digits = ${info.lastThree}`,
        `${info.lastThree} ÷ 8 = ${Math.floor(info.lastThree / 8)}${info.lastThree % 8 ? ` remainder ${info.lastThree % 8}` : ""}`,
        `${value} ${info.lastThree % 8 === 0 ? "is" : "is not"} divisible by 8.`,
      ],
    };
  }
  if (d === 9) {
    const chain = digitSumChain(value);
    const sum = chain[chain.length - 1] ?? 0;
    return {
      divisor: 9,
      divisible: sum % 9 === 0,
      remainder,
      title: "Digit sum",
      lines: [
        `10 ≡ 1 (mod 9), so n ≡ digit sum (mod 9).`,
        chain.map((v, i) => (i === 0 ? String(v) : `${digitInfo(chain[i - 1]!).digits.join(" + ")} = ${v}`)).join(" → "),
        sum % 9 === 0 ? `${sum} is divisible by 9` : `${sum} is not divisible by 9`,
        `${value} ${sum % 9 === 0 ? "is" : "is not"} divisible by 9.`,
      ],
    };
  }
  if (d === 10) {
    return {
      divisor: 10,
      divisible: info.last === 0,
      remainder,
      title: "Last digit 0",
      lines: [
        `Last digit = ${info.last}`,
        info.last === 0 ? `${value} is divisible by 10.` : `${value} is not divisible by 10.`,
      ],
    };
  }
  if (d === 11) {
    const alt = alternatingDigitSum(value, true);
    const ok = remainder === 0;
    return {
      divisor: 11,
      divisible: ok,
      remainder,
      title: "Alternating digit sum from the right",
      lines: [
        `10 ≡ −1 (mod 11), so signs alternate from the units place.`,
        `(${alt.plusDigits.join(" + ") || "0"}) − (${alt.minusDigits.join(" + ") || "0"}) = ${alt.plus} − ${alt.minus} = ${alt.value}`,
        `${alt.value} ${ok ? "is" : "is not"} divisible by 11.`,
        `Therefore ${value} ${ok ? "is" : "is not"} divisible by 11.`,
      ],
    };
  }
  if (d === 12) {
    const by3 = divisibilityTest(value, 3);
    const by4 = divisibilityTest(value, 4);
    const ok = by3.divisible && by4.divisible;
    return {
      divisor: 12,
      divisible: ok,
      remainder,
      title: "Divisible by 3 and 4",
      lines: [
        `Divisible by 3? ${by3.divisible ? "yes" : "no"}`,
        `Divisible by 4? ${by4.divisible ? "yes" : "no"}`,
        ok ? `Therefore ${value} is divisible by 12.` : `Therefore ${value} is not divisible by 12.`,
      ],
    };
  }
  if (d === 25) {
    const ok = info.lastTwo % 25 === 0;
    return {
      divisor: 25,
      divisible: ok,
      remainder,
      title: "Last two digits 00, 25, 50, or 75",
      lines: [
        `100 ≡ 0 (mod 25), so only the last two digits matter.`,
        `Last two digits = ${String(info.lastTwo).padStart(Math.min(2, info.digits.length), "0")}`,
        ok ? `${value} is divisible by 25.` : `${value} is not divisible by 25.`,
      ],
    };
  }
  if (d === 13) {
    return {
      divisor: 13,
      divisible,
      remainder,
      title: "Direct division by 13",
      lines: [`${value} ÷ 13 = ${Math.trunc(value / 13)}${remainder ? ` remainder ${remainder}` : ""}`, `${value} ≡ ${remainder} (mod 13)`],
    };
  }
  return {
    divisor: d,
    divisible,
    remainder,
    title: `Remainder modulo ${d}`,
    lines: [`${value} ≡ ${remainder} (mod ${d})`],
  };
}

export const STANDARD_DIVISORS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 25] as const;

export function numbersWithDivisorCount(target: number, cap = 4000) {
  const found: number[] = [];
  for (let n = 1; n <= cap && found.length < 8; n += 1) {
    if (divisorCount(n) === target) found.push(n);
  }
  return found;
}

export function firstMultipleEliminatedBy(prime: number, n: number) {
  const start = prime * prime;
  return start <= n ? start : null;
}

export function randomInt(min: number, max: number, rng = Math.random) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function twoDifferentPairs(n: number) {
  const pairs = nontrivialFactorPairs(n);
  if (pairs.length < 2) return null;
  return [pairs[0]!, pairs[pairs.length - 1]!] as const;
}

export function gcdLcmIdentity(a: number, b: number) {
  const g = gcd(a, b);
  const l = lcm(a, b);
  return { g, l, left: g * l, right: Math.abs(a * b), holds: g * l === Math.abs(a * b) };
}

export function missingFactor(product: number, known: number[]) {
  const p = known.reduce((acc, n) => acc * n, 1);
  if (p === 0 || product % p !== 0) return null;
  return product / p;
}

export function areCoprime(a: number, b: number) {
  return gcd(a, b) === 1;
}

export type EuclidExtended = { g: number; x: number; y: number; rows: Array<{ a: number; b: number; q: number; r: number; x: number; y: number }> };

export function extendedEuclid(a: number, b: number): EuclidExtended {
  let oldR = Math.abs(Math.trunc(a));
  let r = Math.abs(Math.trunc(b));
  let oldS = 1;
  let s = 0;
  let oldT = 0;
  let t = 1;
  const rows: EuclidExtended["rows"] = [];
  if (r === 0) return { g: oldR, x: a < 0 ? -1 : 1, y: 0, rows };
  while (r !== 0) {
    const q = Math.floor(oldR / r);
    const nextR = oldR - q * r;
    const nextS = oldS - q * s;
    const nextT = oldT - q * t;
    rows.push({ a: oldR, b: r, q, r: nextR, x: s, y: t });
    oldR = r;
    r = nextR;
    oldS = s;
    s = nextS;
    oldT = t;
    t = nextT;
  }
  let x = oldS;
  let y = oldT;
  if (a < 0) x = -x;
  if (b < 0) y = -y;
  return { g: oldR, x, y, rows };
}

export function bezoutCertificate(a: number, b: number) {
  const { g, x, y } = extendedEuclid(a, b);
  return { g, x, y, holds: a * x + b * y === g, text: `${g} = ${a}×(${x}) + ${b}×(${y})` };
}

export type VennThree = {
  onlyA: number[];
  onlyB: number[];
  onlyC: number[];
  ab: number[];
  ac: number[];
  bc: number[];
  abc: number[];
};

export function vennThree(a: number, b: number, c: number): VennThree {
  const bag = (n: number) => {
    const m = new Map<number, number>();
    for (const p of primeFactorList(n)) m.set(p, (m.get(p) ?? 0) + 1);
    return m;
  };
  const A = bag(a);
  const B = bag(b);
  const C = bag(c);
  const primes = [...new Set([...A.keys(), ...B.keys(), ...C.keys()])].sort((x, y) => x - y);
  const repeat = (p: number, k: number) => Array.from({ length: Math.max(0, k) }, () => p);
  const onlyA: number[] = [];
  const onlyB: number[] = [];
  const onlyC: number[] = [];
  const ab: number[] = [];
  const ac: number[] = [];
  const bc: number[] = [];
  const abc: number[] = [];
  for (const p of primes) {
    const xa = A.get(p) ?? 0;
    const xb = B.get(p) ?? 0;
    const xc = C.get(p) ?? 0;
    const trip = Math.min(xa, xb, xc);
    abc.push(...repeat(p, trip));
    ab.push(...repeat(p, Math.min(xa, xb) - trip));
    ac.push(...repeat(p, Math.min(xa, xc) - trip));
    bc.push(...repeat(p, Math.min(xb, xc) - trip));
    onlyA.push(...repeat(p, xa - (Math.min(xa, xb) - trip) - (Math.min(xa, xc) - trip) - trip));
    onlyB.push(...repeat(p, xb - (Math.min(xa, xb) - trip) - (Math.min(xb, xc) - trip) - trip));
    onlyC.push(...repeat(p, xc - (Math.min(xa, xc) - trip) - (Math.min(xb, xc) - trip) - trip));
  }
  return { onlyA, onlyB, onlyC, ab, ac, bc, abc };
}

export function primePairsByGap(limit: number, gap: number) {
  const primes = generatePrimes(limit);
  const set = new Set(primes);
  const pairs: Array<[number, number]> = [];
  for (const p of primes) {
    const q = p + gap;
    if (q <= limit && set.has(q)) pairs.push([p, q]);
  }
  return pairs;
}

export function goldbachPairs(even: number) {
  if (!Number.isInteger(even) || even < 4 || even % 2 !== 0) return [] as Array<[number, number]>;
  const pairs: Array<[number, number]> = [];
  for (let p = 2; p <= even / 2; p += 1) {
    if (isPrime(p) && isPrime(even - p)) pairs.push([p, even - p]);
  }
  return pairs;
}

export function wilsonResidue(p: number) {
  if (!Number.isInteger(p) || p < 2) return NaN;
  let f = 1;
  for (let i = 1; i < p; i += 1) f = (f * i) % p;
  return f;
}

export function wilsonHolds(p: number) {
  if (!isPrime(p)) return false;
  return wilsonResidue(p) === p - 1;
}

export function bertrandPrime(n: number) {
  if (!Number.isInteger(n) || n < 2) return null;
  for (let k = n + 1; k < 2 * n; k += 1) {
    if (isPrime(k)) return k;
  }
  return null;
}

export function primeRaceMod4(limit: number) {
  let r1 = 0;
  let r3 = 0;
  for (const p of generatePrimes(limit)) {
    if (p === 2) continue;
    if (p % 4 === 1) r1 += 1;
    else r3 += 1;
  }
  return { r1, r3 };
}

export function eulerLucky(n: number) {
  return n * n + n + 41;
}

export function hammingDigits(a: number, b: number) {
  const A = String(Math.abs(Math.trunc(a)));
  const B = String(Math.abs(Math.trunc(b)));
  if (A.length !== B.length) return Infinity;
  let d = 0;
  for (let i = 0; i < A.length; i += 1) if (A[i] !== B[i]) d += 1;
  return d;
}

export function tensDigitChoicesDiv4(ones: number) {
  const ok: number[] = [];
  for (let t = 0; t <= 9; t += 1) {
    if ((10 * t + ones) % 4 === 0) ok.push(t);
  }
  return ok;
}

export const GCD_WORD_PROBLEMS = [
  { id: "buses", text: "Two buses leave every 84 min and 60 min. After how many minutes do they leave together again?", a: 84, b: 60, ask: "lcm" as const, answer: 420 },
  { id: "tiles", text: "Square tiles of side 18 cm and 24 cm cover a floor with no gaps. Largest tile side that works for both?", a: 18, b: 24, ask: "gcd" as const, answer: 6 },
  { id: "gears", text: "Gears with 48 and 180 teeth. After how many teeth do both return to the start together?", a: 48, b: 180, ask: "lcm" as const, answer: 720 },
] as const;

export function parseChallengeInt(raw: string) {
  const parsed = parseStudioInt(raw.replace(/,/g, ""), Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, "Answer");
  return parsed.ok ? parsed.value : null;
}

export function sieveAlgorithmLines(n: number) {
  const s = Math.floor(Math.sqrt(n));
  return [
    `To list primes ≤ ${n}:`,
    `1. Write 2, 3, …, ${n}. Cross out 1 (neither prime nor composite).`,
    `2. For each unmarked p with p ≤ √${n} = ${s}:`,
    `   mark multiples p², p²+p, p²+2p, … as composite.`,
    `3. Every remaining unmarked number is prime.`,
  ];
}
