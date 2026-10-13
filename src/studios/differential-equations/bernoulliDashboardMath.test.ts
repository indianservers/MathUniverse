import {describe,it,expect} from 'vitest';
import {bernoulliCurve,defaultBernoulliValue} from './bernoulliDashboardMath';
const base={p:'2*x',q:'x',n:2,x0:0,y0:1};
describe('Bernoulli transformed solver',()=>{
 for(const n of [0,1,2,3,4,5])it(`agrees with the exact solution for n=${n}`,()=>{const points=bernoulliCurve({...base,n});for(const p of points.filter((_,i)=>i%70===0))expect(p.y).toBeCloseTo(defaultBernoulliValue(n,p.x),6);expect(points.find(p=>p.x===0)?.y).toBe(1);});
 it('preserves the negative branch for odd exponents',()=>{const points=bernoulliCurve({...base,q:'0',n:3,y0:-1},-1,1);expect(points.every(p=>p.y<0)).toBe(true);for(const p of points.filter((_,i)=>i%50===0))expect(p.y).toBeCloseTo(-Math.exp(-p.x*p.x),6);});
 it('stops at a pole instead of continuing across it',()=>{const points=bernoulliCurve({...base,p:'0',q:'1'},0,2);expect(points.every(p=>p.x<1&&p.y>0)).toBe(true);});
 it('handles zero initial conditions without a negative power substitution',()=>{expect(bernoulliCurve({...base,y0:0}).every(p=>p.y===0)).toBe(true);expect(bernoulliCurve({...base,n:0,y0:0}).some(p=>Math.abs(p.y)>.1)).toBe(true);});
 it('accepts a nonzero initial x',()=>{const points=bernoulliCurve({...base,p:'1',q:'0',x0:1,y0:2},0,2);for(const p of points.filter((_,i)=>i%50===0))expect(p.y).toBeCloseTo(2*Math.exp(-(p.x-1)),6);});
 it('rejects invalid coefficients and a singular initial point',()=>{expect(()=>bernoulliCurve({...base,p:'bad(x)'})).toThrow();expect(()=>bernoulliCurve({...base,p:'1/x'})).toThrow();});
});
