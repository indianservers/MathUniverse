import {executionOutcome,type ExecutionStatus} from '../../math-foundation/executionOutcome';
import {unsupported,type KernelRequest,type KernelResult} from './types';
import {workerTransport,type TransportOptions} from './workerTransport';
function failure(status:ExecutionStatus,message:string,requestId:string=crypto.randomUUID()):KernelResult{const result=unsupported(message);result.execution=executionOutcome(status,requestId,message);return result;}
const dispatch=workerTransport<KernelRequest,KernelResult>(()=>new Worker(new URL('./kernel.worker.ts',import.meta.url),{type:'module'}),failure,result=>result.status!=='unsupported');
export async function computeMathLocal(request:KernelRequest,signal?:AbortSignal,options:Omit<TransportOptions,'signal'>={}):Promise<KernelResult>{
 if(signal?.aborted)return failure('cancelled','Calculation cancelled.');
 if(typeof Worker==='undefined'){const {computeMath}=await import('./kernel');if(signal?.aborted)return failure('cancelled','Calculation cancelled.');const result=await computeMath(request);return signal?.aborted?failure('cancelled','Calculation cancelled.'):result;}
 return dispatch(request,{...options,signal});
}
