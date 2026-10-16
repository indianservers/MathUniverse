import {describe,it,expect} from 'vitest';
import {SemanticEngine} from '../../math-robo/intelligence/semanticEngine';
import {describeObject} from '../../math-robo/intelligence/sceneContext';
import {intelligenceGraph3dLayers,restoredGraph3dCommands} from '../../offline-intelligence/graph3dAdapter';
import type {Graph3DSurface} from '../graph3dSurfaceModel';
import type {VisualCommand} from '../../offline-intelligence/commands';
import {parseSemanticPlan} from '../../math-robo/intelligence/semanticParser';
import {migrateCompatibilityPlan} from '../../math-robo/intelligence/migration';
import corpus from './corpus.json';

function workspace(){
  const engine=new SemanticEngine('graph3d');let layers:Graph3DSurface[]=[];
  const apply=async(c:VisualCommand)=>{
    const matches=(s:Graph3DSurface)=>s.id.startsWith(`${c.objectId}-`);
    if(c.roboClearAll){layers=[];return;}
    if(c.roboControl==='select'||c.roboControl==='deselect')return;
    if(c.roboControl==='delete'){layers=layers.filter(s=>!matches(s));return;}
    if(c.roboControl==='visibility'){layers=layers.map(s=>matches(s)?{...s,visible:c.roboVisible??true}:s);return;}
    layers=[...layers.filter(s=>!matches(s)),...intelligenceGraph3dLayers(c).map((s,i)=>({...s,id:`${c.objectId}-${i}`}))];
  };
  const read=()=>({objects:restoredGraph3dCommands(layers).map(c=>describeObject(c,'graph3d'))});
  return {engine,run:(text:string)=>engine.execute(text,apply,undefined,read),layers:()=>layers};
}

