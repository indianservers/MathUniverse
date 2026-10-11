import {it,expect,vi,afterEach} from 'vitest';
import {computeMathLocal} from './client';
import {computeMath} from './kernel';
import {EngineRouter} from '../intelligence/engineRouter';
import {emptyScene} from '../intelligence/sceneContext';
import type {KernelRequest} from './types';
afterEach(()=>vi.unstubAllGlobals());
it('mutating an expression while a worker runs discards its old certificate',async()=>{
 let reply:(()=>Promise<void>)|undefined;
 vi.stubGlobal('Worker',class {
  onmessage:((event:unknown)=>void)|null=null;onerror=null;terminate(){}
  postMessage(message:{requestId:string;payload:KernelRequest}){reply=async()=>this.onmessage?.({data:{requestId:message.requestId,result:await computeMath(message.payload)}});}
 });
 const request:KernelRequest={operation:'solve',expression:'x^2=4'},pending=computeMathLocal(request);
 request.expression='x^2=9';await reply!();const result=await pending;
 expect(result.execution?.status).toBe('cancelled');expect(result.answer).toContain('stale');expect(result.verification.passed).toBe(false);
});
it('assumption changes discard reusable conversational results',async()=>{
 const router=new EngineRouter(),scene=emptyScene('normal');
 const solved=await router.dispatch('Exact solve x^2=4',scene);expect(solved&&'result' in solved&&solved.result.execution?.status).toBe('verified');expect(router.last).toBeDefined();
 await router.dispatch('Assume x > 0',scene);expect(router.last).toBeUndefined();
 const fresh=await router.dispatch('Exact solve x^2=4',scene);expect(fresh&&'result' in fresh&&fresh.result.value).toEqual(['2']);
});
