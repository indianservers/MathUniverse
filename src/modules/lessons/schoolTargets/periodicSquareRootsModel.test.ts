import { expect, it } from "vitest";
import { periodicConvergents, periodicSquareRoot } from "./periodicSquareRootsModel";
it("finds the actual repeated sqrt23 state at k5, not k4", () => {
  const m = periodicSquareRoot(23);
  expect(m.period).toEqual([1, 3, 1, 8]);
  expect(m.states.map(s => [s.m, s.d, s.a])).toEqual([[0, 1, 4], [4, 7, 1], [3, 2, 3], [3, 7, 1], [4, 1, 8], [4, 7, 1]]);
  expect(m.repeatedIndex).toBe(1);
});
it("matches known gallery periods and terminates perfect squares", () => {
  expect([2, 3, 5, 13, 23].map(n => periodicSquareRoot(n).period)).toEqual([[2], [1, 2], [4], [1, 1, 1, 1, 6], [1, 3, 1, 8]]);
  expect(periodicSquareRoot(25)).toMatchObject({ square: true, period: [], states: [{ k: 0, m: 0, d: 1, a: 5 }] });
  expect(periodicConvergents(25)[0]).toMatchObject({ p: 5n, q: 1n, error: 0 });
});
it("verifies integer recurrence, first repeat and cycle closing for all supported non-squares", () => {
  for (let n = 2; n <= 100; n++) {
    const m = periodicSquareRoot(n); if (m.square) continue;
    expect(m.period.at(-1)).toBe(2 * m.a0);
    expect(new Set(m.states.slice(1, -1).map(s => `${s.m},${s.d},${s.a}`)).size).toBe(m.period.length);
    const last = m.states.at(-1)!;
    expect([last.m, last.d, last.a]).toEqual([m.states[1].m, m.states[1].d, m.states[1].a]);
    m.states.slice(1).forEach((s, i) => { const previous = m.states[i]; expect(s.m).toBe(previous.d * previous.a - previous.m); expect(s.d * previous.d).toBe(n - s.m * s.m); expect(s.a).toBe(Math.floor((m.a0 + s.m) / s.d)); });
  }
});
it("builds exact BigInt convergents and decreasing rationalized errors", () => {
  expect(periodicConvergents(23).map(c => `${c.p}/${c.q}`)).toEqual(["4/1", "5/1", "19/4", "24/5", "211/44"]);
  for (let n = 2; n <= 100; n++) {
    if (periodicSquareRoot(n).square) continue;
    const values = periodicConvergents(n, 30);
    values.forEach((c, i) => { expect(c.q > 0n).toBe(true); expect(c.delta).toBe(c.p * c.p - BigInt(n) * c.q * c.q); if (i) { expect(c.p * values[i - 1].q - values[i - 1].p * c.q).toBe(BigInt((-1) ** (i + 1))); expect(c.error).toBeLessThan(values[i - 1].error); } });
  }
});
it("rejects invalid radicands and convergent counts", () => {
  expect(() => periodicSquareRoot(0)).toThrow();
  expect(() => periodicSquareRoot(101)).toThrow();
  expect(() => periodicSquareRoot(2.5)).toThrow();
  expect(() => periodicConvergents(23, 41)).toThrow();
});
