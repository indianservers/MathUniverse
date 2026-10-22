import{describe,it,expect}from'vitest';
import{oppositeCyclicModel as model,defaultCyclicPositions as defaults,moveCyclicVertex as move,cyclicNames,cyclicChallengePositions}from'./oppositeCyclicModel';
describe('opposite cyclic angles',()=>{
 it('independently computes reference angles and actual intercepted arcs',()=>{const m=model(defaults);[112,74,68,106].forEach((v,i)=>expect(m.angles[cyclicNames[i]]).toBeCloseTo(v,10));expect(m.intercepted).toEqual({BCD:224,CDA:148,DAB:136,ABC:212});expect(m.gaps).toEqual([80,132,92,56]);});
 it('keeps 1444 drag requests simple, distinct, on-circle and supplementary',()=>{for(const n of cyclicNames)for(let a=0;a<=360;a++){const p=move(defaults,n,a),m=model(p);expect(m.gaps.every(g=>g>=7.999)).toBe(true);expect(m.sums.AC).toBeCloseTo(180,8);expect(m.sums.BD).toBeCloseTo(180,8);for(const q of Object.values(m.points))expect(Math.hypot(q.x,q.y)).toBeCloseTo(1,12);expect(m.intercepted.BCD).toBeCloseTo(2*m.angles.A,8);}});
 it('sets actual challenge diagram and rejects crossed vertices',()=>{for(let a=60;a<=120;a++){const m=model(cyclicChallengePositions(a));expect(m.angles.A).toBeCloseTo(a,9);expect(m.angles.C).toBeCloseTo(180-a,9);}expect(()=>model({...defaults,B:200})).toThrow();expect(move(defaults,'A',NaN)).toEqual(defaults);});
});
