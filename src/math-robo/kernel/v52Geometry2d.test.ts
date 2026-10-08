import {test,expect,describe} from 'vitest';
import {computeMath} from './kernel';
import {linearIntersection2,orientation2} from './geometry2d';
import {SemanticEngine} from '../intelligence/semanticEngine';
import {recomputeRoboDependencies} from '../intelligence/workspaceDependencies';
import {describeObject} from '../intelligence/sceneContext';
import type {VisualCommand} from '../../offline-intelligence/commands';
describe('v5.2 2D geometry 150 cases',()=>{
 for(let i=1;i<=30;i++)test(`distinct domains ${i}`,()=>{const a={kind:'segment' as const,a:[0,0],b:[i,0]},b={kind:'line' as const,a:[2*i,-1],b:[2*i,1]};expect(linearIntersection2(a,b)).toEqual({kind:'none'});expect(linearIntersection2({...a,kind:'line'},b)).toMatchObject({kind:'point',point:[2*i,0]});expect(linearIntersection2({...a,kind:'ray'},b)).toMatchObject({kind:'point'});});
 for(let i=0;i<30;i++)test(`robust scale ${i}`,()=>{const s=10**(i*8-120);expect(orientation2([0,0],[s,0],[0,s])).toBe(1);expect(orientation2([0,0],[s,0],[s,0])).toBe(0);});
 for(let i=1;i<=30;i++)test(`triangle ${i}`,async()=>{const r=await computeMath({operation:'geometry2d',args:['triangle',[[i,0],[i+6,0],[i,8]]]});expect(r.value).toMatchObject({area:24,perimeter:24,centroid:[i+2,8/3],incenter:[i+2,2],inradius:2});expect(r.status).toBe('verified_numerical');});
 for(let i=1;i<=30;i++)test(`external tangent ${i}`,async()=>{const r=await computeMath({operation:'geometry2d',args:['tangents',[i,0],5,[i+13,0]]});const lines=(r.value as {lines:{contact:number[];normal:number[]}[]}).lines;expect(lines).toHaveLength(2);for(const t of lines){expect(Math.hypot(t.contact[0]-i,t.contact[1])).toBeCloseTo(5,10);expect(t.normal[0]*(i+13-t.contact[0])-t.normal[1]*t.contact[1]).toBeCloseTo(0,9);}});
 for(let i=1;i<=15;i++)test(`native segment ${i}`,async()=>{const engine=new SemanticEngine('geometry2d');const r=await engine.execute(`Draw a segment from (0,0) to (${i},0)`,async()=>{});expect(r.status).toBe('success');expect(engine.snapshot().objects[0].command.linearExtent).toBe('segment');});
 for(let i=1;i<=15;i++)test(`native incircle dependency ${i}`,async()=>{const engine=new SemanticEngine('geometry2d');await engine.execute(`Create triangle A(${i},0), B(${i+6},0), C(${i},8) and draw its incircle`,async()=>{});const scene=engine.snapshot(),triangle=scene.objects.find(o=>o.type==='triangle')!,circle=scene.objects.find(o=>o.type==='circle')!;expect(circle.command.roboDependency?.kind).toBe('incircle');const moved={...triangle.command,points:triangle.command.points.map(p=>[p[0]+3,p[1]+2])} as VisualCommand;Object.assign(triangle,describeObject(moved,'geometry2d'));const effects=recomputeRoboDependencies(scene);expect(effects.find(c=>c.objectId===circle.id)?.points[0]).toEqual([i+5,4]);});
});
