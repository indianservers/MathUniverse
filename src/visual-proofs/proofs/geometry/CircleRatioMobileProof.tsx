import { ArrowLeft, MoreVertical, Pause, Play, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./circle-ratio-mobile.css";

export default function CircleRatioMobileProof(){
  const navigate=useNavigate(); const [radius,setRadius]=useState(92); const [progress,setProgress]=useState(1); const [playing,setPlaying]=useState(false); const [menu,setMenu]=useState(false);
  useEffect(()=>{if(!playing)return;if(progress>=1){setPlaying(false);return}const t=window.setTimeout(()=>setProgress(v=>Math.min(1,v+.035)),35);return()=>clearTimeout(t)},[playing,progress]);
  const reset=()=>{setRadius(92);setProgress(1);setPlaying(false);setMenu(false)}; const circumference=2*Math.PI*radius,diameter=2*radius;
  const arcDash=circumference*(1-progress), stripWidth=285*progress;
  return <main className="ratio-mobile">
    <header><button onClick={()=>navigate(-1)} aria-label="Back to visual proofs"><ArrowLeft/></button><div><h1>Circle Circumference Ratio</h1><p><b>24</b> / 69</p></div><button onClick={()=>setMenu(v=>!v)} aria-label="Lesson options"><MoreVertical/></button></header>
    <section className="ratio-stage"><svg viewBox="0 0 390 690" aria-label={`Circle radius ${radius}, circumference divided by diameter equals ${(circumference/diameter).toFixed(4)}`}>
      <g transform="translate(195 160)"><circle className="wheel" r={radius}/>{Array.from({length:16},(_,i)=>{const a=i*Math.PI/8;return <line key={i} className="spoke" x1="0" y1="0" x2={Math.cos(a)*radius} y2={Math.sin(a)*radius}/>})}<circle className="hub" r="13"/><line className="radius" x1="0" y1="0" x2={radius*.7} y2={-radius*.7}/><circle className="radius-handle" cx={radius*.7} cy={-radius*.7} r="9"/><text className="r-label" x={radius*.35+14} y={-radius*.35-6}>r</text><circle className="unwrap-arc" r={radius} strokeDasharray={`${circumference-arcDash} ${arcDash}`}/></g>
      <path className="down-arrow" d="M195 260v32l-8-10m8 10 8-10"/>
      <g transform="translate(52 335)"><path className="strip" d={`M0 0 Q12 -18 24 0 ${Array.from({length:10},(_,i)=>`Q${36+i*26} -18 ${49+i*26} 0`).join(" ")} L${stripWidth} 43H0Z`}/><line className="diameter-line" x1="0" y1="65" x2={stripWidth} y2="65"/>{Array.from({length:7},(_,i)=><g key={i}><line className="diameter-tick" x1={i*47.5} y1="55" x2={i*47.5} y2="75"/>{i<6?<text x={i*47.5+23.75} y="95">d</text>:null}</g>)}</g>
      <g className="ratio-card" transform="translate(195 500)"><rect x="-155" y="-54" width="310" height="108" rx="15"/><text x="0" y="-10">C = {circumference.toFixed(1)}, d = {diameter}</text><text className="formula" x="0" y="28">C / d = π ≈ {(circumference/diameter).toFixed(4)}</text></g>
      <g className="gauge" transform="translate(195 620)"><path d="M-105 20A107 107 0 0 1 105 20"/><line x1="0" y1="20" x2="73" y2="-53"/><circle cy="20" r="12"/><text x="0" y="55">π diameters wrap once around</text></g>
    </svg></section>
    <nav className="ratio-controls"><button onClick={reset} aria-label="Reset circle ratio"><RotateCcw/></button><label><span>radius {radius}</span><input aria-label="Circle radius" type="range" min="65" max="112" value={radius} onChange={e=>setRadius(Number(e.target.value))}/></label><button className="play" onClick={()=>{if(!playing&&progress>=1)setProgress(0);setPlaying(v=>!v)}} aria-label={playing?"Pause circumference unwrapping":"Play circumference unwrapping"}>{playing?<Pause/>:<Play/>}</button></nav>
    {menu?<aside role="dialog"><button onClick={()=>setMenu(false)} aria-label="Close lesson options"><X/></button><h2>Every circle has the same ratio</h2><p>Straightening the circumference without stretching shows that it measures π diameters, so C/d = π and C = 2πr.</p></aside>:null}
  </main>
}
