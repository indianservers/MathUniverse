import type {EngineResult,SpecialistInput} from '../intelligence/engineRegistryCore';
const idle:{worker:Worker;jobs:number;timer:ReturnType<typeof setTimeout>}[]=[];
let active=0;
export function runSpecialistWorker(id:string,input:SpecialistInput):Promise<EngineResult>{
 const failure=(message:string):EngineResult=>({engineId:'local-specialist',capabilityId:id,success:false,verificationStatus:'unsupported',error:{code:'UNSUPPORTED',message}}),{signal,...data}=input;
 if(signal?.aborted)return Promise.resolve(failure('Calculation cancelled.'));
 if(JSON.stringify(data).length>2000000)return Promise.resolve(failure('Specialist input exceeds the 2 MB request budget.'));
 if(active>=2)return Promise.resolve(failure('Two specialist calculations are already running.'));
 return new Promise(resolve=>{active++;const previous=idle.pop();if(previous)clearTimeout(previous.timer);let worker:Worker;
  try{worker=previous?.worker??new Worker(new URL('./specialist.worker.ts',import.meta.url),{type:'module'});}catch{active--;resolve(failure('The local specialist worker could not start.'));return;}
  const jobs=(previous?.jobs??0)+1;let settled=false;
  const finish=(result:EngineResult)=>{if(settled)return;settled=true;clearTimeout(timer);signal?.removeEventListener('abort',cancel);worker.onmessage=null;worker.onerror=null;active--;
   if(result.success&&jobs<32){const entry={worker,jobs,timer:setTimeout(()=>{const index=idle.findIndex(e=>e.worker===worker);if(index>=0){idle.splice(index,1);worker.terminate();}},60000)};idle.push(entry);}else worker.terminate();resolve(result);};
  const cancel=()=>finish(failure('Calculation cancelled.'));
  const timer=setTimeout(()=>finish(failure('Specialist calculation exceeded the 20-second time budget, including startup.')),20000);
  signal?.addEventListener('abort',cancel,{once:true});worker.onmessage=e=>finish(e.data);worker.onerror=()=>finish(failure('The local specialist worker failed.'));
  try{worker.postMessage({id,input:data});}catch{finish(failure('The specialist input cannot be transferred to a worker. Use serializable typed arguments.'));}
 });
}
