import{describe,it,expect}from'vitest';import{arcAngleModel as model,arcPositionFromAngle as infer}from'./arcAngleModel';
describe('fixed arc and central/inscribed angle',()=>{
 it('retains actual118.4/59.2 and120/60 examples',()=>{const m=model(.5);expect(m.c.x).toBeCloseTo(0,12);expect(m.c.y).toBeCloseTo(1,12);expect(m.central).toBeCloseTo(118.4,10);expect(m.inscribed).toBeCloseTo(59.2,10);expect(model(.5,120).inscribed).toBeCloseTo(60,10);});
 it('checks15015 position/arc pairs for circle incidence and independent angle invariant',()=>{for(let arc=30;arc<=170;arc+=10)for(let i=0;i<=1000;i++){const p=.04+.92*i/1000,m=model(p,arc);expect(Math.hypot(m.c.x,m.c.y)).toBeCloseTo(1,12);expect(m.central).toBeCloseTo(arc,9);expect(m.inscribed).toBeCloseTo(arc/2,9);expect(m.ratio).toBeCloseTo(2,9);expect(m.valid).toBe(true);}});
 it('inverts major-arc points and constrains pointer projection away from endpoints',()=>{for(let i=4;i<=96;i++){const p=i/100,m=model(p);expect(infer(m.cAngle)).toBeCloseTo(p,6);}expect(infer(329.2)).toBe(.04);expect(infer(210.8)).toBe(.96);expect(infer(250)).toBe(.96);for(const p of[0,1,NaN])expect(()=>model(p)).toThrow();});
});
