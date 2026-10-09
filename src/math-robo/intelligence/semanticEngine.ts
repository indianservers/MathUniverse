import {navigationRequest} from './studioCapabilities';
import {geometryEvidence} from './geometryEvidence';
import {executionOutcome,executionFailure} from '../../math-foundation/executionOutcome';
import {canonicalObjectGraph,serializeRoboScene,deserializeRoboScene} from './mathIRAdapter';
import {kernelRequest} from '../kernel/language';
import type { VisualCommand } from '../../offline-intelligence/commands';
import { operationFor } from './actionRegistry';
import { CorrectionStore } from './corrections';
import { preparePlan } from './executionPlanner';
import { parseSemanticPlan } from './semanticParser';
import { ResolutionError,resolveTarget } from './targetResolver';
import { emptyScene, readonlySnapshot } from './sceneContext';
import type { MathRoboPlan, RoboMode, RoboObjectDescriptor, RoboResult, RoboSceneContext } from './types';
import {verifyCommittedObjects,verifyResult,geometryState} from './resultVerifier';
import {remember} from './contextEngine';
import {explainResult} from './explanationEngine';
import {RoboExecutionError,errorCode} from './executionErrors';
import {MODEL_TRAINING_ENABLED} from './buildPolicy';
import {ConversationEngine} from './conversationEngine';
import {EngineRouter} from './engineRouter';
import {recomputeRoboDependencies} from './workspaceDependencies';
import {commandIR} from './commandIR';
import {GroundedTutor} from './groundedTutor';
import {conversationState} from './conversationState';
import {actionGraph} from './actionGraph';
import {mathematicalQuestion} from './mathQuestionRouter';
import {pageMathContext,groundedPageQuestion} from './pageMathContext';
import {measurement} from './geometryQueries';
export class SemanticEngine {
  readonly conversation=new ConversationEngine();
  private tutor=new GroundedTutor();
  private lastOutcome?:import('../../math-foundation/executionOutcome').ExecutionOutcome;
  mathematicalMemory(){return conversationState(this.scene,this.conversation,this.engineRouter,this.lastOutcome);}
  readonly engineRouter:EngineRouter;
  executing=false;
  private scene:RoboSceneContext;
  private undoStack:RoboSceneContext[]=[];private redoStack:RoboSceneContext[]=[];
  private colorHistory:{id:string;before:VisualCommand;afterKey:string}[]=[];
  private colorKey(c:VisualCommand){return JSON.stringify([c.color,c.roboFillColor,c.roboStrokeColor,c.roboAngle?.arcColor]);}
  private temporary:VisualCommand[]=[];
  private automaticSelection:string[]=[];
  private lastChange?:{before:RoboObjectDescriptor[];after:RoboObjectDescriptor[];description:string};
  constructor(mode:RoboMode,public corrections=new CorrectionStore(),engineRouter=new EngineRouter()) { this.engineRouter=engineRouter;this.scene=emptyScene(mode);this.scene.responseDepth='compact'; }
  setPageContext(path:string){if(this.scene.activePagePath&&this.scene.activePagePath!==path){this.engineRouter.resetContext();this.conversation.resetContext();this.tutor.reset();this.lastOutcome=undefined;this.lastChange=undefined;this.scene.previousResult=undefined;this.scene.previousCommands=[];this.scene.previousResults=[];this.scene.previousResultTargets=[];this.scene.lastQueryTargets=[];}this.scene.activePagePath=path;}
  snapshot(){return readonlySnapshot(this.scene);}
  workingMemory(){return {...this.conversation.snapshot(this.scene),activePagePath:this.scene.activePagePath,specialist:{last:this.engineRouter.last,recent:this.engineRouter.recent,assumptions:this.engineRouter.assumptions,variables:this.engineRouter.variables,pending:this.engineRouter.pending}};}
  sync(objects:RoboObjectDescriptor[],selected?:string[],context?:Pick<RoboSceneContext,'lastReferenced'|'previousResult'|'previousResults'|'activeObjectIds'>){
    if(context)Object.assign(this.scene,structuredClone(context));
    this.scene.objects=objects.map(object=>({...object,command:{...object.command,roboDependency:object.command.roboDependency??this.scene.objects.find(o=>o.id===object.id)?.command.roboDependency},creationOrder:this.scene.objects.find(o=>o.id===object.id)?.creationOrder??object.creationOrder,derivedFrom:this.scene.objects.find(o=>o.id===object.id)?.derivedFrom??object.derivedFrom,originalId:this.scene.objects.find(o=>o.id===object.id)?.originalId??object.originalId}));
    if(selected&&JSON.stringify(selected)!==JSON.stringify(this.automaticSelection)){this.scene.previousSelectedIds=this.scene.selectedIds;this.scene.selectedIds=selected;}
    this.scene.selectedIds=this.scene.selectedIds.filter(id=>objects.some(o=>o.id===id));
    for(const key of ['activeObjectIds','lastQueryTargets','recentlyReferencedObjectIds','previousSelectedIds'] as const)this.scene[key]=this.scene[key]?.filter(id=>objects.some(o=>o.id===id));
    for(const key of ['lastCreated','lastModified','lastReferenced'] as const)if(!objects.some(o=>o.id===this.scene[key]))this.scene[key]=undefined;
    this.conversation.sync(this.scene);
  }
  async refreshDependencies(apply:(command:VisualCommand)=>Promise<string|void>){
    if(this.executing)return;
    const updated=structuredClone(this.scene),effects=recomputeRoboDependencies(updated);
    if(!effects.length)return;
    this.executing=true;
    try{for(const effect of effects){const error=await apply(effect);if(error)throw new Error(error);}this.scene=updated;}finally{this.executing=false;}
  }
  parse(phrase:string):MathRoboPlan {
    const correction=MODEL_TRAINING_ENABLED?this.corrections.lookup(phrase,this.scene.activeMode):undefined;
    if(correction)return {rawPhrase:phrase,commands:correction.map(c=>({...c,id:crypto.randomUUID(),rawPhrase:phrase,source:{action:'correction',subAction:'correction'}})),confidence:1};
    return parseSemanticPlan(phrase,this.scene.activeMode);
  }
  private queue:Promise<unknown>=Promise.resolve();
  private current?:AbortController;
  cancelCurrent(){this.current?.abort();this.engineRouter.cancelCalculation();}
  canonicalGraph(){return canonicalObjectGraph(this.scene);}
  exportState(){return serializeRoboScene(this.scene,this.undoStack,this.redoStack);}
  async importState(text:string,apply:(command:VisualCommand)=>Promise<string|void>,readCommitted?:()=>{objects:RoboObjectDescriptor[]}){
    const run=async()=>{const restored=deserializeRoboScene(text,this.scene.activeMode),before=structuredClone(this.scene);this.executing=true;
      try{for(const effect of this.diff(before,restored.scene)){const error=await apply(effect);if(error)throw new Error(error);}if(readCommitted)verifyCommittedObjects(restored.scene,{...restored.scene,objects:readCommitted().objects});this.scene=restored.scene;this.undoStack=restored.history.undo;this.redoStack=restored.history.redo;this.conversation.resetContext();this.engineRouter.resetContext();this.tutor.reset();this.lastOutcome=undefined;this.lastChange=undefined;this.conversation.sync(this.scene);}
      catch(error){for(const effect of this.diff(restored.scene,before)){const rollback=await apply(effect);if(rollback)throw new Error('Import rollback failed: '+rollback);}throw error;}finally{this.executing=false;}};
    const task=this.queue.then(run);this.queue=task.catch(()=>{});return task;
  }
  async execute(phrase:string,apply:(command:VisualCommand)=>Promise<string|void>,providedPlan?:MathRoboPlan,readCommitted?:()=>{objects:RoboObjectDescriptor[];selectedIds?:string[]},options:{signal?:AbortSignal;timeoutMs?:number;requestId?:string}={}):Promise<RoboResult>{
    const requestId=options.requestId??crypto.randomUUID();
    const run=async()=>{const controller=new AbortController();this.current=controller;let timedOut=false;
      const cancel=()=>{controller.abort();this.engineRouter.cancelCalculation();};options.signal?.addEventListener('abort',cancel,{once:true});if(options.signal?.aborted)cancel();
      const timeoutMs=options.timeoutMs??20000,timer=setTimeout(()=>{timedOut=true;cancel();},Math.max(1,Math.min(timeoutMs,120000)));
      const check=()=>{if(controller.signal.aborted)throw new Error(timedOut?'TIMEOUT: Calculation exceeded its time budget.':'CANCELLED: Calculation cancelled.');};
      let answer:RoboResult;
      try{check();answer=await this.executeNow(phrase,async command=>{check();const error=await apply(command);check();return error;},providedPlan,readCommitted,apply);}
      catch(error){answer={status:'invalid',message:error instanceof Error?error.message:String(error),plan:{rawPhrase:phrase,commands:[],confidence:0},effects:[],parseMs:0,executionMs:0};}
      finally{clearTimeout(timer);options.signal?.removeEventListener('abort',cancel);if(this.current===controller)this.current=undefined;}
      answer.execution??=answer.engineExecution?.execution??executionOutcome(controller.signal.aborted?(timedOut?'timeout':'cancelled'):answer.status==='success'?'valid_unverified':answer.status==='unsupported'||answer.status==='unhandled'?'unsupported':executionFailure(answer.errorCode??'INVALID_INPUT'),requestId,answer.message);
      if(answer.execution)answer.execution={...answer.execution,requestId};
      this.lastOutcome=answer.execution;
      if(answer.status==='ambiguous')answer.clarification={kind:answer.candidates?.length?'ambiguous_reference':'missing_parameters',requestId,question:answer.message,slots:this.conversation.pending?[this.conversation.pending.slot]:[],candidates:answer.candidates??[],references:this.conversation.pending?.references??[]};
      return answer;};
    const task=this.queue.then(run);this.queue=task.catch(()=>{});return task;
  }
  private async executeNow(phrase:string,apply:(command:VisualCommand)=>Promise<string|void>,providedPlan?:MathRoboPlan,readCommitted?:()=>{objects:RoboObjectDescriptor[];selectedIds?:string[]},rollbackApply=apply):Promise<RoboResult> {
    if(typeof phrase!=='string'||phrase.length>4096)throw new Error('Input exceeds the 4096-character limit.');
    const navigation=navigationRequest(phrase,this.scene);if(navigation)return navigation;
    if(providedPlan&&providedPlan.commands.length>32)throw new Error('A request is limited to 32 planned operations.');
    if(/^(?:forget that|start over|clear context|reset context|new question)[.!?]*$/i.test(phrase)){this.tutor.reset();this.lastOutcome=undefined;}
    const tutoring=await this.tutor.respond(phrase,this.scene);if(tutoring)return tutoring;
    const previousProof=this.conversation.lastMathResult;if(previousProof?.sceneVersion&&/^(?:why|explain that|explain why|can you explain why)[?.]*$/i.test(phrase)){const unchanged=previousProof.sceneVersion===geometryState(this.scene);if(!unchanged)this.conversation.lastMathResult=undefined;return {status:unchanged?'success':'ambiguous',message:unchanged?previousProof.explanation:'The referenced geometry changed. Ask the verification question again for its current state.',plan:{rawPhrase:phrase,commands:[],confidence:1},effects:[],parseMs:0,executionMs:0};}
    const groundedQuestion=mathematicalQuestion(phrase,this.scene);if(groundedQuestion){if(groundedQuestion.status==='success'){this.engineRouter.last=undefined;this.engineRouter.pending=undefined;this.engineRouter.quiz=undefined;this.engineRouter.quizAnswerModel=undefined;this.tutor.reset();this.scene.previousResult=true;this.conversation.beginExternal(phrase,this.scene);this.conversation.lastMathResult={value:true,explanation:groundedQuestion.message,targets:this.scene.objects.map(o=>o.id),sceneVersion:geometryState(this.scene)};this.conversation.finish(groundedQuestion,this.scene);}return groundedQuestion;}
    if(/^what (?:was|is) its previous length[?.]*$/i.test(phrase)){let value:number|undefined;try{const current=resolveTarget(undefined,this.scene),previous=this.lastChange?.before.find(o=>o.id===current.id);if(previous&&['line','ray','vector'].includes(current.type))value=Number(measurement(previous,'LENGTH'));}catch{/* No stale or guessed object. */}return {status:value===undefined?'ambiguous':'success',message:value===undefined?'Choose an existing line with a recorded completed edit.':`Before the last completed scene edit, its endpoint distance was ${value} units.`,value,plan:{rawPhrase:phrase,commands:[],confidence:1},effects:[],parseMs:0,executionMs:0};}
    const pageAnswer=groundedPageQuestion(phrase,pageMathContext(this.scene.activePagePath??'',this.scene));if(pageAnswer)return {...pageAnswer,plan:{rawPhrase:phrase,commands:[],confidence:1},effects:[],parseMs:0,executionMs:0};
    if(/^what are its dimensions[?.]*$/i.test(phrase)){const ids=this.scene.activeObjectIds??this.scene.selectedIds,candidates=this.scene.objects.filter(o=>['rectangle','square','cube','cuboid'].includes(o.type)),object=candidates.find(o=>ids.includes(o.id))??(candidates.length===1?candidates[0]:undefined);return {status:object?'success':'ambiguous',message:object?'Width '+object.command.width*(object.command.scale??1)+', height '+object.command.height*(object.command.scale??1)+(object.mode.endsWith('3d')?', depth '+(object.command.depth??0)*(object.command.scale??1):'')+'.':'Choose the rectangle or box whose dimensions you want.',value:object?[object.command.width*(object.command.scale??1),object.command.height*(object.command.scale??1)]:undefined,plan:{rawPhrase:phrase,commands:[],confidence:1},effects:[],parseMs:0,executionMs:0};}
    if(/^does (?:the |its )?circumcircle update[?.]*$/i.test(phrase)){const circle=this.scene.objects.find(o=>o.command.roboDependency?.kind==='circumcircle');return {status:'success',message:circle?'Yes. Its center and radius are recomputed from the parent triangle after each completed edit. The side edit is still pending if its length or constraints have not been supplied.':'No dependent circumcircle is present in this workspace.',plan:{rawPhrase:phrase,commands:[],confidence:1},effects:[],parseMs:0,executionMs:0};}
    if(/^explain what changed[?.]*$/i.test(phrase))return {status:'success',message:this.lastChange?.description??'No completed scene change is recorded.',plan:{rawPhrase:phrase,commands:[],confidence:1},effects:[],parseMs:0,executionMs:0};
    if(/^explain why its magnitude remained unchanged[?.]*$/i.test(phrase)){const rotation=this.lastChange?.description.startsWith('ROTATE'),vector=this.scene.objects.find(o=>o.type==='vector');return {status:'success',message:rotation&&vector?'A rotation preserves Euclidean length because its orthogonal transformation preserves the dot product v·v.':'No completed vector rotation is recorded. Supply its endpoints and rotation angle before I can check a particular vector. Rotations preserve Euclidean length.',plan:{rawPhrase:phrase,commands:[],confidence:1},effects:[],parseMs:0,executionMs:0};}
    const parsed=providedPlan??this.parse(phrase),continuation=!!kernelRequest(phrase)||/^(?:run|compute|use [a-z][\w-]*\.|my answer is|answer:|hint|give me a hint|give (?:me )?another example|let|calculate|evaluate|why|explain|show (?:me )?(?:the )?steps|teach me|answer only|quiz me|assume|what can you do|what .*operations.*support|can you solve differential equations|now (?:cosine|sine|tangent)|(?:plot|graph|visualize) (?:it|that|the result))\b/i.test(phrase);
    const pendingAnswer=this.conversation.pending&&!/^(?:solve|differentiate|integrate|simplify|factor|expand|mean|median|determinant|run|compute)\b/i.test(phrase);
    if(!pendingAnswer&&(this.engineRouter.pending||/^convert\b/i.test(phrase)||/^(?:(?:what is|find|calculate|and|what about) (?:the )?)?(?:mean|median|mode|variance|standard deviation|quartiles)\b/i.test(phrase)||continuation||parsed.commands.every(c=>['UNHANDLED','UNSUPPORTED','SOLVE','EVALUATE','SIMPLIFY','EXPAND','FACTOR','SUBSTITUTE','DIFFERENTIATE','INTEGRATE','EXPLAIN'].includes(c.action)))){
      const started=performance.now(),routed=await this.engineRouter.dispatch(phrase,this.scene);
      if(routed&&'visualText'in routed){providedPlan=this.parse(routed.visualText);}
      else if(routed){this.conversation.beginExternal(phrase,this.scene);const result=routed.result,plan:MathRoboPlan={rawPhrase:phrase,confidence:result.success?1:0,commands:[{id:crypto.randomUUID(),rawPhrase:phrase,normalizedPhrase:phrase.toLowerCase(),detectedAction:'FIND',action:'FIND',subAction:'ENGINE_RESULT',mode:this.scene.activeMode,parameters:{engineId:result.engineId,capabilityId:result.capabilityId},confidence:{overall:1,action:1,subAction:1},source:{action:'rule',subAction:'rule'},requiresExecution:false}]};
        if(result.success){this.conversation.pending=undefined;this.scene.previousResult=typeof result.value==='number'||typeof result.value==='boolean'||typeof result.value==='string'?result.value:result.answer??routed.message;this.scene.previousResultTargets=[];remember(this.scene,plan.commands,(result.steps??[]).join('\n')||routed.message);}
        const answer:RoboResult={status:result.success?'success':this.engineRouter.pending?'ambiguous':result.error?.code==='UNSUPPORTED'?'unsupported':'invalid',message:routed.message,value:this.scene.previousResult,plan,effects:[],parseMs:0,executionMs:performance.now()-started,engineExecution:result,verification:{status:result.verificationStatus??'unverified',passed:result.verification?.passed??false,checks:result.verification?[result.verification.method]:[]},explanation:(result.steps??[]).join('\n')};this.conversation.finish(answer,this.scene);return answer;}
    }
    let prepared:ReturnType<ConversationEngine['prepare']>;
    try{prepared=this.conversation.prepare(phrase,providedPlan??this.parse(phrase),this.scene);prepared.plan.ir=prepared.plan.commands.map(commandIR);prepared.plan.atomicity='all-or-nothing';}catch(error){return {status:'invalid',message:error instanceof Error?error.message:String(error),plan:{rawPhrase:phrase,commands:[],confidence:0},effects:[],parseMs:0,executionMs:0};}
    if(this.conversation.pending){const pending=this.conversation.pending,command=pending.plan.commands[pending.index];let resolved:string[]=[];try{if(command.target!==undefined&&command.action!=='CREATE'){const object=resolveTarget(command.target,this.scene);resolved=[object.id,...(object.derivedFrom??[])].filter(id=>this.scene.objects.some(o=>o.id===id));}}catch{/* Ambiguous candidates are already supplied by the clarification. */}pending.references=[...new Set([...(pending.references??[]),...pending.options.filter(id=>this.scene.objects.some(o=>o.id===id)),...resolved])];pending.referenceVersions=Object.fromEntries(pending.references.map(id=>[id,geometryState({...this.scene,objects:this.scene.objects.filter(o=>o.id===id)})]));}
    this.executing=true;
    try{const result:RoboResult=prepared.message?{status:this.conversation.pending?'ambiguous':'success',message:prepared.message,plan:this.conversation.pending?prepared.plan:{...prepared.plan,commands:[]},effects:[],parseMs:0,executionMs:0}:await this.executeTurn(phrase,apply,prepared.plan,readCommitted,rollbackApply);
    this.conversation.finish(result,this.scene);return result;}finally{this.executing=false;}
  }
  private async executeTurn(phrase:string,apply:(command:VisualCommand)=>Promise<string|void>,providedPlan?:MathRoboPlan,readCommitted?:()=>{objects:RoboObjectDescriptor[];selectedIds?:string[]},rollbackApply=apply):Promise<RoboResult> {
    const started=performance.now();let plan:MathRoboPlan;
    try{plan=providedPlan??this.parse(phrase);}catch(error){return {status:'invalid',message:String(error),plan:{rawPhrase:phrase,commands:[],confidence:0},effects:[],parseMs:performance.now()-started,executionMs:0};}
    if(plan.commands.length>32)throw new Error('A request is limited to 32 planned operations.');
    plan.contextSnapshotId=this.scene.snapshotId;
    plan.actionGraph=actionGraph(plan);
    const parseMs=performance.now()-started;
    const result=(status:RoboResult['status'],message:string,effects:VisualCommand[]=[],value?:RoboResult['value'],candidates?:string[]):RoboResult=>({status,message,effects,value,candidates,plan,parseMs,executionMs:performance.now()-started-parseMs});
    if(plan.commands.some(c=>c.action==='UNHANDLED'))return result('unhandled','');
    const before=structuredClone(this.scene);
    let effects:VisualCommand[]=[];
    try {
      if(plan.commands.length===1&&plan.commands[0].action==='UNDO'&&plan.commands[0].parameters.onlyColor){
        let index=-1;for(let i=this.colorHistory.length-1;i>=0;i--){const entry=this.colorHistory[i];if(this.scene.objects.some(o=>o.id===entry.id&&this.colorKey(o.command)===entry.afterKey)){index=i;break;}}if(index<0)return result('invalid','No retained color change can be undone.');
        const entry=this.colorHistory[index],target=structuredClone(this.scene),object=target.objects.find(o=>o.id===entry.id)!;
        object.command.color=entry.before.color;object.style.color=entry.before.color;object.command.roboFillColor=entry.before.roboFillColor;object.command.roboStrokeColor=entry.before.roboStrokeColor;if(object.command.roboAngle)object.command.roboAngle.arcColor=entry.before.roboAngle?.arcColor;
        effects=[{...object.command,action:'update'}];for(const effect of effects){const error=await apply(effect);if(error)throw new Error(error);}if(readCommitted)verifyCommittedObjects(target,{...target,objects:readCommitted().objects.filter(o=>!o.command.roboTemporary)});
        this.undoStack.push(before);this.redoStack=[];this.scene=target;this.colorHistory.splice(index,1);return result('success','Undid only the last color change; geometry and thickness are preserved.',effects);
      }
      if(plan.commands.length===1&&['UNDO','REDO'].includes(plan.commands[0].action)){
        const isUndo=plan.commands[0].action==='UNDO',stack=isUndo?this.undoStack:this.redoStack,target=stack.at(-1);
        if(!target)return result('invalid',`Nothing to ${isUndo?'undo':'redo'}.`);
        effects=[...this.temporary.map(effect=>({...effect,roboControl:'delete' as const})),...this.diff(this.scene,target)];this.temporary=[];
        for(const effect of effects){const error=await apply(effect);if(error)throw new Error(error);}
        if(readCommitted){const committed=readCommitted();if(geometryState({...target,objects:committed.objects.filter(o=>!o.command.roboTemporary)})!==geometryState(target))throw new RoboExecutionError('VERIFICATION_FAILED','History restoration did not match the saved geometry.');}
        stack.pop();(isUndo?this.redoStack:this.undoStack).push(before);this.scene=structuredClone(target);this.lastChange={before:before.objects,after:this.scene.objects,description:(isUndo?'Undo':'Redo')+' restored the saved geometry. Removed: '+(before.objects.filter(o=>!target.objects.some(t=>t.id===o.id)).map(o=>o.label??o.type).join(', ')||'none')+'.'};return result('success',isUndo?'Undid the last Ruhi action.':'Redid the last Ruhi action.',effects);
      }
      const prepared=preparePlan(plan,readonlySnapshot(this.scene));
      canonicalObjectGraph(prepared.scene);
      const primaryEffect=prepared.effects.filter(effect=>!effect.roboControl).at(-1),dependentEffects=recomputeRoboDependencies(prepared.scene);
      prepared.effects.push(...dependentEffects);
      if(dependentEffects.length&&primaryEffect&&plan.commands.some(c=>['CREATE','PLOT','CONSTRUCT','MOVE','ROTATE','SCALE','RESIZE','CHANGE','DUPLICATE'].includes(c.action)))prepared.effects.push({...primaryEffect,roboControl:'select'});
      canonicalObjectGraph(prepared.scene);
      const verification=verifyResult(plan,before,prepared.scene),evidence=geometryEvidence(plan,before,prepared.scene);if(evidence.level==='contradicted')throw new RoboExecutionError('VERIFICATION_FAILED',evidence.counterexample!.reason);
      effects=prepared.effects;
      // Planning and validation finish before any workspace mutation.
      for(const transient of this.temporary){const error=await apply({...transient,roboControl:'delete'});if(error)throw new Error(error);}this.temporary=[];
      for(const effect of effects){const error=await apply(effect);if(error)throw new Error(error);}
      if(readCommitted){const committed=readCommitted();this.automaticSelection=committed.selectedIds??[];
        const committedScene={...prepared.scene,objects:committed.objects.filter(o=>!o.command.roboTemporary)};
        if(committed.selectedIds&&plan.commands.some(c=>['CREATE','PLOT','CONSTRUCT','MOVE','ROTATE','SCALE','RESIZE','CHANGE','DUPLICATE'].includes(c.action)))prepared.scene.selectedIds=committed.selectedIds.filter(id=>committedScene.objects.some(o=>o.id===id));
        // Verify actual workspace coordinates as well as the proposed semantic state.
        verifyCommittedObjects(prepared.scene,committedScene);
        verifyResult(plan,before,committedScene);
        prepared.scene.objects=committedScene.objects.map(o=>({...o,creationOrder:prepared.scene.objects.find(p=>p.id===o.id)?.creationOrder,originalId:prepared.scene.objects.find(p=>p.id===o.id)?.originalId}));
      }
      const mutation=plan.commands.some(c=>operationFor(c.action,c.subAction)?.mutatesScene);
      if(mutation){this.lastChange={before:before.objects,after:structuredClone(prepared.scene.objects),description:plan.commands.map(c=>c.action+':'+c.subAction).join(', ')+' completed; dependent constructions were recomputed.'};this.undoStack.push(before);if(this.undoStack.length>100)this.undoStack.shift();this.redoStack=[];}
      this.temporary=effects.filter(effect=>effect.roboTemporary);
      prepared.scene.objects=prepared.scene.objects.filter(object=>!this.temporary.some(effect=>effect.objectId===object.id));
      if(plan.commands.every(command=>command.action==='SHOW')){prepared.scene.lastCreated=before.lastCreated;prepared.scene.lastReferenced=before.lastReferenced;prepared.scene.lastModified=before.lastModified;}
      for(const object of prepared.scene.objects){const prior=before.objects.find(o=>o.id===object.id);if(prior&&this.colorKey(prior.command)!==this.colorKey(object.command))this.colorHistory.push({id:object.id,before:structuredClone(prior.command),afterKey:this.colorKey(object.command)});}this.colorHistory=this.colorHistory.slice(-64);
      this.scene=prepared.scene;
      const last=plan.commands.at(-1);if(last&&['DUPLICATE','CONSTRUCT'].includes(last.action)&&this.scene.lastCreated)this.scene.activeObjectIds=[this.scene.lastCreated];
      else if(last&&!['CREATE','FIND','CHECK','COMPARE','COUNT','MARK','SHOW','DESELECT'].includes(last.action)){
        const ids=last.targets??[last.target];const resolved=ids.filter((id):id is string=>typeof id==='string'&&this.scene.objects.some(o=>o.id===id));if(resolved.length)this.scene.activeObjectIds=resolved;
      }
      this.scene.activeObjectIds=this.scene.activeObjectIds?.filter(id=>this.scene.objects.some(o=>o.id===id));
      const explanation=explainResult(plan,before);remember(this.scene,plan.commands,explanation||prepared.messages.join('\n'));
      this.engineRouter.last=undefined;
      const message=prepared.messages.join('\n')+(explanation&&this.scene.responseDepth!=='compact'?`\n${explanation}`:'');
      return {...result('success',message,effects,prepared.value),verification,explanation,execution:executionOutcome(evidence.independent&&evidence.passed?'verified':'valid_unverified',crypto.randomUUID(),message,evidence)};
    } catch(error){
      // Restore only affected Robo objects on a failed adapter commit.
      const affected=new Set(effects.map(effect=>effect.objectId).filter((id):id is string=>!!id));
      let rollbackFailed=false;
      for(const id of affected){const prior=before.objects.find(o=>o.id===id),effect=effects.find(e=>e.objectId===id)!;try{const rollbackError=await rollbackApply(prior?{...prior.command,action:'create'}:{...effect,roboControl:'delete'});if(rollbackError)rollbackFailed=true;}catch{rollbackFailed=true;}}
      if(readCommitted&&affected.size)try{verifyCommittedObjects(before,{...before,objects:readCommitted().objects.filter(o=>!o.command.roboTemporary)});}catch{rollbackFailed=true;}
      if(rollbackFailed)return {...result('invalid','The request failed, and some workspace changes could not be restored. Please inspect the workspace and use its Undo control.'),errorCode:'EXECUTION_FAILED'};
      if(error instanceof ResolutionError)return {...result(error.candidates.length?'ambiguous':'invalid',error.message,[],undefined,error.candidates),errorCode:error.candidates.length?'AMBIGUOUS_OBJECT':'OBJECT_NOT_FOUND'};
      const message=error instanceof Error?error.message:String(error),friendly=message.replace(/^UNSUPPORTED:\s*([A-Z_]+):([A-Z_]+).*$/,(_,action:string,kind:string)=>`I cannot ${action.toLowerCase()} ${kind.toLowerCase().replaceAll('_',' ')} in this workspace yet.`).replace(/^UNSUPPORTED:\s*/,'');return {...result(message.startsWith('UNSUPPORTED:')?'unsupported':'invalid',friendly),errorCode:error instanceof RoboExecutionError?error.code:errorCode(message)};
    }
  }
  private diff(from:RoboSceneContext,to:RoboSceneContext):VisualCommand[]{
    const selected:VisualCommand[]=to.selectedIds.flatMap(id=>to.objects.filter(o=>o.id===id).map(o=>({...o.command,roboControl:'select' as const})));
    if(!selected.length&&to.objects[0])selected.push({...to.objects[0].command,roboControl:'deselect'});
    return [...from.objects.filter(o=>!to.objects.some(t=>t.id===o.id)).map(o=>({...o.command,roboControl:'delete' as const})),...to.objects.map(o=>({...o.command,action:'create' as const})),...selected];
  }
}
