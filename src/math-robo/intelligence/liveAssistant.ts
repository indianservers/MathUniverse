import { readRoboScene, applyVisualCommand } from '../../offline-intelligence/workspaceBridge';
import { CorrectionStore } from './corrections';
import { SemanticEngine } from './semanticEngine';
import { describeObject } from './sceneContext';
import { inferSemanticHeads, loadIntelligenceModel } from './hierarchicalModel';
import type { RoboMode } from './types';
import {migrateCompatibilityPlan} from './migration';
import {operationFor} from './actionRegistry';
let corrections:CorrectionStore|undefined;
const engines=new Map<RoboMode,SemanticEngine>();
export function liveEngine(mode:RoboMode){
  if(!corrections){let storage:Storage|undefined;try{storage=window.localStorage;}catch{/* Optional local persistence. */}corrections=new CorrectionStore(storage);}
  let engine=engines.get(mode);if(!engine){engine=new SemanticEngine(mode,corrections);engines.set(mode,engine);}return engine;
}
export async function runSemanticAssistant(phrase:string,mode:RoboMode){
  const engine=liveEngine(mode),snapshot=readRoboScene(mode);
  engine.sync(snapshot.objects.map(o=>describeObject(o.command,mode,'vertices' in o?o.vertices as number[][]|undefined:undefined)),snapshot.selectedIds);
  let neural;const modelStart=performance.now();
  try{neural=inferSemanticHeads(await loadIntelligenceModel(),phrase,mode);}catch{/* Validated semantic rules remain local and usable. */}
  const inferenceMs=performance.now()-modelStart;
  const plan=migrateCompatibilityPlan(engine.parse(phrase),engine.snapshot());
  if(plan.commands.length===1&&['SOLVE','EVALUATE','SIMPLIFY','EXPAND','FACTOR','SUBSTITUTE','DIFFERENTIATE','INTEGRATE','EXPLAIN'].includes(plan.commands[0].action))plan.commands[0].action='UNHANDLED';
  // A high-confidence object-type prediction can propose a paraphrase. It still passes the normal planner and validator.
  if(neural&&plan.commands.length===1&&(!operationFor(plan.commands[0].action,plan.commands[0].subAction)?.implemented)&&neural.action.label==='CREATE'&&neural.action.score>=.95&&neural.subAction.score>=.95&&/\b(draw|make|sketch|create|build|add)\b/i.test(phrase)){
    const proposed=engine.parse(`Create ${neural.subAction.label.toLowerCase()} ${phrase}`);
    if(proposed.commands.length===1&&proposed.commands[0].action==='CREATE'){plan.commands=proposed.commands;plan.commands[0].rawPhrase=phrase;plan.commands[0].source={action:'model',subAction:'model'};plan.commands[0].confidence={overall:Math.min(neural.action.score,neural.subAction.score),action:neural.action.score,subAction:neural.subAction.score};}
  }
  if(plan.commands.length===1&&plan.commands[0].action==='CREATE'&&!operationFor(plan.commands[0].action,plan.commands[0].subAction)?.implemented){
    const {getRoboLearning}=await import('../../offline-intelligence/roboLearning');const inferred=await getRoboLearning().interpret(phrase,mode);
    if(inferred.command?.action==='create'){const command=inferred.command;plan.commands[0].subAction=command.kind.toUpperCase();plan.commands[0].parameters={legacy:command,width:command.width,height:command.height,radius:command.radius,points:command.points};plan.commands[0].source={action:'model',subAction:'model'};}
  }
  const result=await engine.execute(phrase,command=>applyVisualCommand(mode,command),plan);
  return {...result,neural,inferenceMs,objects:engine.snapshot().objects.length};
}
