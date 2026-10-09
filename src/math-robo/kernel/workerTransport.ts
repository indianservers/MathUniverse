import type {ExecutionStatus} from '../../math-foundation/executionOutcome';
type Failure=Exclude<ExecutionStatus,'verified'|'valid_unverified'|'unsupported'>;
export type WorkerEnvelope<T>={requestId:string;payload:T};
export type WorkerReply<T>={requestId:string;result:T};
export type TransportOptions={signal?:AbortSignal;timeoutMs?:number};
/** Existing bounded worker pools, with one request identity per dispatch. A stale
 * worker reply cannot resolve a later request or consume/release its capacity. */
export function workerTransport<Input,Output>(create:()=>Worker,failure:(status:Failure,message:string,requestId:string)=>Output,reusable:(result:Output)=>boolean){
 let active=0;
 const idle:{worker:Worker;jobs:number;timer:ReturnType<typeof setTimeout>}[]=[];
 return (payload:Input,{signal,timeoutMs=20000}:TransportOptions={}):Promise<Output>=>{
  const requestId=crypto.randomUUID();
  if(signal?.aborted)return Promise.resolve(failure('cancelled','Calculation cancelled.',requestId));
  if(!Number.isFinite(timeoutMs)||timeoutMs<=0||timeoutMs>120000)return Promise.resolve(failure('invalid_input','Time budget must be positive and no greater than 120 seconds.',requestId));
  if(active>=2)return Promise.resolve(failure('timeout','Two calculations are already running. Retry when capacity is available.',requestId));
  return new Promise(resolve=>{
   active++;const previous=idle.pop();if(previous)clearTimeout(previous.timer);let worker:Worker;
   try{worker=previous?.worker??create();}catch{active--;resolve(failure('internal_error','The local calculation worker could not start.',requestId));return;}
   const jobs=(previous?.jobs??0)+1;let settled=false;
   const finish=(result:Output)=>{
    if(settled)return;settled=true;clearTimeout(timer);signal?.removeEventListener('abort',cancel);worker.onmessage=null;worker.onerror=null;active--;
    if(reusable(result)&&jobs<32){const entry={worker,jobs,timer:setTimeout(()=>{const index=idle.findIndex(e=>e.worker===worker);if(index>=0){idle.splice(index,1);worker.terminate();}},60000)};idle.push(entry);}else worker.terminate();resolve(result);
   };
   const cancel=()=>finish(failure('cancelled','Calculation cancelled.',requestId));
   const timer=setTimeout(()=>finish(failure('timeout',`Calculation exceeded the ${timeoutMs/1000}-second time budget, including worker startup.`,requestId)),timeoutMs);
   signal?.addEventListener('abort',cancel,{once:true});
   worker.onmessage=(event:MessageEvent<WorkerReply<Output>>)=>{if(event.data?.requestId!==requestId)return;if(!event.data.result||typeof event.data.result!=='object'){finish(failure('internal_error','The worker returned a malformed result.',requestId));return;}finish(event.data.result);};
   worker.onerror=()=>finish(failure('internal_error','The local calculation worker failed.',requestId));
   if(signal?.aborted){cancel();return;}
   try{worker.postMessage({requestId,payload} satisfies WorkerEnvelope<Input>);}catch{finish(failure('invalid_input','The calculation input cannot be transferred to a worker. Use serializable typed arguments.',requestId));}
  });
 };
}
