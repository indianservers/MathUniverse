import ARHandLandmarkOverlay from '../../ar-math-lab/hand-intelligence/ARHandLandmarkOverlay';
import GestureActionTable from '../../ar-math-lab/hand-intelligence/GestureActionTable';
import ImmersiveWorkspaceControls from "./ImmersiveWorkspaceControls";
import { ImmersiveUIControls } from "./ImmersiveUIControls";
import { ImmersiveModelController } from "./ImmersiveModelController";
import Immersive2DBoard from "./Immersive2DBoard";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type MutableRefObject } from 'react';
import { Hand, Scan, X, Minus, HelpCircle } from 'lucide-react';
import ARCameraHands from '../../ar-math-lab/ARCameraHands';
import { HandIntelligenceEngine } from '../../ar-math-lab/hand-intelligence/HandIntelligenceEngine';
import { SpatialHandEngine } from '../../ar-math-lab/hand-intelligence/SpatialHandEngine';
import { requestCameraStream, stopCameraTracks, cameraErrorMessage } from '../../ar-math-lab/arCameraSession';
import type { CameraHandRuntime, HandIntelligenceState, ManipulationResult, RawHand } from '../../ar-math-lab/hand-intelligence/types';
import type { ARSceneState } from '../../ar-math-lab/types';
import { identityTransform, type ImmersiveAdapter } from './types';
import './immersive.css';
export type ImmersiveController = {
 adapter: MutableRefObject<ImmersiveAdapter | null>;hover:MutableRefObject<string|null>; projected: MutableRefObject<Map<string, import("../../ar-math-lab/hand-intelligence/types").ObjectAffordance>>;
 session: XRSession | null; hands: boolean; scale:number; placement:number; placementMode:'horizontal'|'vertical'|'space';pose:{position:[number,number,number];rotation:[number,number,number]};
 register: (adapter:ImmersiveAdapter) => () => void;
 frame: (state:HandIntelligenceState,result:ManipulationResult)=>void;
 nativeHands: (hands:RawHand[],time:number,motion?:{delta:[number,number,number];ratio:number})=>HandIntelligenceState|undefined;
 status: (message:string)=>void;toggleAR:()=>Promise<void>;toggleHands:()=>void;profile:import("../../ar-math-lab/hand-intelligence/types").IntelligenceProfile;setProfile:(profile:import("../../ar-math-lab/hand-intelligence/types").IntelligenceProfile)=>void;cursorVisible:boolean;setCursorVisible:(value:boolean)=>void;
};
export const ImmersiveContext=createContext<ImmersiveController|null>(null);
export const useImmersive=()=>useContext(ImmersiveContext);
const TARGETS=new Set(['/workspace/graph','/workspace/3d','/workspace/geometry','/math-lab/3d-graphing']);
export function ImmersiveBoundary({children}:{children:ReactNode}){
 return typeof window !== 'undefined' && TARGETS.has(window.location.pathname)?<ImmersiveInteractionManager>{children}</ImmersiveInteractionManager>:<>{children}</>;
}
export function useImmersiveAdapter(adapter:ImmersiveAdapter | null){
 const controller=useImmersive();const latest=useRef(adapter);latest.current=adapter;
 useEffect(()=>{if(!adapter || !controller)return;return controller.register(new Proxy({} as ImmersiveAdapter,{get:(_,key)=>latest.current?.[key as keyof ImmersiveAdapter]}));},[controller?.register, !!adapter]);
 return controller;
}
export default function ImmersiveInteractionManager({children}:{children:ReactNode}){
 const hover=useRef<string|null>(null);
 const projected=useRef(new Map<string, import("../../ar-math-lab/hand-intelligence/types").ObjectAffordance>());
 const adapter=useRef<ImmersiveAdapter|null>(null),video=useRef<HTMLVideoElement>(null),stage=useRef<HTMLDivElement>(null),overlay=useRef<HTMLDivElement>(null);
 const engines=useRef({intelligence:new HandIntelligenceEngine(),spatial:new SpatialHandEngine()});
 const runtime=useRef<CameraHandRuntime>({targets:[],transform:identityTransform()});
 const [hands,setHands]=useState(false),[stream,setStream]=useState<MediaStream|null>(null),[session,setSession]=useState<XRSession|null>(null),[message,setMessage]=useState(''),[minimized,setMinimized]=useState(false),[guide,setGuide]=useState(false),[mirrored,setMirrored]=useState(true);
 const [profile,setProfile]=useState<import("../../ar-math-lab/hand-intelligence/types").IntelligenceProfile>("balanced"),[cursorVisible,setCursorVisible]=useState(true);
 const [pose,setPose]=useState<{position:[number,number,number];rotation:[number,number,number]}>({position:[0,0,0],rotation:[0,0,0]}),[positionLocked,setPositionLocked]=useState(false);
 const [scale,setScale]=useState(.1),[placement,setPlacement]=useState(0),[placementMode,setPlacementMode]=useState<'horizontal'|'vertical'|'space'>('horizontal');
 const [cursor,setCursor]=useState<{x:number;y:number;grab:boolean;target?:string;confidence:number}|null>(null);
 const active=useRef<XRSession|null>(null),starting=useRef(false),startGeneration=useRef(0),mounted=useRef(true),lastHUD=useRef(0),lastNavigation=useRef<HandIntelligenceState|null>(null);
 const [calibration,setCalibration]=useState(()=>localStorage.getItem("mu-hand-calibrated")==="true"?4:0);const calibrationStep=useRef(calibration),calibrationOrigin=useRef(0);
 const models=useRef(new ImmersiveModelController(()=>adapter.current,active=>window.dispatchEvent(new Event(active?"immersive-transaction-start":"immersive-transaction-end"))));
 const ui=useRef(new ImmersiveUIControls()),cursorPoint=useRef<{x:number;y:number}|null>(null),uiHolding=useRef(false);
 const previous=useRef(identityTransform());const handsRef=useRef(hands);handsRef.current=hands;
 const register=useRef((value:ImmersiveAdapter)=>{adapter.current=value;return()=>{if(adapter.current===value)adapter.current=null;}}).current;
 const release=()=>{if(uiHolding.current){uiHolding.current=false;window.dispatchEvent(new Event("immersive-transaction-end"));}ui.current.reset();hover.current=null;adapter.current?.element()?.querySelectorAll("[data-immersive-hover]").forEach(e=>e.removeAttribute("data-immersive-hover"));models.current.release();engines.current.intelligence.reset();engines.current.spatial.reset();lastNavigation.current=null;};
 const frame=(state:HandIntelligenceState,result:ManipulationResult)=>{
  const live=adapter.current;if(!live)return;
  const recognized=state.hands.find(h=>!h.missing&&h.quality>.6);const step=calibrationStep.current;
  if(recognized&&step<4){const pass=step===0||step===1&&recognized.openScore>.7||step===2&&recognized.pose==='fist'||step===2&&recognized.pinchRatio<.3||step===3&&Math.abs(recognized.position[0]-calibrationOrigin.current)>.06;if(pass){calibrationStep.current=step+1;calibrationOrigin.current=recognized.position[0];setCalibration(step+1);if(step===3)localStorage.setItem("mu-hand-calibrated","true");}}
  if(state.command){
   const command=state.command;if(command==='help')setGuide(v=>!v);
   else if(command==='activate'&&state.targetObjectId){if(state.targetObjectId.startsWith('workspace-ui:'))ui.current.activate(state.targetObjectId);else live.select(state.targetObjectId);setMessage('Target selected. Close your fist to grab; open your palm to release.');}
   else {const patterns={undo:/^undo\b/i,redo:/^redo\b/i,labels:/^(?:show |toggle )?labels\b/i,grid:/^(?:show |toggle )?grid\b/i,fit:/fit (?:view|to|all)|^fit$|reset view/i};const pattern=patterns[command as keyof typeof patterns];
    const source=overlay.current?.firstElementChild;const control=source&&pattern?[...source.querySelectorAll('button,input[type="checkbox"]')].find(el=>{const label=el.getAttribute('aria-label')||el.getAttribute('title')||(el.tagName==='INPUT'?el.closest('label')?.textContent:el.textContent)||'';return pattern.test(label.trim())&&!el.hasAttribute('disabled');}):null;
    if(control instanceof HTMLElement){models.current.release();ui.current.reset();control.click();setMessage(`${command} applied.`);}else setMessage(`${command} is not available in this workspace's current tools.`);
   }
  }
  hover.current=state.targetObjectId??null;
  const area=live.element();area?.querySelectorAll('[data-immersive-hover]').forEach(e=>e.removeAttribute('data-immersive-hover'));
  if(state.targetObjectId){const element=area?.querySelector(`[data-point-id="${CSS.escape(state.targetObjectId)}"]`);element?.setAttribute('data-immersive-hover','true');}
  const isUI=state.targetObjectId?.startsWith('workspace-ui:');
  const uiTransition=ui.current.update(state,()=>{if(!uiHolding.current){uiHolding.current=true;window.dispatchEvent(new Event("immersive-transaction-start"));}});
  if(uiTransition==='begin'&&!uiHolding.current){uiHolding.current=true;window.dispatchEvent(new Event('immersive-transaction-start'));}
  if(uiTransition==='end'&&uiHolding.current){uiHolding.current=false;window.dispatchEvent(new Event('immersive-transaction-end'));}
  if(!isUI)models.current.update(state,result,previous.current);
  if(!state.targetLocked){
   const prior=lastNavigation.current;
   if(prior&&state.hands.length===prior.hands.length&&state.hands.length&&state.hands.every(h=>!h.missing&&h.quality>.6&&(h.pose==='open-palm'||h.openScore>.65))){
    const mean=(s:HandIntelligenceState)=>s.hands.reduce((p,h)=>p.map((v,i)=>v+h.position[i]/s.hands.length) as [number,number,number],[0,0,0] as [number,number,number]);
    const a=mean(state),b=mean(prior);const d=a.map((v,i)=>v-b[i]) as [number,number,number];
    const distance=(s:HandIntelligenceState)=>Math.hypot(...s.hands[0].position.map((v,i)=>v-s.hands[1].position[i]));
    const ratio=state.hands.length===2?distance(state)/Math.max(.05,distance(prior)):1;
    if(Math.hypot(...d)<.08&&ratio>.85&&ratio<1.15)live.navigate?.(d,ratio);
   }
  }
  lastNavigation.current=state;
  if(state.timestamp-lastHUD.current>100){lastHUD.current=state.timestamp;const area=activeViewport(),hand=state.hands.find(h=>!h.missing);
   cursorPoint.current=area&&hand?{x:area.left+(hand.pose==='index'||hand.pointing>.5?hand.fingertip:hand.position)[0]*area.width,y:area.top+(hand.pose==='index'||hand.pointing>.5?hand.fingertip:hand.position)[1]*area.height}:null;
   setCursor(area&&hand?{x:area.left+(hand.pose==='index'||hand.pointing>.5?hand.fingertip:hand.position)[0]*area.width,y:area.top+(hand.pose==='index'||hand.pointing>.5?hand.fingertip:hand.position)[1]*area.height,grab:state.targetLocked,target:state.targetObjectId,confidence:state.interactionConfidence}:null);
  }
 };
 const activeViewport=()=>session&&adapter.current?.kind==='3d'?{left:0,top:0,width:innerWidth,height:innerHeight}:adapter.current?.element()?.getBoundingClientRect();
 const targets=()=>{const model=adapter.current?.targets()??[],point=cursorPoint.current,viewport=activeViewport();const target=point&&viewport?ui.current.target(point.x,point.y,viewport):null;return target?[target,...model]:model;};
 const mapPoint=(point:{x:number;y:number;z:number})=>{const viewport=activeViewport();if(!viewport)return point;return {x:(point.x*innerWidth-viewport.left)/viewport.width,y:(point.y*innerHeight-viewport.top)/viewport.height,z:point.z};};
 const getTransform=(state:HandIntelligenceState)=>{const value=state.targetObjectId?adapter.current?.transform(state.targetObjectId):undefined;previous.current=value??identityTransform();return previous.current;};
 const nativeHands=(raw:RawHand[],time:number,motion?:{delta:[number,number,number];ratio:number})=>{if(!handsRef.current)return;runtime.current.landmarks=raw.map(h=>h.landmarks??[]);runtime.current.landmarksAt=performance.now();const state=engines.current.intelligence.update({timestamp:time,hands:raw,targets:targets(),camera:true,tool:'auto'});const value=getTransform(state);const result=engines.current.spatial.solve(state,value,true,engines.current.intelligence.profile);
  if(motion&&state.targetLocked&&!state.primaryTarget?.affordance.locked&&state.interactionConfidence>.4){const allowed=state.primaryTarget?.affordance.allowedInteractions;const transform=result.transform??{...value,position:[...value.position] as [number,number,number],rotation:[...value.rotation] as [number,number,number]};if(allowed?.translate)transform.position=transform.position.map((v,i)=>value.position[i]+motion.delta[i]*state.weights.translate) as [number,number,number];if(allowed?.scale&&state.activeHandIds.length===2)transform.scale=Math.max(.18,Math.min(5,value.scale*Math.pow(motion.ratio,state.weights.scale)));result.transform=transform;}
  frame(state,result);return state;};
 useEffect(()=>{const root=overlay.current;const beforeSelect=(event:Event)=>{if(event.target instanceof Element&&event.target.closest('button,input,label,select,summary'))event.preventDefault();};root?.addEventListener('beforexrselect',beforeSelect);return()=>root?.removeEventListener('beforexrselect',beforeSelect);},[]);
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;startGeneration.current++;release();void active.current?.end().catch(()=>undefined);};},[]);
 useEffect(()=>{
  if(!hands||session){setStream(null);return;}
  const abort=new AbortController();let camera:MediaStream|null=null;
  if(!navigator.mediaDevices?.getUserMedia){setMessage('Hand tracking unavailable: camera access is not supported here.');setHands(false);return;}
  setMessage('Requesting camera…');
  void requestCameraStream(navigator.mediaDevices,{video:{facingMode:'user',width:{ideal:640},height:{ideal:480}},audio:false},abort.signal).then(next=>{camera=next;if(abort.signal.aborted){stopCameraTracks(next);return;}setStream(next);setMessage('Camera ready. Point to select; close your fist to grab. Open your palm to release.');}).catch(error=>{if(!abort.signal.aborted){setMessage(cameraErrorMessage(error));setHands(false);}});
  return()=>{abort.abort();stopCameraTracks(camera);release();setCursor(null);};
 },[hands,session]);
 useEffect(()=>{if(video.current){video.current.srcObject=stream;if(stream)void video.current.play().catch(()=>undefined);}},[stream]);
 async function toggleAR(){
  if(active.current){await active.current.end();return;}
  if(starting.current)return;
  if(!navigator.xr||!isSecureContext){setMessage('AR is not available on this device/browser. Hand control and normal workspace tools remain available.');return;}
  starting.current=true;const generation=++startGeneration.current;setMessage('Starting AR…');
  try{if(!await navigator.xr.isSessionSupported('immersive-ar'))throw new DOMException('AR is not available on this device/browser.','NotSupportedError');
   if(generation!==startGeneration.current)return;
   const next=await navigator.xr.requestSession('immersive-ar',{requiredFeatures:['hit-test'],optionalFeatures:['dom-overlay','hand-tracking','anchors'],domOverlay:{root:overlay.current!}});
   if(!mounted.current||generation!==startGeneration.current){await next.end();return;}
   active.current=next;next.addEventListener('end',()=>{active.current=null;if(mounted.current){release();setSession(null);setMessage('AR ended. Your workspace edits are retained.');}},{once:true});setSession(next);setMessage('Scan a surface. Tap the reticle to place your current scene.');
  }catch(error){setMessage(error instanceof Error?error.message:'AR could not start.');}finally{starting.current=false;}
 }
 engines.current.intelligence.setProfile(profile);
 const scene:ARSceneState={showGrid:true,showAxes:true,showLabels:true,placementReady:false,objectScale:1,objectRotation:[0,0,0],objectPosition:[0,0,0],objectColor:'#06b6d4',objectOpacity:1,objectContrast:1,phoneOrbitEnabled:false};
 const controller:ImmersiveController={adapter,hover,projected,register,session,hands,scale,placement,placementMode,pose,profile,setProfile,cursorVisible,setCursorVisible,frame,nativeHands,status:setMessage,toggleAR,toggleHands:()=>{release();setHands(v=>!v);setMinimized(false);if(calibration<4)setGuide(true);}};
 return <ImmersiveContext.Provider value={controller}><div ref={overlay} className="immersive-workspace-root" data-immersive-mode={session?(hands?'AR_HAND_GESTURE':'AR'):hands?'HAND_GESTURE':'NORMAL'}>
  {children}
  <Immersive2DBoard/>
  {(hands||session||message)&&<aside className="immersive-hud" ref={stage} aria-label="Immersive interaction status"><header><strong>{session&&hands?'AR + Hand':session?'AR':hands?'Hand control':'Immersive modes'}</strong><button title="Gesture guide" aria-label="Gesture guide" onClick={()=>setGuide(v=>!v)}><HelpCircle size={16}/></button><button aria-label="Minimize immersive status" onClick={()=>setMinimized(v=>!v)}><Minus size={16}/></button><button aria-label="Exit immersive modes" onClick={()=>{startGeneration.current++;setHands(false);void active.current?.end();release();setMessage('');}}><X size={16}/></button></header>
  {session&&<ImmersiveToolbar/>}
  <p role="status">{message}</p>
  <div style={{display:minimized?"none":undefined}}>
   {hands&&!session&&<><video ref={video} autoPlay playsInline muted style={{transform:mirrored?'scaleX(-1)':undefined}}/>{stream&&<ARCameraHands video={video} stage={stage} stream={stream} scene={scene} objectId="workspace" runtime={runtime} mirrored={mirrored} onChange={()=>undefined} interaction={{engines:engines.current,profile,mapPoint,targets,transform:getTransform,frame}}/>}<label>Mirror camera<input type="checkbox" checked={mirrored} onChange={e=>setMirrored(e.target.checked)}/></label></>}
   {hands&&<p>{cursor?.target?`Target: ${cursor.target} · ${cursor.grab?'Grab':'Hover'}`:'Point and hold to select, or pause over a model and close your fist.'} {cursor?`${Math.round(cursor.confidence*100)}% confidence`:''} {runtime.current.state?.hands.filter(h=>!h.missing).map(h=>h.pose).join(' · ')}</p>}
   {session&&<><ImmersiveWorkspaceControls root={overlay}/><label>Placement<select value={placementMode} onChange={e=>{setPlacementMode(e.target.value as typeof placementMode);setPlacement(v=>v+1);}}><option value="horizontal">Table / floor</option><option value="vertical">Wall</option><option value="space">Free space</option></select></label><label>Metres per unit<input aria-label="Physical scale in metres per unit" type="number" min="0.001" max="10" step="0.01" value={scale} onChange={e=>setScale(Math.max(.001,Math.min(10,Number(e.target.value)||.001)))}/></label><div>{[.01,.1,1].map(value=><button key={value} onClick={()=>setScale(value)}>{value===.01?'1 cm':value===.1?'10 cm':'1 m'}</button>)}</div><button disabled={positionLocked} onClick={()=>{setPose({position:[0,0,0],rotation:[0,0,0]});setPlacement(v=>v+1);}}>Re-anchor / Reset position</button><button onClick={()=>setPositionLocked(v=>!v)}>{positionLocked?"Unlock position":"Lock position"}</button><details><summary>Spatial position and rotation</summary>{(["X","Y","Z"] as const).map((axis,i)=><label key={axis}>{axis} metres<input type="number" step="0.05" min="-5" max="5" disabled={positionLocked} value={pose.position[i]} onChange={e=>setPose(p=>({...p,position:p.position.map((n,j)=>i===j?Math.max(-5,Math.min(5,Number(e.target.value))):n) as [number,number,number]}))}/></label>)}{(["Pitch","Yaw","Roll"] as const).map((axis,i)=><label key={axis}>{axis} degrees<input type="number" step="5" value={Math.round(pose.rotation[i]*180/Math.PI)} onChange={e=>setPose(p=>({...p,rotation:p.rotation.map((n,j)=>i===j?Number(e.target.value)*Math.PI/180:n) as [number,number,number]}))}/></label>)}<button onClick={()=>setPose({position:[0,0,0],rotation:[0,0,0]})}>Reset view and pose</button></details><button onClick={()=>setScale(.1)}>Reset physical scale</button></>}
   {guide&&<div><GestureActionTable/><details open={calibration<4}><summary>Calibration</summary><p>{["Show your whole hand in good light.","Open your palm.","Close your fist.","Move your hand left or right.","Calibration complete. Your readiness is saved on this device."][calibration]}</p><button onClick={()=>{calibrationStep.current=0;setCalibration(0);}}>Calibrate again</button></details></div>}
  </div>
  </aside>}
  {hands&&<ARHandLandmarkOverlay runtime={runtime} viewport={activeViewport}/>}
  {hands&&cursorVisible&&cursor&&<div className={`immersive-cursor ${cursor.grab?'is-grabbing':''}`} style={{left:cursor.x,top:cursor.y}}/>}
 </div></ImmersiveContext.Provider>;
}
export function ImmersiveToolbar(){const controller=useImmersive();if(!controller)return null;
 return <div className="immersive-buttons"><button title="Place this mathematical scene in augmented reality" aria-label="AR" aria-pressed={!!controller.session} onClick={()=>void controller.toggleAR()}><Scan/><span>AR</span></button><button title="Control this workspace using your hands" aria-label="Hand Gestures" aria-pressed={controller.hands} onClick={controller.toggleHands}><Hand/><span>Hand Gestures</span></button></div>;
}

export function ImmersiveSettings(){const controller=useImmersive();if(!controller)return null;return <details><summary>Immersive interaction</summary><label>Hand response<select aria-label="Workspace hand response" value={controller.profile} onChange={e=>controller.setProfile(e.target.value as typeof controller.profile)}><option value="precision">Precision</option><option value="balanced">Balanced</option><option value="play">Play</option></select></label><label>Hand cursor<input type="checkbox" checked={controller.cursorVisible} onChange={e=>controller.setCursorVisible(e.target.checked)}/></label><p>AR placement, physical scale and anchoring controls appear when AR is active.</p></details>;}
