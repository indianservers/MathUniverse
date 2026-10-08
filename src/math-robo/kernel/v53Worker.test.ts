import {afterEach,expect,it,vi} from 'vitest';
import {computeMathLocal} from './client';

afterEach(()=>vi.unstubAllGlobals());
const request={operation:'factorial' as const,args:[20]};
it('worker startup failures resolve visibly and release capacity for later requests',async()=>{
 vi.stubGlobal('Worker',class {constructor(){throw new Error('Worker denied');}});
 for(let i=0;i<3;i++){
  const result=await computeMathLocal(request);
  expect(result.status).toBe('unsupported');
  expect(result.answer).toContain('could not start');
  expect(result.verification.passed).toBe(false);
 }
});
it('untransferable requests terminate the worker and release the active slot',async()=>{
 const terminate=vi.fn();
 vi.stubGlobal('Worker',class {onmessage=null;onerror=null;terminate=terminate;postMessage(){throw new Error('DataCloneError');}});
 for(let i=0;i<3;i++)expect((await computeMathLocal(request)).answer).toContain('cannot be transferred');
 expect(terminate).toHaveBeenCalledTimes(3);
});
it('cancellation during worker startup prevents dispatch and terminates the worker',async()=>{
 const controller=new AbortController(),postMessage=vi.fn(),terminate=vi.fn();
 vi.stubGlobal('Worker',class {onmessage=null;onerror=null;postMessage=postMessage;terminate=terminate;constructor(){controller.abort();}});
 expect((await computeMathLocal(request,controller.signal)).answer).toContain('cancelled');
 expect(postMessage).not.toHaveBeenCalled();expect(terminate).toHaveBeenCalledOnce();
});
