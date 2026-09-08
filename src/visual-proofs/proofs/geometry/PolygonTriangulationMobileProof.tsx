import { ArrowLeft, MoreVertical, Pause, Play, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./polygon-triangulation-mobile.css";

type Point = {x:number;y:number};
const palette=["#ffd4c6","#ffe4a8","#d8f1f3","#e3e2f8","#d9efd7","#f6d8ec"];
function regularPoints(n:number):Point[]{return Array.from({length:n},(_,i)=>{const a=Math.PI+(i/n)*Math.PI*2;const wobble=i%2?1:.92;return{x:195+145*wobble*Math.cos(a),y:238+145*wobble*Math.sin(a)}})}

export default function PolygonTriangulationMobileProof(){
  const navigate=useNavigate(); const [n,setN]=useState(6); const [points,setPoints]=useState<Point[]>(()=>regularPoints(6)); const [drawn,setDrawn]=useState(3); const [playing,setPlaying]=useState(true); const [menuOpen,setMenuOpen]=useState(false); const svgRef=useRef<SVGSVGElement>(null); const drag=useRef<number|null>(null); const last=useRef<number|null>(null);
  useEffect(()=>{if(!playing)return;let frame=0;const tick=(time:number)=>{if(last.current===null)last.current=time;if(time-last.current>720){last.current=time;setDrawn(v=>{const next=v+1;return next>n-3?0:next})}frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick);return()=>{cancelAnimationFrame(frame);last.current=null}},[playing,n]);
  const choose=(value:number)=>{setN(value);setPoints(regularPoints(value));setDrawn(Math.max(0,value-3));setPlaying(false)};
  const reset=()=>{setN(6);setPoints(regularPoints(6));setDrawn(3);setPlaying(false);setMenuOpen(false)};
  const move=(event:ReactPointerEvent<SVGSVGElement>)=>{if(drag.current===null||!svgRef.current)return;const matrix=svgRef.current.getScreenCTM();if(!matrix)return;const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());setPoints(old=>old.map((point,i)=>i===drag.current?{x:Math.max(35,Math.min(355,p.x)),y:Math.max(65,Math.min(390,p.y))}:point))};
  const anchor=points[0];
  return <main className="polygon-mobile" aria-label="Polygon Triangulation interactive lesson">
    <header className="polygon-header"><button type="button" onClick={()=>navigate(-1)} aria-label="Back to visual proofs"><ArrowLeft/></button><div><h1>Polygon Triangulation</h1><p>7 / 69</p></div><button type="button" onClick={()=>setMenuOpen(v=>!v)} aria-expanded={menuOpen} aria-label="Lesson options"><MoreVertical/></button></header>
    <section className="polygon-stage" aria-label="Interactive polygon triangulation">
      <svg ref={svgRef} viewBox="0 0 390 610" onPointerMove={move} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null} role="img" aria-label={`${n} sided polygon divided into ${n-2} triangles`}>
        <defs><filter id="poly-shadow"><feDropShadow dx="1" dy="3" stdDeviation="3" floodOpacity=".11"/></filter></defs>
        <g filter="url(#poly-shadow)">{Array.from({length:n-2},(_,i)=>{const a=points[i+1],b=points[i+2];return <polygon key={i} points={`${anchor.x},${anchor.y} ${a.x},${a.y} ${b.x},${b.y}`} fill={palette[i%palette.length]} opacity=".78"/>})}<polygon points={points.map(p=>`${p.x},${p.y}`).join(" ")} fill="none" stroke="#26323b" strokeWidth="2.2" strokeLinejoin="round"/>{Array.from({length:Math.max(0,n-3)},(_,i)=>i+2).map((index,i)=><line key={index} x1={anchor.x} y1={anchor.y} x2={points[index].x} y2={points[index].y} stroke="#263b45" strokeWidth="1.5" strokeDasharray="6 5" opacity={i<drawn?1:.12}/>)}</g>
        {points.map((p,index)=><g key={index} className={index===0?"polygon-anchor":"polygon-point"}><circle cx={p.x} cy={p.y} r={index===0?16:9} fill="white" stroke={index===0?"#ff795f":"#26323b"} strokeWidth={index===0?1.5:2}/>{index===0?<circle cx={p.x} cy={p.y} r="8" fill="#ff795f"/>:null}<circle cx={p.x} cy={p.y} r="20" fill="transparent" role="slider" tabIndex={0} aria-label={index===0?"Triangulation anchor vertex":`Polygon vertex ${index+1}`} onPointerDown={e=>{drag.current=index;e.currentTarget.setPointerCapture(e.pointerId)}} onKeyDown={e=>{const d=e.shiftKey?8:3;if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key))return;e.preventDefault();setPoints(old=>old.map((q,j)=>j===index?{x:q.x+(e.key==="ArrowRight"?d:e.key==="ArrowLeft"?-d:0),y:q.y+(e.key==="ArrowDown"?d:e.key==="ArrowUp"?-d:0)}:q))}}/></g>)}
        <g className="polygon-count-box" transform="translate(195 442)"><rect x="-48" y="-22" width="96" height="44" rx="9"/><text x="0" y="5">n = {n}</text></g><g className="polygon-triangle-box" transform="translate(195 496)"><rect x="-72" y="-22" width="144" height="44" rx="9"/><text x="0" y="5">n − 2 = {n-2}</text></g>
        <g className="polygon-selector" transform="translate(195 561)"><circle r="39"/><path d="M-28-28A39 39 0 0 1 28-28"/>{Array.from({length:8},(_,i)=>{const value=i+3,a=Math.PI+(i/8)*Math.PI*2,x=35*Math.cos(a),y=35*Math.sin(a);return <g key={value} role="button" tabIndex={0} aria-label={`Use ${value} sides`} aria-pressed={n===value} onClick={()=>choose(value)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")choose(value)}}><circle cx={x} cy={y} r={n===value?8:5}/>{n===value?<circle cx={x} cy={y} r="3"/>:null}</g>})}</g>
      </svg>
    </section>
    <section className="polygon-controls" aria-label="Triangulation animation controls"><button type="button" onClick={()=>setPlaying(v=>!v)} aria-label={playing?"Pause diagonal animation":"Play diagonal animation"}>{playing?<Pause/>:<Play/>}</button><button type="button" onClick={reset} aria-label="Reset polygon"><RotateCcw/></button></section>
    {menuOpen?<section className="polygon-menu" role="dialog" aria-label="Lesson options"><button type="button" onClick={()=>setMenuOpen(false)} aria-label="Close lesson options"><X/></button><h2>Count triangles from one vertex</h2><p>Every diagonal starts at the coral anchor. An n-sided polygon splits into exactly n − 2 non-overlapping triangles.</p><p>Drag any vertex, choose 3–10 sides, and watch the triangle count stay invariant.</p></section>:null}
  </main>
}
