import { describe,it,expect } from 'vitest';
import { compareAnswers, expressionMasks, membership, relationships, resultFor, ruleModel, scenarios, weakestConcept, changeExplanation } from './vennLearningEngine';
describe('Venn learning mathematics',()=>{
 it('evaluates nested Boolean expressions and rejects executable or malformed inputs',()=>{expect(expressionMasks('(A ∪ B) − C')).toEqual([1,2,3]);expect(expressionMasks('A △ B')).toEqual([1,2,5,6]);expect(expressionMasks('∅')).toEqual([]);for(const bad of ['alert(1)','A ∪','(A','A B',''])expect(()=>expressionMasks(bad)).toThrow();});
 it('proves both De Morgan identities across all membership patterns',()=>{expect(expressionMasks('(A ∪ B)ᶜ')).toEqual(expressionMasks('Aᶜ ∩ Bᶜ'));expect(expressionMasks('(A ∩ B)ᶜ')).toEqual(expressionMasks('Aᶜ ∪ Bᶜ'));});
 it('generates numerical rules and checks answers without ordering assumptions',()=>{const s=ruleModel(['1','2','3','4','5','6'],['even','prime','x mod 3 = 0']);expect(s.setA).toEqual(['2','4','6']);expect(resultFor(s,'A ∩ B')).toEqual(['2']);expect(compareAnswers(['2','3'],['3','2']).correct).toBe(true);expect(compareAnswers(['2','3'],['2','4'])).toEqual({correct:false,missing:['3'],extra:['4']});});
 it('distinguishes proper subset, equality and disjointness including empty sets',()=>{expect(relationships([],['a']).properSubset).toBe(true);expect(relationships(['a'],['a']).properSubset).toBe(false);expect(relationships([],[]).equal).toBe(true);expect(relationships(['a'],['b']).disjoint).toBe(true);});
 it('uses actual scenario memberships for shared objects and explanations',()=>{const shape=scenarios.find(s=>s.title==='Shape cards')!;expect(membership(shape.model,'🔴')).toBe(7);expect(changeExplanation({...shape.model,setA:[]},shape.model)).toContain('🔴: entered A');});
 it('recommends concepts with less evidence of understanding',()=>{expect(weakestConcept({Membership:{attempts:3,correct:3}}).title).toBe('Union');});
});
