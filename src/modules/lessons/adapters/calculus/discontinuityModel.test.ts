import{describe,it,expect}from'vitest';import{discontinuityValue as value}from'./discontinuityModel';
describe('Discontinuity graph models',()=>{
 it('separates a removable hole from its defined value',()=>{expect(value('removable',0)).toBe(3);expect(value('removable',-.01)).toBeCloseTo(2.000025,10);expect(value('removable',.01)).toBe(value('removable',-.01));});
 it('has unequal finite one-sided limits at a jump',()=>{expect(value('jump',0)).toBe(2);expect(value('jump',-.001)).toBeCloseTo(2,5);expect(value('jump',.001)).toBeCloseTo(-1,3);});
 it('grows without bound from both sides of the vertical asymptote',()=>{expect(value('infinite',0)).toBeNull();expect(value('infinite',-.5)).toBe(4);expect(value('infinite',.1)).toBeCloseTo(100,10);expect(value('infinite',-.1)).toBe(value('infinite',.1));});
});
