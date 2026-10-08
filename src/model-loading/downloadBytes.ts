export type DownloadProgress={asset:string;loaded:number;total?:number;percent?:number};
/** Measure decoded bytes. A compressed Content-Length is not a valid decoded total. */
export async function downloadBytes(url:string,onProgress:(progress:DownloadProgress)=>void,init?:RequestInit):Promise<{bytes:Uint8Array;response:Response}>{
 const response=await fetch(url,init);if(!response.ok)throw new Error(`Download failed (${response.status}): ${url.split('/').pop()}`);
 const size=Number(response.headers.get('content-length')),encoding=response.headers.get('content-encoding');
 const total=size>0&&(!encoding||encoding==='identity')?size:undefined;
 const asset=url.split('/').pop()?.split('?')[0]??'Model asset';let loaded=0;
 const report=(done=false)=>onProgress({asset,loaded,total:done?loaded:total,percent:done?100:total?Math.min(99,Math.floor(loaded/total*100)):undefined});
 report();const reader=response.body?.getReader();const chunks:Uint8Array[]=[];
 if(reader){try{for(;;){const {done,value}=await reader.read();if(done)break;chunks.push(value);loaded+=value.byteLength;report();}}catch(error){await reader.cancel().catch(()=>{});throw error;}finally{reader.releaseLock();}}
 else{const bytes=new Uint8Array(await response.arrayBuffer());chunks.push(bytes);loaded=bytes.byteLength;}
 const bytes=new Uint8Array(loaded);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}report(true);return {bytes,response};
}
