export interface SurdState { k: number; m: number; d: number; a: number }
export function periodicSquareRoot(n: number) {
  if (!Number.isInteger(n) || n < 1 || n > 100) throw new Error("Choose an integer N from 1 to 100.");
  const a0 = Math.floor(Math.sqrt(n)), initial = { k: 0, m: 0, d: 1, a: a0 };
  if (a0 * a0 === n) return { n, a0, square: true, states: [initial], period: [] as number[], repeatedIndex: null as number | null };
  const states: SurdState[] = [initial], seen = new Map<string, number>();
  let previous = initial;
  for (let k = 1; k < 500; k++) {
    const m = previous.d * previous.a - previous.m, d = (n - m * m) / previous.d, a = Math.floor((a0 + m) / d);
    if (!Number.isInteger(d) || d <= 0) throw new Error("Invalid quadratic surd state.");
    const state = { k, m, d, a }, key = `${m},${d},${a}`;
    states.push(state);
    if (seen.has(key)) return { n, a0, square: false, states, period: states.slice(1, -1).map(s => s.a), repeatedIndex: seen.get(key)! };
    seen.set(key, k); previous = state;
  }
  throw new Error("Cycle not found within supported state bound.");
}
export function periodicConvergents(n: number, count?: number) {
  const model = periodicSquareRoot(n), length = model.square ? 1 : count ?? model.period.length + 1;
  if (!Number.isInteger(length) || length < 1 || length > 40) throw new Error("Choose 1 to 40 convergents.");
  let p2 = 0n, p1 = 1n, q2 = 1n, q1 = 0n;
  return Array.from({ length }, (_, k) => {
    const a = k === 0 ? model.a0 : model.period[(k - 1) % model.period.length], p = BigInt(a) * p1 + p2, q = BigInt(a) * q1 + q2;
    [p2, p1, q2, q1] = [p1, p, q1, q];
    const decimal = Number(p) / Number(q), delta = p * p - BigInt(n) * q * q;
    const error = Math.abs(Number(delta) / (Number(q) ** 2 * (decimal + Math.sqrt(n))));
    return { k, a, p, q, decimal, error, delta };
  });
}
