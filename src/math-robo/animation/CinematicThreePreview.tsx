import {blendMeshPositions} from './meshMorph';
import {ruhiMotion} from './RuhiCinematicMotionEngine';
import {sampleSurface,generateSurfaceMeshData} from '../../utils/mathEngine/graph3dUtils';
import {useEffect,useLayoutEffect,useMemo,useSyncExternalStore} from 'react';
import {useThree} from '@react-three/fiber';
import {Html} from '@react-three/drei';
import * as THREE from 'three';
import type {VisualCommand} from '../../offline-intelligence/commands';
import {createIntelligenceShapeGeometry} from '../../offline-intelligence/shapeGeometry3d';
import {commandTransform3d} from '../../offline-intelligence/solidAdapter';
import DirectedObject3D from '../../offline-intelligence/DirectedObject3D';
import {getMotionPreview,subscribeMotionPreview,registerMotionPreview} from './motionPreview';
export function CinematicThreePreview({mode,range,resolution=32}:{mode:'geometry3d'|'graph3d';range?:[number,number];resolution?:number}){
 const frame=useSyncExternalStore(subscribeMotionPreview,()=>getMotionPreview(mode),()=>undefined),{scene}=useThree();
 useEffect(()=>registerMotionPreview(mode),[mode]);
 useLayoutEffect(()=>{if(!frame)return;const ids=frame.commands.map(c=>c.objectId!),hidden:{object:THREE.Object3D;visible:boolean}[]=[];
 scene.traverse(object=>{const id=object.userData.ruhiObjectId??object.userData.immersiveId;if(typeof id==='string'&&ids.some(base=>id===base||id.startsWith(`${base}-`))){hidden.push({object,visible:object.visible});object.visible=false;}});
 return()=>{for(const {object,visible} of hidden)object.visible=visible;};
 },[scene,frame]);
 return <group userData={{ruhiMotionPreview:true}}>{frame?.commands.map(c=><MovingObject key={c.objectId} source={frame.sources?.[c.objectId!]} command={c} range={range} resolution={resolution} swapYZ={mode==='graph3d'} progress={frame.progress} creating={frame.creating.includes(c.objectId!)} />)}</group>;
}
function MovingObject({command:c,swapYZ,progress,creating,range,resolution,source}:{command:VisualCommand;swapYZ:boolean;progress:number;creating:boolean;range?:[number,number];resolution:number;source?:VisualCommand}){
 const directed=['line','ray','vector'].includes(c.kind),point=c.kind==='point',pose=commandTransform3d(c);
 const geometry=useMemo(()=>{
  const build=(value:VisualCommand)=>{const c=value,pose=commandTransform3d(c);
  if(directed||point)return undefined;
  let g:THREE.BufferGeometry;
  if(swapYZ&&c.kind==='plot'&&c.expression){const samples=sampleSurface(c.expression,-(range?.[0]??3),range?.[0]??3,-(range?.[1]??3),range?.[1]??3,resolution),data=generateSurfaceMeshData(samples),span=Math.max(1,Math.abs(samples.maxZ??1),Math.abs(samples.minZ??-1)),factor=span>8?8/span:1;
   const positions=data.positions;for(let i=0;i<positions.length;i+=3){const z=positions[i+1]*factor;positions[i+1]=positions[i+2];positions[i+2]=z;}
   g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(data.indices);g.computeVertexNormals();
  }else g=createIntelligenceShapeGeometry(c);
  if(swapYZ&&['cylinder','cone','frustum'].includes(c.kind))g.rotateX(Math.PI/2);
  const matrix=new THREE.Matrix4().compose(new THREE.Vector3(...pose.position),new THREE.Quaternion().setFromEuler(new THREE.Euler(...pose.rotation.map(v=>v*Math.PI/180) as [number,number,number])),new THREE.Vector3().setScalar(c.scale??1));g.applyMatrix4(matrix);
  if(swapYZ){const attribute=g.getAttribute('position');for(let i=0;i<attribute.count;i++){const y=attribute.getY(i);attribute.setY(i,attribute.getZ(i));attribute.setZ(i,y);}g.computeVertexNormals();}
  return g;
  };
  const target=build(c);if(!target)return undefined;
  if(source&&source.kind!==c.kind&&!['line','ray','vector','point'].includes(source.kind)){
   const start=build(source);if(start){const a=start.index?start.toNonIndexed():start,b=target.index?target.toNonIndexed():target;
    const positions=blendMeshPositions(a.getAttribute('position').array,b.getAttribute('position').array,progress),result=new THREE.BufferGeometry();result.setAttribute('position',new THREE.BufferAttribute(positions,3));result.computeVertexNormals();
    if(a!==start)a.dispose();if(b!==target)b.dispose();start.dispose();target.dispose();return result;
   }
  }
  return target;
 },[c,directed,point,swapYZ,range,resolution,source,progress]);
 useEffect(()=>()=>geometry?.dispose(),[geometry]);
 const position=(swapYZ?[pose.position[0],pose.position[2],pose.position[1]]:pose.position) as [number,number,number];
 if(c.roboVisible===false)return null;
 return <group>{directed?<DirectedObject3D command={c} swapYZ={swapYZ}/>:point?<mesh position={position}><sphereGeometry args={[creating?.08+.08*(1-progress):.08,12,8]}/><meshStandardMaterial color={c.color} transparent opacity={creating?progress:1}/></mesh>:geometry?<mesh geometry={geometry}><meshStandardMaterial color={c.color} side={THREE.DoubleSide} transparent opacity={creating?.7*progress:.7} emissive={ruhiMotion.glow?c.color:'black'} emissiveIntensity={ruhiMotion.glow?.12:0} metalness={.15} roughness={.35}/></mesh>:null}
 <Html position={position} style={{pointerEvents:'none',fontSize:11,color:c.color,whiteSpace:'nowrap'}}>{c.roboLabel??c.kind} · ({pose.position.map(v=>Number(v.toFixed(2))).join(', ')}){['sphere','circle','cone','cylinder','hemisphere'].includes(c.kind)?` · r = ${Number((c.radius*(c.scale??1)).toFixed(3))}`:''}</Html>
 </group>;
}
