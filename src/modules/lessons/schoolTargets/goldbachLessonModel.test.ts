import { expect, it } from "vitest";
import { goldbachPartitions, checkGoldbachPartitions } from "./goldbachLessonModel";
it("computes reference partitions and correct prime density", () => {
  const m = goldbachPartitions(28);
  expect(m.pairs).toEqual([[5, 23], [11, 17]]);
  expect(m.primes).toHaveLength(9);
  expect(m.density).toBe(9 / 28);
  expect(m.ordered).toEqual([[5, 23], [23, 5], [11, 17], [17, 11]]);
});
it("handles diagonal pairs and the conjecture boundary", () => {
  expect(goldbachPartitions(4).ordered).toEqual([[2, 2]]);
  expect(goldbachPartitions(22).pairs).toEqual([[3, 19], [5, 17], [11, 11]]);
  expect(goldbachPartitions(22).ordered).toHaveLength(5);
  expect(goldbachPartitions(2)).toMatchObject({ pairs: [], inScope: false });
});
it("checks all supported even numbers against independent trial division", () => {
  const prime = (n: number) => { if (n < 2) return false; for (let divisor = 2; divisor * divisor <= n; divisor++) if (n % divisor === 0) return false; return true; };
  for (let n = 4; n <= 200; n += 2) {
    const expected = [];
    for (let p = 2; p <= n / 2; p++) if (prime(p) && prime(n - p)) expected.push([p, n - p]);
    const result = goldbachPartitions(n);
    expect(result.pairs).toEqual(expected);
    expect(result.pairs.length).toBeGreaterThan(0);
    expect(new Set(result.ordered.map(pair => pair.join(","))).size).toBe(result.ordered.length);
  }
});
it("checks complete practice answers, rejects duplicates and accepts reversed pair order", () => {
  expect(goldbachPartitions(50).pairs).toEqual([[3, 47], [7, 43], [13, 37], [19, 31]]);
  expect(checkGoldbachPartitions("47+3; 7+43; 37+13; 19+31", 50)).toBe(true);
  expect(checkGoldbachPartitions("3+47,7+43", 50)).toBe(false);
  expect(checkGoldbachPartitions("5+23,23+5", 28)).toBe(false);
  expect(checkGoldbachPartitions("5+23,11+17", 28)).toBe(true);
  expect(checkGoldbachPartitions("", 28)).toBe(false);
  expect(checkGoldbachPartitions("1+27,11+17", 28)).toBe(false);
});
it("rejects odd and unsupported inputs", () => {
  for (const n of [0, 3, 202, NaN, 2.5]) expect(() => goldbachPartitions(n)).toThrow();
});
