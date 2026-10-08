import type { VisualCommand } from '../../offline-intelligence/commands';
import { operationFor } from './actionRegistry';
import { CorrectionStore } from './corrections';
import { preparePlan } from './executionPlanner';
import { parseSemanticPlan } from './semanticParser';
import { ResolutionError } from './targetResolver';
import { emptyScene, readonlySnapshot } from './sceneContext';
import type { MathRoboPlan, RoboMode, RoboObjectDescriptor, RoboResult, RoboSceneContext } from './types';
import {verifyResult,geometryState} from './resultVerifier';
import {remember} from './contextEngine';
import {explainResult} from './explanationEngine';
import {RoboExecutionError,errorCode} from './executionErrors';
import {MODEL_TRAINING_ENABLED} from './buildPolicy';
import {ConversationEngine} from './conversationEngine';
import {EngineRouter} from './engineRouter';
import {recomputeRoboDependencies} from './workspaceDependencies';
export class SemanticEngine {
  readonly conversation=new ConversationEngine();
  readonly engineRouter:EngineRouter;
  executing=false;
  private scene:RoboSceneContext;
  private undoStack:RoboSceneContext[]=[];private redoStack:RoboSceneContext[]=[];
  private temporary:VisualCommand[]=[];
  private automaticSelection:string[]=[];
  constructor(mode:RoboMode,public corrections=new CorrectionStore(),engineRouter=new EngineRouter()) { this.engineRouter=engineRouter;this.scene=emptyScene(mode);this.scene.responseDepth='compact'; }
  setPageContext(path:string){this.scene.activePagePath=path;}
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
  async execute(phrase:string,apply:(command:VisualCommand)=>Promise<string|void>,providedPlan?:MathRoboPlan,readCommitted?:()=>{objects:RoboObjectDescriptor[];selectedIds?:string[]}):Promise<RoboResult> {
    const parsed=providedPlan??this.parse(phrase),continuation=/^(?:run|compute|use [a-z][\w-]*\.|my answer is|answer:|hint|give me a hint|give (?:me )?another example|let|calculate|evaluate|why|explain|show (?:me )?(?:the )?steps|teach me|answer only|quiz me|assume|what can you do|what .*operations.*support|can you solve differential equations|now (?:cosine|sine|tangent)|(?:plot|graph|visualize) (?:it|that|the result))\b/i.test(phrase);
    const pendingAnswer=this.conversation.pending&&!/^(?:solve|differentiate|integrate|simplify|factor|expand|mean|median|determinant|run|compute)\b/i.test(phrase);
    if(!pendingAnswer&&(this.engineRouter.pending||/^convert\b/i.test(phrase)||/^(?:(?:what is|find|calculate|and|what about) (?:the )?)?(?:mean|median|mode|variance|standard deviation|quartiles)\b/i.test(phrase)||continuation||parsed.commands.every(c=>['UNHANDLED','UNSUPPORTED','SOLVE','EVALUATE','SIMPLIFY','EXPAND','FACTOR','SUBSTITUTE','DIFFERENTIATE','INTEGRATE','EXPLAIN'].includes(c.action)))){
      const started=performance.now(),routed=await this.engineRouter.dispatch(phrase,this.scene);
      if(routed&&'visualText'in routed){providedPlan=this.parse(routed.visualText);}
      else if(routed){this.conversation.beginExternal(phrase,this.scene);const result=routed.result,plan:MathRoboPlan={rawPhrase:phrase,confidence:result.success?1:0,commands:[{id:crypto.randomUUID(),rawPhrase:phrase,normalizedPhrase:phrase.toLowerCase(),detectedAction:'FIND',action:'FIND',subAction:'ENGINE_RESULT',mode:this.scene.activeMode,parameters:{engineId:result.engineId,capabilityId:result.capabilityId},confidence:{overall:1,action:1,subAction:1},source:{action:'rule',subAction:'rule'},requiresExecution:false}]};
        if(result.success){this.conversation.pending=undefined;this.scene.previousResult=typeof result.value==='number'||typeof result.value==='boolean'||typeof result.value==='string'?result.value:result.answer??routed.message;this.scene.previousResultTargets=[];remember(this.scene,plan.commands,(result.steps??[]).join('\n')||routed.message);}
        const answer:RoboResult={status:result.success?'success':this.engineRouter.pending?'ambiguous':result.error?.code==='UNSUPPORTED'?'unsupported':'invalid',message:routed.message,value:this.scene.previousResult,plan,effects:[],parseMs:0,executionMs:performance.now()-started,engineExecution:result,verification:{passed:result.verification?.passed??result.success,checks:result.verification?[result.verification.method]:['Existing engine result contract']},explanation:(result.steps??[]).join('\n')};this.conversation.finish(answer,this.scene);return answer;}
    }
    let prepared:ReturnType<ConversationEngine['prepare']>;
    try{prepared=this.conversation.prepare(phrase,providedPlan??this.parse(phrase),this.scene);}catch(error){return {status:'invalid',message:error instanceof Error?error.message:String(error),plan:{rawPhrase:phrase,commands:[],confidence:0},effects:[],parseMs:0,executionMs:0};}
    this.executing=true;
    try{const result:RoboResult=prepared.message?{status:this.conversation.pending?'ambiguous':'success',message:prepared.message,plan:this.conversation.pending?prepared.plan:{...prepared.plan,commands:[]},effects:[],parseMs:0,executionMs:0}:await this.executeTurn(phrase,apply,prepared.plan,readCommitted);
    this.conversation.finish(result,this.scene);return result;}finally{this.executing=false;}
  }
  private async executeTurn(phrase:string,apply:(command:VisualCommand)=>Promise<string|void>,providedPlan?:MathRoboPlan,readCommitted?:()=>{objects:RoboObjectDescriptor[];selectedIds?:string[]}):Promise<RoboResult> {
    const started=performance.now();let plan:MathRoboPlan;
    try{plan=providedPlan??this.parse(phrase);}catch(error){return {status:'invalid',message:String(error),plan:{rawPhrase:phrase,commands:[],confidence:0},effects:[],parseMs:performance.now()-started,executionMs:0};}
    plan.contextSnapshotId=this.scene.snapshotId;
    const parseMs=performance.now()-started;
    const result=(status:RoboResult['status'],message:string,effects:VisualCommand[]=[],value?:RoboResult['value'],candidates?:string[]):RoboResult=>({status,message,effects,value,candidates,plan,parseMs,executionMs:performance.now()-started-parseMs});
    if(plan.commands.some(c=>c.action==='UNHANDLED'))return result('unhandled','');
    const before=structuredClone(this.scene);
    let effects:VisualCommand[]=[];
    try {
      if(plan.commands.length===1&&['UNDO','REDO'].includes(plan.commands[0].action)){
        const isUndo=plan.commands[0].action==='UNDO',stack=isUndo?this.undoStack:this.redoStack,target=stack.at(-1);
        if(!target)return result('invalid',`Nothing to ${isUndo?'undo':'redo'}.`);
        effects=[...this.temporary.map(effect=>({...effect,roboControl:'delete' as const})),...this.diff(this.scene,target)];this.temporary=[];
        for(const effect of effects){const error=await apply(effect);if(error)throw new Error(error);}
        if(readCommitted){const committed=readCommitted();if(geometryState({...target,objects:committed.objects.filter(o=>!o.command.roboTemporary)})!==geometryState(target))throw new RoboExecutionError('VERIFICATION_FAILED','History restoration did not match the saved geometry.');}
        stack.pop();(isUndo?this.redoStack:this.undoStack).push(before);this.scene=structuredClone(target);return result('success',isUndo?'Undid the last Ruhi action.':'Redid the last Ruhi action.',effects);
      }
      const prepared=preparePlan(plan,readonlySnapshot(this.scene));
      const primaryEffect=prepared.effects.filter(effect=>!effect.roboControl).at(-1),dependentEffects=recomputeRoboDependencies(prepared.scene);
      prepared.effects.push(...dependentEffects);
      if(dependentEffects.length&&primaryEffect&&plan.commands.some(c=>['CREATE','PLOT','CONSTRUCT','MOVE','ROTATE','SCALE','RESIZE','CHANGE','DUPLICATE'].includes(c.action)))prepared.effects.push({...primaryEffect,roboControl:'select'});
      const verification=verifyResult(plan,before,prepared.scene);
      effects=prepared.effects;
      // Planning and validation finish before any workspace mutation.
      for(const transient of this.temporary){const error=await apply({...transient,roboControl:'delete'});if(error)throw new Error(error);}this.temporary=[];
      for(const effect of effects){const error=await apply(effect);if(error)throw new Error(error);}
      if(readCommitted){const committed=readCommitted();this.automaticSelection=committed.selectedIds??[];
        const committedScene={...prepared.scene,objects:committed.objects.filter(o=>!o.command.roboTemporary)};
        if(committed.selectedIds&&plan.commands.some(c=>['CREATE','PLOT','CONSTRUCT','MOVE','ROTATE','SCALE','RESIZE','CHANGE','DUPLICATE'].includes(c.action)))prepared.scene.selectedIds=committed.selectedIds.filter(id=>committedScene.objects.some(o=>o.id===id));
        // Verify actual workspace coordinates as well as the proposed semantic state.
        verifyResult(plan,before,committedScene);
        prepared.scene.objects=committedScene.objects.map(o=>({...o,creationOrder:prepared.scene.objects.find(p=>p.id===o.id)?.creationOrder,originalId:prepared.scene.objects.find(p=>p.id===o.id)?.originalId}));
      }
      const mutation=plan.commands.some(c=>operationFor(c.action,c.subAction)?.mutatesScene);
      if(mutation){this.undoStack.push(before);if(this.undoStack.length>100)this.undoStack.shift();this.redoStack=[];}
      this.temporary=effects.filter(effect=>effect.roboTemporary);
      prepared.scene.objects=prepared.scene.objects.filter(object=>!this.temporary.some(effect=>effect.objectId===object.id));
      if(plan.commands.every(command=>command.action==='SHOW')){prepared.scene.lastCreated=before.lastCreated;prepared.scene.lastReferenced=before.lastReferenced;prepared.scene.lastModified=before.lastModified;}
      this.scene=prepared.scene;
      const last=plan.commands.at(-1);if(last&&['DUPLICATE','CONSTRUCT'].includes(last.action)&&this.scene.lastCreated)this.scene.activeObjectIds=[this.scene.lastCreated];
      else if(last&&!['CREATE','FIND','CHECK','COMPARE','COUNT','MARK','SHOW','DESELECT'].includes(last.action)){
        const ids=last.targets??[last.target];const resolved=ids.filter((id):id is string=>typeof id==='string'&&this.scene.objects.some(o=>o.id===id));if(resolved.length)this.scene.activeObjectIds=resolved;
      }
      this.scene.activeObjectIds=this.scene.activeObjectIds?.filter(id=>this.scene.objects.some(o=>o.id===id));
      const explanation=explainResult(plan,before);remember(this.scene,plan.commands,explanation||prepared.messages.join('\n'));
      this.engineRouter.last=undefined;
      const message=prepared.messages.join('\n')+(explanation&&this.scene.responseDepth!=='compact'?`\n${explanation}`:'');
      return {...result('success',message,effects,prepared.value),verification,explanation};
    } catch(error){
      // Restore only affected Robo objects on a failed adapter commit.
      const affected=new Set(effects.map(effect=>effect.objectId));
      for(const id of affected){const prior=before.objects.find(o=>o.id===id),effect=effects.find(e=>e.objectId===id)!;try{await apply(prior?{...prior.command,action:'create'}:{...effect,roboControl:'delete'});}catch{/* Return failure; no semantic state commit. */}}
      if(error instanceof ResolutionError)return {...result(error.candidates.length?'ambiguous':'invalid',error.message,[],undefined,error.candidates),errorCode:error.candidates.length?'AMBIGUOUS_OBJECT':'OBJECT_NOT_FOUND'};
      const message=error instanceof Error?error.message:String(error);return {...result(message.startsWith('UNSUPPORTED:')?'unsupported':'invalid',message),errorCode:error instanceof RoboExecutionError?error.code:errorCode(message)};
    }
  }
  private diff(from:RoboSceneContext,to:RoboSceneContext):VisualCommand[]{
    const selected:VisualCommand[]=to.selectedIds.flatMap(id=>to.objects.filter(o=>o.id===id).map(o=>({...o.command,roboControl:'select' as const})));
    if(!selected.length&&to.objects[0])selected.push({...to.objects[0].command,roboControl:'deselect'});
    return [...from.objects.filter(o=>!to.objects.some(t=>t.id===o.id)).map(o=>({...o.command,roboControl:'delete' as const})),...to.objects.map(o=>({...o.command,action:'create' as const})),...selected];
  }
}
