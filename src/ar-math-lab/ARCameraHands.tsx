/// <reference types="vite/client" />
import { useEffect, useRef, useState, type RefObject } from 'react';
import type { ARSceneState } from './types';
import ARHandGuide from './ARHandGuide';
import { ARHandGestureEngine, landmarkPinch, type HandPoint } from './arHandGestures';

export default function ARCameraHands({video,stream,scene,onChange,objectId}:{video:RefObject<HTMLVideoElement>;stream:MediaStream|null;scene:ARSceneState;onChange:(delta:Partial<ARSceneState>)=>void;objectId:string|null}){
 const [enabled,setEnabled]=useState(true),[status,setStatus]=useState('Starting hand tracking…'),[landmarks,setLandmarks]=useState<HandPoint[][]>([]),[grabbing,setGrabbing]=useState(0),[mode,setMode]=useState<'move'|'resize'>('move'),[retry,setRetry]=useState(0),[failed,setFailed]=useState(false);
 const modeRef=useRef(mode);modeRef.current=mode;
 const latest=useRef({scene,onChange});latest.current={scene,onChange};
 useEffect(()=>{
  setLandmarks([]);setGrabbing(0);setFailed(false);
  if(!enabled||!stream)return;
  if(typeof Worker==='undefined'||typeof createImageBitmap==='undefined'||typeof OffscreenCanvas==='undefined'){setStatus('Hand tracking unavailable in this browser. Use touch controls.');return;}
  let alive=true,ready=false,busy=false,raf=0,last=0,lastVideo=-1;
  const engine=new ARHandGestureEngine();let previousMode=modeRef.current;
  const worker=new Worker(new URL('./arHandTracking.worker.ts',import.meta.url),{type:'module'});
  setStatus('Loading on-device hand tracking…');
  const fail=()=>{ready=false;busy=false;engine.reset();setLandmarks([]);setGrabbing(0);setFailed(true);setStatus('Hand tracker could not start. Retry hand tracking or use touch controls.');clearTimeout(timeout);worker.terminate();};
  const timeout=window.setTimeout(()=>{if(!ready)fail();},30000);
  worker.onmessage=event=>{
   if(!alive)return;
   if(event.data.type==='ready'){ready=true;clearTimeout(timeout);setStatus('Show your hands. Pinch to grab the selected object.');}
   if(event.data.type==='error'){fail();}
   if(event.data.type==='hands'){
    busy=false;
    if(document.hidden){engine.reset();return;}
    const hands=(event.data.landmarks as HandPoint[][]).map((p,i)=>landmarkPinch(p,event.data.handedness[i]?.[0]?.categoryName??String(i))).filter(h=>h!==null);
    setLandmarks(event.data.landmarks);
    const {scene:current,onChange:change}=latest.current;
    if(previousMode!==modeRef.current){engine.reset();previousMode=modeRef.current;}
    const next=engine.update(objectId?hands:[],{position:current.objectPosition,rotation:current.objectRotation,scale:current.objectScale},true,modeRef.current==='resize');
    setGrabbing(engine.grabbedCount);
    if(next)change({objectPosition:next.position,objectRotation:next.rotation,objectScale:next.scale,placementReady:true});
    setStatus(!hands.length?'No hands detected. Show your whole hand in good light.':!objectId?`${hands.length} hand(s) detected. Add a graph or geometry object to interact.`:engine.grabbedCount===2?'Object selected · spread pinched hands to expand, bring them together to shrink.':engine.grabbedCount===1?modeRef.current==='resize'?'Object selected · move your pinched hand up to expand, down to shrink.':'Object selected · move your pinched hand to drag. Open fingers to release.':`${hands.length} hand(s) detected · pinch thumb and index to select the displayed object.`);
   }
  };
  worker.onerror=fail;
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
 },[enabled,stream,objectId,video,retry]);
 return <>
  <div className="absolute left-2 right-2 top-2 z-20 rounded-lg bg-slate-950/85 p-2 text-xs text-white" onPointerDown={e=>e.stopPropagation()} onPointerUp={e=>e.stopPropagation()} onPointerMove={e=>e.stopPropagation()}>
   <div className="flex flex-wrap gap-2"><button type="button" className="min-h-11 rounded border border-cyan-400 px-3 font-bold disabled:opacity-40" disabled={!stream} aria-pressed={enabled} onClick={()=>{setEnabled(v=>!v);setLandmarks([]);setGrabbing(0);}}>Hand gestures {enabled?'on':'off'}</button>
   {!failed&&<><button type="button" className="min-h-11 rounded border px-3" aria-pressed={mode==='move'} onClick={()=>setMode('move')}>Move</button><button type="button" className="min-h-11 rounded border px-3" aria-pressed={mode==='resize'} onClick={()=>setMode('resize')}>Resize</button></>}
   {failed&&<button type="button" className="min-h-11 rounded border px-3" onClick={()=>setRetry(v=>v+1)}>Retry hand tracking</button>}<ARHandGuide/></div>
   <p role="status" className="truncate" title={status}>{enabled&&stream?status:stream?'Hand tracking paused. Turn it on to pinch, select, and expand.':'Start the camera to detect hands automatically.'}</p>
   {enabled&&stream&&objectId&&<p className="truncate text-cyan-200" title="Two hands: spread to expand, bring together to shrink. Resize mode: pinch and move one hand up/down to zoom.">{grabbing?'Pinch selected':'Pinch to select'} · two hands expand/shrink · Resize: one hand up/down</p>}
  </div>
  {enabled&&landmarks.length>0&&<svg className="pointer-events-none absolute inset-0 z-10 h-full w-full" viewBox={`0 0 ${video.current?.videoWidth||640} ${video.current?.videoHeight||480}`} preserveAspectRatio="xMidYMid slice" aria-label="Detected hand landmarks">{landmarks.map((hand,i)=><g key={i}>{hand.map((p,j)=><circle key={j} cx={p.x*(video.current?.videoWidth||640)} cy={p.y*(video.current?.videoHeight||480)} r={j===4||j===8?7:3} fill={grabbing?'#34d399':'#22d3ee'} stroke="white" strokeWidth="1"/>)}</g>)}</svg>}
 </>;
}
