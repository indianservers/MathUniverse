import{describe,expect,it}from"vitest";
import{gradePropertyMatches,integralFunctions,matchingAnswers,splitIntegral,type IntegralFunctionId}from"./definiteIntegralPropertiesModel";
function numerical(id:IntegralFunctionId,a:number,b:number){const n=2000,h=(b-a)/n,f=integralFunctions[id].value;let total=f(a)+f(b);for(let i=1;i<n;i++)total+=(i%2?4:2)*f(a+i*h);return total*h/3;}
describe("definite integral properties",()=>{
 it("preserves additivity and compares with independent quadrature for all functions and splits",()=>{
  for(const id of Object.keys(integralFunctions) as IntegralFunctionId[])for(const c of[0,.05,.7,2,Math.PI,3.95,4]){const r=splitIntegral(id,c);expect(r.left+r.right).toBeCloseTo(r.total,12);expect(r.left).toBeCloseTo(numerical(id,0,c),10);expect(r.right).toBeCloseTo(numerical(id,c,4),10);}
  expect(splitIntegral("linear",2)).toEqual({left:2,right:6,total:8});expect(splitIntegral("shifted",2)).toEqual({left:-2,right:2,total:0});expect(()=>splitIntegral("linear",NaN)).toThrow();expect(()=>splitIntegral("linear",5)).toThrow();
 });
 it("independently verifies the six example identities and worked split",()=>{
  expect(numerical("linear",3,1)).toBeCloseTo(-4);expect(numerical("linear",3,1)).toBeCloseTo(-numerical("linear",1,3));expect(numerical("linear",2,2)).toBe(0);
  expect(numerical("linear",0,4)).toBeCloseTo(numerical("linear",0,2)+numerical("linear",2,4));expect(3*numerical("linear",0,4)).toBeCloseTo(24);
  expect(numerical("square",-2,2)).toBeCloseTo(2*numerical("square",0,2));expect(numerical("square",-2,2)).toBeCloseTo(16/3);expect(numerical("linear",-2,2)).toBeCloseTo(0);
  expect(numerical("linear",1,2)).toBeCloseTo(1.5);expect(numerical("linear",2,4)).toBeCloseTo(6);expect(numerical("linear",1,4)).toBeCloseTo(7.5);
 });
 it("never grades unanswered rows as correct and reports individual mismatches",()=>{
  expect(gradePropertyMatches(Array(6).fill(""))).toEqual({rows:Array(6).fill(false),score:0,complete:false});expect(gradePropertyMatches(matchingAnswers).complete).toBe(true);expect(gradePropertyMatches(["C","A","C","D","E","F"]).score).toBe(5);expect(gradePropertyMatches([]).score).toBe(0);
 });
});
