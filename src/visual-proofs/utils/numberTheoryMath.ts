export type FactorTreeNode = {
  value: number;
  children?: [FactorTreeNode, FactorTreeNode];
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function isEven(n: number) {
  return n % 2 === 0;
}

export function isOdd(n: number) {
  return !isEven(n);
}

export function factorsOf(n: number) {
  const factors: number[] = [];
  for (let factor = 1; factor <= Math.sqrt(n); factor += 1) {
    if (n % factor === 0) {
      factors.push(factor);
      if (factor !== n / factor) factors.push(n / factor);
    }
  }
  return factors.sort((a, b) => a - b);
}

export function factorPairs(n: number) {
  return factorsOf(n)
    .filter((factor) => factor <= n / factor)
    .map((factor) => [factor, n / factor] as const);
}

export function isPrime(n: number) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let factor = 3; factor <= Math.sqrt(n); factor += 2) {
    if (n % factor === 0) return false;
  }
  return true;
}

export function primeFactorization(n: number) {
  const result: Record<number, number> = {};
  let remaining = n;
  for (let factor = 2; factor <= Math.sqrt(remaining); factor += factor === 2 ? 1 : 2) {
    while (remaining % factor === 0) {
      result[factor] = (result[factor] ?? 0) + 1;
      remaining /= factor;
    }
  }
  if (remaining > 1) result[remaining] = (result[remaining] ?? 0) + 1;
  return result;
}

export function formatFactorization(factors: Record<number, number>) {
  return Object.entries(factors)
    .map(([prime, exponent]) => (exponent === 1 ? prime : `${prime}^${exponent}`))
    .join(" x ");
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    [x, y] = [y, x % y];
  }
  return x;
}

export function gcdSteps(a: number, b: number) {
  const steps: { a: number; b: number; q: number; r: number }[] = [];
  let x = Math.max(Math.abs(a), Math.abs(b));
  let y = Math.min(Math.abs(a), Math.abs(b));
  while (y !== 0) {
    const q = Math.floor(x / y);
    const r = x % y;
    steps.push({ a: x, b: y, q, r });
    x = y;
    y = r;
  }
  return steps;
}

export function lcm(a: number, b: number) {
  return Math.abs(a * b) / gcd(a, b);
}

export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export function remainderCycle(base: number, modulus: number, length: number) {
  return Array.from({ length }, (_, index) => mod(base ** (index + 1), modulus));
}

export function digitSum(n: number) {
  return Math.abs(n)
    .toString()
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
}

export function divisibilityBy3(n: number) {
  return digitSum(n) % 3 === 0;
}

export function divisibilityBy9(n: number) {
  return digitSum(n) % 9 === 0;
}

export function generateFactorTree(n: number): FactorTreeNode {
  if (isPrime(n)) return { value: n };
  const pair = factorPairs(n).find(([left]) => left > 1);
  if (!pair) return { value: n };
  return { value: n, children: [generateFactorTree(pair[0]), generateFactorTree(pair[1])] };
}

export function firstPrimes(count: number) {
  const primes: number[] = [];
  let n = 2;
  while (primes.length < count) {
    if (isPrime(n)) primes.push(n);
    n += 1;
  }
  return primes;
}
