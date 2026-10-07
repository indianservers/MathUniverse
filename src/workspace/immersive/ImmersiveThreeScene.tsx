import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { TrackedPlacement } from '../../ar-math-lab/ARTrackedScene';
import { useImmersive } from './ImmersiveInteractionManager';
import { screenTarget } from './types';
import type { RawHand } from '../../ar-math-lab/hand-intelligence/types';
export function ImmersiveThreeScene({children}:{children:ReactNode}){
 const controller=useImmersive();
 const session=controller?.session,status=controller?.status;
 const fail=useCallback((error:unknown)=>{status?.(error instanceof Error?error.message:"AR renderer failed.");void session?.end();},[session,status]);
 if(!controller)return <>{children}</>;
 return <><ImmersiveThreeBridge/>{controller.session?<TrackedPlacement profile="balanced" session={controller.session} scale={controller.scale} placement={controller.placement} mode={controller.placementMode} handsEnabled={controller.hands} onMessage={controller.status} onError={fail} onHands={()=>undefined}><group position={controller.pose.position} rotation={controller.pose.rotation}><ImmersiveNativeBridge/>{children}</group></TrackedPlacement>:children}</>;
}
function ImmersiveNativeBridge(){
 const controller=useImmersive(),{gl}=useThree();
 const gestures=useRef<{time:number;positions:THREE.Vector3[]}>({time:0,positions:[]});const localRoot=useRef<THREE.Group>(null);
 useFrame((_,__,frame)=>{
  if(!controller?.hands||!controller.session||!frame?.getJointPose||performance.now()-gestures.current.time<32)return;
  gestures.current.time=performance.now();const reference=gl.xr.getReferenceSpace();if(!reference)return;
  const raw:RawHand[]=[],positions:THREE.Vector3[]=[];
  for(const source of Array.from(controller.session.inputSources)){
   if(!source.hand)continue;
   const joints:XRHandJoint[]=['wrist','thumb-metacarpal','thumb-phalanx-proximal','thumb-phalanx-distal','thumb-tip',...(['index','middle','ring','pinky'] as const).flatMap(f=>[`${f}-finger-phalanx-proximal`,`${f}-finger-phalanx-intermediate`,`${f}-finger-phalanx-distal`,`${f}-finger-tip`] as XRHandJoint[])];
   const points=joints.map(name=>{const joint=source.hand!.get(name);const pose=joint?frame.getJointPose!(joint,reference):null;if(!pose)return null;const p=pose.transform.position;const v=new THREE.Vector3(p.x,p.y,p.z).project(gl.xr.getCamera());return {x:(v.x+1)/2,y:(1-v.y)/2,z:0};});
   const joint=source.hand.get("index-finger-tip"),pose=joint?frame.getJointPose(joint,reference):null;if(pose&&localRoot.current){const p=pose.transform.position;positions.push(localRoot.current.worldToLocal(new THREE.Vector3(p.x,p.y,p.z)));}
   if(points.every(p=>p!==null))raw.push({landmarks:points as NonNullable<RawHand['landmarks']>,handedness:source.handedness,confidence:1});
  }
  const prior=gestures.current.positions;let motion: {delta:[number,number,number];ratio:number}|undefined;
  if(positions.length&&positions.length===prior.length){const center=(points:THREE.Vector3[])=>points.reduce((a,p)=>a.add(p),new THREE.Vector3()).divideScalar(points.length),delta=center(positions).sub(center(prior));const ratio=positions.length===2?positions[0].distanceTo(positions[1])/Math.max(.001,prior[0].distanceTo(prior[1])):1;if(delta.length()<.5&&ratio>.85&&ratio<1.15)motion={delta:delta.toArray() as [number,number,number],ratio};}
  gestures.current.positions=positions;controller.nativeHands(raw,gestures.current.time,motion);
 });
 return <group ref={localRoot}/>;
}
function ImmersiveThreeBridge(){
 const controller=useImmersive(),{scene,camera,gl}=useThree(),last=useRef(0);const helper=useMemo(()=>new THREE.BoxHelper(new THREE.Group(),0x08b9dd),[]);
 useEffect(()=>{helper.visible=false;scene.add(helper);return()=>{scene.remove(helper);helper.geometry.dispose();(helper.material as THREE.Material).dispose();};},[helper,scene]);
 useEffect(()=>{
  if(!controller?.session)return;const background=scene.background;scene.background=null;
  return()=>{scene.background=background;};
 },[controller?.session,scene]);
 useFrame(()=>{
  if(!controller)return;
  if(controller.session)scene.background=null;
  if(!controller.hands){helper.visible=false;return;}if(performance.now()-last.current<80)return;last.current=performance.now();
  const groups=new Map<string,THREE.Object3D>();
  scene.traverse(object=>{if(object.userData.immersiveId&&object.visible)groups.set(String(object.userData.immersiveId),object);});
  helper.visible=!!controller.hover.current&&groups.has(controller.hover.current);if(helper.visible)helper.setFromObject(groups.get(controller.hover.current!)!);
  controller.projected.current.clear();
  const project=(p:THREE.Vector3)=>{const v=p.clone().project(controller.session?gl.xr.getCamera():camera);return [(v.x+1)/2,(1-v.y)/2,0] as [number,number,number];};
  groups.forEach((object,id)=>{
   let visible=true;for(let p:THREE.Object3D|null=object;p;p=p.parent)if(!p.visible)visible=false;if(!visible)return;
   const box=new THREE.Box3().setFromObject(object);if(box.isEmpty())return;
   const center=box.getCenter(new THREE.Vector3()),screen=project(center),size=box.getSize(new THREE.Vector3());
   const edge=project(center.clone().add(new THREE.Vector3(size.x/2,size.y/2,0)));
   const target=screenTarget(id,screen[0],screen[1],Math.max(.025,Math.min(.18,Math.hypot(edge[0]-screen[0],edge[1]-screen[1]))));
   for(let axis=0;axis<3;axis++)for(const sign of [-1,1]){const face=center.clone();face.setComponent(axis,face.getComponent(axis)+size.getComponent(axis)*.5*sign);target.preferredGrabZones.push({id:`${id}:face:${axis}:${sign}`,kind:'face',position:project(face),radius:.03,axis:axis as 0|1|2,index:axis,dimension:String(axis)});}
   object.traverse(mesh=>{
    if(!(mesh instanceof THREE.Mesh)||!mesh.visible)return;const positions=mesh.geometry.getAttribute('position');if(!positions)return;
    for(let i=0;i<positions.count;i+=Math.max(1,Math.floor(positions.count/24))){const local=new THREE.Vector3().fromBufferAttribute(positions,i);const world=local.clone().applyMatrix4(mesh.matrixWorld);const point=project(world);if(point[0]<0||point[0]>1||point[1]<0||point[1]>1)continue;
     const sample=object.worldToLocal(world.clone());target.preferredGrabZones.push({id:`${id}:${mesh.uuid}:${i}`,kind:'surface',position:point,radius:.025,sample:sample.toArray() as [number,number,number]});
    }
   });
   controller.projected.current.set(id,target);
  });
 });
 return null;
}
