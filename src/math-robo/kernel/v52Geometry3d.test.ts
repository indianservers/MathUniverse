import {test,expect,describe} from 'vitest';
import {computeMath} from './kernel';
import {SemanticEngine} from '../intelligence/semanticEngine';
import {planeFromPoints3} from './geometry3d';
import {recomputeRoboDependencies} from '../intelligence/workspaceDependencies';
import {describeObject} from '../intelligence/sceneContext';
describe('v5.2 3D geometry 150 cases',()=>{
 for(let i=1;i<=30;i++)test(`line-plane ${i}`,async()=>{const r=await computeMath({operation:'geometry3d',args:['linePlane',{kind:'line',point:[i,2,3],direction:[0,0,-1]},{point:[0,0,i],normal:[0,0,1]}]});expect(r.value,r.answer).toMatchObject({kind:'point',point:[i,2,i]});});
 for(let i=1;i<=30;i++)test(`skew ${i}`,async()=>{const r=await computeMath({operation:'geometry3d',args:['lineLine',{kind:'line',point:[0,0,0],direction:[1,0,0]},{kind:'line',point:[0,0,i],direction:[0,1,0]}]});expect(r.value,r.answer).toMatchObject({kind:'skew',distance:i,closestPoints:[[0,0,0],[0,0,i]]});});
 for(let i=1;i<=30;i++)test(`plane-plane ${i}`,async()=>{const r=await computeMath({operation:'geometry3d',args:['planePlane',{point:[i,0,0],normal:[1,0,0]},{point:[0,2*i,0],normal:[0,1,0]}]});expect(r.value,r.answer).toMatchObject({kind:'line',point:[i,2*i,0],direction:[0,0,1]});});
 for(let i=1;i<=30;i++)test(`rotation ${i}`,async()=>{const r=await computeMath({operation:'geometry3d',args:['rotate',[[i,2,-3],[2,i,4]],[1,2,3],i*.13]});const points=(r.value as {points:number[][]}).points;expect(Math.hypot(...points[0].map((x,j)=>x-points[1][j]))).toBeCloseTo(Math.hypot(i-2,2-i,-7),10);});
 for(let i=1;i<=15;i++)test(`sphere section ${i}`,async()=>{const r=await computeMath({operation:'geometry3d',args:['spherePlane',{center:[i,0,0],radius:5},{point:[0,0,3],normal:[0,0,1]}]});expect(r.value,r.answer).toMatchObject({kind:'circle',center:[i,0,3],radius:4});});
 for(let i=1;i<=15;i++)test(`native plane dependencies ${i}`,async()=>{const engine=new SemanticEngine('geometry3d');for(const prompt of [`Create point A (${i},0,0)`,`Create point B (${i+6},0,0)`,`Create point C (${i},4,0)`,'Create plane P through A, B and C']){const r=await engine.execute(prompt,async()=>{});expect(r.status,r.message).toBe('success');}const scene=engine.snapshot(),plane=scene.objects.find(o=>o.type==='plane')!,a=scene.objects.find(o=>o.label==='A')!;expect(plane.command.roboDependency?.kind).toBe('plane3');Object.assign(a,describeObject({...a.command,points:[[i,0,2]]},'geometry3d'));const update=recomputeRoboDependencies(scene).find(c=>c.objectId===plane.id)!;expect(update.points[0]).toEqual([i,0,2]);expect(planeFromPoints3(update.points).normal[2]).toBeGreaterThan(0);});
});
