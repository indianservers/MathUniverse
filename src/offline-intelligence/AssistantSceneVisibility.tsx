import {useEffect} from 'react';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import type {Graph3DSurface} from '../graph-studio/graph3dSurfaceModel';

/** Keep newly commanded geometry on screen without moving an already useful view. */
export function AssistantSceneVisibility({surfaces}:{surfaces:Graph3DSurface[]}){
  const {scene,camera,controls}=useThree();
  useEffect(()=>{
    const ids=new Set(surfaces.filter(s=>s.sourceCommand&&s.visible).map(s=>s.id));
    if(!ids.size||!(camera instanceof THREE.PerspectiveCamera))return;
    scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);
    const frustum=new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
    const bounds=new THREE.Box3(),boxes:THREE.Box3[]=[];
    scene.traverse(o=>{if(ids.has(String(o.userData.immersiveId))){const box=new THREE.Box3().setFromObject(o);if(!box.isEmpty()){boxes.push(box);bounds.union(box);}}});
    const contained=(box:THREE.Box3)=>[box.min.x,box.max.x].every(x=>[box.min.y,box.max.y].every(y=>[box.min.z,box.max.z].every(z=>frustum.containsPoint(new THREE.Vector3(x,y,z)))));
    if(!boxes.length||boxes.every(contained))return;
    const center=bounds.getCenter(new THREE.Vector3()),radius=bounds.getSize(new THREE.Vector3()).length()/2;
    const orbit=controls as unknown as {target?:THREE.Vector3;update?:()=>void}|undefined;
    const direction=camera.position.clone().sub(orbit?.target??new THREE.Vector3()).normalize();
    const halfFov=Math.min(THREE.MathUtils.degToRad(camera.fov)/2,Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov)/2)*camera.aspect));
    const distance=Math.max(4,radius/Math.sin(halfFov)*1.2);
    camera.position.copy(center).addScaledVector(direction,distance);camera.far=Math.max(camera.far,distance+radius*2);camera.updateProjectionMatrix();
    orbit?.target?.copy(center);camera.lookAt(center);orbit?.update?.();
  },[surfaces,scene,camera,controls]);
  return null;
}
