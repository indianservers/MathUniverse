import {describe,it,expect} from 'vitest';
import {computeMath} from './kernel';
import {certifyKernel} from './independentVerification';
import type {KernelRequest,KernelResult,RealSolutionSet} from './types';

const solve=(expression:string,assumptions:string[]=[])=>computeMath({operation:'solve',expression,assumptions});
describe('independent bounded equation foundation',()=>{
 for(const [expression,kind,values] of [
  ['2*x+3=7','finite',['2']],['x^2-4=0','finite',['2','-2']],['(x-1)^2=0','finite',['1']],
  ['x^2+1=0','empty',[]],['3=0','empty',[]],['0=0','infinite',[]],
  ['(x^2-1)/(x-1)=0','finite',['-1']],['1/(x-1)=0','empty',[]],
  ['(x-1)/(x-1)=1','infinite',[]],['(x^2-1)/(x-1)=2','empty',[]],
  ['x^-1=2','finite',['1/2']],['(x-2)/(x+1)=(x-2)/(x+1)','infinite',[]],
 ] as const)it(expression,async()=>{
  const r=await solve(expression);expect(r.execution?.status,r.answer).toBe('verified');
  expect(r.solutionSet).toMatchObject({kind,complete:true,values});expect(r.execution?.evidence).toMatchObject({scope:'solutions',complete:true,level:'exact_symbolic'});
 });
 it('checks radical roots and assumptions exactly',async()=>{
  for(const assumptions of [[],['x > 0'],['x >= 0'],['x != 0'],['x < -1/2'],['x in [-2, 2]']]){
   const r=await solve('x^2=2',assumptions);expect(r.execution?.status,r.answer).toBe('verified');
   expect((r.solutionSet as RealSolutionSet).values).toHaveLength(assumptions.length&&assumptions[0]!=='x != 0'&&assumptions[0]!=='x in [-2, 2]'?1:2);
  }
 });
 it('identity domains collapse to a point or exclude it',async()=>{
  expect((await solve('x/x=1',['x = 0'])).solutionSet).toMatchObject({kind:'empty'});
  expect((await solve('x/x=1',['x >= 2','x <= 2'])).solutionSet).toMatchObject({kind:'finite',values:['2']});
  const identity=await solve('x/x=1');expect(identity.conditions.some(s=>s.includes('x')&&s.includes('!= 0'))).toBe(true);
 });
 it('catches wrong and missing roots, exclusions and false infinity',async()=>{
  const request:KernelRequest={operation:'solve',expression:'x^2-4=0'};
  const correct=await computeMath(request);
  for(const values of [['2'],['2','3'],[],['2','2']]){
   const r=structuredClone(correct);r.value=values;(r.solutionSet as RealSolutionSet).values=values;
   r.answer=values.length?`x ∈ {${values.join(', ')}}`:'No real solutions';
   expect(certifyKernel(request,r).execution?.status).toBe('internal_error');
  }
  const excludedRequest:KernelRequest={operation:'solve',expression:'x/x=1'},r=await computeMath(excludedRequest);
  r.conditions=[];(r.solutionSet as RealSolutionSet).conditions=[];
  expect(certifyKernel(excludedRequest,r).execution?.status).toBe('internal_error');
 });
 it('higher degree and complex solving never claim a bounded certificate',async()=>{
  for(const request of [{operation:'solve' as const,expression:'x^3=1'},{operation:'solve' as const,expression:'x^2+1=0',domain:'complex' as const}])expect((await computeMath(request)).execution?.status).not.toBe('verified');
 });
});
const line2=(a:number[],b:number[],kind='line')=>({kind,a,b});
const line3=(point:number[],direction:number[],kind='line')=>({kind,point,direction});
const circle=(center:number[],radius:number)=>({kind:'circle',center,radius});
const geometry=(operation:'geometry2d'|'geometry3d',args:unknown[])=>computeMath({operation,args});
describe('independent intersection foundation',()=>{
 const cases:[KernelRequest,string][]=[
  [{operation:'geometry2d',args:['intersection',line2([0,0],[2,0]),line2([1,-1],[1,1])]},'point'],
  [{operation:'geometry2d',args:['intersection',line2([0,0],[2,0]),line2([0,1],[2,1])]},'parallel'],
  [{operation:'geometry2d',args:['intersection',line2([0,0],[2,0]),line2([1,0],[3,0])]},'coincident'],
  [{operation:'geometry2d',args:['intersection',line2([0,0],[2,0],'segment'),line2([1,0],[3,0],'segment')]},'overlap'],
  [{operation:'geometry2d',args:['intersection',line2([0,0],[1,0],'ray'),line2([-1,0],[-2,0],'ray')]},'none'],
  [{operation:'geometry2d',args:['intersection',line2([0,0],[0,0],'segment'),line2([-1,0],[1,0])]},'point'],
  [{operation:'geometry2d',args:['circleLine',circle([0,0],1),line2([-2,1],[2,1])]},'points'],
  [{operation:'geometry2d',args:['circleLine',circle([0,0],1),line2([2,0],[3,0],'ray')]},'none'],
  [{operation:'geometry2d',args:['circleLine',circle([0,0],1),line2([-2,0],[2,0])]},'points'],
  [{operation:'geometry2d',args:['circleCircle',circle([0,0],2),circle([2,0],2)]},'points'],
  [{operation:'geometry2d',args:['intersection',circle([0,0],1),circle([2,0],1)]},'points'],
  [{operation:'geometry2d',args:['circleCircle',circle([0,0],1),circle([0,0],1)]},'coincident'],
  [{operation:'geometry2d',args:['circleCircle',circle([0,0],1),circle([0,0],2)]},'none'],
  [{operation:'geometry3d',args:['lineLine',line3([0,0,0],[1,0,0]),line3([0,0,1],[0,1,0])]},'skew'],
  [{operation:'geometry3d',args:['lineLine',line3([0,0,0],[1,0,0],'segment'),line3([0,0,1],[0,1,0],'ray')]},'none'],
  [{operation:'geometry3d',args:['lineLine',line3([0,0,0],[1,0,0]),line3([0,0,0],[0,1,0])]},'point'],
  [{operation:'geometry3d',args:['linePlane',line3([0,0,1],[0,0,-1]),{point:[0,0,0],normal:[0,0,1]}]},'point'],
  [{operation:'geometry3d',args:['linePlane',line3([0,0,1],[1,0,0]),{point:[0,0,0],normal:[0,0,1]}]},'parallel'],
  [{operation:'geometry3d',args:['linePlane',line3([0,0,0],[1,0,0]),{point:[0,0,0],normal:[0,0,1]}]},'coincident'],
  [{operation:'geometry3d',args:['planePlane',{point:[0,0,2],normal:[0,0,1]},{point:[0,3,0],normal:[0,1,0]}]},'line'],
  [{operation:'geometry3d',args:['planePlane',{point:[0,0,2],normal:[0,0,1]},{point:[0,0,2],normal:[0,0,2]}]},'coincident'],
  [{operation:'geometry3d',args:['spherePlane',{center:[0,0,0],radius:2},{point:[0,0,1],normal:[0,0,1]}]},'circle'],
  [{operation:'geometry3d',args:['spherePlane',{center:[0,0,0],radius:2},{point:[0,0,2],normal:[0,0,1]}]},'point'],
  [{operation:'geometry3d',args:['spherePlane',{center:[0,0,0],radius:2},{point:[0,0,3],normal:[0,0,1]}]},'none'],
 ];
 for(const [i,[request,kind]] of cases.entries())it(`intersection ${i}: ${request.operation} ${request.args?.[0]} ${kind}`,async()=>{
  const r=await computeMath(request);expect(r.execution?.status,r.answer).toBe('verified');expect(r.value).toMatchObject({kind});
  const bad=structuredClone(r);(bad.value as Record<string,unknown>).kind=kind==='none'?'point':'none';
  bad.answer=JSON.stringify(bad.value);
  expect(certifyKernel(request,bad).execution?.status).toBe('internal_error');
 });
 it('catches altered rounded and exact coordinates and missing intersections',async()=>{
  for(const [request] of cases.filter(([r])=>['circleLine','circleCircle','planePlane','linePlane'].includes(String(r.args?.[0])))){
   const r=await computeMath(request),value=r.value as Record<string,unknown>;
   if(Array.isArray(value.point))value.point=value.point.map(()=>99);
   else if(Array.isArray(value.points)&&value.points.length)value.points=[];else continue;
   r.answer=JSON.stringify(r.value);
   expect(certifyKernel(request,r).execution?.status).toBe('internal_error');
  }
 });
 it('near tangencies preserve exact intersection classification',async()=>{
  for(const [offset,count] of [[1-Number.EPSILON,2],[1,1],[1+Number.EPSILON,0]]){
   const r=await geometry('geometry2d',['circleLine',circle([0,0],1),line2([-2,offset],[2,offset])]);
   expect(r.execution?.status,r.answer).toBe('verified');expect((r.value as {points:number[][]}).points).toHaveLength(count);
  }
 });
 for(const scale of [1e-120,1e120])it(`scaled geometry ${scale}`,async()=>{
  for(const args of [['circleLine',circle([0,0],scale),line2([-2*scale,0],[2*scale,0])],['circleCircle',circle([0,0],scale),circle([scale,0],scale)]]){
   const r=await geometry('geometry2d',args);expect(r.execution?.status,r.answer).toBe('verified');
  }
  const spatial=await geometry('geometry3d',['spherePlane',{center:[0,0,0],radius:scale},{point:[0,0,scale/2],normal:[0,0,1]}]);
  expect(spatial.execution?.status,spatial.answer).toBe('verified');
  expect((spatial.value as {radius:number}).radius).toBeGreaterThan(0);
  const bad=structuredClone(spatial);(bad.value as {radius:number}).radius=0;bad.answer=JSON.stringify(bad.value);
  expect(certifyKernel({operation:'geometry3d',args:['spherePlane',{center:[0,0,0],radius:scale},{point:[0,0,scale/2],normal:[0,0,1]}]},bad).execution?.status).toBe('internal_error');
 });
 it('rejects zero directions and normals',async()=>{
  for(const args of [['linePlane',line3([0,0,0],[0,0,0]),{point:[0,0,0],normal:[0,0,1]}],['planePlane',{point:[0,0,0],normal:[0,0,0]},{point:[0,0,0],normal:[0,0,1]}]])expect((await geometry('geometry3d',args)).execution?.status).toBe('invalid_input');
 });
 it('legacy statuses agree with unsupported independent evidence',async()=>{
  const r:KernelResult=await geometry('geometry2d',['triangle',[[0,0],[3,0],[0,4]]]);
  expect(r.execution?.status).toBe('valid_unverified');expect(r.status).toBe('unverified');expect(r.verification.passed).toBe(false);
 });
});
