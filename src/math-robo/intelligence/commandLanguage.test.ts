import {it,expect,afterAll} from 'vitest';
import {mkdirSync,writeFileSync} from 'node:fs';
import {commandVariants} from './commandVariants';
import {SemanticEngine} from './semanticEngine';
import {describeObject} from './sceneContext';
import {normalizeLanguage} from './numberParser';
import {parseSemanticCommand} from './semanticParser';
import {generateStarterDataset,validateSemanticRows} from './semanticDataset';
import type {VisualCommand} from '../../offline-intelligence/commands';
const rows:unknown[]=[];
for(const variant of commandVariants())it(`${variant.action}: ${variant.phrase}`,async()=>{
 const engine=new SemanticEngine('graph2d'),committed=new Map<string,VisualCommand>();
 const run=(phrase:string)=>engine.execute(phrase,async c=>{if(c.roboControl==='delete')committed.delete(c.objectId!);else if(!c.roboControl||c.roboControl==='visibility')committed.set(c.objectId!,structuredClone(c));},undefined,()=>({objects:[...committed.values()].map(c=>describeObject(c,'graph2d'))}));
 await run('Draw a rectangle 4 by 6.');
 if(variant.action==='REDO')await run('Undo.');
 const before=engine.snapshot().objects.length,result=await run(variant.phrase),scene=engine.snapshot();
 const command=result.plan.commands[0],passed=result.status==='success'&&command?.action===variant.action&&command?.subAction===variant.subAction;
 rows.push({...variant,status:result.status,message:result.message,actualAction:command?.action,passed,committed:[...committed.values()]});
 expect(result.status,result.message).toBe('success');expect(command?.action).toBe(variant.action);expect(command?.subAction).toBe(variant.subAction);
 if(variant.action==='CREATE'){expect(scene.objects.at(-1)?.command.radius).toBe(5);expect(committed.size).toBe(before+1);}
 if(variant.action==='DELETE'||variant.action==='UNDO')expect(committed.size).toBe(0);
 if(variant.action==='DUPLICATE')expect(committed.size).toBe(2);
 if(variant.action==='MOVE')expect(scene.objects[0].position[0]).toBe(3);
 if(variant.action==='ROTATE')expect(scene.objects[0].command.rotation![2]).toBeCloseTo(30);
 if(variant.action==='SCALE')expect(scene.objects[0].command.scale).toBe(2);
 if(variant.action==='FIND')expect(result.value).toBe(24);
 if(variant.action==='CHANGE')expect(scene.objects[0].style.color).toBe('#3b82f6');
 if(variant.action==='HIDE')expect(scene.objects[0].style.visible).toBe(false);
 if(variant.action==='SHOW')expect(scene.objects[0].style.visible).toBe(true);
 if(variant.action==='DESELECT')expect(scene.selectedIds).toHaveLength(0);
});
it('preserves expressions and compact geometric dimensions',()=>{
 for(const expression of ['x^2 + 3*x - 5','solve r=5','expand (x+1)^2','Run matrices.inverse [[[1,2],[3,4]]]'])expect(normalizeLanguage(expression)).toBe(expression.toLowerCase());
 expect(parseSemanticCommand('Circle r5','graph2d').parameters.radius).toBe(5);
 expect(parseSemanticCommand('Create rectangle w4 h6','graph2d').parameters).toMatchObject({width:4,height:6});
 expect(parseSemanticCommand('Make a circle with radius twenty-five','graph2d').parameters.radius).toBe(25);
});
for(const phrase of ['Plot a circle with radius 5.','Draw a circle of radius 5.','Create a circle r=5.','Make a circle with radius five.','Generate a circle having radius 5 units.','Add a circle of radius 5 at the origin.','Circle radius 5.','Circle r5.','Can you draw me a circle with radius 5?','I need a circle with radius 5.','Please put a circle of radius 5 on the graph.'])it(`requested circle form ${phrase}`,async()=>{
 const engine=new SemanticEngine('graph2d'),result=await engine.execute(phrase,async()=>{});expect(result.status,result.message).toBe('success');expect(engine.snapshot().objects).toHaveLength(1);expect(engine.snapshot().objects[0].radius).toBe(5);
});
it('expands the existing reviewed starter dataset',()=>{
 const data=generateStarterDataset(),variants=data.filter(r=>r.group?.startsWith('language:'));
 expect(variants).toHaveLength(728);expect(validateSemanticRows(variants)).toHaveLength(728);
});
for(const phrase of ['Calculate 2+4','Work out 2+4','Compute 2+4','Find the answer to 2+4'])it(`solver alias ${phrase}`,async()=>{
 const result=await new SemanticEngine('graph2d').execute(phrase,async()=>{});expect(result.status,result.message).toBe('success');expect(result.message).toMatch(/6/);expect(result.effects).toHaveLength(0);
});
for(let n=1;n<=20;n++)it(`conversation ${n}: original identity survives color, move, copy and delete`,async()=>{
 const engine=new SemanticEngine('graph2d');const apply=async()=>{};
 for(const phrase of [`Create rectangle w${n+2} h6`,'Make it blue.','Slide it right by 3.','Clone that.','Take away the original.']){
  const result=await engine.execute(phrase,apply);expect(result.status,result.message).toBe('success');
 }
 expect(engine.snapshot().objects).toHaveLength(1);expect(engine.snapshot().objects[0].originalId).toBeTruthy();expect(engine.snapshot().objects[0].position[0]).toBe(3);
});
it('asks before deleting an ambiguous object and preserves selection on clear selection',async()=>{
 const engine=new SemanticEngine('graph2d');const apply=async()=>{};
 await engine.execute('Draw a triangle.',apply);await engine.execute('Draw another triangle.',apply);await engine.execute('Clear selection.',apply);
 const result=await engine.execute('Erase the triangle.',apply);expect(result.status).toBe('ambiguous');expect(engine.snapshot().objects).toHaveLength(2);
});
it('asks for missing movement and refuses speculative destructive conversation',async()=>{
 const engine=new SemanticEngine('graph2d');const apply=async()=>{};
 await engine.execute('Draw a circle.',apply);expect((await engine.execute('Move it.',apply)).status).toBe('ambiguous');
 await engine.execute('Cancel.',apply);await engine.execute('Maybe delete everything.',apply);expect(engine.snapshot().objects).toHaveLength(1);
});
it('normalizes compound actions without splitting coordinates or functions',async()=>{
 const engine=new SemanticEngine('graph2d');const result=await engine.execute('Sketch a rectangle 4 by 6 and shift it right by 3 then clone that.',async()=>{});
 expect(result.status,result.message).toBe('success');expect(engine.snapshot().objects).toHaveLength(2);expect(engine.snapshot().objects.every(o=>o.position[0]===3)).toBe(true);
});
afterAll(()=>{mkdirSync('artifacts/math-robo-language',{recursive:true});writeFileSync('artifacts/math-robo-language/variant-results.json',JSON.stringify({total:rows.length,rows},null,2));});
