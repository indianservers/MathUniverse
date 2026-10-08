import * as tf from '@tensorflow/tfjs';
import { HEAD_LABELS, trainSemanticModel, type ModelOptions } from './hierarchicalModel';
import {CANDIDATE_MODEL,assertTrainingAllowed} from './buildPolicy';
import { validateSemanticRows } from './semanticDataset';
import type { SemanticRow } from './types';
const scope=self as unknown as {onmessage:(event:MessageEvent<{rows:SemanticRow[];epochs:number;batchSize:number;options?:ModelOptions}>)=>Promise<void>;postMessage:(value:unknown)=>void};
scope.onmessage=async(event:MessageEvent<{rows:SemanticRow[];epochs:number;batchSize:number;options?:ModelOptions}>)=>{
  try{
    assertTrainingAllowed();
    await tf.setBackend('cpu');const {rows,epochs,batchSize,options}=event.data;
    const result=await trainSemanticModel(validateSemanticRows(rows),epochs,batchSize,(message,fraction,loss)=>scope.postMessage({type:'progress',message,fraction,loss}),()=>false,options);
    let artifact:tf.io.ModelArtifacts|undefined;
    await result.model.save(tf.io.withSaveHandler(async value=>{artifact=value;return {modelArtifactsInfo:{dateSaved:new Date(),modelTopologyType:'JSON'}};}));
    let persisted=false;try{await result.model.save(CANDIDATE_MODEL);persisted=true;}catch{/* Return downloadable real artifacts regardless of storage. */}
    scope.postMessage({type:'complete',report:result.report,artifact,labels:HEAD_LABELS,persisted});result.model.optimizer.dispose();result.model.dispose();
  }catch(error){scope.postMessage({type:'error',message:error instanceof Error?error.message:String(error)});}
};
