import {executeCapabilityDirect} from '../intelligence/engineRegistryCore';
self.onmessage=async(event:MessageEvent<{id:string;input:unknown}>)=>{self.postMessage(await executeCapabilityDirect(event.data.id,event.data.input));};
