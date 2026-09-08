import { sieve } from "../../discrete-world/shared-engines/foundationsEngine";
const primes = sieve(200), primeSet = new Set(primes);
export function goldbachPartitions(n: number) {
  if (!Number.isInteger(n) || n < 2 || n > 200 || n % 2 !== 0) throw new Error("Choose an even integer from 2 to 200.");
  const eligible = primes.filter(p => p <= n), pairs = eligible.filter(p => p <= n / 2 && primeSet.has(n - p)).map(p => [p, n - p] as const);
  const ordered = pairs.flatMap(([p, q]) => p === q ? [[p, q] as const] : [[p, q] as const, [q, p] as const]);
  return { n, primes: eligible, pairs, ordered, density: eligible.length / n, inScope: n > 2 };
}
export function checkGoldbachPartitions(text: string, n: number) {
  const expected = goldbachPartitions(n).pairs.map(([p, q]) => `${p}+${q}`), tokens = text.trim().split(/[,;\n]/).map(s => s.trim());
  if (!text.trim()) return false;
  const parsed: string[] = [];
  for (const token of tokens) { const match = token.match(/^(\d+)\s*\+\s*(\d+)$/); if (!match) return false; const p = Number(match[1]), q = Number(match[2]); parsed.push(`${Math.min(p, q)}+${Math.max(p, q)}`); }
  return parsed.length === expected.length && new Set(parsed).size === expected.length && expected.every(pair => parsed.includes(pair));
}
