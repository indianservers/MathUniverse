import { describe, expect, it } from 'vitest';
import { ARSpatialIntelligence } from './arSpatialIntelligence';
const pose=(x=0)=>[1,0,0,0,0,1,0,0,0,0,1,0,x,0,-1,1];
describe('AR spatial intelligence',()=>{
 it('requires stable real hits before placement',()=>{const e=new ARSpatialIntelligence();expect(e.update(0,true,[pose()]).ready).toBe(false);expect(e.update(100,true,[pose(.01)]).ready).toBe(false);expect(e.update(200,true,[pose(.02)]).ready).toBe(true);});
 it('restarts stability after a jump',()=>{const e=new ARSpatialIntelligence();e.update(0,true,[pose()]);expect(e.update(200,true,[pose(1)]).ready).toBe(false);});
 it('blocks placement when positional tracking is lost',()=>{const e=new ARSpatialIntelligence();e.update(0,true,[pose()]);expect(e.update(200,false,[pose()])).toMatchObject({ready:false,matrix:null});expect(e.update(210,true,[pose()]).ready).toBe(false);});
 it('does not reuse stale hits',()=>{const e=new ARSpatialIntelligence();e.update(0,true,[pose()]);e.update(200,true,[pose()]);expect(e.update(300,true,[]).matrix).toBeNull();expect(e.update(310,true,[pose()]).ready).toBe(false);});
 it('offers guidance after prolonged scanning',()=>{const e=new ARSpatialIntelligence();e.update(0,true,[]);expect(e.update(9000,true,[]).message).toContain('reflective');});
 it('skips corrupt hits and accepts another valid result',()=>{const e=new ARSpatialIntelligence();expect(e.update(0,true,[Array(16).fill(NaN),pose()]).matrix).toEqual(pose());});
 it('rejects determinant-one shear transforms',()=>{const e=new ARSpatialIntelligence();const shear=pose();shear[4]=.5;expect(e.update(0,true,[shear]).matrix).toBeNull();});
 it('reset requires a new stable surface',()=>{const e=new ARSpatialIntelligence();e.update(0,true,[pose()]);e.update(200,true,[pose()]);e.reset();expect(e.update(300,true,[pose()]).ready).toBe(false);});
});
