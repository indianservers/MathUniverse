import { describe, expect, it } from 'vitest';
import { add3, sub3, dot3, cross3, norm3, project3, unit3, closestLines, pointPlane, linePlane, intersectPlanes, solveSystem, orthogonalBasis, surfaceValue, surfaceGradient, midpointIntegral, solidMeasures, sectionMeasure, conicSlice, stereographic, inverseComplex, cubeNetCorners, type V3 } from './lesson3DMath';
import { lesson3DInvestigations } from './lesson3DRegistry';
import { buildInvestigation, initialInvestigation, investigationControls } from './lesson3DModels';
import { lessonCatalog } from '../catalog/lessonCatalog';
import { schoolLessonCatalog } from '../catalog/school/schoolSyllabusCatalog';

describe('3D investigation mathematics',()=>{
  it('folds six rigid faces into a cube with exactly eight corner vertices',()=>{
    for(const fold of [0,0.25,0.5,0.75,1])for(const face of cubeNetCorners(fold))for(let i=0;i<4;i++)expect(norm3(sub3(face[i],face[(i+1)%4]))).toBeCloseTo(1.6);
    const flat=cubeNetCorners(0);expect(flat.flat().every(p=>p[2]===0)).toBe(true);
    const closed=cubeNetCorners(1),vertices=new Set(closed.flat().map(p=>p.map(x=>x.toFixed(5)).join(',')));expect(vertices.size).toBe(8);
    for(const p of closed.flat()){expect(Math.abs(p[0])).toBeCloseTo(0.8);expect(Math.abs(p[1])).toBeCloseTo(0.8);expect(Math.min(Math.abs(p[2]),Math.abs(p[2]-1.6))).toBeCloseTo(0);}
  });
  it('keeps projections and cross products perpendicular, including degeneracies',()=>{
    const u:V3=[2,-1,3],v:V3=[1,2,1],cross=cross3(u,v),projection=project3(u,v)!;
    expect(dot3(cross,u)).toBeCloseTo(0);expect(dot3(cross,v)).toBeCloseTo(0);
    expect(dot3(sub3(u,projection),v)).toBeCloseTo(0);
    expect(cross3(v,u)).toEqual(cross.map(x=>-x));
    expect(unit3([0,0,0])).toBeNull();expect(project3(u,[0,0,0])).toBeNull();
  });
  it('finds the common perpendicular for non-axis-aligned skew lines',()=>{
    const a:V3=[1,-1,0],u:V3=[2,1,1],b:V3=[0,2,3],v:V3=[-1,2,1],result=closestLines(a,u,b,v)!;
    expect(dot3(sub3(result.q,result.p),u)).toBeCloseTo(0);expect(dot3(sub3(result.q,result.p),v)).toBeCloseTo(0);
    expect(result.distance).toBeCloseTo(norm3(sub3(result.q,result.p)));
    expect(closestLines([0,0,0],[1,0,0],[0,1,1],[0,1,0])?.distance).toBeCloseTo(1);
    expect(closestLines([0,0,0],[1,0,0],[0,2,0],[2,0,0])?.kind).toBe('Parallel');
    expect(closestLines([0,0,0],[1,0,0],[2,0,0],[2,0,0])?.kind).toBe('Coincident');
    expect(closestLines([0,0,0],[1,0,0],[0,0,0],[0,1,0])?.kind).toBe('Intersecting');
    expect(closestLines(a,[0,0,0],b,v)).toBeNull();
  });
  it('satisfies line and plane constraints without inventing zero-normal planes',()=>{
    const n:V3=[2,1,-1],m:V3=[1,-1,2],result=intersectPlanes(n,3,m,2)!;
    expect(dot3(n,result.point)).toBeCloseTo(3);expect(dot3(m,result.point)).toBeCloseTo(2);
    expect(dot3(n,result.direction)).toBeCloseTo(0);expect(dot3(m,result.direction)).toBeCloseTo(0);
    const foot=pointPlane([1,2,3],n,3)!;expect(dot3(n,foot.foot)).toBeCloseTo(3);
    expect(linePlane([0,0,0],[1,0,0],[0,0,1],1)?.kind).toBe('Parallel');
    expect(linePlane([0,0,1],[1,0,0],[0,0,1],1)?.kind).toBe('Contained');
    expect(pointPlane([1,2,3],[0,0,0],1)).toBeNull();
  });
  it('distinguishes singular consistent systems from inconsistent systems',()=>{
    const columns:[V3,V3,V3]=[[1,0,1],[0,1,1],[0,0,0]];
    expect(solveSystem(columns,[1,1,2]).kind).toBe('Infinitely many solutions');
    expect(solveSystem(columns,[1,1,3]).kind).toBe('No solution');
    expect(solveSystem([[2,0,0],[0,3,0],[0,0,4]],[4,6,8]).point).toEqual([2,2,2]);
    expect(orthogonalBasis([[1,1,0],[2,2,0],[0,0,1]])).toHaveLength(2);
    const basis=orthogonalBasis([[1,1,1],[1,0,1],[0,1,1]]);for(let i=0;i<basis.length;i++){expect(norm3(basis[i])).toBeCloseTo(1);for(let j=0;j<i;j++)expect(dot3(basis[i],basis[j])).toBeCloseTo(0);}
  });
  it('matches analytic surface derivatives and improves volume estimates with refinement',()=>{
    for(const surface of ['bowl','saddle','wave','positive'] as const){const x=0.7,y=-0.4,h=1e-5,[dx,dy]=surfaceGradient(surface,x,y);expect((surfaceValue(surface,x+h,y)-surfaceValue(surface,x-h,y))/(2*h)).toBeCloseTo(dx,5);expect((surfaceValue(surface,x,y+h)-surfaceValue(surface,x,y-h))/(2*h)).toBeCloseTo(dy,5);}
    const coarse=midpointIntegral(2,2),fine=midpointIntegral(2,12);expect(fine.exact).toBeCloseTo(28.8);expect(Math.abs(fine.sum-fine.exact)).toBeLessThan(Math.abs(coarse.sum-coarse.exact));
  });
  it('uses correct solid measures and horizontal sections',()=>{
    expect(solidMeasures('cone',2,3).volume).toBeCloseTo(4*Math.PI);
    expect(solidMeasures('hemisphere',2,9).area).toBeCloseTo(12*Math.PI);
    expect(solidMeasures('frustum',2,3).volume).toBeCloseTo(7*Math.PI);
    expect(solidMeasures('cube',2,99).volume).toBe(64);
    expect(sectionMeasure('sphere',2,9,0.5).area).toBeCloseTo(4*Math.PI);
    expect(sectionMeasure('sphere',2,9,1).area).toBeCloseTo(0);
    expect(sectionMeasure('cone',2,3,0.5).area).toBeCloseTo(Math.PI);
  });
  it('puts every conic sample on both the cone and cutting plane',()=>{
    for(const slope of [0,0.4,1,1.8])for(const path of conicSlice(slope,0.7))for(const [x,y,z] of path){expect(x*x+y*y).toBeCloseTo(z*z,5);expect(z).toBeCloseTo(0.7+slope*x,5);}
  });
  it('maps finite complex numbers to the sphere and handles inversion at zero',()=>{
    expect(norm3(stereographic([3,-2]))).toBeCloseTo(1);expect(stereographic([0,0])).toEqual([0,0,-1]);expect(inverseComplex([0,0])).toBeNull();expect(inverseComplex([1,1])).toEqual([0.5,-0.5]);
  });
});
describe('lesson-specific rollout',()=>{
  it('covers exactly the 94 primary and 26 extension lessons with valid catalog IDs',()=>{
    expect(lesson3DInvestigations).toHaveLength(120);expect(new Set(lesson3DInvestigations.map(c=>c.id)).size).toBe(120);
    expect(lesson3DInvestigations.filter(c=>!c.extension)).toHaveLength(94);
    const ids=new Set([...lessonCatalog.map(c=>c.id),...schoolLessonCatalog.map(c=>c.numericId)]);
    for(const config of lesson3DInvestigations){expect(ids.has(config.id),`lesson ${config.id} exists`).toBe(true);expect(config.question.length).toBeGreaterThan(30);}
  });
  it.each([0,1,2])('creates finite models and valid default controls for rollout batch %i',batch=>{
    for(const config of lesson3DInvestigations.slice(batch*50,(batch+1)*50)){
      const state=initialInvestigation(config),model=buildInvestigation(config,state);
      for(const control of investigationControls(config)){expect(state[control.key],`${config.id} ${control.key}`).toBeGreaterThanOrEqual(control.min);expect(state[control.key],`${config.id} ${control.key}`).toBeLessThanOrEqual(control.max);}
      expect(model.readouts.length,`${config.id} readouts`).toBeGreaterThan(0);
      expect(JSON.stringify(model),`${config.id} finite model`).not.toMatch(/NaN|Infinity|null/);
      expect(model.segments.length+model.arrows.length+model.bodies.length+model.planes.length+model.patches.length+model.boxes.length+model.markers.length+(model.net!==undefined?1:0)+(model.torus?1:0),`${config.id} scene content`).toBeGreaterThan(0);
      expect(new Set(model.readouts.map(r=>r[0])).size,`${config.id} distinct result labels`).toBe(model.readouts.length);
    }
  });
  it('does not produce non-finite geometry at zero vectors or singular parameters',()=>{
    for(const config of lesson3DInvestigations.filter(c=>['vector','geometry','matrix'].includes(c.family))){const model=buildInvestigation(config,{...initialInvestigation(config),a:[0,0,0],b:[0,0,0],k:0});expect(JSON.stringify(model),`zero case ${config.id}`).not.toMatch(/NaN|Infinity|null/);}
  });
  it('demonstrates matrix composition with equal numerical results',()=>{
    const config=lesson3DInvestigations.find(c=>c.id===350)!;const model=buildInvestigation(config,{...initialInvestigation(config),a:[1,2,0],b:[0,1,1],l:1.7});expect(model.readouts.find(r=>r[0]==='A(Bv)')?.[1]).toBe(model.readouts.find(r=>r[0]==='(AB)v')?.[1]);
  });
  it('reverses cross-product direction without changing area',()=>{
    const config=lesson3DInvestigations.find(c=>c.id===191)!,state=initialInvestigation(config),before=buildInvestigation(config,state),after=buildInvestigation(config,{...state,a:state.b,b:state.a});expect(before.readouts.find(r=>r[0]==='Parallelogram area')?.[1]).toBe(after.readouts.find(r=>r[0]==='Parallelogram area')?.[1]);expect(add3(cross3(state.a,state.b),cross3(state.b,state.a))).toEqual([0,0,0]);
  });
});
