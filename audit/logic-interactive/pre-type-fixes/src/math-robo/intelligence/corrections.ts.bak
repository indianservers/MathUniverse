import { parseSemanticPlan } from './semanticParser';
import { validateCommand } from './commandValidator';
import type { MathRoboCommand, RoboMode } from './types';
const KEY='math-robo-semantic-corrections-v4';
const normalized=(text:string)=>text.toLowerCase().trim().replace(/\s+/g,' ');
export type SemanticCorrection={phrase:string;mode:RoboMode;commands:MathRoboCommand[];createdAt:string};
export class CorrectionStore {
  private items:SemanticCorrection[]=[];
  constructor(private storage?:Pick<Storage,'getItem'|'setItem'|'removeItem'>) {
    try { const saved=JSON.parse(storage?.getItem(KEY)??'[]') as unknown;if(Array.isArray(saved))this.items=saved.filter(item=>typeof item?.phrase==='string'&&Array.isArray(item.commands)&&item.commands.every((command:MathRoboCommand)=>{try{validateCommand(command);return true;}catch{return false;}})).slice(-5000); }catch{/* Ignore corrupt storage. */}
    if(!this.items.length) {
      try {const legacy=JSON.parse(storage?.getItem('math-robo-learning-v1')??'[]') as {phrase:string;canonical:string;mode:RoboMode}[];
        for(const row of legacy){try{const commands=parseSemanticPlan(row.canonical,row.mode).commands;commands.forEach(validateCommand);this.items.push({phrase:row.phrase,mode:row.mode,commands,createdAt:new Date().toISOString()});}catch{/* Preserve unsupported legacy corrections in v3. */}}
        if(this.items.length)this.persist();
      }catch{/* Legacy key stays intact. */}
    }
  }
  get count(){return this.items.length;} list(){return structuredClone(this.items);}
  private persist(){if(!this.storage)throw new Error('Browser correction storage is unavailable.');this.storage.setItem(KEY,JSON.stringify(this.items));}
  teach(phrase:string,canonical:string,mode:RoboMode){
    if(!phrase.trim()||phrase.length>500||canonical.length>2000)throw new Error('Use a phrase up to 500 characters and corrected commands up to 2,000 characters.');
    const commands=parseSemanticPlan(canonical,mode).commands;commands.forEach(validateCommand);
    const next=[...this.items.filter(item=>normalized(item.phrase)!==normalized(phrase)||item.mode!==mode),{phrase:phrase.trim(),mode,commands,createdAt:new Date().toISOString()}].slice(-5000);
    const old=this.items;this.items=next;try{this.persist();}catch(error){this.items=old;throw error;}
  }
  lookup(phrase:string,mode:RoboMode){
    const exact=this.items.find(item=>item.mode===mode&&normalized(item.phrase)===normalized(phrase));if(exact)return structuredClone(exact.commands);
    // Similarity is deliberately conservative and never ignores mathematical values.
    const tokens=new Set(normalized(phrase).split(/\s+/));const nums=phrase.match(/-?\d+(?:\.\d+)?/g)?.join(',')??'';
    const ranked=this.items.filter(item=>item.mode===mode&&(item.phrase.match(/-?\d+(?:\.\d+)?/g)?.join(',')??'')===nums).map(item=>{
      const other=new Set(normalized(item.phrase).split(/\s+/));const intersection=[...tokens].filter(token=>other.has(token)).length;
      return {item,score:intersection/new Set([...tokens,...other]).size};
    }).sort((a,b)=>b.score-a.score);
    if(ranked[0]?.score>=.95&&(!ranked[1]||ranked[0].score-ranked[1].score>.1))return structuredClone(ranked[0].item.commands);
    return undefined;
  }
  clear(){this.storage?.removeItem(KEY);this.items=[];}
}
