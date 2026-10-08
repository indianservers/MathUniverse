import * as THREE from 'three';
import { createGraph3DSurface, type Graph3DSurface } from '../graph-studio/graph3dSurfaceModel';
import { centroid, type VisualCommand } from './commands';
import { createIntelligenceShapeGeometry } from './shapeGeometry3d';
import {commandTransform3d} from './solidAdapter';

export function restoredGraph3dCommands(layers:Graph3DSurface[]):VisualCommand[]{
  const commands=new Map<string,VisualCommand>();
  for(const layer of layers){
    const source=layer.roboCommand??layer.sourceCommand;
    if(!source)continue;
    const command=structuredClone(source),origin=commandTransform3d(command).position;
    if(!layer.roboCommand&&layer.displayTransform){
      command.points=command.points.map(p=>p.map((n,i)=>n+layer.displayTransform!.position[i]-origin[i]));
      command.scale=layer.displayTransform.scale;
      command.rotation=layer.displayTransform.rotation.map(n=>n*180/Math.PI) as [number,number,number];
    }
    command.objectId=source.objectId??layer.id;command.roboNativeRow=!source.objectId;
    command.color=layer.colorLow;command.roboVisible=layer.visible;
    commands.set(command.objectId,command);
  }
  return [...commands.values()];
}

export function intelligenceGraph3dLayers(c:VisualCommand):Graph3DSurface[] {
  const layer=()=>{const s=createGraph3DSurface(c.expression??'0');s.sourceCommand=structuredClone(c);s.name=c.kind;s.colorLow=s.colorHigh=c.color;s.palette='custom';s.samplingAnimation=false;s.displayTransform={position:[0,0,0],rotation:(c.rotation??[0,0,0]).map(v=>v*Math.PI/180) as [number,number,number],scale:c.scale??1};return s;};
  if(c.kind==='plot'){const s=layer();s.displayTransform!.position=(c.points[0]??[0,0,0]) as [number,number,number];return [s];}
  if(c.kind==='line'||c.kind==='ray'||c.kind==='vector'){const s=layer();s.kind='curve';s.roboCommand=structuredClone(c);s.displayTransform={position:[0,0,0],rotation:[0,0,0],scale:1};s.components={x:'0',y:'0',z:'0'};return [s];}
  if(c.kind==='point'){
    const s=layer(),p=c.points;
    s.kind='curve';s.tMin=0;s.tMax=1;
    const a=p[0],b=p[1]??p[0],center=centroid(p);s.displayTransform!.position=center as [number,number,number];s.components={x:`${a[0]-center[0]}+(${b[0]-a[0]})*t`,y:`${a[1]-center[1]}+(${b[1]-a[1]})*t`,z:`${(a[2]??0)-center[2]}+(${(b[2]??0)-(a[2]??0)})*t`};s.showPoints=c.kind==='point';return [s];
  }
  const center=(c.kind==='triangle'&&c.points.length===3)||(c.kind==='polygon'&&c.points.length>=3)?centroid(c.points):c.points[0]??[0,0,0];
  const parametric=(x:string,y:string,z:string,uMin:number,uMax:number,vMin:number,vMax:number)=>{const s=layer();s.kind='parametric';s.components={x,y,z};Object.assign(s,{uMin,uMax,vMin,vMax});s.displayTransform!.position=center as [number,number,number];return s;};
  const r=c.radius,h=c.height;
  // One analytic patch avoids dozens of independent sampled meshes for a flat disc.
  if(['circle','ellipse','semicircle'].includes(c.kind)) {
    const a=c.kind==='ellipse'?c.width/2:r,b=c.kind==='ellipse'?h/2:r;
    return [parametric(`${a}*v*cos(u)`,`${b}*v*sin(u)`,'0',0,c.kind==='semicircle'?Math.PI:2*Math.PI,0,1)];
  }
  if(c.kind==='rectangle'||c.kind==='square')return [parametric(`${c.width}*(u-.5)`,`${h}*(v-.5)`,'0',0,1,0,1)];
  if(['sphere','ellipsoid','hemisphere'].includes(c.kind)){
    const [a,b,d]=c.kind==='ellipsoid'?[c.width/2,c.height/2,(c.depth??c.width)/2]:[r,r,r];
    return [parametric(`${a}*sin(v)*cos(u)`,`${b}*cos(v)`,`${d}*sin(v)*sin(u)`,0,2*Math.PI,0,c.kind==='hemisphere'?Math.PI/2:Math.PI)];
  }
  if(['cone','cylinder','frustum'].includes(c.kind)){
    const top=c.kind==='cone'?0:c.kind==='frustum'?r/2:r,rv=`(${r}+(${top-r})*v)`;
    return [parametric(`${rv}*cos(u)`,`${h}*(v-.5)`,`${rv}*sin(u)`,0,2*Math.PI,0,1),parametric(`${r}*v*cos(u)`,`${-h/2}`,`${r}*v*sin(u)`,0,2*Math.PI,0,1),...(top?[parametric(`${top}*v*cos(u)`,`${h/2}`,`${top}*v*sin(u)`,0,2*Math.PI,0,1)]:[])];
  }
  if(c.kind==='torus'||c.kind==='tube'){const tube=c.kind==='torus'?r/4:r/10;return [parametric(`(${r}+${tube}*cos(v))*cos(u)`,`(${r}+${tube}*cos(v))*sin(u)`,`${tube}*sin(v)`,0,2*Math.PI,0,2*Math.PI)];}
  if(c.kind==='capsule')return [parametric(`${r}*sin(v)*cos(u)`,`${r}*cos(v)+${h/2}`,`${r}*sin(v)*sin(u)`,0,2*Math.PI,0,Math.PI/2),parametric(`${r}*sin(v)*cos(u)`,`${r}*cos(v)-${h/2}`,`${r}*sin(v)*sin(u)`,0,2*Math.PI,Math.PI/2,Math.PI),parametric(`${r}*cos(u)`,`${h}*(v-.5)`,`${r}*sin(u)`,0,2*Math.PI,0,1)];
  const geometry=createIntelligenceShapeGeometry(c),buffer=geometry.index?geometry.toNonIndexed():geometry;
  const position=buffer.getAttribute('position'),result:Graph3DSurface[]=[];
  for(let i=0;i<position.count;i+=3){
    const a=[position.getX(i),position.getY(i),position.getZ(i)],b=[position.getX(i+1),position.getY(i+1),position.getZ(i+1)],d=[position.getX(i+2),position.getY(i+2),position.getZ(i+2)];
    const expression=(j:number)=>`${a[j]}+(${b[j]-a[j]})*u+(${d[j]-a[j]})*(1-u)*v`;
    result.push(parametric(expression(0),expression(1),expression(2),0,1,0,1));
  }
  if(buffer!==geometry)buffer.dispose();geometry.dispose();return result;
}

/** Display-frame conversion only; stored coordinates and XYZ Euler angles remain mathematical. */
export function graphScenePose3d(position:[number,number,number]=[0,0,0],rotation:[number,number,number]=[0,0,0]){
 const frame=new THREE.Matrix4().set(1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1),matrix=new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...rotation,'XYZ'));
 const sceneRotation=frame.clone().multiply(matrix).multiply(frame),q=new THREE.Quaternion().setFromRotationMatrix(sceneRotation);
 return {position:[position[0],position[2],position[1]] as [number,number,number],quaternion:[q.x,q.y,q.z,q.w] as [number,number,number,number]};
}
