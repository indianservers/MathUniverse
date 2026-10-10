import {executionOutcome} from '../../math-foundation/executionOutcome';
import {outlineVertices,type VisualCommand} from '../../offline-intelligence/commands';
import {kernelRequest} from '../kernel/language';
import { readRoboScene, applyVisualCommand,subscribeRoboScene,waitForRoboWorkspace } from '../../offline-intelligence/workspaceBridge';
import { CorrectionStore } from './corrections';
import { SemanticEngine } from './semanticEngine';
import {EngineRouter} from './engineRouter';
import { describeObject } from './sceneContext';
import { inferSemanticHeads, loadIntelligenceModel } from './hierarchicalModel';
import type { RoboMode,RoboResult } from './types';
import {migrateCompatibilityPlan} from './migration';
import {operationFor} from './actionRegistry';
import {geometryState} from './resultVerifier';
import {classifyRequest} from './requestClassifier';
import {ContextAssistant} from './contextAssistant';
import {currentPageCapability} from './pageCapabilities';
import {routeQuery} from '../../utils/mathEngine/queryRouter';
let corrections:CorrectionStore|undefined;
const engines=new Map<RoboMode,SemanticEngine>();
const contextualSessions=new Map<string,ContextAssistant>();
const contextTurns=new Map<RoboMode,boolean>();
subscribeRoboScene(mode=>{const engine=engines.get(mode);if(engine&&!engine.executing){const snapshot=readRoboScene(mode);engine.sync(snapshot.objects.map(o=>describeObject(o.command,mode,'vertices' in o?o.vertices as number[][]|undefined:undefined)),snapshot.selectedIds);void engine.refreshDependencies(command=>applyVisualCommand(mode,command)).catch(error=>console.warn('Ruhi dependency refresh:',error));}});
export function liveEngine(mode:RoboMode){
  if(!corrections){let storage:Storage|undefined;try{storage=window.localStorage;}catch{/* Optional local persistence. */}corrections=new CorrectionStore(storage);}
  let engine=engines.get(mode);if(!engine){engine=new SemanticEngine(mode,corrections,new EngineRouter());engines.set(mode,engine);}return engine;
}
async function runSemanticAssistantNow(phrase:string,mode:RoboMode,pagePath?:string){
  const lastTurnWasContext=contextTurns.get(mode)??false;const engine=liveEngine(mode);if(pagePath)engine.setPageContext(pagePath);if(mode!=='normal')await waitForRoboWorkspace(mode);const snapshot=readRoboScene(mode);
  if(mode!=='normal')engine.sync(snapshot.objects.map(o=>describeObject(o.command,mode,'vertices' in o?o.vertices as number[][]|undefined:undefined)),snapshot.selectedIds);
  const beforeHash=geometryState(engine.snapshot());
  if(phrase.length>4096||/^(?:open|go to|take me to)\b/i.test(phrase)){const result=await engine.execute(phrase,async()=>undefined);return {...result,requestKind:classifyRequest(phrase),neural:undefined,inferenceMs:0,objects:engine.snapshot().objects.length,sceneHash:beforeHash,beforeHash};}
  let neural;const modelStart=performance.now();
  try{if(!kernelRequest(phrase))neural=inferSemanticHeads(await loadIntelligenceModel(),phrase,mode);}catch{/* Validated semantic rules remain local and usable. */}
  const inferenceMs=performance.now()-modelStart;
  const plan=migrateCompatibilityPlan(engine.parse(phrase),engine.snapshot());
  const declaredUnsupportedCreation=plan.commands.length===1&&plan.commands[0].action==='CREATE'&&!!operationFor('CREATE',plan.commands[0].subAction)&&!operationFor('CREATE',plan.commands[0].subAction)!.implemented;
  const requestKind=classifyRequest(phrase);
  const route=routeQuery(phrase),specialist=/^(?:quiz me|give (?:me )?another example)\b/i.test(phrase)||!!kernelRequest(phrase)||['solve','cas','differentiate','integrate','statistics','matrix','trigonometry','complex','units','sets','logic','combinatorics','probability'].includes(route.intent)||/^\s*(?:run|use|compute)\s+[\w-]+\.[\w]+\s*\[/i.test(phrase)||engine.snapshot().previousResult!==undefined&&/^what about (?:half|double|twice) (?:of )?it[?.!]*$/i.test(phrase)||/^\s*(?:calculate|compute|evaluate|work out|find the answer(?: to)?)?\s*[\d(][\d\s+*/().^-]*[?.!]?\s*$/i.test(phrase);
  const nativeAction=plan.commands.some(c=>operationFor(c.action,c.subAction)?.implemented&& !['FIND','SHOW','EXPLAIN'].includes(c.action));
  const followupToMath=!lastTurnWasContext&&!!(engine.engineRouter.last||engine.snapshot().previousResult)&&(requestKind==='EXPLANATION_REQUEST'||/^(?:hint|give me (?:a|another) hint)$/.test(phrase));
  const pendingNative=!!(engine.conversation.pending||engine.engineRouter.pending||engine.engineRouter.quiz&&/^(?:hint|give me (?:a|another) hint|show (?:the )?answer|check my answer|my answer is|answer:|give (?:me )?another example)\b/i.test(phrase));
  const groundedFollowup=engine.snapshot().objects.length>0&&(/^(?:prove|verify|explain why)\b/i.test(phrase)||/^(?:i think (?:the )?area is|my answer is|answer:|give me (?:a|another) hint|explain in detail|explain briefly)\b/i.test(phrase));
  const sceneContinuation=groundedFollowup||/^(?:does (?:the |its )?circumcircle update|explain what changed|explain why its magnitude remained unchanged)/i.test(phrase)||engine.snapshot().objects.length>0&&(/^(?:no[, ]|actually\b|instead\b|radius\b|center\b|twice\b|(?:and )?(?:now|what about now)[?.!]*$)/i.test(phrase)||/\b(?:changed mathematically|stayed the same)\b/i.test(phrase));
  if(pagePath&&!sceneContinuation&&!pendingNative&&!nativeAction&&!specialist&&!followupToMath&&(plan.commands.every(c=>['UNSUPPORTED','UNHANDLED','EXPLAIN'].includes(c.action))||currentPageCapability()&&mode==='normal'&&!engine.snapshot().objects.length&&plan.commands.every(c=>c.action==='SHOW'))){
    try{
      const key=mode+':'+pagePath;let assistant=contextualSessions.get(key);if(!assistant){assistant=new ContextAssistant();contextualSessions.set(key,assistant);if(contextualSessions.size>32)contextualSessions.delete(contextualSessions.keys().next().value!);}const contextual=await assistant.answer(phrase,pagePath,engine.snapshot());
      if(!(contextual.status==='unsupported'&&contextual.prediction.intent==='practice')){
      const contextPlan={rawPhrase:phrase,confidence:contextual.prediction.intentConfidence,commands:[]};
      const result:RoboResult={execution:executionOutcome(contextual.status==='success'?'valid_unverified':contextual.status==='unsupported'?'unsupported':'invalid_input',crypto.randomUUID(),contextual.message),status:contextual.status,message:contextual.message,plan:contextPlan,effects:[],parseMs:0,executionMs:contextual.prediction.inferenceMs,verification:{passed:contextual.verified,checks:contextual.verified?['Reviewed knowledge record or verified native page capability']:[]},engineExecution:{success:contextual.status==='success',engineId:'ruhi-context',capabilityId:contextual.knowledgeId??'clarify',answer:contextual.message,metadata:{contextPrediction:contextual.prediction,simulation:contextual.simulation}}};
      engine.conversation.beginExternal(phrase,engine.snapshot());engine.conversation.finish(result,engine.snapshot());contextTurns.set(mode,true);
      return {...result,contextPrediction:contextual.prediction,requestKind,neural,inferenceMs,objects:engine.snapshot().objects.length,sceneHash:beforeHash,beforeHash};
      }
    }catch(error){console.warn('Ruhi context model unavailable:',error);}
  }
  if(plan.commands.length===1&&['SOLVE','EVALUATE','SIMPLIFY','EXPAND','FACTOR','SUBSTITUTE','DIFFERENTIATE','INTEGRATE'].includes(plan.commands[0].action))plan.commands[0].action='UNHANDLED';
  // A high-confidence object-type prediction can propose a paraphrase. It still passes the normal planner and validator.
  if(!declaredUnsupportedCreation&&requestKind==='COMMAND'&&neural&&plan.commands.length===1&&(!operationFor(plan.commands[0].action,plan.commands[0].subAction)?.implemented)&&neural.action.label==='CREATE'&&neural.action.score>=.95&&neural.subAction.score>=.95&&/\b(draw|make|sketch|create|build|add)\b/i.test(phrase)){
    const proposed=engine.parse(`Create ${neural.subAction.label.toLowerCase()} ${phrase}`);
    if(proposed.commands.length===1&&proposed.commands[0].action==='CREATE'){plan.commands=proposed.commands;plan.commands[0].rawPhrase=phrase;plan.commands[0].source={action:'model',subAction:'model'};plan.commands[0].confidence={overall:Math.min(neural.action.score,neural.subAction.score),action:neural.action.score,subAction:neural.subAction.score};}
  }
  if(!declaredUnsupportedCreation&&plan.commands.length===1&&plan.commands[0].action==='CREATE'&&!operationFor(plan.commands[0].action,plan.commands[0].subAction)?.implemented){
    const {getRoboLearning}=await import('../../offline-intelligence/roboLearning');const inferred=await getRoboLearning().interpret(phrase,mode);
    if(inferred.command?.action==='create'){const command=inferred.command;plan.commands[0].subAction=command.kind.toUpperCase();plan.commands[0].parameters={legacy:command,width:command.width,height:command.height,radius:command.radius,points:command.points};plan.commands[0].source={action:'model',subAction:'model'};}
  }
  const motionHint=(command:VisualCommand)=>{
    if(plan.commands.length!==1||plan.commands[0].action!=='ROTATE')return undefined;
    const parameters=plan.commands[0].parameters,object=snapshot.objects.find(o=>o.command.objectId===command.objectId);
    const vertices=object?('vertices' in object?object.vertices as number[][]|undefined:undefined)??outlineVertices(object.command):[];
    const vertex=(object?.command.roboVertexLabels??['A','B','C']).indexOf(String(parameters.vertex??'A'));
    return {angle:parameters.angle,pivot:parameters.anchor==='origin'?[0,0]:parameters.anchor==='vertex'?vertices[vertex]:undefined};
  };
  const result=await engine.execute(phrase,command=>mode==='normal'?Promise.resolve():applyVisualCommand(mode,command,motionHint(command)),plan,mode==='normal'?undefined:()=>{const committed=readRoboScene(mode);return {objects:committed.objects.map(o=>describeObject(o.command,mode,'vertices' in o?o.vertices as number[][]:undefined)),selectedIds:committed.selectedIds};});
  contextTurns.set(mode,false);
  return {...result,requestKind,neural,inferenceMs,objects:engine.snapshot().objects.length,sceneHash:geometryState(engine.snapshot()),beforeHash};
}

const motionTurns=new Map<RoboMode,Promise<unknown>>();
export function runSemanticAssistant(phrase:string,mode:RoboMode,pagePath?:string){
 const next=(motionTurns.get(mode)??Promise.resolve()).catch(()=>undefined).then(()=>runSemanticAssistantNow(phrase,mode,pagePath));
 motionTurns.set(mode,next);return next;
}
