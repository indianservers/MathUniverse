import {describe,it,expect} from 'vitest';
import * as s from './statisticsCore';
describe('statistical reference calculations',()=>{
  it('uses correct critical values at every confidence level',()=>{expect(s.normalQuantile(.9)).toBeCloseTo(1.2815516,6);expect(s.normalQuantile(.95)).toBeCloseTo(1.6448536,6);expect(s.studentQuantile(.975,9)).toBeCloseTo(2.262157,5);});
  it('calculates distinct distributions, tails and inclusive discrete bounds',()=>{const p={mu:0,sigma:1,n:10,prob:.5,lambda:2,df:4};expect(s.distribution('Normal',p).probability(-1,1)).toBeCloseTo(.68268949,7);expect(s.distribution('Binomial',p).probability(5,5)).toBeCloseTo(.24609375,8);expect(s.distribution('Poisson',p).probability(0,0)).toBeCloseTo(Math.exp(-2),8);expect(s.distribution('Exponential',p).cdf(1)).toBeCloseTo(1-Math.exp(-2),8);expect(s.distribution('Chi-square',p).cdf(4)).toBeCloseTo(1-3*Math.exp(-2),8);expect(s.distribution('t',p).cdf(0)).toBe(.5);});
  it('uses data y values and reports signed correlation',()=>{const fit=s.regression([{x:1,y:2},{x:2,y:4},{x:3,y:6}]);expect(fit.slope).toBe(2);expect(fit.r).toBe(1);expect(fit.r2).toBe(1);expect(s.regression([{x:1,y:6},{x:2,y:4},{x:3,y:2}]).r).toBe(-1);});
  it('decomposes real ANOVA sums of squares and degrees of freedom',()=>{const a=s.anova([[1,2,3],[2,3,4],[3,4,5]]);expect(a.ssBetween).toBe(6);expect(a.ssWithin).toBe(6);expect(a.f).toBe(3);expect(a.p).toBeCloseTo(.125,8);expect(s.anova([[1,2,3],[1,2,3],[1,2,3]]).f).toBe(0);});
  it('handles parsing and reproducible resampling',()=>{expect(s.parseData('1,,2 bad 3').values).toEqual([1,2,3]);expect(s.parseData('1 bad').invalid).toEqual(['bad']);expect(s.bootstrap([1,2,4,8],.95,7)).toEqual(s.bootstrap([1,2,4,8],.95,7));});
});
