import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { TrackedPlacement } from '../../ar-math-lab/ARTrackedScene';
import { useImmersive } from './ImmersiveInteractionManager';
import type { RawHand } from '../../ar-math-lab/hand-intelligence/types';
export default function Immersive2DBoard(){
 const controller=useImmersive();const session=controller?.session,status=controller?.status;const fail=useCallback((error:unknown)=>{status?.(String(error));void session?.end();},[session,status]);if(!controller?.session||controller.adapter.current?.kind!=='2d')return null;
 return <div className="immersive-xr-board"><Canvas gl={{alpha:true,antialias:true}}><ambientLight intensity={1}/><TrackedPlacement profile="balanced" session={controller.session} scale={controller.scale} placement={controller.placement} mode={controller.placementMode} handsEnabled={controller.hands} onMessage={controller.status} onError={fail} onHands={()=>undefined}><group position={controller.pose.position} rotation={controller.pose.rotation}><LiveBoard/></group></TrackedPlacement></Canvas></div>;
}
function LiveBoard(){
 const controller=useImmersive(),mesh=useRef<THREE.Mesh>(null),{gl}=useThree();
 const [texture,setTexture]=useState<THREE.Texture|null>(null),[ratio,setRatio]=useState(1.5);
 useEffect(()=>{
  const source=controller?.adapter.current?.element();const svg=source instanceof SVGSVGElement?source:source?.querySelector('svg');if(!svg)return;
  let alive=true,timer=0,current:THREE.Texture|null=null;
  const capture=()=>{
   const clone=svg.cloneNode(true) as SVGSVGElement;const rect=svg.getBoundingClientRect();const width=Math.max(1,Math.round(rect.width)),height=Math.max(1,Math.round(rect.height));
   clone.setAttribute('xmlns','http://www.w3.org/2000/svg');clone.setAttribute('width',String(width));clone.setAttribute('height',String(height));
   // Preserve computed appearance, including theme text, without changing the source board.
   const elements=svg.querySelectorAll('*'),copies=clone.querySelectorAll<SVGElement>('*');elements.forEach((element,i)=>{const style=getComputedStyle(element);for(const key of ['fill','stroke','stroke-width','font-size','font-family','font-weight','opacity'])if(style.getPropertyValue(key))copies[i]?.style.setProperty(key,style.getPropertyValue(key));});
   const blob=new Blob([new XMLSerializer().serializeToString(clone)],{type:'image/svg+xml'}),url=URL.createObjectURL(blob),image=new Image();
   image.onload=()=>{URL.revokeObjectURL(url);if(!alive)return;const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const context=canvas.getContext('2d');if(!context)return;context.fillStyle='#fff';context.fillRect(0,0,width,height);context.drawImage(image,0,0);const next=new THREE.CanvasTexture(canvas);next.colorSpace=THREE.SRGBColorSpace;current?.dispose();current=next;setTexture(next);setRatio(width/height);};
   image.onerror=()=>{URL.revokeObjectURL(url);controller?.status('The live board could not be drawn in AR. Exit AR to continue normal editing.');};image.src=url;
  };
  const observer=new MutationObserver(()=>{clearTimeout(timer);timer=window.setTimeout(capture,160);});observer.observe(svg,{subtree:true,attributes:true,childList:true,characterData:true});capture();
  return()=>{alive=false;clearTimeout(timer);observer.disconnect();current?.dispose();};
 },[controller?.session]);
 const extent=controller?.adapter.current?.boardExtent?.()??[6,6/ratio];
 const last=useRef(0);
 useFrame((_,__,frame)=>{
  if(!controller?.hands||!controller.session||!mesh.current||!frame?.getJointPose||performance.now()-last.current<32)return;
  last.current=performance.now();const reference=gl.xr.getReferenceSpace();if(!reference)return;const raw:RawHand[]=[];
  for(const source of Array.from(controller.session.inputSources)){
   if(!source.hand)continue;const joints:XRHandJoint[]=['wrist','thumb-metacarpal','thumb-phalanx-proximal','thumb-phalanx-distal','thumb-tip',...(['index','middle','ring','pinky'] as const).flatMap(f=>[`${f}-finger-phalanx-proximal`,`${f}-finger-phalanx-intermediate`,`${f}-finger-phalanx-distal`,`${f}-finger-tip`] as XRHandJoint[])];
   const points=joints.map(name=>{const joint=source.hand!.get(name),pose=joint?frame.getJointPose!(joint,reference):null;if(!pose)return null;const p=pose.transform.position,v=mesh.current!.worldToLocal(new THREE.Vector3(p.x,p.y,p.z));return {x:v.x/extent[0]+.5,y:.5-v.y/extent[1],z:v.z/extent[0]};});
   if(points.every(p=>p!==null))raw.push({landmarks:points as NonNullable<RawHand['landmarks']>,handedness:source.handedness,confidence:1});
  }
  controller.nativeHands(raw,last.current);
 });
 return <mesh ref={mesh} rotation={controller?.placementMode!=='space'?[-Math.PI/2,0,0]:[0,0,0]}><planeGeometry args={extent}/><meshBasicMaterial map={texture} color="white" side={THREE.DoubleSide}/></mesh>;
}
