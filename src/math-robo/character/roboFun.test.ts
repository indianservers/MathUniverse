import {describe,it,expect} from 'vitest';
import {landingPoint} from './funTargets';
import {jumpArc} from './useRoboPosition';
import {sampleAction} from './engine';
describe('Ruhi adventures',()=>{
 it('chooses a landing point inside the target and reachable viewport',()=>{expect(landingPoint({left:100,right:220,top:250,bottom:290},1280,720)).toEqual({x:160,y:270});expect(landingPoint({left:0,right:40,top:0,bottom:30},1280,720)).toBeUndefined();expect(landingPoint({left:0,right:100,top:60,bottom:100},390,844,64,74)).toEqual({x:50,y:80});});
 it('keeps an entire jump in bounds with no artificial displacement in its joint pose',()=>{expect(jumpArc(0,400)).toBe(0);expect(jumpArc(1,400)).toBeCloseTo(0);expect(jumpArc(.5,400)).toBe(83);expect(jumpArc(.5,2000)).toBe(100);expect(sampleAction('jump',.5,{inPlace:true}).y).toBe(0);expect(sampleAction('jump',.5,{}).y).toBeLessThan(0);});
});
