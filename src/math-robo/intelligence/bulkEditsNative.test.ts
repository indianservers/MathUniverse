import {test,expect} from 'vitest';
import {SemanticEngine} from './semanticEngine';
import {geometryState} from './resultVerifier';
import {describeObject} from './sceneContext';
import {addIntelligenceGeometry,nativeGeometryCommands} from '../../offline-intelligence/geometryAdapter';
import type {Construction} from '../../workspace/geometryCommandController';
import type {VisualCommand} from '../../offline-intelligence/commands';
type Native=Pick<Construction,'points'|'lines'|'circles'|'polygons'|'loci'>;
export function nativeBulkFixture(){
 let native:Native={points:[{id:'o',label:'O',x:320,y:210},{id:'r',label:'R',x:320,y:90},{id:'q',label:'Q',x:560,y:210},{id:'s',label:'S',x:640,y:130}],circles:[{id:'c1',center:'o',edge:'r',style:{color:'#22d3ee'}},{id:'c2',center:'q',edge:'s',style:{color:'#22d3ee'}}],lines:[{id:'line',a:'o',b:'q',kind:'segment',style:{color:'#22d3ee'}}],polygons:[],loci:[]};
 const engine=new SemanticEngine('geometry2d');
 const read=()=>({objects:nativeGeometryCommands(native).map(c=>describeObject(c,'geometry2d')),selectedIds:[]});
 const apply=async(c:VisualCommand)=>{if(c.roboControl==='select'||c.roboControl==='deselect')return;native=addIntelligenceGeometry(native,c);};
 engine.sync(read().objects,[]);
 return {engine,read,apply,get native(){return native;},ask:(text:string)=>engine.execute(text,apply,undefined,read)};
}
test('change all circles color to red preserves every native point and unrelated segment',async()=>{
 const f=nativeBulkFixture(),points=structuredClone(f.native.points),lines=structuredClone(f.native.lines);
 const result=await f.ask('change all circles color to red');
 expect(result.status,result.message).toBe('success');
 expect(f.native.circles.map(c=>c.style?.color)).toEqual(['#ef4444','#ef4444']);
 expect(f.native.points).toEqual(points);expect(f.native.lines).toEqual(lines);
});

test('undo and redo bulk recoloring preserve shared native point coordinates',async()=>{
 const f=nativeBulkFixture(),before=geometryState(f.engine.snapshot()),points=structuredClone(f.native.points);
 expect((await f.ask('Change all circles color to red')).status).toBe('success');
 expect((await f.ask('Undo')).status).toBe('success');expect(geometryState(f.engine.snapshot())).toBe(before);
 expect(f.native.points.map(p=>[p.x,p.y])).toEqual(points.map(p=>[p.x,p.y]));
 expect((await f.ask('Redo')).status).toBe('success');expect(f.native.circles.every(c=>c.style?.color==='#ef4444')).toBe(true);
});
test('an adapter failure during a bulk edit restores all appearances without moving shared points',async()=>{
 const f=nativeBulkFixture(),before=geometryState(f.engine.snapshot()),points=f.native.points.map(p=>[p.x,p.y]);let writes=0;
 const result=await f.engine.execute('Change all circles color to red',async c=>{if(++writes===2)return 'Injected second-write failure';await f.apply(c);},undefined,f.read);
 expect(result.status).toBe('invalid');expect(result.message).not.toContain('could not be restored');
 expect(geometryState({...f.engine.snapshot(),objects:f.read().objects})).toBe(before);
 expect(f.native.points.map(p=>[p.x,p.y])).toEqual(points);
});
test('recoloring after an outline edit replaces the visible stroke color',async()=>{
 const f=nativeBulkFixture();expect((await f.ask('Set all circles outline color to blue')).status).toBe('success');
 expect((await f.ask('Change all circles color to red')).status).toBe('success');
 expect(f.native.circles.every(c=>c.style?.color==='#ef4444')).toBe(true);
});
test('empty selected and absent-type scopes never edit a recent object',async()=>{
 const f=nativeBulkFixture(),before=geometryState(f.engine.snapshot());
 for(const question of ['Change all selected circles color to red','Hide all triangles']){const result=await f.ask(question);expect(result.status).toBe('invalid');expect(result.effects).toEqual([]);expect(geometryState(f.engine.snapshot())).toBe(before);}
});

test('bulk exclusion requests are rejected before any write',async()=>{
 const f=nativeBulkFixture(),before=geometryState(f.engine.snapshot());const r=await f.ask('Change all circles color to red except circle O');
 expect(r.status).toBe('invalid');expect(r.effects).toEqual([]);expect(geometryState(f.engine.snapshot())).toBe(before);
});
test('a locked member prevents the whole bulk recolor before the first write',async()=>{
 const f=nativeBulkFixture();expect((await f.ask('Lock all circles')).status).toBe('success');
 const before=geometryState(f.engine.snapshot());const r=await f.ask('Change all circles color to red');
 expect(r.status).toBe('invalid');expect(r.effects).toEqual([]);expect(geometryState(f.engine.snapshot())).toBe(before);
 expect((await f.ask('Unlock all circles')).status).toBe('success');expect((await f.ask('Change all circles color to red')).status).toBe('success');
});
test('bulk color filtering uses current colors on subsequent requests',async()=>{
 const f=nativeBulkFixture();expect((await f.ask('Make every circle blue')).status).toBe('success');
 expect((await f.ask('Colour all blue circles red')).status).toBe('success');
 const before=geometryState(f.engine.snapshot());const r=await f.ask('Colour all blue circles orange');expect(r.status).toBe('invalid');expect(geometryState(f.engine.snapshot())).toBe(before);
});
