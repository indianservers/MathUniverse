import { useEffect, useRef, useState } from "react";
import type { MobileSamplingInput, MobileSamplingResult } from "./mobileGraphSampling";
const empty:MobileSamplingResult={sampled:[],advanced:{}};
export function useMobileGraphSampling(enabled:boolean,input:MobileSamplingInput) {
  const worker=useRef<Worker|null>(null);
  const [result,setResult]=useState(empty);
  const [busy,setBusy]=useState(false);const [progress,setProgress]=useState(0);const [error,setError]=useState<string>();const [revision,setRevision]=useState(0);
  const serialized=JSON.stringify(input);
  useEffect(()=>{
    if(!enabled)return;
    setBusy(true);setProgress(0);setError(undefined);
    const job=new Worker(new URL("./mobileGraphSampling.worker.ts",import.meta.url),{type:"module"});worker.current=job;
    job.onmessage=(event:MessageEvent<{type:string;progress:number;result:MobileSamplingResult;error:string}>)=>{
      if(event.data.type==="progress")setProgress(event.data.progress);
      if(event.data.type==="complete"){setResult(event.data.result);setBusy(false);setProgress(1);job.terminate();worker.current=null;}
      if(event.data.type==="error"){setError(event.data.error);setBusy(false);job.terminate();worker.current=null;}
    };
    job.onerror=()=>{setError("Could not build the plot. Try Fast quality or retry.");setBusy(false);job.terminate();worker.current=null;};
    job.postMessage(JSON.parse(serialized));
    return()=>{job.terminate();if(worker.current===job)worker.current=null;};
  },[enabled,serialized,revision]);
  return {...result,busy,progress,error,cancel:()=>{worker.current?.terminate();worker.current=null;setBusy(false);setError("Rendering cancelled. Your last completed plot is preserved.");},resume:()=>setRevision(v=>v+1)};
}
