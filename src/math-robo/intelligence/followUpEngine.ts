import type {PendingCommand} from './conversationEngine';
import type {MathRoboPlan} from './types';
/** Holds canonical commands across turns; no canvas effects are applied here. */
export class FollowUpEngine {
  pending?:PendingCommand;
  protected ask(plan:MathRoboPlan,index:number,slot:string,question:string,options:string[]=[]){
    this.pending={plan:structuredClone(plan),index,slot,question,options};return {plan,message:question};
  }
}
