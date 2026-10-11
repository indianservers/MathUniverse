import { sampleMobileLayer, type MobileSamplingInput, type MobileSamplingResult } from "./mobileGraphSampling";
self.onmessage = (event: MessageEvent<MobileSamplingInput>) => {
  const input=event.data; const result: MobileSamplingResult={sampled:[],advanced:{}};
  try {
    for (let index=0;index<input.surfaces.length;index++) {
      self.postMessage({type:"progress",progress:index/Math.max(1,input.surfaces.length)});
      const item=input.surfaces[index],layer=sampleMobileLayer(item,input);
      result.sampled.push({item,samples:layer.samples});result.advanced[item.id]=layer.advanced;
    }
    self.postMessage({type:"complete",result});
  } catch(error) { self.postMessage({type:"error",error:error instanceof Error?error.message:"Plot generation failed"}); }
};
