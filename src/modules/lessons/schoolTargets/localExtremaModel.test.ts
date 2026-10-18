import{describe,expect,it}from"vitest";
import{classifyDerivativeSigns,clampLocalPoint,gradeStationaryUnderstanding,localDerivative,localFunction,localGraphFrame,localProbe,localTangent,quarticDerivative,quarticExtrema,quarticFunction,scanLocalProbe}from"./localExtremaModel";
describe("local extrema",()=>{
 it("computes exact cubic points, slopes, regions and tangent geometry",()=>{
  expect(localProbe(.5)).toEqual({value:-1.375,slope:-2.25,sign:"Negative (−)",region:2});expect(localFunction(0)).toBe(0);expect(localFunction(-1)).toBe(2);expect(localFunction(1)).toBe(-2);
  for(const[x,region]of[[-2,0],[-1,1],[0,2],[1,3],[2,4]])expect(localProbe(x).region).toBe(region);
  for(const x of[-2.6,-1,-.5,0,.5,1,2.6]){const h=1e-5;expect((localFunction(x+h)-localFunction(x-h))/(2*h)).toBeCloseTo(localDerivative(x),7);expect(localTangent(x,x)).toBe(localFunction(x));expect((localTangent(x,x+.5)-localTangent(x,x-.5))).toBeCloseTo(localDerivative(x),12);const f=localGraphFrame(x);expect(localFunction(x)).toBeGreaterThanOrEqual(f.ymin);expect(localFunction(x)).toBeLessThanOrEqual(f.ymax);}
 });
 it("uses both side signs and correctly classifies every quartic stationary point",()=>{
  expect(classifyDerivativeSigns(1,-1)).toBe("maximum");expect(classifyDerivativeSigns(-1,1)).toBe("minimum");expect(classifyDerivativeSigns(1,1)).toBe("neither");expect(classifyDerivativeSigns(-1,-1)).toBe("neither");expect(classifyDerivativeSigns(0,0)).toBe("inconclusive");
  for(const point of quarticExtrema){expect(quarticDerivative(point.x)).toBeCloseTo(0,10);expect(point.value).toBeCloseTo(point.kind==="maximum"?1:-3,12);expect(classifyDerivativeSigns(Math.sign(quarticDerivative(point.x-.01))as-1|1,Math.sign(quarticDerivative(point.x+.01))as-1|1)).toBe(point.kind);}
  for(const x of[-2,-.7,.3,2]){const h=1e-5;expect((quarticFunction(x+h)-quarticFunction(x-h))/(2*h)).toBeCloseTo(quarticDerivative(x),7);}
  expect(gradeStationaryUnderstanding("1").correct).toBe(true);expect(gradeStationaryUnderstanding("0").message).toContain("inconclusive");expect(gradeStationaryUnderstanding("").correct).toBe(false);
 });
 it("clamps probes and drives playback from elapsed time without per-frame rounding drift",()=>{
  expect(clampLocalPoint(-10)).toBe(-2.6);expect(clampLocalPoint(10)).toBe(2.6);expect(clampLocalPoint(.531)).toBe(.53);expect(scanLocalProbe(.5,1)).toBe(1.15);expect(scanLocalProbe(.5,100)).toBe(2.6);expect(scanLocalProbe(-2.6,0)).toBe(-2.6);
 });
});
