import {computeMath} from './kernel';
import {executionOutcome} from '../../math-foundation/executionOutcome';
import type {KernelRequest} from './types';
import type {WorkerEnvelope} from './workerTransport';
self.onmessage=async(event:MessageEvent<WorkerEnvelope<KernelRequest>>)=>{const {requestId,payload}=event.data,result=await computeMath(payload);if(result.execution)result.execution={...result.execution,requestId};else result.execution=executionOutcome('valid_unverified',requestId);self.postMessage({requestId,result});};
