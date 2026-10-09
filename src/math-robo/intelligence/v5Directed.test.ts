import {afterAll,describe,expect,it} from 'vitest';
import {writeTestReport as writeFileSync} from '../testReport';
import {SemanticEngine} from './semanticEngine';
import {describeObject} from './sceneContext';
import {geometryState} from './resultVerifier';
import {addIntelligenceGeometry} from '../../offline-intelligence/geometryAdapter';
import {clipRay} from '../../offline-intelligence/directedGeometry';
import type {VisualCommand} from '../../offline-intelligence/commands';
import type {RoboMode} from './types';
import type {Construction} from '../../workspace/geometryCommandController';

function harness(mode:RoboMode){
  const engine=new SemanticEngine(mode),commands=new Map<string,VisualCommand>();
  let geometry:Construction={points:[],lines:[],circles:[],polygons:[],arcs:[],loci:[],constraints:[]};
  const read=()=>({objects:[...commands.values()].map(c=>{
    if(mode.endsWith('3d'))return describeObject(c,mode);
    const actual=geometry.points.filter(p=>p.id.startsWith(`${c.objectId}-p`)).map(p=>[(p.x-320)/40,(210-p.y)/40]);
    return describeObject({...c,points:actual,scale:1,rotation:[0,0,0]},mode);
  })});
  const apply=async(c:VisualCommand)=>{if(c.roboControl==='select'||c.roboControl==='deselect')return;
    if(!mode.endsWith('3d'))geometry=addIntelligenceGeometry(geometry,c);
    if(c.roboControl==='delete')commands.delete(c.objectId!);else commands.set(c.objectId!,structuredClone(c));
  };
  return {engine,commands,read,geometry:()=>geometry,ask:(text:string)=>engine.execute(text,apply,undefined,read)};
}
const results:{category:string;mode:string;passed:boolean;latencyMs:number}[]=[];
const modes:RoboMode[]=['graph2d','geometry2d','graph3d','geometry3d'];
const cases=modes.flatMap(mode=>['ray','vector'].flatMap(kind=>Array.from({length:40},(_,i)=>({mode,kind,i}))));
// Deterministic property corpus: expected invariants are algebraically specified here,
// independently of parser/model/geometry-query implementations and never used for training.
describe('v5 directed geometry: 320 committed property scenarios',()=>{
  it.each(cases)('$mode $kind independent seed $i',async({mode,kind,i})=>{
    const started=performance.now(),h=harness(mode),d=mode.endsWith('3d')?3:2;
    const a=[i%7-3,Math.floor(i/7)-2,...(d===3?[i%5-2]:[])],delta=[3,4,...(d===3?[i%3+1]:[])],b=a.map((n,j)=>n+delta[j]);
    let passed=false;
    try{
      const created=await h.ask(`Draw a ${kind} from (${a}) to (${b})`);expect(created.status,created.message).toBe('success');
      let o=h.read().objects[0];expect(o.type).toBe(kind);expect(o.vertices).toEqual([a,b]);expect(o.id).toBeTruthy();
      if(d===2)expect(h.geometry().lines[0].kind).toBe(kind);
      const length=Math.sqrt(delta.reduce((sum,n)=>sum+n*n,0));
      const move=[2,-3,...(d===3?[1]:[])];expect((await h.ask(`Move it (${move})`)).status).toBe('success');
      o=h.read().objects[0];expect(o.vertices![0]).toEqual(a.map((n,j)=>n+move[j]));
      expect(Math.hypot(...o.vertices![1].map((n,j)=>n-o.vertices![0][j]))).toBeCloseTo(length,8);
      const beforeRotate=geometryState(h.engine.snapshot());
      expect((await h.ask('Rotate it 90 degrees')).status).toBe('success');
      o=h.read().objects[0];const direction=o.vertices![1].map((n,j)=>n-o.vertices![0][j]);
      expect(direction[0]).toBeCloseTo(-4,8);expect(direction[1]).toBeCloseTo(3,8);if(d===3)expect(direction[2]).toBeCloseTo(delta[2],8);
      const rotated=geometryState(h.engine.snapshot());
      expect((await h.ask('Undo')).status).toBe('success');expect(geometryState(h.engine.snapshot())).toBe(beforeRotate);
      expect((await h.ask('Redo')).status).toBe('success');expect(geometryState(h.engine.snapshot())).toBe(rotated);
      expect((await h.ask('Scale it by 2')).status).toBe('success');o=h.read().objects[0];
      expect(Math.hypot(...o.vertices![1].map((n,j)=>n-o.vertices![0][j]))).toBeCloseTo(length*2,8);
      const scaledDirection=o.vertices![1].map((n,j)=>n-o.vertices![0][j]);direction.forEach((n,j)=>expect(scaledDirection[j]).toBeCloseTo(n*2,8));
      const serialized=JSON.stringify(h.read());expect(JSON.parse(serialized).objects[0].command.kind).toBe(kind);expect(JSON.parse(serialized).objects[0].vertices).toEqual(o.vertices);
      expect((await h.ask(`Set its endpoints to (${a}) and (${b})`)).status).toBe('success');expect(h.read().objects[0].vertices).toEqual([a,b]);
      expect((await h.ask('Delete it')).status).toBe('success');expect(h.read().objects).toHaveLength(0);
      expect((await h.ask('Undo')).status).toBe('success');expect(h.read().objects[0].type).toBe(kind);
      passed=true;
    }finally{results.push({category:'directed-transform-history-serialization',mode,passed,latencyMs:performance.now()-started});}
  });
});
describe('v5 safety and domain checks',()=>{
  it.each(['Create a vec (1,1) to (4,5)','Draw a vecter (1,1) to (4,5)','Please construct a vector from (one,one) to (four,five)','Plot a vector (1,1) to (4,5)','Make a vector with tail (1,1) and head (4,5)','Sketch a vector (1,1) to (4,5)','Draw vector origin (1,1) direction (3,4)','Create a ray origin (2,2) direction (3,4)','Draw ray from (2,2) through (5,6)','creat a ray (2,2) through (5,6)'])('authored classroom language: %s',async phrase=>{
    const h=harness('geometry2d'),r=await h.ask(phrase);expect(r.status,r.message).toBe('success');const o=h.read().objects[0],direction=o.vertices![1].map((n,i)=>n-o.vertices![0][i]);expect(direction).toEqual([3,4]);
  });
  it.each(modes)('resumes a missing pair of coordinates in %s',async mode=>{
    const h=harness(mode);expect((await h.ask('Draw a vector')).status).toBe('ambiguous');expect(h.read().objects).toHaveLength(0);
    const ends=mode.endsWith('3d')?'(1,1,1) and (4,5,1)':'(1,1) and (4,5)';const r=await h.ask(ends);expect(r.status,r.message).toBe('success');expect(h.read().objects[0].type).toBe('vector');
  });
  it.each(modes)('validates an entire compound plan before mutation in %s',async mode=>{
    const h=harness(mode),ends=mode.endsWith('3d')?'(0,0,0) to (3,4,1)':'(0,0) to (3,4)';
    const r=await h.ask(`Draw vector ${ends} and scale it by -2`);expect(r.status).not.toBe('success');expect(h.read().objects).toHaveLength(0);
  });
  it.each(Array.from({length:20},(_,i)=>i+1))('circle area and rotation invariants for radius %s',async radius=>{
    // Browser-native circle endpoints are covered by the frozen browser suite;
    // here use a committed command store for exact analytic circles.
    const e=new SemanticEngine('graph2d'),map=new Map<string,VisualCommand>();
    const ask=(s:string)=>e.execute(s,async c=>{if(c.roboControl==='delete')map.delete(c.objectId!);else map.set(c.objectId!,c);},undefined,()=>({objects:[...map.values()].map(c=>describeObject(c,'graph2d'))}));
    await ask(`Draw circle radius ${radius}`);await ask('Move it 3 right and 2 up');await ask('Rotate it 90 degrees');const r=await ask('Find its area');expect(r.value).toBeCloseTo(Math.PI*radius*radius,7);expect(map.size).toBe(1);
  });
  it('retains typed IR constraints and explicit atomicity',async()=>{
    const h=harness('graph2d'),plan=h.engine.parse('Draw ray (2,2) through (5,6) and move it right 3');expect(plan.atomicity).toBe('all-or-nothing');expect(plan.ir).toHaveLength(2);expect(plan.ir![0].object.kind).toBe('ray');expect(plan.ir![0].constraints.nondegenerate).toBe(true);expect(plan.ir![1].object.references).toContain('lastReferenced');
  });
  it('rolls back actual committed objects after a later bridge failure',async()=>{
    const e=new SemanticEngine('graph2d'),map=new Map<string,VisualCommand>();let writes=0;
    const r=await e.execute('Draw vector (1,1) to (4,5) and draw ray (2,2) through (5,6)',async c=>{if(c.roboControl==='delete'){map.delete(c.objectId!);return;}map.set(c.objectId!,c);if(++writes===2)return 'Simulated bridge refusal';},undefined,()=>({objects:[...map.values()].map(c=>describeObject(c,'graph2d'))}));
    expect(r.status).toBe('invalid');expect(map.size).toBe(0);expect(e.snapshot().objects).toHaveLength(0);expect(r.message).not.toContain('Created');
  });
  it('reports incomplete rollback instead of claiming atomic success',async()=>{
    const e=new SemanticEngine('graph2d'),map=new Map<string,VisualCommand>();let writes=0;
    const r=await e.execute('Draw vector (1,1) to (4,5) and draw ray (2,2) through (5,6)',async c=>{if(c.roboControl==='delete')return 'Rollback refused';map.set(c.objectId!,c);if(++writes===2)return 'Simulated bridge refusal';},undefined,()=>({objects:[...map.values()].map(c=>describeObject(c,'graph2d'))}));
    expect(r.status).toBe('invalid');expect(r.message).toContain('could not be restored');expect(map.size).toBe(2);
  });
  it.each(modes.flatMap(mode=>['ray','vector'].map(kind=>({mode,kind}))))('rejects zero-length $kind in $mode',async({mode,kind})=>{
    const h=harness(mode),point=mode.endsWith('3d')?'1,2,3':'1,2';const r=await h.ask(`Draw ${kind} (${point}) to (${point})`);
    expect(r.status).not.toBe('success');expect(h.read().objects).toHaveLength(0);
  });
  it.each(modes)('validates atomicity against a dishonest bridge in %s',async mode=>{
    const e=new SemanticEngine(mode),point=mode.endsWith('3d')?'0,0,0':'0,0';
    const r=await e.execute(`Create point (${point})`,async()=>undefined,undefined,()=>({objects:[]}));
    expect(r.status).toBe('invalid');expect(r.message).not.toContain('Created');expect(e.snapshot().objects).toHaveLength(0);
  });
  it('ray domains exclude intersections behind the origin',async()=>{
    const h=harness('graph2d');await h.ask('Draw ray (2,2) through (5,6)');await h.ask('Draw line (0,0) to (10,0)');
    const r=await h.ask('Find the intersection');expect(r.status,r.message).toBe('success');expect(r.value).toEqual([]);
  });
  it('does not invent finite ray length or midpoint',async()=>{
    const h=harness('geometry2d');await h.ask('Draw ray (2,2) through (5,6)');
    expect((await h.ask('Find its length')).status).not.toBe('success');expect((await h.ask('Find its midpoint')).status).not.toBe('success');
  });
  it('verifies vector magnitude, components and ray parameterization',async()=>{
    const h=harness('geometry2d');await h.ask('Draw vector (1,1) to (4,5)');
    expect((await h.ask('Find its magnitude')).value).toBe(5);expect((await h.ask('Find its components')).value).toEqual([3,4]);
    await h.ask('Draw ray (2,2) through (5,6)');const r=await h.ask('Find its parameterization');expect(r.value).toBe('P(t) = (2, 2) + t (3, 4), t ≥ 0');
  });
  it.each([[-100,-100,100,100],[-3,-2,4,6],[5,6,20,30],[1000,1000,2000,2000]])('clips ray to viewport %s %s %s %s',(xmin,ymin,xmax,ymax)=>{
    const clipped=clipRay([2,2],[3,4],[xmin,ymin],[xmax,ymax]);if(!clipped)return;
    for(const p of clipped){expect(p[0]).toBeGreaterThanOrEqual(xmin-1e-8);expect(p[0]).toBeLessThanOrEqual(xmax+1e-8);expect(p[1]).toBeGreaterThanOrEqual(ymin-1e-8);expect(p[1]).toBeLessThanOrEqual(ymax+1e-8);expect((p[0]-2)*4-(p[1]-2)*3).toBeCloseTo(0,8);expect(p[0]).toBeGreaterThanOrEqual(2);}
  });
  it('does not mutate on negated drawing',async()=>{const h=harness('geometry2d');await h.ask('Do not draw a vector (1,1) to (4,5)');expect(h.read().objects).toHaveLength(0);});
  it('asks for an unspecified scale and resumes the intended operation',async()=>{const h=harness('graph3d');await h.ask('Draw vector (1,1,0) to (4,5,0)');const before=geometryState(h.engine.snapshot());expect((await h.ask('Make it bigger')).status).toBe('ambiguous');expect(geometryState(h.engine.snapshot())).toBe(before);expect((await h.ask('Twice as big')).status).toBe('success');const o=h.read().objects[0];expect(Math.hypot(...o.vertices![1].map((n,i)=>n-o.vertices![0][i]))).toBeCloseTo(10);});
});
afterAll(()=>writeFileSync('artifacts/ruhi-v5/property-results.json',JSON.stringify({total:results.length,passed:results.filter(r=>r.passed).length,results},null,2)));
