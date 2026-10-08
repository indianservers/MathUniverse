import type {DownloadProgress} from './downloadBytes';
export type ModelLoad={id:string;label:string;phase:'downloading'|'initializing'|'ready'|'error';progress?:DownloadProgress;error?:string};
let sequence=0;let state:ModelLoad[]=[];const listeners=new Set<()=>void>();
const emit=()=>listeners.forEach(listener=>listener());
export const modelLoads={getSnapshot:()=>state,subscribe:(listener:()=>void)=>{listeners.add(listener);return ()=>{listeners.delete(listener);};},dismiss:(id:string)=>{state=state.filter(load=>load.id!==id);emit();}};
export function startModelLoad(label:string){
 const id=`model-load-${++sequence}`;let ended=false;let lastPublish=0;
 const update=(change:Partial<ModelLoad>)=>{if(ended)return;state=state.map(load=>load.id===id?{...load,...change}:load);emit();};
 state=[...state,{id,label,phase:'downloading'}];emit();
 return {id,progress:(progress:DownloadProgress)=>{const now=Date.now();if(now-lastPublish<80&&progress.percent!==100&&progress.loaded!==0)return;lastPublish=now;update({phase:'downloading',progress});},initializing:()=>update({phase:'initializing'}),finish:()=>{update({phase:'ready'});ended=true;setTimeout(()=>modelLoads.dismiss(id),1500);},fail:(error:unknown)=>{update({phase:'error',error:error instanceof Error?error.message:String(error)});ended=true;},cancel:()=>{ended=true;modelLoads.dismiss(id);}};
}
