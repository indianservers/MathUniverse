import {describe,it,expect} from 'vitest';
import {SemanticEngine} from './semanticEngine';
import {describeObject} from './sceneContext';
import type {VisualCommand} from '../../offline-intelligence/commands';
import type {RoboMode} from './types';
function native(mode:RoboMode){const engine=new SemanticEngine(mode),objects=new Map<string,VisualCommand>();return {engine,ask:(phrase:string)=>engine.execute(phrase,async c=>{if(c.roboControl==='delete')objects.delete(c.objectId!);else if(!c.roboControl)objects.set(c.objectId!,structuredClone(c));},undefined,()=>({objects:[...objects.values()].map(c=>describeObject(c,mode))}))};}
describe('v5 separate 3D suite: axes, planes and non-XY geometry',()=>{
  const rotations=(['graph3d','geometry3d'] as RoboMode[]).flatMap(mode=>['ray','vector'].flatMap(kind=>['x','y','z'].flatMap(axis=>[90,180].map(angle=>({mode,kind,axis,angle})))));
  it.each(rotations)('$mode $kind rotation $angle about $axis',async({mode,kind,axis,angle})=>{
    const h=native(mode);await h.ask(`Draw ${kind} (1,2,3) to (3,5,7)`);const r=await h.ask(`Rotate it ${angle} degrees about the ${axis}-axis`);expect(r.status,r.message).toBe('success');
    const o=h.engine.snapshot().objects[0],a=o.vertices![0],b=o.vertices![1],actual=b.map((n,i)=>n-a[i]);
    const expected=angle===180?axis==='x'?[2,-3,-4]:axis==='y'?[-2,3,-4]:[-2,-3,4]:axis==='x'?[2,-4,3]:axis==='y'?[4,3,-2]:[-3,2,4];actual.forEach((n,i)=>expect(n).toBeCloseTo(expected[i],8));expect(Math.hypot(...actual)).toBeCloseTo(Math.sqrt(29),8);
  });
  const reflections=(['graph3d','geometry3d'] as RoboMode[]).flatMap(mode=>['ray','vector'].flatMap(kind=>['xy','xz','yz'].map(plane=>({mode,kind,plane}))));
  it.each(reflections)('$mode $kind reflection through $plane',async({mode,kind,plane})=>{
    const h=native(mode);await h.ask(`Draw ${kind} (1,2,3) to (3,5,7)`);const r=await h.ask(`Reflect it across the ${plane}-plane`);expect(r.status,r.message).toBe('success');const o=h.engine.snapshot().objects[0];expect(o.vertices).toHaveLength(2);const flip=plane==='xy'?2:plane==='xz'?1:0;[[1,2,3],[3,5,7]].forEach((p,i)=>p.forEach((n,j)=>expect(o.vertices![i][j]).toBeCloseTo(j===flip?-n:n,8)));
  });
  it.each(['graph3d','geometry3d'] as RoboMode[])('accepts a valid YZ-plane triangle in %s',async mode=>{const h=native(mode),r=await h.ask('Draw triangle (0,0,0), (0,3,0), (0,0,4)');expect(r.status,r.message).toBe('success');expect((await h.ask('Find its area')).value).toBe(6);});
  // v5.2 certifies the empty intersection of skew 3D supporting lines.
  it.each(['graph3d','geometry3d'] as RoboMode[])('finds no intersection of skew 3D objects without a 2D projection in %s',async mode=>{const h=native(mode);await h.ask('Draw ray (0,0,0) to (3,4,1)');await h.ask('Draw line (1,1,2) to (2,3,4)');const before=JSON.stringify(h.engine.snapshot().objects),r=await h.ask('Find the intersection');expect(r.status,r.message).toBe('success');expect(r.value).toEqual([]);expect(JSON.stringify(h.engine.snapshot().objects)).toBe(before);});
});
