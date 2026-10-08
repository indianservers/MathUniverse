import {test,expect,describe} from 'vitest';
import {computeMath} from './kernel';
import type {KernelRequest} from './types';
import {safeAst,numericValue} from './safeExpression';
describe('v5.2 CAS 150 cases',()=>{
 for(let i=1;i<=25;i++)test(`cubic ${i}`,async()=>{const r=await computeMath({operation:'solve',expression:`(x-${i})*(x-${i+1})*(x-${i+2})=0`});expect(new Set(r.value as string[])).toEqual(new Set([i,i+1,i+2].map(String)));expect(r.status).toMatch(/^verified/);});
 for(let i=1;i<=25;i++)test(`rational pole ${i}`,async()=>{const r=await computeMath({operation:'solve',expression:`(x^2-${i*i})/(x-${i})=0`});expect(r.value).toEqual([String(-i)]);expect(r.conditions.join(' ')).toContain('!= 0');});
 for(let i=1;i<=25;i++)test(`exact system ${i}`,async()=>{const r=await computeMath({operation:'system',variables:['x','y'],equations:[`x+y=${i+2}`,`2*x-y=${2*i-2}`]});expect(r.value).toMatchObject({kind:'unique',particular:[String(i),'2']});});
 for(let i=1;i<=25;i++)test(`polynomial divide ${i}`,async()=>{const r=await computeMath({operation:'polynomial',expression:`x^2-${i*i}`,other:`x-${i}`,args:['divide']});expect(r.value).toMatchObject({remainder:'0'});expect(numericValue(safeAst((r.value as {quotient:string}).quotient),{x:3})).toBe(3+i);});
 for(let i=1;i<=25;i++)test(`inequality ${i}`,async()=>{const r=await computeMath({operation:'inequality',expression:`(x-${i})/(x-${i+1})>0`});expect(r.answer).toBe(`(-∞, ${i}) ∪ (${i+1}, ∞)`);});
 const requests:(KernelRequest & {answer:string})[]=[{operation:'simplify',expression:'sqrt(x^2)',answer:'abs(x)'},{operation:'equivalent',expression:'sin²(x)+cos²(x)',other:'1',answer:'true'},{operation:'solve',expression:'abs(2*x-1)=3',answer:'x ∈ {2, -1}'},{operation:'system',equations:['x+y=2','2*x+2*y=5'],variables:['x','y'],answer:'No solutions'},{operation:'integrate',expression:'1/x',answer:'log(abs(x)) + C'}];
 for(let i=0;i<25;i++)test(`branch and calculus ${i}`,async()=>{const fixture=requests[i%requests.length];const r=await computeMath(fixture);expect(r.answer).toBe(fixture.answer);expect(r.status).toMatch(/^verified/);});
});
