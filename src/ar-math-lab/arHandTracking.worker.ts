import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
let tracker: HandLandmarker | null=null;
// Inference stays off the UI thread; frames are never uploaded.
self.onmessage=async(event: MessageEvent)=>{
 const data=event.data;
 try{
  if(data.type==='init'){
   tracker=await HandLandmarker.createFromOptions(await FilesetResolver.forVisionTasks(data.root+'wasm',true),{
    baseOptions:{modelAssetPath:data.root+'hand_landmarker.task',delegate:'CPU'},runningMode:'VIDEO',numHands:2,
    minHandDetectionConfidence:.65,minHandPresenceConfidence:.65,minTrackingConfidence:.65});
   self.postMessage({type:'ready'});
  }else if(data.type==='frame'&&tracker){
   try{const result=tracker.detectForVideo(data.bitmap,data.time);self.postMessage({type:'hands',landmarks:result.landmarks,handedness:result.handedness});}
   finally{data.bitmap.close();}
  }
 }catch(error){self.postMessage({type:'error',message:error instanceof Error?error.message:'Hand tracking failed'});}
};
