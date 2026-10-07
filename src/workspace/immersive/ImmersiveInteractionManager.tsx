import GestureHUD from '../../ar-math-lab/hand-intelligence/GestureHUD';
import { GestureController, type GestureSelectable } from '../../ar-math-lab/hand-intelligence/GestureController';
import { idleState } from '../../ar-math-lab/hand-intelligence/HandIntelligenceEngine';
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
 gestureObjects: MutableRefObject<Map<string,GestureSelectable>>;
 adapter: MutableRefObject<ImmersiveAdapter | null>;hover:MutableRefObject<string|null>; projected: MutableRefObject<Map<string, import("../../ar-math-lab/hand-intelligence/types").ObjectAffordance>>;
 session: XRSession | null; hands: boolean; scale:number; placement:number; placementMode:'horizontal'|'vertical'|'space';pose:{position:[number,number,number];rotation:[number,number,number]};
 register: (adapter:ImmersiveAdapter) => () => void;
 syncRegistry: () => void;
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
 const register=controller?.register,syncRegistry=controller?.syncRegistry,enabled=!!adapter;
 useEffect(()=>{if(!enabled || !register)return;return register(new Proxy({} as ImmersiveAdapter,{get:(_,key)=>latest.current?.[key as keyof ImmersiveAdapter]}));},[register,enabled]);
 useEffect(()=>{syncRegistry?.();},[adapter,syncRegistry]);
 return controller;
}
export default function ImmersiveInteractionManager({children}:{children:ReactNode}){
 const hover=useRef<string|null>(null);
 const gestureController=useRef(new GestureController()),gestureObjects=useRef(new Map<string,GestureSelectable>());
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
 const models=useRef(new ImmersiveModelController(()=>adapter.current,active=>window.dispatchEvent(new Event(active?"immersive-transaction-start":"immersive-transaction-end"))));
 const ui=useRef(new ImmersiveUIControls()),cursorPoint=useRef<{x:number;y:number}|null>(null),uiHolding=useRef(false);
 const previous=useRef(identityTransform());const handsRef=useRef(hands);handsRef.current=hands;
 const register=useRef((value:ImmersiveAdapter)=>{adapter.current=value;return()=>{if(adapter.current===value)adapter.current=null;}}).current;
 const syncRegistry=useRef(()=>{const objects=adapter.current?.gestureObjects?.();if(objects)gestureController.current.registry.sync([...objects,...gestureObjects.current.values()]);}).current;
 const release=()=>{if(uiHolding.current){uiHolding.current=false;window.dispatchEvent(new Event("immersive-transaction-end"));}ui.current.reset();hover.current=null;adapter.current?.element()?.querySelectorAll("[data-immersive-hover]").forEach(e=>e.removeAttribute("data-immersive-hover"));gestureController.current.stop();models.current.release();engines.current.intelligence.reset();engines.current.spatial.reset();lastNavigation.current=null;};
 const frame=(state:HandIntelligenceState,_result:ManipulationResult)=>{
  const live=adapter.current;if(!live)return;
  const objects=live.gestureObjects?.()??live.targets().filter(t=>t.visible&&!t.objectId.startsWith('workspace-ui:')).map(target=>({
   id:target.objectId,name:target.name??target.semanticType.replace(/[-_]/g,' '),kind:live.kind,
   capabilities:{move:!target.locked&&!!target.allowedInteractions.translate,scale:!target.locked&&!!target.allowedInteractions.scale,rotate:!target.locked&&!!target.allowedInteractions.rotate,tilt:live.kind==='3d'&&!target.locked&&!!target.allowedInteractions.rotate,reset:!target.locked},
   read:()=>live.transform(target.objectId),
   write:(transform:ReturnType<typeof identityTransform>)=>live.apply({...idleState(state.timestamp),targetObjectId:target.objectId,primaryTarget:{objectId:target.objectId,affordance:target,zone:target.preferredGrabZones[0],handId:'gesture',score:1,contact:1}},{transform},live.transform(target.objectId)),
   select:(selected:boolean)=>{if(selected)live.select(target.objectId);else live.clearSelection?.();},
  }));
  gestureController.current.registry.sync([...objects,...gestureObjects.current.values()]);
  const feedback=gestureController.current.update(state.hands,state.timestamp);runtime.current.gesture=feedback;
  hover.current=gestureController.current.registry.selectedId;
  live.element()?.querySelectorAll('[data-immersive-hover]').forEach(e=>e.removeAttribute('data-immersive-hover'));
  if(hover.current)live.element()?.querySelector(`[data-point-id="${CSS.escape(hover.current)}"]`)?.setAttribute('data-immersive-hover','true');
  if(state.timestamp-lastHUD.current>120){lastHUD.current=state.timestamp;setCursor(null);}
 };
 const processHands=(raw:RawHand[],time:number)=>{
  const features=engines.current.intelligence.features.update(raw,time,true,profile);
  const state={...idleState(time),hands:features};runtime.current.state=state;
  frame(state,{transform:null});return state;
 };
 const activeViewport=()=>session&&adapter.current?.kind==='3d'?{left:0,top:0,width:innerWidth,height:innerHeight}:adapter.current?.element()?.getBoundingClientRect();
 const targets=()=>{const model=adapter.current?.targets()??[],point=cursorPoint.current,viewport=activeViewport();const target=point&&viewport?ui.current.target(point.x,point.y,viewport):null;return target?[target,...model]:model;};
 const mapPoint=(point:{x:number;y:number;z:number})=>{const viewport=activeViewport();if(!viewport)return point;return {x:(point.x*innerWidth-viewport.left)/viewport.width,y:(point.y*innerHeight-viewport.top)/viewport.height,z:point.z};};
 const getTransform=(state:HandIntelligenceState)=>{const value=state.targetObjectId?adapter.current?.transform(state.targetObjectId):undefined;previous.current=value??identityTransform();return previous.current;};
 const nativeHands=(raw:RawHand[],time:number)=>{if(!handsRef.current)return;runtime.current.landmarks=raw.map(h=>h.landmarks??[]);runtime.current.landmarksAt=performance.now();return processHands(raw,time);};
 useEffect(()=>{const root=overlay.current;const beforeSelect=(event:Event)=>{if(event.target instanceof Element&&event.target.closest('button,input,label,select,summary'))event.preventDefault();};root?.addEventListener('beforexrselect',beforeSelect);return()=>root?.removeEventListener('beforexrselect',beforeSelect);},[]);
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;startGeneration.current++;release();void active.current?.end().catch(()=>undefined);};},[]);
 useEffect(()=>{
  if(!hands||session){setStream(null);return;}
  const abort=new AbortController();let camera:MediaStream|null=null;
  if(!navigator.mediaDevices?.getUserMedia){setMessage('Hand tracking unavailable: camera access is not supported here.');setHands(false);return;}
  setMessage('Requesting camera…');
  void requestCameraStream(navigator.mediaDevices,{video:{facingMode:'user',width:{ideal:640},height:{ideal:480}},audio:false},abort.signal).then(next=>{camera=next;if(abort.signal.aborted){stopCameraTracks(next);return;}setStream(next);setMessage('Camera ready. Show index finger to select; a fist stops all changes.');}).catch(error=>{if(!abort.signal.aborted){setMessage(cameraErrorMessage(error));setHands(false);}});
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
 const controller:ImmersiveController={adapter,hover,gestureObjects,projected,register,syncRegistry,session,hands,scale,placement,placementMode,pose,profile,setProfile,cursorVisible,setCursorVisible,frame,nativeHands,status:setMessage,toggleAR,toggleHands:()=>{release();setHands(v=>!v);setMinimized(false);setGuide(false);}};
 return <ImmersiveContext.Provider value={controller}><div ref={overlay} className="immersive-workspace-root" data-immersive-mode={session?(hands?'AR_HAND_GESTURE':'AR'):hands?'HAND_GESTURE':'NORMAL'}>
  {children}
  <Immersive2DBoard/>
  {(hands||session||message)&&<aside className="immersive-hud" ref={stage} aria-label="Immersive interaction status"><header><strong>{session&&hands?'AR + Hand':session?'AR':hands?'Hand control':'Immersive modes'}</strong><button title="Gesture guide" aria-label="Gesture guide" onClick={()=>setGuide(v=>!v)}><HelpCircle size={16}/></button><button aria-label="Minimize immersive status" onClick={()=>setMinimized(v=>!v)}><Minus size={16}/></button><button aria-label="Exit immersive modes" onClick={()=>{startGeneration.current++;setHands(false);void active.current?.end();release();setMessage('');}}><X size={16}/></button></header>
  {session&&<ImmersiveToolbar/>}
  {hands&&<GestureHUD runtime={runtime}/>}<p role="status">{message}</p>
  <div style={{display:minimized?"none":undefined}}>
   {hands&&!session&&<><video ref={video} autoPlay playsInline muted style={{transform:mirrored?'scaleX(-1)':undefined}}/>{stream&&<ARCameraHands video={video} stage={stage} stream={stream} scene={scene} objectId="workspace" runtime={runtime} mirrored={mirrored} onChange={()=>undefined} interaction={{engines:engines.current,profile,mapPoint,targets,transform:getTransform,frame,processHands}}/>}<label>Mirror camera<input type="checkbox" checked={mirrored} onChange={e=>setMirrored(e.target.checked)}/></label></>}
   {session&&<><ImmersiveWorkspaceControls root={overlay}/><label>Placement<select value={placementMode} onChange={e=>{setPlacementMode(e.target.value as typeof placementMode);setPlacement(v=>v+1);}}><option value="horizontal">Table / floor</option><option value="vertical">Wall</option><option value="space">Free space</option></select></label><label>Metres per unit<input aria-label="Physical scale in metres per unit" type="number" min="0.001" max="10" step="0.01" value={scale} onChange={e=>setScale(Math.max(.001,Math.min(10,Number(e.target.value)||.001)))}/></label><div>{[.01,.1,1].map(value=><button key={value} onClick={()=>setScale(value)}>{value===.01?'1 cm':value===.1?'10 cm':'1 m'}</button>)}</div><button disabled={positionLocked} onClick={()=>{setPose({position:[0,0,0],rotation:[0,0,0]});setPlacement(v=>v+1);}}>Re-anchor / Reset position</button><button onClick={()=>setPositionLocked(v=>!v)}>{positionLocked?"Unlock position":"Lock position"}</button><details><summary>Spatial position and rotation</summary>{(["X","Y","Z"] as const).map((axis,i)=><label key={axis}>{axis} metres<input type="number" step="0.05" min="-5" max="5" disabled={positionLocked} value={pose.position[i]} onChange={e=>setPose(p=>({...p,position:p.position.map((n,j)=>i===j?Math.max(-5,Math.min(5,Number(e.target.value))):n) as [number,number,number]}))}/></label>)}{(["Pitch","Yaw","Roll"] as const).map((axis,i)=><label key={axis}>{axis} degrees<input type="number" step="5" value={Math.round(pose.rotation[i]*180/Math.PI)} onChange={e=>setPose(p=>({...p,rotation:p.rotation.map((n,j)=>i===j?Number(e.target.value)*Math.PI/180:n) as [number,number,number]}))}/></label>)}<button onClick={()=>setPose({position:[0,0,0],rotation:[0,0,0]})}>Reset view and pose</button></details><button onClick={()=>setScale(.1)}>Reset physical scale</button></>}
   {guide&&<div className="gesture-help-popover"><GestureActionTable/></div>}
  </div>
  </aside>}
  {hands&&cursorVisible&&<ARHandLandmarkOverlay runtime={runtime} viewport={activeViewport}/>}
  {hands&&cursorVisible&&cursor&&<div className={`immersive-cursor ${cursor.grab?'is-grabbing':''}`} style={{left:cursor.x,top:cursor.y}}/>}
 </div></ImmersiveContext.Provider>;
}
export function ImmersiveToolbar(){const controller=useImmersive();if(!controller)return null;
 return <div className="immersive-buttons"><button title="Place this mathematical scene in augmented reality" aria-label="AR" aria-pressed={!!controller.session} onClick={()=>void controller.toggleAR()}><Scan/><span>AR</span></button><button title="Control this workspace using your hands" aria-label="Hand Gestures" aria-pressed={controller.hands} onClick={controller.toggleHands}><Hand/><span>Hand Gestures</span></button></div>;
}

export function ImmersiveSettings(){const controller=useImmersive();if(!controller)return null;return <details><summary>Immersive interaction</summary><label>Hand response<select aria-label="Workspace hand response" value={controller.profile} onChange={e=>controller.setProfile(e.target.value as typeof controller.profile)}><option value="precision">Precision</option><option value="balanced">Balanced</option><option value="play">Play</option></select></label><label>Hand points<input type="checkbox" checked={controller.cursorVisible} onChange={e=>controller.setCursorVisible(e.target.checked)}/></label><p>AR placement, physical scale and anchoring controls appear when AR is active.</p></details>;}
