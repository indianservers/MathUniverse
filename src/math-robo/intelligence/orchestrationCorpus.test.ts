import {describe,it,expect,afterAll} from 'vitest';
import {mkdirSync} from 'node:fs';
import {writeTestReport as writeFileSync} from '../testReport';
import {SemanticEngine} from './semanticEngine';
import {describeObject} from './sceneContext';
import {geometryState} from './resultVerifier';
import type {VisualCommand} from '../../offline-intelligence/commands';
import type {RoboMode} from './types';
const rows:{conversation:string;mode:string;prompt:string;status:string;message:string;ms:number;passed:boolean;engineId?:string;capabilityId?:string;action?:string;before?:string;after?:string;expectedMutation?:boolean}[]=[];
const modes:RoboMode[]=['graph2d','geometry2d','graph3d','geometry3d'];
describe('600 utterances in 120 independent conversations',()=>{
 for(const mode of modes)for(let n=1;n<=25;n++){
  const solid=mode.endsWith('3d'),circle=n%2===0,dimension=n+1;
  const shape=solid?(circle?'sphere':'cube'):(circle?'circle':'rectangle');
  const create=solid?`Draw a ${shape} ${circle?'of radius':'with side length'} ${dimension}.`:circle?`Draw a circle of radius ${dimension}.`:`Draw a rectangle ${dimension} by 3.`;
  const query=solid?'What is its volume?':'Find its area.';
  it(`${mode} ${shape} ${n}: create, inspect, translate, inspect, undo`,async()=>{
   const engine=new SemanticEngine(mode),committed=new Map<string,VisualCommand>();
   let initial:number|undefined;
   for(const [index,prompt] of [create,query,'Move it 2 units right.',query,'Undo.'].entries()){
    const before=geometryState(engine.snapshot()),started=performance.now();
    const result=await engine.execute(prompt,async command=>{if(command.roboControl==='delete')committed.delete(command.objectId!);else if(!command.roboControl)committed.set(command.objectId!,structuredClone(command));},undefined,()=>({objects:[...committed.values()].map(c=>describeObject(c,mode))}));
    rows.push({conversation:`${mode}-${n}`,mode,prompt,status:result.status,message:result.message,ms:performance.now()-started,passed:result.status==='success',engineId:result.engineExecution?.engineId??'active-workspace',capabilityId:result.engineExecution?.capabilityId,action:result.plan.commands[0]?.action,before,after:geometryState(engine.snapshot()),expectedMutation:index!==1&&index!==3});
    expect(result.status,`${prompt}: ${result.message}`).toBe('success');
    if(index===1||index===3){expect(geometryState(engine.snapshot())).toBe(before);expect(typeof result.value).toBe('number');if(index===1){const expected=solid?(circle?4*Math.PI*dimension**3/3:dimension**3):(circle?Math.PI*dimension**2:dimension*3);expect(result.value).toBeCloseTo(expected);initial=result.value as number;}else expect(result.value).toBeCloseTo(initial!);}
   }
   expect(engine.snapshot().objects).toHaveLength(1);
  });
 }
 for(let n=1;n<=20;n++)it(`specialist ${n}: equation, steps, why, sets and combinatorics`,async()=>{
  const engine=new SemanticEngine('graph2d');
  for(const prompt of [`Solve 2x + ${n} = ${n+12}`,'Show me the steps',`Why did you subtract ${n}?`,`Union {${n}, ${n+1}} and {${n+1}, ${n+2}}`,'Combinations 5 choose 2']){
   const started=performance.now(),result=await engine.execute(prompt,async()=>{});
   rows.push({conversation:`specialist-${n}`,mode:'graph2d',prompt,status:result.status,message:result.message,ms:performance.now()-started,passed:result.status==='success',engineId:result.engineExecution?.engineId,capabilityId:result.engineExecution?.capabilityId,action:result.plan.commands[0]?.action,expectedMutation:false});
   expect(result.status,`${prompt}: ${result.message}`).toBe('success');expect(result.effects).toHaveLength(0);
   if(prompt.startsWith('Solve'))expect(result.message).toMatch(/6/);
   if(prompt.startsWith('Combinations'))expect(result.engineExecution?.value).toBe('10');
  }
 });
});
afterAll(()=>{mkdirSync('artifacts/math-robo-orchestration',{recursive:true});writeFileSync('artifacts/math-robo-orchestration/600-utterance-results.json',JSON.stringify({utterances:rows.length,conversations:new Set(rows.map(r=>r.conversation)).size,passed:rows.filter(r=>r.passed).length,rows},null,2));});
