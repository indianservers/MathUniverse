import {executionOutcome,type ExecutionStatus} from '../../math-foundation/executionOutcome';
import {unsupported,type KernelRequest,type KernelResult} from './types';
import {workerTransport,type TransportOptions} from './workerTransport';
function failure(status:ExecutionStatus,message:string,requestId:string=crypto.randomUUID()):KernelResult{const result=unsupported(message);result.execution=executionOutcome(status,requestId,message);return result;}
const dispatch=workerTransport<KernelRequest,KernelResult>(()=>new Worker(new URL('./kernel.worker.ts',import.meta.url),{type:'module'}),failure,result=>result.status!=='unsupported');
export async function computeMathLocal(request:KernelRequest,signal?:AbortSignal,options:Omit<TransportOptions,'signal'>={}):Promise<KernelResult>{
 if(signal?.aborted)return failure('cancelled','Calculation cancelled.');
 let snapshot:KernelRequest,signature:string;
 try{signature=JSON.stringify(request);snapshot=structuredClone(request);snapshot.inputRevision??=crypto.randomUUID();}catch{return failure('invalid_input','The calculation input cannot be transferred to a worker. Use serializable typed arguments.');}
 let result:KernelResult;
 if(typeof Worker==='undefined'){const {computeMath}=await import('./kernel');if(signal?.aborted)return failure('cancelled','Calculation cancelled.');result=await computeMath(snapshot);}
 else result=await dispatch(snapshot,{...options,signal});
 if(signal?.aborted)return failure('cancelled','Calculation cancelled.');
 if(JSON.stringify(request)!==signature)return failure('cancelled','Calculation inputs changed; the stale result was discarded.');
 if(['verified','valid_unverified'].includes(result.execution?.status??'')&&result.execution?.evidence.inputRevision!==snapshot.inputRevision)return failure('internal_error','The calculation result belongs to a different input revision.');
 return result;
}
