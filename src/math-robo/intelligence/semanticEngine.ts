import type { VisualCommand } from '../../offline-intelligence/commands';
import { operationFor } from './actionRegistry';
import { CorrectionStore } from './corrections';
import { preparePlan } from './executionPlanner';
import { parseSemanticPlan } from './semanticParser';
import { ResolutionError } from './targetResolver';
import { emptyScene, readonlySnapshot } from './sceneContext';
import type { MathRoboPlan, RoboMode, RoboObjectDescriptor, RoboResult, RoboSceneContext } from './types';
export class SemanticEngine {
  private scene:RoboSceneContext;
  private undoStack:RoboSceneContext[]=[];private redoStack:RoboSceneContext[]=[];
  private temporary:VisualCommand[]=[];
  constructor(mode:RoboMode,public corrections=new CorrectionStore()) { this.scene=emptyScene(mode); }
  snapshot(){return readonlySnapshot(this.scene);}
  sync(objects:RoboObjectDescriptor[],selected?:string[]){
    this.scene.objects=objects.map(object=>({...object,originalId:this.scene.objects.find(o=>o.id===object.id)?.originalId??object.originalId}));
    if(selected)this.scene.selectedIds=selected;
    this.scene.selectedIds=this.scene.selectedIds.filter(id=>objects.some(o=>o.id===id));
    for(const key of ['lastCreated','lastModified','lastReferenced'] as const)if(!objects.some(o=>o.id===this.scene[key]))this.scene[key]=undefined;
  }
  parse(phrase:string):MathRoboPlan {
    const correction=this.corrections.lookup(phrase,this.scene.activeMode);
    if(correction)return {rawPhrase:phrase,commands:correction.map(c=>({...c,id:crypto.randomUUID(),rawPhrase:phrase,source:{action:'correction',subAction:'correction'}})),confidence:1};
    return parseSemanticPlan(phrase,this.scene.activeMode);
  }
  async execute(phrase:string,apply:(command:VisualCommand)=>Promise<string|void>,providedPlan?:MathRoboPlan):Promise<RoboResult> {
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
        stack.pop();(isUndo?this.redoStack:this.undoStack).push(before);this.scene=structuredClone(target);return result('success',isUndo?'Undid the last Ruhi action.':'Redid the last Ruhi action.',effects);
      }
      const prepared=preparePlan(plan,readonlySnapshot(this.scene));
      effects=prepared.effects;
      // Planning and validation finish before any workspace mutation.
      for(const transient of this.temporary){const error=await apply({...transient,roboControl:'delete'});if(error)throw new Error(error);}this.temporary=[];
      for(const effect of effects){const error=await apply(effect);if(error)throw new Error(error);}
      const mutation=plan.commands.some(c=>operationFor(c.action,c.subAction)?.mutatesScene);
      if(mutation){this.undoStack.push(before);if(this.undoStack.length>100)this.undoStack.shift();this.redoStack=[];}
      this.temporary=effects.filter(effect=>effect.roboTemporary);
      prepared.scene.objects=prepared.scene.objects.filter(object=>!this.temporary.some(effect=>effect.objectId===object.id));
      if(plan.commands.every(command=>command.action==='SHOW')){prepared.scene.lastCreated=before.lastCreated;prepared.scene.lastReferenced=before.lastReferenced;prepared.scene.lastModified=before.lastModified;}
      this.scene=prepared.scene;
      return result('success',prepared.messages.join('\n'),effects,prepared.value);
    } catch(error){
      // Restore only affected Robo objects on a failed adapter commit.
      const affected=new Set(effects.map(effect=>effect.objectId));
      for(const id of affected){const prior=before.objects.find(o=>o.id===id),effect=effects.find(e=>e.objectId===id)!;try{await apply(prior?{...prior.command,action:'create'}:{...effect,roboControl:'delete'});}catch{/* Return failure; no semantic state commit. */}}
      if(error instanceof ResolutionError)return result(error.candidates.length?'ambiguous':'invalid',error.message,[],undefined,error.candidates);
      const message=error instanceof Error?error.message:String(error);return result(message.startsWith('UNSUPPORTED:')?'unsupported':'invalid',message);
    }
  }
  private diff(from:RoboSceneContext,to:RoboSceneContext):VisualCommand[]{
    const selected:VisualCommand[]=to.selectedIds.flatMap(id=>to.objects.filter(o=>o.id===id).map(o=>({...o.command,roboControl:'select' as const})));
    if(!selected.length&&to.objects[0])selected.push({...to.objects[0].command,roboControl:'deselect'});
    return [...from.objects.filter(o=>!to.objects.some(t=>t.id===o.id)).map(o=>({...o.command,roboControl:'delete' as const})),...to.objects.map(o=>({...o.command,action:'create' as const})),...selected];
  }
}
