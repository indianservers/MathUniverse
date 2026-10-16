import * as THREE from 'three';
import {center} from './geometryQueries';
import {add,sub,mul,dot,cross3,unit,dist,EPS} from './geometryAnalyticMath';
import type {RoboObjectDescriptor} from './types';
import type {MathematicalPlane3} from '../kernel/geometry3d';
export function spatialSection(solid:RoboObjectDescriptor,plane:MathematicalPlane3):{kind:'polygon'|'point'|'line';points:number[][]}|undefined{
 const c=solid.command,s=c.scale??1,origin=center(solid),normal=unit(plane.normal),rotation=new THREE.Quaternion().setFromEuler(new THREE.Euler(...(c.rotation??[0,0,0]).map(x=>x*Math.PI/180) as [number,number,number]));
 if(['cube','cuboid'].includes(solid.type)){
  const w=c.width*s,h=(solid.type==='cube'?c.width:c.height)*s,d=(solid.type==='cube'?c.width:c.depth??c.width)*s;
  const vs=Array.from({length:8},(_,i)=>add(origin,new THREE.Vector3((i&1?1:-1)*w/2,(i&2?1:-1)*h/2,(i&4?1:-1)*d/2).applyQuaternion(rotation).toArray())),points:number[][]=[];
  const append=(p:number[])=>{if(!points.some(q=>dist(p,q)<=EPS))points.push(p);};
  vs.forEach((a,i)=>vs.forEach((b,j)=>{if(j<=i||![1,2,4].includes(i^j))return;const x=dot(sub(a,plane.point),normal),y=dot(sub(b,plane.point),normal);if(Math.abs(x)<=EPS)append(a);if(Math.abs(y)<=EPS)append(b);if(x*y<-EPS*EPS)append(add(a,mul(sub(b,a),x/(x-y))));}));
  if(!points.length)return;
  if(points.length>=3){const ctr=mul(points.reduce(add,[0,0,0]),1/points.length),u=unit(sub(points[0],ctr)),v=cross3(normal,u);points.sort((a,b)=>Math.atan2(dot(sub(a,ctr),v),dot(sub(a,ctr),u))-Math.atan2(dot(sub(b,ctr),v),dot(sub(b,ctr),u)));}
  return {kind:points.length===1?'point':points.length===2?'line':'polygon',points};
 }
 let radius:number,sectionCenter:number[];
 if(solid.type==='sphere'){const signed=dot(sub(origin,plane.point),normal),r=c.radius*s;if(Math.abs(signed)>r+EPS)return;radius=Math.sqrt(Math.max(0,r*r-signed*signed));sectionCenter=sub(origin,mul(normal,signed));}
 else if(solid.type==='cone'){const axis=new THREE.Vector3(0,1,0).applyQuaternion(rotation).toArray();if(Math.abs(Math.abs(dot(axis,normal))-1)>EPS)throw new Error('UNSUPPORTED: This cone slice must stay parallel to its base.');const offset=dot(sub(plane.point,origin),axis),h=c.height*s;if(Math.abs(offset)>h/2+EPS)return;radius=Math.max(0,c.radius*s*(.5-offset/h));sectionCenter=add(origin,mul(axis,offset));}
 else throw new Error('UNSUPPORTED: Live sections are supported for boxes, spheres, and cones cut parallel to their base.');
 if(radius<=EPS)return {kind:'point',points:[sectionCenter]};
 const u=unit(cross3(normal,Math.abs(normal[0])<.8?[1,0,0]:[0,1,0])),v=cross3(normal,u);
 return {kind:'polygon',points:Array.from({length:64},(_,i)=>add(sectionCenter,add(mul(u,radius*Math.cos(2*Math.PI*i/64)),mul(v,radius*Math.sin(2*Math.PI*i/64)))))};
}
