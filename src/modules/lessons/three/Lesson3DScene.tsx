import { Component, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useThree, type ThreeEvent } from '@react-three/fiber';
import { Edges, Html, Line, OrbitControls } from '@react-three/drei';
import { BoxGeometry, BufferGeometry, Color, CylinderGeometry, DoubleSide, Float32BufferAttribute, LatheGeometry, OctahedronGeometry, OrthographicCamera, PerspectiveCamera, Plane, Quaternion, SphereGeometry, TetrahedronGeometry, Vector2, Vector3 } from 'three';
import { cubeNetCorners, norm3, scale3, surfaceValue, surfaceGradient, type V3, type SurfaceKind } from './lesson3DMath';
import type { Arrow3D, Body3D, Marker3D, Model3D, Patch3D, Plane3D } from './lesson3DModels';
import { investigationFrame } from './lesson3DModels';

export type Camera3D='perspective'|'top'|'front'|'right';
function ViewportControls({model,profile,preset,dragging}:{model:Model3D;profile:SurfaceKind;preset:Camera3D;dragging:boolean}){
  // Freeze the frame during parameter changes so dragging never moves the camera.
  // The parent remounts this canvas for explicit fit/reset/view actions.
  const [frame]=useState(()=>investigationFrame(model,profile));
  const {camera,size,invalidate}=useThree();
  const target=useMemo(()=>[frame.center[0],frame.center[2],-frame.center[1]] as V3,[frame]);
  useLayoutEffect(()=>{
    const direction=new Vector3(...(preset==='top'?[0,1,0.00001]:preset==='front'?[0,0,1]:preset==='right'?[1,0,0]:[1,0.8,1])).normalize();
    let distance=frame.radius*3;
    if(camera instanceof PerspectiveCamera){const vertical=camera.fov*Math.PI/180,horizontal=2*Math.atan(Math.tan(vertical/2)*size.width/size.height);distance=frame.radius/Math.sin(Math.min(vertical,horizontal)/2)*1.12;}
    if(camera instanceof OrthographicCamera)camera.zoom=Math.min(size.width,size.height)/(frame.radius*2.4);
    camera.position.copy(new Vector3(...target).addScaledVector(direction,distance));camera.up.set(0,1,0);camera.lookAt(...target);camera.updateProjectionMatrix();invalidate();
  },[camera,frame,invalidate,preset,size.width,size.height,target]);
  return <OrbitControls makeDefault target={target} enabled={!dragging} enableDamping={false} minDistance={0.5} maxDistance={250} minZoom={1} maxZoom={200}/>;
}
class SceneBoundary extends Component<{children:ReactNode},{failed:boolean}>{
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?<p className="l3d-fallback" role="status">The 3D canvas is unavailable on this device. You can still change every parameter and study the coordinates, equations, and results below.</p>:this.props.children;}
}
function Label({point,children}:{point:V3;children:ReactNode}){return <Html position={point} center style={{pointerEvents:'none'}}><span className="l3d-scene-label">{children}</span></Html>;}
function Arrow({start,vector,color,label}:Arrow3D){
  const length=norm3(vector),head=Math.min(0.25,length/4);
  const quaternion=useMemo(()=>new Quaternion().setFromUnitVectors(new Vector3(0,1,0),length?new Vector3(...vector).normalize():new Vector3(0,1,0)),[vector,length]);
  return length<1e-9?null:<><group position={start} quaternion={quaternion}><mesh position={[0,(length-head)/2,0]}><cylinderGeometry args={[0.018,0.018,length-head,8]}/><meshStandardMaterial color={color}/></mesh><mesh position={[0,length-head/2,0]}><coneGeometry args={[Math.min(0.1,head/2),head,12]}/><meshStandardMaterial color={color}/></mesh></group>{label&&<Label point={start.map((x,i)=>x+vector[i]) as V3}>{label}</Label>}</>;
}
function DraggablePoint({marker,onMove,onDragging}:{marker:Marker3D;onMove:(kind:NonNullable<Marker3D['drag']>,point:V3)=>void;onDragging:(value:boolean)=>void}){
  const dragging=useRef(false),planeHeight=useRef(marker.point[2]);
  const release=(e:ThreeEvent<PointerEvent>)=>{if(!dragging.current)return;dragging.current=false;onDragging(false);e.stopPropagation();(e.target as {releasePointerCapture:(id:number)=>void}|null)?.releasePointerCapture(e.pointerId);};
  return <group><mesh position={marker.point}
    onPointerDown={e=>{if(!marker.drag)return;e.stopPropagation();dragging.current=true;planeHeight.current=marker.point[2];onDragging(true);(e.target as {setPointerCapture:(id:number)=>void}|null)?.setPointerCapture(e.pointerId);}}
    onPointerMove={e=>{if(!dragging.current||!marker.drag)return;e.stopPropagation();const point=e.ray.intersectPlane(new Plane(new Vector3(0,1,0),-planeHeight.current),new Vector3());if(point)onMove(marker.drag,[Math.max(-3,Math.min(3,point.x)),Math.max(-3,Math.min(3,-point.z)),planeHeight.current]);}}
    onPointerUp={release} onPointerCancel={release}>
    <sphereGeometry args={[0.095,16,12]}/><meshStandardMaterial color={marker.color}/>
  </mesh><Label point={[marker.point[0],marker.point[1],marker.point[2]+0.22]}>{marker.label}</Label></group>;
}
function PlanePatch({normal,offset,color,size=5}:Plane3D){
  const quaternion=useMemo(()=>new Quaternion().setFromUnitVectors(new Vector3(0,0,1),new Vector3(...normal).normalize()),[normal]);
  const position=scale3(normal,offset/(norm3(normal)**2));
  return <mesh position={position} quaternion={quaternion}><planeGeometry args={[size,size]}/><meshStandardMaterial color={color} transparent opacity={0.23} side={DoubleSide} depthWrite={false}/><Edges color={color}/></mesh>;
}
function Body({body,construction}:{body:Body3D;construction:boolean}){
  const {kind,radius:r,height:h}=body;
  const geometry=useMemo(()=>{
    if(body.innerRadius!==undefined&&body.innerRadius>0){const inside=body.innerRadius;return new LatheGeometry([new Vector2(inside,0),new Vector2(r,0),new Vector2(r,h),new Vector2(inside,h),new Vector2(inside,0)],48);}
    switch(kind){
      case 'cube':return new BoxGeometry(2*r,2*r,2*r);
      case 'cuboid':return new BoxGeometry(2*r,2*r,h);
      case 'sphere':return new SphereGeometry(r,40,24);
      case 'hemisphere':return new SphereGeometry(r,40,24,0,2*Math.PI,0,Math.PI/2);
      case 'tetrahedron':return new TetrahedronGeometry(2*r*Math.sqrt(6)/4);
      case 'octahedron':return new OctahedronGeometry(r);
      case 'prism':return new CylinderGeometry(r,r,h,3);
      case 'pyramid':return new CylinderGeometry(0,r*Math.sqrt(2),h,4);
      case 'cone':return new CylinderGeometry(0,r,h,48);
      case 'frustum':return new CylinderGeometry(r/2,r,h,48);
      default:return new CylinderGeometry(r,r,h,48);
    }
  },[kind,r,h,body.innerRadius]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  const round=['cylinder','cone','frustum','prism','pyramid','hemisphere'].includes(kind),hollow=(body.innerRadius??0)>0;
  const rotation:V3=round||hollow?[body.flip?-Math.PI/2:Math.PI/2,0,kind==='pyramid'?Math.PI/4:0]:[0,0,0];
  const height=kind==='cube'?2*r:h;
  const centered=['sphere','hemisphere','tetrahedron','octahedron'].includes(kind)||hollow;
  const position:V3=[body.position[0],body.position[1],body.position[2]+(centered?0:height/2)];
  const clips=useMemo(()=>body.clipHeight===undefined?undefined:[new Plane(new Vector3(0,-1,0),body.clipHeight)],[body.clipHeight]);
  return <group><mesh geometry={geometry} position={position} rotation={rotation}>
    <meshStandardMaterial color={body.color} transparent opacity={body.opacity??0.7} side={DoubleSide} depthWrite={false} wireframe={body.wire} clippingPlanes={clips}/>
    {construction&&['cube','cuboid','prism','pyramid','tetrahedron','octahedron'].includes(kind)&&<Edges color={body.color}/>}
  </mesh>{kind==='hemisphere'&&<mesh position={body.position}><circleGeometry args={[r,48]}/><meshStandardMaterial color={body.color} transparent opacity={body.opacity??0.7} side={DoubleSide}/></mesh>}</group>;
}
function surfaceGeometry(patch:Patch3D,profile:SurfaceKind){
  const geometry=new BufferGeometry(),positions:number[]=[],colors:number[]=[],indices:number[]=[];
  const count=32,domain=patch.domain??3,[px,py]=patch.point??[0,0],height=surfaceValue(profile,px,py),[fx,fy]=surfaceGradient(profile,px,py);
  for(let i=0;i<=count;i++)for(let j=0;j<=count;j++){
    const x=-domain+2*domain*i/count+(patch.kind==='tangent'?px:0),y=-domain+2*domain*j/count+(patch.kind==='tangent'?py:0);
    const z=patch.kind==='tangent'?height+fx*(x-px)+fy*(y-py):patch.kind==='complex'?x*x+y*y:surfaceValue(patch.kind,x,y);
    positions.push(x,y,z);const color=new Color(patch.color);if(patch.kind==='complex')color.setHSL((Math.atan2(2*x*y,x*x-y*y)/(2*Math.PI)+1)%1,0.65,0.5);colors.push(color.r,color.g,color.b);
    if(i<count&&j<count){const index=i*(count+1)+j;indices.push(index,index+1,index+count+1,index+1,index+count+2,index+count+1);}
  }
  geometry.setAttribute('position',new Float32BufferAttribute(positions,3));geometry.setAttribute('color',new Float32BufferAttribute(colors,3));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}
function SurfacePatch({patch,profile}:{patch:Patch3D;profile:SurfaceKind}){
  const geometry=useMemo(()=>surfaceGeometry(patch,profile),[patch,profile]);useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <mesh geometry={geometry}><meshStandardMaterial vertexColors transparent opacity={patch.kind==='tangent'?0.55:0.7} side={DoubleSide} depthWrite={false}/></mesh>;
}
function CubeNet({fold}:{fold:number}){
  const geometries=useMemo(()=>cubeNetCorners(fold).map(points=>{const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(points.flat(),3));geometry.setIndex([0,1,2,0,2,3]);geometry.computeVertexNormals();return geometry;}),[fold]);
  useEffect(()=>()=>geometries.forEach(geometry=>geometry.dispose()),[geometries]);
  return <group>{geometries.map((geometry,i)=><mesh key={i} geometry={geometry}><meshStandardMaterial color={['#2563eb','#e87916','#9333ea','#059669','#d97706','#db2777'][i]} side={DoubleSide}/><Edges color="#334155"/></mesh>)}</group>;
}
function CoordinateFrame({axes,grid}:{axes:boolean;grid:boolean}){
  return <>{grid&&Array.from({length:11},(_,i)=>i-5).map(i=><group key={i}><Line points={[[i,-5,0],[i,5,0]]} color="#94a3b8" transparent opacity={0.25}/><Line points={[[-5,i,0],[5,i,0]]} color="#94a3b8" transparent opacity={0.25}/></group>)}
    {axes&&<><Line points={[[-5,0,0],[5,0,0]]} color="#dc2626"/><Line points={[[0,-5,0],[0,5,0]]} color="#059669"/><Line points={[[0,0,-3],[0,0,6]]} color="#2563eb"/><Label point={[5,0,0]}>x</Label><Label point={[0,5,0]}>y</Label><Label point={[0,0,6]}>z</Label></>}
  </>;
}
export default function Lesson3DScene({model,profile,camera,orthographic,revision,axes,grid,construction,dragging,onMove,onDragging}:{model:Model3D;profile:SurfaceKind;camera:Camera3D;orthographic:boolean;revision:number;axes:boolean;grid:boolean;construction:boolean;dragging:boolean;onMove:(kind:NonNullable<Marker3D['drag']>,point:V3)=>void;onDragging:(value:boolean)=>void}){
  const e=model.extent,position:V3=camera==='top'?[0,e*1.6,0.001]:camera==='front'?[0,0.01,e*1.6]:camera==='right'?[e*1.6,0.01,0]:[e,e*0.8,e];
  const key=`${camera}-${orthographic}-${revision}`;
  return <SceneBoundary key={key}><Canvas key={key} orthographic={orthographic} camera={{position,fov:45,zoom:orthographic?35:1,near:0.05,far:500}} dpr={[1,1.5]} frameloop="demand" gl={{antialias:true,alpha:true,localClippingEnabled:true}} fallback={<p>WebGL is unavailable. Use the controls and mathematical readout below.</p>}>
    <ambientLight intensity={1.2}/><directionalLight position={[5,8,5]} intensity={2}/>
    <group rotation={[-Math.PI/2,0,0]}>
      <CoordinateFrame axes={axes} grid={grid}/>
      {model.segments.filter(segment=>construction||!segment.dashed).map((segment,i)=>segment.points.length>1?<Line key={`line-${i}`} points={segment.points} color={segment.color} lineWidth={2} dashed={segment.dashed} dashSize={0.12} gapSize={0.09}/>:null)}
      {model.arrows.map((arrow,i)=><Arrow key={`arrow-${i}`} {...arrow} label={model.markers.some(marker=>marker.label===arrow.label)?undefined:arrow.label}/>)}
      {model.planes.map((plane,i)=><PlanePatch key={`plane-${i}`} {...plane}/>)}
      {model.bodies.map((body,i)=><Body key={`body-${i}`} body={body} construction={construction}/>)}
      {model.boxes.map((box,i)=><mesh key={`box-${i}`} position={box.position}><boxGeometry args={box.size}/><meshStandardMaterial color={box.color} transparent opacity={box.opacity??0.65} depthWrite={false}/>{construction&&<Edges color={box.color}/>}</mesh>)}
      {model.patches.map((patch,i)=><SurfacePatch key={`patch-${i}`} patch={patch} profile={profile}/>)}
      {model.markers.map((marker,i)=><DraggablePoint key={`marker-${i}`} marker={marker} onMove={onMove} onDragging={onDragging}/>)}
      {model.net!==undefined&&<CubeNet fold={model.net}/>}
      {model.torus&&<mesh><torusGeometry args={[2,0.6,24,64]}/><meshStandardMaterial color="#2563eb" transparent opacity={0.65} depthWrite={false}/></mesh>}
    </group>
    <ViewportControls model={model} profile={profile} preset={camera} dragging={dragging}/>
  </Canvas></SceneBoundary>;
}
