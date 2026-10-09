import {operationFor} from './actionRegistry';
import type {MathRoboPlan,RoboTarget} from './types';
export type ActionGraph={schemaVersion:1;atomicity:'all-or-nothing';nodes:{id:string;action:string;subAction:string;dependsOn:string[];references:RoboTarget[];preconditions:string[];output:'object'|'measurement'|'state'|'answer'}[]};
/** Execution order is explicit; the existing dry-run planner validates the whole graph before native effects. */
export function actionGraph(plan:MathRoboPlan):ActionGraph{
  return {schemaVersion:1,atomicity:'all-or-nothing',nodes:plan.commands.map((c,index)=>{const spec=operationFor(c.action,c.subAction);return {id:c.id,action:c.action,subAction:c.subAction,dependsOn:index?[plan.commands[index-1].id]:[],references:c.targets??(c.target?[c.target]:[]),preconditions:spec?[...spec.validation,...spec.required.map(field=>`required: ${field}`)]:['registered implemented operation'],output:spec?.createsObject?'object':spec?.returnsValue?'measurement':spec?.mutatesScene?'state':'answer'};})};
}
