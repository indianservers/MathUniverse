import {it,expect} from 'vitest';
import {blendMeshPositions} from './meshMorph';
const a=[0,0,0,1,0,0,0,1,0],b=[0,0,2,1,0,2,0,1,2,1,0,2,1,1,2,0,1,2];
it('morphs actual mesh coordinates continuously across different topologies',()=>{const mid=blendMeshPositions(a,b,.5);expect(mid).toHaveLength(18);expect(mid[2]).toBe(1);expect(mid[11]).toBe(1);});
it('preserves both complete endpoint surfaces',()=>{expect([...blendMeshPositions(a,b,0)]).toEqual([...a,...a]);expect([...blendMeshPositions(a,b,1)]).toEqual(b);expect(a[2]).toBe(0);});
it('rejects incomplete or nonfinite triangle buffers',()=>{expect(()=>blendMeshPositions([0],b,.5)).toThrow();expect(()=>blendMeshPositions(a.map(()=>NaN),b,.5)).toThrow();});
