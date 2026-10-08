import {useEffect,useMemo,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import * as THREE from 'three';
import type {VisualCommand} from './commands';
import {directedData} from './directedGeometry';

/** Arrow geometry uses the native camera frustum, with no finite mathematical ray endpoint. */
export default function DirectedObject3D({command,swapYZ=false,eventProps={}}:{command:VisualCommand;swapYZ?:boolean;eventProps?:Record<string,unknown>}){
  const {camera}=useThree(),group=useRef<THREE.Group>(null);
  const data=directedData(command);
  const mapped=(p:number[])=>new THREE.Vector3(p[0],swapYZ?p[2]??0:p[1],swapYZ?p[1]:p[2]??0);
  const origin=mapped(data.origin),direction=mapped(data.direction).normalize();
  const arrow=useMemo(()=>new THREE.ArrowHelper(new THREE.Vector3(1,0,0),new THREE.Vector3(),1,command.color,.22,.12),[command.color]);
  const frustum=useMemo(()=>new THREE.Frustum(),[]),matrix=useMemo(()=>new THREE.Matrix4(),[]);
  useEffect(()=>()=>{for(const mesh of [arrow.line,arrow.cone]){const materials=Array.isArray(mesh.material)?mesh.material:[mesh.material];materials.forEach(m=>m.dispose());}},[arrow]);
  useFrame(()=>{
    if(!group.current)return;
    let enter=0,exit=data.magnitude;
    if(command.kind==='ray'||command.kind==='line'&&command.linearExtent!=='segment'){
      if(command.kind==='line')enter=-Infinity;
      const worldOrigin=group.current.localToWorld(origin.clone()),worldDirection=direction.clone().transformDirection(group.current.matrixWorld);
      frustum.setFromProjectionMatrix(matrix.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));exit=Infinity;
      for(const plane of frustum.planes){const distance=plane.distanceToPoint(worldOrigin),rate=plane.normal.dot(worldDirection);
        if(Math.abs(rate)<1e-12){if(distance<0){exit=-1;break;}}else if(rate>0)enter=Math.max(enter,-distance/rate);else exit=Math.min(exit,-distance/rate);
      }
      const scale=group.current.getWorldScale(new THREE.Vector3()).length()/Math.sqrt(3);enter/=scale;exit/=scale;
    }
    arrow.cone.visible=command.kind!=='line';
    arrow.visible=Number.isFinite(exit)&&exit>enter;
    if(arrow.visible){arrow.position.copy(origin).addScaledVector(direction,enter);arrow.setDirection(direction);arrow.setLength(exit-enter,Math.min(.22,(exit-enter)/4),Math.min(.12,(exit-enter)/6));}
  });
  return <group ref={group} {...eventProps}><primitive object={arrow}/></group>;
}
