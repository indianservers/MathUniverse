export type RecurrenceResult = {
  sequence: number[];
  steps: string[];
  generatingFunction: string;
};

export function arithmeticSumInduction(n: number) {
  const safeN = Math.max(1, Math.floor(n));
  const lhs = safeN * (safeN + 1) / 2;
  const rhs = lhs;
  return {
    proposition: "1 + 2 + ... + n = n(n + 1) / 2",
    baseCase: "n = 1: left side is 1 and right side is 1(2)/2 = 1.",
    inductiveStep: "Assume S(k) = k(k + 1)/2. Then S(k + 1) = k(k + 1)/2 + (k + 1) = (k + 1)(k + 2)/2.",
    sample: `For n = ${safeN}, both sides evaluate to ${lhs}.`,
    valid: lhs === rhs,
  };
}

export function pigeonhole(items: number, boxes: number) {
  const safeItems = Math.max(0, Math.floor(items));
  const safeBoxes = Math.max(1, Math.floor(boxes));
  const minimumMaxLoad = Math.ceil(safeItems / safeBoxes);
  return {
    minimumMaxLoad,
    distribution: Array.from({ length: safeBoxes }, (_, index) => Math.floor((safeItems + safeBoxes - index - 1) / safeBoxes)),
    explanation: `${safeItems} objects in ${safeBoxes} boxes force at least one box to contain ${minimumMaxLoad} object(s).`,
  };
}

export function linearRecurrence(seedA = 0, seedB = 1, coeffA = 1, coeffB = 1, terms = 10): RecurrenceResult {
  const count = Math.max(2, Math.min(24, Math.floor(terms)));
  const sequence = [seedA, seedB];
  const steps = [`a0 = ${seedA}`, `a1 = ${seedB}`];
  for (let index = 2; index < count; index += 1) {
    const next = coeffA * sequence[index - 1] + coeffB * sequence[index - 2];
    sequence.push(next);
    steps.push(`a${index} = ${coeffA}a${index - 1} + ${coeffB}a${index - 2} = ${next}`);
  }
  return {
    sequence,
    steps,
    generatingFunction: `A(x) = (${seedA} + (${seedB} - ${coeffA * seedA})x) / (1 - ${coeffA}x - ${coeffB}x^2)`,
  };
}

export function gcdTrace(a: number, b: number) {
  let x = Math.abs(Math.floor(a));
  let y = Math.abs(Math.floor(b));
  const steps: string[] = [];
  while (y !== 0) {
    steps.push(`${x} = ${Math.floor(x / y)}*${y} + ${x % y}`);
    [x, y] = [y, x % y];
  }
  return { gcd: x, steps };
}

export function modularTable(modulus: number) {
  const mod = Math.max(2, Math.min(24, Math.floor(modulus)));
  return Array.from({ length: mod }, (_, a) => Array.from({ length: mod }, (_, b) => (a * b) % mod));
}

export function sieve(limit: number) {
  const safeLimit = Math.max(2, Math.min(500, Math.floor(limit)));
  const prime = Array.from({ length: safeLimit + 1 }, () => true);
  prime[0] = false;
  prime[1] = false;
  for (let value = 2; value * value <= safeLimit; value += 1) {
    if (!prime[value]) continue;
    for (let multiple = value * value; multiple <= safeLimit; multiple += value) prime[multiple] = false;
  }
  return prime.map((isPrime, value) => isPrime ? value : -1).filter((value) => value >= 0);
}
