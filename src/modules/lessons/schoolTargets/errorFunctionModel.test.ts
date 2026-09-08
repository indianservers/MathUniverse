import { describe,expect,it } from "vitest";
import { normalCdf } from "../../../phase4/statistics";
import { simpsonIntegral } from "../../../studios/calculus/calculusEnhancementEngine";
import { checkErrorPractice,diffusionKernel,errorCurves,errorFunctionState,erfValue,gaussianArea } from "./errorFunctionModel";
describe("Error function accumulation",()=>{
  it("matches known default values",()=>{const s=errorFunctionState(1);expect(s.area).toBeCloseTo(.746824132812427,11);expect(s.erf).toBeCloseTo(.842700792949715,11);expect(s.erfc).toBeCloseTo(.157299207050285,11);expect(s.normal).toBeCloseTo(.841344746068543,11);});
  it("handles signed area, odd symmetry, complement and exact zero",()=>{expect(gaussianArea(0)).toBe(0);expect(erfValue(0)).toBe(0);expect(errorFunctionState(0).normal).toBe(.5);for(const x of [.1,.5,1,2,3]){expect(gaussianArea(-x)).toBe(-gaussianArea(x));expect(erfValue(-x)).toBe(-erfValue(x));expect(errorFunctionState(x).erf+errorFunctionState(x).erfc).toBe(1);expect(errorFunctionState(-x).erfc).toBeGreaterThan(1);}});
  it("matches the independent existing normal CDF approximation",()=>{for(const z of [-3,-2,-1,.25,1,2,3])expect(errorFunctionState(z).normal).toBeCloseTo(normalCdf(z),7);});
  it("has the correct derivative and increasing bounded sample values",()=>{for(const x of [-2,-.5,0,.5,2])expect((erfValue(x+1e-5)-erfValue(x-1e-5))/2e-5).toBeCloseTo(errorFunctionState(x).derivative,8);errorCurves.forEach((p,i)=>{expect(p.erf).toBeGreaterThan(-1);expect(p.erf).toBeLessThan(1);if(i)expect(p.erf).toBeGreaterThan(errorCurves[i-1].erf);});});
  it("keeps heat-kernel mass one and broadens with diffusion time",()=>{for(const tau of [.1,.25,.5,1,2])expect(simpsonIntegral(z=>diffusionKernel(z,tau),-20,20,4000)).toBeCloseTo(1,10);expect(diffusionKernel(0,.25)).toBeGreaterThan(diffusionKernel(0,1));expect(diffusionKernel(2,.25)).toBeLessThan(diffusionKernel(2,1));});
  it("satisfies the heat equation with tau as diffusion time",()=>{const z=.8,tau=.5,h=1e-4,time=(diffusionKernel(z,tau+h)-diffusionKernel(z,tau-h))/(2*h),space=(diffusionKernel(z+h,tau)-2*diffusionKernel(z,tau)+diffusionKernel(z-h,tau))/(h*h);expect(time).toBeCloseTo(space,6);});
  it("checks three practice responses without accepting blanks",()=>{expect(checkErrorPractice("0","integral",".842700793")).toEqual([true,true,true]);expect(checkErrorPractice("","","")).toEqual([false,false,false]);expect(checkErrorPractice("0","erf","-.842700793")).toEqual([true,false,false]);});
});
