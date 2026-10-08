import {loadModelWithProgress} from '../../model-loading/loadModelWithProgress';
import * as tf from '@tensorflow/tfjs';
import {assertTrainingAllowed} from './buildPolicy';
export const CONTEXT_INTENTS=['explain','define','formula','proof','example','demonstrate','calculate','compare','why','simplify','simulation','selected','followup','practice','hint','previous','unrelated'] as const;
export const CONTEXT_MEANINGS=['active','previous','selected','pigeonhole','graph-tree','data-tree','real-tree','ordinary-pigeonhole','unknown'] as const;
export type ContextIntent=typeof CONTEXT_INTENTS[number];
export type ContextMeaning=typeof CONTEXT_MEANINGS[number];
export type ContextInput={question:string;pageVocabulary:string;previousVocabulary?:string;selectedTypes?:string[];simulation?:{n:number;k:number};hasPrevious?:boolean};
export type ContextRow=ContextInput&{intent:ContextIntent;meaning:ContextMeaning;group:string;split:'train'|'calibration'|'test';pageId:string};
const WIDTH=848;
function tokens(text:string){return text.toLowerCase().replace(/what's/g,'what is').replace(/pigeon holes/g,'pigeonholes').match(/[a-z]+|\d+/g)??[];}
function hash(text:string){let h=2166136261;for(const c of text)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
export function contextFeatures(input:ContextInput){
 const out=Array<number>(WIDTH).fill(0),question=tokens(input.question),page=tokens(input.pageVocabulary),previous=tokens(input.previousVocabulary??'');
 const add=(words:string[],start:number,width:number)=>{for(const word of words)out[start+hash(word)%width]++;const norm=Math.hypot(...out.slice(start,start+width))||1;for(let i=start;i<start+width;i++)out[i]/=norm;};
 add([...question,...question.slice(1).map((w,i)=>question[i]+'_'+w),...question.flatMap(w=>Array.from({length:Math.max(0,w.length-2)},(_,i)=>'#'+w.slice(i,i+3)))],0,384);
 add(page,384,128);add(previous,512,64);add(question.flatMap(q=>page.map(p=>q+':'+p)),576,256);
 out[832]=Number(!!input.hasPrevious);out[833]=Number(!!input.selectedTypes?.length);out[834]=Number(!!input.simulation);out[835]=Number(page.length>0);
 add(input.selectedTypes??[],836,8);if(input.simulation){out[844]=Math.min(input.simulation.n,1000)/1000;out[845]=Math.min(input.simulation.k,1000)/1000;}
 return out;
}
export type ContextPrediction={intent:ContextIntent;meaning:ContextMeaning;intentConfidence:number;meaningConfidence:number;intentScores:number[];meaningScores:number[];accepted:boolean;inferenceMs:number};
export type Calibration={intent:Record<string,number>;meaning:Record<string,number>};
export function createContextModel(hidden:number){
 const input=tf.input({shape:[WIDTH]});const encoded=hidden?tf.layers.dense({units:hidden,activation:'relu',kernelInitializer:tf.initializers.glorotUniform({seed:73})}).apply(input) as tf.SymbolicTensor:input;
 const outputs=[CONTEXT_INTENTS,CONTEXT_MEANINGS].map((labels,i)=>tf.layers.dense({units:labels.length,activation:'softmax',kernelInitializer:tf.initializers.glorotUniform({seed:79+i})}).apply(encoded) as tf.SymbolicTensor);
 const model=tf.model({inputs:input,outputs,name:'RuhiContextNet'});model.compile({optimizer:tf.train.adam(.006),loss:['categoricalCrossentropy','categoricalCrossentropy']});return model;
}
export function inferContext(model:tf.LayersModel,input:ContextInput):ContextPrediction{
 const start=performance.now(),scores=tf.tidy(()=>{const tensors=model.predict(tf.tensor2d([contextFeatures(input)])) as tf.Tensor[];return tensors.map(t=>Array.from(t.dataSync()));});
 const best=(data:number[])=>data.indexOf(Math.max(...data)),i=best(scores[0]),m=best(scores[1]),intent=CONTEXT_INTENTS[i],meaning=CONTEXT_MEANINGS[m];
 const calibration=(model.getUserDefinedMetadata() as {calibration?:Calibration})?.calibration;
 return {intent,meaning,intentConfidence:scores[0][i],meaningConfidence:scores[1][m],intentScores:scores[0],meaningScores:scores[1],accepted:!!calibration&&scores[0][i]>=(calibration.intent[intent]??1)&&scores[1][m]>=(calibration.meaning[meaning]??1),inferenceMs:performance.now()-start};
}
export function calibrateContext(model:tf.LayersModel,rows:ContextRow[]):Calibration{
 const values=rows.map(row=>({row,p:inferContext(model,row)}));
 const head=(key:'intent'|'meaning',score:'intentConfidence'|'meaningConfidence',labels:readonly string[])=>Object.fromEntries(labels.map(label=>{
  const sample=values.filter(v=>v.p[key]===label);let threshold=1;
  for(const candidate of [.35,.45,.55,.65,.75,.85,.95,.98,.99,.995,.999,.9999]){const accepted=sample.filter(v=>v.p[score]>=candidate);if(accepted.length>=2&&accepted.filter(v=>v.row[key]===label).length/accepted.length>=.97){threshold=candidate;break;}}
  return [label,threshold];
 }));
 return {intent:head('intent','intentConfidence',CONTEXT_INTENTS),meaning:head('meaning','meaningConfidence',CONTEXT_MEANINGS)};
}
export async function trainContextModel(rows:ContextRow[],hidden:number,epochs:number,progress:(epoch:number,loss:number)=>void=()=>{}){
 assertTrainingAllowed();if(!rows.length||rows.length>100000||epochs<1||epochs>100)throw new Error('Invalid context training configuration.');
 const original=rows.filter(r=>r.split==='train'),buckets=new Map<string,ContextRow[]>();for(const row of original){const key=row.intent+':'+row.meaning,bucket=buckets.get(key)??[];bucket.push(row);buckets.set(key,bucket);}const maximum=Math.max(...[...buckets.values()].map(b=>b.length)),training=Array.from({length:maximum},(_,index)=>[...buckets.values()].map(bucket=>bucket[index%bucket.length])).flat(),model=createContextModel(hidden),xs=tf.tensor2d(training.map(contextFeatures)),ys=[CONTEXT_INTENTS,CONTEXT_MEANINGS].map((labels,i)=>tf.tensor2d(training.map(r=>labels.map(label=>Number(label===(i?r.meaning:r.intent))))));
 try{await model.fit(xs,ys,{epochs,batchSize:128,shuffle:false,callbacks:{onEpochEnd:async(epoch,logs)=>{progress(epoch+1,logs?.loss??0);await tf.nextFrame();}}});const calibration=calibrateContext(model,rows.filter(r=>r.split==='calibration'));model.setUserDefinedMetadata({version:1,featureVersion:'context-hash-848-v1',intents:[...CONTEXT_INTENTS],meanings:[...CONTEXT_MEANINGS],calibration,hidden});return model;}catch(e){model.optimizer.dispose();model.dispose();throw e;}finally{xs.dispose();ys.forEach(t=>t.dispose());}
}
let loaded:Promise<tf.LayersModel>|undefined;
export function loadContextModel(){return loaded??=(async()=>{await tf.ready();const model=await loadModelWithProgress(`${import.meta.env.BASE_URL}models/ruhi-context-v1/model.json`,'Ruhi context');const metadata=model.getUserDefinedMetadata() as {featureVersion?:string};if(model.inputs[0].shape[1]!==WIDTH||metadata?.featureVersion!=='context-hash-848-v1'){model.dispose();throw new Error('Unsupported context model version.');}return model;})().catch(e=>{loaded=undefined;throw e;});}
