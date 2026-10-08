import {parseSemanticPlan} from './semanticParser';
import type {MathRoboCommand,RoboMode} from './types';
export type CorrectionCandidate={id:string;originalText:string;predictedAction:string;correctedAction:string;correctedSubaction:string;commands:MathRoboCommand[];mode:RoboMode;contextSummary:{objectCount:number};timestamp:string;approved:boolean};
const KEY='ruhi-correction-candidates-v4.1';
export class CorrectionQueue{
  constructor(private storage?:Pick<Storage,'getItem'|'setItem'>){}
  list():CorrectionCandidate[]{try{return JSON.parse(this.storage?.getItem(KEY)??'[]');}catch{return [];}}
  submit(originalText:string,correctedText:string,mode:RoboMode,predictedAction='',objectCount=0){
    const commands=parseSemanticPlan(correctedText,mode).commands;
    if(!commands.length||commands.some(c=>['UNHANDLED','UNSUPPORTED'].includes(c.action)))throw new Error('Provide a recognized correction for admin review.');
    const candidate:CorrectionCandidate={id:crypto.randomUUID(),originalText,predictedAction,correctedAction:commands[0].action,correctedSubaction:commands[0].subAction,commands,mode,contextSummary:{objectCount},timestamp:new Date().toISOString(),approved:false};
    this.storage?.setItem(KEY,JSON.stringify([...this.list(),candidate].slice(-5000)));return candidate;
  }
  approve(id:string){const rows=this.list(),candidate=rows.find(c=>c.id===id);if(!candidate)throw new Error('Correction not found.');candidate.approved=true;this.storage?.setItem(KEY,JSON.stringify(rows));return candidate;}
}
