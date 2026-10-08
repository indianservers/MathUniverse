export * from './engineRegistryCore';
import {executeCapabilityDirect,type EngineResult,type SpecialistInput} from './engineRegistryCore';
export async function executeCapability(id:string,input:unknown):Promise<EngineResult>{
 if(id==='kernel.compute'||typeof Worker==='undefined')return executeCapabilityDirect(id,input);
 const {runSpecialistWorker}=await import('../kernel/specialistClient');
 return runSpecialistWorker(id,input as SpecialistInput);
}
