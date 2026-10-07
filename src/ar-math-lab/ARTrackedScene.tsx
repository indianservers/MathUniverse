import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { trackedARFailure } from "./arWorldTracking";
import { HandIntelligenceEngine } from "./hand-intelligence/HandIntelligenceEngine";
import { SpatialHandEngine } from "./hand-intelligence/SpatialHandEngine";
import type { IntelligenceProfile, ObjectAffordance, RawHand, SemanticEdit } from "./hand-intelligence/types";
import type { ARGeneratedGeometrySolid, ARGeneratedGraphObject } from "./types";

import ARHandGuide from './ARHandGuide';
import { ARSpatialIntelligence } from './arSpatialIntelligence';

export type ARTrackingHandle = { start: () => Promise<void> };
const ARWorldTracking = forwardRef<ARTrackingHandle,{children:ReactNode;hasObject:boolean;solid?:ARGeneratedGeometrySolid;graph?:ARGeneratedGraphObject;onSemanticEdit?:(edit:SemanticEdit)=>void;onSessionChange?:(active:boolean)=>void}>(function ARWorldTracking({children,hasObject,onSessionChange,solid,graph,onSemanticEdit},ref){
 const [supported,setSupported]=useState(false),[session,setSession]=useState<XRSession|null>(null),[starting,setStarting]=useState(false),[message,setMessage]=useState("Checking tracked AR support…"),[scale,setScale]=useState(.3),[placement,setPlacement]=useState(0);
 const overlay=useRef<HTMLDivElement>(null),active=useRef<XRSession|null>(null),mounted=useRef(true);
 const [handsEnabled,setHandsEnabled]=useState(true),[handProfile,setHandProfile]=useState<IntelligenceProfile>("balanced");
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
  {session&&<Canvas className="absolute inset-0" camera={{position:[0,1,3]}} gl={{alpha:true,antialias:true}} onCreated={({gl})=>gl.setClearColor(0x000000,0)}><ambientLight intensity={1}/><directionalLight position={[2,5,3]} intensity={1.4}/><TrackedPlacement profile={handProfile} solid={solid} graph={graph} onSemanticEdit={onSemanticEdit} session={session} scale={scale} placement={placement} handsEnabled={handsEnabled} onMessage={setMessage} onError={fail}><group position={offset} rotation={orientation}>{children}</group></TrackedPlacement></Canvas>}
  <div className={session?"pointer-events-auto absolute inset-x-3 bottom-4 max-h-[55vh] overflow-y-auto rounded-xl bg-slate-950/85 p-3 text-white":"space-y-2"}>
   <p className="text-sm font-bold">AR spatial intelligence · 6DoF</p>
   <p className="text-xs">Scan a surface, tap the ring to place, then walk around the object. Camera overlay is a separate mode.</p>
   <p role="status" className="text-xs">{message}</p>
   <ARHandGuide native/>
   <label className="flex items-center gap-2 text-xs">Hand response<select aria-label="Tracked AR hand intelligence profile" className="rounded border bg-slate-900 p-2 text-white" value={handProfile} onChange={event=>setHandProfile(event.target.value as IntelligenceProfile)}><option value="precision">Precision</option><option value="balanced">Balanced</option><option value="play">Play</option></select></label>
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
export function TrackedPlacement({profile,solid,graph,onSemanticEdit,session,children,scale,placement,handsEnabled,onMessage,onError,onHands,mode="horizontal"}:{onHands?:(hands:RawHand[],time:number)=>void;mode?:"horizontal"|"vertical"|"space";profile:IntelligenceProfile;solid?:ARGeneratedGeometrySolid;graph?:ARGeneratedGraphObject;onSemanticEdit?:(edit:SemanticEdit)=>void;session:XRSession;children:ReactNode;scale:number;placement:number;handsEnabled:boolean;onMessage:(message:string)=>void;onError:(error:unknown)=>void}){
 const {gl}=useThree(),reticle=useRef<THREE.Group>(null),object=useRef<THREE.Group>(null),hitSource=useRef<XRHitTestSource|null>(null),placed=useRef(false),anchor=useRef<XRAnchor|null>(null),candidateHit=useRef<XRHitTestResult|null>(null);
 const activePlacement=useRef(true),anchorGeneration=useRef(0);
 const intelligence=useRef(new ARSpatialIntelligence()),lastMessage=useRef('');
 const handPoints=useRef<THREE.InstancedMesh>(null),handPointMatrix=useRef(new THREE.Matrix4()),handPointColors=useRef([new THREE.Color('#fff476'),new THREE.Color('#fa9cff'),new THREE.Color('#38f5d1')]);
 const report=(text:string)=>{if(lastMessage.current!==text){lastMessage.current=text;onMessage(text);}};
 const handHistory=useRef<{past:THREE.Matrix4[];future:THREE.Matrix4[];start?:THREE.Matrix4}>({past:[],future:[]});
 const manipulation=useRef<THREE.Group>(null),gestures=useRef(new HandIntelligenceEngine()),solver=useRef(new SpatialHandEngine()),lastCommit=useRef(0);
 useEffect(()=>{gestures.current.setProfile(profile);},[profile]);
 useEffect(()=>{gestures.current.reset();solver.current.reset();if(handsEnabled)onMessage('Place the object first. Close your fist nearby to move; two fists resize/rotate. Open your palm to release. If native hands are unavailable, use hand gestures in camera overlay.');},[handsEnabled,onMessage]);
 useEffect(()=>{let alive=true;activePlacement.current=true;gl.xr.enabled=true;gl.xr.setReferenceSpaceType("local");
  void (async()=>{try{const requestHitTest=session.requestHitTestSource;if(!requestHitTest)throw new DOMException("Surface hit testing unavailable", "NotSupportedError");await gl.xr.setSession(session);if(!alive)return;const viewer=await session.requestReferenceSpace("viewer");const source=await requestHitTest.call(session,{space:viewer});if(!source)throw new DOMException("Surface hit testing unavailable", "NotSupportedError");if(alive)hitSource.current=source??null;else source?.cancel();}catch(error){if(alive)onError(error);}})();
  const select=()=>{if(reticle.current?.visible&&object.current){object.current.matrix.copy(reticle.current.matrix);object.current.matrixWorldNeedsUpdate=true;object.current.visible=true;placed.current=true;reticle.current.visible=false;
    const hit=candidateHit.current,generation=++anchorGeneration.current;anchor.current?.delete();anchor.current=null;
    if(hit?.createAnchor)void hit.createAnchor().then(next=>{if(placed.current&&activePlacement.current&&generation===anchorGeneration.current)anchor.current=next;else next.delete();}).catch(()=>onMessage("Scene placed using device tracking. Spatial anchors are unavailable here."));onMessage("Object placed in tracked world space. Walk around it or choose Reposition.");}};
  session.addEventListener("select",select);
  return ()=>{alive=false;activePlacement.current=false;anchorGeneration.current++;anchor.current?.delete();anchor.current=null;hitSource.current?.cancel();hitSource.current=null;session.removeEventListener("select",select);};
 },[gl,session,onMessage,onError]);
 useEffect(()=>{anchorGeneration.current++;anchor.current?.delete();anchor.current=null;candidateHit.current=null;placed.current=false;intelligence.current.reset();lastMessage.current='';gestures.current.reset();solver.current.reset();if(object.current)object.current.visible=false;if(manipulation.current){manipulation.current.position.set(0,0,0);manipulation.current.rotation.set(0,0,0);manipulation.current.scale.setScalar(1);}},[placement,mode]);
 useFrame((state,__,frame)=>{if(handPoints.current)handPoints.current.count=0;if(!frame||!hitSource.current||!reticle.current)return;reticle.current.visible=false;
  const reference=gl.xr.getReferenceSpace();if(!reference)return;
  const viewer=frame.getViewerPose(reference);
  const tracked=session.visibilityState==='visible'&&!!viewer&&!viewer.emulatedPosition;
  if(!tracked){intelligence.current.update(state.clock.elapsedTime*1000,false,[]);gestures.current.reset();solver.current.reset();if(object.current)object.current.visible=false;report('Position tracking lost. Hold still, then slowly scan a well-lit, textured area.');return;}
  let recognizedHands=0;
  if(handsEnabled&&frame.getJointPose&&handPoints.current){
   const mesh=handPoints.current;
   for(const source of Array.from(session.inputSources)){
    if(!source.hand)continue;let detected=false;
    const joints:XRHandJoint[]=['wrist','thumb-metacarpal','thumb-phalanx-proximal','thumb-phalanx-distal','thumb-tip',...(['index','middle','ring','pinky'] as const).flatMap(f=>[`${f}-finger-phalanx-proximal`,`${f}-finger-phalanx-intermediate`,`${f}-finger-phalanx-distal`,`${f}-finger-tip`] as XRHandJoint[])];
    for(const name of joints){const joint=source.hand.get(name);const pose=joint?frame.getJointPose(joint,reference):null;if(!pose||mesh.count>=42)continue;
     const p=pose.transform.position;handPointMatrix.current.makeTranslation(p.x,p.y,p.z);mesh.setMatrixAt(mesh.count,handPointMatrix.current);mesh.setColorAt(mesh.count,handPointColors.current[name.endsWith('tip')?0:source.handedness==='left'?1:2]);mesh.count++;detected=true;
    }
    if(detected)recognizedHands++;
   }
   mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
  }
  if(placed.current){
   if(anchor.current&&object.current){const pose=frame.getPose(anchor.current.anchorSpace,reference);if(pose){object.current.matrix.fromArray(pose.transform.matrix);object.current.matrixWorldNeedsUpdate=true;}}
   if(object.current)object.current.visible=true;report(`6DoF tracking active. ${handsEnabled?`${recognizedHands} hands recognized; colored points show detected joints.`:'Hand gestures paused.'} Object placed; walk around it or use the pose controls.`);
   if(!handsEnabled||!manipulation.current||!object.current||session.visibilityState!=='visible'){gestures.current.reset();solver.current.reset();return;}
   const hands:RawHand[]=[];
   const content=manipulation.current.children[0]?.children[0]??manipulation.current;
   const box=new THREE.Box3().setFromObject(content),centerWorld=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());
   const center=object.current.worldToLocal(centerWorld.clone());const radius=Math.max(.025,Math.max(size.x,size.y,size.z)/2);
   for(const source of Array.from(session.inputSources)){
    if(!source.hand||!frame.getJointPose)continue;
    const thumb=source.hand.get('thumb-tip'),index=source.hand.get('index-finger-tip'),wrist=source.hand.get('wrist');
    if(!thumb||!index)continue;
    const t=frame.getJointPose(thumb,reference),i=frame.getJointPose(index,reference),w=wrist?frame.getJointPose(wrist,reference):undefined;
    if(!t||!i)continue;
    const a=t.transform.position,b=i.transform.position;
    const world=new THREE.Vector3((a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2),point=object.current.worldToLocal(world);
    const quaternion=w?.transform.orientation;
    const orientation=quaternion?new THREE.Euler().setFromQuaternion(new THREE.Quaternion(quaternion.x,quaternion.y,quaternion.z,quaternion.w)).y:0;
    const joints:XRHandJoint[]=['wrist','thumb-metacarpal','thumb-phalanx-proximal','thumb-phalanx-distal','thumb-tip',...(['index','middle','ring','pinky'] as const).flatMap(f=>[`${f}-finger-phalanx-proximal`,`${f}-finger-phalanx-intermediate`,`${f}-finger-phalanx-distal`,`${f}-finger-tip`] as XRHandJoint[])];
    const landmarks=joints.map(name=>{const joint=source.hand!.get(name);const pose=joint?frame.getJointPose!(joint,reference):null;if(!pose)return null;const p=object.current!.worldToLocal(new THREE.Vector3(pose.transform.position.x,pose.transform.position.y,pose.transform.position.z));return{x:p.x,y:p.y,z:p.z};});
    hands.push({handedness:source.handedness,landmarks:landmarks.every(p=>p!==null)?landmarks as {x:number;y:number;z:number}[]:undefined,point:{x:point.x,y:point.y,z:point.z},pinchRatio:Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)/.08,confidence:1,orientation});
   }
   const group=manipulation.current,time=state.clock.elapsedTime*1000;
   if(onHands){onHands(hands,time);return;}
   const target:ObjectAffordance={objectId:solid?.id??graph?.id??'tracked-object',semanticType:solid?.solidType??graph?.semanticType??'graph',position:center.toArray() as [number,number,number],radius,depth:centerWorld.distanceTo(state.camera.position),visible:true,locked:solid?.locked??graph?.locked,selected:true,precisionRequired:radius<.08?.8:.2,
     allowedInteractions:{translate:true,rotate:true,scale:true,editRadius:!!solid?.dimensions.radius,sampleSurface:!!graph,editVector:graph?.semanticType==='vector',editVertex:graph?.semanticType==='polygon',stretchX:!!solid,stretchY:!!solid,stretchZ:!!solid},preferredGrabZones:[{id:'body',kind:'body',position:center.toArray() as [number,number,number],radius,dimension:solid?.dimensions.radius?'radius':undefined,value:solid?.dimensions.radius?.value}]};
   if(solid){const keys=[solid.dimensions.length?'length':solid.dimensions.side?'side':undefined,solid.dimensions.height?'height':solid.dimensions.side?'side':undefined,solid.dimensions.width?'width':solid.dimensions.side?'side':undefined];
     for(let axis=0;axis<3;axis++)for(const sign of [-1,1]){const face=centerWorld.clone();face.setComponent(axis,face.getComponent(axis)+size.getComponent(axis)*.5*sign);object.current.worldToLocal(face);const key=solid.dimensions.radius?'radius':keys[axis];target.preferredGrabZones.push({id:`face-${axis}-${sign}`,kind:solid.dimensions.radius?'radius':'face',position:face.toArray() as [number,number,number],radius:radius*.35,axis:axis as 0|1|2,dimension:key,value:key?solid.dimensions[key]?.value:undefined});}
   }
   if(graph){const geometry=graph.geometry,count=geometry.kind==='curve'?geometry.points.length:geometry.vertices.length/3;const editable=graph.semanticType==='vector'||graph.semanticType==='polygon';
     for(let index=0;index<count;index+=Math.max(1,Math.floor(count/40))){const p=geometry.kind==='curve'?geometry.points[index]:geometry.vertices.slice(index*3,index*3+3);if(!p?.every(Number.isFinite))continue;const world=new THREE.Vector3(...p as [number,number,number]).applyMatrix4(content.matrixWorld);object.current.worldToLocal(world);target.preferredGrabZones.push({id:`sample-${index}`,kind:editable?(graph.semanticType==='vector'&&index===count-1?'vector':'vertex'):'surface',position:world.toArray() as [number,number,number],radius:radius*.12,index,sample:p as [number,number,number]});}
   }
   const wasHeld=gestures.current.state.targetLocked;group.updateMatrix();const previousMatrix=group.matrix.clone();
   const intent=gestures.current.update({timestamp:time,hands,targets:[target],selectedObjectId:target.objectId,camera:false,tool:'auto'});
   const history=handHistory.current;if(intent.targetLocked&&!wasHeld)history.start=previousMatrix;if(!intent.targetLocked&&history.start){history.past.push(history.start);history.past=history.past.slice(-30);history.future=[];history.start=undefined;}
   if(intent.command){const command=intent.command;let next:THREE.Matrix4|undefined;if(command==='undo'&&history.past.length){history.future.push(previousMatrix);next=history.past.pop();}if(command==='redo'&&history.future.length){history.past.push(previousMatrix);next=history.future.pop();}if(command==='fit'){history.past.push(previousMatrix);history.future=[];next=new THREE.Matrix4();}if(next){next.decompose(group.position,group.quaternion,group.scale);solver.current.reset();report(`${command}: hand transform applied.`);return;}
    if(command==='help')window.dispatchEvent(new Event('math-hand-guide-toggle'));
    if(command==='labels'||command==='grid'){const button=[...document.querySelectorAll('button')].find(e=>new RegExp(`^(?:show |hide |toggle )?${command}$`,'i').test((e.getAttribute('aria-label')||e.title||e.textContent||'').trim()));if(button)button.click();else report(`${command} is not available in these tracked AR controls.`);}
   }
   const result=solver.current.solve(intent,{position:group.position.toArray() as [number,number,number],rotation:[group.rotation.x,group.rotation.y,group.rotation.z],scale:group.scale.x},false,profile);
   if(result.transform){group.position.fromArray(result.transform.position);group.rotation.set(...result.transform.rotation);group.scale.setScalar(result.transform.scale);}
   if(result.semanticEdit&&time-lastCommit.current>120){lastCommit.current=time;onSemanticEdit?.(result.semanticEdit);}

   return;
  }
  if(mode === "space"){const pose=frame.getViewerPose(reference);if(pose){reticle.current.matrix.fromArray(pose.transform.matrix);reticle.current.matrix.multiply(new THREE.Matrix4().makeTranslation(0,0,-1.2));reticle.current.visible=true;report("Free-space placement. Tap to place in front of you.");}return;}
  const liveHits=frame.getHitTestResults(hitSource.current) as XRHitTestResult[];candidateHit.current=liveHits.find(hit=>{const m=hit.getPose(reference)?.transform.matrix;return !!m&&(mode === "vertical"?Math.abs(m[5])<.4:Math.abs(m[5])>.7);})??null;
  const hits=liveHits.map(hit=>hit.getPose(reference)?.transform.matrix).filter((matrix):matrix is Float32Array=>!!matrix && (mode === "vertical" ? Math.abs(matrix[5]) < .4 : Math.abs(matrix[5]) > .7));
  const assessment=intelligence.current.update(state.clock.elapsedTime*1000,true,hits);
  if(assessment.matrix){reticle.current.matrix.fromArray(assessment.matrix);reticle.current.matrixWorldNeedsUpdate=true;reticle.current.visible=assessment.ready;}
  report(`${assessment.message}${handsEnabled?` ${recognizedHands} hands recognized.`:''}`);
 });
 return <><instancedMesh visible={!onHands} ref={handPoints} args={[undefined,undefined,42]} frustumCulled={false} renderOrder={1000}><sphereGeometry args={[.006,8,6]}/><meshBasicMaterial depthTest={false} depthWrite={false}/></instancedMesh><group ref={reticle} visible={false} matrixAutoUpdate={false}><mesh rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.08,.1,32]}/><meshBasicMaterial color="#22d3ee" side={THREE.DoubleSide}/></mesh></group><group ref={object} matrixAutoUpdate={false} visible={false}><group ref={manipulation}><group scale={scale}>{children}</group></group></group></>;
}
