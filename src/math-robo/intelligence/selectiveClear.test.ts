import {describe,expect,it} from 'vitest';
import {SemanticEngine} from './semanticEngine';
import {describeObject} from './sceneContext';
import {parseSemanticCommand} from './semanticParser';
import {validateCommand} from './commandValidator';
import {selectiveClearExamples} from './selectiveClear';
import type {VisualCommand} from '../../offline-intelligence/commands';
function fixture(mode:'normal'|'graph2d'|'graph3d'|'geometry2d'|'geometry3d'){
 const engine=new SemanticEngine(mode),native=new Map<string,VisualCommand>();
 const apply=async(c:VisualCommand)=>{if(c.roboClearAll)native.clear();else if(c.roboControl==='delete')native.delete(c.objectId!);else if(!c.roboControl)native.set(c.objectId!,structuredClone(c));};
 const read=()=>({...engine.snapshot(),objects:[...native.values()].map(c=>describeObject(c,mode))});
 return {engine,native,ask:(text:string)=>engine.execute(text,apply,undefined,read)};
}
for(const mode of ['normal','graph2d','graph3d','geometry2d','geometry3d'] as const)describe(`${mode}: selective clearing`,()=>{
 for(const phrase of selectiveClearExamples.filter(p=>!/(?:blue|C1|triangles)/.test(p)))it(phrase,async()=>{
  const f=fixture(mode);await f.ask('Draw circle radius 3');await f.ask('Draw circle radius 5');await f.ask('Draw rectangle width 4 height 6');
  const circles=f.engine.snapshot().objects.filter(o=>o.type==='circle'),before=circles.map(o=>JSON.stringify(o.command));
  const result=await f.ask(phrase);expect(result.status,result.message).toBe('success');expect(result.effects.some(c=>c.roboClearAll)).toBe(false);expect(f.engine.snapshot().objects.map(o=>o.id)).toEqual(circles.map(o=>o.id));expect([...f.native.values()].map(c=>JSON.stringify(c))).toEqual(before);
  expect((await f.ask('Undo that')).status).toBe('success');expect(f.native.size).toBe(3);expect((await f.ask('Redo')).status).toBe('success');expect(f.native.size).toBe(2);
 });
 it('keeps unions of object types',async()=>{const f=fixture(mode);await f.ask('Draw circle radius 3');await f.ask('Create triangle');await f.ask('Create rectangle');const r=await f.ask('Clear all except circles and triangles');expect(r.status,r.message).toBe('success');expect(f.engine.snapshot().objects.map(o=>o.type)).toEqual(['circle','triangle']);});
 it('keeps a named circle instead of every circle',async()=>{const f=fixture(mode);await f.ask('Draw circle radius 3');await f.ask('Draw circle radius 5');await f.ask('Draw rectangle');const r=await f.ask('Clear all except circle C1');expect(r.status,r.message).toBe('success');expect(f.engine.snapshot().objects.map(o=>o.label)).toEqual(['C1']);});
 it('keeps every blue circle',async()=>{const f=fixture(mode);await f.ask('Draw blue circle radius 3');await f.ask('Draw blue circle radius 5');await f.ask('Draw red circle radius 4');const r=await f.ask('Clear all except blue circles');expect(r.status,r.message).toBe('success');expect(f.engine.snapshot().objects).toHaveLength(2);expect(f.engine.snapshot().objects.every(o=>o.style.color==='#3b82f6')).toBe(true);});
 for(const phrase of ['Clear all except','Clear all except banana','Clear all except circles and','Clear all except circle nonsense words','Clear circles except C1'])it(`never deletes on unresolved exception: ${phrase}`,async()=>{const f=fixture(mode);await f.ask('Create rectangle');const before=JSON.stringify(f.engine.snapshot().objects);const r=await f.ask(phrase);expect(r.status).not.toBe('success');expect(JSON.stringify(f.engine.snapshot().objects)).toBe(before);expect(r.effects).toEqual([]);expect(f.native.size).toBe(1);});
});
it('keeps defining parents for retained dependent constructions',async()=>{const f=fixture('geometry2d');await f.ask('Draw triangle ABC with A(0,0), B(6,0), C(2,4)');await f.ask('Construct its circumcircle');await f.ask('Draw rectangle');const r=await f.ask('Clear all except circle');expect(r.status,r.message).toBe('success');expect(f.engine.snapshot().objects.map(o=>o.type)).toEqual(['triangle','circle']);expect(r.effects.some(c=>c.roboClearAll)).toBe(false);});
it('rejects a blanket clear plan that has lost its exception',()=>{const c=parseSemanticCommand('Clear all except circle','graph2d');delete c.parameters.preserveTargets;expect(()=>validateCommand(c)).toThrow(/keep|cleared/);});
it('requires all exception types to exist before mutating',async()=>{const f=fixture('geometry2d');await f.ask('Draw circle radius 3');await f.ask('Draw rectangle');const before=JSON.stringify(f.engine.snapshot().objects);expect((await f.ask('Clear all except circle and triangle')).status).not.toBe('success');expect(JSON.stringify(f.engine.snapshot().objects)).toBe(before);});
it('keeps manually authored circles from the native scene',async()=>{const f=fixture('graph2d');await f.ask('Create rectangle');const c:VisualCommand={kind:'circle',objectId:'manual-circle',dimension:'2d',points:[[3,4]],radius:7,width:14,height:14,color:'red'};f.native.set(c.objectId!,c);f.engine.sync([...f.native.values()].map(c=>describeObject(c,'graph2d')),[]);const r=await f.ask('clear all except circle');expect(r.status,r.message).toBe('success');expect([...f.native.keys()]).toEqual(['manual-circle']);expect(f.native.get('manual-circle')).toEqual(c);});


for(const mode of ['graph2d','geometry2d','graph3d','geometry3d'] as const){
 for(const phrase of ['Keep circles and clear everything else','Leave circles and clear everything else'])it(`${mode}: ${phrase}`,async()=>{const f=fixture(mode);await f.ask('Draw circle radius 3');await f.ask('Draw rectangle');const r=await f.ask(phrase);expect(r.status,r.message).toBe('success');expect(f.engine.snapshot().objects.map(o=>o.type)).toEqual(['circle']);});
 for(const phrase of ['Clear all circles except C1','Keep circles and clear all','Leave circles then delete everything'])it(`${mode}: safely refuses ${phrase}`,async()=>{const f=fixture(mode);await f.ask('Draw circle radius 3');await f.ask('Draw rectangle');const before=JSON.stringify(f.engine.snapshot().objects);const r=await f.ask(phrase);expect(r.status).not.toBe('success');expect(r.effects).toEqual([]);expect(JSON.stringify(f.engine.snapshot().objects)).toBe(before);});
}
