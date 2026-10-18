import{describe,expect,it}from"vitest";
import{accumulation,gradeSubstitutionAnswer,substitutionCurve,substitutionIntegrand,substitutionPrimitive,substitutionState}from"./integrationSubstitutionModel";
describe("integration by substitution",()=>{
 it("recognizes direct and shifted matches and differentiates the correct rewrites",()=>{
  expect(substitutionState("x²").match).toBe(true);expect(substitutionState("x²+1")).toMatchObject({match:true,inner:"u-1",code:"integral-cos-u-minus-one-du"});expect(substitutionState("x")).toMatchObject({match:false,supported:true});expect(substitutionState("2x")).toMatchObject({match:false,supported:true});expect(substitutionState("sin x").message).toContain("inverse branch");expect(substitutionState("sin x").supported).toBe(false);
  const rewrites=[(x:number)=>Math.sin(x*x),(x:number)=>Math.sin((x*x+1)-1),(x:number)=>Math.sin((2*x)**2/4)];for(const f of rewrites)for(const x of[-2,-.7,0,.5,1.6]){const h=1e-5;expect((f(x+h)-f(x-h))/(2*h)).toBeCloseTo(substitutionIntegrand(x),7);}
 });
 it("matches independent quadrature and endpoint differences including reversed and zero-width intervals",()=>{
  for(const [a,b]of[[-1.5,1.5],[0,1.5],[-1.5,0],[1.5,0],[-2.3,1.7],[3,-3],[1,1]]){const r=accumulation(a,b);expect(r.area).toBeCloseTo(r.netChange,7);expect(Math.abs(r.residual)).toBeLessThan(1e-7);}expect(accumulation(-1.5,1.5).netChange).toBe(0);expect(accumulation(0,1.5).netChange).toBeCloseTo(Math.sin(2.25));expect(()=>accumulation(NaN,1)).toThrow();
  const f=substitutionCurve(),F=substitutionCurve(true);expect(f).toHaveLength(1201);expect(F[600]).toEqual({x:0,y:0});expect(f[900].y).toBeCloseTo(3*Math.cos(2.25));expect(F[900].y).toBeCloseTo(Math.sin(2.25));for(let i=0;i<f.length;i+=20){expect(f[i].y).toBeCloseTo(-f[1200-i].y);expect(F[i].y).toBeCloseTo(F[1200-i].y);}
  const geometric=Array.from({length:10000},(_,i)=>Math.abs(substitutionIntegrand(-1.5+(i+.5)*3/10000))*3/10000).reduce((a,b)=>a+b,0);expect(geometric).toBeCloseTo(2*(2-substitutionPrimitive(1.5)),6);expect(geometric).toBeGreaterThan(2);
 });
 it("grades equivalent trig/polynomial primitives and rejects missing chain factors or nonconstant C",()=>{
  for(const a of["−2cos(x²)+C","C-2*cos(x^2)","2sin(x^2-pi/2)+C"])expect(gradeSubstitutionAnswer(0,a).correct).toBe(true);for(const a of["3/10(x²+5)^5+C","0.3*(x^2+5)^5+C",String.raw`\frac{3}{10}(x^2+5)^5+C`])expect(gradeSubstitutionAnswer(1,a).correct).toBe(true);expect(gradeSubstitutionAnswer(2,"1/10sin(5x^2+1)+C").correct).toBe(true);expect(gradeSubstitutionAnswer(0,"-2cos(x^2)+7").message).toContain("Add + C");
  for(const [i,a]of[[0,"2cos(x^2)+C"],[1,"3/5(x^2+5)^5+C"],[2,"sin(5x^2+1)+C"],[0,"-2cos(x^2)+C*x"],[0,""],[0,"window.alert(1)"]] as const)expect(gradeSubstitutionAnswer(i,a).correct).toBe(false);
 });
});
