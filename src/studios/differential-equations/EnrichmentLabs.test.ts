import {describe,it,expect} from 'vitest';
import {delayedForcing,pdeMode} from './EnrichmentLabs';
describe('transform and PDE families',()=>{
it('keeps initial value, onset continuity and the forced limit',()=>{expect(delayedForcing(0,2,6,1,4)).toBe(4);expect(delayedForcing(1-1e-8,2,6,1,4)).toBeCloseTo(delayedForcing(1+1e-8,2,6,1,4),6);expect(delayedForcing(100,2,6,1,4)).toBeCloseTo(3,8);});
it('satisfies boundaries and heat-mode decay',()=>{expect(pdeMode(0,1,Math.PI,1,2,1)).toBe(0);expect(pdeMode(Math.PI,1,Math.PI,1,2,1)).toBeCloseTo(0,10);expect(pdeMode(Math.PI/2,1,Math.PI,1,2,1)).toBeCloseTo(Math.exp(-2),10);expect(pdeMode(Math.PI/2,Math.PI,Math.PI,1,1,1,true)).toBeCloseTo(-1,10);});
});
