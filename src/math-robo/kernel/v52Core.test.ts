import {describe,test,expect} from 'vitest';
import {computeMath} from './kernel';
import {safeAst,expressionText} from './safeExpression';
import {domainConditions} from './domains';
describe('v5.2 kernel 150 cases',()=>{
 for(let i=0;i<30;i++)test(`exact fraction ${i}`,async()=>{const r=await computeMath({operation:'evaluate',expression:`${i}/3+${i}/6`});expect(r.answer).toBe(i%2?`${i}/2`:String(i/2));expect(r.status).toBe('verified_exact');});
 for(let i=0;i<30;i++)test(`notation ${i}`,async()=>{const r=await computeMath({operation:'evaluate',expression:`\\frac{${i}}{2}+√(4)`});expect(r.answer).toBe(i%2?`${i+4}/2`:String(i/2+2));expect(expressionText(safeAst('sin²(x)'))).toContain('sin(x)');});
 for(let i=0;i<30;i++)test(`function substitution ${i}`,async()=>{const r=await computeMath({operation:'substitute',expression:'x²+3x+2',values:{x:String(i)}});expect(r.answer).toBe(String(i*i+3*i+2));expect(r.operation).toBe('substitute');});
 for(let i=0;i<30;i++)test(`domain ${i}`,()=>{expect(domainConditions(safeAst(`log(x)+1/(x-${i})+sqrt(x)`))).toEqual(expect.arrayContaining(['x > 0','x >= 0',`(x-${i}) != 0`]));});
 const invalid=['process.exit()','√(','1/0','0^0','x'.repeat(2050),'sin()'];for(let i=0;i<30;i++)test(`invalid ${i}`,async()=>{const r=await computeMath({operation:'numeric',expression:invalid[i%invalid.length]});expect(r.status).toBe('unsupported');});
});
