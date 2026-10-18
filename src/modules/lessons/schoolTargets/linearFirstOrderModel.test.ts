import {describe,expect,it} from 'vitest';
import {lfoSolution as y,lfoDerivative as dy,lfoMu,lfoTerms,lfoResidual,lfoRK4,lfoPractice} from './linearFirstOrderModel';
const derivative=(f:(x:number)=>number,x:number)=>(f(x+1e-5)-f(x-1e-5))/2e-5;
describe('integrating-factor pipeline',()=>{
 it('verifies the whole family, transformed terms and product derivative independently',()=>{
  for(const c of [-1,0,2/3,3])for(const x of [-2,-.5,0,.7,2]){
   expect(derivative(t=>y(t,c),x)).toBeCloseTo(dy(x,c),5);
   expect(lfoResidual(x,c)).toBeCloseTo(0,10);
   const [a,b,rhs]=lfoTerms(x,c);expect(a+b).toBeCloseTo(rhs,9);
   expect(derivative(t=>lfoMu(t)*y(t,c),x)).toBeCloseTo(Math.exp(3*x),5);
   expect(lfoMu(x)*y(x,c)).toBeCloseTo(Math.exp(3*x)/3+c,9);
  }
  expect(y(0)).toBeCloseTo(1,12);expect(dy(0)).toBeCloseTo(-1,12);expect(dy(Math.log(4)/3)).toBeCloseTo(0,12);
 });
 it('RK4 agrees in both directions and improves with step refinement',()=>{
  for(const x of [-2,-.73,0,.81,2])expect(lfoRK4(x)).toBeCloseTo(y(x),5);
  expect(Math.abs(lfoRK4(2,.05)-y(2))).toBeLessThan(Math.abs(lfoRK4(2,.2)-y(2)));
  expect(()=>lfoRK4(1,0)).toThrow();
 });
 it('practice answers satisfy each ODE and the initial condition',()=>{
  for(const x of [.2,.7,1.4]){
   expect(derivative(t=>lfoPractice[0](t,2),x)-lfoPractice[0](x,2)).toBeCloseTo(Math.cos(x),7);
   expect(derivative(lfoPractice[1],x)+3*lfoPractice[1](x)).toBeCloseTo(x*Math.exp(2*x),7);
   expect(derivative(t=>lfoPractice[2](t,3),x)-lfoPractice[2](x,3)/x).toBeCloseTo(x*x,7);
  }
  expect(lfoPractice[1](0)).toBeCloseTo(2,12);
 });
});
