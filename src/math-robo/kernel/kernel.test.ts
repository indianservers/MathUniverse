import {describe,it,expect,afterAll} from 'vitest';
import {mkdirSync,writeFileSync} from 'node:fs';
import {computeMath} from './kernel';
import {kernelRequest} from './language';
import {SemanticEngine} from '../intelligence/semanticEngine';
import {describeObject} from '../intelligence/sceneContext';
import type {VisualCommand} from '../../offline-intelligence/commands';
import type {KernelRequest} from './types';
const measured:{category:string;case:number;status:string;elapsedMs:number;passed:boolean}[]=[];
async function checked(category:string,i:number,r:KernelRequest,verify:(result:Awaited<ReturnType<typeof computeMath>>)=>void){const result=await computeMath(r);let passed=false;try{verify(result);passed=true;}finally{measured.push({category,case:i,status:result.status,elapsedMs:result.elapsedMs,passed});}}
// This corpus is evaluation-only. No model/data generator consumes this file.
// Parameterized expectations use independent integer formulas, invariants or substitutions.
describe('100 arithmetic/algebra evaluation-only cases',()=>{
 it.each(Array.from({length:100},(_,i)=>i))('case %i',async i=>{const n=i+2;
  if(i%5===0)await checked('arithmetic-algebra',i,{operation:'evaluate',expression:`${n}/3+${2*n}/3`},r=>{expect(r.status).toBe('verified_exact');expect(r.answer).toBe(String(n));});
  if(i%5===1)await checked('arithmetic-algebra',i,{operation:'gcd',args:[String(7*n),String(11*n)]},r=>expect(r.answer).toBe(String(n)));
  if(i%5===2)await checked('arithmetic-algebra',i,{operation:'solve',expression:`x^2-${n*n}=0`},r=>{expect(r.status).toMatch(/^verified/);expect(new Set(r.value as string[])).toEqual(new Set([String(n),String(-n)]));});
  if(i%5===3)await checked('arithmetic-algebra',i,{operation:'equivalent',expression:`(x+${n})^2`,other:`x^2+${2*n}*x+${n*n}`},r=>{expect(r.status).toBe('verified_exact');expect(r.value).toBe(true);});
  if(i%5===4)await checked('arithmetic-algebra',i,{operation:'decimal',expression:`${n}/8`,precision:3},r=>{expect(Number(r.answer)).toBe(n/8);expect(r.errorBound).toBeTruthy();});
 });
});
describe('100 geometry/coordinate cases',()=>{
 it.each(Array.from({length:100},(_,i)=>i))('case %i',async i=>{const n=i+1;
  if(i%5===0)await checked('geometry',i,{operation:'geometry',args:['distance',[n,-n],[n+3,-n+4]]},r=>expect(r.value).toBe(5));
  if(i%5===1)await checked('geometry',i,{operation:'geometry',args:['midpoint',[n,2],[n+4,6]]},r=>expect(r.value).toEqual({x:n+2,y:4}));
  if(i%5===2)await checked('geometry',i,{operation:'geometry',args:['section',[n,0],[n+6,0],[1,2]]},r=>expect(r.value).toEqual([n+2,0]));
  if(i%5===3)await checked('geometry',i,{operation:'geometry',args:['area',[n,0],[n+6,0],[n+2,4]]},r=>expect(r.value).toBe(12));
  if(i%5===4)await checked('geometry',i,{operation:'geometry',args:['tangent',[n,0],[n+3,4],5]},r=>{expect(r.value).toEqual({a:3,b:4,c:3*(n+3)+16});expect(r.verification.passed).toBe(true);});
 });
});
describe('75 trigonometry/calculus cases',()=>{
 it.each(Array.from({length:75},(_,i)=>i))('case %i',async i=>{const n=i+2;
  if(i%5===0)await checked('trig-calculus',i,{operation:'differentiate',expression:`${n}*x^3+2*x`},r=>{expect(r.status).toBe('verified_exact');expect(r.answer).toContain(String(3*n));});
  if(i%5===1)await checked('trig-calculus',i,{operation:'integrate',expression:`${n}*x^2`},r=>{expect(r.status).toBe('verified_exact');expect(r.answer).toContain('C');});
  if(i%5===2)await checked('trig-calculus',i,{operation:'quadrature',expression:`${n}*x^2`,args:[0,3]},r=>{expect(Number(r.value)).toBeCloseTo(9*n,8);expect(r.status).toBe('verified_numerical');});
  if(i%5===3)await checked('trig-calculus',i,{operation:'trigSolve',expression:`sin(x)=${i%3===0?'1/2':i%3===1?'0':'-1/2'}`},r=>{expect(r.status,r.answer).toBe('verified_with_assumptions');expect(r.value).toHaveLength(2);expect(r.conditions).toContain('k is an integer');});
  if(i%5===4)await checked('trig-calculus',i,{operation:'root',expression:`x^2-${n*n}`,args:[0,n+1]},r=>{expect(Number(r.value)).toBeCloseTo(n,6);expect(r.errorBound).toBeTruthy();});
 });
});
describe('75 3D/linear algebra cases',()=>{
 it.each(Array.from({length:75},(_,i)=>i))('case %i',async i=>{const n=i+1;
  if(i%5===0)await checked('3d-linear',i,{operation:'linear',args:['dot',[n,2,3],[4,5,6]]},r=>expect(r.value).toBe(4*n+28));
  if(i%5===1)await checked('3d-linear',i,{operation:'linear',args:['cross',[n,0,0],[0,2,0]]},r=>expect(r.value).toEqual([0,0,2*n]));
  if(i%5===2)await checked('3d-linear',i,{operation:'linear',args:['inverse',[[n,1],[0,1]]]},r=>{expect(r.status).toBe('verified_numerical');expect((r.value as number[][])[0][0]).toBeCloseTo(1/n,10);});
  if(i%5===3)await checked('3d-linear',i,{operation:'linear',args:['determinant',[[n,2],[3,4]]]},r=>expect(r.value).toBe(4*n-6));
  if(i%5===4)await checked('3d-linear',i,{operation:'geometry',args:['linePlane',[n,0,0],[0,0,1],[0,0,3],[0,0,1]]},r=>expect(r.value).toEqual([n,0,3]));
 });
});
describe('75 statistics/differential equation cases',()=>{
 it.each(Array.from({length:75},(_,i)=>i))('case %i',async i=>{const n=i+1;
  if(i%5===0)await checked('statistics-ode',i,{operation:'statistics',args:['mean',[n,n+2,n+4]]},r=>expect(r.value).toBe(n+2));
  if(i%5===1)await checked('statistics-ode',i,{operation:'statistics',args:['variance',[n,n+2,n+4],true]},r=>{expect(r.value).toBe(4);expect(r.conditions).toContain('sample: divisor n-1');});
  if(i%5===2)await checked('statistics-ode',i,{operation:'statistics',args:['variance',[n,n+2,n+4],false]},r=>expect(Number(r.value)).toBeCloseTo(8/3,10));
  if(i%5===3)await checked('statistics-ode',i,{operation:'ode',expression:'y',args:[n,0,0.1]},r=>{expect(r.status).toBe('verified_numerical');expect(Number(r.value)).toBeCloseTo(n*Math.exp(0.1),6);expect(r.conditions).toContain(`y(0)=${n}`);});
  if(i%5===4)await checked('statistics-ode',i,{operation:'ode',expression:`${n}*t`,args:[0,0,2]},r=>expect(Number(r.value)).toBeCloseTo(2*n,8));
 });
});
describe('75 reasoning/explanation/adversarial cases',()=>{
 it.each(Array.from({length:75},(_,i)=>i))('case %i',async i=>{
  if(i%5===0)await checked('reasoning-adversarial',i,{operation:'evaluate',expression:`1/(${i}-${i})`},r=>{expect(r.status).toBe('unsupported');expect(r.verification.passed).toBe(false);});
  if(i%5===1)await checked('reasoning-adversarial',i,{operation:'solve',expression:`x^${3+i%5}=1`},r=>{expect(r.status).toMatch(/^verified/);expect(new Set(r.value as string[])).toEqual(new Set(['1','-1']));}); // v5.2: this rationally factorable quartic is now certified.
  if(i%5===2)await checked('reasoning-adversarial',i,{operation:'evaluate',expression:`constructor(${i})`},r=>expect(r.status).toBe('unsupported'));
  if(i%5===3)await checked('reasoning-adversarial',i,{operation:'equivalent',expression:`x/${i+1}`,other:`x/${i+2}`},r=>{expect(r.status).toBe('verified_exact');expect(r.value).toBe(false);});
  if(i%5===4){const n=i+1,engine=new SemanticEngine('graph2d'),objects=new Map<string,VisualCommand>();const apply=async(c:VisualCommand)=>{if(c.roboControl==='delete')objects.delete(c.objectId!);else if(!c.roboControl)objects.set(c.objectId!,c);},read=()=>({objects:[...objects.values()].map(c=>describeObject(c,'graph2d'))});
   const result=await engine.execute(`Create triangle A(${n},0), B(${n+6},0), C(${n+2},4) and draw its circumcircle and find its area`,apply,undefined,read);expect(result.status,result.message).toBe('success');expect(objects.size).toBe(2);const circle=[...objects.values()].find(c=>c.kind==='circle')!;for(const [x,y] of [[n,0],[n+6,0],[n+2,4]])expect(Math.hypot(x-circle.points[0][0],y-circle.points[0][1])).toBeCloseTo(circle.radius,7);expect(engine.snapshot().previousResult).toBe(12);measured.push({category:'reasoning-adversarial',case:i,status:result.status,elapsedMs:result.executionMs,passed:true});}
 });
});
describe('development acceptance examples (not training)',()=>{
 it('keeps thirds exact',async()=>expect((await computeMath({operation:'evaluate',expression:'1/3+1/6'})).answer).toBe('1/2'));
 it('simplifies a radical',async()=>expect((await computeMath({operation:'evaluate',expression:'sqrt(8)'})).answer).toMatch(/2\*sqrt\(2\)/));
 it('keeps exact trigonometry',async()=>expect((await computeMath({operation:'evaluate',expression:'sin(pi/6)'})).answer).toBe('1/2'));
 it('rejects the extraneous radical root',async()=>{const r=await computeMath({operation:'solve',expression:'sqrt(x+5)=x-1'});expect(r.value).toEqual(['4']);expect(r.steps.join(' ')).toContain('-1');});
 it('requests tangent point and commits verified tangent',async()=>{const e=new SemanticEngine('graph2d');await e.execute('Draw circle radius 5',async()=>{});expect((await e.execute('Draw a tangent to it',async()=>{})).status).toBe('ambiguous');const r=await e.execute('At point (3,4)',async()=>{});expect(r.status,r.message).toBe('success');expect(r.message).toMatch(/3x \+ 4y = 25/);});
 it('rejects an off-circle tangent',async()=>{const e=new SemanticEngine('graph2d');await e.execute('Draw circle radius 5',async()=>{});await e.execute('Draw a tangent to it',async()=>{});const before=e.snapshot().objects.length;expect((await e.execute('At point (1,1)',async()=>{})).status).toBe('invalid');expect(e.snapshot().objects.length).toBe(before);});
 it('separates incomplete requests',()=>{expect(kernelRequest('exact solve x=')).toBeTruthy();});
 it('rejects pathological nesting before parsing',async()=>expect((await computeMath({operation:'evaluate',expression:'('.repeat(100)+'1'+')'.repeat(100)})).status).toBe('unsupported'));
 it('rejects singular inverse',async()=>expect((await computeMath({operation:'linear',args:['inverse',[[1,2],[2,4]]]})).status).toBe('unsupported'));
 it('returns every tied mode',async()=>expect((await computeMath({operation:'statistics',args:['mode',[1,1,2,2,3]]})).value).toEqual([1,2]));
 it('rejects empty statistics',async()=>expect((await computeMath({operation:'statistics',args:['mean',[]]})).status).toBe('unsupported'));
 it('retains exact huge integer',async()=>expect((await computeMath({operation:'evaluate',expression:'9007199254740993+1'})).answer).toBe('9007199254740994'));
 it('half-even rounding is controlled',async()=>expect((await computeMath({operation:'decimal',expression:'1/8',precision:2})).answer).toBe('0.12'));
});
afterAll(()=>{mkdirSync('artifacts/ruhi-v51',{recursive:true});writeFileSync('artifacts/ruhi-v51/kernel-evaluation.json',JSON.stringify({cases:measured.length,passed:measured.filter(r=>r.passed).length,trainingUsage:'none',parameterized:true,measurements:measured},null,2));});
