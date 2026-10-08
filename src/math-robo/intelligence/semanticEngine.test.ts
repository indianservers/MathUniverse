import { describe, it, expect } from 'vitest';
import { SemanticEngine } from './semanticEngine';
import { describeObject } from './sceneContext';
import { parseNumber } from './numberParser';
import { parseSemanticPlan, splitUtterance } from './semanticParser';
import { LANGUAGE_ACTIONS, OPERATIONS, normalizeAction } from './actionRegistry';
import { generateStarterDataset, validateSemanticRows, splitSemanticRows, contextToScene } from './semanticDataset';
import { preparePlan } from './executionPlanner';
import { CorrectionStore } from './corrections';
import {migrateCompatibilityPlan} from './migration';
import type { VisualCommand } from '../../offline-intelligence/commands';

const execute=(engine:SemanticEngine,phrase:string)=>engine.execute(phrase,async()=>undefined);
describe('Math Robo semantic execution',()=>{
  it('preserves equal square and cube sides when dimensions override legacy parameters',async()=>{
    const square=new SemanticEngine('geometry2d');await execute(square,'Create a square 11 by 6');
    expect(square.snapshot().objects[0].command.height).toBe(11);
    expect((await execute(square,'Find its area')).value).toBeCloseTo(121);
    const cube=new SemanticEngine('geometry3d');await execute(cube,'Create a cube width 9 height 6 depth 4');
    expect(cube.snapshot().objects[0].command.height).toBe(9);expect(cube.snapshot().objects[0].command.depth).toBe(9);
  });
  it('recognizes graph creation and plural intercept/crossing queries without creating extra graphs',async()=>{
    const engine=new SemanticEngine('graph2d');
    expect((await execute(engine,'Show graph of y=x^2-16')).status).toBe('success');
    for(const phrase of ['Find the x intercepts','Find its x-intercepts','Where does it cross the x-axis?']){
      const result=await execute(engine,phrase);expect(result.status).toBe('success');expect(result.effects).toEqual([]);
      expect(result.value).toEqual([[-4,0],[4,0]]);expect(engine.snapshot().objects).toHaveLength(1);
    }
    expect(parseSemanticPlan('Show graph of z=x^2+y^2','graph3d').commands[0].subAction).toBe('SURFACE_3D');
  });
  it('rejects incomplete destinations and moves a referenced triangle to explicit coordinates',async()=>{
    const engine=new SemanticEngine('geometry2d');
    await execute(engine,'Create a triangle');
    const before=engine.snapshot().objects;
    const rejected=await execute(engine,'Move that triangle to point 4');
    expect(rejected.status).toBe('ambiguous');expect(rejected.message).toContain('destination coordinates');
    expect(rejected.effects).toEqual([]);expect(engine.snapshot().objects).toEqual(before);
    expect((await execute(engine,'Move that triangle to (4,0)')).status).toBe('success');
    const query=await execute(engine,'What is its centroid?');
    expect((query.value as number[])[0]).toBeCloseTo(4);expect((query.value as number[])[1]).toBeCloseTo(0);
  });
  it('recognizes 100 language actions and registers only real supported or explicit unsupported operations',()=>{
    expect(new Set(LANGUAGE_ACTIONS).size).toBe(100);
    for(const action of LANGUAGE_ACTIONS)expect(OPERATIONS.some(op=>op.action===normalizeAction(action))).toBe(true);
    for(const op of OPERATIONS){expect(op.executor).toBeTruthy();expect(op.validation.length).toBeGreaterThan(0);expect(op.modes.length).toBeGreaterThan(0);}
  });
  it.each([['-4',-4],['4.5',4.5],['1/2',.5],['3/4',.75],['2π',2*Math.PI],['pi',Math.PI],['sqrt(2)',Math.sqrt(2)],['√2',Math.sqrt(2)],['five',5],['minus three',-3],['one half',.5],['three quarters',.75]])('parses %s', (phrase,value)=>{expect(parseNumber(phrase)).toBeCloseTo(value);});
  it('splits commands without splitting tuples or compound movement',()=>{
    expect(splitUtterance('Draw line (0,0) to (6,8), mark its midpoint and move it 3 right and 2 up')).toHaveLength(3);
    expect(parseSemanticPlan('Move it 3 units right and 2 up','geometry2d').commands[0].parameters.vector).toEqual([3,2]);
  });
  it('runs multi-action creation, transformation and center/radius display without duplicating objects',async()=>{
    const e=new SemanticEngine('geometry2d');
    expect((await execute(e,'Create a rectangle 4 by 6, move it right 3 units and rotate it 30 degrees')).status).toBe('success');
    expect(e.snapshot().objects).toHaveLength(1);expect(e.snapshot().objects[0].command.rotation?.[2]).toBe(30);
    const before=e.snapshot().objects.length;
    expect((await execute(e,'Draw a red circle radius 5, mark its center and show the radius')).status).toBe('success');
    expect(e.snapshot().objects.length).toBe(before+2);
  });
  it('runs creation, color, movement, rotation, area, duplicate, delete and undo end to end',async()=>{
    const e=new SemanticEngine('geometry2d');
    for(const phrase of ['Draw a rectangle 4 by 6','Make it blue','Move it 3 units right and 2 up','Rotate it 45 degrees'])expect((await execute(e,phrase)).status,phrase).toBe('success');
    expect((await execute(e,'What is its area?')).value).toBeCloseTo(24);
    expect(e.snapshot().objects).toHaveLength(1);
    expect((await execute(e,'Duplicate it')).status).toBe('success');
    expect((await execute(e,'Make the copy red')).status).toBe('success');
    expect((await execute(e,'Delete the original')).status).toBe('success');expect(e.snapshot().objects).toHaveLength(1);
    expect((await execute(e,'Undo that')).status).toBe('success');expect(e.snapshot().objects).toHaveLength(2);
    expect((await execute(e,'Redo that')).status).toBe('success');expect(e.snapshot().objects).toHaveLength(1);
  });
  it('never duplicates read-only scene objects during the distance regression',async()=>{
    const e=new SemanticEngine('geometry2d');const base:VisualCommand={kind:'point',dimension:'2d',points:[[1,1]],width:1,height:1,radius:1,color:'#22d3ee',objectId:'point_A',roboLabel:'A'};
    e.sync([describeObject(base,'geometry2d'),describeObject({...base,objectId:'point_B',roboLabel:'B',points:[[4,5]]},'geometry2d')],['point_A','point_B']);
    let mutations=0;const result=await e.execute('What is the distance between these two points?',async()=>{mutations++;});
    expect(result.status).toBe('success');expect(result.value).toBe(5);expect(mutations).toBe(0);expect(e.snapshot().objects).toHaveLength(2);
  });
  it('queries then marks midpoint, constructs a perpendicular, and queries/marks intersections',async()=>{
    const e=new SemanticEngine('geometry2d');
    expect((await execute(e,'Draw a line from 0,0 to 6,8')).status).toBe('success');
    expect((await execute(e,'What is the midpoint?')).value).toEqual([3,4]);expect(e.snapshot().objects).toHaveLength(1);
    expect((await execute(e,'Mark it')).status).toBe('success');expect(e.snapshot().objects).toHaveLength(2);
    expect((await execute(e,'Draw a perpendicular through that point')).status).toBe('success');expect(e.snapshot().objects).toHaveLength(3);
    expect((await execute(e,'Create a circle centered there with radius 5')).status).toBe('success');
    expect((await execute(e,'Where does the line intersect the circle?')).status).toBe('success');expect(e.snapshot().objects).toHaveLength(4);
    expect((await execute(e,'Mark those intersection points')).status).toBe('success');expect(e.snapshot().objects).toHaveLength(6);
    expect((await execute(e,'Are these two lines perpendicular?')).value).toBe(true);
  });
  it('compares, selects, resizes and reflects circles; solves function roots and intersections',async()=>{
    const e=new SemanticEngine('graph2d');await execute(e,'Create a circle radius 3');await execute(e,'Create a circle radius 5');
    expect((await execute(e,'Which circle is larger?')).status).toBe('success');expect((await execute(e,'Select the largest circle')).status).toBe('success');
    expect((await execute(e,'Change its radius to 8')).status).toBe('success');expect((await execute(e,'Reflect it across the y-axis')).status).toBe('success');
    await execute(e,'Plot y=x^2');expect((await execute(e,'Find its roots')).value).toEqual([[0,0]]);
    await execute(e,'Plot y=2x+3');expect((await execute(e,'Find where these graphs intersect')).value).toEqual([[-1,1],[3,9]]);
  });
  it('runs volume and translation in 3D',async()=>{
    const e=new SemanticEngine('geometry3d');expect((await execute(e,'Create a sphere radius 3')).status).toBe('success');expect((await execute(e,'Move it up 5 units')).status).toBe('success');
    expect(e.snapshot().objects[0].position).toEqual([0,5,0]);expect((await execute(e,'Find its volume')).value).toBeCloseTo(36*Math.PI);
  });
  it('rejects invalid radius, missing targets and unsupported actions without mutations',async()=>{
    const e=new SemanticEngine('geometry2d');expect((await execute(e,'Create circle radius -2')).status).toBe('invalid');expect(e.snapshot().objects).toHaveLength(0);
    expect((await execute(e,'Move it 3 right')).status).toBe('invalid');expect((await execute(e,'Shear it by 2')).status).toBe('unsupported');
    await execute(e,'Create triangle');expect((await execute(e,'Find the radius of the triangle')).status).toBe('invalid');
  });
  it('returns ambiguity and plans all commands before committing a partially invalid utterance',async()=>{
    const e=new SemanticEngine('geometry2d');await execute(e,'Create circle radius 3');await execute(e,'Create circle radius 5');
    expect((await execute(e,'Make the circle blue')).status).toBe('ambiguous');
    const before=e.snapshot();expect((await execute(e,'Draw a square and create circle radius -2')).status).toBe('invalid');expect(e.snapshot()).toEqual(before);
  });
  it('migrates corrections without deleting v3 data and stores full plans without retraining',async()=>{
    const data=new Map([['math-robo-learning-v1',JSON.stringify([{phrase:'my moon',canonical:'Create circle radius 5',mode:'geometry2d'}])]]);
    const store=new CorrectionStore({getItem:key=>data.get(key)??null,setItem:(key,value)=>{data.set(key,value);},removeItem:key=>{data.delete(key);}});
    expect(store.count).toBe(1);store.teach('my double','Scale it by 2','geometry2d');
    const e=new SemanticEngine('geometry2d',store);await execute(e,'my moon');await execute(e,'my double');expect(e.snapshot().objects[0].command.scale).toBe(2);expect(data.has('math-robo-learning-v1')).toBe(true);
  });
  it('builds grouped starter rows and forbids executable context strings',()=>{
    const rows=validateSemanticRows(generateStarterDataset());expect(rows.length).toBeGreaterThan(1000);
    expect(()=>validateSemanticRows([{...rows[0],context:['Create point (1,1)']}])).toThrow('read-only');
    const split=splitSemanticRows(rows);for(const a of split.train)expect(split.test.some(b=>a.group===b.group)).toBe(false);
    const sample=rows.find(row=>row.action==='FIND'&&row.subAction==='DISTANCE')!;
    expect(preparePlan(parseSemanticPlan(sample.phrase,sample.mode),contextToScene(sample)).effects).toHaveLength(0);
  });
  it('verifies at least one runnable example for every implemented operation',()=>{
    const rows=generateStarterDataset(),missing:string[]=[];
    for(const op of OPERATIONS.filter(item=>item.implemented)){
      if(op.action==='UNDO'||op.action==='REDO')continue;
      const candidates=rows.filter(row=>row.action===op.action&&row.subAction===op.subAction);
      const passed=candidates.some(row=>{try{const scene=contextToScene(row),plan=migrateCompatibilityPlan(parseSemanticPlan(row.phrase,row.mode),scene);if(plan.commands[0].action!==op.action||plan.commands[0].subAction!==op.subAction)return false;preparePlan(plan,scene);return true;}catch{return false;}});
      if(!passed)missing.push(`${op.action}:${op.subAction}`);
    }
    expect(missing).toEqual([]);
  });
  it('keeps 100,000 rows bounded and template groups isolated',()=>{
    const base=generateStarterDataset();const rows=Array.from({length:100000},(_,i)=>base[i%base.length]);const split=splitSemanticRows(rows);
    expect(split.train.length+split.validation.length+split.test.length).toBe(100000);
    const groups=new Set(split.train.map(row=>row.group));expect(split.test.some(row=>groups.has(row.group))).toBe(false);
  });
});
