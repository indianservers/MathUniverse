/// <reference types="vite/client" />
import { useEffect, useRef, useState, type RefObject } from 'react';
import type { ARSceneState } from './types';
import { ARHandGestureEngine, landmarkPinch, type HandPoint } from './arHandGestures';

export default function ARCameraHands({video,stream,scene,onChange,objectId}:{video:RefObject<HTMLVideoElement>;stream:MediaStream|null;scene:ARSceneState;onChange:(delta:Partial<ARSceneState>)=>void;objectId:string|null}){
 const [enabled,setEnabled]=useState(false),[status,setStatus]=useState('Pinch to move; two pinches resize and rotate.'),[points,setPoints]=useState<HandPoint[]>([]);
 const latest=useRef({scene,onChange});latest.current={scene,onChange};
 useEffect(()=>{
  if(!enabled||!stream||!objectId)return;
  if(typeof Worker==='undefined'||typeof createImageBitmap==='undefined'||typeof OffscreenCanvas==='undefined'){setStatus('Hand tracking unavailable in this browser. Use touch controls.');return;}
  let alive=true,ready=false,busy=false,raf=0,last=0,lastVideo=-1;
  const engine=new ARHandGestureEngine();
  const worker=new Worker(new URL('./arHandTracking.worker.ts',import.meta.url),{type:'module'});
  setStatus('Loading on-device hand tracking…');
  const timeout=window.setTimeout(()=>{if(!ready){setStatus('Hand tracker could not start. Turn it off and retry, or use touch.');worker.terminate();}},30000);
  worker.onmessage=event=>{
   if(!alive)return;
   if(event.data.type==='ready'){ready=true;clearTimeout(timeout);setStatus('Show your hands. Pinch to grab the selected object.');}
   if(event.data.type==='error'){busy=false;ready=false;engine.reset();setPoints([]);setStatus('Hand tracking unavailable. Turn it off and retry, or use touch.');worker.terminate();}
   if(event.data.type==='hands'){
    busy=false;
    if(document.hidden){engine.reset();return;}
    const hands=(event.data.landmarks as HandPoint[][]).map((p,i)=>landmarkPinch(p,event.data.handedness[i]?.[0]?.categoryName??String(i))).filter(h=>h!==null);
    setPoints(hands.map(h=>h.point));
    const {scene:current,onChange:change}=latest.current;
    const next=engine.update(hands,{position:current.objectPosition,rotation:current.objectRotation,scale:current.objectScale},true);
    if(next)change({objectPosition:next.position,objectRotation:next.rotation,objectScale:next.scale,placementReady:true});
    setStatus(hands.length?'Pinch and move; open your fingers to release. Two hands resize/rotate.':'Show your hands in the camera view.');
   }
  };
  worker.onerror=()=>{ready=false;busy=false;engine.reset();setStatus('Hand tracking unavailable. Use touch controls.');worker.terminate();};
  worker.postMessage({type:'init',root:new URL(import.meta.env.BASE_URL+'ar-hand-tracking/',location.origin).href});
  const loop=(time:number)=>{
   if(!alive)return;raf=requestAnimationFrame(loop);
   const element=video.current;
   if(document.hidden){engine.reset();return;}
   if(!ready||busy||time-last<100||!element||element.readyState<2||!element.videoWidth||element.currentTime===lastVideo)return;
   busy=true;last=time;lastVideo=element.currentTime;
   void createImageBitmap(element,{resizeWidth:640,resizeHeight:Math.max(1,Math.round(640*element.videoHeight/element.videoWidth))}).then(bitmap=>{
    if(!alive){bitmap.close();return;}worker.postMessage({type:'frame',bitmap,time},[bitmap]);
   }).catch(()=>{busy=false;engine.reset();});
  };
  raf=requestAnimationFrame(loop);
  return()=>{alive=false;clearTimeout(timeout);cancelAnimationFrame(raf);worker.terminate();engine.reset();};
 },[enabled,stream,objectId,video]);
 return <>
  <div className="absolute left-2 right-2 top-2 z-20 rounded-lg bg-slate-950/85 p-2 text-xs text-white" onPointerDown={e=>e.stopPropagation()} onPointerUp={e=>e.stopPropagation()} onPointerMove={e=>e.stopPropagation()}>
   <button type="button" className="min-h-11 rounded border border-cyan-400 px-3 font-bold disabled:opacity-40" disabled={!stream||!objectId} aria-pressed={enabled} onClick={()=>{setEnabled(v=>!v);setPoints([]);}}>Hand gestures {enabled?'on':'off'}</button>
   <p role="status">{enabled&&stream&&objectId?status:'Select an object and start the camera. Pinch to move; two pinches resize/rotate.'}</p>
  </div>
  {enabled&&points.length>0&&<svg className="pointer-events-none absolute inset-0 z-10 h-full w-full" viewBox={`0 0 ${video.current?.videoWidth||640} ${video.current?.videoHeight||480}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">{points.map((p,i)=><circle key={i} cx={p.x*(video.current?.videoWidth||640)} cy={p.y*(video.current?.videoHeight||480)} r="10" fill="#22d3ee" stroke="white" strokeWidth="3"/>)}</svg>}
 </>;
}
