import * as THREE from 'three';
import {commandTransform3d} from './solidAdapter';
import type {VisualCommand} from './commands';

export type SceneTransform3D={position:[number,number,number];rotation:[number,number,number];scale:number;visible:boolean;color:string;name?:string;locked?:boolean;opacity?:number;material?:'matte'|'glass'|'wireframe';dimensions?:[number,number,number]};
export type SceneEntry3D={id:string;kind:VisualCommand['kind'];transform:SceneTransform3D;command?:VisualCommand;label?:string;localPoints?:number[][]};
export function visibleBaseTransforms<T extends Record<string,SceneTransform3D>>(transforms:T,deleted:readonly string[]):T{
  return Object.fromEntries(Object.entries(transforms).map(([id,t])=>[id,deleted.includes(id)?{...t,visible:false}:t])) as T;
}
function matrix(t:SceneTransform3D){return new THREE.Matrix4().compose(new THREE.Vector3(...t.position),new THREE.Quaternion().setFromEuler(new THREE.Euler(...t.rotation.map(n=>n*Math.PI/180) as [number,number,number])),new THREE.Vector3(t.scale,t.scale,t.scale));}
export function geometry3dInventory(entries:SceneEntry3D[]):VisualCommand[]{
  return entries.map(({id,kind,transform:t,command:source,label,localPoints})=>{
    const dims=t.dimensions??[1.5,1.5,1.5];
    const command:VisualCommand=source?structuredClone(source):{kind,dimension:'3d',points:[t.position],width:dims[0],height:dims[1],depth:dims[2],radius:dims[0]/2,color:t.color};
    if(source&&(['line','ray','vector','triangle','polygon'].includes(source.kind)||source.kind==='tetrahedron'&&source.points.length===4)){
      const original={...t,...commandTransform3d(source),scale:source.scale??1};
      const delta=matrix(t).multiply(matrix(original).invert());
      command.points=source.points.map(p=>new THREE.Vector3(p[0],p[1],p[2]??0).applyMatrix4(delta).toArray());command.rotation=[0,0,0];command.scale=1;
    }else{
      command.points=[...command.points];command.points[0]=[...t.position];command.rotation=[...t.rotation];command.scale=t.scale;
      if(!source&&kind==='polygon'){
        command.points=[[-dims[0]/2,-dims[1]/2,0],[dims[0]/2,-dims[1]/2,0],[dims[0]/2,dims[1]/2,0],[-dims[0]/2,dims[1]/2,0]].map(p=>new THREE.Vector3(...p as [number,number,number]).applyMatrix4(matrix(t)).toArray());command.rotation=[0,0,0];command.scale=1;command.roboExplicitVertices=true;command.roboSemanticKind='plane';
      }
      if(!source&&['line','vector'].includes(kind)){
        const half=dims[0]/2,local=localPoints??[[kind==='vector'?0:-half,0,0],[kind==='vector'?dims[0]:half,0,0]];
        command.points=local.map(p=>new THREE.Vector3(...p as [number,number,number]).applyMatrix4(matrix(t)).toArray());command.rotation=[0,0,0];command.scale=1;
      }
    }
    return {...command,...(t.opacity!==undefined?{roboOpacity:t.opacity}:{}),...(t.material?{roboMaterial:t.material}:{}),objectId:id,color:t.color,roboVisible:t.visible,roboLocked:t.locked,roboLabel:source?.roboLabel??t.name??label??kind};
  });
}
