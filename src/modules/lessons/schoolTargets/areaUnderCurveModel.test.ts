import { describe, expect, it } from "vitest";
import { isPracticeAreaCorrect, rectangleCounts, riemannResult } from "./areaUnderCurveModel";
describe("area under a curve", () => {
 it("matches independent closed-form sums and correct sample coordinates", () => {
  for (const n of rectangleCounts) for (const method of ["left", "right", "mid"] as const) {
   const expected = method === "left" ? 8/3-4/n+4/(3*n*n) : method === "right" ? 8/3+4/n+4/(3*n*n) : 8/3-2/(3*n*n);
   const result=riemannResult(false,n,method),practice=riemannResult(true,n,method);
   expect(result.approximate).toBeCloseTo(expected,12);expect(practice.approximate).toBeCloseTo(8-expected,12);
   expect(result.rectangles).toHaveLength(n);
   for(const r of result.rectangles){expect(r.sample).toBeGreaterThanOrEqual(r.left);expect(r.sample).toBeLessThanOrEqual(r.right);expect(r.height).toBeCloseTo(r.sample**2);expect(r.right-r.left).toBeCloseTo(2/n);}
   expect(result.rectangles[0].left).toBe(0);expect(result.rectangles.at(-1)?.right).toBe(2);
  }
 });
 it("has correct error signs and converges in both labs",()=>{
  expect(riemannResult(false,4,"mid").approximate).toBe(2.625);
  expect(riemannResult(true,4,"left").approximate).toBe(6.25);
  for(const practice of[false,true])for(const method of["left","right","mid"] as const){const a=riemannResult(practice,4,method),b=riemannResult(practice,64,method);expect(b.absoluteError).toBeLessThan(a.absoluteError);expect(a.absoluteError).toBe(Math.abs(a.error));}
  expect(riemannResult(false,4,"left").error).toBeLessThan(0);expect(riemannResult(false,4,"right").error).toBeGreaterThan(0);expect(riemannResult(true,4,"left").error).toBeGreaterThan(0);
  expect(()=>riemannResult(false,0,"mid")).toThrow();
 });
 it("grades numerical and fraction answers without accepting identities or invalid numbers",()=>{
  for(const a of["16/3","32 / 6","5.3333","\\frac{16}{3}","\\dfrac{16}{3}"])expect(isPracticeAreaCorrect(a)).toBe(true);
  for(const a of["","8/3","16/0","Infinity","5.33","16/3=16/3","alert(1)"])expect(isPracticeAreaCorrect(a)).toBe(false);
 });
});
