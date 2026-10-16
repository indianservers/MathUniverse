import {test,expect} from 'vitest';
import corpus from './nearestPoint150.json';
import {SemanticEngine} from './semanticEngine';
import {describeObject} from './sceneContext';
import {interpretVisualRequest} from '../../offline-intelligence/commands';
import {classifyRequest} from './requestClassifier';
import {nearestPointCoordinates} from './nearestPointLanguage';
import type {RoboMode} from './types';

function fixture(points: number[][], mode: RoboMode='geometry2d') {
  const engine=new SemanticEngine(mode);
  engine.sync(points.map((position,i)=>describeObject({
    ...interpretVisualRequest('Create a point',mode).command!,kind:'point',
    objectId:`p${i}`,roboLabel:String.fromCharCode(65+i),points:[position],
  },mode)),[]);
  return engine;
}
test('150 distinct proximity questions',()=>{
  expect(corpus).toHaveLength(150);
  expect(new Set(corpus.map(row=>row.question)).size).toBe(150);
});
for(const row of corpus)test(`${row.id}: ${row.question}`,async()=>{
  const [x,y]=row.coordinates,engine=fixture([[x-9,y],[x+0.3,y+0.4],[x+3,y+4]]);
  const before=engine.snapshot().objects;
  expect(classifyRequest(row.question)).toBe('QUERY');
  const answer=await engine.execute(row.question,async()=>{throw new Error('Query must not mutate the board');});
  expect(answer.status,answer.message).toBe('success');
  expect(answer.message).toContain('nearest point is B');
  expect(answer.value).toBeCloseTo(0.5);
  expect(answer.verification?.checks).toContain('Independent nearest-point coordinate comparison');
  expect(engine.snapshot().lastQueryTargets).toEqual(['p1']);
  expect(engine.snapshot().objects).toEqual(before);
});
test('screenshot arrangement identifies B near (2,3)',async()=>{
  const engine=fixture([[-2.5,2.5],[2.5,2.5],[2,-3],[-4,-3]]);
  const answer=await engine.execute('what point is near to 2,3',async()=>undefined);
  expect(answer.status,answer.message).toBe('success');
  expect(answer.message).toContain('B at (2.5, 2.5)');
  expect(answer.value).toBeCloseTo(Math.sqrt(0.5));
});
test('all ties are reported and an exact match has zero distance',async()=>{
  const engine=fixture([[1,3],[3,3],[2,8]]);
  const answer=await engine.execute('Nearest point to 2,3',async()=>undefined);
  expect(answer.status,answer.message).toBe('success');
  expect(answer.message).toContain('equally near');
  expect(engine.snapshot().lastQueryTargets).toEqual(['p0','p1']);
  expect((await engine.execute('Nearest point to 2,8',async()=>undefined)).value).toBe(0);
});
test('hidden and undefined points are excluded and moving points updates the answer',async()=>{
  const engine=fixture([[2,3],[2,3],[3,3],[9,9]]),objects=engine.snapshot().objects;
  objects[0].command.roboVisible=false;
  objects[1].command.roboDefinitionState={status:'undefined',reason:'test'};
  engine.sync(objects,[]);
  expect((await engine.execute('Nearest point to 2,3',async()=>undefined)).message).toContain('nearest point is C');
  objects[3].position=[2,3];objects[3].command.points=[[2,3]];
  engine.sync(objects,[]);
  expect((await engine.execute('Nearest point to 2,3',async()=>undefined)).message).toContain('nearest point is D');
});
test('empty boards and mismatched dimensions do not invent answers',async()=>{
  for(const [engine,question] of [[fixture([]),'Nearest point to 2,3'],[fixture([[2,3]]),'Nearest point to 2,3,4']] as const){
    const answer=await engine.execute(question,async()=>undefined);
    expect(answer.status).not.toBe('success');expect(answer.value).toBeUndefined();
  }
  const engine=fixture([[2,3,9],[2,3,1]],'geometry3d');
  const answer=await engine.execute('Nearest point to (2,3,0)',async()=>undefined);
  expect(answer.status,answer.message).toBe('success');expect(answer.value).toBe(1);
  expect(engine.snapshot().lastQueryTargets).toEqual(['p1']);
});
test('negated, malformed and unrelated commands are not proximity queries',()=>{
  for(const text of ['Do not find the nearest point to 2,3','Move the nearest point to 2,3','What point is near to NaN,3','What point is near to (2,3','What point is near to 2,3,4,5'])expect(nearestPointCoordinates(text)).toBeUndefined();
});
