import { expect,it } from "vitest";
import { checkPrecisionAnswers,planPrecision,precisionCosts,precisionInterval } from "./marginSampleSizeModel";
it("rounds the default required sample size upward",()=>{
  const plan=planPrecision(12,95,2);expect(plan.required).toBe(139);expect(plan.raw).toBeCloseTo(138.292517544989,9);expect(plan.achieved).toBeLessThanOrEqual(2);expect(plan.previous).toBeGreaterThan(2);
});
it("returns minimal sufficient positive integer sample sizes across supported settings",()=>{
  for(const sigma of [1,5,12,30])for(const confidence of [90,95,99] as const)for(const target of [.5,1,2,3,6]){const plan=planPrecision(sigma,confidence,target);expect(plan.achieved).toBeLessThanOrEqual(target);if(plan.previous!==null)expect(plan.previous).toBeGreaterThan(target);expect(Number.isInteger(plan.required)).toBe(true);}
});
it("matches comparison intervals and inverse-square cost ratios",()=>{
  expect(precisionInterval(25,12,95).margin).toBeCloseTo(4.7039135629,9);expect(precisionInterval(64,12,95).margin).toBeCloseTo(2.93994597681,9);
  const costs=precisionCosts(12,95);expect(costs.map(c=>c.relative)).toEqual([1,4,16,64]);costs.forEach((c,i)=>expect(c.margin).toBeCloseTo(costs[0].margin/2**i,12));
});
it("responds to confidence and sigma and validates domains",()=>{
  expect(planPrecision(12,99,2).required).toBeGreaterThan(planPrecision(12,95,2).required);expect(precisionInterval(100,24,95).margin).toBe(2*precisionInterval(100,12,95).margin);
  for(const n of [0,1.5,1000001,NaN])expect(()=>precisionInterval(n,12,95)).toThrow();for(const target of [0,.49,6.01,NaN])expect(()=>planPrecision(12,95,target)).toThrow();expect(()=>planPrecision(0,95,2)).toThrow();
});
it("checks the fixed challenge answers without prefilled success",()=>{
  expect(checkPrecisionAnswers(["62","246","2213"])).toEqual([true,true,true]);expect(checkPrecisionAnswers(["","",""])).toEqual([false,false,false]);expect(checkPrecisionAnswers(["61","245","2212"])).toEqual([false,false,false]);
});
