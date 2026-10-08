import * as tf from '@tensorflow/tfjs';
import { OPERATIONS } from './actionRegistry';
import { normalizeLanguage } from './numberParser';
import { parseSemanticCommand } from './semanticParser';
import { contextToScene, splitSemanticRows } from './semanticDataset';
import { resolveTarget } from './targetResolver';
import type { RoboMode, SemanticRow } from './types';
import {MODEL_TRAINING_ENABLED,assertTrainingAllowed} from './buildPolicy';
import {assertDatasetQuality} from './datasetQuality';

export const V4_MODEL='indexeddb://math-robo-intelligence-v4';
export const HEAD_LABELS={
  action:[...new Set(OPERATIONS.filter(op=>op.implemented).map(op=>op.action))],
  subAction:[...new Set(OPERATIONS.filter(op=>op.implemented).map(op=>op.subAction))],
  mode:['normal','graph2d','graph3d','geometry2d','geometry3d'],
  objectType:['none','plot',...new Set(OPERATIONS.filter(op=>op.implemented&&op.action==='CREATE').map(op=>op.subAction.toLowerCase()))],
};
export const HEADS=Object.keys(HEAD_LABELS) as (keyof typeof HEAD_LABELS)[];
export function semanticFeatures(phrase:string,mode:RoboMode):number[]{
  const out=Array<number>(768).fill(0),words=normalizeLanguage(phrase).match(/[a-z]+|[=+*/^π]/g)??[];
  const tokens=[...words,...words.slice(1).map((word,i)=>`${words[i]}_${word}`),...words.flatMap(word=>Array.from({length:Math.max(0,word.length-2)},(_,i)=>`#${word.slice(i,i+3)}`))];
  for(const token of tokens){let hash=2166136261;for(const char of token)hash=Math.imul(hash^char.charCodeAt(0),16777619);out[(hash>>>0)%750]+=token.startsWith('#')?.2:1;}
  const norm=Math.hypot(...out)||1;for(let i=0;i<750;i++)out[i]/=norm;
  out[750]=/\d/.test(phrase)?1:0;out[751]=/[=^]/.test(phrase)?1:0;out[752]=/\([^)]*,/.test(phrase)?1:0;
  out[753+HEAD_LABELS.mode.indexOf(mode)]=1;return out;
}
export type ModelOptions={hidden?:number;encoder?:number;dropout?:number;balanced?:boolean};
export function createHierarchicalModel(options:ModelOptions={}){
  const input=tf.input({shape:[768],name:'semantic_features'});
  let shared=tf.layers.dense({units:options.hidden??128,activation:'relu',kernelInitializer:tf.initializers.glorotUniform({seed:41})}).apply(input) as tf.SymbolicTensor;
  if(options.dropout)shared=tf.layers.dropout({rate:options.dropout,seed:42}).apply(shared) as tf.SymbolicTensor;
  const encoder=tf.layers.dense({units:options.encoder??64,activation:'relu',kernelInitializer:tf.initializers.glorotUniform({seed:43})}).apply(shared) as tf.SymbolicTensor;
  const outputs=HEADS.map((head,i)=>tf.layers.dense({units:HEAD_LABELS[head].length,activation:'softmax',name:head,kernelInitializer:tf.initializers.glorotUniform({seed:47+i})}).apply(encoder) as tf.SymbolicTensor);
  const model=tf.model({inputs:input,outputs,name:'math_robo_intelligence_v4'});
  model.compile({optimizer:tf.train.adam(.003),loss:['categoricalCrossentropy','categoricalCrossentropy','categoricalCrossentropy','categoricalCrossentropy']});return model;
}
function headValues(row:SemanticRow){return {action:row.action,subAction:row.subAction,mode:row.mode,objectType:row.action==='CREATE'?row.subAction.toLowerCase():typeof row.target==='object'?row.target.type??'none':'none'};}
function batchTensors(rows:SemanticRow[]){return {xs:tf.tensor2d(rows.map(row=>semanticFeatures(row.phrase,row.mode))),ys:HEADS.map(head=>tf.tensor2d(rows.map(row=>HEAD_LABELS[head].map(label=>Number(label===headValues(row)[head])))))};}
export type NeuralPrediction={ [head in keyof typeof HEAD_LABELS]:{label:string;score:number} };
export function inferSemanticHeads(model:tf.LayersModel,phrase:string,mode:RoboMode):NeuralPrediction{
  const labels=(model.getUserDefinedMetadata() as {labels?:typeof HEAD_LABELS})?.labels??HEAD_LABELS;
  return tf.tidy(()=>{
    const scores=model.predict(tf.tensor2d([semanticFeatures(phrase,mode)])) as tf.Tensor[];
    return Object.fromEntries(HEADS.map((head,i)=>{const data=Array.from(scores[i].dataSync()),max=Math.max(...data);return [head,{label:labels[head][data.indexOf(max)],score:max}];})) as NeuralPrediction;
  });
}
export type SemanticMetrics={
  rows:number;actionAccuracy:number;subActionAccuracy:number;modeAccuracy:number;objectTypeAccuracy:number;
  semanticExactMatch:number;parameterExtractionAccuracy:number;targetResolutionAccuracy:number|null;targetRows:number;
  confusionMatrix:number[][];actionLabels:string[];
  perAction:{action:string;precision:number;recall:number;f1:number;rows:number}[];
  errors:{phrase:string;expected:string;predicted:string;reason:string}[];
  macroF1?:number;subActionMacroF1?:number;subActionConfusionMatrix?:number[][];subActionLabels?:string[];perSubAction?:SemanticMetrics['perAction'];examples?:{phrase:string;expectedAction:string;expectedSubAction:string;predictedAction:string;predictedSubAction:string;confidence:number;subActionConfidence?:number;mode?:RoboMode}[];
};
function valueEqual(a:unknown,b:unknown):boolean{if(typeof a==='number'&&typeof b==='number')return Math.abs(a-b)<1e-6;if(Array.isArray(a)&&Array.isArray(b))return a.length===b.length&&a.every((v,i)=>valueEqual(v,b[i]));return JSON.stringify(a)===JSON.stringify(b);}
export async function evaluateSemanticModel(model:tf.LayersModel,rows:SemanticRow[],cancelled=()=>false):Promise<SemanticMetrics>{
  const labels=(model.getUserDefinedMetadata() as {labels?:typeof HEAD_LABELS})?.labels??HEAD_LABELS;
  const confusion=labels.action.map(()=>labels.action.map(()=>0)),subConfusion=labels.subAction.map(()=>labels.subAction.map(()=>0));let action=0,sub=0,mode=0,object=0,exact=0,params=0,target=0,targetRows=0;
  const examples:NonNullable<SemanticMetrics['examples']>=[];
  const errors:SemanticMetrics['errors']=[];
  for(let start=0;start<rows.length;start+=128){
    if(cancelled())throw new Error('Evaluation cancelled.');const batch=rows.slice(start,start+128);
    const predictions=tf.tidy(()=>{const tensors=model.predict(tf.tensor2d(batch.map(row=>semanticFeatures(row.phrase,row.mode)))) as tf.Tensor[];return tensors.map(tensor=>Array.from(tensor.argMax(-1).dataSync()));});
    batch.forEach((row,index)=>{
      const expected=headValues(row),predicted=Object.fromEntries(HEADS.map((head,i)=>[head,labels[head][predictions[i][index]]])) as Record<string,string>;
      if(expected.action===predicted.action)action++;if(expected.subAction===predicted.subAction)sub++;if(expected.mode===predicted.mode)mode++;if(expected.objectType===predicted.objectType)object++;
      const ai=labels.action.indexOf(row.action),aj=labels.action.indexOf(predicted.action),si=labels.subAction.indexOf(row.subAction),sj=labels.subAction.indexOf(predicted.subAction);if(ai>=0&&aj>=0)confusion[ai][aj]++;if(si>=0&&sj>=0)subConfusion[si][sj]++;
      const confidence=inferSemanticHeads(model,row.phrase,row.mode);examples.push({mode:row.mode,subActionConfidence:confidence.subAction.score,phrase:row.phrase,expectedAction:row.action,expectedSubAction:row.subAction,predictedAction:predicted.action,predictedSubAction:predicted.subAction,confidence:confidence.action.score});
      let semantic=false,parameterMatch=false,targetMatch=true,reason='';
      try{
        const parsed=parseSemanticCommand(row.phrase,row.mode);
        parameterMatch=Object.entries(row.parameters).every(([key,value])=>valueEqual(parsed.parameters[key],value));if(parameterMatch)params++;
        if(row.targets&&row.context?.objects.length){const scene=contextToScene(row);targetRows++;try{targetMatch=JSON.stringify(row.targets.map(t=>resolveTarget(t,scene).id))===JSON.stringify(parsed.targets?.map(t=>resolveTarget(t,scene).id));if(targetMatch)target++;}catch{targetMatch=false;}}
        else if(row.target&&row.context?.objects.length){
          const scene=contextToScene(row);targetRows++;try{const expectedTarget=resolveTarget(row.target,scene);targetMatch=resolveTarget(parsed.target,scene).id===expectedTarget.id;if(targetMatch)target++;}catch{targetMatch=false;}
        }
        semantic=parsed.action===row.action&&parsed.subAction===row.subAction&&parameterMatch&&targetMatch;
        if(!semantic)reason=`Parser ${parsed.action}:${parsed.subAction}; parameters ${parameterMatch?'match':'differ'}; target ${targetMatch?'matches':'unresolved'}`;
      }catch(error){reason=String(error);}
      if(semantic)exact++;
      if((!semantic||predicted.action!==row.action||predicted.subAction!==row.subAction)&&errors.length<200)errors.push({phrase:row.phrase,expected:`${row.action}:${row.subAction}`,predicted:`${predicted.action}:${predicted.subAction}`,reason});
    });await tf.nextFrame();
  }
  const classes=(matrix:number[][],names:string[])=>names.map((label,i)=>{const tp=matrix[i][i],support=matrix[i].reduce((a,b)=>a+b,0),predicted=matrix.reduce((sum,row)=>sum+row[i],0),precision=predicted?tp/predicted:0,recall=support?tp/support:0;return {action:label,precision,recall,f1:precision+recall?2*precision*recall/(precision+recall):0,rows:support};});
  const perAction=classes(confusion,labels.action),perSubAction=classes(subConfusion,labels.subAction),macro=(classes:typeof perAction)=>{const eligible=classes.filter(c=>c.rows);return eligible.reduce((sum,c)=>sum+c.f1,0)/eligible.length;};
  return {rows:rows.length,actionAccuracy:action/rows.length,subActionAccuracy:sub/rows.length,modeAccuracy:mode/rows.length,objectTypeAccuracy:object/rows.length,semanticExactMatch:exact/rows.length,parameterExtractionAccuracy:params/rows.length,targetResolutionAccuracy:targetRows?target/targetRows:null,targetRows,confusionMatrix:confusion,actionLabels:labels.action,perAction,errors,macroF1:macro(perAction),subActionMacroF1:macro(perSubAction),subActionConfusionMatrix:subConfusion,subActionLabels:labels.subAction,perSubAction,examples};
}
export type V4Report={name:string;version:4|4.1;architecture:string;trainedAt:string;trainingSamples:number;validationSamples:number;testSamples:number;totalSamples:number;parameters:number;weightBytes:number;epochs:number;backend:string;metrics:SemanticMetrics;validationMetrics:SemanticMetrics;history:{epoch:number;loss:number}[];featureVersion:string;durationSeconds:number};
export async function trainSemanticModel(rows:SemanticRow[],epochs:number,batchSize:number,progress:(message:string,fraction:number,loss?:number)=>void,cancelled=()=>false,options:ModelOptions={balanced:true}){
  assertTrainingAllowed();
  assertDatasetQuality(rows);
  const split=splitSemanticRows(rows);if(!split.train.length||!split.validation.length||!split.test.length)throw new Error('Add varied phrase families so every split has examples.');
  if(!Number.isInteger(epochs)||epochs<1||epochs>100||![64,128,256,512].includes(batchSize))throw new Error('Invalid epochs or batch size.');
  await tf.ready();const model=createHierarchicalModel(options),start=performance.now(),history:V4Report['history']=[];model.setUserDefinedMetadata({labels:HEAD_LABELS});
  let seed=41;const random=()=>{seed=Math.imul(seed,1664525)+1013904223;return (seed>>>0)/4294967296;};
  try{
    for(let epoch=1;epoch<=epochs;epoch++){
      let order=[...split.train];if(options.balanced){const actions=new Map<string,Map<string,SemanticRow[]>>();for(const row of order){const action=actions.get(row.action)??new Map<string,SemanticRow[]>(),bucket=action.get(row.subAction)??[];bucket.push(row);action.set(row.subAction,bucket);actions.set(row.action,action);}const perAction=Math.ceil(order.length*2/actions.size);order=[...actions.values()].flatMap(action=>{const buckets=[...action.values()];return Array.from({length:perAction},(_,i)=>{const bucket=buckets[i%buckets.length];return bucket[Math.floor(random()*bucket.length)];});});}for(let i=order.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
      let loss=0;
      for(let i=0;i<order.length;i+=batchSize){if(cancelled())throw new Error('Training cancelled.');const batch=order.slice(i,i+batchSize),{xs,ys}=batchTensors(batch);try{const losses=await model.trainOnBatch(xs,ys);const value=Array.isArray(losses)?losses[0]:losses;if(!Number.isFinite(value))throw new Error('Non-finite training loss.');loss+=value*batch.length;}finally{xs.dispose();ys.forEach(t=>t.dispose());}progress(`Epoch ${epoch}/${epochs} · ${Math.min(i+batch.length,order.length)}/${order.length}`,((epoch-1)+(i+batch.length)/order.length)/epochs*.9);await tf.nextFrame();}
      history.push({epoch,loss:loss/order.length});progress(`Epoch ${epoch} complete`,epoch/epochs*.9,loss/order.length);
    }
    progress('Evaluating validation and untouched test splits…',.95);
    const validationMetrics=await evaluateSemanticModel(model,split.validation,cancelled),metrics=await evaluateSemanticModel(model,split.test,cancelled);
    const report:V4Report={name:'Ruhi Intelligence v4.1 candidate',version:4.1,architecture:`768 → ${options.hidden??128} → ${options.encoder??64}; dropout ${options.dropout??0}; action, subAction, context-conditioned mode and objectType heads`,trainedAt:new Date().toISOString(),trainingSamples:split.train.length,validationSamples:split.validation.length,testSamples:split.test.length,totalSamples:rows.length,parameters:model.countParams(),weightBytes:model.countParams()*4,epochs,backend:tf.getBackend(),metrics,validationMetrics,history,featureVersion:'semantic-hash-768-v4',durationSeconds:(performance.now()-start)/1000};
    model.setUserDefinedMetadata({report,labels:HEAD_LABELS});progress('Training and held-out evaluation complete.',1);return {model,report};
  }catch(error){model.optimizer.dispose();model.dispose();throw error;}
}
let currentModel:tf.LayersModel|undefined;
let loadPromise:Promise<tf.LayersModel>|undefined;
export async function loadIntelligenceModel(){
  if(currentModel)return currentModel;
  loadPromise??=(async()=>{await tf.ready();const stored=MODEL_TRAINING_ENABLED?await tf.io.listModels().catch(()=>({})):{};const local=Object.prototype.hasOwnProperty.call(stored,V4_MODEL),url=local?V4_MODEL:`${import.meta.env.BASE_URL}models/math-robo-intelligence-v4/model.json`;const model=await tf.loadLayersModel(url);const metadata=await model.getUserDefinedMetadata() as {labels?:typeof HEAD_LABELS};if(model.inputs[0].shape[1]!==768||!metadata?.labels||HEADS.some((head,i)=>!Array.isArray(metadata.labels?.[head])||metadata.labels[head].length!==model.outputs[i]?.shape.at(-1))){model.dispose();throw new Error('Invalid production model labels.');}currentModel=model;return model;})().catch(error=>{loadPromise=undefined;throw error;});
  return loadPromise;
}
export async function resetIntelligenceModel(){currentModel?.dispose();currentModel=undefined;loadPromise=undefined;return loadIntelligenceModel();}
