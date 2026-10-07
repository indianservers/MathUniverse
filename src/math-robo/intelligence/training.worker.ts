import * as tf from '@tensorflow/tfjs';
import { HEAD_LABELS, V4_MODEL, trainSemanticModel } from './hierarchicalModel';
import { validateSemanticRows } from './semanticDataset';
import type { SemanticRow } from './types';
const scope=self as unknown as {onmessage:(event:MessageEvent<{rows:SemanticRow[];epochs:number;batchSize:number}>)=>Promise<void>;postMessage:(value:unknown)=>void};
scope.onmessage=async(event:MessageEvent<{rows:SemanticRow[];epochs:number;batchSize:number}>)=>{
  try{
    await tf.setBackend('cpu');const {rows,epochs,batchSize}=event.data;
    const result=await trainSemanticModel(validateSemanticRows(rows),epochs,batchSize,(message,fraction,loss)=>scope.postMessage({type:'progress',message,fraction,loss}));
    let artifact:tf.io.ModelArtifacts|undefined;
    await result.model.save(tf.io.withSaveHandler(async value=>{artifact=value;return {modelArtifactsInfo:{dateSaved:new Date(),modelTopologyType:'JSON'}};}));
    let persisted=false;try{await result.model.save(V4_MODEL);persisted=true;}catch{/* Return downloadable real artifacts regardless of storage. */}
    scope.postMessage({type:'complete',report:result.report,artifact,labels:HEAD_LABELS,persisted});result.model.optimizer.dispose();result.model.dispose();
  }catch(error){scope.postMessage({type:'error',message:error instanceof Error?error.message:String(error)});}
};
