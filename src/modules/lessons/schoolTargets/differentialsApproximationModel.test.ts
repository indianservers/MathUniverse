import{describe,expect,it}from"vitest";
import{axisTicks,cubeRootEstimate,differentialApproximation,differentialFrame,dxPosition,gradeCubeRootEstimate,positionDx,shrinkChange}from"./differentialsApproximationModel";
describe("differential approximation",()=>{
 it("computes the actual change, tangent differential and errors independently",()=>{
  for(const a of[.1,1,4,9,25])for(const dx of[.001,.05,.1,.5,1]){const r=differentialApproximation(a,dx);expect(r.actual).toBeCloseTo(Math.sqrt(a+dx),12);expect(r.delta).toBeCloseTo(Math.sqrt(a+dx)-Math.sqrt(a),12);expect(r.dy).toBeCloseTo(dx/(2*Math.sqrt(a)),12);expect(r.error).toBeCloseTo(r.approximation-r.actual,12);expect(r.approximation).toBeGreaterThan(r.actual);expect(r.error).toBeGreaterThan(0);}
  const r=differentialApproximation(4,.1);expect(r.approximation).toBe(2.025);expect(r.dy).toBe(.025);expect(r.percentage).toBeGreaterThan(.62);expect(r.percentage).toBeLessThan(.63);expect(differentialApproximation(4,.05).error/r.error).toBeCloseTo(.25,2);expect(()=>differentialApproximation(0,.1)).toThrow();
 });
 it("keeps both points inside every real-coordinate zoom frame and synchronizes logarithmic sliders",()=>{
  for(const a of[.1,4,25])for(const dx of[.001,.1,1])for(const zoom of[.5,1,2,8,64]){const f=differentialFrame(a,dx,zoom),r=differentialApproximation(a,dx);for(const x of[a,a+dx]){expect(x).toBeGreaterThanOrEqual(f.xmin);expect(x).toBeLessThanOrEqual(f.xmax);}for(const y of[r.fa,r.actual,r.approximation]){expect(y).toBeGreaterThanOrEqual(f.ymin);expect(y).toBeLessThanOrEqual(f.ymax);}expect(f.xmin).toBeGreaterThanOrEqual(0);expect(axisTicks(f.xmin,f.xmax).every(x=>x>=f.xmin-1e-6&&x<=f.xmax+1e-6)).toBe(true);}
  expect(differentialFrame(4,.1,1).xmin).toBe(0);expect(differentialFrame(4,.1,1).xmax).toBe(7);for(const dx of[.001,.01,.05,.1,.5,1])expect(positionDx(dxPosition(dx))).toBeCloseTo(dx,12);expect(dxPosition(.1)).toBe(50);expect(shrinkChange(.1,1,2)).toBeLessThan(shrinkChange(.1,1,1));expect(shrinkChange(.1,100,4)).toBe(.001);
 });
 it("grades differential estimates and only unlocks answers after a finite attempt",()=>{
  expect(cubeRootEstimate).toBeCloseTo(271/90,12);for(const value of["3.01111","3.0111","271/90"])expect(gradeCubeRootEstimate(value).correct).toBe(true);expect(gradeCubeRootEstimate(String(Math.cbrt(27.3))).correct).toBe(false);expect(gradeCubeRootEstimate("3")).toMatchObject({attempted:true,correct:false});for(const value of["","abc","1/0","Infinity"])expect(gradeCubeRootEstimate(value).attempted).toBe(false);
 });
});
