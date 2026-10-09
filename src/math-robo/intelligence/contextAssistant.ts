import {pageMathContext,groundedPageQuestion} from './pageMathContext';
import {inferContext,loadContextModel,type ContextPrediction,type ContextInput} from './ruhiContextNet';
import {pageKnowledge,knowledgeById,type KnowledgeRecord} from './contextKnowledge';
import {currentPageCapability,executePigeonhole} from './pageCapabilities';
import {ceilDivision} from '../../studios/discrete/combinatorics/combinatoricsMath';
import type {RoboSceneContext} from './types';
import {classifyRequest} from './requestClassifier';
import {resolveTarget} from './targetResolver';
type Answer={status:'success'|'ambiguous'|'unsupported'|'invalid';message:string;prediction:ContextPrediction;knowledgeId?:string;verified:boolean;simulation?:unknown};
export class ContextAssistant{
 lastPrediction?:ContextPrediction;
 last?:KnowledgeRecord;previous?:KnowledgeRecord;pageId?:string;history:{question:string;knowledgeId?:string}[]=[];
 pending?:{question:string};
 async answer(question:string,path:string,scene:RoboSceneContext):Promise<Answer>{
  const capability=currentPageCapability(),page=pageKnowledge(path),active=capability?knowledgeById(capability.knowledgeId):page&&(knowledgeById(page.id)??page);
  if(this.pageId&&this.pageId!==page?.id&&this.last)this.previous=this.last;
  this.pageId=page?.id;
  const selected=scene.objects.filter(o=>scene.selectedIds.includes(o.id));
  const input:ContextInput={question,pageVocabulary:active?.vocabulary??'',previousVocabulary:this.last?.vocabulary??this.previous?.vocabulary,selectedTypes:selected.map(o=>o.type),simulation:capability?.read(),hasPrevious:!!this.last};
  const prediction=inferContext(await loadContextModel(),input);
  this.lastPrediction=prediction;
  const grounded=groundedPageQuestion(question,pageMathContext(path,scene));if(grounded&&!(grounded.status==='unsupported'&&active?.definition))return {...grounded,prediction,verified:false};
  const reply=(status:Answer['status'],message:string,record?:KnowledgeRecord,extra:Partial<Answer>={}):Answer=>{
   if(status==='success'&&record){if(this.last?.id!==record.id){this.previous=this.last??this.previous;this.last=record;}this.pending=undefined;}
   this.history.push({question,knowledgeId:record?.id});this.history=this.history.slice(-25);
   return {status,message,prediction,knowledgeId:record?.id,verified:status==='success',...extra};
  };
  if(/\b(?:dimensions|width|height|depth)\b/i.test(question)&&/^(?:what|how|tell|give)/i.test(question.trim())){
   try{const object=resolveTarget(undefined,scene),command=object.command;if(!['rectangle','square','cube','cuboid'].includes(object.type))return reply('unsupported','Dimension queries currently require a rectangle or box.');const scale=command.scale??1;return reply('success',`${object.label??object.type}: width ${command.width*scale}, height ${command.height*scale}${scene.activeMode.endsWith('3d')?`, depth ${(command.depth??command.width)*scale}`:''} units.`,undefined);}catch{return reply('ambiguous','Which rectangle or box do you mean? Select one object.');}
  }
  // The model ranks meanings; explicit object selection and vetted records ground the answer.
  if(prediction.intent==='unrelated')return reply('unsupported','I can help with the mathematics on this page. Which mathematical concept would you like to explore?');
  if(prediction.meaning==='unknown'){this.pending={question};return reply('ambiguous','Which concept do you mean: the current page topic, the previous concept, or a selected object?');}
  if(!prediction.accepted){this.pending={question};return reply('ambiguous','Do you mean the current page topic, the previous concept, or a selected object?');}
  let record=prediction.meaning==='active'?active:prediction.meaning==='previous'?this.previous:prediction.meaning==='selected'?undefined:knowledgeById(prediction.meaning);
  if(['followup','why','example','hint','simplify'].includes(prediction.intent)&&prediction.meaning==='active'&&this.last&&this.last.id===active?.id)record=this.last;
  if(prediction.intent==='previous')record=this.previous;
  if(record&&record.id!==active?.id&&record.id!==this.last?.id&&record.id!==this.previous?.id){const explicitTopic=/tree/i.test(record.id)?/\btrees?\b/i.test(question):/pigeonhole/i.test(record.id)?/\bpigeon\s*holes?\b/i.test(question):question.toLowerCase().includes(record.title.toLowerCase());if(!explicitTopic)return reply('ambiguous','Which concept or selected object do you mean?');}
  if(prediction.intent==='selected'||prediction.meaning==='selected'){
   if(selected.length!==1)return reply('ambiguous','Select one object so I can explain it.');const object=selected[0];return reply('success',`The selected object is ${object.label??object.type}, a ${object.type}, at (${object.position.join(', ')}). Its stable ID is ${object.id}.`,undefined);
  }
  if(!record)return reply('ambiguous','Which concept do you mean? Tell me its name or select an object.');
  if(!record.definition)return reply('unsupported',`This page is ${record.title}. I do not yet have a reviewed explanation for it. Please ask a specific calculation or choose a covered lesson.`);
  if(record.id==='pigeonhole'&&['demonstrate','calculate','simulation'].includes(prediction.intent)){
   const requested=question.match(/(\d+)\s*(?:objects?|items?|balls?|pigeons?)\s*(?:in|into|among)\s*(\d+)\s*(?:boxes?|containers?|holes?)/i);
   const state=capability?.read(),n=requested?Number(requested[1]):state?.n,k=requested?Number(requested[2]):state?.k;
   if(n===undefined||k===undefined)return reply('ambiguous','How many objects and how many boxes?');
   if(!Number.isInteger(n)||!Number.isInteger(k)||n<0||k<=0)return reply('invalid','Use a nonnegative integer number of objects and a positive integer number of boxes.');
   const guaranteed=ceilDivision(n,k);
   if(prediction.intent==='demonstrate'&&requested){if(classifyRequest(question)!=='COMMAND')return reply('ambiguous','Should I update the actual simulation, or are you asking a hypothetical question?');try{const committed=await executePigeonhole(n,k);return reply('success',`Placed ${n} objects in ${k} boxes (${committed.distribution.join(', ')}). At least one box contains ${guaranteed} or more objects because ceil(${n}/${k}) = ${guaranteed}.`,record,{simulation:committed});}catch(e){return reply('invalid',e instanceof Error?e.message:String(e));}}
   return reply('success',`${n} objects, ${k} boxes: at least one box contains ${guaranteed} or more. ceil(${n}/${k}) = ${guaranteed}.`,record);
  }
  const intent=prediction.intent;
  if(intent==='formula')return record.formula?reply('success',record.formula,record):reply('unsupported',`There is no reviewed formula for ${record.title}.`,record);
  if(intent==='proof'||intent==='why')return record.proof?reply('success',record.proof,record):reply('unsupported',`I do not have a reviewed proof for ${record.title}. ${record.definition}`,record);
  if(intent==='example')return record.example?reply('success',record.example,record):reply('unsupported',`I do not have a reviewed worked example for ${record.title}.`,record);
  if(intent==='practice')return record.id==='pigeonhole'?reply('success','Practice: 17 objects are placed in 5 boxes. What minimum occupancy is guaranteed in at least one box?',record):reply('unsupported',`A reviewed contextual practice question for ${record.title} is not available. You can use the existing practice lab.`,record);
  if(intent==='hint')return record.formula?reply('success',`Hint: use ${record.formula}`,record):reply('success',`Hint: start with the definition. ${record.definition}`,record);
  if(['calculate','compare','demonstrate','simulation'].includes(intent))return reply('unsupported',`The contextual adapter for ${record.title} cannot execute that operation. Use a specific supported math command or the page controls.`,record);
  return reply('success',`${record.title}: ${record.definition}`,record);
 }
}
export const liveContextAssistant=new ContextAssistant();
