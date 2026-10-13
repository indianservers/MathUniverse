import { describe, it, expect } from 'vitest';
import { orderClosure } from './posetOrder';
import { meetJoin, posetProperties, coverRelations } from './algebraicStructuresEngine';
describe('Hasse order calculations',()=>{
 it('includes transitive bounds in a diamond',()=>{const elements=['0','a','b','1'];const closure=orderClosure(elements,[['0','a'],['0','b'],['a','1'],['b','1']]);expect(closure).toContainEqual(['0','1']);expect(meetJoin(elements,closure,'0','1')).toMatchObject({meet:'0',join:'1'});expect(meetJoin(elements,closure,'a','b')).toMatchObject({meet:'0',join:'1'});expect(coverRelations(elements,closure)).toHaveLength(4);});
 it('detects a poset with no unique join',()=>{const elements=['a','b','c','d'];const closure=orderClosure(elements,[['a','c'],['a','d'],['b','c'],['b','d']]);expect(meetJoin(elements,closure,'a','b').join).toBeNull();expect(posetProperties(elements,closure)).toMatchObject({partialOrder:true,lattice:false,bounded:false});});
 it('handles a longer chain independently of edge order',()=>{const elements=['0','a','b','1'];const closure=orderClosure(elements,[['b','1'],['a','b'],['0','a']]);expect(meetJoin(elements,closure,'0','1')).toMatchObject({meet:'0',join:'1'});expect(coverRelations(elements,closure)).toHaveLength(3);});
 it('detects cycles instead of treating them as partial orders',()=>{const elements=['a','b','c'];const closure=orderClosure(elements,[['a','b'],['b','c'],['c','a']]);expect(posetProperties(elements,closure).partialOrder).toBe(false);});
});
