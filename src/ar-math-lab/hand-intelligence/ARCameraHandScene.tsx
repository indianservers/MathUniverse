import { useEffect,useMemo, useRef, type ReactNode, type RefObject } from 'react';
import { useFrame,useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { ARGeneratedGeometrySolid, ARGeneratedGraphObject } from '../types';
import type { CameraHandRuntime, GrabZone, Vec3 } from './types';
import { clamp, normalized, sub } from './math';

/** Uses the rendered mesh and camera projection, never an assumed centre-of-screen target. */
export default function ARCameraHandScene({runtime,solid,graph,children}:{runtime:RefObject<CameraHandRuntime>;solid?:ARGeneratedGeometrySolid;graph?:ARGeneratedGraphObject;children:ReactNode}) {
  const {scene}=useThree(),outline=useMemo(()=>new THREE.BoxHelper(new THREE.Group(),0x08b9dd),[]);
  useEffect(()=>{outline.visible=false;scene.add(outline);return()=>{scene.remove(outline);outline.geometry.dispose();(outline.material as THREE.Material).dispose();if(runtime.current)runtime.current.gestureObjects=undefined;};},[scene,outline,runtime]);
  const group=useRef<THREE.Group>(null);const scratch=useMemo(()=>({box:new THREE.Box3(),meshBox:new THREE.Box3(),point:new THREE.Vector3(),center:new THREE.Vector3(),size:new THREE.Vector3()}),[]);
  const lastProjection=useRef(0);
  useFrame(({camera,clock})=>{
    const root=group.current,live=runtime.current;if(!root||!live)return;
    const transform=live.transform;
    root.position.set(transform.position[0]*.18,transform.position[1]*.13,transform.position[2]);root.rotation.set(...transform.rotation);root.scale.setScalar(transform.scale*.62);root.updateWorldMatrix(true,true);
    if(clock.elapsedTime-lastProjection.current<1/30)return;lastProjection.current=clock.elapsedTime;
    const selectable:THREE.Object3D[]=[];root.traverse(node=>{if(node.userData.gestureId&&node.visible)selectable.push(node);});
    live.gestureObjects=selectable.map(node=>({id:String(node.userData.gestureId),name:String(node.userData.gestureName),kind:'3d',capabilities:{move:!node.userData.gestureLocked,scale:!node.userData.gestureLocked,rotate:!node.userData.gestureLocked,tilt:!node.userData.gestureLocked,reset:!node.userData.gestureLocked},read:()=>({position:node.position.toArray() as Vec3,rotation:[node.rotation.x,node.rotation.y,node.rotation.z],scale:node.scale.x}),write:t=>{node.position.fromArray(t.position);node.rotation.set(...t.rotation);node.scale.setScalar(t.scale);},select:selected=>{node.userData.gestureSelected=selected;}}));
    const chosen=selectable.find(node=>node.userData.gestureSelected);outline.visible=!!chosen;if(chosen)outline.setFromObject(chosen);
    const object=solid??graph;if(!object||!object.visible||object.locked){live.targets=[];return;}
    scratch.box.makeEmpty();let primaryMesh:THREE.Mesh|undefined;
    root.traverse(node=>{const mesh=node as THREE.Mesh;if(!mesh.isMesh||!mesh.geometry||'text' in mesh||mesh.geometry.type==='TextGeometry')return;
      if(!mesh.geometry.boundingBox)mesh.geometry.computeBoundingBox();if(mesh.geometry.boundingBox){primaryMesh??=mesh;scratch.box.union(scratch.meshBox.copy(mesh.geometry.boundingBox).applyMatrix4(mesh.matrixWorld));}});
    if(scratch.box.isEmpty()){live.targets=[];return;}
    scratch.box.getCenter(scratch.center);scratch.box.getSize(scratch.size);
    const project=(point:THREE.Vector3):Vec3=>{scratch.point.copy(point).project(camera);return[(scratch.point.x+1)/2,(1-scratch.point.y)/2,0];};
    const center=project(scratch.center),right=project(scratch.center.clone().add(new THREE.Vector3(scratch.size.x/2,0,0))),top=project(scratch.center.clone().add(new THREE.Vector3(0,scratch.size.y/2,0)));
    const radius=clamp(Math.max(Math.abs(right[0]-center[0]),Math.abs(top[1]-center[1])),.02,.7);
    const radiusDimension=solid?.dimensions.radius;
    const zones:GrabZone[]=[{id:'body',kind:'body',position:center,radius,dimension:radiusDimension?'radius':undefined,value:radiusDimension?.value}];
    if(solid){
      const dimensions=solid.dimensions;
      const keys=[dimensions.length?'length':dimensions.side?'side':undefined,dimensions.height?'height':dimensions.side?'side':undefined,dimensions.width?'width':dimensions.side?'side':undefined];
      for(let axis=0;axis<3;axis++)for(const sign of [-1,1]){
        const localBox=primaryMesh?.geometry.boundingBox,face=localBox?localBox.getCenter(new THREE.Vector3()):scratch.center.clone();
        const localSize=localBox?.getSize(new THREE.Vector3())??scratch.size;
        face.setComponent(axis,face.getComponent(axis)+localSize.getComponent(axis)*.5*sign);if(primaryMesh&&localBox)face.applyMatrix4(primaryMesh.matrixWorld);
        const position=project(face);
        zones.push({id:`face-${axis}-${sign}`,kind:radiusDimension?'radius':'face',position,radius:radius*.4,axis:axis as 0|1|2,direction:normalized(sub(position,center)),dimension:radiusDimension?'radius':keys[axis],value:radiusDimension?.value??(keys[axis]?dimensions[keys[axis]!]?.value:undefined)});
      }
      for(let i=0;i<8;i++){const p=new THREE.Vector3(i&1?scratch.box.max.x:scratch.box.min.x,i&2?scratch.box.max.y:scratch.box.min.y,i&4?scratch.box.max.z:scratch.box.min.z);zones.push({id:`corner-${i}`,kind:'edge',position:project(p),radius:radius*.2});}
    }else if(graph){
      const geometry=graph.geometry;const count=geometry.kind==='curve'?geometry.points.length:Math.floor(geometry.vertices.length/3);
      const editable=graph.semanticType==='vector'||graph.semanticType==='polygon';
      const mesh=root.children[0]?.children[0] as THREE.Group|undefined;
      const worldMatrix=mesh?.matrixWorld??root.matrixWorld;
      const step=Math.max(1,Math.floor(count/40));
      for(let i=0;i<count;i+=step){const p=geometry.kind==='curve'?geometry.points[i]:geometry.vertices.slice(i*3,i*3+3) as Vec3;if(!p||!p.every(Number.isFinite))continue;const world=new THREE.Vector3(...p).applyMatrix4(worldMatrix);
        zones.push({id:`sample-${i}`,kind:editable?(graph.semanticType==='vector'&&i===count-1?'vector':'vertex'):'surface',position:project(world),radius:clamp(radius*.12,.012,.035),index:i,sample:p});}
    }
    const ndc=scratch.center.clone().project(camera);
    live.targets=[{objectId:object.id,semanticType:solid?.solidType??graph!.type,position:center,radius,depth:camera.position.distanceTo(scratch.center),visible:object.visible&&ndc.z>=-1&&ndc.z<=1,locked:object.locked,selected:true,
      allowedInteractions:{translate:true,rotate:true,scale:true,editRadius:!!radiusDimension,stretchX:!!solid,stretchY:!!solid,stretchZ:!!solid,sampleSurface:!!graph,editVector:graph?.semanticType==='vector',editVertex:graph?.semanticType==='polygon'},preferredGrabZones:zones,precisionRequired:radius<.06?.8:.3}];
  });
  return <group ref={group}>{children}</group>;
}
