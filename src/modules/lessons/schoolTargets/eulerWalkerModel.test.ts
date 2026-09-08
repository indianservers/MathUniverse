import { describe, expect, it } from "vitest";
import { checkEulerPractice, eulerStepSizes, eulerWalk } from "./eulerWalkerModel";
describe("Euler step walker",()=>{
  it("matches the four quarter-step values and final signed error",()=>{const r=eulerWalk(.25);expect(r.map(p=>p.y)).toEqual([1,1.25,1.5625,1.953125,2.44140625]);expect(r[4].error).toBeCloseTo(-.2768755785,9);expect(r[4].next).toBeNull();});
  it("satisfies the recurrence and independent closed form for every step size",()=>{for(const h of eulerStepSizes){const rows=eulerWalk(h);expect(rows.at(-1)!.x).toBe(1);for(const r of rows){expect(r.y).toBeCloseTo((1+h)**r.n,12);expect(r.slope).toBe(r.y);expect(r.exact).toBe(Math.exp(r.x));if(r.next!==null)expect(r.next).toBeCloseTo(rows[r.n+1].y,12);}}});
  it("reduces endpoint error for smaller steps",()=>{const errors=eulerStepSizes.map(h=>Math.abs(eulerWalk(h).at(-1)!.error));expect(errors[0]).toBeGreaterThan(errors[1]);expect(errors[1]).toBeGreaterThan(errors[2]);expect(eulerWalk(.1).at(-1)!.y).toBeCloseTo(2.5937424601,10);});
  it("checks answers independently and rejects empty or nonfinite input",()=>{expect(checkEulerPractice("1.25","1.5625")).toEqual([true,true]);expect(checkEulerPractice(""," ")).toEqual([false,false]);expect(checkEulerPractice("1.25","1.5")).toEqual([true,false]);expect(checkEulerPractice("Infinity","NaN")).toEqual([false,false]);});
});
