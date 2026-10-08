import {safeAst,expressionText} from './safeExpression';
import {domainConditions} from './domains';
import {unsupported,type KernelRequest,type KernelResult} from './types';
let active=0;
const idle:{worker:Worker;jobs:number;timer:ReturnType<typeof setTimeout>}[]=[];
export async function computeMathLocal(request:KernelRequest,signal?:AbortSignal):Promise<KernelResult>{
 if(signal?.aborted)return unsupported('Calculation cancelled.');const started=performance.now();
 if(['evaluate','decimal','gcd','lcm','mod','base'].includes(request.operation)&&!(request.assumptions?.length)&&(request.expression?.length??0)<128){const {exactArithmetic}=await import('./exact');if(signal?.aborted)return unsupported('Calculation cancelled.');try{const quick=exactArithmetic(request);if(quick){quick.elapsedMs=performance.now()-started;quick.inputExpression=request.expression;quick.operation=request.operation;quick.domain=request.domain??'real';quick.assumptions=request.assumptions??[];if(request.expression){const ast=safeAst(request.expression);quick.normalizedExpression=expressionText(ast);quick.conditions=[...new Set([...quick.conditions,...domainConditions(ast,request.domain)])];}return quick;}}catch{/* Worker returns structured domain failures. */}}
 if(signal?.aborted)return unsupported('Calculation cancelled.');
 if(typeof Worker==='undefined'){const {computeMath}=await import('./kernel');return computeMath(request);}
 if(active>=2)return unsupported('Two calculations are already running. Wait for one to finish.');
 return new Promise(resolve=>{active++;const previous=idle.pop();if(previous)clearTimeout(previous.timer);let worker:Worker;
  try{worker=previous?.worker??new Worker(new URL('./kernel.worker.ts',import.meta.url),{type:'module'});}catch{active--;resolve(unsupported('The local calculation worker could not start.'));return;}
  const jobs=(previous?.jobs??0)+1;let settled=false;
  const finish=(result:KernelResult)=>{if(settled)return;settled=true;clearTimeout(timer);signal?.removeEventListener('abort',cancel);worker.onmessage=null;worker.onerror=null;active--;
   if(result.status!=='unsupported'&&jobs<32){const entry={worker,jobs,timer:setTimeout(()=>{const index=idle.findIndex(e=>e.worker===worker);if(index>=0){idle.splice(index,1);worker.terminate();}},60000)};idle.push(entry);}else worker.terminate();resolve(result);};
  const cancel=()=>finish(unsupported('Calculation cancelled.'));
  const timer=setTimeout(()=>finish(unsupported('Calculation exceeded the 20-second time budget, including worker startup.')),20000);
  signal?.addEventListener('abort',cancel,{once:true});worker.onmessage=e=>finish(e.data);worker.onerror=()=>finish(unsupported('The local calculation worker failed.'));
  if(signal?.aborted){cancel();return;}
  try{worker.postMessage(request);}catch{finish(unsupported('The calculation input cannot be transferred to a worker. Use serializable typed arguments.'));}
 });
}
