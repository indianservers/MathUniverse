import {writeFileSync} from 'node:fs';
/** Windows indexers occasionally lock generated reports. Preserve failures after a bounded retry. */
export function writeTestReport(path:string,data:string){
  for(let attempt=0;;attempt++){
    try{writeFileSync(path,data);return;}catch(error){const code=(error as NodeJS.ErrnoException).code;if(attempt>=5||!['UNKNOWN','EBUSY'].includes(code??''))throw error;Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,25*2**attempt);}
  }
}
