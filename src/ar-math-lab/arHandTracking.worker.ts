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
   // Software WebGL can be much slower than WASM/XNNPACK, especially in headless QA.
   const probe=new OffscreenCanvas(8,8).getContext('webgl2');const debug=probe?.getExtension('WEBGL_debug_renderer_info');
   const renderer=probe&&debug?String(probe.getParameter(debug.UNMASKED_RENDERER_WEBGL)):'';
   const software=/swiftshader|llvmpipe|software/i.test(renderer);probe?.getExtension('WEBGL_lose_context')?.loseContext();
   try{tracker=await HandLandmarker.createFromOptions(files,{...options,baseOptions:{modelAssetPath:data.root+'hand_landmarker.task',delegate:software?'CPU':'GPU'}});}
   catch{tracker=await HandLandmarker.createFromOptions(files,{...options,baseOptions:{modelAssetPath:data.root+'hand_landmarker.task',delegate:'CPU'}});}
   self.postMessage({type:'ready'});
  }else if(data.type==='frame'&&tracker){
   try{
    if(!inputCanvas||inputCanvas.width!==data.bitmap.width||inputCanvas.height!==data.bitmap.height)inputCanvas=new OffscreenCanvas(data.bitmap.width,data.bitmap.height);
    const context=inputCanvas.getContext('2d');if(!context)throw new Error('Camera frame conversion unavailable');
    context.drawImage(data.bitmap,0,0);
    const started=performance.now();const result=tracker.detectForVideo(inputCanvas,data.time);self.postMessage({type:'hands',landmarks:result.landmarks,handedness:result.handedness,timestamp:data.time,processingMs:performance.now()-started});
   }
   finally{data.bitmap.close();}
  }
 }catch(error){self.postMessage({type:'error',message:error instanceof Error?error.message:'Hand tracking failed'});}
};
