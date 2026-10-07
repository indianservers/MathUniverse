import { describe, expect, it } from 'vitest';
import { angleLabel, evaluateIdentity, exactValue, identities, parseNumeric, rad, searchIdentities, unitText, validateRule } from './identityMath';

describe('identities mathematical contracts',()=>{
  it('has 40 distinct searchable identities including the 15 additions',()=>{
    expect(identities).toHaveLength(40);expect(new Set(identities.map(i=>i.id)).size).toBe(40);
    expect(identities.filter(i=>['Complementary','Negative Angles','Triple Angle','Sum-Product'].includes(i.family))).toHaveLength(15);
  });
  it('agrees across quadrants, negative angles and multiple turns on every common domain',()=>{
    for(const item of identities) for(const theta of [-350,-135,-30,0,15,30,45,60,89,90,135,180,270,359,360,450,540,720]) for(const phi of [-90,0,17,30,45,90,135]){
      const r=evaluateIdentity(item,theta,phi);
      if(r.comparable)expect(r.matches,`${item.id} at ${theta}, ${phi}: ${r.lhs} vs ${r.rhs}`).toBe(true);
    }
  });
  it('distinguishes tangent LHS domain from its rewritten RHS',()=>{
    const item=identities.find(i=>i.id==='double-tan')!;
    const ninety=evaluateIdentity(item,90,0);expect(ninety.lhs).toBeCloseTo(0);expect(ninety.rhs).toBeNaN();expect(ninety.error).toBeNull();
    const fortyFive=evaluateIdentity(item,45,0);expect(fortyFive.lhs).toBeNaN();expect(fortyFive.rhs).toBeNaN();expect(fortyFive.error).toBeNull();
  });
  it('keeps reciprocal and half-angle exclusions explicit',()=>{
    expect(evaluateIdentity(identities.find(i=>i.id==='secant')!,90,0).comparable).toBe(false);
    expect(evaluateIdentity(identities.find(i=>i.id==='cosecant')!,180,0).comparable).toBe(false);
    const half=identities.find(i=>i.id==='half-tan-reciprocal')!;
    expect(evaluateIdentity(half,0,0).lhs).toBe(0);expect(evaluateIdentity(half,0,0).rhs).toBeNaN();
    expect(evaluateIdentity(identities.find(i=>i.id==='half-cos')!,270,0).rhs).toBeLessThan(0);
    expect(evaluateIdentity(identities.find(i=>i.id==='secant')!,89.9999,0).matches).toBe(true);
    expect(evaluateIdentity(identities.find(i=>i.id==='cosecant')!,0.0001,0).matches).toBe(true);
  });
  it('never turns an approximate nearby value into an exact constant',()=>{
    expect(exactValue(Math.cos(rad(1)),[1])).toBeNull();
    expect(exactValue(1.0003,[0])).toBeNull();
    expect(exactValue(Math.SQRT1_2,[45])).toBe('√2/2');
    expect(exactValue(0.00008,[1])).toBeNull();
  });
  it('parses equivalent fractions and radicals without evaluating code',()=>{
    expect(parseNumeric('sqrt(3)/2')).toBeCloseTo(Math.sqrt(3)/2);
    expect(parseNumeric('−√2/2')).toBeCloseTo(-Math.SQRT1_2);
    expect(parseNumeric('(√6−√2)/4')).toBeCloseTo((Math.sqrt(6)-Math.sqrt(2))/4);
    expect(parseNumeric('pi/4')).toBeCloseTo(Math.PI/4);
    for(const bad of ['','1/0','alert(1)','Math.sin(1)','1foo','sqrt(-1)','1)'])expect(Number.isFinite(parseNumeric(bad))).toBe(false);
  });
  it('rejects unjustified operations and requires nonzero assumptions before division',()=>{
    const item=identities.find(i=>i.id==='secant')!;
    expect(validateRule(item,1,'Divide by zero',true).ok).toBe(false);
    expect(validateRule(item,1,'Divide by cos²θ',false).ok).toBe(false);
    expect(validateRule(item,1,'Divide by cos²θ',true).ok).toBe(true);
  });
  it('formats the same angle in degrees and radians without losing multiple turns',()=>{
    expect(angleLabel(45,'rad')).toBe('π/4 rad');expect(angleLabel(360,'rad')).toBe('2π rad');
    expect(angleLabel(-90,'rad')).toBe('−π/2 rad');expect(angleLabel(720,'deg')).toBe('720°');
  });
  it('searches by keyboard notation and converts domain text to the selected unit',()=>{
    expect(searchIdentities('sin^2 theta + cos^2 theta')[0].id).toBe('pythagorean');
    expect(searchIdentities('secant')[0].id).toBe('secant');
    expect(searchIdentities('sin2')[0].id).toBe('double-sin');
    expect(unitText('θ ≠ 90° + 180°k','rad')).toBe('θ ≠ π/2 + πk');
  });
});
