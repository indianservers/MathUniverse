import{describe,expect,it}from"vitest";
import{blankPartsChallenge,gradePartsChallenge,measuredPartsDerivative,partsAssignment,partsExamples,samplePartsVerification,type PartsChallenge,type PartsExampleId}from"./integrationByPartsModel";
const correct:PartsChallenge={u:"x^2",dv:"e^x dx",du:"2x dx",v:"e^x",uv:"x^2 e^x",rest:"2x e^x",answer:"e^x(x^2-2x+2)"};
describe("integration by parts",()=>{
 it("separates preview, efficient, inefficient and invalid factor assignments",()=>{
  expect(partsAssignment("exponential",null,null).preview).toBe(true);expect(partsAssignment("exponential","algebraic","transcendent")).toMatchObject({valid:true,efficient:true,du:"dx",v:"e^x"});expect(partsAssignment("exponential","transcendent","algebraic")).toMatchObject({valid:true,efficient:false,du:String.raw`e^x\,dx`,v:String.raw`\frac{x^2}{2}`});expect(partsAssignment("sine","algebraic","transcendent").v).toBe(String.raw`-\cos x`);expect(partsAssignment("sine","algebraic","algebraic").valid).toBe(false);
 });
 it("independently differentiates both worked results and samples true graph coordinates",()=>{
  for(const id of Object.keys(partsExamples) as PartsExampleId[])for(const x of[-2,-1,0,.7,1.5,2.2])expect(measuredPartsDerivative(id,x)).toBeCloseTo(partsExamples[id].integrand(x),5);
  for(const id of["exponential","sine"] as const){const points=samplePartsVerification(id);expect(points).toHaveLength(311);expect(points[0].x).toBe(-2.2);expect(points.at(-1)!.x).toBe(2.2);expect(Math.max(...points.map(p=>Math.abs(p.derivative-p.integrand)))).toBeLessThan(1e-5);}
  expect(partsExamples.exponential.integrand(2)).toBeCloseTo(2*Math.exp(2));expect(partsExamples.sine.primitive(1)).toBeCloseTo(-Math.cos(1)+Math.sin(1));
  for(const x of[.2,.7,1.6,3]){const h=1e-5,f=(t:number)=>t*t/2*Math.log(t)-t*t/4;expect((f(x+h)-f(x-h))/(2*h)).toBeCloseTo(x*Math.log(x),7);}
 });
 it("grades every worksheet step and equivalent antiderivatives while preserving minus signs and differentials",()=>{
  expect(gradePartsChallenge(blankPartsChallenge()).score).toBe(0);expect(gradePartsChallenge(correct).correct).toBe(true);
  for(const answer of["eˣ(x²−2x+2)+C","x^2*exp(x)-2*x*exp(x)+2*exp(x)+7+C",String.raw`e^{x}(x^{2}-2x+2)+C`])expect(gradePartsChallenge({...correct,answer}).correct).toBe(true);
  expect(gradePartsChallenge({...correct,answer:"e^x(x^2+2x+2)+C"}).valid.answer).toBe(false);expect(gradePartsChallenge({...correct,answer:"e^x(x^2-2x+2)+C*x"}).valid.answer).toBe(false);expect(gradePartsChallenge({...correct,du:"2x"}).valid.du).toBe(false);expect(gradePartsChallenge({...correct,dv:"e^x"}).valid.dv).toBe(false);expect(gradePartsChallenge({...correct,rest:"2x e^x dx"}).valid.rest).toBe(true);expect(gradePartsChallenge({...correct,answer:"globalThis.alert(1)"}).valid.answer).toBe(false);
 });
});
