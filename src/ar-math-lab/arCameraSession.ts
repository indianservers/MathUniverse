export function stopCameraTracks(stream: MediaStream | null) {
 stream?.getTracks().forEach(track=>track.stop());
}

/** getUserMedia cannot be aborted; discard and stop any stream arriving after cancellation. */
export function requestCameraStream(mediaDevices: Pick<MediaDevices,'getUserMedia'>, constraints: MediaStreamConstraints, signal: AbortSignal, timeoutMs=15000): Promise<MediaStream> {
 return new Promise((resolve,reject)=>{
  let settled=false;
  const finish=(error?:unknown,stream?:MediaStream)=>{
   if(settled){if(stream)stopCameraTracks(stream);return;}
   settled=true;clearTimeout(timer);signal.removeEventListener('abort',abort);
   if(error)reject(error);else resolve(stream!);
  };
  const abort=()=>finish(new DOMException('Camera request cancelled','AbortError'));
  const timer=setTimeout(()=>finish(new DOMException('Camera permission did not finish in time','TimeoutError')),timeoutMs);
  signal.addEventListener('abort',abort,{once:true});
  if(signal.aborted){abort();return;}
  try {void mediaDevices.getUserMedia(constraints).then(stream=>finish(undefined,stream),error=>finish(error));}
  catch(error){finish(error);}
 });
}

export async function requestEnvironmentCameraStream(mediaDevices: Pick<MediaDevices,'getUserMedia'>,signal:AbortSignal){
 try {
  return await requestCameraStream(mediaDevices,{video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}},audio:false},signal);
 }catch(error){
  // Permission, missing hardware, busy camera, and timeout errors cannot be fixed by retries.
  if(!(error instanceof Error)||error.name!=='OverconstrainedError'||signal.aborted)throw error;
  return requestCameraStream(mediaDevices,{video:true,audio:false},signal);
 }
}

export function cameraErrorMessage(error: unknown) {
 const name=error instanceof Error?error.name:'';
 if(name==='NotAllowedError'||name==='SecurityError')return 'Camera permission is blocked. Allow camera access in your browser site settings and device privacy settings, then retry. If this embedded browser does not show a permission prompt, open this page in Chrome or Edge.';
 if(name==='NotFoundError')return 'No camera was found. Connect or enable a camera, then retry.';
 if(name==='NotReadableError')return 'The camera could not be opened. Close other apps using it and check device camera privacy settings, then retry.';
 if(name==='OverconstrainedError')return 'This camera could not satisfy the video request. Try another camera or browser.';
 if(name==='TimeoutError')return 'Camera permission is still pending. Allow the browser camera prompt, then retry. If no prompt appears here, open this page in Chrome or Edge.';
 return 'Unable to start the camera. Check camera access in your browser and device settings, then retry.';
}
