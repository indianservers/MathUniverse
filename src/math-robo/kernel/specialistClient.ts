import {executionOutcome} from '../../math-foundation/executionOutcome';
import type {EngineResult,SpecialistInput} from '../intelligence/engineRegistryCore';
import {workerTransport} from './workerTransport';
const dispatch=workerTransport<{id:string;input:Omit<SpecialistInput,'signal'>},EngineResult>(()=>new Worker(new URL('./specialist.worker.ts',import.meta.url),{type:'module'}),(status,message,requestId)=>({engineId:'local-specialist',capabilityId:'transport',success:false,verificationStatus:'unsupported',execution:executionOutcome(status,requestId,message),error:{code:status.toUpperCase(),message}}),result=>result.success);
export async function runSpecialistWorker(id:string,input:SpecialistInput):Promise<EngineResult>{
 const {signal,...data}=input;
 const failure=(message:string):EngineResult=>({engineId:'local-specialist',capabilityId:id,success:false,verificationStatus:'unsupported',execution:executionOutcome('invalid_input',crypto.randomUUID(),message),error:{code:'INVALID_INPUT',message}});
 try{if(JSON.stringify(data).length>2000000)return failure('Specialist input exceeds the 2 MB request budget.');}catch{return failure('Use serializable typed arguments.');}
 const result=await dispatch({id,input:data},{signal});return {...result,capabilityId:id};
}
