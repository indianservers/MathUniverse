import {ruhiMotion} from './RuhiCinematicMotionEngine';
import {useEffect,useLayoutEffect,useRef,useSyncExternalStore} from 'react';
import type {VisualCommand} from '../../offline-intelligence/commands';
import {outlineVertices} from '../../offline-intelligence/commands';
import {compileFunctionExpression} from '../../utils/functionParser';
import {getMotionPreview,subscribeMotionPreview,registerMotionPreview} from './motionPreview';
type Screen=(x:number,y:number)=>{x:number;y:number};
const cache=new Map<string,ReturnType<typeof compileFunctionExpression>>();
function expressionFunction(expression:string){let fn=cache.get(expression);if(!fn){fn=compileFunctionExpression(expression);if(cache.size>128)cache.clear();cache.set(expression,fn);}return fn;}
export function CinematicSvgPreview({mode,toScreen,bounds}:{mode:'graph2d'|'geometry2d';toScreen:Screen;bounds:{xMin:number;xMax:number;yMin:number;yMax:number}}){
 const trail=useRef<VisualCommand[][]>([]);
 const frame=useSyncExternalStore(subscribeMotionPreview,()=>getMotionPreview(mode),()=>undefined),root=useRef<SVGGElement>(null);
 useEffect(()=>{if(frame&&ruhiMotion.trails&&frame.commands.length<20){trail.current=[...trail.current.slice(-4),frame.commands];}else trail.current=[];},[frame]);
 useEffect(()=>registerMotionPreview(mode),[mode]);
 useLayoutEffect(()=>{
  if(!frame)return;const svg=root.current?.ownerSVGElement;if(!svg)return;
  const ids=new Set(frame.commands.flatMap(c=>[c.objectId,...(c.roboNativeIds?.points??[]),c.roboNativeIds?.shape].filter(Boolean)));
  const hidden:SVGElement[]=[];
  for(const node of svg.querySelectorAll<SVGElement>('[data-motion-object],[data-object-id],[data-point-id],[data-ruhi-fill],[data-ruhi-angle]')){
   if(root.current?.contains(node))continue;const id=node.dataset.motionObject??node.dataset.objectId??node.dataset.pointId??node.dataset.ruhiFill??node.dataset.ruhiAngle??'';
   if([...ids].some(base=>id===base||id.startsWith(`${base}-`))){const element=node.hasAttribute('data-motion-object')?node:(node.closest('g')??node);if(!hidden.includes(element as SVGElement)){hidden.push(element as SVGElement);(element as SVGElement).style.visibility='hidden';}}
  }
  return()=>{for(const node of hidden)node.style.removeProperty('visibility');};
 },[frame]);
 return <g ref={root} data-ruhi-cinematic={mode} pointerEvents="none" style={{filter:ruhiMotion.glow?'drop-shadow(0 0 2px rgba(56,189,248,.5))':undefined}}>{frame&&ruhiMotion.trails&&trail.current.map((commands,i)=><g key={i} opacity={(i+1)/trail.current.length*.12}>{commands.map(c=><CinematicObject key={c.objectId} command={c} toScreen={toScreen} bounds={bounds} progress={1} creating={false} geometryMode={mode==='geometry2d'} ghost/>)}</g>)}{frame?.commands.map(c=><CinematicObject key={c.objectId} command={c} toScreen={toScreen} bounds={bounds} progress={frame.progress} creating={frame.creating.includes(c.objectId!)} geometryMode={mode==='geometry2d'} />)}</g>;
}
function CinematicObject({command:c,toScreen,bounds,progress,creating,ghost=false,geometryMode=false}:{command:VisualCommand;toScreen:Screen;bounds:{xMin:number;xMax:number;yMin:number;yMax:number};progress:number;creating:boolean;ghost?:boolean;geometryMode?:boolean}){
 if(c.roboVisible===false)return null;
 let points=outlineVertices(c),closed=!['line','ray','vector','plot','point'].includes(c.kind);
 if(c.kind==='plot'&&c.expression){const fn=expressionFunction(c.expression),count=240;points=Array.from({length:count+1},(_,i)=>{const x=bounds.xMin+(bounds.xMax-bounds.xMin)*i/count;return [x,fn(x)];});const angle=(c.rotation?.[2]??0)*Math.PI/180,s=c.scale??1,offset=c.points[0]??[0,0];points=points.map(([x,y])=>[offset[0]+s*(x*Math.cos(angle)-y*Math.sin(angle)),offset[1]+s*(x*Math.sin(angle)+y*Math.cos(angle))]);if(creating)points=points.slice(0,Math.max(2,Math.ceil(points.length*progress)));}
 if(['line','ray'].includes(c.kind)&&points.length>1&&(c.kind==='ray'||c.linearExtent!=='segment')){const [a,b]=points,dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);if(len>1e-10){const extent=4*Math.max(bounds.xMax-bounds.xMin,bounds.yMax-bounds.yMin)/len;points=c.kind==='ray'?[a,[a[0]+dx*extent,a[1]+dy*extent]]:[[a[0]-dx*extent,a[1]-dy*extent],[a[0]+dx*extent,a[1]+dy*extent]];}}
 const screen=points.map(p=>toScreen(p[0],p[1]));let d='',pen=false;for(const p of screen){if(!Number.isFinite(p.x)||!Number.isFinite(p.y)){pen=false;continue;}d+=`${pen?'L':'M'}${p.x},${p.y} `;pen=true;}if(closed)d+='Z';
 const position=toScreen(...((c.points[0]??[0,0]).slice(0,2) as [number,number]));
 const area=points.reduce((sum,p,i)=>{const q=points[(i+1)%points.length];return sum+p[0]*q[1]-p[1]*q[0];},0)/2;
 const measurement=closed&&c.kind!=='circle'?`area ≈ ${Math.abs(area).toFixed(3)}`:c.kind==='circle'?`r = ${Number((c.radius*(c.scale??1)).toFixed(3))}`:c.kind==='point'?`(${(c.points[0]??[0,0]).map(v=>Number(v.toFixed(3))).join(', ')})`:(c.kind==='vector'||c.kind==='line'&&c.linearExtent==='segment')&&points.length>1?`length = ${Math.hypot(...points[1].map((v,i)=>v-points[0][i])).toFixed(3)}`:'';
 return <g data-cinematic-object={c.objectId}>
 {c.kind==='point'?<><circle cx={position.x} cy={position.y} r={(geometryMode?9:7)+(creating?8*(1-progress):0)} fill={c.color} opacity={creating?progress:1}/>{creating&&<circle cx={position.x} cy={position.y} r={20*progress} stroke={c.color} fill="none" opacity={1-progress}/>}</>:<path d={d} fill={closed?(c.roboFillColor??(geometryMode?c.color:'none')):'none'} fillOpacity={geometryMode?.12:.25} stroke={c.roboStrokeColor??c.color} strokeWidth={c.roboLineWidth??(geometryMode?4:3)} strokeLinejoin="round" pathLength={1} strokeDasharray={creating?'1':undefined} strokeDashoffset={creating?1-progress:undefined}/>}
 {c.kind==='vector'&&screen.length>1&&(()=>{const a=screen[0],b=screen[1],angle=Math.atan2(b.y-a.y,b.x-a.x);return <path d={`M${b.x-12*Math.cos(angle-.4)},${b.y-12*Math.sin(angle-.4)} L${b.x},${b.y} L${b.x-12*Math.cos(angle+.4)},${b.y-12*Math.sin(angle+.4)}`} fill="none" stroke={c.color} strokeWidth={3}/>;})()}
 {c.roboAngle&&(()=>{const v=points[c.roboAngle.vertex],a=points[(c.roboAngle.vertex+1)%3],b=points[(c.roboAngle.vertex+2)%3];if(!v||!a||!b)return null;const start=Math.atan2(a[1]-v[1],a[0]-v[0]);let sweep=Math.atan2(b[1]-v[1],b[0]-v[0])-start;if(sweep>Math.PI)sweep-=2*Math.PI;if(sweep<-Math.PI)sweep+=2*Math.PI;const r=.2*Math.min(Math.hypot(a[0]-v[0],a[1]-v[1]),Math.hypot(b[0]-v[0],b[1]-v[1]));const arc=Array.from({length:25},(_,i)=>{const p=toScreen(v[0]+r*Math.cos(start+sweep*i/24),v[1]+r*Math.sin(start+sweep*i/24));return `${p.x},${p.y}`;}).join(' ');const label=toScreen(v[0]+r*1.3*Math.cos(start+sweep/2),v[1]+r*1.3*Math.sin(start+sweep/2));return <g><polyline points={arc} fill="none" stroke={c.roboAngle.arcColor??c.color} strokeWidth={c.roboAngle.lineWidth??3}/>{!ghost&&<text x={label.x} y={label.y} fill={c.roboAngle.arcColor??c.color} fontSize={11}>{(Math.abs(sweep)*180/Math.PI).toFixed(1)}°</text>}</g>;})()}
 {!ghost&&<text x={position.x+10} y={position.y-10} fill={c.color} fontSize={12}>{c.roboLabel??c.kind}{measurement?` · ${measurement}`:''}</text>}
 {!ghost&&(c.roboVertexLabels??[]).map((label,i)=>{const p=screen[i];return p?<text key={i} x={p.x+7} y={p.y-7} fill={c.color} fontSize={12}>{label}</text>:null;})}
 </g>;
}
