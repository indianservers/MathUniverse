import {bulkEditTrainingRows} from './bulkEditDataset';
import {test,expect,vi} from 'vitest';
import type {VisualCommand} from '../../offline-intelligence/commands';
import {describeObject} from './sceneContext';
const board=vi.hoisted(()=>({commands:[] as VisualCommand[],selectedIds:[] as string[]}));
vi.mock('../../offline-intelligence/workspaceBridge',()=>({
  subscribeRoboScene:()=>()=>undefined,
  waitForRoboWorkspace:async()=>undefined,
  readRoboScene:()=>({objects:board.commands.map(command=>({command})),selectedIds:board.selectedIds}),
  applyVisualCommand:async(_mode:string,command:VisualCommand)=>{
    if(command.roboControl==='select'){board.selectedIds=[command.objectId!];return;}
    if(command.roboControl==='deselect'){board.selectedIds=[];return;}
    if(command.roboControl==='delete'){board.commands=board.commands.filter(o=>o.objectId!==command.objectId);return;}
    const i=board.commands.findIndex(o=>o.objectId===command.objectId);
    if(i>=0)board.commands[i]=structuredClone(command);else board.commands.push(structuredClone(command));
  },
}));
vi.mock('./hierarchicalModel',()=>({loadIntelligenceModel:async()=>{throw new Error('Model unavailable: offline rule check');},inferSemanticHeads:()=>undefined}));
import {liveEngine,runSemanticAssistant} from './liveAssistant';
import {extendedGeometryTrainingRows} from './geometryExtendedDataset';
import {contextToScene} from './semanticDataset';
function reset(){
  const base={dimension:'2d' as const,width:6,height:8,radius:5,color:'#22d3ee',rotation:[0,0,0] as [number,number,number],scale:1,action:'create' as const,roboExplicitVertices:true};
  board.commands=Object.entries({A:[0,0],B:[6,0],C:[6,8],D:[0,8],P:[3,2]}).map(([label,position])=>({...base,kind:'point',objectId:label,roboLabel:label,points:[position]}));
  board.selectedIds=[];
  const engine=liveEngine('geometry2d');engine.conversation.resetContext();engine.engineRouter.resetContext();
  engine.sync(board.commands.map(c=>describeObject(c,'geometry2d')),[],{previousResult:undefined,activeObjectIds:[]});
}
for(const [question,value] of [
  ['What is the area of triangle ABC?',24],
  ['What is the vertical separation between C and D?',0],
  ['What is the distance from C to D?',6],
  ['What are the coordinates of point A?',[0,0]],
  ['Are lines AB and BC perpendicular?',true],
] as const)test('chat route: '+question,async()=>{
  reset();const before=structuredClone(board.commands);
  const result=await runSemanticAssistant(question,'geometry2d','/workspace/geometry');
  expect(result.status,result.message).toBe('success');expect(result.value).toEqual(value);
  expect(result.engineExecution?.engineId).not.toBe('ruhi-context');expect(board.commands).toEqual(before);
});
test('chat route answers proximity questions and commits a midpoint to the board',async()=>{
  reset();const nearest=await runSemanticAssistant('what point is near to 2,3','geometry2d','/workspace/geometry');
  expect(nearest.status,nearest.message).toBe('success');expect(nearest.message).toContain('P');
  const midpoint=await runSemanticAssistant('Mark the midpoint of AB.','geometry2d','/workspace/geometry');
  expect(midpoint.status,midpoint.message).toBe('success');
  expect(board.commands).toHaveLength(6);expect(board.commands.at(-1)!.points).toEqual([[3,0]]);
});
test('distance choices and follow-ups stay read-only through the chat entry point',async()=>{
  reset();const before=structuredClone(board.commands);
  const ask=(text:string)=>runSemanticAssistant(text,'geometry2d','/workspace/geometry');
  expect((await ask('Find the distance')).status).toBe('ambiguous');
  expect((await ask('C')).status).toBe('ambiguous');
  expect(board.commands).toEqual(before);
  expect((await ask('D')).value).toBe(6);
  expect((await ask('Recalculate distance')).value).toBe(6);
  expect((await ask('Show steps')).message).toContain('√');
  expect((await ask('What about A and B?')).value).toBe(6);
  expect((await ask('Is it 6?')).message).toMatch(/^Yes/);
  expect(board.commands).toEqual(before);
});

for(const [index,row] of extendedGeometryTrainingRows().entries())test(`extended chat route ${index+1}: ${row.phrase}`,async()=>{
  const scene=contextToScene(row);board.commands=scene.objects.map(o=>structuredClone(o.command));board.selectedIds=[...scene.selectedIds];
  const engine=liveEngine(row.mode);engine.conversation.resetContext();engine.engineRouter.resetContext();engine.sync([],[]);await engine.importState(JSON.stringify(scene),async()=>undefined);
  const result=await runSemanticAssistant(row.phrase,row.mode,row.mode.endsWith('3d')?'/workspace/3d':'/workspace/geometry');
  expect(result.status,result.message).toBe('success');expect(result.plan.commands[0].subAction).toBe('BOARD_ADVANCED');
  expect(result.engineExecution?.engineId).not.toBe('ruhi-context');
  expect(result.verification?.passed).toBe(true);
});

test('CD bisector and answer actions commit through the chat route',async()=>{
 reset();const before=structuredClone(board.commands);
 const ask=(text:string)=>runSemanticAssistant(text,'geometry2d','/workspace/geometry');
 const result=await ask('Draw the perpendicular bisector of CD.');
 expect(result.status,result.message).toBe('success');
 expect(board.commands.slice(0,5)).toEqual(before);
 const line=board.commands.find(c=>c.roboDependency?.kind==='perpBisector')!;
 expect(line?.linearExtent).toBe('line');expect(line.points[0]).toEqual([3,8]);
 expect(result.message).toContain('Drawn on the board');
 for(const option of result.followUps!){const answer=await ask(option.prompt);expect(answer.status,answer.message).toBe('success');}
 expect(board.commands.some(c=>c.kind==='point'&&JSON.stringify(c.points)==='[[3,8]]')).toBe(true);
});

for(const row of bulkEditTrainingRows())test('bulk edit chat route: '+row.phrase,async()=>{
 const scene=contextToScene(row);board.commands=scene.objects.map(o=>structuredClone(o.command));board.selectedIds=scene.selectedIds;
 const engine=liveEngine('geometry2d');engine.conversation.resetContext();engine.engineRouter.resetContext();engine.sync(scene.objects,scene.selectedIds);
 const result=await runSemanticAssistant(row.phrase,'geometry2d','/workspace/geometry');
 expect(result.status,result.message).toBe('success');expect(result.engineExecution?.engineId).not.toBe('ruhi-context');
 expect(result.effects.some(e=>!e.roboControl||e.roboControl==='visibility')).toBe(true);
});