describe('Supplied 3D command audit regressions (real adapter, no GPU)',()=>{
  it('keeps the exact 150-command corpus with unique IDs and independent expectations',()=>{
    expect(corpus).toHaveLength(150);expect(corpus.map(c=>c.id)).toEqual(Array.from({length:150},(_,i)=>i+1));
    expect(corpus.every(c=>c.expected&&c.expectedActions.length&&Array.isArray(c.setup))).toBe(true);
  });
  it('uses a cuboid for rectangular prisms and one native mesh per polyhedron',async()=>{
    const w=workspace();expect((await w.run('Make a rectangular prism.')).status).toBe('success');
    expect(w.engine.snapshot().objects[0].type).toBe('cuboid');expect(w.layers()).toHaveLength(1);expect(w.layers()[0].roboMesh).toBe(true);
  });
  it('keeps every unrelated object when removing all cubes',async()=>{
    const w=workspace();await w.run('Create 3 cubes');await w.run('Create sphere');await w.run('Create cylinder');
    expect((await w.run('Delete all cubes')).status).toBe('success');expect(w.engine.snapshot().objects.map(o=>o.type).sort()).toEqual(['cylinder','sphere']);
    expect(restoredGraph3dCommands(w.layers()).map(c=>c.kind).sort()).toEqual(['cylinder','sphere']);
  });
  it('treats upward and higher as relative Y motion',async()=>{
    const w=workspace();await w.run('Create cube at (1,2,3)');await w.run('Move it 3 units higher');
    expect(w.engine.snapshot().objects[0].position).toEqual([1,5,3]);await w.run('Move it 2 units upward');expect(w.engine.snapshot().objects[0].position).toEqual([1,7,3]);
  });
  it('translates all cubes even if only one cube matches',async()=>{
    const w=workspace();await w.run('Create cube');await w.run('Create sphere');
    expect((await w.run('Rotate all cubes 30 degrees around the Y-axis')).status).toBe('success');
    expect(w.engine.snapshot().objects.find(o=>o.type==='cube')?.command.rotation?.[1]).toBeCloseTo(30,10);
    expect(w.engine.snapshot().objects.find(o=>o.type==='sphere')?.command.rotation).toEqual([0,0,0]);
  });
  it('supports half size, dimension tuples and cylinder radius edits',async()=>{
    const w=workspace();await w.run('Create sphere');await w.run('Reduce the sphere to half its size');expect(w.engine.snapshot().objects[0].command.scale).toBe(.5);
    await w.run('Create cube');await w.run('Select the cube');await w.run('Resize the selected shape to 4 × 5 × 6');expect(w.engine.snapshot().objects.find(o=>o.type==='cuboid')?.command).toMatchObject({width:4,height:5,depth:6});
    await w.run('Create cylinder');expect((await w.run('Set the cylinder radius to 2')).status).toBe('success');expect(w.engine.snapshot().objects.find(o=>o.type==='cylinder')?.command.radius).toBe(2);
  });
  it('does not interpret reset rotation as deletion',async()=>{
    const w=workspace();await w.run('Create cube');await w.run('Rotate cube 45 degrees');await w.run("Reset the cube's rotation");expect(w.engine.snapshot().objects).toHaveLength(1);expect(w.engine.snapshot().objects[0].command.rotation).toEqual([0,0,0]);
  });
  it('rejects 1000 requested objects without falling back to one object',async()=>{
    const w=workspace();const result=await w.run('Create one thousand cubes');expect(result.status).toBe('invalid');expect(w.layers()).toEqual([]);expect(w.engine.snapshot().objects).toEqual([]);
  });
  it.each(['Create a cube with side length -5','Make a sphere with radius zero','Move the cube to (abc,2,3)','Make the cube infinitely large','Create a cylinder with negative height'])('safely rejects %s',async command=>{
    const w=workspace();await w.run('Create cube');const before=w.engine.snapshot().objects;
    expect((await w.run(command)).status).not.toBe('success');expect(w.engine.snapshot().objects).toEqual(before);
  });
  it.each(['Spin the selected object continuously','Give the cube a metallic finish','Group the selected cubes','Generate 10 random spheres'])('never silently ignores unavailable qualifiers: %s',async command=>{
    const w=workspace();await w.run('Create cube');const before=w.engine.snapshot().objects;
    expect((await w.run(command)).status).toBe('unsupported');expect(w.engine.snapshot().objects).toEqual(before);
  });
  it('executes immediate creation/deletion atomically and retains both effects',async()=>{
    const w=workspace();const result=await w.run('Create a sphere and immediately delete it');
    expect(result.status).toBe('success');expect(result.effects.some(c=>c.action==='create')).toBe(true);expect(result.effects.some(c=>c.roboControl==='delete')).toBe(true);expect(w.layers()).toEqual([]);
  });
  it('undoes ten actions and redoes the most recently undone action',async()=>{
    const w=workspace();await w.run('Create cube');for(let i=0;i<10;i++)await w.run('Move it right by 1');
    expect((await w.run('Undo 10 actions')).status).toBe('success');expect(w.engine.snapshot().objects[0].position).toEqual([0,0,0]);await w.run('Redo');expect(w.engine.snapshot().objects[0].position).toEqual([1,0,0]);
  });
  it('expands creation ellipsis without changing mathematical parentheses',()=>{
    expect(parseSemanticPlan('Create a cube, then a sphere, then delete the cube','graph3d').commands.map(c=>[c.action,c.subAction])).toEqual([['CREATE','CUBE'],['CREATE','SPHERE'],['DELETE','OBJECT']]);
  });
  it('retains explicit unsupported intent through compatibility fallback',async()=>{
    const w=workspace();await w.run('Create cube');
    const plan=migrateCompatibilityPlan(w.engine.parse('Rotate the cube around the world origin'),w.engine.snapshot());
    expect(plan.commands[0].action).toBe('UNSUPPORTED');
  });
  it('selects the smallest sphere without matching the substring all',async()=>{
    const w=workspace();for(const radius of [3,1,2])await w.run(`Create sphere radius ${radius}`);
    expect((await w.run('Select the smallest sphere')).status).toBe('success');
    expect(w.engine.snapshot().selectedIds).toHaveLength(1);
    expect(w.engine.snapshot().objects.find(o=>w.engine.snapshot().selectedIds.includes(o.id))?.command.radius).toBe(1);
    await w.run('Delete the smallest sphere');expect(w.engine.snapshot().objects.map(o=>o.command.radius).sort()).toEqual([2,3]);
  });
  it('resolves a named pyramid independently of an earlier selected cube',async()=>{
    const w=workspace();await w.run('Create cube');await w.run('Create pyramid');await w.run('Select cube');await w.run('Make the pyramid smaller');
    expect(w.engine.snapshot().objects.find(o=>o.type==='pyramid')?.command.scale).toBe(.5);expect(w.engine.snapshot().objects.find(o=>o.type==='cube')?.command.scale).toBe(1);
  });
  it('allows clearing the graph while preserving system axes',async()=>{
    const w=workspace();await w.run('Create cube');expect((await w.run('Clear the graph but keep the coordinate axes.')).status).toBe('success');expect(w.layers()).toEqual([]);
  });
  it('moves freshly created spheres apart within an atomic compound request',async()=>{
    const w=workspace();const result=await w.run('Create two spheres and move them apart');expect(result.status,result.message).toBe('success');
    const objects=w.engine.snapshot().objects;expect(objects).toHaveLength(2);expect(Math.abs(objects[0].position[0]-objects[1].position[0])).toBeGreaterThan(6);
  });
  it('deletes the last created object independently of the current selection',async()=>{
    const w=workspace();await w.run('Create cube');await w.run('Create sphere');const sphere=w.engine.snapshot().lastCreated;await w.run('Select cube');
    expect((await w.run('Delete the last created object')).status).toBe('success');expect(w.engine.snapshot().objects.some(o=>o.id===sphere)).toBe(false);expect(w.engine.snapshot().objects[0].type).toBe('cube');
  });
  it('preserves plural exception scopes before typed deletion inference',async()=>{
    const w=workspace();await w.run('Create 2 cubes');await w.run('Create sphere');
    expect((await w.run('Delete all except cubes')).status).toBe('success');expect(w.engine.snapshot().objects).toHaveLength(2);expect(w.engine.snapshot().objects.every(o=>o.type==='cube')).toBe(true);
  });
  it('preserves physical height and depth when widening an already scaled cube',async()=>{
    const w=workspace();await w.run('Create cube');await w.run('Scale it by 2');
    expect((await w.run('Make the cube twice as wide')).status).toBe('success');
    expect(w.engine.snapshot().objects[0].command).toMatchObject({kind:'cuboid',width:24,height:12,depth:12,scale:1});
  });
  it('preserves physical height when setting the radius of an already scaled cylinder',async()=>{
    const w=workspace();await w.run('Create cylinder height 4 radius 3');await w.run('Scale it by 2');
    expect((await w.run('Set the cylinder radius to 2')).status).toBe('success');
    expect(w.engine.snapshot().objects[0].command).toMatchObject({height:8,radius:2,scale:1});
  });
});
