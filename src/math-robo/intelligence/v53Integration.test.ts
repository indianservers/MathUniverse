import {expect,it} from 'vitest';
import {SemanticEngine} from './semanticEngine';
import {describeObject} from './sceneContext';
import type {VisualCommand} from '../../offline-intelligence/commands';
it('rectangle follow-ups use native dimensions and reject unrelated knowledge',async()=>{
 const engine=new SemanticEngine('graph2d'),run=(text:string)=>engine.execute(text,async()=>undefined);
 await run('Draw a rectangle');expect((await run('Make it 8 units wide.')).status).toBe('success');
 expect(engine.snapshot().objects[0].command.width).toBe(8);
 expect((await run('Make its height half its width.')).status).toBe('success');
 expect(engine.snapshot().objects[0].command.height).toBe(4);
 await run('Rotate it by 30 degrees');
 expect(engine.snapshot().objects[0].command.width).toBe(8);expect(engine.snapshot().objects[0].command.height).toBe(4);
});
for(const mode of ['graph2d','geometry2d'] as const){
 it(`${mode}: compound indexed triangle centroid has independent coordinate oracle`,async()=>{
  const engine=new SemanticEngine(mode),native=new Map<string,VisualCommand>();
  const result=await engine.execute('Draw a triangle A7B7C7 with vertices (0,0), (6,0), (2,6); then construct its centroid and label it G7.',async c=>{if(!c.objectId)throw new Error('Missing committed object ID');native.set(c.objectId,structuredClone(c));},undefined,()=>({objects:[...native.values()].map(c=>describeObject(c,mode)),selectedIds:[]}));
  expect(result.status,result.message).toBe('success');
  const marker=[...native.values()].find(c=>c.kind==='point');
  expect(marker?.points[0][0]).toBeCloseTo(8/3,8);expect(marker?.points[0][1]).toBeCloseTo(2,8);
  expect(marker?.roboLabel).toBe('G7');
 });
 it(`${mode}: circle scaling query and undo preserve identity and position`,async()=>{
  const engine=new SemanticEngine(mode),run=(text:string)=>engine.execute(text,async()=>undefined);
  await run('Draw a circle of radius 5');const id=engine.snapshot().objects[0].id;
  await run('Move it right by 3');await run('Make it twice as large');
  expect((await run('What is its radius?')).value).toBe(10);
  await run('Undo');expect((await run('What is its radius now?')).value).toBe(5);
  expect(engine.snapshot().objects[0].id).toBe(id);expect(engine.snapshot().objects[0].position).toEqual([3,0]);
 });
}
