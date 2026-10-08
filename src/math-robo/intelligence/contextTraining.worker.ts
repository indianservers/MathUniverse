import * as tf from '@tensorflow/tfjs';
import {assertTrainingAllowed} from './buildPolicy';
import {trainContextModel,inferContext,CONTEXT_INTENTS,CONTEXT_MEANINGS,type ContextRow} from './ruhiContextNet';
const scope=self as unknown as {onmessage:(event:MessageEvent<{rows:ContextRow[];epochs:number;hidden:number}>)=>Promise<void>;postMessage:(value:unknown)=>void};
scope.onmessage=async({data})=>{try{
 assertTrainingAllowed();const {rows,epochs,hidden}=data;
 if(!Array.isArray(rows)||!rows.length||rows.length>100000||![0,64].includes(hidden)||!Number.isInteger(epochs)||rows.some(r=>typeof r.question!=='string'||r.question.length>500||typeof r.pageVocabulary!=='string'||r.pageVocabulary.length>5000||!CONTEXT_INTENTS.includes(r.intent)||!CONTEXT_MEANINGS.includes(r.meaning)||!['train','calibration','test'].includes(r.split)||typeof r.group!=='string'))throw new Error('Invalid contextual training rows.');
 const groups=new Map<string,string>();for(const row of rows){const split=groups.get(row.group);if(split&&split!==row.split)throw new Error('A semantic template group crosses dataset splits.');groups.set(row.group,row.split);}
 await tf.setBackend('cpu');const model=await trainContextModel(rows,hidden,epochs,(epoch,loss)=>scope.postMessage({type:'progress',epoch,loss}));
 try{const test=rows.filter(r=>r.split==='test');if(test.length<300)throw new Error('Supply at least 300 held-out contextual questions.');const results=test.map(row=>({row,p:inferContext(model,row)})),metrics={rows:test.length,intentAccuracy:results.filter(r=>r.row.intent===r.p.intent).length/test.length,contextAccuracy:results.filter(r=>r.row.meaning===r.p.meaning).length/test.length,jointAccuracy:results.filter(r=>r.row.intent===r.p.intent&&r.row.meaning===r.p.meaning).length/test.length};let artifact:tf.io.ModelArtifacts|undefined;await model.save(tf.io.withSaveHandler(async a=>{artifact=a;return {modelArtifactsInfo:{dateSaved:new Date(),modelTopologyType:'JSON'}};}));scope.postMessage({type:'complete',artifact,metrics});}finally{model.optimizer.dispose();model.dispose();}
}catch(e){scope.postMessage({type:'error',message:e instanceof Error?e.message:String(e)});}};
