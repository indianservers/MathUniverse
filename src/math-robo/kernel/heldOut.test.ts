import {describe,it,expect,afterAll} from 'vitest';
import {writeFileSync} from 'node:fs';
import {computeMath} from './kernel';
import {computeMathLocal} from './client';
import {SemanticEngine} from '../intelligence/semanticEngine';
import type {KernelRequest} from './types';
// A separately authored evaluation set. Not included in model training or corpus generation.
const exactCases:[KernelRequest,string][]=[
 [{operation:'evaluate',expression:'7/9-2/3'},'1/9'],
 [{operation:'evaluate',expression:'0.1+0.2'},'3/10'],
 [{operation:'evaluate',expression:'(2+i)*(2-i)'},'5'],
 [{operation:'evaluate',expression:'123456789012345678901234567890+10'},'123456789012345678901234567900'],
 [{operation:'evaluate',expression:'sin(-pi/6)'},'-1/2'],
 [{operation:'evaluate',expression:'cos(2*pi)'},'1'],
 [{operation:'evaluate',expression:'tan(pi/4)'},'1'],
 [{operation:'evaluate',expression:'csc(pi/6)'},'2'],
 [{operation:'evaluate',expression:'sec(pi/3)'},'2'],
 [{operation:'evaluate',expression:'cot(pi/4)'},'1'],
 [{operation:'decimal',expression:'-5/8',precision:2},'-0.62'],
 [{operation:'decimal',expression:'7/8',precision:2},'0.88'],
 [{operation:'gcd',args:['-123456','7890']},'6'],
 [{operation:'lcm',args:['-21','6']},'42'],
 [{operation:'mod',args:['-19','7']},'2'],
 [{operation:'base',args:['255',16]},'ff'],
 [{operation:'factorial',args:['10']},'3628800'],
 [{operation:'evaluate',expression:'4.2e3+8'},'4208'],
 [{operation:'evaluate',expression:'(5/7)/(10/21)'},'3/2'],
 [{operation:'evaluate',expression:'(-3)^4'},'81'],
];
const cases:{passed:boolean;elapsedMs:number;status:string}[]=[];
describe('20 separately authored exact evaluation cases',()=>{
 it.each(exactCases)('%j',async(request,answer)=>{const result=await computeMath(request);let passed=false;try{expect(result.answer).toBe(answer);expect(result.verification.passed).toBe(true);passed=true;}finally{cases.push({passed,elapsedMs:result.elapsedMs,status:result.status});}});
});
describe('20 separate domain, metamorphic, dependency and cancellation cases',()=>{
 it.each(['1/0','sqrt(-3)','tan(pi/2)','x^100000','alert(1)','x;document.cookie','1/','((1)','exp(100000)','9'.repeat(257)])('rejects %s',async expression=>expect((await computeMath({operation:'evaluate',expression})).verification.passed).toBe(false));
 it('respects an equation assumption',async()=>expect((await computeMath({operation:'solve',expression:'x^2=9',assumptions:['x > 0']})).value).toEqual(['3']));
 it('does not falsely prove a branch identity',async()=>expect((await computeMath({operation:'equivalent',expression:'sqrt(x^2)',other:'x'})).status).toBe('unverified'));
 it('numerical root does not certify a pole',async()=>expect((await computeMath({operation:'root',expression:'1/x',args:[-1,1]})).status).toBe('unsupported'));
 it('returns no real trig solution outside range',async()=>expect((await computeMath({operation:'trigSolve',expression:'cos(x)=2'})).value).toEqual([]));
 it('pre-cancelled request is not executed',async()=>{const controller=new AbortController();controller.abort();const result=await computeMathLocal({operation:'factorial',args:[1000]},controller.signal);expect(result.status).toBe('unsupported');expect(result.answer).toContain('cancelled');});
 it('circumcircle follows triangle translation',async()=>{const e=new SemanticEngine('graph2d');await e.execute('Draw triangle A(0,0), B(6,0), C(2,4)',async()=>{});expect((await e.execute('Draw its circumcircle',async()=>{})).status).toBe('success');const old=e.snapshot().objects.find(o=>o.type==='circle')!;expect((await e.execute('Move the triangle 3 units right',async()=>{})).status).toBe('success');const circle=e.snapshot().objects.find(o=>o.type==='circle')!;expect(circle.position[0]).toBeCloseTo(old.position[0]+3,8);expect(circle.command.radius).toBeCloseTo(old.command.radius,8);});
 it('under-specified tangent leaves the scene unchanged',async()=>{const e=new SemanticEngine('geometry2d');await e.execute('Draw circle radius 13',async()=>{});const before=e.snapshot().objects;expect((await e.execute('Draw a tangent to it',async()=>{})).status).toBe('ambiguous');expect(e.snapshot().objects).toEqual(before);});
 it('numeric line-plane intersection preserves coordinates',async()=>expect((await computeMath({operation:'geometry',args:['linePlane',[1,2,3],[2,0,-1],[0,0,0],[0,0,1]]})).value).toEqual([7,2,0]));
 it('all real radical solutions are filtered',async()=>expect((await computeMath({operation:'solve',expression:'sqrt(x+12)=x'})).value).toEqual(['4']));
 it('numeric covariance-like translation leaves variance unchanged',async()=>{const a=await computeMath({operation:'statistics',args:['variance',[2,9,14],true]}),b=await computeMath({operation:'statistics',args:['variance',[1002,1009,1014],true]});expect(b.value).toBeCloseTo(Number(a.value),8);});
});
afterAll(()=>writeFileSync('artifacts/ruhi-v51/held-out-results.json',JSON.stringify({trainingUsage:'none',exactCases:cases},null,2)));
