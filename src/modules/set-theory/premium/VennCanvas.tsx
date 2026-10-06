import { useId, useMemo, useRef, useState, type PointerEvent } from 'react';
import { Maximize2, RotateCcw, Scan, ZoomIn, ZoomOut } from 'lucide-react';
import { useStudioState } from '../../../studios/phase1/StudioModelProvider';
import { useSetTheoryStore } from '../setTheoryStore';
import { maskMatches, setText, type Expression } from './math';
import { Button } from './components';
export type Circle={id:'A'|'B'|'C';x:number;y:number;r:number};
export type Point={x:number;y:number};
export const defaultCircles:Circle[]=[{id:'A',x:265,y:200,r:143},{id:'B',x:435,y:200,r:143},{id:'C',x:350,y:323,r:143}];
const colors=['#189aff','#ef49d6','#00cba3'];
const inside=(p:Point,c:Circle)=>Math.hypot(p.x-c.x,p.y-c.y)<c.r;
const pointMask=(p:Point,c:Circle[])=>c.reduce((mask,circle,i)=>mask|(inside(p,circle)?1<<i:0),0);
export function layoutElements(u:string[],a:string[],b:string[],c:string[],circles:Circle[]):Record<string,Point>{
 const positioned:Record<string,Point>={},byMask:Record<number,string[]>={};u.forEach(item=>{const mask=(a.includes(item)?1:0)|(b.includes(item)?2:0)|(c.includes(item)?4:0);(byMask[mask]??=[]).push(item);});
 for(const [maskText,items] of Object.entries(byMask)){const mask=Number(maskText),candidates:Point[]=[];for(let y=55;y<465;y+=13)for(let x=50;x<675;x+=13)if(pointMask({x,y},circles)===mask)candidates.push({x,y});
  const preferred=mask?circles.filter((_,i)=>mask&(1<<i)).reduce((p,c,_,all)=>({x:p.x+c.x/all.length,y:p.y+c.y/all.length}),{x:0,y:0}):{x:85,y:425};
  candidates.sort((p,q)=>Math.hypot(p.x-preferred.x,p.y-preferred.y)-Math.hypot(q.x-preferred.x,q.y-preferred.y));
  items.forEach((item,i)=>{const chosen=candidates.find(p=>Object.values(positioned).every(q=>Math.hypot(p.x-q.x,p.y-q.y)>32));if(chosen)positioned[item]=chosen;else positioned[item]=candidates[Math.min(i*7,candidates.length-1)]??{x:42+i*35,y:470};});
 }return positioned;
}
export function VennCanvas({expression,names,compact=false,controller}:{expression:Expression;names:string[];compact?:boolean;controller?:(api:VennApi)=>React.ReactNode}){
 const store=useSetTheoryStore(),uid=useId().replace(/:/g,''),svgRef=useRef<SVGSVGElement>(null),fullRef=useRef<HTMLDivElement>(null);
 const [circles,setCircles]=useStudioState<Circle[]>('set-theory:premium:circles',defaultCircles),[zoom,setZoom]=useState(1),[dragging,setDragging]=useState(true),[boundary,setBoundary]=useState(true),[pulse,setPulse]=useState(0);
 const [positions,setPositions]=useState<Record<string,Point>|null>(null),drag=useRef<{kind:'circle'|'element';id:string;dx:number;dy:number}|null>(null);
 const automatic=useMemo(()=>layoutElements(store.universe,store.setA,store.setB,store.setC,circles),[store.universe,store.setA,store.setB,store.setC,circles]);
 const points=positions?Object.fromEntries(store.universe.map(item=>[item,positions[item]??automatic[item]])):automatic;
 const toPoint=(event:PointerEvent<SVGElement>)=>{const svg=svgRef.current,m=svg?.getScreenCTM();if(!svg||!m)return null;return new DOMPoint(event.clientX,event.clientY).matrixTransform(m.inverse());};
 const commitMembership=(nextCircles:Circle[],nextPoints:Record<string,Point>)=>{store.setSetA(store.universe.filter(x=>inside(nextPoints[x],nextCircles[0])));store.setSetB(store.universe.filter(x=>inside(nextPoints[x],nextCircles[1])));store.setSetC(store.universe.filter(x=>inside(nextPoints[x],nextCircles[2])));};
 const moveCircle=(id:string,x:number,y:number)=>{const next=circles.map(c=>c.id===id?{...c,x:boundary?Math.max(c.r+20,Math.min(700-c.r,x)):x,y:boundary?Math.max(c.r+20,Math.min(480-c.r,y)):y}:c);setPositions(points);setCircles(next);commitMembership(next,points);};
 const moveElement=(item:string,p:Point)=>{const next={...points,[item]:{x:boundary?Math.max(32,Math.min(688,p.x)):p.x,y:boundary?Math.max(35,Math.min(475,p.y)):p.y}};setPositions(next);commitMembership(circles,next);};
 const down=(kind:'circle'|'element',id:string,event:PointerEvent<SVGGElement>)=>{if(!dragging||compact)return;const p=toPoint(event);if(!p)return;event.stopPropagation();event.currentTarget.setPointerCapture(event.pointerId);const start=kind==='circle'?circles.find(c=>c.id===id)!:points[id];drag.current={kind,id,dx:p.x-start.x,dy:p.y-start.y};};
 const move=(event:PointerEvent<SVGGElement>)=>{if(!drag.current)return;const p=toPoint(event);if(!p)return;const d=drag.current;if(d.kind==='circle')moveCircle(d.id,p.x-d.dx,p.y-d.dy);else moveElement(d.id,{x:p.x-d.dx,y:p.y-d.dy});};
 const reset=()=>{setCircles(defaultCircles);setPositions(null);setZoom(1);};
 const preset=(name:string)=>{let next:Circle[]=defaultCircles.map(c=>({...c}));
  if(name==='disjoint')next=[{id:'A',x:140,y:160,r:100},{id:'B',x:380,y:160,r:100},{id:'C',x:590,y:340,r:100}];
  if(name==='subset')next=[{id:'A',x:280,y:230,r:85},{id:'B',x:280,y:230,r:185},{id:'C',x:580,y:320,r:105}];
  if(name==='equal')next=[{id:'A',x:280,y:230,r:150},{id:'B',x:280,y:230,r:150},{id:'C',x:560,y:300,r:105}];
  if(name==='triple overlap')next=[{id:'A',x:285,y:220,r:160},{id:'B',x:405,y:220,r:160},{id:'C',x:345,y:300,r:160}];
  setCircles(next);setPositions(null);
  const u=store.universe;
  if(name==='disjoint'){store.setSetA(u.filter((_,i)=>i%3===0));store.setSetB(u.filter((_,i)=>i%3===1));store.setSetC(u.filter((_,i)=>i%3===2));}
  else if(name==='equal'){store.setSetA(u.slice(0,Math.ceil(u.length/2)));store.setSetB(u.slice(0,Math.ceil(u.length/2)));store.setSetC(u.slice(Math.ceil(u.length/2)));}
  else if(name==='subset'){store.setSetA(u.slice(0,Math.floor(u.length/3)));store.setSetB(u.slice(0,Math.ceil(u.length*2/3)));store.setSetC(u.slice(Math.ceil(u.length*2/3)));}
  else {store.setSetA(u.filter((_,i)=>i%3!==2));store.setSetB(u.filter((_,i)=>i%3!==0));store.setSetC(u.filter((_,i)=>i%2===0));if(name==='triple overlap'&&u[0]){store.setSetA([...new Set([...u.filter((_,i)=>i%3!==2),u[0]])]);store.setSetB([...new Set([...u.filter((_,i)=>i%3!==0),u[0]])]);store.setSetC([...new Set([...u.filter((_,i)=>i%2===0),u[0]])]);}}
 };
 const api:VennApi={dragging,setDragging,boundary,setBoundary,reset,preset,pulse:()=>setPulse(x=>x+1),radius:circles[0].r,setRadius:r=>{const next=circles.map((c,i)=>i?c:{...c,r});setCircles(next);setPositions(points);commitMembership(next,points);}};
 return <><div ref={fullRef} className={`st-venn-frame ${compact?'compact':''}`}>
 {!compact?<div className="st-canvas-tools"><h2>Interactive Venn Diagram</h2><Button onClick={()=>setZoom(z=>Math.min(2,z+.15))}><ZoomIn size={15}/>Zoom In</Button><Button onClick={()=>setZoom(z=>Math.max(.6,z-.15))}><ZoomOut size={15}/>Zoom Out</Button><Button onClick={()=>{setZoom(1);setCircles(defaultCircles);setPositions(null);}}><Scan size={15}/>Fit</Button><Button onClick={reset}><RotateCcw size={15}/>Reset</Button><Button onClick={()=>{if(document.fullscreenElement)void document.exitFullscreen();else void fullRef.current?.requestFullscreen().catch(()=>{});}}><Maximize2 size={15}/>Fullscreen</Button></div>:null}
 <svg ref={svgRef} viewBox={`${360-360/zoom} ${250-250/zoom} ${720/zoom} ${500/zoom}`} className="st-venn-svg st-grid" role="img" aria-label="Live three-set Venn diagram">

 <rect x="20" y="20" width="680" height="460" rx="15" fill="#f5fbff" fillOpacity=".35" stroke="#c6deff"/>
 <text x="40" y="47" fontWeight="800" fontSize="15">U · {names[0]}</text>
 {circles.map((c,i)=><circle key={c.id} cx={c.x} cy={c.y} r={c.r} fill={colors[i]} fillOpacity=".24" stroke={colors[i]} strokeWidth="2"/>)}
 {/* Nested clips implement each Boolean atom exactly, including excluded circles. */}
 <defs>{circles.map(c=><clipPath id={`${uid}-clip-${c.id}`} key={c.id}><circle cx={c.x} cy={c.y} r={c.r}/></clipPath>)}{Array.from({length:8},(_,mask)=><mask key={mask} id={`${uid}-exclude-${mask}`}><rect x="20" y="20" width="680" height="460" fill="white"/>{circles.filter((_,i)=>!(mask&(1<<i))).map(c=><circle key={c.id} cx={c.x} cy={c.y} r={c.r} fill="black"/>)}</mask>)}</defs>
 {Array.from({length:8},(_,mask)=>{if(!maskMatches(expression,mask))return null;let node:React.ReactNode=<rect key={`pulse-${pulse}`} className={pulse?'st-pulse':''} x="20" y="20" width="680" height="460" fill="#865bff" fillOpacity=".18" mask={`url(#${uid}-exclude-${mask})`}/>;circles.forEach((c,i)=>{if(mask&(1<<i))node=<g clipPath={`url(#${uid}-clip-${c.id})`}>{node}</g>;});return <g key={mask} data-highlight-region={mask}>{node}</g>;})}
 {circles.map((c,i)=><g key={c.id} tabIndex={compact?-1:0} role="button" aria-label={`Move Set ${c.id}`} onPointerDown={e=>down('circle',c.id,e)} onPointerMove={move} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}} onKeyDown={e=>{if(!dragging)return;const d={ArrowLeft:[-8,0],ArrowRight:[8,0],ArrowUp:[0,-8],ArrowDown:[0,8]}[e.key];if(d){e.preventDefault();moveCircle(c.id,c.x+d[0],c.y+d[1]);}}} className="st-draggable"><circle cx={c.x} cy={c.y} r={c.r} fill="transparent" stroke="transparent" strokeWidth="12"/><text x={c.x+(i===0?-50:i===1?50:0)} y={c.y+(i===2?75:-50)} textAnchor="middle" fontSize="28" fontWeight="900">{c.id}</text><text x={c.x+(i===0?-50:i===1?50:0)} y={c.y+(i===2?95:-28)} textAnchor="middle" fontSize="12" fontWeight="700">{names[i+1]}</text></g>)}
 {store.universe.map(item=><g key={item} data-element={item} tabIndex={compact?-1:0} role="button" aria-label={`Move element ${item}`} onPointerDown={e=>down('element',item,e)} onPointerMove={move} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}} onKeyDown={e=>{const d={ArrowLeft:[-8,0],ArrowRight:[8,0],ArrowUp:[0,-8],ArrowDown:[0,8]}[e.key];if(d&&dragging){e.preventDefault();moveElement(item,{x:points[item].x+d[0],y:points[item].y+d[1]});}}} className="st-draggable"><circle cx={points[item].x} cy={points[item].y} r="15" fill="#ffc529" stroke="white" strokeWidth="3"/><text x={points[item].x} y={points[item].y+5} textAnchor="middle" fontSize="13" fontWeight="800" fill="#775600">{item}</text></g>)}
 </svg><p className="st-canvas-note">Outside all sets: {setText(store.universe.filter(x=>!store.setA.includes(x)&&!store.setB.includes(x)&&!store.setC.includes(x)))}{!compact?' · Dragging changes membership; use arrow keys as an alternative.':''}</p></div>{controller?.(api)}</>;
}
export type VennApi={dragging:boolean;setDragging:(v:boolean)=>void;boundary:boolean;setBoundary:(v:boolean)=>void;reset:()=>void;preset:(s:string)=>void;pulse:()=>void;radius:number;setRadius:(v:number)=>void};
