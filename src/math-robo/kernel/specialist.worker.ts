import {executeCapabilityDirect,type SpecialistInput} from '../intelligence/engineRegistryCore';
import type {WorkerEnvelope} from './workerTransport';
self.onmessage=async(event:MessageEvent<WorkerEnvelope<{id:string;input:SpecialistInput}>>)=>{const {requestId,payload}=event.data,result=await executeCapabilityDirect(payload.id,payload.input);if(result.execution)result.execution={...result.execution,requestId};self.postMessage({requestId,result});};
