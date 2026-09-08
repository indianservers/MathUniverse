import { expect, it } from "vitest";
import { checkPrimePractice, logarithmicIntegral, primeCountSample, primeCountSeries, zetaZeroHeights } from "./riemannPrimesModel";
it("counts primes exactly and independently finds the next prime", () => {
  for (const [x, count, next] of [[10,4,11],[100,25,101],[1000,168,1009],[10000,1229,10007]]) {
    expect(primeCountSample(x)).toMatchObject({ x, count, next });
  }
});
it("evaluates the principal-value logarithmic integral", () => {
  for (const [x, li] of [[2,1.04516378011749],[100,30.1261415840796],[1000,177.609657990152],[10000,1246.13721589939]]) expect(logarithmicIntegral(x)).toBeCloseTo(li, 8);
  expect(primeCountSample(100).error).toBeCloseTo(-5.126141584, 8);
});
it("preserves every integer and prime jump in each plot range", () => {
  for (const max of [100,1000,10000]) {
    const series = primeCountSeries(max);
    expect(series).toHaveLength(max - 9);
    expect(series.at(-1)?.count).toBe(primeCountSample(max).count);
    series.slice(1).forEach((s, i) => {
      let prime = true;
      for (let d = 2; d * d <= s.x; d++) if (s.x % d === 0) { prime = false; break; }
      expect(s.x).toBe(series[i].x + 1);
      expect(s.count - series[i].count).toBe(prime ? 1 : 0);
      expect(s.error).toBe(s.count - s.li);
    });
  }
});
it("checks rounded practice values and rejects empty, wrong-sign and wrong-meaning answers", () => {
  expect(checkPrimePractice(["25","30.1","-5.1"], "over")).toBe(true);
  for (const values of [["","", ""], ["25","30.1","5.1"], ["24","30.1","-5.1"], ["25","Infinity","-5.1"], []]) expect(checkPrimePractice(values, "over")).toBe(false);
  expect(checkPrimePractice(["25","30.1","-5.1"], "under")).toBe(false);
});
it("rejects unsupported and nonfinite inputs", () => {
  for (const x of [NaN,Infinity,1,10001,2.5]) expect(() => primeCountSample(x)).toThrow();
  for (const x of [NaN,Infinity,1,10001]) expect(() => logarithmicIntegral(x)).toThrow();
  expect(() => primeCountSeries(50)).toThrow();
});
it("uses sourced zero ordinates rather than invented near-axis zeros", () => {
  expect(zetaZeroHeights).toHaveLength(6);
  expect(zetaZeroHeights[0]).toBe(14.134725142);
  expect(zetaZeroHeights.at(-1)).toBe(37.586178159);
  expect(zetaZeroHeights.every((v,i) => i === 0 || v > zetaZeroHeights[i-1])).toBe(true);
});
