import {useMemo,useEffect} from 'react';
import * as THREE from 'three';
import {createIntelligenceShapeGeometry} from './shapeGeometry3d';
import type {Graph3DSurface} from '../graph-studio/graph3dSurfaceModel';

/** Geometry stays local. The existing graph layer owns its world pose and scale. */
export default function AssistantGraphMesh({surface,onSelect}:{surface:Graph3DSurface;onSelect?:()=>void}){
  const command=surface.sourceCommand!;
  const geometry=useMemo(()=>{
    const result=command.kind==='point'?new THREE.SphereGeometry(.12,12,8):createIntelligenceShapeGeometry(command);
    result.applyMatrix4(new THREE.Matrix4().set(1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1));
    return result;
  },[command]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <mesh geometry={geometry} onClick={event=>{event.stopPropagation();onSelect?.();}}>
    <meshStandardMaterial color={surface.colorHigh} opacity={surface.opacity} transparent={surface.opacity<1} wireframe={surface.wireframe} side={THREE.DoubleSide}/>
  </mesh>;
}
