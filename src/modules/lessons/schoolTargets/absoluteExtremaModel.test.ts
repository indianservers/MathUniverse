import{describe,expect,it}from"vitest";
import{analyzeExtrema,candidateClassification,clampExtremaEndpoint,extremaFrame,extremaFunction,gradeExtremaPractice}from"./absoluteExtremaModel";
describe("absolute extrema",()=>{
 it("preserves every tie and avoids duplicating critical endpoints",()=>{
  const a=analyzeExtrema(-2,2,true);expect(a.maximum).toBe(3);expect(a.minimum).toBe(-1);expect(a.maxAt).toEqual([-1,2]);expect(a.minAt).toEqual([-2,1]);expect(a.candidates.map(c=>candidateClassification(c,a))).toEqual(["minimum","maximum","minimum","maximum"]);expect(analyzeExtrema(-1,1,true).candidates).toHaveLength(2);expect(analyzeExtrema(-.5,.5,true).maxAt).toEqual([-.5]);expect(analyzeExtrema(-.5,.5,true).minAt).toEqual([.5]);
 });
 it("compares excluded boundary limits before declaring an open-interval extremum",()=>{
  expect(analyzeExtrema(-2,2,false)).toMatchObject({maximum:3,minimum:-1,maxAt:[-1],minAt:[1]});const large=analyzeExtrema(-3,3,false);expect(large).toMatchObject({maximum:null,minimum:null,supremum:19,infimum:-17});expect(large.candidates.filter(c=>c.kind==="critical").map(c=>candidateClassification(c,large))).toEqual(["local-maximum","local-minimum"]);expect(analyzeExtrema(-1,1,false)).toMatchObject({maximum:null,minimum:null});expect(analyzeExtrema(.5,1.5,false)).toMatchObject({maximum:null,minimum:-1,minAt:[1]});expect(analyzeExtrema(-1,2,false)).toMatchObject({maximum:null,minimum:-1,minAt:[1]});
  for(const [a,b]of[[-3,3],[-2.5,2],[-1,1],[.5,1.5]]){const r=analyzeExtrema(a,b,false);for(let i=1;i<1000;i++){const value=extremaFunction(a+(b-a)*i/1000);expect(value).toBeLessThanOrEqual(r.supremum+1e-10);expect(value).toBeGreaterThanOrEqual(r.infimum-1e-10);}}
 });
 it("keeps curves inside fitted frames, clamps independent controls and grades blank answers safely",()=>{
  for(const[a,b]of[[-5,5],[-2,2],[-4,-3],[2,5],[-.05,.05],[4.9,5]]){const frame=extremaFrame(a,b);for(let i=0;i<=500;i++){const x=a+(b-a)*i/500,y=extremaFunction(x);expect(x).toBeGreaterThanOrEqual(frame.xmin);expect(x).toBeLessThanOrEqual(frame.xmax);expect(y).toBeGreaterThanOrEqual(frame.ymin);expect(y).toBeLessThanOrEqual(frame.ymax);}}
  expect(clampExtremaEndpoint("a",4,-2,2)).toBe(1.9);expect(clampExtremaEndpoint("b",-4,-2,2)).toBe(-1.9);expect(gradeExtremaPractice(-1.5,3.5,"33.375","-1").correct).toBe(true);expect(gradeExtremaPractice(-1.5,3.5,"267/8","−1").correct).toBe(true);expect(gradeExtremaPractice(-1.5,3.5,"3","-1")).toMatchObject({maximumCorrect:false,minimumCorrect:true});expect(gradeExtremaPractice(-1.5,3.5,"","").correct).toBe(false);expect(()=>analyzeExtrema(2,2,true)).toThrow();
 });
});
