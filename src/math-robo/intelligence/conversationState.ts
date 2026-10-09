import {geometryState} from './resultVerifier';
import type {RoboSceneContext} from './types';
import type {ConversationEngine} from './conversationEngine';
import type {EngineRouter} from './engineRouter';
import type {ExecutionOutcome} from '../../math-foundation/executionOutcome';
export interface MathematicalConversationState {
  schemaVersion:1;scope:string;
  working:{selectedIds:string[];activeIds:string[];resolvedReferences:string[];pending:ConversationEngine['pending']};
  session:{currentTask?:{action:string;value:unknown};assumptions:string[];variables:Record<string,string>;history:ConversationEngine['turns'];verification?:ExecutionOutcome};
  project:{objects:{id:string;version:string;parents:string[]}[];persistence:'explicit-scene-envelope'};
}
/** Read-only typed projection. Existing scene/history remain authoritative. */
export function conversationState(scene:RoboSceneContext,conversation:ConversationEngine,router:EngineRouter,verification?:ExecutionOutcome):MathematicalConversationState{
  return structuredClone({schemaVersion:1,scope:`${scene.activeMode}:${scene.activePagePath??'workspace'}`,working:{selectedIds:scene.selectedIds,activeIds:scene.activeObjectIds??[],resolvedReferences:conversation.turns.at(-1)?.resolvedReferences??[],pending:conversation.pending},session:{currentTask:scene.previousCommands?.at(-1)?{action:scene.previousCommands.at(-1)!.action,value:scene.previousResult}:undefined,assumptions:router.assumptions,variables:router.variables,history:conversation.turns,verification},project:{objects:scene.objects.map(o=>({id:o.id,version:geometryState({...scene,objects:[o]}),parents:o.command.roboDependency?.parents.map(p=>p.objectId)??[]})),persistence:'explicit-scene-envelope'}});
}
