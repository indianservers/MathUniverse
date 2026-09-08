import { gcd } from "../../../visual-proofs/utils/numberTheoryMath";
export type RationalTarget = "pi" | "sqrt2" | "phi";
export type RationalMetric = "absolute" | "second";
export const rationalTargets = {
  pi: { label: "π", value: Math.PI, terms: [3, 7, 15, 1, 292, 1, 1, 1] },
  sqrt2: { label: "√2", value: Math.SQRT2, terms: [1, ...Array<number>(24).fill(2)] },
  phi: { label: "φ", value: (1 + Math.sqrt(5)) / 2, terms: Array<number>(28).fill(1) },
};
export interface RationalCandidate { p: number; q: number; value: number; signed: number; absolute: number; second: number; type: "Convergent" | "Semi-convergent" | "Other" }
export function rationalMilestones(target: RationalTarget, cap: number) {
  let p2 = 0, p1 = 1, q2 = 1, q1 = 0;
  const convergents: { p: number; q: number }[] = [], semi = new Set<string>();
  for (const a of rationalTargets[target].terms) {
    const p = a * p1 + p2, q = a * q1 + q2;
    if (q1 > 0) for (let t = 1; t < a; t++) { const sp = t * p1 + p2, sq = t * q1 + q2; if (sq <= cap) semi.add(`${sp}/${sq}`); }
    convergents.push({ p, q });
    if (q > cap) break;
    [p2, p1, q2, q1] = [p1, p, q1, q];
  }
  return { convergents, semi };
}
export function bestRationalSearch(target: RationalTarget, cap: number, metric: RationalMetric) {
  if (!Number.isInteger(cap) || cap < 1 || cap > 10000) throw new Error("Denominator budget must be 1 to 10,000.");
  const alpha = rationalTargets[target].value, milestones = rationalMilestones(target, cap), keys = new Set(milestones.convergents.map(c => `${c.p}/${c.q}`));
  const candidates: RationalCandidate[] = [], records: RationalCandidate[] = [];
  let best = Infinity;
  for (let q = 1; q <= cap; q++) {
    const lower = Math.floor(alpha * q), group: RationalCandidate[] = [];
    // Only the nearest integers below/above alpha*q can win at denominator q.
    for (const p of [lower, lower + 1]) {
      if (gcd(p, q) !== 1) continue;
      const value = p / q, signed = alpha - value, absolute = Math.abs(signed), second = Math.abs(alpha * q - p), key = `${p}/${q}`;
      const candidate: RationalCandidate = { p, q, value, signed, absolute, second, type: keys.has(key) ? "Convergent" : milestones.semi.has(key) ? "Semi-convergent" : "Other" };
      candidates.push(candidate); group.push(candidate);
    }
    group.sort((a, b) => a[metric] - b[metric]);
    if (group.length && group[0][metric] < best) { best = group[0][metric]; records.push(group[0]); }
  }
  const ranked = [...candidates].sort((a, b) => a[metric] - b[metric] || a.q - b.q);
  return { alpha, candidates, records, ranked, best: ranked[0], milestones: milestones.convergents, next: milestones.convergents.find(c => c.q > cap) };
}
export function rationalAnswer(text: string, p: number, q: number) {
  const match = text.trim().match(/^(\d+)\s*\/\s*(\d+)$/);
  return !!match && BigInt(match[2]) > 0n && BigInt(match[1]) * BigInt(q) === BigInt(match[2]) * BigInt(p);
}
