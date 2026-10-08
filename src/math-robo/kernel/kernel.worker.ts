import {computeMath} from './kernel';
import type {KernelRequest} from './types';
self.onmessage=async(event:MessageEvent<KernelRequest>)=>{self.postMessage(await computeMath(event.data));};
