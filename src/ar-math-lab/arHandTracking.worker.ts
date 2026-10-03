import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
let tracker: HandLandmarker | null=null;
let inputCanvas: OffscreenCanvas | null=null;
// Inference stays off the UI thread; frames are never uploaded.
self.onmessage=async(event: MessageEvent)=>{
 const data=event.data;
 try{
  if(data.type==='init'){
   const files=await FilesetResolver.forVisionTasks(data.root+'wasm',true);
   const options={runningMode:'VIDEO' as const,numHands:2,minHandDetectionConfidence:.4,minHandPresenceConfidence:.4,minTrackingConfidence:.5};
   try{tracker=await HandLandmarker.createFromOptions(files,{...options,baseOptions:{modelAssetPath:data.root+'hand_landmarker.task',delegate:'GPU'}});}
   catch{tracker=await HandLandmarker.createFromOptions(files,{...options,baseOptions:{modelAssetPath:data.root+'hand_landmarker.task',delegate:'CPU'}});}
   self.postMessage({type:'ready'});
  }else if(data.type==='frame'&&tracker){
   try{
    if(!inputCanvas||inputCanvas.width!==data.bitmap.width||inputCanvas.height!==data.bitmap.height)inputCanvas=new OffscreenCanvas(data.bitmap.width,data.bitmap.height);
    const context=inputCanvas.getContext('2d');if(!context)throw new Error('Camera frame conversion unavailable');
    context.drawImage(data.bitmap,0,0);
    const result=tracker.detectForVideo(inputCanvas,data.time);self.postMessage({type:'hands',landmarks:result.landmarks,handedness:result.handedness});
   }
   finally{data.bitmap.close();}
  }
 }catch(error){self.postMessage({type:'error',message:error instanceof Error?error.message:'Hand tracking failed'});}
};
