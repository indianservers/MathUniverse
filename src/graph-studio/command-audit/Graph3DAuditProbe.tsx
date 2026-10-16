import {useEffect, useRef} from 'react';
import {useFrame, useThree} from '@react-three/fiber';
import * as THREE from 'three';

export type RenderEvidence = {frames:number;calls:number;triangles:number;objects:{layerId:string;vertices:number;finite:boolean;inFrustum:boolean;fullyInFrustum:boolean;visible:boolean}[]};
let inspect:(()=>RenderEvidence)|undefined;
export const readGraph3DRenderEvidence=()=>inspect?.();

/** Read-only instrumentation, mounted only by the development build. */
export function Graph3DAuditProbe(){
  const {scene,camera,gl}=useThree();
  const frames=useRef(0);
  useFrame(()=>{frames.current++;});
  useEffect(()=>{
    inspect=()=>{
      scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);
      const frustum=new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
      const objects:RenderEvidence['objects']=[];
      scene.traverse(node=>{
        const geometry=(node as THREE.Mesh).geometry;
        const position=geometry?.getAttribute('position');if(!position)return;
        let parent:THREE.Object3D|null=node,layerId='',visible=true;
        while(parent){visible=visible&&parent.visible;layerId||=String(parent.userData.immersiveId??'');parent=parent.parent;}
        if(!layerId)return;
        const box=new THREE.Box3().setFromObject(node);
        const fullyInFrustum=[box.min.x,box.max.x].every(x=>[box.min.y,box.max.y].every(y=>[box.min.z,box.max.z].every(z=>frustum.containsPoint(new THREE.Vector3(x,y,z)))));
        objects.push({layerId,vertices:position.count,finite:Array.from(position.array).every(Number.isFinite),inFrustum:frustum.intersectsObject(node),fullyInFrustum,visible});
      });
      return {frames:frames.current,calls:gl.info.render.calls,triangles:gl.info.render.triangles,objects};
    };
    return ()=>{inspect=undefined;};
  },[scene,camera,gl]);
  return null;
}
