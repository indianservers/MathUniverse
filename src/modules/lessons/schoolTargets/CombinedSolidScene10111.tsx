import{Html,Line,OrbitControls}from'@react-three/drei';import{useThree}from'@react-three/fiber';import{DoubleSide,MOUSE,TOUCH}from'three';import{csGeometry,csModel}from'./combinedSolidsModel';
export default function CombinedSolidScene10111({radius,height,slant,explode,grid,axes,dimensions,tool}:{radius:number;height:number;slant:number;explode:boolean;grid:boolean;axes:boolean;dimensions:boolean;tool:string}){const{size}=useThree(),g=csGeometry(radius,height,slant,explode,size.width/size.height),s=g.scale,ch=csModel(radius,height,slant).coneHeight,shift=-g.center*s;const label=(text:string,position:[number,number,number])=><Html center position={position} style={{pointerEvents:'none',whiteSpace:'nowrap',color:'#e7eefb',font:'italic 13px Georgia',textShadow:'0 1px 3px #000'}}>{text}</Html>;const guide=(points:[number,number,number][])=><Line points={points} color="#d4dbe8" lineWidth={1} dashed dashSize={.12} gapSize={.08}/>;
return <group>
 <group position={[shift,0,0]}>
 <mesh rotation={[0,0,-Math.PI/2]}><cylinderGeometry args={[radius*s,radius*s,height*s,64]}/><meshStandardMaterial color="#19c6cf" metalness={.18} roughness={.28}/></mesh>
 <mesh position={[g.left*s,0,0]} rotation={[0,0,Math.PI/2]}><sphereGeometry args={[radius*s,64,32,0,Math.PI*2,0,Math.PI/2]}/><meshStandardMaterial color="#f5b72d" metalness={.22} roughness={.28} side={DoubleSide}/></mesh>
 {explode&&<mesh position={[g.left*s,0,0]} rotation={[0,Math.PI/2,0]}><circleGeometry args={[radius*s,64]}/><meshStandardMaterial color="#f5b72d" side={DoubleSide}/></mesh>}
 <mesh position={[(g.right+ch/2)*s,0,0]} rotation={[0,0,-Math.PI/2]}><coneGeometry args={[radius*s,ch*s,64]}/><meshStandardMaterial color="#8e52dc" metalness={.2} roughness={.3}/></mesh>
 {dimensions&&<group>{guide([[-height*s/2,-radius*s-.35,0],[height*s/2,-radius*s-.35,0]])}{label(`h = ${height} cm`,[0,-radius*s-.58,0])}{guide([[(g.left-radius)*s-.25,0,0],[(g.left-radius)*s-.25,radius*s,0]])}{label(`r = ${radius} cm`,[(g.left-radius)*s-.45,radius*s/2,0])}{guide([[g.right*s,0,radius*s],[(g.right+ch)*s,0,0]])}{label(`l = ${slant} cm`,[(g.right+ch/2)*s,-radius*s-.5,0])}</group>}
 </group>
 {grid&&<gridHelper args={[18,24,'#1c566d','#0e283c']} position={[0,-radius*s-.2,0]}/>}{axes&&<axesHelper args={[3]}/>}
 <ambientLight intensity={.6}/><directionalLight position={[-3,6,7]} intensity={1.4}/><OrbitControls mouseButtons={{LEFT:tool==='pan'?MOUSE.PAN:tool==='zoom'?MOUSE.DOLLY:MOUSE.ROTATE,MIDDLE:MOUSE.DOLLY,RIGHT:MOUSE.PAN}} touches={{ONE:tool==='pan'?TOUCH.PAN:TOUCH.ROTATE,TWO:TOUCH.DOLLY_PAN}} enableRotate={tool==='rotate'} enablePan={tool==='pan'} enableZoom={tool==='zoom'} minDistance={5} maxDistance={20}/>
 </group>;
}
