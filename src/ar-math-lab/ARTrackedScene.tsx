import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { trackedARFailure } from "./arWorldTracking";
import { ARHandGestureEngine, type PinchHand } from "./arHandGestures";

import ARHandGuide from './ARHandGuide';
import { ARSpatialIntelligence } from './arSpatialIntelligence';

export type ARTrackingHandle = { start: () => Promise<void> };
const ARWorldTracking = forwardRef<ARTrackingHandle,{children:ReactNode;hasObject:boolean;onSessionChange?:(active:boolean)=>void}>(function ARWorldTracking({children,hasObject,onSessionChange},ref){
 const [supported,setSupported]=useState(false),[session,setSession]=useState<XRSession|null>(null),[starting,setStarting]=useState(false),[message,setMessage]=useState("Checking tracked AR support…"),[scale,setScale]=useState(.3),[placement,setPlacement]=useState(0);
 const overlay=useRef<HTMLDivElement>(null),active=useRef<XRSession|null>(null),mounted=useRef(true);
 const [handsEnabled,setHandsEnabled]=useState(true);
 const [offset,setOffset]=useState<[number,number,number]>([0,0,0]),[orientation,setOrientation]=useState<[number,number,number]>([0,0,0]);
 useEffect(()=>{onSessionChange?.(!!session);},[session,onSessionChange]);
 useImperativeHandle(ref,()=>({start}));
 useEffect(()=>{
  const root=overlay.current;
  const beforeSelect=(event:Event)=>{if(event.target instanceof Element&&event.target.closest('button,input,label,select,summary'))event.preventDefault();};
  root?.addEventListener('beforexrselect',beforeSelect);
  return()=>root?.removeEventListener('beforexrselect',beforeSelect);
 },[]);
 useEffect(()=>{mounted.current=true;const xr=navigator.xr;
  if(!window.isSecureContext||!xr){setMessage("Tracked AR needs a compatible HTTPS device. Camera overlay and 3D preview remain available.");return ()=>{mounted.current=false;};}
  xr.isSessionSupported("immersive-ar").then(ok=>{if(mounted.current){setSupported(ok);setMessage(ok?"Detect a surface, then tap to place your selected object.":"Tracked AR is unavailable here. Camera overlay and 3D preview remain available.");}}).catch(()=>{if(mounted.current)setMessage("Tracked AR support could not be checked.");});
  return ()=>{mounted.current=false;const current=active.current;active.current=null;void current?.end().catch(()=>undefined);};
 },[]);
 async function start(){if(starting||active.current)return;if(!hasObject){setMessage("Create a graph or geometry object first, then start surface AR.");return;}if(!window.isSecureContext||!navigator.xr||!overlay.current){setMessage("Surface AR requires a compatible AR device and HTTPS. On Android, open this page in Chrome with Google Play Services for AR installed. Camera overlay cannot anchor objects to your room.");return;}setStarting(true);setMessage("Starting tracked AR…");
  try{setHandsEnabled(true);setOffset([0,0,0]);setOrientation([0,0,0]);const next=await navigator.xr.requestSession("immersive-ar",{requiredFeatures:["hit-test"],optionalFeatures:["dom-overlay","hand-tracking"],domOverlay:{root:overlay.current}});
   if(!mounted.current){await next.end();return;}active.current=next;next.addEventListener("end",()=>{active.current=null;if(mounted.current){setSession(null);setStarting(false);setMessage("Tracked AR ended. 3D preview is available.");}},{once:true});setSession(next);setStarting(false);setMessage("Move your phone slowly to find a surface. Tap when the ring appears.");
  }catch(error){if(mounted.current){setStarting(false);setMessage(trackedARFailure(error));}}
 }
 const fail=useCallback((error:unknown)=>{const reason=trackedARFailure(error);setMessage(reason);void active.current?.end().then(()=>{if(mounted.current)setMessage(reason);}).catch(()=>undefined);},[]);
 return <div ref={overlay} className={session?"fixed inset-0 z-[100] bg-transparent":"border-t border-cyan-500/30 bg-slate-950 p-3 text-white"}>
  {session&&<Canvas className="absolute inset-0" camera={{position:[0,1,3]}} gl={{alpha:true,antialias:true}} onCreated={({gl})=>gl.setClearColor(0x000000,0)}><ambientLight intensity={1}/><directionalLight position={[2,5,3]} intensity={1.4}/><TrackedPlacement session={session} scale={scale} placement={placement} handsEnabled={handsEnabled} onMessage={setMessage} onError={fail}><group position={offset} rotation={orientation}>{children}</group></TrackedPlacement></Canvas>}
  <div className={session?"pointer-events-auto absolute inset-x-3 bottom-4 max-h-[55vh] overflow-y-auto rounded-xl bg-slate-950/85 p-3 text-white":"space-y-2"}>
   <p className="text-sm font-bold">AR spatial intelligence · 6DoF</p>
   <p className="text-xs">Scan a surface, tap the ring to place, then walk around the object. Camera overlay is a separate mode.</p>
   <p role="status" className="text-xs">{message}</p>
   <ARHandGuide native/>
   <details className="rounded-lg border border-cyan-400/30 p-2">
    <summary className="cursor-pointer text-xs font-bold">6DoF object controls · X/Y/Z + pitch/yaw/roll</summary>
    <p className="my-2 text-xs">Device tracking follows your position and orientation. These controls adjust the object relative to its surface.</p>
    <div className="grid grid-cols-3 gap-2">{(['X','Y','Z'] as const).map((axis,i)=><div key={axis}><p className="text-xs">{axis}: {offset[i].toFixed(2)} m</p>{[-1,1].map(direction=><button key={direction} disabled={!session} className="min-h-11 rounded border px-2 disabled:opacity-40" aria-label={`Move ${axis} ${direction<0?'minus':'plus'}`} onClick={()=>setOffset(v=>v.map((n,j)=>j===i?Math.max(-5,Math.min(5,n+direction*.05)):n) as [number,number,number])}>{axis} {direction<0?'-':'+'}</button>)}</div>)}</div>
    <div className="mt-2 grid grid-cols-3 gap-2">{(['Pitch','Yaw','Roll'] as const).map((axis,i)=><div key={axis}><p className="text-xs">{axis}: {Math.round(orientation[i]*180/Math.PI)} degrees</p>{[-1,1].map(direction=><button key={direction} disabled={!session} className="min-h-11 rounded border px-2 disabled:opacity-40" aria-label={`${axis} ${direction<0?'minus':'plus'}`} onClick={()=>setOrientation(v=>v.map((n,j)=>j===i?n+direction*Math.PI/12:n) as [number,number,number])}>{direction<0?'-':'+'}</button>)}</div>)}</div>
    <button className="mt-2 min-h-11 rounded border px-3 text-xs" onClick={()=>{setOffset([0,0,0]);setOrientation([0,0,0]);}}>Reset object pose</button>
   </details>
   {session&&<button className="min-h-11 rounded border px-3" aria-pressed={handsEnabled} onClick={()=>setHandsEnabled(v=>!v)}>Native hand gestures {handsEnabled?'on':'off'}</button>}
   {!session?<button type="button" className="min-h-11 rounded-lg border border-cyan-400 px-3 text-sm font-bold disabled:opacity-40" disabled={!supported||starting||!hasObject} onClick={()=>void start()}>{starting?"Starting…":"Start tracked AR (WebXR)"}</button>:<div className="flex flex-wrap items-center gap-2"><button className="min-h-11 rounded border px-3" onClick={()=>{setPlacement(p=>p+1);setOffset([0,0,0]);setOrientation([0,0,0]);setMessage("Find another surface, then tap to reposition.");}}>Reposition tracked object</button><label className="text-xs">Display scale {scale.toFixed(2)}<input aria-label="Tracked AR display scale" type="range" min={.1} max={2} step={.05} value={scale} onChange={e=>setScale(Number(e.target.value))}/></label><button className="min-h-11 rounded border px-3" onClick={()=>void session.end().catch(fail)}>End tracked AR</button></div>}
   {!hasObject&&!session&&<p className="text-xs">Create or select a graph or solid first.</p>}
  </div>
 </div>;
});
export default ARWorldTracking;
function TrackedPlacement({session,children,scale,placement,handsEnabled,onMessage,onError}:{session:XRSession;children:ReactNode;scale:number;placement:number;handsEnabled:boolean;onMessage:(message:string)=>void;onError:(error:unknown)=>void}){
 const {gl}=useThree(),reticle=useRef<THREE.Group>(null),object=useRef<THREE.Group>(null),hitSource=useRef<XRHitTestSource|null>(null),placed=useRef(false);
 const intelligence=useRef(new ARSpatialIntelligence()),lastMessage=useRef('');
 const report=(text:string)=>{if(lastMessage.current!==text){lastMessage.current=text;onMessage(text);}};
 const manipulation=useRef<THREE.Group>(null),gestures=useRef(new ARHandGestureEngine());
 useEffect(()=>{gestures.current.reset();if(handsEnabled)onMessage('Place the object first. Pinch nearby to move; two hands resize/rotate. If native hands are unavailable, use hand gestures in camera overlay.');},[handsEnabled,onMessage]);
 useEffect(()=>{let alive=true;gl.xr.enabled=true;gl.xr.setReferenceSpaceType("local");
  void (async()=>{try{const requestHitTest=session.requestHitTestSource;if(!requestHitTest)throw new DOMException("Surface hit testing unavailable", "NotSupportedError");await gl.xr.setSession(session);if(!alive)return;const viewer=await session.requestReferenceSpace("viewer");const source=await requestHitTest.call(session,{space:viewer});if(!source)throw new DOMException("Surface hit testing unavailable", "NotSupportedError");if(alive)hitSource.current=source??null;else source?.cancel();}catch(error){if(alive)onError(error);}})();
  const select=()=>{if(reticle.current?.visible&&object.current){object.current.matrix.copy(reticle.current.matrix);object.current.matrixWorldNeedsUpdate=true;object.current.visible=true;placed.current=true;reticle.current.visible=false;onMessage("Object placed in tracked world space. Walk around it or choose Reposition.");}};
  session.addEventListener("select",select);
  return ()=>{alive=false;hitSource.current?.cancel();hitSource.current=null;session.removeEventListener("select",select);};
 },[gl,session,onMessage,onError]);
 useEffect(()=>{placed.current=false;intelligence.current.reset();lastMessage.current='';gestures.current.reset();if(object.current)object.current.visible=false;if(manipulation.current){manipulation.current.position.set(0,0,0);manipulation.current.rotation.set(0,0,0);manipulation.current.scale.setScalar(1);}},[placement]);
 useFrame((state,__,frame)=>{if(!frame||!hitSource.current||!reticle.current)return;reticle.current.visible=false;
  const reference=gl.xr.getReferenceSpace();if(!reference)return;
  const viewer=frame.getViewerPose(reference);
  const tracked=session.visibilityState==='visible'&&!!viewer&&!viewer.emulatedPosition;
  if(!tracked){intelligence.current.update(state.clock.elapsedTime*1000,false,[]);gestures.current.reset();if(object.current)object.current.visible=false;report('Position tracking lost. Hold still, then slowly scan a well-lit, textured area.');return;}
  if(placed.current){
   if(object.current)object.current.visible=true;report('6DoF tracking active. Object placed; walk around it or use the pose controls.');
   if(!handsEnabled||!manipulation.current||!object.current||session.visibilityState!=='visible'){gestures.current.reset();return;}
   const hands:PinchHand[]=[];
   for(const source of Array.from(session.inputSources)){
    if(!source.hand||!frame.getJointPose)continue;
    const thumb=source.hand.get('thumb-tip'),index=source.hand.get('index-finger-tip');
    if(!thumb||!index)continue;
    const t=frame.getJointPose(thumb,reference),i=frame.getJointPose(index,reference);if(!t||!i)continue;
    const a=t.transform.position,b=i.transform.position;
    const world=new THREE.Vector3((a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2);
    const content=manipulation.current.children[0]?.children[0]??manipulation.current;
    const center=content.getWorldPosition(new THREE.Vector3());
    // Only a pinch near the selected object's origin can acquire a grab.
    const ratio=world.distanceTo(center)>.45?1:Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)/.08;
    const point=object.current.worldToLocal(world);
    hands.push({id:source.handedness,point:{x:point.x,y:point.y,z:point.z},ratio});
   }
   const group=manipulation.current;
   const next=gestures.current.update(hands,{position:group.position.toArray() as [number,number,number],rotation:[group.rotation.x,group.rotation.y,group.rotation.z],scale:group.scale.x});
   if(next){group.position.fromArray(next.position);group.rotation.set(...next.rotation);group.scale.setScalar(next.scale);}
   return;
  }
  const hits=(frame.getHitTestResults(hitSource.current) as XRHitTestResult[]).map(hit=>hit.getPose(reference)?.transform.matrix).filter((matrix):matrix is Float32Array=>!!matrix);
  const assessment=intelligence.current.update(state.clock.elapsedTime*1000,true,hits);
  if(assessment.matrix){reticle.current.matrix.fromArray(assessment.matrix);reticle.current.matrixWorldNeedsUpdate=true;reticle.current.visible=assessment.ready;}
  report(assessment.message);
 });
 return <><group ref={reticle} visible={false} matrixAutoUpdate={false}><mesh rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.08,.1,32]}/><meshBasicMaterial color="#22d3ee" side={THREE.DoubleSide}/></mesh></group><group ref={object} matrixAutoUpdate={false} visible={false}><group ref={manipulation}><group scale={scale}>{children}</group></group></group></>;
}
