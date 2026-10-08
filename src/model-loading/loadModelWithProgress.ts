import * as tf from '@tensorflow/tfjs';
import {downloadBytes} from './downloadBytes';
import {startModelLoad} from './modelLoadStore';
/** Applies only to network models; IndexedDB and in-memory candidates have no download. */
export async function loadModelWithProgress(url:string,label:string){
 if(!/^https?:|^\//.test(url)&&!url.endsWith('.json'))return tf.loadLayersModel(url);
 const task=startModelLoad(label);let activeDownloads=0;
 try{
  const model=await tf.loadLayersModel(url,{fetchFunc:async(input,init)=>{
   activeDownloads++;const address=typeof input==='string'?input:input instanceof URL?input.href:input.url;
   const {bytes,response}=await downloadBytes(address,task.progress,init);
   if(--activeDownloads===0)task.initializing();return new Response(bytes.buffer as ArrayBuffer,{status:response.status,statusText:response.statusText,headers:response.headers});
  }});task.finish();return model;
 }catch(error){task.fail(error);throw error;}
}
