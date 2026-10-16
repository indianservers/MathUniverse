import {test,expect} from 'vitest';
import {SemanticEngine} from './semanticEngine';
import {describeObject} from './sceneContext';
import {interpretVisualRequest} from '../../offline-intelligence/commands';
function fixture(){const engine=new SemanticEngine('geometry2d');engine.sync(Object.entries({A:[-2,3],B:[2,3],C:[2,-3],D:[-4,-3]}).map(([label,position])=>describeObject({...interpretVisualRequest('Create a point','geometry2d').command!,kind:'point',objectId:label,roboLabel:label,points:[position]},'geometry2d')),[]);return {engine,ask:(text:string)=>engine.execute(text,async()=>{throw new Error('A measurement must never change the board');})};}
test('exact screenshot request resolves both point names without asking for a selection',async()=>{
  const f=fixture(),before=f.engine.snapshot().objects,result=await f.ask('Calculate the distance between point C and point D');
  expect(result.status,result.message).toBe('success');expect(result.value).toBe(6);expect(result.message).toContain('C to D');expect(result.execution?.evidence.independent).toBe(true);expect(f.engine.snapshot().objects).toEqual(before);
});
test('two choices accumulate one at a time without moving the first point',async()=>{
  const f=fixture(),before=f.engine.snapshot().objects;
  const first=await f.ask('Find the distance');expect(first.status).toBe('ambiguous');expect(first.clarification?.slots).toContain('distancePoints');
  const c=await f.ask('C');expect(c.status,c.message).toBe('ambiguous');expect(c.message).toContain('First point: C');expect(c.candidates).not.toContain('C');
  expect(f.engine.snapshot().objects).toEqual(before);
  const d=await f.ask('D');expect(d.status,d.message).toBe('success');expect(d.value).toBe(6);expect(f.engine.snapshot().objects).toEqual(before);
});
test('a measurement replaces an old pending move before any point reply',async()=>{
  const f=fixture(),before=f.engine.snapshot().objects;
  await f.ask('Move the point right by 2');
  expect((await f.ask('Find the distance')).status).toBe('ambiguous');
  expect((await f.ask('C')).status).toBe('ambiguous');
  expect((await f.ask('D')).value).toBe(6);expect(f.engine.snapshot().objects).toEqual(before);
});
test('a pair can be supplied together and duplicate or invalid choices keep the request read-only',async()=>{
  const f=fixture();await f.ask('Find the distance');await f.ask('C');
  expect((await f.ask('C')).message).toMatch(/already chosen/);
  expect((await f.ask('Z')).status).toBe('ambiguous');
  expect((await f.ask('and point D')).value).toBe(6);
  await f.ask('Measure another pair');expect((await f.ask('A and B')).value).toBe(4);
});
test('follow-up calculations use the current coordinates and answer checks explain the result',async()=>{
  const f=fixture();await f.ask('distance from C to D');
  expect((await f.ask('Show steps')).message).toContain('√');
  expect((await f.ask('Is it 6?')).message).toMatch(/^Yes/);
  expect((await f.ask('Is it 9?')).message).toMatch(/^No/);
  expect((await f.ask('What about A and B?')).value).toBe(4);
  const objects=f.engine.snapshot().objects;objects.find(o=>o.id==='B')!.position=[5,3];objects.find(o=>o.id==='B')!.command.points=[[5,3]];f.engine.sync(objects,[]);
  expect((await f.ask('Recalculate distance')).value).toBe(7);
});
test('selection is optional, cancellation clears the pair, and moved first points remain usable',async()=>{
  const f=fixture();await f.ask('Find the distance');await f.ask('C');
  const objects=f.engine.snapshot().objects;objects.find(o=>o.id==='C')!.position=[3,-3];objects.find(o=>o.id==='C')!.command.points=[[3,-3]];f.engine.sync(objects,[]);
  expect((await f.ask('D')).value).toBe(7);
  await f.ask('Measure another pair');expect((await f.ask('cancel')).message).toMatch(/cancelled/);expect(f.engine.conversation.pending).toBeUndefined();
});
test('starting another pair keeps explanation requests on the pending choice',async()=>{
  const f=fixture();await f.ask('distance from C to D');await f.ask('Measure another pair');await f.ask('A');
  expect((await f.ask('Show steps')).status).toBe('ambiguous');expect((await f.ask('B')).value).toBe(4);
});
